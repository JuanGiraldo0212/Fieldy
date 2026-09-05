import { Mail, Paperclip } from 'lucide-react'
import { signedUrl } from '@/lib/email/storage'
import type { Attachment } from '@/lib/schemas'
import { requestAskLine, requestDateLine, shortDate } from '@/lib/trips/asks'
import type { Ask, DateOption } from '@/lib/schemas'
import { FullMessage } from './full-message'

/*
  The conversation. Spec §5.4.5, design-map §5 "Thread".

  Three kinds of thing appear here and they are visually different weights,
  deliberately:

  - The **opening request** is a summary card, not a wall of text. A director
    who wrote it does not need to re-read it; she needs to see at a glance what
    she asked and when.
  - **Messages** — hers and the venue's — are the record. Spec §6: "Educator and
    venue messages align the same way, distinguished by avatar. This is a
    shared record, not a chat bubble app." So no left/right, no tails, no
    colour-coded sides.
  - **System events** are thin grey rules. Lighter than a message, because
    nobody said them.

  The stripped body is what shows. `body_full` sits behind "Show full message"
  for the case where the stripping took something it should not have — see
  strip.ts, which is written to prefer untidy over lossy.
*/

export type ThreadMessage = {
  id: string
  party: 'educator' | 'venue' | 'system'
  authorName: string
  body: string
  bodyFull: string | null
  isRequest: boolean
  sentAt: Date
  readAt: Date | null
  attachments: Attachment[]
  sendError: string | null
}

export async function Thread({
  messages,
  dateOptions,
  asks,
  waitingOnVenue,
  undelivered,
}: {
  messages: ThreadMessage[]
  dateOptions: DateOption[]
  asks: Ask[]
  waitingOnVenue: boolean
  /* The opening request never left. The thread says so instead of implying a
     venue is being slow. */
  undelivered: boolean
}) {
  /*
    "Newest reply" marks one message and only one: the most recent thing the
    venue said. A highlight on every venue message would highlight nothing.
  */
  const newestVenueId =
    [...messages].reverse().find((m) => m.party === 'venue')?.id ?? null

  /* Signed here, at render, and good for an hour. Object keys are stored on the
     row; URLs are never stored, because a stored URL is a private bucket with a
     permanent hole in it. */
  const links = await signAttachments(messages)

  return (
    <div className="flex flex-col">
      {messages.map((m) => {
        if (m.party === 'system') return <SystemLine key={m.id} body={m.body} />
        if (m.isRequest) {
          return (
            <RequestCard
              key={m.id}
              message={m}
              dateOptions={dateOptions}
              asks={asks}
              undelivered={undelivered}
            />
          )
        }
        return (
          <MessageRow
            key={m.id}
            message={m}
            newest={m.id === newestVenueId}
            links={links}
          />
        )
      })}

      {waitingOnVenue ? (
        <div className="flex items-center gap-3 py-4">
          <span aria-hidden className="border-border flex-1 border-t border-dashed" />
          <span className="text-body-sm text-text-faint">
            Waiting for venue reply…
          </span>
          <span aria-hidden className="border-border flex-1 border-t border-dashed" />
        </div>
      ) : null}
    </div>
  )
}

/* ─── The opening request ────────────────────────────────────────────────── */

function RequestCard({
  message: m,
  dateOptions,
  asks,
  undelivered,
}: {
  message: ThreadMessage
  dateOptions: DateOption[]
  asks: Ask[]
  undelivered: boolean
}) {
  return (
    <div
      id={`msg-${m.id}`}
      className="bg-surface-3 flex gap-4 rounded-thumb px-5 py-4.5 scroll-mt-24"
    >
      <span
        aria-hidden
        className="bg-brand-tint-2 text-brand flex h-10 w-10 flex-none items-center justify-center rounded-pill"
      >
        <Mail size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span className="text-body font-bold">
            {undelivered ? 'Request written' : 'Request sent'}
          </span>
          <span className="text-meta text-text-faint">
            {shortDate(m.sentAt.toISOString().slice(0, 10))}
          </span>
        </div>
        <div className="text-body-sm text-text-strong mt-1.5">
          {requestDateLine(dateOptions)}
        </div>
        <div className="text-body-sm text-text-strong mt-0.5">
          {requestAskLine(asks)}
        </div>
        <div className="bg-surface text-body-sm text-text mt-3 rounded-control px-4 py-3.5 leading-relaxed whitespace-pre-wrap">
          {m.body}
        </div>
      </div>
    </div>
  )
}

/* ─── A message ──────────────────────────────────────────────────────────── */

