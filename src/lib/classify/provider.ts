import {
  SUGGESTION_CONFIDENCE_FLOOR,
  type DateOption,
  type Suggestion,
} from '@/lib/schemas'
import {
  extractDates,
  splitSentences,
  weekdayOf,
  type DateMention,
  type Sentence,
} from './dates'
import { scoreSentence, type SentenceScore } from './rules'

/*
  The suggestion classifier. Plan §5.5.

  Reads a venue's reply and says what it seems to mean: confirmed, proposed
  other dates, declined, or unclear. Rule based, deterministic, no network,
  and never acting on its own — it writes `message.suggestion`, and only the
  director's tap on the banner changes anything about the trip.

  That last point sets the tuning direction. A wrong `unclear` costs the
  director one read of a message she was going to read anyway. A wrong
  `confirmed` puts a "Mark confirmed" button under a reply that said no, and
  she may well tap it. So every rule below leans towards unclear when the
  signals do not agree, and the eval target (plan M5) is zero false
  confirmations before it is ninety percent recall.
*/

export type ClassifyInput = {
  /* The stripped body — the venue's words, not our quoted request. */
  body: string
  dateOptions: DateOption[]
  /* The reference date for "Tuesday" and "the 16th". */
  sentAt: Date
}

/*
  The seam. `null` means no banner and nothing stored; a Suggestion is stored
  as it is, `unclear` included, so a reading that showed nothing is still
  auditable later.
*/
export type SuggestionProvider = (input: ClassifyInput) => Suggestion | null

/* Plan §5.5 step 5. */
export const CONFIDENCE = {
  withDate: 0.9,
  withoutDate: 0.75,
  conflict: 0.5,
} as const

const EVIDENCE_WORDS = 30

type Scored = {
  sentence: Sentence
  score: SentenceScore
  dates: DateMention[]
  /* Dates in this sentence that are one of the trip's options. */
  matched: string[]
  /* Dates in this sentence that are not. */
  offered: string[]
}

export const classify: SuggestionProvider = ({ body, dateOptions, sentAt }) => {
  const sentences = splitSentences(body)
  if (sentences.length === 0) return null

  const options = dateOptions.map((d) => d.date)
  const scored: Scored[] = sentences.map((sentence) => {
    const dates = extractDates(sentence.text, sentAt)
    const matched: string[] = []
    const offered: string[] = []
    for (const d of dates) {
      if (!d.hasDay) continue
      const hit = matchOption(d, options)
      if (hit) push(matched, hit)
      /* A bare weekday that is not one of ours is chrono's guess at which
         week, not the venue's offer; a boundary date was never an offer. */
      else if (!d.weekdayOnly && !d.boundary) push(offered, d.date)
    }
    return { sentence, score: scoreSentence(sentence.text), dates, matched, offered }
  })

  const confirmBest = best(scored, (s) => s.score.confirm)
  const declineBest = best(scored, (s) => s.score.decline)
  const altBest = best(scored, (s) => s.score.alternative)
  const confirm = confirmBest?.score.confirm ?? 0
  const decline = declineBest?.score.decline ?? 0
  const alternative = altBest?.score.alternative ?? 0

  const offeredAll = uniq(scored.flatMap((s) => s.offered))

  /* Nothing to go on at all: no phrase, no date. No banner, nothing stored. */
  if (confirm === 0 && decline === 0 && alternative === 0 && offeredAll.length === 0) {
    const anyMatched = scored.some((s) => s.matched.length > 0)
    if (!anyMatched) return null
  }

  const confirmWins = confirm > 0 && confirm > decline
  const declineWins = decline > 0 && decline > confirm
  const conflict = confirm > 0 && decline > 0 && confirm === decline

  /*
    Step 4, first rule: a confirm clause that contains, or is adjacent to,
    one of the trip's own dates, and is not itself negated or hedged. This
    outranks a decline elsewhere in the message on purpose — "The 14th is
    full, but the 16th works for us" is a yes to the 16th — but the
    confidence drops to say the message was mixed.
  */
  const dated = scored
    .filter((s) => s.score.confirm > 0 && s.score.decline === 0)
    .map((s) => ({ s, near: withMatchedDate(scored, s) }))
    .filter((x): x is { s: Scored; near: Scored } => x.near !== null)
    .sort((a, b) => b.s.score.confirm - a.s.score.confirm)[0]
  if (dated && (confirmWins || dated.s.score.confirm >= 1)) {
    return finish({
      intent: 'confirmed',
      dates: [dated.near.matched[0]!],
      time: timeNear(scored, dated.s),
      evidence: dated.s.sentence.full,
      confidence: decline > 0 ? CONFIDENCE.withoutDate : CONFIDENCE.withDate,
    })
  }

  /*
    Any date the venue named that is not one of ours is an offer, whatever
    else the sentence said. "We could do the 21st" and "the 14th is taken but
    the 21st is free" both land here. Stronger when an alternative phrase or
    a decline says the original dates are off the table.
  */
  if (offeredAll.length > 0) {
    const evidenceFrom =
      altBest && alternative > 0
        ? altBest
        : (scored.find((s) => s.offered.length > 0) ?? scored[0]!)
    return finish({
      intent: 'proposed_dates',
      dates: offeredAll,
      time: null,
      evidence: evidenceFrom.sentence.full,
      confidence:
        alternative > 0 || declineWins ? CONFIDENCE.withDate : CONFIDENCE.withoutDate,
    })
  }

  if (conflict) {
    return finish({
      intent: 'unclear',
      dates: null,
      time: null,
      evidence: (confirmBest ?? scored[0]!).sentence.full,
      confidence: CONFIDENCE.conflict,
    })
  }

  /*
    A confirm with no date at all: the banner offers the first option. Only
    on a full-weight phrase — "we have you down", "you're all set" — never on
    "booked" or "that works" alone, which are said about lunch rooms and
    parking as often as about the visit.
  */
  if (confirmWins && confirmBest) {
    return finish({
      intent: 'confirmed',
      dates: null,
      time: timeNear(scored, confirmBest),
      evidence: confirmBest.sentence.full,
      confidence: confirm >= 1 ? CONFIDENCE.withoutDate : CONFIDENCE.conflict,
    })
  }

  if (declineWins && declineBest) {
    return finish({
      intent: 'declined',
      dates: null,
      time: null,
      evidence: declineBest.sentence.full,
      confidence: CONFIDENCE.withoutDate,
    })
  }

  /*
    An alternative phrase with no concrete date ("we could do the following
    week instead") is a proposal we cannot put a button on. Unclear, and the
    message sits in the thread with the compose box under it.
  */
  return finish({
    intent: 'unclear',
    dates: null,
    time: null,
    evidence: (altBest ?? scored[0]!).sentence.full,
    confidence: CONFIDENCE.conflict,
  })
}

