import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CalendarDays,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Heart,
  LifeBuoy,
  MessageCircle,
} from 'lucide-react'
import { getActiveRoom, getViewer } from '@/lib/auth'
import { fetchSaved, fetchTrips } from '@/lib/trips/fetch'
import { catalogForRoom, suggestFor } from '@/lib/catalog/for-room'
import { removeSaved } from '@/app/outing/actions'
import {
  BUCKETS,
  bucketOf,
  sortByUrgency,
  STATUS_LABEL,
  type Bucket,
  type TripStatus,
} from '@/lib/trips/derived'
import { cx } from '@/components/ui'

/* One person's own pages: nothing here is for a search index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}


/*
  My trips. Spec §5.6 and the design's five tabs.

  Saved first, because a shortlist is where a trip starts. Then the four
  buckets, in the order the design draws them: what needs her, what is out,
  what is coming, what is done.
*/

const TABS = [
  { key: 'saved', label: 'Saved', icon: <Heart size={20} /> },
  { key: 'needs', label: 'Needs action', icon: <CircleAlert size={20} /> },
  { key: 'waiting', label: 'Waiting', icon: <Clock size={20} /> },
  { key: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={20} /> },
  { key: 'past', label: 'Past', icon: <CircleCheckBig size={20} /> },
] as const

