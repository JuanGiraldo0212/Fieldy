import type { Ask, DateOption, RoomSnapshot } from '@/lib/schemas'
import type { Fact } from '@/lib/catalog/program'

/*
  The questions that go out with a request, and the message they go out in.
  Spec §5.3 steps 3 and 4.

  The rule the whole screen turns on: the chips pre-selected are the facts the
  venue does not publish. An unknown on the outing page is not a dead end, it
  is the next step, and this is where it becomes one.
*/

/* ─── Ask topics ─────────────────────────────────────────────────────────── */

/*
  A question for each practical fact we show. A fact with no question here is
  never offered as an ask: "Nearby park" is worth knowing and not worth
  spending a venue's goodwill on.
*/
const FACT_QUESTIONS: Record<string, string> = {
  Washrooms: 'Where are the closest washrooms to the program space?',
  'Lunch space': 'Is there space we can use for lunch?',
  'Rain backup': 'Is there indoor space if the weather turns?',
  Strollers: 'Is the space stroller accessible?',
  'Wheelchair access': 'Is the space wheelchair accessible?',
  'Bus parking': 'Where can a school bus park or drop off?',
}

/* Offered to everyone, in this order, minus anything already covered by a gap
   chip above so the same question is never on screen twice. */
const GENERIC_TOPICS: { key: string; label: string; question: string }[] = [
  { key: 'lunch', label: 'Lunch space', question: FACT_QUESTIONS['Lunch space']! },
  { key: 'washrooms', label: 'Washrooms', question: FACT_QUESTIONS.Washrooms! },
  { key: 'bus', label: 'Bus parking', question: FACT_QUESTIONS['Bus parking']! },
  {
    key: 'access',
    label: 'Accessibility',
    question: 'Is the space stroller and wheelchair accessible?',
  },
  { key: 'indoor', label: 'Rain backup', question: FACT_QUESTIONS['Rain backup']! },
]

export type AskTopic = Ask & {
  /* Which fact tile it came from, for the icon. Generic topics reuse the same
     keys, so one icon map serves both. */
  factKey: string | null
  /* Pre-selected. True for everything the venue does not publish. */
  gap: boolean
}

export function askTopics({
  facts,
  conflicts,
  extraFeesNote,
}: {
  facts: Fact[]
  /* The venue column's own shape: `note` is optional, and a conflict with
     nothing written down is not renderable and not askable. */
  conflicts: { note?: string | null }[] | null
  extraFeesNote: string | null
}): AskTopic[] {
  const out: AskTopic[] = []

  for (const f of facts) {
    if (f.known) continue
    const question = FACT_QUESTIONS[f.label]
    if (!question) continue
    out.push({
      key: `fact:${f.label}`,
      label: f.label,
      question,
      source: 'gap',
      factKey: f.key,
      gap: true,
    })
  }

  /*
    A conflict is a gap of a different kind: we have two answers and no way to
    choose. Asking is the only honest resolution, so it is pre-selected too.
    The chip says what it is about in her words, not ours.
  */
  if (conflicts?.some((c) => c.note?.trim())) {
    out.push({
      key: 'conflict',
      label: 'Two answers on the site',
      question:
        'Two pages on your site say different things about this visit. Could you confirm which is right?',
      source: 'conflict',
      factKey: 'conflict',
      gap: true,
    })
  }

  if (extraFeesNote?.trim()) {
    out.push({
      key: 'fees',
      label: 'Total cost',
      question:
        'Could you confirm the full total, including tax and anything charged on the day?',
      source: 'conflict',
      factKey: 'fees',
      gap: true,
    })
  }

  const taken = new Set(out.map((o) => o.label.toLowerCase()))
  for (const t of GENERIC_TOPICS) {
    if (taken.has(t.label.toLowerCase())) continue
    out.push({ ...t, source: 'generic', factKey: t.key, gap: false })
  }

  return out
}

export function askIntro(topics: AskTopic[], venueName: string): string {
  const gaps = topics.filter((t) => t.gap).length
  if (gaps === 0) {
    return `${venueName} publishes everything we normally ask about. Add anything else you need.`
  }
  return `We picked the ${gaps} ${gaps === 1 ? 'thing' : 'things'} ${venueName} does not publish. These go in your message.`
}

