import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft,
  Baby,
  Calendar,
  Landmark,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Microscope,
  Palette,
  TreeDeciduous,
  Truck,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { getViewer } from '@/lib/auth'
import { fetchTrip } from '@/lib/trips/fetch'
import { sendingConfigured } from '@/lib/email/send'
import {
  ordinalLabel,
  requestAskLine,
  requestDateLine,
  shortDate,
} from '@/lib/trips/asks'
import {
  ratioCheck,
  waitingLabel,
  waitingOn,
  type TripStatus,
} from '@/lib/trips/derived'
import { StatusRail } from '@/components/trip/status-rail'
import { Checklist } from '@/components/trip/checklist'
import { CostCard } from '@/components/trip/cost-card'
import { NotesCard } from '@/components/trip/notes-card'

/*
  The trip page. Spec §5.4, "the heart of the product".

  What is here: header and status rail, dates, cost, checklist, the opening
  request card, notes and the attendance helper. What is not: the reply
  bubbles, the compose box and the suggestion banner, which arrive with slices
  5 and 6 along with the mail that produces them.
*/

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  animals_farms: <Baby size={28} />,
  nature_outdoors: <TreeDeciduous size={28} />,
  museums_history: <Landmark size={28} />,
  arts_performance: <Palette size={28} />,
  science: <Microscope size={28} />,
  community_civic: <Users size={28} />,
  comes_to_you: <Truck size={28} />,
}

