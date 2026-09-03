'use client'

import { useActionState } from 'react'
import { CalendarDays } from 'lucide-react'
import { saveTripNotes, type TripState } from '@/app/trips/actions'
import type { RatioCheck } from '@/lib/trips/derived'

/*
  Team notes, and the attendance helper under them.

  The helper never averages: a multi-room trip shows each room's requirement
  separately, because a toddler room at 1:4 and a preschool room at 1:8 sharing
  a bus is exactly where an averaged number goes quietly wrong.
*/
export function NotesCard({
  tripId,
  notes,
  ratio,
}: {
  tripId: string
  notes: string | null
  ratio: RatioCheck
}) {
  const [state, save, pending] = useActionState<TripState, FormData>(
    saveTripNotes,
    {},
  )

  return (
    <section className="bg-surface border-border mt-4 rounded-panel border p-6">
      <div className="mb-3.5 flex items-center gap-3">
        <span className="bg-warn-tint text-warn flex h-[38px] w-[38px] flex-none items-center justify-center rounded-pill">
          <CalendarDays size={18} />
        </span>
        <h2 className="font-display text-display-sm m-0 flex-1">Team notes</h2>
      </div>

      <form action={save}>
        <input type="hidden" name="tripId" value={tripId} />
        <textarea
          name="notes"
          defaultValue={notes ?? ''}
          placeholder="Add a note for your team…"
          className="border-border-strong bg-surface text-body-sm min-h-24 w-full resize-y rounded-card border px-4 py-3.5 leading-normal outline-none"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="border-border-strong hover:border-brand text-meta rounded-menu border px-4 py-2 font-bold disabled:opacity-60"
          >
            {pending ? 'Saving…' : state.ok ? 'Saved' : 'Save note'}
          </button>
          {state.error ? (
            <span role="alert" className="text-meta text-warn">
              {state.error}
            </span>
          ) : null}
        </div>
      </form>

      <div
        className={
          ratio.ok
            ? 'bg-surface-2 text-text-strong text-meta mt-3 rounded-control px-3.5 py-3 leading-normal'
            : 'bg-warn-tint-2 text-warn text-meta mt-3 rounded-control px-3.5 py-3 leading-normal font-semibold'
        }
      >
        {ratio.ok
          ? `${ratio.have} adults, which covers what these rooms need.`
          : `${ratio.have} adults is below what these rooms need.`}{' '}
        {ratio.perRoom.map((r) => `${r.name} needs ${r.required}`).join('. ')}.
      </div>
    </section>
  )
}