type TabKey = (typeof TABS)[number]['key']

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=%2Ftrips')
  if (!viewer.centreId) redirect('/welcome')

  const params = await searchParams
  const requested = typeof params.tab === 'string' ? params.tab : ''
  const [rows, saved, activeRoom] = await Promise.all([
    fetchTrips(viewer.centreId),
    fetchSaved(viewer.accountId),
    getActiveRoom(viewer.centreId),
  ])

  const now = new Date()
  const decorated = rows.map((r) => ({
    ...r,
    bucket: bucketOf(r.trip.status as TripStatus, r.lastMessageParty as never),
    showDate:
      r.trip.confirmedDate ??
      [...r.trip.dateOptions].sort((a, b) => a.rank - b.rank)[0]?.date ??
      null,
  }))

  const counts: Record<TabKey, number> = {
    saved: saved.length,
    needs: decorated.filter((r) => r.bucket === 'needs').length,
    waiting: decorated.filter((r) => r.bucket === 'waiting').length,
    upcoming: decorated.filter((r) => r.bucket === 'upcoming').length,
    past: decorated.filter((r) => r.bucket === 'past').length,
  }

  /*
    Which tab opens by default: the first one with something in it, so a
    director who has a venue waiting on her lands on that rather than on an
    empty shortlist.
  */
  const fallback = TABS.find((t) => counts[t.key] > 0)?.key ?? 'saved'
  const tab: TabKey = TABS.some((t) => t.key === requested)
    ? (requested as TabKey)
    : fallback

  /*
    The Saved tab reads the catalog as the active room sees it, so a saved
    row carries the same travel line and amber reason as its card, and the
    empty state can name three that fit. Only fetched when that tab is open.
  */
  const catalog = tab === 'saved' ? await catalogForRoom(activeRoom) : []
  const byId = new Map(catalog.map((r) => [r.id, r]))
  const suggestions =
    tab === 'saved' && saved.length === 0
      ? suggestFor(catalog, saved.map((s) => s.program.id))
      : []

  const bucketRows =
    tab === 'saved'
      ? []
      : sortByUrgency(
          decorated
            .filter((r) => r.bucket === tab)
            .map((r) => ({
              ...r,
              status: r.trip.status as TripStatus,
              lastMessageParty: r.lastMessageParty as never,
              lastMessageAt: r.lastMessageAt ? new Date(r.lastMessageAt) : null,
            })),
          now,
        )

  return (
    <main className="mx-auto max-w-[1000px] px-5 pt-7 pb-16">
      <h1 className="font-display text-display-lg mb-5.5">My trips</h1>

      <div className="border-border mb-6.5 flex flex-wrap gap-1 border-b">
        {TABS.map((t) => {
          const active = t.key === tab
          return (
            <Link
              key={t.key}
              href={`/trips?tab=${t.key}`}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'text-body relative flex items-center gap-2.5 px-5 py-4 font-semibold no-underline',
                active ? 'text-brand' : 'text-text-muted hover:text-text',
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  className="bg-surface-3 border-brand absolute inset-0 rounded-t-control border-b-[2.5px]"
                />
              ) : null}
              <span className="relative flex">{t.icon}</span>
              <span className="relative">{t.label}</span>
              <span
                className={cx(
                  'text-meta-sm relative min-w-6 rounded-pill px-2 py-0.5 text-center font-bold',
                  active ? 'bg-brand text-white' : 'bg-surface-2 text-text-muted',
                )}
              >
                {counts[t.key]}
              </span>
            </Link>
          )
        })}
      </div>

      {tab === 'saved' ? (
        saved.length > 0 ? (
          <div className="flex flex-col gap-3">
            {saved.map(({ program: p, venue: v }) => {
              const r = byId.get(p.id)
              return (
                <div
                  key={p.id}
                  className="bg-surface border-border flex flex-wrap items-center gap-5 rounded-thumb border px-6 py-5"
                >
                  <span
                    aria-hidden
                    className="bg-brand-tint text-brand font-display flex h-[52px] w-[52px] flex-none items-center justify-center rounded-pill text-[15px] font-bold"
                  >
                    {r?.initials ?? initialsOf(v.name)}
                  </span>
                  <Link
                    href={`/outing/${v.id}/${p.slug}`}
                    className="min-w-0 flex-1 basis-[220px] no-underline"
                  >
                    <span className="font-display block text-[19px] font-bold tracking-[-0.015em]">
                      {p.name}
                    </span>
                    <span className="text-body-sm text-text-muted mt-1 block">
                      {v.name}
                      <span aria-hidden className="text-border-strong"> · </span>
                      {r?.perChildLine ?? 'Price not published'}
                      {r?.travelLine ? (
                        <>
                          <span aria-hidden className="text-border-strong"> · </span>
                          {r.travelLine}
                        </>
                      ) : null}
                    </span>
                    {r?.feasibility.level === 'amber' ? (
                      <span className="text-meta text-warn mt-1.5 block">
                        {r.feasibility.issueText}
                      </span>
                    ) : null}
                  </Link>
                  <form action={removeSaved}>
                    <input type="hidden" name="programId" value={p.id} />
                    <button
                      type="submit"
                      className="text-body-sm text-text-faint hover:text-danger px-1.5 py-2.5 font-semibold"
                    >
                      Remove
                    </button>
                  </form>
                  <Link
                    href={`/plan/${v.id}/${p.slug}`}
                    className="bg-brand hover:bg-brand-hover text-body-sm flex items-center gap-2.5 rounded-pill px-5 py-3.5 font-bold whitespace-nowrap text-white no-underline"
                  >
                    <MessageCircle size={17} />
                    Plan this trip
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface border-border rounded-panel border px-7 py-7">
            <h2 className="font-display text-display-sm mb-1.5">Nothing saved yet</h2>
            <p className="text-body text-text-muted mb-4 leading-relaxed">
              Tap Save on any outing and it waits here until you are ready.
              {suggestions.length > 0 && activeRoom
                ? ` Three that fit ${activeRoom.name} right now:`
                : ''}
            </p>
            {suggestions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {suggestions.map((r) => (
                  <Link
                    key={r.id}
                    href={`/outing/${r.venueId}/${r.slug}`}
                    className="bg-surface-2 border-border hover:border-brand block rounded-card border px-4.5 py-3.5 no-underline"
                  >
                    <span className="text-body block font-bold">{r.name}</span>
                    <span className="text-body-sm text-text-muted mt-0.5 block">
                      {r.venueName}
                      <span aria-hidden className="text-border-strong"> · </span>
                      {r.perChildLine}
                      <span aria-hidden className="text-border-strong"> · </span>
                      {r.travelLine}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="/"
                className="bg-brand hover:bg-brand-hover text-body-sm inline-block rounded-pill px-5 py-3 font-bold text-white no-underline"
              >
                Find outings
              </Link>
            )}
          </div>
        )
      ) : bucketRows.length > 0 ? (
        <div className="flex flex-col gap-3">
          {bucketRows.map((r) => {
            const d = r.showDate ? new Date(`${r.showDate}T12:00:00Z`) : null
            const status = r.trip.status as TripStatus
            return (
              <Link
                key={r.trip.id}
                /* Straight to the message she has not read, per spec §5.7's
                   "tapping opens the trip page scrolled to that message". */
                href={
                  r.firstUnreadId
                    ? `/trips/${r.trip.id}#msg-${r.firstUnreadId}`
                    : `/trips/${r.trip.id}`
                }
                className="bg-surface border-border hover:border-brand flex flex-wrap items-center gap-5.5 rounded-thumb border px-6 py-5 no-underline"
              >
                <span className="flex-none basis-[54px] text-center">
                  <span className="font-display block text-[28px] leading-none font-bold tracking-[-0.02em]">
                    {d ? d.getUTCDate() : '–'}
                  </span>
                  <span className="text-meta-sm text-text-faint mt-1 block font-semibold tracking-[0.08em] uppercase">
                    {d ? MONTHS[d.getUTCMonth()] : 'TBC'}
                  </span>
                </span>

                <span className="min-w-0 flex-1 basis-[220px]">
                  <span className="font-display block text-[19px] font-bold tracking-[-0.015em]">
                    {r.program.name}
                  </span>
                  <span className="text-body-sm text-text-muted mt-1 block">
                    {r.venue.name}
                    <span aria-hidden className="text-border-strong"> · </span>
                    {r.trip.roomSnapshots.map((s) => s.name).join(' and ')}
                  </span>
                  {(r.unreadCount ?? 0) > 0 ? (
                    <span className="text-meta text-info-ink mt-2 inline-flex items-center gap-2 font-semibold">
                      <span aria-hidden className="bg-brand h-2 w-2 rounded-pill" />
                      New reply
                    </span>
                  ) : null}
                </span>

                {status === 'confirmed' ? (
                  <span className="text-body-sm text-success flex items-center gap-2.5 font-semibold whitespace-nowrap">
                    <span className="bg-success-tint flex h-[34px] w-[34px] items-center justify-center rounded-pill">
                      <CircleCheckBig size={20} />
                    </span>
                    Confirmed
                  </span>
                ) : (
                  <span className="text-body-sm text-text-faint font-semibold whitespace-nowrap">
                    {STATUS_LABEL[status]}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyPanel
          title={BUCKETS[tab as Bucket].empty[0]}
          body={BUCKETS[tab as Bucket].empty[1]}
        />
      )}

      <div className="text-body-sm text-text-muted mt-10 flex items-center justify-center gap-2.5">
        <span className="text-text-faint flex">
          <LifeBuoy size={18} />
        </span>
        Need help?{' '}
        <Link href="/account" className="text-brand font-semibold no-underline">
          Visit your account
        </Link>
      </div>
    </main>
  )
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!)
    .join('')
}

function EmptyPanel({
  title,
  body,
  children,
}: {
  title: string
  body: string
  children?: React.ReactNode
}) {
  return (
    <div className="bg-surface border-border rounded-panel border px-7 py-8 text-center">
      <h2 className="font-display text-display-sm mb-1.5">{title}</h2>
      <p className="text-body text-text-muted mx-auto max-w-measure leading-relaxed">
        {body}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}
