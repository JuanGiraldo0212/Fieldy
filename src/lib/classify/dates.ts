import * as chrono from 'chrono-node'
import { CLAUSE_BREAKS, NOT_AN_OFFER, SIGNATURE_LINES } from './rules'

/*
  Sentences and the dates in them. Plan §5.5 steps 1 and 2.

  Everything here is deterministic and offline. chrono-node does the reading
  of "Fri 16 Oct", "the 21st", "next Tuesday" and "9:30am"; this file decides
  which of those mentions are worth keeping — a real day, in the future, in a
  sentence the venue actually wrote rather than one they quoted back at us.
*/

export const TIMEZONE = 'America/Vancouver'

/* Only dates this far ahead of the message count. Plan §5.5 step 2. */
export const MIN_DAYS_AHEAD = 1
export const MAX_DAYS_AHEAD = 365
const ROLLED_FORWARD_DAYS = 330

export type Sentence = {
  /* The clause that is scored. */
  text: string
  /* The whole sentence it came from, which is what the banner quotes: a
     director checking our reading wants the venue's full sentence, not the
     half of it that scored. */
  full: string
  /* Position in the answer, so "adjacent" has a meaning. Two clauses of one
     sentence share it. */
  index: number
}

/*
  Step 1: the venue's own words, one sentence at a time. Anything from a
  signature marker or a quoted line onward is dropped — a date in our own
  quoted request is not the venue offering it.
*/
export function splitSentences(body: string): Sentence[] {
  const lines = body.replace(/\r\n?/g, '\n').split('\n')
  const kept: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (SIGNATURE_LINES.some((re) => re.test(trimmed))) break
    kept.push(trimmed)
  }

  const out: Sentence[] = []
  /* A paragraph break is a sentence break too, whether or not there was a
     full stop. Then split on terminal punctuation followed by whitespace.
     Abbreviated weekday and month names ("Tue.", "Oct.") are not breaks. */
  let index = 0
  for (const para of kept.join('\n').split(/\n\s*\n|\n/)) {
    const pieces = para
      .split(SENTENCE_BREAK)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    for (const p of pieces) {
      /* "The 14th is full, but the 16th works" is two things. Each clause is
         scored alone; both keep the sentence's index so adjacency still
         means the sentence before or after. */
      const clauses = p
        .split(CLAUSE_BREAKS)
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
      for (const c of clauses) out.push({ text: c, full: p, index })
      index++
    }
  }
  return out
}

/* Terminal punctuation, then whitespace, then something that starts a
   sentence — unless the full stop belongs to an abbreviation. */
