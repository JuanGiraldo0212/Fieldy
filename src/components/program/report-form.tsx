'use client'

import { useState } from 'react'
import { CircleCheck } from 'lucide-react'

/*
  "Something wrong? Tell us" — one tap, per spec §5.2.

  The design has only the link; the form is a gap (docs/design-gaps.md). Built
  plainly, and built to be answerable in about ten seconds: the fields on this
  page are offered as choices so a director does not have to describe which
  detail she means, and the note is optional. Requiring a paragraph would mean
  we mostly do not get told.
*/

export function ReportForm({
  programId,
  venueId,
  checkedOn,
  fields,
  venueUrl,
  phone,
}: {
  programId: string
  venueId: string
  checkedOn: string
  /* The labels shown on this page, so "which one is wrong" is a tap. */
  fields: string[]
  venueUrl: string | null
  phone: string | null
}) {
  const [open, setOpen] = useState(false)
  const [field, setField] = useState('')
  const [note, setNote] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!field && !note.trim()) {
      setError('Pick a detail or write a line, then send.')
      return
    }
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program_id: programId,
          venue_id: venueId,
          field: field || null,
          note: note || null,
        }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setError(body.error ?? 'Could not send that. Try again in a moment.')
        setState('error')
        return
      }
      setState('done')
    } catch {
      setError('Could not send that. Check your connection and try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="bg-success-tint text-success text-body-sm mt-2 flex items-center gap-2.5 rounded-control px-3.5 py-2.5">
        <CircleCheck size={18} />
        Thanks. We will re-check this venue this week.
      </div>
    )
  }

  return (
    <div className="mt-3.5 px-1">
      <p className="text-meta text-text-muted leading-relaxed [overflow-wrap:anywhere]">
        Details checked on {checkedOn} against the venue&rsquo;s own pages.
        Something wrong?{' '}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-brand font-semibold underline"
        >
          Tell us
        </button>
        , it takes one tap.
        {venueUrl ? (
          <>
            {' · '}
            <a href={venueUrl} target="_blank" rel="noreferrer">
              Venue page
            </a>
          </>
        ) : null}
        {phone ? <> · {phone}</> : null}
      </p>

      {open ? (
        <form
          onSubmit={submit}
          className="bg-surface border-border mt-3 rounded-card border p-4"
        >
          <fieldset className="border-0 p-0">
            <legend className="text-body-sm mb-2 font-bold">
              What have we got wrong?
            </legend>

            <div className="flex flex-wrap gap-2">
              {fields.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={field === f}
                  onClick={() => setField(field === f ? '' : f)}
                  className={
                    field === f
                      ? 'bg-brand-tint-2 text-brand text-meta rounded-pill px-3 py-1.5 font-semibold ring-[1.5px] ring-[var(--color-brand)] ring-inset'
                      : 'border-border-strong bg-surface text-meta hover:border-brand rounded-pill border px-3 py-1.5 font-semibold'
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            <label className="mt-3 block">
              <span className="sr-only">What is wrong</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="What did you find? Even one line helps."
                className="border-border-strong bg-surface text-body-sm w-full rounded-control border p-3 outline-none"
              />
            </label>
          </fieldset>

          {error ? (
            <p className="text-meta text-warn mt-2" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={state === 'sending'}
              className="bg-brand hover:bg-brand-hover text-body-sm rounded-pill px-5 py-2.5 font-bold text-white disabled:opacity-60"
            >
              {state === 'sending' ? 'Sending' : 'Send'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-body-sm text-text-muted font-semibold"
            >
              Cancel
            </button>
            {/* No login needed, and worth saying so: asking someone to sign in
                to tell us we are wrong means we mostly do not get told. */}
            <span className="text-meta-sm text-text-faint ml-auto">
              No account needed
            </span>
          </div>
        </form>
      ) : null}
    </div>
  )
}