const SLOT_LABEL: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  either: 'Either',
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params

  const viewer = await getViewer()
  if (!viewer) redirect(`/login?next=${encodeURIComponent(`/trips/${tripId}`)}`)
  if (!viewer.centreId) redirect('/welcome')

  const found = await fetchTrip(tripId, viewer.centreId)
  if (!found) notFound()
  const { trip: t, program: p, venue: v, messages } = found

  const today = new Date().toISOString().slice(0, 10)
  const status = t.status as TripStatus

  const request = messages.find((m) => m.isRequest) ?? null
  const lastParty = messages.at(-1)?.party ?? null
  const who = waitingOn(status, lastParty)
  const sentAt = request?.sentAt ?? t.createdAt
  const days = Math.max(
    0,
    Math.floor((Date.now() - sentAt.getTime()) / 86_400_000),
  )
  const ratio = ratioCheck(t.roomSnapshots, t.adultsCount)
  const dates = [...t.dateOptions].sort((a, b) => a.rank - b.rank)

  /* Non-null when the request never left: no API key, no booking address for
     this venue, or a send that failed. Saying so plainly beats a page that
     looks like mail went out when none did. */
  const undelivered = request?.sendError ?? null

  return (
    <main className="mx-auto max-w-[940px] px-5 pt-5.5 pb-[70px]">
      <div className="text-body-sm flex flex-wrap items-center gap-4">
        <Link
          href="/trips"
          className="text-brand flex items-center gap-2.5 py-2 font-semibold no-underline"
        >
          <ArrowLeft size={17} />
          All your trips
        </Link>
        <Link
          href={`/outing/${v.id}/${p.slug}`}
          className="text-text-faint py-2 font-semibold no-underline"
        >
          Outing details
        </Link>
      </div>

      {/* Header */}
      <div className="bg-surface border-border mt-3 rounded-panel border p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span
            aria-hidden
            className="bg-brand-tint text-brand flex h-[66px] w-[66px] flex-none items-center justify-center rounded-thumb"
          >
            {CATEGORY_ICONS[v.category] ?? <MapPin size={28} />}
          </span>
          <div className="min-w-0 flex-1 basis-[260px]">
            <h1 className="font-display text-display-md m-0">{p.name}</h1>
            <div className="text-body text-text-muted mt-1.5">{v.name}</div>
            <div className="text-body-sm text-text-strong mt-2.5 flex flex-wrap gap-x-4.5 gap-y-2">
              <span className="flex items-center gap-2">
                <span className="text-text-faint flex">
                  <Users size={16} />
                </span>
                {t.roomSnapshots.map((r) => r.name).join(' and ')}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-text-faint flex">
                  <Baby size={16} />
                </span>
                {t.childrenCount} children, {t.adultsCount} adults
              </span>
              {who !== 'nobody' && !undelivered ? (
                <span className="text-warn flex items-center gap-2 font-semibold">
                  <span aria-hidden className="bg-warn h-2 w-2 rounded-pill" />
                  {waitingLabel(who, days)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {status === 'cancelled' ? (
          <p className="text-body-sm text-text-muted mt-5">
            This trip was cancelled.
          </p>
        ) : (
          <StatusRail status={status} />
        )}
      </div>

      {undelivered ? (
        <div className="bg-warn-tint border-warn-border mt-4 flex flex-wrap items-start gap-3 rounded-card-lg border px-5 py-4">
          <span className="text-warn flex">
            <TriangleAlert size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-body-sm font-bold">
              This request has not gone out yet
            </div>
            <p className="text-body-sm text-text-strong mt-1 leading-normal">
              {undelivered} Your message is saved below.{' '}
              {!t.venueEmail
                ? `You can reach ${v.name} on ${v.bookingPhone ?? v.website ?? 'their website'} in the meantime.`
                : sendingConfigured()
                  ? `It was addressed to ${t.venueEmail}. Nothing is lost, so it can go out once that is sorted.`
                  : `We will send it to ${t.venueEmail} as soon as sending is switched on.`}
            </p>
          </div>
        </div>
      ) : null}

      {/* Dates, cost, checklist */}
      <div className="mt-4 flex flex-wrap items-stretch gap-4">
        <div className="flex min-w-0 flex-1 basis-[380px] flex-col gap-4 self-stretch">
          <section className="bg-surface border-border rounded-panel border p-6">
            <div className="mb-4.5 flex flex-wrap items-center gap-3.5">
              <span className="bg-brand-tint text-brand flex h-[38px] w-[38px] flex-none items-center justify-center rounded-pill">
                <Calendar size={19} />
              </span>
              <h2 className="font-display text-display-sm m-0 flex-1">
                {t.confirmedDate ? 'Trip date' : 'Trip dates'}
              </h2>
            </div>

            {t.confirmedDate ? (
              <div className="border-border rounded-card border px-4.5 py-4">
                <div className="font-display text-[21px] font-bold tracking-[-0.015em]">
                  {shortDate(t.confirmedDate)}
                </div>
                {t.confirmedTime ? (
                  <div className="text-meta text-text-muted mt-1">
                    {t.confirmedTime}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {dates.map((d) => (
                  <div
                    key={d.date}
                    className="border-border min-w-0 flex-1 basis-[118px] rounded-card border px-4 py-3.5 text-center"
                  >
                    <span className="bg-brand-tint text-brand text-meta-sm inline-flex h-6 w-6 items-center justify-center rounded-pill font-bold">
                      {d.rank}
                    </span>
                    <div className="font-display mt-2 text-[19px] font-bold tracking-[-0.015em]">
                      {shortDate(d.date)}
                    </div>
                    <div className="text-meta text-text-muted mt-1">
                      {SLOT_LABEL[d.slot]}
                    </div>
                    {d.rank === 1 ? (
                      <div className="bg-brand-tint text-brand text-label mt-2 inline-block rounded-pill px-2.5 py-1 font-bold">
                        {ordinalLabel(1)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          <CostCard
            tripId={t.id}
            costs={{
              costChild: t.costChild,
              costAdult: t.costAdult,
              costGroupFee: t.costGroupFee,
              costTransport: t.costTransport,
            }}
            childrenCount={t.childrenCount}
            adultsCount={t.adultsCount}
          />
        </div>

        <div className="min-w-0 flex-1 basis-[340px] self-stretch">
          <Checklist tripId={t.id} tasks={t.tasks} today={today} />
        </div>
      </div>

      {/* Conversation. The request card only; replies and the compose box
          arrive with slice 5. */}
      <section className="bg-surface border-border mt-4 rounded-panel border p-6">
        <div className="mb-4.5 flex flex-wrap items-center gap-3.5">
          <span className="text-brand flex">
            <MessageSquare size={22} />
          </span>
          <h2 className="font-display text-display-sm m-0 flex-1">Conversation</h2>
          {who === 'venue' && !undelivered ? (
            <span className="text-body-sm text-warn flex items-center gap-2.5 font-semibold">
              <span aria-hidden className="bg-warn h-2.5 w-2.5 rounded-pill" />
              Waiting for venue reply
            </span>
          ) : null}
        </div>

        {request ? (
          <div className="bg-surface-3 flex gap-4 rounded-thumb px-5 py-4.5">
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
                  {shortDate(request.sentAt.toISOString().slice(0, 10))}
                </span>
              </div>
              <div className="text-body-sm text-text-strong mt-1.5">
                {requestDateLine(t.dateOptions)}
              </div>
              <div className="text-body-sm text-text-strong mt-0.5">
                {requestAskLine(t.asks)}
              </div>
              <div className="bg-surface text-body-sm text-text mt-3 rounded-control px-4 py-3.5 leading-relaxed whitespace-pre-wrap">
                {request.body}
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 py-4">
          <span aria-hidden className="border-border flex-1 border-t border-dashed" />
          <span className="text-body-sm text-text-faint">
            {undelivered
              ? 'Nothing has gone out, so there is nothing to reply to yet.'
              : 'Replies will appear here and in your email.'}
          </span>
          <span aria-hidden className="border-border flex-1 border-t border-dashed" />
        </div>
      </section>

      <NotesCard tripId={t.id} notes={t.notes} ratio={ratio} />

      <div className="border-border text-meta text-text-faint mt-6 flex items-center gap-2.5 border-t pt-4.5">
        <Lock size={15} />
        Only you and your team can see this trip.
      </div>
    </main>
  )
}