const SENTENCE_BREAK =
  /(?<=[.!?])(?<!\b(?:Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri|Sat|Sun|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Mr|Mrs|Ms|Dr|St|vs|approx|e\.g|i\.e)\.)\s+(?=[A-Z0-9"“(])/

export type DateMention = {
  /* ISO YYYY-MM-DD, resolved forward from the reference date. */
  date: string
  /* The words that produced it, for tests and for choosing evidence. */
  text: string
  /* True when the venue named a day ("the 16th", "Oct 16", "Friday");
     false for a time on its own ("at 9:30"), which is not an offered date. */
  hasDay: boolean
  /* Only the weekday was written, so the date is our forward guess and a
     trip option on the same weekday is what they meant. */
  weekdayOnly: boolean
  /* HH:MM, 24-hour, when the same mention carried a time. */
  time: string | null
  /* "closed until March 1": a boundary the venue named, not a date it
     offered. Never a Move to button. */
  boundary: boolean
}

/*
  Step 2: the dates in one sentence.

  Parsed per sentence, not per body — chrono is happy to read "at 9:30am.
  Tuesday" as one mention across a full stop, and that joins a time from one
  sentence to a day from the next.
*/
export function extractDates(sentence: string, reference: Date): DateMention[] {
  const results = chrono.en.casual.parse(
    sentence,
    { instant: reference, timezone: TIMEZONE },
    { forwardDate: true },
  )

  const refIso = isoInZone(reference)
  const out: DateMention[] = []
  const covered: [number, number][] = []
  /* Bare weekdays chrono read, by position, so "Tuesday the 20th" below can
     take the weekday back from it. */
  const weekdaySpans: [number, number, number][] = []
  for (const r of results) {
    const c = r.start
    /* chrono calls "next week" a certain day. It is not one the venue named,
       so a day only counts when the words hold a number, a weekday or a
       month. */
    const named = NAMES_A_DAY.test(r.text)
    const hasDay = named && (c.isCertain('day') || c.isCertain('weekday'))
    const weekdayOnly = hasDay && c.isCertain('weekday') && !c.isCertain('day')
    /* "ten minutes early" is a certain hour to chrono. A time is only a
       time here when it is written like one. */
    const hasTime = c.isCertain('hour') && LOOKS_LIKE_A_CLOCK.test(r.text)
    if (!hasDay && !hasTime) continue
    covered.push([r.index, r.index + r.text.length])
    if (weekdayOnly) weekdaySpans.push([r.index, r.index + r.text.length, out.length])

    const iso = `${c.get('year')}-${pad(c.get('month'))}-${pad(c.get('day'))}`
    const ahead = daysBetween(refIso, iso)
    if (hasDay && (ahead < MIN_DAYS_AHEAD || ahead > MAX_DAYS_AHEAD)) continue
    /* "Sep 22" written the day after Sep 22: forwardDate rolls it a whole
       year on. A date with no year that lands eleven months out is a past
       date, not a booking for next autumn. */
    if (hasDay && !c.isCertain('year') && ahead > ROLLED_FORWARD_DAYS) continue

    const time = hasTime ? `${pad(c.get('hour'))}:${pad(c.get('minute') ?? 0)}` : null
    const boundary = isBoundary(sentence, r.index)

    out.push({ date: iso, text: r.text, hasDay, weekdayOnly, time, boundary })

    /* "Oct 16 or 17" and "16–18 October" come back as a range. The end is a
       date the venue offered too. */
    if (r.end && (r.end.isCertain('day') || r.end.isCertain('weekday'))) {
      const e = r.end
      const endIso = `${e.get('year')}-${pad(e.get('month'))}-${pad(e.get('day'))}`
      const endAhead = daysBetween(refIso, endIso)
      if (
        endIso !== iso &&
        endAhead >= MIN_DAYS_AHEAD &&
        endAhead <= MAX_DAYS_AHEAD
      ) {
        out.push({
          date: endIso,
          text: r.text,
          hasDay: true,
          weekdayOnly: e.isCertain('weekday') && !e.isCertain('day'),
          time: e.isCertain('hour')
            ? `${pad(e.get('hour'))}:${pad(e.get('minute') ?? 0)}`
            : null,
          boundary,
        })
      }
    }

    /* "Oct 20 or 21", "October 27, 29": a bare number after a dated mention
       is another day in the same month. chrono stops at the first. */
    if (hasDay && !weekdayOnly && c.isCertain('month')) {
      const rest = sentence.slice(r.index + r.text.length)
      const more = rest.match(/^(?:\s*(?:,|or|and|\/)\s*(\d{1,2})(?:st|nd|rd|th)?\b(?!\s*(?:am|pm|:|\d)))+/i)
      if (more) {
        for (const n of more[0].matchAll(/(\d{1,2})/g)) {
          const day = Number(n[1])
          const extra = `${c.get('year')}-${pad(c.get('month'))}-${pad(day)}`
          const extraAhead = daysBetween(refIso, extra)
          if (
            day >= 1 &&
            day <= 31 &&
            extraAhead >= MIN_DAYS_AHEAD &&
            extraAhead <= MAX_DAYS_AHEAD
          ) {
            out.push({ date: extra, text: `${r.text}${more[0]}`, hasDay: true, weekdayOnly: false, time: null, boundary })
          }
        }
        covered.push([r.index, r.index + r.text.length + more[0].length])
      }
    }
  }

  /*
    "The 15th is free", "Tuesday the 20th", "on the 22nd". chrono reads none
    of these without a month, and venues write them constantly. The next
    such day-of-month after the reference is meant; when a weekday is named
    beside it, the first month where they agree.
  */
  const drop = new Set<number>()
  for (const m of sentence.matchAll(/\b(?:(mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?(?:the\s+)?(\d{1,2})(st|nd|rd|th)\b/gi)) {
    const at = m.index ?? 0
    const numberAt = at + m[0].length - m[2]!.length - m[3]!.length
    if (covered.some(([a, b]) => numberAt >= a && numberAt < b)) continue
    /* The weekday belongs to this mention now, not to chrono's guess at
       which Tuesday. */
    for (const [a, b, i] of weekdaySpans) {
      if (a >= at && b <= at + m[0].length) drop.add(i)
    }
    const day = Number(m[2])
    if (day < 1 || day > 31) continue
    const weekday = m[1] ? WEEKDAYS.indexOf(m[1].toLowerCase()) : -1
    const iso = nextDayOfMonth(refIso, day, weekday)
    if (!iso) continue
    out.push({
      date: iso,
      text: m[0],
      hasDay: true,
      weekdayOnly: false,
      time: null,
      boundary: isBoundary(sentence, at),
    })
  }

  return out.filter((_, i) => !drop.has(i))
}

const LOOKS_LIKE_A_CLOCK = /\d\s*(?::|am|pm|a\.m|p\.m|o'clock)|\b(noon|midday|midnight)\b/i

const NAMES_A_DAY =
  /\d|\b(mon|tue|wed|thu|fri|sat|sun|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/* The first date after the reference falling on `day` of some month — and,
   when a weekday was written with it, on that weekday too. Up to a year out;
   a "Tuesday the 31st" that never happens is dropped. */
function nextDayOfMonth(refIso: string, day: number, weekday: number): string | null {
  let y = Number(refIso.slice(0, 4))
  let m = Number(refIso.slice(5, 7))
  for (let i = 0; i < 13; i++) {
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
    if (day <= daysInMonth) {
      const iso = `${y}-${pad(m)}-${pad(day)}`
      const ahead = daysBetween(refIso, iso)
      if (ahead >= MIN_DAYS_AHEAD && ahead <= MAX_DAYS_AHEAD) {
        if (weekday === -1 || weekdayOf(iso) === weekday) return iso
      }
    }
    m++
    if (m > 12) {
      m = 1
      y++
    }
  }
  return null
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/* The word or two before a mention decides whether it was offered. "from
   October 12", "until the spring", "by the 30th" are boundaries. */
function isBoundary(sentence: string, index: number): boolean {
  const before = sentence
    .slice(0, index)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w.replace(/^[^\w']+|[^\w']+$/g, ''))
  return before.some((w) => NOT_AN_OFFER.includes(w))
}

function pad(n: number | null | undefined): string {
  return String(n ?? 0).padStart(2, '0')
}

/* The calendar date at the reference instant, in the venue's time zone. A
   reply received at 11pm Pacific is still "today" there, whatever UTC says. */
export function isoInZone(at: Date, timeZone = TIMEZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.UTC(
    Number(fromIso.slice(0, 4)),
    Number(fromIso.slice(5, 7)) - 1,
    Number(fromIso.slice(8, 10)),
  )
  const b = Date.UTC(
    Number(toIso.slice(0, 4)),
    Number(toIso.slice(5, 7)) - 1,
    Number(toIso.slice(8, 10)),
  )
  return Math.round((b - a) / 86_400_000)
}

export function weekdayOf(iso: string): number {
  return new Date(`${iso}T12:00:00Z`).getUTCDay()
}

/* "09:30" → "9:30 am", the way the design writes a time in the banner. */
export function formatTime(hhmm: string): string {
  const m = hhmm.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return hhmm
  const h = Number(m[1])
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m[2] === '00' ? `${hour} ${suffix}` : `${hour}:${m[2]} ${suffix}`
}
