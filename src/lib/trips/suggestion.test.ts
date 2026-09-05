import { describe, expect, it } from 'vitest'
import type { DateOption, Suggestion } from '@/lib/schemas'
import {
  acceptanceReply,
  bannerText,
  collapseDates,
  confirmedDateFor,
  dismissLabel,
  openSuggestion,
} from './suggestion'

const OPTIONS: DateOption[] = [
  { date: '2026-10-16', slot: 'either', rank: 2 },
  { date: '2026-10-14', slot: 'morning', rank: 1 },
]

function sg(over: Partial<Suggestion> = {}): Suggestion {
  return {
    intent: 'confirmed',
    dates: ['2026-10-14'],
    time: '09:30',
    evidence: 'We have you down for the 14th at 9:30.',
    confidence: 0.9,
    dismissed_at: null,
    ...over,
  }
}

const at = (iso: string) => new Date(iso)

describe('openSuggestion', () => {
  it('picks the newest venue message with a suggestion', () => {
    const m = openSuggestion([
      { id: 'a', party: 'venue', sentAt: at('2026-09-23T10:00:00Z'), suggestion: sg() },
      { id: 'b', party: 'educator', sentAt: at('2026-09-24T10:00:00Z'), suggestion: null },
      { id: 'c', party: 'venue', sentAt: at('2026-09-25T10:00:00Z'), suggestion: sg({ intent: 'proposed_dates', dates: ['2026-10-21'] }) },
    ])
    expect(m?.id).toBe('c')
  })

  it('shows nothing once the newest is dismissed, even if an older one was not', () => {
    const m = openSuggestion([
      { id: 'a', party: 'venue', sentAt: at('2026-09-23T10:00:00Z'), suggestion: sg() },
      { id: 'c', party: 'venue', sentAt: at('2026-09-25T10:00:00Z'), suggestion: sg({ dismissed_at: '2026-09-25T11:00:00Z' }) },
    ])
    expect(m).toBeNull()
  })

  it('shows nothing for unclear, or under the confidence floor', () => {
    expect(openSuggestion([{ id: 'a', party: 'venue', sentAt: at('2026-09-23T10:00:00Z'), suggestion: sg({ intent: 'unclear' }) }])).toBeNull()
    expect(openSuggestion([{ id: 'a', party: 'venue', sentAt: at('2026-09-23T10:00:00Z'), suggestion: sg({ confidence: 0.5 }) }])).toBeNull()
  })

  it('ignores messages with no suggestion, and non-venue parties', () => {
    expect(openSuggestion([
      { id: 'a', party: 'venue', sentAt: at('2026-09-23T10:00:00Z'), suggestion: null },
      { id: 'b', party: 'system', sentAt: at('2026-09-24T10:00:00Z'), suggestion: sg() },
    ])).toBeNull()
  })
})

describe('bannerText — the design\'s copy', () => {
  it('confirmed with a date and time', () => {
    expect(bannerText(sg(), OPTIONS)).toBe('Looks like the venue confirmed Wed 14 Oct at 9:30 am.')
  })

  it('confirmed with a date and no time', () => {
    expect(bannerText(sg({ time: null }), OPTIONS)).toBe('Looks like the venue confirmed Wed 14 Oct.')
  })

  it('confirmed with no date offers the first choice', () => {
    expect(bannerText(sg({ dates: null, time: '10:00' }), OPTIONS)).toBe('Looks like the venue confirmed Wed 14 Oct at 10 am.')
    expect(confirmedDateFor(sg({ dates: null }), OPTIONS)).toBe('2026-10-14')
  })

  it('proposed dates, joined with "or", however many', () => {
    expect(bannerText(sg({ intent: 'proposed_dates', dates: ['2026-10-21', '2026-10-23', '2026-10-27'] }), OPTIONS))
      .toBe('The venue suggested Wed 21 Oct or Fri 23 Oct or Tue 27 Oct instead.')
  })

  it('declined', () => {
    expect(bannerText(sg({ intent: 'declined', dates: null }), OPTIONS)).toBe('It sounds like the venue cannot take this booking.')
  })

  it('dismiss labels per intent', () => {
    expect(dismissLabel('confirmed')).toBe('Not quite')
    expect(dismissLabel('declined')).toBe('Not quite')
    expect(dismissLabel('proposed_dates')).toBe('Neither')
  })
})

describe('acceptanceReply', () => {
  it('is the plan\'s text, verbatim', () => {
    expect(acceptanceReply({ date: '2026-10-21', childrenCount: 16, adultsCount: 4, name: 'Dana' })).toBe(
      'Hi,\n\nWed 21 Oct works for us — please go ahead and hold it. Same group: 16 children with 4 adults.\n\nThank you,\nDana',
    )
  })
})

describe('collapseDates', () => {
  it('keeps the slot she asked for on that date', () => {
    expect(collapseDates(OPTIONS, '2026-10-14')).toEqual([{ date: '2026-10-14', slot: 'morning', rank: 1 }])
  })

  it('uses "either" for a date the venue chose', () => {
    expect(collapseDates(OPTIONS, '2026-10-21')).toEqual([{ date: '2026-10-21', slot: 'either', rank: 1 }])
  })
})
