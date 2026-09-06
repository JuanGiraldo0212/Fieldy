import { Paperclip } from 'lucide-react'
import { signedUrl } from '@/lib/email/storage'
import type { Attachment } from '@/lib/schemas'
import { shortDate } from '@/lib/trips/asks'
import { cx } from '@/components/ui'

/*
  The conversation. Spec §5.4.5, design-map §5 "Thread".

  Two kinds of thing appear here:

  - **Messages** — hers and the venue's — laid out as a chat: hers on the
    right in white, the venue's on the left in light blue, on the pane's grey
    ground. This departs from spec §6 ("align the same way … not a chat bubble
    app") on the product owner's instruction; the avatar and the name still
    carry the identity, so nothing that was doing work was dropped. The
    opening request is one of these and nothing more — it is a message she
    wrote, and it reads like one.
  - **System events** are thin grey rules. Lighter than a message, because
    nobody said them.

  What shows is the stripped body. `body_full` is stored and no longer
  surfaced: "Show full message" was removed on the product owner's
  instruction, so a body strip.ts got wrong is now only visible in the
  database. See docs/design-gaps.md 36.
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
  waitingOnVenue,
}: {
  messages: ThreadMessage[]
  waitingOnVenue: boolean
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
      {messages.map((m) =>
        m.party === 'system' ? (
          <SystemLine key={m.id} body={m.body} />
        ) : (
          <MessageRow
            key={m.id}
            message={m}
            newest={m.id === newestVenueId}
            links={links}
          />
        ),
      )}

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
  const venue = m.party === 'venue'
  const unread = venue && m.readAt == null

  return (
    <div
      id={`msg-${m.id}`}
      className={cx(
        'mt-3 flex gap-2.5 scroll-mt-24',
        venue ? 'justify-start' : 'flex-row-reverse',
      )}
    >
      <span
        aria-hidden
        className={cx(
          'text-body-sm flex h-9 w-9 flex-none items-center justify-center rounded-pill font-bold',
          venue
            ? 'bg-success-tint text-success'
            : 'border-border bg-surface text-brand border',
        )}
      >
        {initials(m.authorName)}
      </span>

      <div className="min-w-0 max-w-[78%]">
        <div
          className={cx(
            'flex flex-wrap items-baseline gap-x-2.5 gap-y-1',
            !venue && 'flex-row-reverse',
          )}
        >
          <span className="text-body-sm font-bold">{m.authorName}</span>
          <span className="text-meta text-text-faint">{when(m.sentAt)}</span>
          {unread ? (
            <span
              aria-label="Unread"
              className="bg-brand h-2 w-2 flex-none rounded-pill"
            />
          ) : null}
          {newest ? (
            <span className="bg-brand-tint text-brand text-label rounded-pill px-2.5 py-1 font-bold">
              Newest reply
            </span>
          ) : null}
        </div>

        {/* The bubble. The clipped corner points at its own avatar, which is
            what tells the two sides apart at a glance on a narrow phone where
            the width difference is small. */}
        <div
          className={cx(
            'mt-1.5 rounded-card px-4 py-3',
            venue
              ? 'bg-chat-them border-chat-them-border text-info-ink rounded-tl-check border'
              : 'bg-surface border-border text-text rounded-tr-check border',
          )}
        >
          {m.sendError ? (
            <div className="text-meta text-warn mb-1.5 font-semibold">
              {m.sendError} It has not reached the venue.
            </div>
          ) : null}

          <div className="text-body-sm leading-relaxed whitespace-pre-wrap">
            {m.body}
          </div>

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
