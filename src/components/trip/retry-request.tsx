'use client'

import { useActionState } from 'react'
import { retryRequest, type TripState } from '@/app/trips/actions'

/*
  "Try again", under the amber banner on a trip whose request never left.
  Plan M6. The design has no failure states at all, so this is the banner's
  own language: one outlined button, and the reason under it if it fails
  again. Disabled while it runs, because two taps are two sends.
*/
export function RetryRequestButton({ tripId }: { tripId: string }) {
  const [state, action, pending] = useActionState<TripState, FormData>(
    retryRequest,
    {},
  )
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="tripId" value={tripId} />
      <button
        type="submit"
        disabled={pending}
        className="text-body-sm border-warn-border bg-surface hover:border-warn rounded-pill border px-4 py-2.5 font-bold disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Try sending again'}
      </button>
      {state.error ? (
        <p role="alert" className="text-meta text-warn mt-2 font-semibold">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
