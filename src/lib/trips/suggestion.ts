import {
  SUGGESTION_CONFIDENCE_FLOOR,
  type DateOption,
  type Suggestion,
} from '@/lib/schemas'
import { formatTime } from '@/lib/classify/dates'
import { shortDate } from './asks'

/*
  What the banner shows, and which message it shows it for. Plan §5.6,
  spec §5.5, design-map §7 "Suggestion banner". Pure, so the copy and the
  choice of message are tested without a page.
*/

export type SuggestedMessage = {
  id: string
  party: 'educator' | 'venue' | 'system'
  sentAt: Date
  suggestion: Suggestion | null
}

/*
  The one banner a trip page may show. Plan §5.6: "only the newest undismissed
  venue suggestion is shown", `unclear` shows nothing, and anything under the
  confidence floor is `unclear` by definition.

  Newest first: a venue that confirmed on Monday and then wrote "actually,
  could we make it the 21st?" on Tuesday has one live suggestion, Tuesday's.
  Monday's is not dismissed, but it is superseded, and showing "Mark
  confirmed" under a message that asked to move would be wrong.
*/
export function openSuggestion<T extends SuggestedMessage>(messages: T[]): T | null {
  const newest = [...messages]
    .filter((m) => m.party === 'venue' && m.suggestion)
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())[0]
  if (!newest || !newest.suggestion) return null

  const s = newest.suggestion
  if (s.dismissed_at) return null
  if (s.intent === 'unclear') return null
  if (s.confidence != null && s.confidence < SUGGESTION_CONFIDENCE_FLOOR) return null
  return newest
}

/*
  The date a confirmation lands on. The venue's, when it named one that is
  ours; otherwise the first choice, which is what "confirmed" with no date
  means in a reply to a request that led with it. Plan §5.6: "the banner
  offers the first date option".
*/
export function confirmedDateFor(
  suggestion: Suggestion,
  dateOptions: DateOption[],
): string | null {
  const own = suggestion.dates?.[0]
  if (own) return own
  return [...dateOptions].sort((a, b) => a.rank - b.rank)[0]?.date ?? null
}

/* The banner's one sentence. Copy verbatim from the design. */
export function bannerText(
  suggestion: Suggestion,
  dateOptions: DateOption[],
): string {
  switch (suggestion.intent) {
    case 'confirmed': {
      const date = confirmedDateFor(suggestion, dateOptions)
      const when = date ? shortDate(date) : 'your date'
      const at = suggestion.time ? ` at ${formatTime(suggestion.time)}` : ''
      return `Looks like the venue confirmed ${when}${at}.`
    }
    case 'proposed_dates': {
      const dates = (suggestion.dates ?? []).map(shortDate)
      return `The venue suggested ${dates.join(' or ')} instead.`
    }
    case 'declined':
      return 'It sounds like the venue cannot take this booking.'
    case 'unclear':
      return ''
  }
}

/* Dismiss labels are per intent. Design-map §7. */
export function dismissLabel(intent: Suggestion['intent']): string {
  return intent === 'proposed_dates' ? 'Neither' : 'Not quite'
}

/*
  The reply pre-filled into the compose box after "Move to {date}". Plan
  §5.6, verbatim. The director can send it or edit it; nothing goes out
  until she taps Send.
*/
export function acceptanceReply({
  date,
  childrenCount,
  adultsCount,
  name,
}: {
  date: string
  childrenCount: number
  adultsCount: number
  name: string
}): string {
  return [
    'Hi,',
    '',
    `${shortDate(date)} works for us — please go ahead and hold it. Same group: ${childrenCount} children with ${adultsCount} adults.`,
    '',
    'Thank you,',
    name,
  ].join('\n')
}

/*
  The trip's date options after a suggestion is applied: one date, first
  choice, keeping the slot the director asked for on that date when she did,
  and "either" when the venue picked a day we never listed.
*/
export function collapseDates(
  dateOptions: DateOption[],
  date: string,
): DateOption[] {
  const existing = dateOptions.find((d) => d.date === date)
  return [{ date, slot: existing?.slot ?? 'either', rank: 1 }]
}
