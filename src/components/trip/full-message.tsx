'use client'

import { useState } from 'react'

import { cx } from '@/components/ui'

/*
  "Show full message". Spec §5.4.5.

  The thread shows the stripped body; this is the escape hatch under it. It
  exists because strip.ts is a pile of heuristics against every mail client in
  the world, and the honest thing to do about heuristics is to keep what they
  discarded one tap away rather than pretend they are always right.

  Closed by default, and it stays closed on its own: a venue's quoted copy of
  our request is not something anybody wants to scroll past twice.
*/
export function FullMessage({
  full,
  /* Inside a venue bubble the ground is brand blue, where the usual blue link
     and off-white panel both disappear. */
  onBrand = false,
}: {
  full: string
  onBrand?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cx(
          'text-meta font-semibold',
          onBrand ? 'text-white underline' : 'text-brand',
        )}
      >
        {open ? 'Hide full message' : 'Show full message'}
      </button>
      {open ? (
        <div
          className={cx(
            'text-meta mt-2 max-h-96 overflow-y-auto rounded-control border px-4 py-3 leading-relaxed whitespace-pre-wrap',
            onBrand
              ? 'border-brand-solid bg-brand-solid text-white'
              : 'border-border-soft bg-surface-3 text-text-muted',
          )}
        >
          {full}
        </div>
      ) : null}
    </div>
  )
}
