'use client'

import { useState } from 'react'

/*
  "Show full message". Spec §5.4.5.

  The thread shows the stripped body; this is the escape hatch under it. It
  exists because strip.ts is a pile of heuristics against every mail client in
  the world, and the honest thing to do about heuristics is to keep what they
  discarded one tap away rather than pretend they are always right.

  Closed by default, and it stays closed on its own: a venue's quoted copy of
  our request is not something anybody wants to scroll past twice.
*/
export function FullMessage({ full }: { full: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-meta text-brand font-semibold"
      >
        {open ? 'Hide full message' : 'Show full message'}
      </button>
      {open ? (
        <div className="border-border-soft bg-surface-3 text-meta text-text-muted mt-2 max-h-96 overflow-y-auto rounded-control border px-4 py-3 leading-relaxed whitespace-pre-wrap">
          {full}
        </div>
      ) : null}
    </div>
  )
}
