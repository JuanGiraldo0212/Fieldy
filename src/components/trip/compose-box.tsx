'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Lock, Paperclip } from 'lucide-react'
import { sendFollowUp, type TripState } from '@/app/trips/actions'

/*
  The compose box. Spec §5.4.6, design-map §5 "Compose", and the prototype's
  own markup at lines 958-972.

  Laid out as the design draws it: a 56px field with a paperclip inside it, the
  Send button beside it rather than under it, and the relay footnote below with
  its lock. Two states, exactly as the inventory lists them — empty with Send
  disabled, typed with Send enabled.

  Two departures, both logged in docs/design-gaps.md:

  1. The design's field is an `<input>`, which clips a follow-up at one line.
     This is a textarea that starts at the design's height and grows as she
     types. At rest it is the design's control, pixel for pixel; the difference
     only shows up in the case where an input would have been losing text.
  2. The design has no "sending" state. A director on a phone who taps Send and
     sees nothing change taps it again, and the venue gets the same question
     twice — so the button says "Sending…" and is disabled while the action
     runs.

  The paperclip is decoration, as it is in the prototype: sending attachments
  is not in the MVP (plan §1). It is not a button and does not pretend to be.
*/

/* The design's control height, and the field's height at rest. */
const MIN_HEIGHT = 56
const MAX_HEIGHT = 200

export function ComposeBox({
  tripId,
  /* No booking address for this venue: nothing typed here can go anywhere, and
     saying so beats a Send button that quietly writes to a drawer. */
  canSend,
  venueName,
}: {
  tripId: string
  canSend: boolean
  venueName: string
}) {
  const [state, send, pending] = useActionState<TripState, FormData>(
    sendFollowUp,
    {},
  )
  const [body, setBody] = useState('')
  const field = useRef<HTMLTextAreaElement>(null)

  /* Clear on success only. A failed send keeps what she wrote — retyping a
     paragraph because our mail provider blinked is not acceptable. */
  useEffect(() => {
    if (state.ok) setBody('')
  }, [state.ok])

  useEffect(() => {
    const el = field.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`
  }, [body])

  if (!canSend) {
    return (
      <div className="border-border-soft bg-surface-3 text-body-sm text-text-muted mt-4 rounded-card border px-4.5 py-4 leading-normal">
        {venueName} publishes no booking email, so there is nowhere to send a
        message. Their phone number is on the outing page.
      </div>
    )
  }

  const empty = body.trim() === ''

  return (
    <form action={send} className="mt-4">
      <input type="hidden" name="tripId" value={tripId} />

      <div className="flex flex-wrap items-start gap-3">
        <div className="border-border-strong bg-surface flex min-w-0 flex-1 basis-[200px] items-start gap-3 rounded-card border px-4">
          <span aria-hidden className="text-text-faint flex pt-4.5">
            <Paperclip size={18} />
          </span>
          <textarea
            ref={field}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a follow-up message…"
            rows={1}
            style={{ minHeight: MIN_HEIGHT }}
            className="text-body-sm w-full resize-none bg-transparent py-4.5 leading-normal outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending || empty}
          className="text-body h-[56px] flex-none rounded-card px-5.5 font-bold text-white bg-brand hover:bg-brand-hover disabled:bg-disabled disabled:text-disabled-ink"
        >
          {pending ? 'Sending…' : 'Send'}
        </button>
      </div>

      {state.error ? (
        <p role="alert" className="text-meta text-warn mt-2.5 font-semibold">
          {state.error}
        </p>
      ) : null}

      <div className="text-meta text-text-faint mt-3.5 flex items-center gap-2.5">
        <span aria-hidden className="flex">
          <Lock size={15} />
        </span>
        Replies appear here, and we'll email you when one arrives.
      </div>
    </form>
  )
}
