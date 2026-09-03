import {
  DEFAULT_LEAD_TIME_DAYS,
  DEFAULT_TASK_BUFFER_DAYS,
  type Task,
  type TaskKind,
} from '@/lib/schemas'
import { newId } from '@/lib/ids'

/*
  The trip checklist. data-model.md 4b, plan §5.2.

  Dates count backwards from the trip date, because that is how a director
  actually plans: the visit is fixed and everything else is "how long before".

  The one rule worth stating twice: a task whose date a human has edited has
  `offset_days = null`, and regeneration leaves it alone. Someone who moved
  "consent forms back in" to a Friday because that is when the office is open
  should not have it silently pulled back to a Wednesday when the venue offers
  a different date.
*/

const OFFSETS: { kind: TaskKind; title: string; offset: number }[] = [
  { kind: 'book_transport', title: 'Book the bus', offset: -14 },
  { kind: 'approval', title: 'Director approval signed off', offset: -10 },
  { kind: 'consent_out', title: 'Parent consent forms out', offset: -10 },
  { kind: 'consent_in', title: 'Consent forms back in', offset: -3 },
  { kind: 'headcount', title: 'Confirm headcount with the venue', offset: -2 },
  {
    kind: 'day_before',
    title: 'Pack list, weather check, emergency contacts',
    offset: -1,
  },
]

/* Dates are plain YYYY-MM-DD. Midday avoids a timezone shifting the day. */
export function shiftDate(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T12:00:00Z`).getTime()
  const b = new Date(`${to}T12:00:00Z`).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function generateTasks({
  tripDate,
  venueName,
  leadTimeDays,
  needsTransport,
  bufferDays = DEFAULT_TASK_BUFFER_DAYS,
}: {
  tripDate: string
  venueName: string
  leadTimeDays: number | null
  /* Only a trip that travels by bus needs one booked. */
  needsTransport: boolean
  bufferDays?: number
}): Task[] {
  const lead = leadTimeDays ?? DEFAULT_LEAD_TIME_DAYS
  const sendOffset = -(lead + bufferDays)

  const tasks: Task[] = [
    {
      id: newId(),
      title: `Send request to ${venueName}`,
      kind: 'send_request',
      due_date: shiftDate(tripDate, sendOffset),
      offset_days: sendOffset,
      /* Sending is what created the trip, so this is done before she sees it.
         An unticked box for something she has already done is a small insult. */
      done: true,
      done_at: new Date().toISOString(),
    },
    ...OFFSETS.filter((o) => o.kind !== 'book_transport' || needsTransport).map(
      (o) => ({
        id: newId(),
        title: o.title,
        kind: o.kind,
        due_date: shiftDate(tripDate, o.offset),
        offset_days: o.offset,
        done: false,
        done_at: null,
      }),
    ),
  ]

  return tasks.sort((a, b) => (a.due_date < b.due_date ? -1 : 1))
}

/*
  Move the checklist to a new trip date.

  Skips anything already done, and anything a human has dated themselves. Plan
  §5.6: "regenerate tasks whose `offset_days` is not null relative to the new
  date, keep human edited ones."
*/
export function regenerateTasks(tasks: Task[], newTripDate: string): Task[] {
  return tasks
    .map((t) => {
      if (t.done) return t
      if (t.offset_days == null) return t
      return { ...t, due_date: shiftDate(newTripDate, t.offset_days) }
    })
    .sort((a, b) => (a.due_date < b.due_date ? -1 : 1))
}

/* Editing a date detaches the task, so later regeneration leaves it alone. */
export function setTaskDate(tasks: Task[], id: string, date: string): Task[] {
  return tasks.map((t) =>
    t.id === id ? { ...t, due_date: date, offset_days: null } : t,
  )
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) =>
    t.id === id
      ? {
          ...t,
          done: !t.done,
          done_at: !t.done ? new Date().toISOString() : null,
        }
      : t,
  )
}

/*
  A trip booked at short notice has a checklist that starts in the past. That
  is not an error to hide: it tells the director which steps she is already
  behind on, which is the most useful thing the list can say on the day she
  creates it.
*/
export function overdueTasks(tasks: Task[], today: string): Task[] {
  return tasks.filter((t) => !t.done && t.due_date < today)
}

export function taskSummary(tasks: Task[], today: string): string {
  const done = tasks.filter((t) => t.done).length
  const late = overdueTasks(tasks, today).length
  const base = `${done} of ${tasks.length} done`
  return late > 0 ? `${base}, ${late} overdue` : base
}
