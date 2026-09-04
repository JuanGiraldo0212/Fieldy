import type { RoomSnapshot, Task } from '@/lib/schemas'
import { overdueTasks } from './tasks'

/*
  Everything about a trip that is computed rather than stored. Plan §4.2, and
  the data model's third defended rule: "Nothing derived is stored. Totals,
  required adults, waiting-on, overdue counts and status labels are all
  computed from the fields above. One source of truth per fact, or the card
  contradicts itself."
*/

/* ─── Money ──────────────────────────────────────────────────────────────── */

export type TripCosts = {
  childCost: number | null
  adultCost: number | null
  groupFee: number | null
  transport: number | null
}

export type CostTotal = {
  total: number
  perChild: number
  /*
    True when any component was never filled in. The total is still shown,
    because a partial number is useful for planning, but it is shown as a
    floor rather than an answer: a director who budgets against a total that
    quietly omitted the bus has been misled by us.
  */
  incomplete: boolean
}

export function totalCost(
  costs: TripCosts,
  childrenCount: number,
  adultsCount: number,
): CostTotal {
  const at = (v: number | null) => v ?? 0
  const total =
    at(costs.childCost) * childrenCount +
    at(costs.adultCost) * adultsCount +
    at(costs.groupFee) +
    at(costs.transport)

  return {
    total,
    perChild: childrenCount > 0 ? total / childrenCount : total,
    incomplete: Object.values(costs).some((v) => v == null),
  }
}

/* ─── Adults ─────────────────────────────────────────────────────────────── */

/*
  Required adults, summed per room and never averaged.

  data-model.md is explicit: "Never averaged across rooms — a multi-room trip
  sums each room's requirement separately." A toddler room at 1:4 and a
  preschool room at 1:8 going together need ceil(10/4) + ceil(16/8) = 5, not
  ceil(26/6) = 5 by luck and the wrong number the moment the sizes change.

  Read from the snapshots taken at creation, not the live rooms, so editing a
  room next term does not rewrite a trip that already happened.
*/
export function requiredAdults(snapshots: RoomSnapshot[]): number {
  return snapshots.reduce(
    (n, r) => n + Math.ceil(r.size / Math.max(1, r.ratio)),
    0,
  )
}

export type RatioCheck = {
  required: number
  have: number
  ok: boolean
  /* Per room, so a director can see which one is short rather than a total
     that hides it. */
  perRoom: { name: string; required: number }[]
}

export function ratioCheck(
  snapshots: RoomSnapshot[],
  adultsCount: number,
): RatioCheck {
  const perRoom = snapshots.map((r) => ({
    name: r.name,
    required: Math.ceil(r.size / Math.max(1, r.ratio)),
  }))
  const required = perRoom.reduce((n, r) => n + r.required, 0)
  return { required, have: adultsCount, ok: adultsCount >= required, perRoom }
}

/* ─── Whose turn it is ───────────────────────────────────────────────────── */

export type TripStatus = 'requested' | 'replied' | 'confirmed' | 'done' | 'cancelled'
export type WaitingOn = 'venue' | 'educator' | 'nobody'

export function waitingOn(
  status: TripStatus,
  lastMessageParty: 'educator' | 'venue' | 'system' | null,
): WaitingOn {
  /* Once a trip is settled, nobody is waiting on anybody. */
  if (status === 'confirmed' || status === 'done' || status === 'cancelled') {
    return 'nobody'
  }
  if (lastMessageParty === 'venue') return 'educator'
  return 'venue'
}

export function waitingLabel(who: WaitingOn, days: number | null): string {
  if (who === 'nobody') return ''
  if (who === 'educator') return 'Your turn'
  if (days == null) return 'Waiting on venue'
  if (days === 0) return 'Waiting on venue, sent today'
  return `Waiting on venue, ${days} day${days === 1 ? '' : 's'}`
}

export function daysWaiting(lastMessageAt: Date | null, now: Date): number | null {
  if (!lastMessageAt) return null
  return Math.max(
    0,
    Math.floor((now.getTime() - lastMessageAt.getTime()) / 86_400_000),
  )
}

/* ─── Where it belongs in My trips ───────────────────────────────────────── */

export type Bucket = 'needs' | 'waiting' | 'upcoming' | 'past'

