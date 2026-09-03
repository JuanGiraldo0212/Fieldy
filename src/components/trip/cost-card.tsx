'use client'

import { useActionState, useState } from 'react'
import { HandCoins } from 'lucide-react'
import { saveTripCosts, type TripState } from '@/app/trips/actions'
import { money } from '@/lib/catalog/feasibility'
import { totalCost } from '@/lib/trips/derived'

/*
  Estimated cost. Spec §5.4.3: "Editable numbers, because reality differs. A
  flag when a component is unknown."

  The flag is the point. A missing component counts as zero in the arithmetic,
  which means the total is a floor, and a director who budgets against a total
  that quietly left out the bus has been misled by us.
*/

const ROWS = [
  { name: 'costChild', label: 'Admission, per child' },
  { name: 'costAdult', label: 'Admission, per adult' },
  { name: 'costGroupFee', label: 'Group fee' },
  { name: 'costTransport', label: 'Transport' },
] as const

export function CostCard({
  tripId,
  costs,
  childrenCount,
  adultsCount,
}: {
  tripId: string
  costs: Record<(typeof ROWS)[number]['name'], string | null>
  childrenCount: number
  adultsCount: number
}) {
  const [state, save, pending] = useActionState<TripState, FormData>(
    saveTripCosts,
    {},
  )
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(ROWS.map((r) => [r.name, costs[r.name] ?? ''])),
  )

  const num = (v: string) => (v.trim() === '' ? null : Number(v))
  const total = totalCost(
    {
      childCost: num(values.costChild ?? ''),
      adultCost: num(values.costAdult ?? ''),
      groupFee: num(values.costGroupFee ?? ''),
      transport: num(values.costTransport ?? ''),
    },
    childrenCount,
    adultsCount,
  )
  const anyKnown = ROWS.some((r) => (values[r.name] ?? '').trim() !== '')

  return (
    <form
      action={save}
      className="bg-surface border-border flex flex-1 flex-col rounded-panel border p-6"
    >
      <input type="hidden" name="tripId" value={tripId} />

      <div className="mb-4 flex flex-wrap items-center gap-3.5">
        <span className="bg-success-tint text-success flex h-[38px] w-[38px] flex-none items-center justify-center rounded-pill">
          <HandCoins size={19} />
        </span>
        <h2 className="font-display text-display-sm m-0 flex-1">Estimated cost</h2>
        {anyKnown ? (
          <span className="font-display text-[24px] font-bold">
            {money(total.total)}
          </span>
        ) : null}
      </div>

      {anyKnown ? null : (
        <>
          <div className="text-body-lg font-bold">Not confirmed yet</div>
          <div className="text-body-sm text-text-muted mt-1.5 leading-normal">
            We will fill this in once the venue replies. You can also type what
            you already know.
          </div>
        </>
      )}

      <div className="mt-4 flex flex-col gap-2.5">
        {ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-2.5">
            <label
              htmlFor={`${r.name}-${tripId}`}
              className="text-body-sm min-w-0 flex-1"
            >
              {r.label}
            </label>
            <span className="text-body-sm text-text-faint">$</span>
            <input
              id={`${r.name}-${tripId}`}
              name={r.name}
              inputMode="decimal"
              value={values[r.name] ?? ''}
              onChange={(e) =>
                setValues((v) => ({ ...v, [r.name]: e.target.value }))
              }
              className="border-border-strong bg-surface text-body-sm h-10 w-[76px] rounded-menu border px-2.5 text-right outline-none"
            />
          </div>
        ))}
      </div>

      <div className="border-border-soft text-body-sm text-text-muted mt-3 border-t pt-3">
        {anyKnown
          ? `${money(total.perChild)} a child for ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'}.`
          : 'Nothing entered yet.'}
        {total.incomplete && anyKnown ? (
          <span className="text-warn ml-1 font-semibold">
            Some of this is still blank, so the total is a floor rather than the
            answer.
          </span>
        ) : null}
      </div>

      {state.error ? (
        <p role="alert" className="text-meta text-warn mt-2">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="border-border-strong hover:border-brand text-meta mt-3 self-start rounded-menu border px-4 py-2 font-bold disabled:opacity-60"
      >
        {pending ? 'Saving…' : state.ok ? 'Saved' : 'Save costs'}
      </button>
    </form>
  )
}
