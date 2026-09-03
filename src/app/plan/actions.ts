'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { db, message, program, room, trip, venue } from '@/db'
import { getCentre, getViewer } from '@/lib/auth'
import { SENDING_ENABLED } from '@/lib/email/status'
import { newId, newRelayToken } from '@/lib/ids'
import { askSchema, dateOptionSchema } from '@/lib/schemas'
import { requiredAdults } from '@/lib/trips/derived'
import { generateTasks } from '@/lib/trips/tasks'

/*
  Creating a trip. Spec §5.3 step 5: "Send. This creates the trip and opens the
  trip page."

  One transaction, because a trip without its opening message is a thread that
  starts mid-conversation, and a message without its trip is unreachable.

  Everything about the group is copied in, never referenced: children_count,
  adults_count and room_snapshots are what the rooms said today. Editing a room
  next term must not rewrite a trip that already happened.
*/

export type PlanState = { error?: string }

const planSchema = z.object({
  venueId: z.string().min(1),
  programSlug: z.string().min(1),
  roomIds: z.array(z.string().min(1)).min(1, 'Pick at least one group.'),
  dateOptions: z
    .array(dateOptionSchema)
    .min(1, 'Pick at least one date.')
    .max(10, 'That is more dates than a venue will read.'),
  asks: z.array(askSchema).max(20),
  message: z
    .string()
    .trim()
    .min(1, 'The message cannot be empty.')
    .max(5000, 'That message is too long to send.'),
})

function parseJson(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw ?? ''))
  } catch {
    return null
  }
}

export async function createTrip(
  _prev: PlanState,
  formData: FormData,
): Promise<PlanState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const parsed = planSchema.safeParse({
    venueId: formData.get('venueId'),
    programSlug: formData.get('programSlug'),
    roomIds: formData.getAll('roomIds').map(String),
    dateOptions: parseJson(formData.get('dateOptions')),
    asks: parseJson(formData.get('asks')),
    message: formData.get('message'),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Something is missing.' }
  }
  const d = parsed.data

  const centre = await getCentre(viewer.centreId)
  if (!centre) return { error: 'Your session expired. Sign in again.' }

  /*
    Scope the rooms by centre. Drizzle connects as the table owner and is
    exempt from RLS, so without this comparison a crafted room id would put
    somebody else's children on this trip.
  */
  const rooms = await db
    .select()
    .from(room)
    .where(
      and(
        eq(room.centreId, viewer.centreId),
        inArray(room.id, d.roomIds),
        isNull(room.archivedAt),
      ),
    )
  if (rooms.length !== d.roomIds.length) {
    return { error: 'One of those groups is no longer available. Pick again.' }
  }

  const rows = await db
    .select()
    .from(program)
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(
      and(eq(program.venueId, d.venueId), eq(program.slug, d.programSlug)),
    )
    .limit(1)
  const row = rows[0]
  if (!row) return { error: 'That outing is no longer in the catalog.' }
  const { program: p, venue: v } = row

  const snapshots = rooms.map((r) => ({
    id: r.id,
    name: r.name,
    size: r.size,
    ratio: r.ratioChildrenPerAdult,
  }))
  const childrenCount = snapshots.reduce((n, r) => n + r.size, 0)
  const adultsCount = requiredAdults(snapshots)

  const ranked = [...d.dateOptions]
    .sort((a, b) => a.rank - b.rank)
    .map((o, i) => ({ ...o, rank: i + 1 }))
  const firstDate = ranked[0]!.date

  /*
    A bus needs booking two weeks out, so the checklist only carries that task
    when one is actually involved. A program that comes to you never needs one.
  */
  const needsTransport =
    !p.comesToYou && rooms.some((r) => r.transport.includes('bus'))

  const tasks = generateTasks({
    tripDate: firstDate,
    venueName: v.name,
    leadTimeDays: p.leadTimeDays,
    needsTransport,
  })

  const tripId = newId()

  /*
    Program level over venue level, resolved now and stored, so a later catalog
    edit never redirects a thread that is already open.
  */
  const venueEmail = p.bookingEmail ?? v.bookingEmail ?? null

  await db.transaction(async (tx) => {
    await tx.insert(trip).values({
      id: tripId,
      centreId: viewer.centreId!,
      programId: p.id,
      roomIds: d.roomIds,
      status: 'requested',
      statusSource: 'system',
      relayToken: newRelayToken(),
      venueEmail,
      dateOptions: ranked,
      childrenCount,
      adultsCount,
      roomSnapshots: snapshots,
      costChild: p.costPerChildCad,
      costGroupFee: p.costPerGroupCad,
      asks: d.asks,
      tasks,
    })

    await tx.insert(message).values({
      id: newId(),
      tripId,
      party: 'educator',
      authorName: viewer.name || centre.name,
      body: d.message,
      isRequest: true,
      channel: 'email',
      /*
        `send_error` is the field the trip page already reads to offer a retry,
        so an undelivered request uses it rather than inventing a second way to
        be un-sent. A venue with no published booking email stays un-sent even
        once sending works, which is why both cases land here.
      */
      sendError: !venueEmail
        ? 'Not sent. This venue publishes no booking email.'
        : SENDING_ENABLED
          ? null
          : 'Not sent yet. Fieldy is not connected to an email service.',
    })
  })

  revalidatePath('/trips')
  redirect(`/trips/${tripId}`)
}
