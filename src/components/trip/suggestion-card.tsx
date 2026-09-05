'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { applySuggestion, type TripState } from '@/app/trips/actions'
import type { DateOption, Suggestion } from '@/lib/schemas'
import { shortDate } from '@/lib/trips/asks'
import { bannerText, dismissLabel } from '@/lib/trips/suggestion'

/*
  The suggestion banner. Spec §5.5, plan §5.6, design-map §5 "Suggestion
  banner", and the prototype's own markup at lines 802-816.

  "A soft card between the header and the cost summary. One sentence, the
  action buttons, and a smaller evidence line quoting the sentence the
  reading came from, so the user can check the machine's work."

  Three intents are drawn and built: confirmed, proposed dates, declined.
  `unclear` is not drawn and renders nothing — the page never mounts this
  for it. The evidence is always shown, in curly quotes, in the note ink the
  design uses: the director must be able to check what we read against what
  the venue wrote.

  One form, one action, several submit buttons that differ by their `value`.
  Every button disables while any of them is pending, because two taps on
  "Mark confirmed" must not write two system messages.
*/
export function SuggestionCard({
  messageId,
  suggestion,
  dateOptions,
  /* For "Find a similar program": the catalog filtered to this category. */
  similarHref,
}: {
  messageId: string
  suggestion: Suggestion
  dateOptions: DateOption[]
  similarHref: string
}) {
  const [state, action, pending] = useActionState<TripState, FormData>(
    applySuggestion,
    {},
  )

  if (suggestion.intent === 'unclear' || suggestion.dismissed_at) return null

  const text = bannerText(suggestion, dateOptions)
  const button =
    'text-body rounded-card px-4.5 py-3 font-bold text-white bg-brand hover:bg-brand-hover disabled:bg-disabled disabled:text-disabled-ink'

  return (
    <form
      action={action}
      aria-label="Suggestion from the venue's reply"
      className="bg-relay-tint border-note-border mt-4 rounded-card-lg border px-5.5 py-5"
    >
      <input type="hidden" name="messageId" value={messageId} />

      <div className="text-[17px] leading-normal">{text}</div>
      <div className="text-body-sm text-note-ink mt-1 mb-3.5 leading-normal">
        “{suggestion.evidence}”
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {suggestion.intent === 'confirmed' ? (
          <button type="submit" name="choice" value="confirm" disabled={pending} className={button}>
            Mark confirmed
          </button>
        ) : null}

        {suggestion.intent === 'proposed_dates'
          ? (suggestion.dates ?? []).map((d) => (
              <button
                key={d}
                type="submit"
                name="choice"
                value={`move:${d}`}
                disabled={pending}
                className={button}
              >
                Move to {shortDate(d)}
              </button>
            ))
          : null}

        {suggestion.intent === 'declined' ? (
          <button type="submit" name="choice" value="cancel" disabled={pending} className={button}>
            Mark cancelled
          </button>
        ) : null}

        <button
          type="submit"
          name="choice"
          value="dismiss"
          disabled={pending}
          className="text-body border-border-strong bg-surface hover:border-brand rounded-card border px-4.5 py-3 font-bold disabled:text-disabled-ink"
        >
          {dismissLabel(suggestion.intent)}
        </button>

        {suggestion.intent === 'declined' ? (
          <Link
            href={similarHref}
            className="text-body text-brand px-1 py-2.5 font-semibold no-underline"
          >
            Find a similar program
          </Link>
        ) : null}
      </div>

      {state.error ? (
        <p role="alert" className="text-meta text-warn mt-3 font-semibold">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