/* ─── Pieces ─────────────────────────────────────────────────────────────── */

function finish(s: Omit<Suggestion, 'dismissed_at'>): Suggestion {
  /* Step 5: below the floor, force unclear. Keeps the evidence, so the
     reading is still auditable. */
  const intent =
    s.confidence != null && s.confidence < SUGGESTION_CONFIDENCE_FLOOR
      ? 'unclear'
      : s.intent
  return {
    ...s,
    intent,
    dates: intent === 'unclear' ? null : s.dates,
    time: intent === 'unclear' ? null : s.time,
    evidence: trimWords(s.evidence, EVIDENCE_WORDS),
    dismissed_at: null,
  }
}

/*
  Whether a mention is one of the trip's own dates. An exact day is exact. A
  bare weekday ("Tuesday works") is the venue naming our date by its day, so
  it matches the first-ranked option on that weekday — chrono's forward guess
  of which Tuesday is not the venue's, and must not become an offer.
*/
function matchOption(d: DateMention, options: string[]): string | null {
  if (options.includes(d.date)) return d.date
  if (d.weekdayOnly) {
    const wd = weekdayOf(d.date)
    return options.find((o) => weekdayOf(o) === wd) ?? null
  }
  return null
}

function withMatchedDate(all: Scored[], s: Scored): Scored | null {
  if (s.matched.length > 0) return s
  const i = s.sentence.index
  /* Clauses of one sentence share its index, so "beside" is by index, not
     by position in the array. The same sentence's other clauses count too. */
  for (const delta of [0, 1, -1]) {
    const hit = all.find((x) => x.sentence.index === i + delta && x.matched.length > 0)
    if (hit) return hit
  }
  return null
}

/* The time in the confirm sentence, or the one beside it. Step 4: "time if
   found in the same sentence" — the neighbour is allowed because "See you on
   the 14th. Doors open at 9:30." is one thought. */
function timeNear(all: Scored[], s: Scored): string | null {
  const i = s.sentence.index
  for (const delta of [0, 1, -1]) {
    for (const n of all.filter((x) => x.sentence.index === i + delta)) {
      const t = n.dates.find((d) => d.time)?.time
      if (t) return t
    }
  }
  return null
}

function best(all: Scored[], by: (s: Scored) => number): Scored | null {
  let top: Scored | null = null
  for (const s of all) {
    if (by(s) > 0 && (top === null || by(s) > by(top))) top = s
  }
  return top
}

function push(list: string[], v: string): void {
  if (!list.includes(v)) list.push(v)
}

function uniq(list: string[]): string[] {
  return [...new Set(list)].sort()
}

export function trimWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= max) return words.join(' ')
  return `${words.slice(0, max).join(' ')}…`
}