export function bucketOf(
  status: TripStatus,
  lastMessageParty: 'educator' | 'venue' | 'system' | null,
): Bucket {
  if (status === 'done' || status === 'cancelled') return 'past'
  /* A venue has answered and it is now her call: the most urgent thing the
     list can surface, so it comes before "confirmed". */
  if (lastMessageParty === 'venue') return 'needs'
  if (status === 'confirmed') return 'upcoming'
  return 'waiting'
}

/* ─── The one-line summary a trip row shows ──────────────────────────────── */

export function tripSummary({
  status,
  tasks,
  today,
}: {
  status: TripStatus
  tasks: Task[]
  today: string
}): string {
  if (status === 'cancelled') return 'Cancelled'
  if (status === 'done') return 'Been and gone'

  const late = overdueTasks(tasks, today)
  if (late.length > 0) {
    return late.length === 1
      ? `Overdue: ${late[0]!.title}`
      : `${late.length} steps overdue`
  }
  const next = tasks
    .filter((t) => !t.done)
    .sort((a, b) => (a.due_date < b.due_date ? -1 : 1))[0]
  return next ? `Next: ${next.title}` : 'Everything ticked off'
}

export const STATUS_LABEL: Record<TripStatus, string> = {
  requested: 'Asked',
  replied: 'They answered',
  confirmed: 'Confirmed',
  done: 'Done',
  cancelled: 'Cancelled',
}

/* The rail on the trip page. No "Idea" step: a trip exists because a request
   was sent. `cancelled` is not on the rail either — it is not a stage. */
export const STATUS_RAIL: { status: TripStatus; label: string; note: string }[] = [
  { status: 'requested', label: 'Asked', note: 'Request sent to the venue' },
  { status: 'replied', label: 'They answered', note: 'Waiting on your call' },
  { status: 'confirmed', label: 'Confirmed', note: 'Date is locked in' },
  { status: 'done', label: 'Done', note: 'You went' },
]

/* ─── My trips ───────────────────────────────────────────────────────────── */

export const BUCKETS: Record<Bucket, { label: string; empty: [string, string] }> = {
  needs: {
    label: 'Needs action',
    empty: [
      'Nothing needs you right now',
      'When a venue replies, the trip moves here so you know it is your turn.',
    ],
  },
  waiting: {
    label: 'Waiting',
    empty: [
      'No requests out',
      'Trips you have asked about but not heard back on will wait here.',
    ],
  },
  upcoming: {
    label: 'Upcoming',
    empty: [
      'No confirmed trips yet',
      'Once a venue confirms a date, the trip shows up here with its checklist.',
    ],
  },
  past: {
    label: 'Past',
    empty: ['No history yet', 'Trips you have been on, and any you cancelled, collect here.'],
  },
}

export type TripRow = {
  status: TripStatus
  lastMessageParty: 'educator' | 'venue' | 'system' | null
  lastMessageAt: Date | null
  /* The date the row shows: the confirmed one, else the first choice. */
  showDate: string | null
}

/*
  Urgency order within a bucket. Spec §5.6: "trips waiting on the educator
  first, then trips waiting on the venue the longest, then the rest."

  Longest-waiting first is the part that matters. A request sent three weeks
  ago and forgotten is the one a director needs to see, and sorting by trip
  date would bury it under everything happening sooner.
*/
export function sortByUrgency<T extends TripRow>(rows: T[], now: Date): T[] {
  const rank = (r: T) => {
    const who = waitingOn(r.status, r.lastMessageParty)
    if (who === 'educator') return 0
    if (who === 'venue') return 1
    return 2
  }
  return [...rows].sort((a, b) => {
    const ra = rank(a)
    const rb = rank(b)
    if (ra !== rb) return ra - rb
    if (ra === 1) {
      /* Both waiting on a venue: the one waiting longest comes first. */
      const wa = daysWaiting(a.lastMessageAt, now) ?? 0
      const wb = daysWaiting(b.lastMessageAt, now) ?? 0
      if (wa !== wb) return wb - wa
    }
    /* Same urgency: soonest trip first, and a trip with no date last, because
       a row with nothing to show should not head the list. */
    if (a.showDate && b.showDate) return a.showDate < b.showDate ? -1 : 1
    if (a.showDate) return -1
    if (b.showDate) return 1
    return 0
  })
}

