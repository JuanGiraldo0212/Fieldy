import { notFound, redirect } from 'next/navigation'
import { getCentre, getRooms, getViewer } from '@/lib/auth'
import { fetchProgram, practicalFacts } from '@/lib/catalog/program'
import { askTopics } from '@/lib/trips/asks'
import { sendingConfigured } from '@/lib/email/send'
import { PlanForm } from '@/components/plan/plan-form'

/*
  Plan a request. Spec §5.3: "One screen, not a wizard."

  Everything the form needs is resolved here on the server, including the ask
  topics, because deriving them means reading the venue's practical facts and
  that is a database shape the browser has no business knowing.
*/

export default async function PlanPage({
  params,
}: {
  params: Promise<{ venue: string; program: string }>
}) {
  const { venue: venueId, program: slug } = await params
  const here = `/plan/${venueId}/${slug}`

  /* Sending a request needs a name to send it under, so this is the first
     screen in the product that requires a login. */
  const viewer = await getViewer()
  if (!viewer) redirect(`/login?next=${encodeURIComponent(here)}`)
  if (!viewer.centreId) redirect(`/welcome?next=${encodeURIComponent(here)}`)

  const [found, rooms, centre] = await Promise.all([
    fetchProgram(venueId, slug),
    getRooms(viewer.centreId),
    getCentre(viewer.centreId),
  ])
  if (!found || !centre) notFound()

  const { program: p, venue: v } = found
  const live = rooms.filter((r) => r.archivedAt == null)
  if (live.length === 0) redirect('/rooms')

  const topics = askTopics({
    facts: practicalFacts(v),
    conflicts: v.conflicts,
    extraFeesNote: p.extraFeesNote,
  })

  /* Midday UTC for the same reason every other date here uses it: the server
     is on UTC and the user is not, and "today" must not be tomorrow. */
  const today = new Date().toISOString().slice(0, 10)

  return (
    <PlanForm
      venueId={v.id}
      programSlug={p.slug}
      venueName={v.name}
      programName={p.name}
      programLeadTimeDays={p.leadTimeDays}
      capacityMax={p.capacityMax}
      centreName={centre.name}
      senderName={viewer.name || centre.name}
      today={today}
      rooms={live.map((r) => ({
        id: r.id,
        name: r.name,
        size: r.size,
        ratio: r.ratioChildrenPerAdult,
        ageMin: r.ageMin,
        ageMax: r.ageMax,
        transport: r.transport,
      }))}
      topics={topics}
      sendingEnabled={sendingConfigured()}
    />
  )
}
