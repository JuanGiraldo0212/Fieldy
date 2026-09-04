import { describe, expect, it } from 'vitest'
import {
  BUCKETS,
  bucketOf,
  daysWaiting,
  ratioCheck,
  requiredAdults,
  totalCost,
  tripSummary,
  sortByUrgency,
  waitingLabel,
  waitingOn,
} from './derived'
import { generateTasks } from './tasks'

const TODDLER = { id: 'a', name: 'Toddler room', size: 10, ratio: 4 }
const PRESCHOOL = { id: 'b', name: 'Preschool room', size: 16, ratio: 8 }

describe('totalCost', () => {
  it('adds children, adults, the group fee and transport', () => {
    const r = totalCost(
      { childCost: 6, adultCost: 3, groupFee: 20, transport: 90 },
      16,
      3,
    )
    expect(r.total).toBe(6 * 16 + 3 * 3 + 20 + 90)
    expect(r.incomplete).toBe(false)
  })

  it('treats a missing component as zero but says the total is partial', () => {
    // A director who budgets against a total that quietly omitted the bus has
    // been misled by us, so the flag matters more than the number.
    const r = totalCost({ childCost: 6, adultCost: null, groupFee: null, transport: null }, 16, 3)
    expect(r.total).toBe(96)
    expect(r.incomplete).toBe(true)
  })

  it('divides per child without dividing by zero', () => {
    expect(totalCost({ childCost: 5, adultCost: 0, groupFee: 0, transport: 0 }, 10, 2).perChild).toBe(5)
    expect(totalCost({ childCost: 0, adultCost: 0, groupFee: 60, transport: 0 }, 0, 2).perChild).toBe(60)
  })
})

describe('requiredAdults', () => {
  it('rounds each room up on its own', () => {
    expect(requiredAdults([TODDLER])).toBe(3) // ceil(10/4)
    expect(requiredAdults([PRESCHOOL])).toBe(2) // ceil(16/8)
  })

  it('sums per room and never averages', () => {
    // The rule the data model defends: 3 + 2 = 5, not ceil(26/6) = 5 by luck
    // and the wrong number the moment a size changes.
    expect(requiredAdults([TODDLER, PRESCHOOL])).toBe(5)
    expect(requiredAdults([{ ...TODDLER, size: 11 }, PRESCHOOL])).toBe(5)
    expect(requiredAdults([{ ...TODDLER, size: 13 }, PRESCHOOL])).toBe(6)
  })

  it('does not divide by a ratio of zero', () => {
    expect(requiredAdults([{ ...TODDLER, ratio: 0 }])).toBe(10)
  })
})

describe('ratioCheck', () => {
  it('names the requirement room by room', () => {
    const r = ratioCheck([TODDLER, PRESCHOOL], 4)
    expect(r.required).toBe(5)
    expect(r.ok).toBe(false)
    expect(r.perRoom).toEqual([
      { name: 'Toddler room', required: 3 },
      { name: 'Preschool room', required: 2 },
    ])
  })

  it('passes when there are exactly enough', () => {
    expect(ratioCheck([TODDLER, PRESCHOOL], 5).ok).toBe(true)
  })
})

describe('waitingOn', () => {
  it('waits on the venue after we write', () => {
    expect(waitingOn('requested', 'educator')).toBe('venue')
  })

  it('is her turn once the venue replies', () => {
    expect(waitingOn('replied', 'venue')).toBe('educator')
  })

  it('waits on nobody once the trip is settled', () => {
    expect(waitingOn('confirmed', 'venue')).toBe('nobody')
    expect(waitingOn('done', 'educator')).toBe('nobody')
    expect(waitingOn('cancelled', 'venue')).toBe('nobody')
  })

  it('waits on the venue when only a system note exists', () => {
    expect(waitingOn('requested', 'system')).toBe('venue')
    expect(waitingOn('requested', null)).toBe('venue')
  })
})

describe('waitingLabel', () => {
  it('reads the way the design writes it', () => {
    expect(waitingLabel('venue', 4)).toBe('Waiting on venue, 4 days')
    expect(waitingLabel('venue', 1)).toBe('Waiting on venue, 1 day')
    expect(waitingLabel('venue', 0)).toBe('Waiting on venue, sent today')
    expect(waitingLabel('educator', 2)).toBe('Your turn')
    expect(waitingLabel('nobody', 9)).toBe('')
  })
})

