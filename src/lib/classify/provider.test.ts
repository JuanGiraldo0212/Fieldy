import { describe, expect, it } from 'vitest'
import type { DateOption } from '@/lib/schemas'
import { classify, trimWords } from './provider'

/*
  The decision, rule by rule. Plan §5.5 step 4 and 5.

  The thirty-odd whole replies live in tests/fixtures/replies/ and run in
  tests/classifier-eval.test.ts. These are the individual rules in
  isolation, one behaviour each.
*/

const SENT = new Date('2026-09-23T15:00:00Z')
const OPTIONS: DateOption[] = [
  { date: '2026-10-14', slot: 'morning', rank: 1 },
  { date: '2026-10-16', slot: 'either', rank: 2 },
]

const read = (body: string, dateOptions = OPTIONS) =>
  classify({ body, dateOptions, sentAt: SENT })

describe('classify — confirmed', () => {
  it('confirm phrase with one of our dates in the sentence: 0.9', () => {
    expect(read('We have you down for Oct 14 at 9:30am.')).toMatchObject({
      intent: 'confirmed',
      dates: ['2026-10-14'],
      time: '09:30',
      confidence: 0.9,
    })
  })

  it('confirm phrase with our date in the next sentence', () => {
    expect(read('We can accommodate your group. Wednesday 14 October it is.')).toMatchObject({
      intent: 'confirmed',
      dates: ['2026-10-14'],
    })
  })

  it('confirm phrase with no date: dates null, 0.75', () => {
    expect(read('We have you down, see you soon.')).toMatchObject({
      intent: 'confirmed',
      dates: null,
      confidence: 0.75,
    })
  })

  it('a weak confirm alone never confirms without a date', () => {
    expect(read('The parking is booked for you.')?.intent).toBe('unclear')
  })

  it('a bare weekday names our option on that weekday', () => {
    expect(read('Friday works for us.')).toMatchObject({
      intent: 'confirmed',
      dates: ['2026-10-16'],
    })
  })

  it('takes the time from the sentence beside the confirmation', () => {
    expect(read('Confirmed for the 14th. Doors open at 9:30.')).toMatchObject({
      intent: 'confirmed',
      dates: ['2026-10-14'],
      time: '09:30',
    })
  })

  it('a yes to one of our dates beats a no to the other, at 0.75', () => {
    expect(read('The 14th is fully booked, but the 16th works for us.')).toMatchObject({
      intent: 'confirmed',
      dates: ['2026-10-16'],
      confidence: 0.75,
    })
  })
})

describe('classify — proposed dates', () => {
  it('any date that is not ours is an offer', () => {
    expect(read('We could do the 21st instead.')).toMatchObject({
      intent: 'proposed_dates',
      dates: ['2026-10-21'],
      confidence: 0.9,
    })
  })

  it('a confirm phrase around a date we never asked for is an offer', () => {
    expect(read('We can accommodate you on Oct 27.')).toMatchObject({
      intent: 'proposed_dates',
      dates: ['2026-10-27'],
      confidence: 0.75,
    })
  })

  it('collects every offered date, uncapped, sorted', () => {
    const s = read('We have openings on Nov 3, Oct 29 and October 27.')
    expect(s?.dates).toEqual(['2026-10-27', '2026-10-29', '2026-11-03'])
  })

  it('a bare weekday that is not ours is not an offer', () => {
    expect(read('Would a Thursday work?')?.intent).toBe('unclear')
  })

  it('a boundary date is not an offer', () => {
    expect(read('Unfortunately we are closed until November 2.')).toMatchObject({
      intent: 'declined',
    })
  })

  it('an alternative phrase with no date is unclear', () => {
    expect(read('We could do the following week instead.')?.intent).toBe('unclear')
  })
})

describe('classify — declined', () => {
  it('a decline phrase and no alternative date', () => {
    expect(read('Unfortunately we cannot accommodate groups this term.')).toMatchObject({
      intent: 'declined',
      dates: null,
      confidence: 0.75,
    })
  })

  it('a negated confirm is a decline', () => {
    expect(read('We cannot confirm that date.')?.intent).toBe('declined')
  })

  it('a decline about our own date is still a decline', () => {
    expect(read('The 14th is not available.')?.intent).toBe('declined')
  })
})

describe('classify — unclear and nothing', () => {
  it('equal confirm and decline signals conflict: 0.5, forced unclear', () => {
    const s = read('We can accommodate you, but unfortunately not then.')
    expect(s).toMatchObject({ intent: 'unclear', confidence: 0.5, dates: null })
  })

  it('a question about our date is not a confirmation', () => {
    expect(read('Does Oct 14 still work for you?')?.intent).toBe('unclear')
  })

  it('questions only: null, no banner, nothing stored', () => {
    expect(read('How many adults are coming? Any allergies we should know about?')).toBeNull()
  })

  it('an empty body is null', () => {
    expect(read('')).toBeNull()
    expect(read('\n\n')).toBeNull()
  })

  it('ignores everything under a signature or a quote', () => {
    expect(
      read('Thanks for asking.\n\nBest,\nMargaret\n\nWe have you down for Oct 14.'),
    ).toBeNull()
  })
})

describe('classify — evidence', () => {
  it('is the highest scoring sentence, trimmed to 30 words', () => {
    const long = `We have you down for Oct 14 ${'and that is lovely '.repeat(10)}indeed.`
    const s = read(long)
    expect(s?.evidence.split(/\s+/)).toHaveLength(30)
    expect(s?.evidence.endsWith('…')).toBe(true)
  })

  it('trimWords leaves a short sentence alone', () => {
    expect(trimWords('  See you  then. ', 30)).toBe('See you then.')
  })

  it('is stored unclear with dismissed_at null', () => {
    expect(read('We could do the following week instead.')).toMatchObject({
      intent: 'unclear',
      dismissed_at: null,
    })
  })
})
