import { describe, expect, it } from 'vitest'
import {
  askIntro,
  askTopics,
  composeRequest,
  leadWarning,
  ordinalLabel,
  requestAskLine,
  requestDateLine,
  shortDate,
} from './asks'
import type { Fact } from '@/lib/catalog/program'

const known = (key: string, label: string): Fact => ({
  key,
  label,
  value: 'Yes',
  known: true,
})
const gap = (key: string, label: string): Fact => ({
  key,
  label,
  value: 'Needs confirmation',
  known: false,
})

const ALL_KNOWN: Fact[] = [
  known('washrooms', 'Washrooms'),
  known('lunch', 'Lunch space'),
  known('rain', 'Rain backup'),
  known('strollers', 'Strollers'),
  known('wheelchair', 'Wheelchair access'),
  known('bus', 'Bus parking'),
]

describe('askTopics', () => {
  it('pre-selects the facts the venue does not publish', () => {
    const topics = askTopics({
      facts: [...ALL_KNOWN.slice(1), gap('washrooms', 'Washrooms')],
      conflicts: null,
      extraFeesNote: null,
    })
    const pre = topics.filter((t) => t.gap)
    expect(pre.map((t) => t.key)).toEqual(['fact:Washrooms'])
    expect(pre[0]!.question).toMatch(/closest washrooms/)
  })

  it('never offers the same question twice', () => {
    // Washrooms is both a gap chip and a generic topic. Only the gap survives.
    const topics = askTopics({
      facts: [gap('washrooms', 'Washrooms')],
      conflicts: null,
      extraFeesNote: null,
    })
    const labels = topics.map((t) => t.label.toLowerCase())
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('does not ask a venue about a nearby park', () => {
    // A gap we can live with. Spending a venue's goodwill has a cost.
    const topics = askTopics({
      facts: [gap('park', 'Nearby park')],
      conflicts: null,
      extraFeesNote: null,
    })
    expect(topics.some((t) => t.label === 'Nearby park')).toBe(false)
  })

  it('turns a conflict into a question in plain words', () => {
    const topics = askTopics({
      facts: ALL_KNOWN,
      conflicts: [{ note: 'One page says 1:5, another says 1:8.' }],
      extraFeesNote: null,
    })
    const c = topics.find((t) => t.key === 'conflict')!
    expect(c.gap).toBe(true)
    expect(c.question).not.toMatch(/field|source|ratio_children/)
  })

  it('ignores a conflict with nothing written down', () => {
    const topics = askTopics({
      facts: ALL_KNOWN,
      conflicts: [{ note: null }, { note: '  ' }],
      extraFeesNote: null,
    })
    expect(topics.some((t) => t.key === 'conflict')).toBe(false)
  })

  it('asks for the total when there are fees on top', () => {
    const topics = askTopics({
      facts: ALL_KNOWN,
      conflicts: null,
      extraFeesNote: 'Tax not included.',
    })
    expect(topics.find((t) => t.key === 'fees')!.gap).toBe(true)
  })

  it('still offers the generic topics when nothing is missing', () => {
    const topics = askTopics({ facts: ALL_KNOWN, conflicts: null, extraFeesNote: null })
    expect(topics.every((t) => !t.gap)).toBe(true)
    expect(topics.length).toBeGreaterThan(0)
  })
})

describe('askIntro', () => {
  it('counts the gaps and says whose they are', () => {
    const topics = askTopics({
      facts: [gap('washrooms', 'Washrooms'), gap('lunch', 'Lunch space')],
      conflicts: null,
      extraFeesNote: null,
    })
    expect(askIntro(topics, 'Goldstream')).toBe(
      'We picked the 2 things Goldstream does not publish. These go in your message.',
    )
  })

  it('says so when the venue publishes everything', () => {
    const topics = askTopics({ facts: ALL_KNOWN, conflicts: null, extraFeesNote: null })
    expect(askIntro(topics, 'Goldstream')).toMatch(/publishes everything/)
  })
})

describe('shortDate', () => {
  it('does not slip a day west of Greenwich', () => {
    expect(shortDate('2026-11-19')).toBe('Thu 19 Nov')
    expect(shortDate('2026-01-01')).toBe('Thu 1 Jan')
  })
})

describe('ordinalLabel', () => {
  it('counts past the three the design draws', () => {
    expect(ordinalLabel(1)).toBe('1st choice')
    expect(ordinalLabel(3)).toBe('3rd choice')
    expect(ordinalLabel(4)).toBe('4th choice')
  })
})

describe('leadWarning', () => {
  it('says nothing when the venue publishes no lead time', () => {
    expect(
      leadWarning({ firstDate: '2026-11-19', today: '2026-11-01', leadTimeDays: null, venueName: 'X' }),
    ).toBeNull()
  })

  it('reassures when there is enough notice', () => {
    expect(
      leadWarning({ firstDate: '2026-11-19', today: '2026-10-01', leadTimeDays: 21, venueName: 'Goldstream' }),
    ).toBe('Goldstream asks for 21 days notice. You have 49.')
  })

  it('warns without blocking when there is not', () => {
    const w = leadWarning({
      firstDate: '2026-11-19',
      today: '2026-11-11',
      leadTimeDays: 21,
      venueName: 'Goldstream',
    })
    expect(w).toMatch(/^Tight: /)
    expect(w).toMatch(/Worth asking anyway/)
  })
})

describe('composeRequest', () => {
  const base = {
    venueName: 'Goldstream Nature House',
    programName: 'Salmon Run Walk',
    rooms: [{ id: 'a', name: 'Preschool room', size: 16, ratio: 8 }],
    childrenCount: 16,
    adultsCount: 2,
    dates: [
      { date: '2026-11-19', slot: 'morning' as const, rank: 1 },
      { date: '2026-11-26', slot: 'either' as const, rank: 2 },
    ],
    asks: [
      { key: 'lunch', label: 'Lunch space', question: 'Is there space we can use for lunch?', source: 'gap' as const },
    ],
    senderName: 'Dana Mireau',
    centreName: 'Garry Oak Childcare',
  }

  it('reads like a person wrote it', () => {
    const text = composeRequest(base)
    expect(text).toMatch(/^Hi Goldstream Nature House team,/)
    /* The venue's own capitalisation, so its staff recognise the booking. */
    expect(text).toMatch(/book Salmon Run Walk for our preschool room/)
    expect(text).toMatch(/16 children with 2 adults/)
    expect(text).toMatch(/1st choice: Thu 19 Nov 2026, morning/)
    expect(text).toMatch(/Alternative: Thu 26 Nov 2026, any time that day/)
    expect(text).toMatch(/Is there space we can use for lunch\?/)
    expect(text).toMatch(/Thank you,\nDana Mireau\nGarry Oak Childcare$/)
  })

  it('uses no em dashes, because a person would not', () => {
    expect(composeRequest(base)).not.toMatch(/[—–]/)
  })

  it('names every room when several go together', () => {
    const text = composeRequest({
      ...base,
      rooms: [
        { id: 'a', name: 'Toddler room', size: 10, ratio: 4 },
        { id: 'b', name: 'Preschool room', size: 16, ratio: 8 },
      ],
      childrenCount: 26,
    })
    expect(text).toMatch(/our toddler room and preschool room/)
  })

  it('drops the "any of those" line when there is only one date', () => {
    const text = composeRequest({ ...base, dates: [base.dates[0]!] })
    expect(text).not.toMatch(/Any of those/)
  })

  it('leaves the questions out rather than writing an empty heading', () => {
    expect(composeRequest({ ...base, asks: [] })).not.toMatch(/also wondering/)
  })

  it('puts the first choice first however the dates arrive', () => {
    const text = composeRequest({
      ...base,
      dates: [base.dates[1]!, base.dates[0]!],
    })
    expect(text.indexOf('1st choice')).toBeLessThan(text.indexOf('Alternative'))
  })
})

describe('request summary lines', () => {
  it('summarises the dates the way the thread card shows them', () => {
    expect(
      requestDateLine([
        { date: '2026-11-26', slot: 'morning', rank: 2 },
        { date: '2026-11-19', slot: 'morning', rank: 1 },
      ]),
    ).toBe('First choice Thu 19 Nov, or Thu 26 Nov')
  })

  it('summarises the asks', () => {
    expect(
      requestAskLine([
        { key: 'a', label: 'Lunch space', question: 'q', source: 'gap' },
        { key: 'b', label: 'Washrooms', question: 'q', source: 'gap' },
      ]),
    ).toBe('Asked about lunch space and washrooms')
  })

  it('says plainly when there is nothing to summarise', () => {
    expect(requestAskLine([])).toBe('No extra questions')
  })
})
