import { describe, expect, it } from 'vitest'
import { dayLabel, groupByDay, preview, type InboxItem } from './inbox'

/* Wednesday 23 September 2026, 3 pm Pacific. */
const NOW = new Date('2026-09-23T22:00:00Z')

function item(over: Partial<InboxItem> & { id: string; sentAt: Date }): InboxItem {
  return {
    tripId: 't1',
    party: 'venue',
    authorName: 'Margaret Doyle',
    body: 'Yes.',
    readAt: null,
    programName: 'Weekly Animal Talks',
    venueName: "Beacon Hill Children's Farm",
    tripDate: '2026-10-14',
    ...over,
  }
}

describe('dayLabel', () => {
  it('says Today and Yesterday in Vancouver time', () => {
    expect(dayLabel('2026-09-23', NOW)).toBe('Today')
    expect(dayLabel('2026-09-22', NOW)).toBe('Yesterday')
  })

  it('names other days, with the year only when it differs', () => {
    expect(dayLabel('2026-09-18', NOW)).toBe('Fri 18 Sep')
    expect(dayLabel('2025-12-18', NOW)).toBe('Thu 18 Dec 2025')
  })
})

describe('groupByDay', () => {
  it('sorts newest first and groups by the Vancouver day', () => {
    const days = groupByDay(
      [
        item({ id: 'a', sentAt: new Date('2026-09-22T16:00:00Z') }),
        item({ id: 'b', sentAt: new Date('2026-09-23T20:00:00Z') }),
        /* 05:30 UTC on the 23rd is still the 22nd in Vancouver. */
        item({ id: 'c', sentAt: new Date('2026-09-23T05:30:00Z') }),
      ],
      NOW,
    )
    expect(days.map((d) => [d.label, d.items.map((i) => i.id)])).toEqual([
      ['Today', ['b']],
      ['Yesterday', ['c', 'a']],
    ])
  })

  it('is empty for no messages', () => {
    expect(groupByDay([], NOW)).toEqual([])
  })
})

describe('preview', () => {
  it('drops the greeting line and joins the rest', () => {
    expect(preview('Hi Sarah,\n\nThat works for us.\nSee you then.')).toBe(
      'That works for us. See you then.',
    )
  })

  it('keeps a body that is only a greeting', () => {
    expect(preview('Hello,')).toBe('Hello,')
  })

  it('cuts on a word with an ellipsis', () => {
    const p = preview('one two three four five six seven', 14)
    expect(p).toBe('one two three…')
  })
})
