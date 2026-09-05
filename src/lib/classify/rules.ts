/*
  The phrase lists. Plan §5.5 step 3: "kept in rules.ts as data, not code".

  This file is the tuning surface. When a real venue reply reads wrong, the
  fix is a phrase here and a fixture in tests/fixtures/replies/, not a branch
  in provider.ts. Expect this list to grow after the first month of replies.

  Every phrase is matched case-insensitively against a single sentence, on
  word boundaries where the phrase starts and ends with a word character. A
  pattern with `...` matches up to four words in the gap ("would Friday work",
  "would the 21st work for you").
*/

export type Intent = 'confirm' | 'decline' | 'alternative'

export const PHRASES: Record<Intent, readonly string[]> = {
  confirm: [
    'confirm',
    'confirmed',
    'booked',
    "you're all set",
    'you are all set',
    'we can accommodate',
    'can accommodate',
    'works for us',
    'work for us',
    'works well',
    'works fine',
    'see you on',
    'see you then',
    'reserved',
    'we have you down',
    'have you down',
    'looking forward to hosting',
    'looking forward to seeing',
    'looking forward to welcoming',
    'pencilled you in',
    'penciled you in',
    'pencilled in',
    'penciled in',
    'happy to host',
    'would love to host',
    'that works',
    'that date works',
    'you are booked',
    "you're booked",
    'consider it booked',
    'hold that date',
    'held for you',
  ],
  decline: [
    'unable',
    'unfortunately',
    'cannot accommodate',
    "can't accommodate",
    'fully booked',
    'no availability',
    'not able to',
    'closed',
    "we don't offer",
    'we do not offer',
    'no longer',
    'not taking',
    'not accepting',
    'are booked up',
    'booked up',
    'booked out',
    'booked solid',
    'not available',
    'unavailable',
    'sold out',
    'at capacity',
    'too young',
    'minimum age',
    'no space',
    'no room',
    'regret',
    'will not be able',
    "won't be able",
    'cannot take',
    "can't take",
    'unable to take',
    'not possible',
    'do not run',
    "don't run",
    'discontinued',
  ],
  alternative: [
    'instead',
    'alternatively',
    'how about',
    'what about',
    'would ... work',
    'would ... suit',
    'we could offer',
    'could offer',
    'can offer',
    'we could do',
    'we do have',
    'available on',
    'availability on',
    'other dates',
    'other options',
    'the following dates',
    'following dates',
    'these dates',
    'either of',
    'any of the following',
    'we have openings',
    'we have an opening',
    'openings on',
    'free on',
    'is open',
    'are open',
    'is available',
    'are available',
  ],
}

/*
  Confirm phrases that are only half a yes on their own. "Booked" and
  "reserved" are said about lunch rooms and parking as often as about the
  visit; "that works" answers a question we cannot see. Each scores 0.5, so a
  sentence built on one of them alone never reaches the no-date confirmation
  — it needs one of the trip's own dates beside it, or a full-weight phrase.
*/
export const WEAK_CONFIRM: readonly string[] = [
  'booked',
  'reserved',
  'that works',
  'that date works',
  'works well',
  'works fine',
  'see you then',
  'happy to host',
  'would love to host',
]

/*
  Words that put a date in a sentence without offering it: "closed until
  March 1", "from October 12", "by the 30th". A date after one of these is
  a boundary, not a booking, and must not become a Move to button.
*/
export const NOT_AN_OFFER: readonly string[] = [
  'until',
  'till',
  'through',
  'before',
  'after',
  'by',
  'from',
  'since',
  'starting',
  'deadline',
  'reopen',
  'reopens',
  'reopening',
  'closed',
  'received',
  'sent',
  'of',
]

/*
  Clause breaks inside a sentence. "The 14th is full, but the 16th works for
  us" is a no and a yes, and scoring it whole would cancel them out. Each
  clause is scored on its own and keeps the sentence's position.
*/
export const CLAUSE_BREAKS = /\s*(?:,\s*but\s+|;\s*|\s+but\s+|\s+however,?\s+|\s+although\s+|\s+though\s+|\s+—\s+|\s+-\s+)/i

/*
  A negation within four words before a confirm phrase flips it to a decline:
  "cannot confirm", "we are not able to accommodate", "that does not work for
  us". Plan §5.5 step 3.
*/
export const NEGATIONS: readonly string[] = [
  'not',
  'no',
  'never',
  'cannot',
  "can't",
  "won't",
  "don't",
  "doesn't",
  "isn't",
  "aren't",
  'unable',
  "wouldn't",
  'neither',
  'nor',
]

