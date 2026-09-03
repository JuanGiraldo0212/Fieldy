import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/auth'
import { fetchTrips } from '@/lib/trips/fetch'
import { shortDate } from '@/lib/trips/asks'
import { STATUS_LABEL, tripSummary, type TripStatus } from '@/lib/trips/derived'
import { EmptyState } from '@/components/ui'

/*
  Trips, newest first.

  Minimal on purpose. Spec §5.6 asks for grouping by status, urgency sorting, a
  "Needs my reply" chip and an empty state that suggests three feasible
  programs; all of that arrives with the slice that builds My trips. This is
  here so a trip stays reachable after you navigate away from it.
*/

export default async function TripsPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=%2Ftrips')
  if (!viewer.centreId) redirect('/welcome')

  const rows = await fetchTrips(viewer.centreId)
  const today = new Date().toISOString().slice(0, 10)

  return (
    <main className="mx-auto max-w-content px-5 pt-6 pb-16">
      <h1 className="font-display text-display-lg">Your trips</h1>

      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No trips yet"
            body="Find an outing that fits your group and send the venue a request. The trip and its checklist are built for you."
          >
            <Link
              href="/"
              className="bg-brand hover:bg-brand-hover text-body-sm inline-block rounded-pill px-5 py-3 font-bold text-white no-underline"
            >
              Find outings
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {rows.map(({ trip: t, program: p, venue: v }) => {
            const first = [...t.dateOptions].sort((a, b) => a.rank - b.rank)[0]
            return (
              <Link
                key={t.id}
                href={`/trips/${t.id}`}
                className="bg-surface border-border hover:border-brand block rounded-card-lg border px-5 py-4 no-underline"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-body font-bold">{p.name}</span>
                  <span className="text-body-sm text-text-muted">{v.name}</span>
                  <span className="bg-brand-tint text-brand text-label ml-auto rounded-pill px-2.5 py-1 font-bold">
                    {STATUS_LABEL[t.status as TripStatus]}
                  </span>
                </div>
                <div className="text-body-sm text-text-strong mt-1.5">
                  {t.confirmedDate
                    ? shortDate(t.confirmedDate)
                    : first
                      ? `First choice ${shortDate(first.date)}`
                      : 'No dates yet'}{' '}
                  <span className="text-border-strong">·</span>{' '}
                  {t.roomSnapshots.map((r) => r.name).join(' and ')},{' '}
                  {t.childrenCount} children
                </div>
                <div className="text-meta text-text-faint mt-1">
                  {tripSummary({
                    status: t.status as TripStatus,
                    tasks: t.tasks,
                    today,
                  })}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
