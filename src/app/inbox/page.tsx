import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Inbox as InboxIcon } from 'lucide-react'
import { getViewer } from '@/lib/auth'
import { fetchInbox } from '@/lib/trips/fetch'
import { shortDate } from '@/lib/trips/asks'
import { groupByDay, preview, type InboxItem } from '@/lib/trips/inbox'

/*
  The inbox. Spec §5.7, and a gap: the design has no frame for it, so this
  is built in the language of the My trips rows and the thread — the same
  avatars, the same unread dot, the same "venue · program" line.

  "A single list of all messages across trips, newest first, grouped by day.
  Each row: venue name, trip name and date, stripped body preview, party.
  Tapping opens the trip page scrolled to that message. It is a list, not a
  mail client."

  Nothing here is marked read. The trip page does that after it renders,
  which is what makes the dot on a row survive until she has actually seen
  the message.
*/
export default async function InboxPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=%2Finbox')
  if (!viewer.centreId) redirect('/welcome')

  const rows = await fetchInbox(viewer.centreId)
  const items: InboxItem[] = rows.map((r) => ({
    id: r.id,
    tripId: r.tripId,
    party: r.party as 'educator' | 'venue',
    authorName: r.authorName,
    body: r.body,
    sentAt: r.sentAt,
    readAt: r.readAt,
    programName: r.programName,
    venueName: r.venueName,
    tripDate:
      r.confirmedDate ??
      [...r.dateOptions].sort((a, b) => a.rank - b.rank)[0]?.date ??
      null,
  }))
  const days = groupByDay(items, new Date())
  const unread = items.filter((i) => i.party === 'venue' && i.readAt == null).length

  return (
    <main className="mx-auto max-w-[1000px] px-5 pt-7 pb-16">
      <div className="mb-5.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="font-display text-display-lg m-0">Inbox</h1>
        <span className="text-body text-text-muted">
          {unread === 0
            ? 'Nothing unread'
            : `${unread} unread ${unread === 1 ? 'reply' : 'replies'}`}
        </span>
      </div>

      {days.length === 0 ? (
        <div className="bg-surface border-border rounded-panel border px-7 py-8 text-center">
          <span className="bg-brand-tint text-brand mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-pill">
            <InboxIcon size={22} />
          </span>
          <h2 className="font-display text-display-sm mb-1.5">No messages yet</h2>
          <p className="text-body text-text-muted mx-auto max-w-measure leading-relaxed">
            Every request you send and every reply a venue writes collects here, newest first.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {days.map((day) => (
            <section key={day.label}>
              <h2 className="font-display text-text-muted m-0 mb-3 text-[15px] font-bold tracking-[0.02em]">
                {day.label}
              </h2>
              <div className="flex flex-col gap-2.5">
                {day.items.map((m) => (
                  <Row key={m.id} item={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

function Row({ item: m }: { item: InboxItem }) {
  const venue = m.party === 'venue'
  const unread = venue && m.readAt == null

  return (
    <Link
      href={`/trips/${m.tripId}#msg-${m.id}`}
      className={
        unread
          ? 'bg-surface border-brand-tint-2 hover:border-brand flex items-start gap-4 rounded-thumb border px-5 py-4 no-underline'
          : 'bg-surface border-border hover:border-brand flex items-start gap-4 rounded-thumb border px-5 py-4 no-underline'
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

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className={unread ? 'text-body font-bold' : 'text-body font-semibold'}>
            {venue ? m.venueName : m.authorName}
          </span>
          {unread ? (
            <span aria-label="Unread" className="bg-brand h-2 w-2 flex-none self-center rounded-pill" />
          ) : null}
          <span className="text-meta text-text-faint ml-auto">{when(m.sentAt)}</span>
        </span>
        <span className="text-body-sm text-text-muted mt-0.5 block">
          {m.programName}
          {m.tripDate ? (
            <>
              <span aria-hidden className="text-border-strong"> · </span>
              {shortDate(m.tripDate)}
            </>
          ) : null}
          {!venue ? (
            <>
              <span aria-hidden className="text-border-strong"> · </span>
              to {m.venueName}
            </>
          ) : null}
        </span>
        <span
          className={
            unread
              ? 'text-body-sm text-text mt-1.5 block truncate'
              : 'text-body-sm text-text-muted mt-1.5 block truncate'
          }
        >
          {preview(m.body)}
        </span>
      </span>
    </Link>
  )
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]![0]!
  const last = parts.length > 1 ? parts.at(-1)![0]! : ''
  return (first + last).toUpperCase()
}

function when(at: Date): string {
  return at.toLocaleTimeString('en-CA', {
    timeZone: 'America/Vancouver',
    hour: 'numeric',
    minute: '2-digit',
  })
}
