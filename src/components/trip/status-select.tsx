'use client'

import { useActionState } from 'react'
import { setTripStatus, type TripState } from '@/app/trips/actions'
import { STATUS_LABEL, type TripStatus } from '@/lib/trips/derived'

/*
  Changing the status by hand.

  The design's rail is read only and has no control for this, so this is
  invented in the design's language and logged in docs/design-gaps.md: the rail
  stays exactly as drawn, and a small select sits under it with the source line
  the spec asks for.

  A select rather than a tap-to-change on the rail step, for one reason:
  `cancelled` is a real status and is deliberately not on the rail. A control
  that can only reach the four drawn steps cannot cancel a trip, and cancelling
  is the thing a director most needs to do without asking us.
*/

const OPTIONS: TripStatus[] = [
  'requested',
  'replied',
  'confirmed',
  'done',
  'cancelled',
]

export function StatusSelect({
  tripId,
  status,
  source,
}: {
  tripId: string
  status: TripStatus
  source: 'system' | 'manual'
}) {
  const [state, action, pending] = useActionState<TripState, FormData>(
    setTripStatus,
    {},
  )

  return (
    <form
      action={action}
      className="border-border-soft mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
    >
      <input type="hidden" name="tripId" value={tripId} />
      <label htmlFor={`status-${tripId}`} className="text-body-sm font-semibold">
        Status
      </label>
      <select
        id={`status-${tripId}`}
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="border-border-strong bg-surface text-body-sm h-select cursor-pointer rounded-menu border px-3 font-semibold"
      >
        {OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      {/* No JavaScript: the select cannot submit itself, so keep a button. */}
      <noscript>
        <button
          type="submit"
          className="border-border-strong text-meta rounded-menu border px-3 py-2 font-bold"
        >
          Change
        </button>
      </noscript>

      {/* The spec offers two lines, "moved here when the venue replied" and
          "set by you". A third is needed: a brand new trip is `system` too,
          and no venue has replied to it, so claiming one did would be a small
          lie on the very first screen. */}
      <span className="text-meta text-text-faint">
        {source === 'manual'
          ? 'set by you'
          : status === 'requested'
            ? 'set when the request went out'
            : 'moved here when the venue replied'}
      </span>

      {state.error ? (
        <span role="alert" className="text-meta text-warn basis-full">
          {state.error}
        </span>
      ) : null}
    </form>
  )
}
