'use client'

import { useActionState } from 'react'
import { Heart } from 'lucide-react'
import { toggleSaved, type SaveState } from '@/app/outing/actions'
import { cx } from '@/components/ui'

/*
  Save, on the outing page. A form rather than an onClick, so it works before
  any JavaScript loads.

  A signed-out visitor sees the button and is told what it needs, rather than
  having it hidden. Browsing is open to everyone; only keeping things is not.
*/
export function SaveButton({
  programId,
  saved,
}: {
  programId: string
  saved: boolean
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(
    toggleSaved,
    { saved },
  )
  const on = state.saved ?? saved

  return (
    <form action={action}>
      <input type="hidden" name="programId" value={programId} />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={on}
        className={cx(
          'text-body flex min-h-[52px] items-center gap-2.5 rounded-pill border px-6 font-bold disabled:opacity-70',
          on
            ? 'border-brand bg-brand-tint text-brand'
            : 'border-border-strong bg-surface hover:border-brand',
        )}
      >
        <span className="text-brand flex">
          <Heart size={18} fill={on ? 'currentColor' : 'none'} />
        </span>
        {on ? 'Saved' : 'Save'}
      </button>
      {state.error ? (
        <p role="alert" className="text-meta text-warn mt-1.5">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