function MessageRow({
  message: m,
  newest,
  links,
}: {
  message: ThreadMessage
  newest: boolean
  links: Map<string, string | null>
}) {
  const unread = m.party === 'venue' && m.readAt == null
  const venue = m.party === 'venue'

  return (
    <div
      id={`msg-${m.id}`}
      className={
        newest
          ? 'border-brand-tint bg-brand-tint/35 mt-3 flex gap-4 rounded-thumb border px-5 py-4.5 scroll-mt-24'
          : 'mt-3 flex gap-4 rounded-thumb px-5 py-4.5 scroll-mt-24'
      }
    >
      <span
        aria-hidden
        className={
          venue
            ? 'bg-success-tint text-success text-body-sm flex h-10 w-10 flex-none items-center justify-center rounded-pill font-bold'
            : 'bg-brand-tint-2 text-brand text-body-sm flex h-10 w-10 flex-none items-center justify-center rounded-pill font-bold'
        }
      >
        {initials(m.authorName)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-body font-bold">{m.authorName}</span>
          <span className="text-meta text-text-faint">{when(m.sentAt)}</span>
          {unread ? (
            <span
              aria-label="Unread"
              className="bg-brand h-2 w-2 flex-none rounded-pill"
            />
          ) : null}
          {newest ? (
            <span className="bg-brand-tint text-brand text-label ml-auto rounded-pill px-2.5 py-1 font-bold">
              Newest reply
            </span>
          ) : null}
        </div>

        {m.sendError ? (
          <div className="text-meta text-warn mt-1.5 font-semibold">
            {m.sendError} It has not reached the venue.
          </div>
        ) : null}

        <div className="text-body-sm text-text mt-2 leading-relaxed whitespace-pre-wrap">
          {m.body}
        </div>

        {/* Only when there is genuinely more to see. A toggle that expands to
            the same text is a toggle nobody trusts a second time. */}
        {m.bodyFull && m.bodyFull.trim() !== m.body.trim() ? (
          <FullMessage full={m.bodyFull} />
        ) : null}

        {m.attachments.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {m.attachments.map((a) => (
              <AttachmentChip
                key={a.url}
                attachment={a}
                href={links.get(a.url) ?? null}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* ─── An attachment ──────────────────────────────────────────────────────── */

export function AttachmentChip({
  attachment: a,
  href,
}: {
  attachment: Attachment
  href: string | null
}) {
  const label = (
    <>
      <Paperclip size={15} />
      <span className="truncate">{a.name}</span>
      {a.size != null ? (
        <span className="text-text-faint flex-none">{fileSize(a.size)}</span>
      ) : null}
    </>
  )

  const shell =
    'text-meta border-border-soft bg-surface flex max-w-[260px] items-center gap-2 rounded-pill border px-3.5 py-2 font-semibold'

  /*
    A chip with no link still names the file. The venue sent something called
    "Booking form.pdf" and could not be fetched, and knowing that is what lets a
    director ask for it again — see storeAttachments in inbound.ts.
  */
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${shell} text-text-strong hover:border-brand no-underline`}
    >
      {label}
    </a>
  ) : (
    <span className={`${shell} text-text-faint`} title="This file could not be opened. Ask the venue to send it again.">
      {label}
    </span>
  )
}

/* ─── A system event ─────────────────────────────────────────────────────── */

function SystemLine({ body }: { body: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span aria-hidden className="border-border flex-1 border-t border-dashed" />
      <span className="text-meta text-text-faint text-center">{body}</span>
      <span aria-hidden className="border-border flex-1 border-t border-dashed" />
    </div>
  )
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

async function signAttachments(
  messages: ThreadMessage[],
): Promise<Map<string, string | null>> {
  const keys = messages.flatMap((m) => m.attachments.map((a) => a.url))
  const signed = await Promise.all(keys.map((k) => signedUrl(k)))
  return new Map(keys.map((k, i) => [k, signed[i] ?? null]))
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]![0]!
  const last = parts.length > 1 ? parts.at(-1)![0]! : ''
  return (first + last).toUpperCase()
}

/*
  A time a person reads, not a timestamp. Today's messages want the hour;
  anything older wants the day, because "which day did they answer" is the
  question a week-old reply raises.
*/
function when(at: Date): string {
  const today = new Date()
  const sameDay =
    at.getFullYear() === today.getFullYear() &&
    at.getMonth() === today.getMonth() &&
    at.getDate() === today.getDate()

  if (sameDay) {
    return at.toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  return shortDate(
    `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`,
  )
}

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
