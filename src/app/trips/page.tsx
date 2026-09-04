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
import { getViewer } from '@/lib/auth'
import { fetchSaved, fetchTrips } from '@/lib/trips/fetch'
import { shortDate } from '@/lib/trips/asks'
import { money } from '@/lib/catalog/feasibility'
import {
  BUCKETS,
  bucketOf,
  sortByUrgency,
  STATUS_LABEL,
  type Bucket,
  type TripStatus,
} from '@/lib/trips/derived'
import { cx } from '@/components/ui'

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
  const [rows, saved] = await Promise.all([
    fetchTrips(viewer.centreId),
    fetchSaved(viewer.accountId),
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
            {saved.map(({ program: p, venue: v }) => (
              <div
                key={p.id}
                className="bg-surface border-border flex flex-wrap items-center gap-5 rounded-thumb border px-6 py-5"
              >
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
                    {p.isFree || p.costPerChildCad === '0.00'
                      ? 'Free'
                      : p.costPerChildCad
                        ? `${money(Number(p.costPerChildCad))} a child`
                        : p.costPerGroupCad
                          ? `${money(Number(p.costPerGroupCad))} per class`
                          : 'Price not published'}
                  </span>
                </Link>
                <Link
                  href={`/plan/${v.id}/${p.slug}`}
                  className="bg-brand hover:bg-brand-hover text-body-sm flex items-center gap-2.5 rounded-pill px-5 py-3.5 font-bold whitespace-nowrap text-white no-underline"
                >
                  <MessageCircle size={17} />
                  Plan this trip
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="Nothing saved yet"
            body="Tap Save on any outing and it waits here until you are ready."
          >
            <Link
              href="/"
              className="bg-brand hover:bg-brand-hover text-body-sm inline-block rounded-pill px-5 py-3 font-bold text-white no-underline"
            >
              Find outings
            </Link>
          </EmptyPanel>
        )
      ) : bucketRows.length > 0 ? (
        <div className="flex flex-col gap-3">
          {bucketRows.map((r) => {
            const d = r.showDate ? new Date(`${r.showDate}T12:00:00Z`) : null
            const status = r.trip.status as TripStatus
            return (
              <Link
                key={r.trip.id}
                href={`/trips/${r.trip.id}`}
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
