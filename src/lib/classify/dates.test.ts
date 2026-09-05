import { describe, expect, it } from 'vitest'
import { extractDates, formatTime, splitSentences } from './dates'

/*
  Sentences and dates. Plan §5.5 steps 1 and 2.

  Reference: Wednesday 23 September 2026, 8 am Pacific.
*/
const REF = new Date('2026-09-23T15:00:00Z')

describe('splitSentences', () => {
  it('splits on terminal punctuation and paragraph breaks', () => {
    const s = splitSentences('That works. See you then!\n\nBest wishes for the term')
    expect(s.map((x) => x.text)).toEqual([
      'That works.',
      'See you then!',
      'Best wishes for the term',
    ])
  })

  it('stops at a signature line', () => {
    const s = splitSentences('That works.\n\nKind regards,\nMargaret\nOct 21 would be fine')
    expect(s.map((x) => x.text)).toEqual(['That works.'])
  })

  it('stops at a quoted reply', () => {
    const s = splitSentences('That works.\n> On Oct 21 we asked\n> for a visit')
    expect(s).toHaveLength(1)
  })

  it('stops at an attribution line', () => {
    const s = splitSentences('That works.\nOn Mon, Sep 22, 2026 Sarah wrote:\nOct 21 please')
    expect(s).toHaveLength(1)
  })

  it('splits clauses at "but" and gives them the same index', () => {
    const s = splitSentences('The 14th is full, but the 16th works for us. Shall I hold it?')
    expect(s.map((x) => [x.text, x.index])).toEqual([
      ['The 14th is full', 0],
      ['the 16th works for us.', 0],
      ['Shall I hold it?', 1],
    ])
    expect(s[0]!.full).toBe('The 14th is full, but the 16th works for us.')
  })

  it('does not split on an abbreviated month', () => {
    const s = splitSentences('We can do Oct. 14 at 9:30.')
    expect(s).toHaveLength(1)
  })
})

describe('extractDates', () => {
  const dates = (text: string) => extractDates(text, REF)

  it('reads a full date', () => {
    expect(dates('Wednesday October 14 works.')).toMatchObject([
      { date: '2026-10-14', hasDay: true, weekdayOnly: false, time: null },
    ])
  })

  it('reads a time beside a date', () => {
    expect(dates('Oct 14 at 9:30am.')).toMatchObject([
      { date: '2026-10-14', time: '09:30' },
    ])
  })

  it('reads a bare weekday as weekday-only, resolved forward', () => {
    expect(dates('Friday works.')).toMatchObject([
      { date: '2026-09-25', hasDay: true, weekdayOnly: true },
    ])
  })

  it('reads "the 15th" as the next 15th', () => {
    expect(dates('The 15th is free.')).toMatchObject([{ date: '2026-10-15' }])
  })

  it('reads "the 5th" as next month when this month\'s has passed', () => {
    expect(dates('The 5th is free.')).toMatchObject([{ date: '2026-10-05' }])
  })

  it('reads "Tuesday the 20th" as one mention on the right Tuesday', () => {
    const out = dates('How about Tuesday the 20th?')
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ date: '2026-10-20', weekdayOnly: false })
  })

  it('finds the month where a weekday and a day number agree', () => {
    /* 20 October 2026 is a Tuesday; the next Friday the 20th is November. */
    expect(dates('Friday the 20th?')).toMatchObject([{ date: '2026-11-20' }])
  })

  it('reads "Oct 20 or 21" as two dates', () => {
    expect(dates('We could do Oct 20 or 21.').map((d) => d.date)).toEqual([
      '2026-10-20',
      '2026-10-21',
    ])
  })

  it('reads a range as both ends', () => {
    expect(dates('16–18 October are open.').map((d) => d.date)).toEqual([
      '2026-10-16',
      '2026-10-18',
    ])
  })

  it('keeps a time on its own, without a day', () => {
    expect(dates('1pm start.')).toMatchObject([{ hasDay: false, time: '13:00' }])
  })

  it('ignores a duration that is not a clock time', () => {
    expect(dates('Please arrive ten minutes early.')).toEqual([])
  })

  it('ignores "next week"', () => {
    expect(dates('I will get back to you next week.')).toEqual([])
  })

  it('drops a date before the message', () => {
    expect(dates('Received on Sep 22.')).toEqual([])
  })

  it('drops a date more than a year out', () => {
    expect(dates('We reopen on October 1 2027.')).toEqual([])
  })

  it('marks a date after "until" or "from" as a boundary', () => {
    expect(dates('Closed from October 12 until the spring.')).toMatchObject([
      { date: '2026-10-12', boundary: true },
    ])
    expect(dates('Please confirm by Oct 1.')).toMatchObject([{ boundary: true }])
  })

  it('does not join a time to the next sentence\'s weekday', () => {
    /* Parsed per sentence by the caller; a single sentence has no such
       neighbour to join to. */
    expect(dates('We open at 9:30am.')).toMatchObject([{ hasDay: false, time: '09:30' }])
  })
})

describe('formatTime', () => {
  it('writes a time the way the banner does', () => {
    expect(formatTime('09:30')).toBe('9:30 am')
    expect(formatTime('13:00')).toBe('1 pm')
    expect(formatTime('12:00')).toBe('12 pm')
    expect(formatTime('00:15')).toBe('12:15 am')
  })
})
