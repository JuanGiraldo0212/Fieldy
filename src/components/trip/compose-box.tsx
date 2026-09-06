'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Lock, Paperclip, X } from 'lucide-react'
import { sendFollowUp, type TripState } from '@/app/trips/actions'
import { checkUploads, fileSize, MAX_UPLOAD_FILES } from '@/lib/email/uploads'

/*
  The compose box. Spec §5.4.6, design-map §5 "Compose", and the prototype's
  own markup at lines 958-972.

  Laid out as the design draws it: a 56px field with a paperclip inside it,
  the Send button beside it rather than under it, and the relay footnote
  below with its lock. Two states, exactly as the inventory lists them —
  empty with Send disabled, typed with Send enabled.

  Departures, all logged in docs/design-gaps.md:

  1. The design's field is an `<input>`, which clips a follow-up at one line.
     This is a textarea that starts at the design's height and grows.
  2. The design has no "sending" state. The button says "Sending…" and is
     disabled while the action runs, so a double tap is not two emails.
  3. The paperclip is now a real control. It was decoration in the prototype
     and in slices 5 to 8; it opens a file picker, and the chosen files show
     as chips above the footnote, each with a remove. The same limits the
     server applies (src/lib/email/uploads.ts) are checked here first, so a
     file that will be refused is refused before anything is typed.
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
  /* Pre-filled text, from "Move to {date}" on the suggestion banner. Plan
     §5.6: "a reply the user can send or edit". Hers to change; nothing goes
     out until she taps Send. */
  initialBody = '',
}: {
  tripId: string
  canSend: boolean
  venueName: string
  initialBody?: string
}) {
  const [state, send, pending] = useActionState<TripState, FormData>(
    sendFollowUp,
    {},
  )
  const [body, setBody] = useState(initialBody)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const field = useRef<HTMLTextAreaElement>(null)
  const picker = useRef<HTMLInputElement>(null)

  /* Clear on success only. A failed send keeps what she wrote — retyping a
     paragraph because our mail provider blinked is not acceptable. */
  useEffect(() => {
    if (state.ok) {
      setBody('')
      setFiles([])
      if (picker.current) picker.current.value = ''
    }
  }, [state.ok])

  /* A pre-filled reply is the reason she is looking at this box, so it
     should be in view and ready to send rather than below the fold. */
  useEffect(() => {
    if (initialBody && field.current) {
      field.current.scrollIntoView({ block: 'center' })
      field.current.focus({ preventScroll: true })
    }
  }, [initialBody])

  useEffect(() => {
    const el = field.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`
  }, [body])

  /*
    The file input is the form's source of truth — it is what the action
    receives — and `files` mirrors it for the chips. Removing a chip rewrites
    the input through a DataTransfer, which is the only way to take one file
    out of an input without clearing it.
  */
  const syncPicker = (next: File[]) => {
    setFiles(next)
    if (!picker.current) return
    const dt = new DataTransfer()
    for (const f of next) dt.items.add(f)
    picker.current.files = dt.files
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? [])
    const next = [...files, ...chosen.filter((c) => !files.some((f) => f.name === c.name && f.size === c.size))]
    const check = checkUploads(next)
    if (!check.ok) {
      setFileError(check.error)
      syncPicker(files)
      return
    }
    setFileError('')
    syncPicker(next)
  }

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
          <label
            className="text-text-faint hover:text-brand flex cursor-pointer pt-4.5"
            title={`Attach a file (up to ${MAX_UPLOAD_FILES}, 10 MB each)`}
          >
            <Paperclip size={18} />
            <span className="sr-only">Attach a file</span>
            <input
              ref={picker}
              type="file"
              name="files"
              multiple
              onChange={onPick}
              className="sr-only"
            />
          </label>
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

      {files.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {files.map((f) => (
            <span
              key={`${f.name}-${f.size}`}
              className="text-meta border-border-soft bg-surface text-text-strong flex max-w-[260px] items-center gap-2 rounded-pill border py-1.5 pr-1.5 pl-3.5 font-semibold"
            >
              <Paperclip size={14} />
              <span className="truncate">{f.name}</span>
              <span className="text-text-faint flex-none">{fileSize(f.size)}</span>
              <button
                type="button"
                onClick={() => {
                  setFileError('')
                  syncPicker(files.filter((x) => x !== f))
                }}
                aria-label={`Remove ${f.name}`}
                className="text-text-faint hover:text-danger flex h-6 w-6 items-center justify-center rounded-pill"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {fileError || state.error ? (
        <p role="alert" className="text-meta text-warn mt-2.5 font-semibold">
          {fileError || state.error}
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