/* ─── Dates ──────────────────────────────────────────────────────────────── */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* Midday UTC, for the same reason shiftDate uses it: a plain date must not
   drift a day because the browser is west of Greenwich. */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

export function longDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function ordinalLabel(rank: number): string {
  if (rank === 1) return '1st choice'
  if (rank === 2) return '2nd choice'
  if (rank === 3) return '3rd choice'
  return `${rank}th choice`
}

const SLOT_WORD: Record<DateOption['slot'], string> = {
  morning: 'morning',
  afternoon: 'afternoon',
  either: 'any time that day',
}

/* ─── Lead time ──────────────────────────────────────────────────────────── */

/*
  Whether the first choice gives the venue as much notice as it asks for.
  Never a block: a venue that publishes three weeks will often say yes to ten
  days, and a director who is told "no" by us never gets to find out.
*/
export function leadWarning({
  firstDate,
  today,
  leadTimeDays,
  venueName,
}: {
  firstDate: string | null
  today: string
  leadTimeDays: number | null
  venueName: string
}): string | null {
  if (!firstDate || leadTimeDays == null) return null
  const days = Math.round(
    (new Date(`${firstDate}T12:00:00Z`).getTime() -
      new Date(`${today}T12:00:00Z`).getTime()) /
      86_400_000,
  )
  if (days >= leadTimeDays) {
    return `${venueName} asks for ${leadTimeDays} days notice. You have ${days}.`
  }
  return `Tight: ${venueName} asks for ${leadTimeDays} days and ${shortDate(firstDate)} is ${days} ${days === 1 ? 'day' : 'days'} away. Worth asking anyway.`
}

/* ─── The message ────────────────────────────────────────────────────────── */

function listOf(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

/*
  The prefilled request. Editable on the screen, so this is a starting point
  rather than the final word, but it is what most people will send: it has to
  read like a person wrote it. No em dashes, no field names, no filler.
*/
export function composeRequest({
  venueName,
  programName,
  rooms,
  childrenCount,
  adultsCount,
  dates,
  asks,
  senderName,
  centreName,
}: {
  venueName: string
  programName: string
  rooms: RoomSnapshot[]
  childrenCount: number
  adultsCount: number
  dates: DateOption[]
  asks: Ask[]
  senderName: string
  centreName: string
}): string {
  const who =
    rooms.length > 0
      ? `our ${listOf(rooms.map((r) => r.name.toLowerCase()))}`
      : 'our group'

  const lines: string[] = [
    `Hi ${venueName} team,`,
    '',
    /* The program name is left exactly as the venue publishes it. Lowercasing
       it turns "Formal Cathedral Tour" into something the venue's own staff
       would not recognise on a booking sheet. */
    `We would love to book ${programName} for ${who}. That is ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'} with ${adultsCount} ${adultsCount === 1 ? 'adult' : 'adults'}.`,
  ]

  if (dates.length > 0) {
    lines.push('')
    const ordered = [...dates].sort((a, b) => a.rank - b.rank)
    for (const d of ordered) {
      const prefix = d.rank === 1 ? '1st choice' : 'Alternative'
      lines.push(`  • ${prefix}: ${longDate(d.date)}, ${SLOT_WORD[d.slot]}`)
    }
    if (ordered.length > 1) {
      lines.push('')
      lines.push('Any of those works for us, whichever suits you best.')
    }
  }

  if (asks.length > 0) {
    lines.push('')
    lines.push('We are also wondering:')
    for (const a of asks) lines.push(`  • ${a.question}`)
  }

  lines.push('', 'Thank you,', senderName, centreName)
  return lines.join('\n')
}

/* The one-line summaries on the request card at the top of the thread. */
export function requestDateLine(dates: DateOption[]): string {
  if (dates.length === 0) return 'No dates given'
  const ordered = [...dates].sort((a, b) => a.rank - b.rank)
  const first = ordered[0]!
  const rest = ordered.slice(1)
  const head = `First choice ${shortDate(first.date)}`
  return rest.length === 0
    ? head
    : `${head}, or ${rest.map((d) => shortDate(d.date)).join(' or ')}`
}

export function requestAskLine(asks: Ask[]): string {
  if (asks.length === 0) return 'No extra questions'
  return `Asked about ${listOf(asks.map((a) => a.label.toLowerCase()))}`
}
