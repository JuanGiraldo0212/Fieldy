/*
  The inbox. Spec §5.7: "A single list of all messages across trips, newest
  first, grouped by day." Pure helpers for the grouping and the preview, so
  the page is only layout.
*/

export type InboxItem = {
  id: string
  tripId: string
  party: 'educator' | 'venue'
  authorName: string
  body: string
  sentAt: Date
  readAt: Date | null
  programName: string
  venueName: string
  /* The confirmed date, else the first choice. */
  tripDate: string | null
}

export type InboxDay = { label: string; items: InboxItem[] }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const TIMEZONE = 'America/Vancouver'

/* The calendar day a message belongs to, in the director's own time zone.
   Plan §8: timestamps are UTC in the database and rendered in Vancouver. */
export function dayKey(at: Date, timeZone = TIMEZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(at)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}`
}

/* "Today", "Yesterday", then "Tue 23 Sep"; the year only when it differs. */
export function dayLabel(key: string, now: Date, timeZone = TIMEZONE): string {
  const today = dayKey(now, timeZone)
  if (key === today) return 'Today'
  const y = new Date(now.getTime() - 86_400_000)
  if (key === dayKey(y, timeZone)) return 'Yesterday'
  const d = new Date(`${key}T12:00:00Z`)
  const base = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
  return key.slice(0, 4) === today.slice(0, 4) ? base : `${base} ${key.slice(0, 4)}`
}

export function groupByDay(items: InboxItem[], now: Date, timeZone = TIMEZONE): InboxDay[] {
  const sorted = [...items].sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
  const out: InboxDay[] = []
  let current: { key: string; day: InboxDay } | null = null
  for (const item of sorted) {
    const key = dayKey(item.sentAt, timeZone)
    if (!current || current.key !== key) {
      current = { key, day: { label: dayLabel(key, now, timeZone), items: [] } }
      out.push(current.day)
    }
    current.day.items.push(item)
  }
  return out
}

/*
  One line of the stripped body. Greetings are dropped so the line says
  something — "Hi Sarah," tells a director nothing about eight replies at
  once. Whitespace collapses, and the cut lands on a word.
*/
export function preview(body: string, max = 120): string {
  const lines = body
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const start = lines.findIndex(
    (l) => !/^(hi|hello|hey|dear|good (morning|afternoon|evening))\b[^.!?]{0,40}[,!:]?$/i.test(l),
  )
  const text = lines.slice(start === -1 ? 0 : start).join(' ').replace(/\s+/g, ' ')
  if (text.length <= max) return text
  const cut = text.slice(0, max).replace(/\s+\S*$/, '')
  return `${cut}…`
}