describe('daysWaiting', () => {
  it('counts whole days since the last message', () => {
    const now = new Date('2026-09-05T10:00:00Z')
    expect(daysWaiting(new Date('2026-09-01T10:00:00Z'), now)).toBe(4)
    expect(daysWaiting(new Date('2026-09-05T09:00:00Z'), now)).toBe(0)
  })

  it('never goes negative on a clock skew', () => {
    const now = new Date('2026-09-05T10:00:00Z')
    expect(daysWaiting(new Date('2026-09-06T10:00:00Z'), now)).toBe(0)
  })
})

describe('bucketOf', () => {
  it('puts a venue reply above everything else', () => {
    // The most urgent thing My trips can surface: it is her call now.
    expect(bucketOf('replied', 'venue')).toBe('needs')
    expect(bucketOf('confirmed', 'venue')).toBe('needs')
  })

  it('waits while a request is out', () => {
    expect(bucketOf('requested', 'educator')).toBe('waiting')
  })

  it('files a confirmed trip as upcoming', () => {
    expect(bucketOf('confirmed', 'educator')).toBe('upcoming')
  })

  it('files done and cancelled as past', () => {
    expect(bucketOf('done', 'venue')).toBe('past')
    expect(bucketOf('cancelled', 'venue')).toBe('past')
  })
})

describe('tripSummary', () => {
  const tasks = generateTasks({
    tripDate: '2026-11-19',
    venueName: 'X',
    leadTimeDays: 21,
    needsTransport: true,
  })

  it('leads with what is overdue', () => {
    expect(tripSummary({ status: 'requested', tasks, today: '2026-11-18' })).toMatch(
      /steps overdue/,
    )
  })

  it('otherwise says what is next', () => {
    expect(tripSummary({ status: 'requested', tasks, today: '2026-10-01' })).toMatch(
      /^Next: /,
    )
  })

  it('says so plainly for a finished trip', () => {
    expect(tripSummary({ status: 'done', tasks, today: '2026-12-01' })).toBe('Been and gone')
    expect(tripSummary({ status: 'cancelled', tasks, today: '2026-12-01' })).toBe('Cancelled')
  })
})

describe('sortByUrgency', () => {
  const NOW = new Date('2026-09-20T10:00:00Z')
  const row = (
    name: string,
    over: Partial<Parameters<typeof sortByUrgency>[0][number]> = {},
  ) => ({
    name,
    status: 'requested' as const,
    lastMessageParty: 'educator' as const,
    lastMessageAt: new Date('2026-09-19T10:00:00Z'),
    showDate: '2026-10-01',
    ...over,
  })

  it('puts her turn above everything else', () => {
    const out = sortByUrgency(
      [row('waiting'), row('hers', { lastMessageParty: 'venue', status: 'replied' })],
      NOW,
    )
    expect(out.map((r) => r.name)).toEqual(['hers', 'waiting'])
  })

  it('puts the longest wait first among requests that are out', () => {
    // Three weeks unanswered is the one she needs to see. Sorting by trip date
    // would bury it under everything happening sooner.
    const out = sortByUrgency(
      [
        row('recent', { lastMessageAt: new Date('2026-09-19T10:00:00Z') }),
        row('stale', { lastMessageAt: new Date('2026-08-30T10:00:00Z') }),
      ],
      NOW,
    )
    expect(out.map((r) => r.name)).toEqual(['stale', 'recent'])
  })

  it('falls back to the soonest trip when urgency ties', () => {
    const out = sortByUrgency(
      [
        row('later', { status: 'confirmed', showDate: '2026-12-01' }),
        row('sooner', { status: 'confirmed', showDate: '2026-10-05' }),
      ],
      NOW,
    )
    expect(out.map((r) => r.name)).toEqual(['sooner', 'later'])
  })

  it('sinks a trip with no date rather than heading the list with it', () => {
    const out = sortByUrgency(
      [
        row('undated', { status: 'confirmed', showDate: null }),
        row('dated', { status: 'confirmed' }),
      ],
      NOW,
    )
    expect(out.map((r) => r.name)).toEqual(['dated', 'undated'])
  })

  it('does not mutate what it was given', () => {
    const rows = [row('a'), row('b', { status: 'replied', lastMessageParty: 'venue' })]
    const before = rows.map((r) => r.name)
    sortByUrgency(rows, NOW)
    expect(rows.map((r) => r.name)).toEqual(before)
  })
})

describe('BUCKETS', () => {
  it('has an empty state for every bucket', () => {
    for (const b of ['needs', 'waiting', 'upcoming', 'past'] as const) {
      expect(BUCKETS[b].label).toBeTruthy()
      expect(BUCKETS[b].empty[0]).toBeTruthy()
      expect(BUCKETS[b].empty[1]).toBeTruthy()
    }
  })
})