export const NEGATION_WINDOW_WORDS = 4

/*
  Where a message stops being the venue's answer. Anything on or after one of
  these lines is ignored: a signature, a quoted reply, a mail client's
  attribution line. The body is already stripped by strip.ts, so this is a
  second net for the cases it left alone on purpose.
*/
export const SIGNATURE_LINES: readonly RegExp[] = [
  /^--\s*$/,
  /^—+\s*$/,
  /^_{3,}\s*$/,
  /^(best|kind|warm|many|all the best|best wishes)(\s+(regards|wishes))?,?\s*$/i,
  /^(regards|thanks|thank you|thanks again|cheers|sincerely|yours|take care|talk soon|warmly|respectfully)[,!.]?\s*$/i,
  /^thanks?\s+(so\s+much|a lot|again)[,!.]?\s*$/i,
  /^sent from my /i,
  /^on .+ wrote:\s*$/i,
  /^from:\s/i,
  /^>/,
]

/* ─── Matching ───────────────────────────────────────────────────────────── */

export type PhraseHit = {
  intent: Intent
  phrase: string
  index: number
  /* Of the matched text, which is longer than the phrase for `...` gaps. */
  length: number
  negated: boolean
}

const compiled = new Map<string, RegExp>()

function patternFor(phrase: string): RegExp {
  let re = compiled.get(phrase)
  if (re) return re

  const parts = phrase.split('...').map((p) =>
    p
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s+'),
  )
  const body = parts.join('(?:\\s+\\S+){1,4}\\s+')
  const lead = /^\w/.test(phrase) ? '\\b' : ''
  const tail = /\w$/.test(phrase) ? '\\b' : ''
  re = new RegExp(`${lead}${body}${tail}`, 'gi')
  compiled.set(phrase, re)
  return re
}

function negatedBefore(sentence: string, index: number): boolean {
  const before = sentence
    .slice(0, index)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-NEGATION_WINDOW_WORDS)
  return before.some((w) =>
    NEGATIONS.includes(w.replace(/^[^\w']+|[^\w']+$/g, '')),
  )
}

/* Every phrase that occurs in a sentence, with negation resolved. */
export function findPhrases(sentence: string): PhraseHit[] {
  const hits: PhraseHit[] = []
  for (const intent of Object.keys(PHRASES) as Intent[]) {
    for (const phrase of PHRASES[intent]) {
      const re = patternFor(phrase)
      re.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(sentence)) !== null) {
        hits.push({
          intent,
          phrase,
          index: m.index,
          length: m[0].length,
          negated: intent === 'confirm' && negatedBefore(sentence, m.index),
        })
        if (m[0].length === 0) re.lastIndex++
      }
    }
  }
  return hits
}

export type SentenceScore = {
  confirm: number
  decline: number
  alternative: number
  question: boolean
}

/*
  Score one sentence. Plan §5.5 step 3.

  Each phrase counts one, or a half for the weak confirms above. A negated
  confirm counts as a decline instead. A
  question mark halves the confirm score, because "Does Tuesday work for
  you?" is a venue asking, not agreeing.

  A phrase inside a longer one is only counted at the longest match, and
  across intents: "booked" is a confirm on its own, but inside "fully booked"
  it is part of a decline and must not also count as a yes.
*/
export function scoreSentence(sentence: string): SentenceScore {
  const hits = dedupe(findPhrases(sentence))
  const score: SentenceScore = {
    confirm: 0,
    decline: 0,
    alternative: 0,
    question: /\?\s*$/.test(sentence.trim()),
  }
  for (const h of hits) {
    if (h.intent === 'confirm') {
      const weight = WEAK_CONFIRM.includes(h.phrase) ? 0.5 : 1
      if (h.negated) score.decline += weight
      else score.confirm += weight
    } else {
      score[h.intent] += 1
    }
  }
  if (score.question) score.confirm = score.confirm / 2
  return score
}

/* Keep the longest match at any position; drop the shorter ones inside it. */
function dedupe(hits: PhraseHit[]): PhraseHit[] {
  const sorted = [...hits].sort((a, b) => b.length - a.length)
  const kept: PhraseHit[] = []
  for (const h of sorted) {
    const inside = kept.some(
      (k) => h.index >= k.index && h.index + h.length <= k.index + k.length,
    )
    if (!inside) kept.push(h)
  }
  return kept
}
