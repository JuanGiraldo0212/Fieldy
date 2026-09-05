'use server'

import { revalidatePath } from 'next/cache'
import { and, asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { centre, db, message, trip } from '@/db'
import { getViewer } from '@/lib/auth'
import { replySubject, threadingHeaders } from '@/lib/email/relay'
import { sendRelayMessage } from '@/lib/email/send'
import { newId } from '@/lib/ids'
import { taskSchema, type Task } from '@/lib/schemas'
import { setTaskDate, toggleTask } from '@/lib/trips/tasks'
import { STATUS_LABEL } from '@/lib/trips/derived'

/*
  Edits to a trip. Every one of them re-reads the viewer and scopes the write
  by centre id, for the reason spelled out in rooms/actions.ts: Drizzle is
  exempt from RLS, so a missing comparison here is a real hole.

  Tasks, costs and notes are all small writes to one row. They read the row,
  change it in memory with the same tested functions the UI uses, and write it
  back, so the checklist behaves identically wherever it is edited from.
*/

export type TripState = { error?: string; ok?: boolean }

async function loadTasks(tripId: string) {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' as const }

  const rows = await db
    .select({ tasks: trip.tasks })
    .from(trip)
    .where(and(eq(trip.id, tripId), eq(trip.centreId, viewer.centreId)))
    .limit(1)

  const row = rows[0]
  if (!row) return { error: 'That trip is not one of yours.' as const }
  return { centreId: viewer.centreId, tasks: row.tasks }
}

async function writeTasks(tripId: string, centreId: string, tasks: Task[]) {
  await db
    .update(trip)
    .set({ tasks, updatedAt: new Date() })
    .where(and(eq(trip.id, tripId), eq(trip.centreId, centreId)))
  revalidatePath(`/trips/${tripId}`)
}

export async function toggleTripTask(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const tripId = String(formData.get('tripId') ?? '')
  const taskId = String(formData.get('taskId') ?? '')
  if (!tripId || !taskId) return { error: 'Which step?' }

  const loaded = await loadTasks(tripId)
  if ('error' in loaded) return { error: loaded.error }

  await writeTasks(tripId, loaded.centreId, toggleTask(loaded.tasks, taskId))
  return { ok: true }
}

export async function retimeTripTask(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const tripId = String(formData.get('tripId') ?? '')
  const taskId = String(formData.get('taskId') ?? '')
  const date = String(formData.get('date') ?? '')
  if (!z.iso.date().safeParse(date).success) return { error: 'That is not a date.' }

  const loaded = await loadTasks(tripId)
  if ('error' in loaded) return { error: loaded.error }

  /* setTaskDate also clears offset_days, which is what stops a later date
     change from pulling her edit back to where we had put it. */
  await writeTasks(tripId, loaded.centreId, setTaskDate(loaded.tasks, taskId, date))
  return { ok: true }
}

export async function addTripTask(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const tripId = String(formData.get('tripId') ?? '')
  const parsed = z
    .object({
      title: z.string().trim().min(1, 'Give the step a name.').max(140),
      date: z.iso.date('Pick a date for the step.'),
    })
    .safeParse({ title: formData.get('title'), date: formData.get('date') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Something is missing.' }
  }

  const loaded = await loadTasks(tripId)
  if ('error' in loaded) return { error: loaded.error }

  /* offset_days null: a step she wrote herself is hers, and a date change
     must not move it. */
  const task: Task = {
    id: newId(),
    title: parsed.data.title,
    kind: 'custom',
    due_date: parsed.data.date,
    offset_days: null,
    done: false,
    done_at: null,
  }

  const next = [...loaded.tasks, task].sort((a, b) =>
    a.due_date < b.due_date ? -1 : 1,
  )
  await writeTasks(tripId, loaded.centreId, next)
  return { ok: true }
}

export async function removeTripTask(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const tripId = String(formData.get('tripId') ?? '')
  const taskId = String(formData.get('taskId') ?? '')

  const loaded = await loadTasks(tripId)
  if ('error' in loaded) return { error: loaded.error }

  const next = loaded.tasks.filter((t) => t.id !== taskId)
  const valid = z.array(taskSchema).safeParse(next)
  if (!valid.success) return { error: 'That checklist looks wrong. Reload the page.' }

  await writeTasks(tripId, loaded.centreId, valid.data)
  return { ok: true }
}

/* ─── Costs ──────────────────────────────────────────────────────────────── */

/*
  Editable because reality differs from the catalog: a venue quotes a flat rate
  on the phone, the bus company charges what it charges. An empty field is
  stored as null rather than zero, so the total can still say it is partial.
*/
const moneyField = z
  .string()
  .trim()
  .transform((v) => (v === '' ? null : v))
  .refine((v) => v === null || /^\d{1,7}(\.\d{1,2})?$/.test(v), {
    message: 'Costs are plain numbers, like 6 or 6.50.',
  })

export async function saveTripCosts(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const tripId = String(formData.get('tripId') ?? '')
  const parsed = z
    .object({
      costChild: moneyField,
      costAdult: moneyField,
      costGroupFee: moneyField,
      costTransport: moneyField,
    })
    .safeParse({
      costChild: formData.get('costChild') ?? '',
      costAdult: formData.get('costAdult') ?? '',
      costGroupFee: formData.get('costGroupFee') ?? '',
      costTransport: formData.get('costTransport') ?? '',
    })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check those numbers.' }
  }

  await db
    .update(trip)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(trip.id, tripId), eq(trip.centreId, viewer.centreId)))

  revalidatePath(`/trips/${tripId}`)
  return { ok: true }
}

/* ─── Notes ──────────────────────────────────────────────────────────────── */

export async function saveTripNotes(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const tripId = String(formData.get('tripId') ?? '')
  const notes = String(formData.get('notes') ?? '').trim()
  if (notes.length > 4000) return { error: 'That note is too long.' }

  await db
    .update(trip)
    .set({ notes: notes || null, updatedAt: new Date() })
    .where(and(eq(trip.id, tripId), eq(trip.centreId, viewer.centreId)))

  revalidatePath(`/trips/${tripId}`)
  return { ok: true }
}

/* ─── Status ─────────────────────────────────────────────────────────────── */

/*
  The manual status selector. Spec §5.4.1 and interaction 7.

  Two things happen together and must not come apart. `status_source` becomes
  `manual`, which is what makes the header say "set by you" rather than
  claiming a venue moved it. And a `system` message goes into the thread, the
  same as an applied suggestion writes one, so the thread stays the complete
  record of how a trip got where it is. A status that changed with nothing in
  the thread to explain it is how two people at the same centre end up
  disagreeing about what happened.
*/
export async function setTripStatus(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }
  const centreId = viewer.centreId

  const tripId = String(formData.get('tripId') ?? '')
  const parsed = z
    .enum(['requested', 'replied', 'confirmed', 'done', 'cancelled'])
    .safeParse(formData.get('status'))
  if (!parsed.success) return { error: 'That is not a status.' }
  const status = parsed.data

  const rows = await db
    .select({ status: trip.status })
    .from(trip)
    .where(and(eq(trip.id, tripId), eq(trip.centreId, centreId)))
    .limit(1)

  const row = rows[0]
  if (!row) return { error: 'That trip is not one of yours.' }
  /* Re-picking the current status is not a change and should not litter the
     thread with a system message saying nothing happened. */
  if (row.status === status) return { ok: true }

  await db.transaction(async (tx) => {
    await tx
      .update(trip)
      .set({ status, statusSource: 'manual', updatedAt: new Date() })
      .where(and(eq(trip.id, tripId), eq(trip.centreId, centreId)))

    await tx.insert(message).values({
      id: newId(),
      tripId,
      party: 'system',
      authorName: 'Fieldy',
      body: `${viewer.name || 'Someone at your centre'} set the status to ${STATUS_LABEL[status].toLowerCase()}.`,
      channel: 'email',
    })
  })

  revalidatePath(`/trips/${tripId}`)
  revalidatePath('/trips')
  return { ok: true }
}

/* ─── The thread ─────────────────────────────────────────────────────────── */

/*
  A follow-up message. Spec §5.4.6: "A text box docked under the thread with a
  Send button. Empty after the first request. Sends through Fieldy from the
  user's name."

  Same shape as the opening request in plan/actions.ts, and for the same
  reasons: the row is written first, the send happens after, and a failure is
  recorded on the row rather than rolled back. A message a director typed and
  watched vanish because Resend had a bad minute is the one outcome worth
  engineering against — `send_error` puts it on the trip page with a retry
  instead.
*/
export async function sendFollowUp(
  _prev: TripState,
  formData: FormData,
): Promise<TripState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }
  const centreId = viewer.centreId

  const tripId = String(formData.get('tripId') ?? '')
  const parsed = z
    .string()
    .trim()
    .min(1, 'Write something first.')
    .max(5000, 'That message is too long to send.')
    .safeParse(formData.get('body'))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Write something first.' }
  }
  const body = parsed.data

  const rows = await db
    .select({ trip, centre })
    .from(trip)
    .innerJoin(centre, eq(trip.centreId, centre.id))
    .where(and(eq(trip.id, tripId), eq(trip.centreId, centreId)))
    .limit(1)

  const row = rows[0]
  if (!row) return { error: 'That trip is not one of yours.' }
  const { trip: t, centre: c } = row

  /*
    Read in send order so the References chain is built oldest-first. This is
    what puts the follow-up inside the conversation already open in the venue's
    mailbox rather than starting a second one.
  */
  const thread = await db
    .select({
      id: message.id,
      party: message.party,
      rfcMessageId: message.rfcMessageId,
      subject: message.subject,
    })
    .from(message)
    .where(eq(message.tripId, tripId))
    .orderBy(asc(message.sentAt))

  /* The subject the request went out with, which is what the venue's client
     threads on. Recomputing it would describe a group that may since have
     changed size. */
  const firstSubject =
    thread.find((m) => m.subject)?.subject ?? 'Group visit request'
  const subject = replySubject(firstSubject)

  const messageRowId = newId()
  const senderName = viewer.name || c.name

  await db.insert(message).values({
    id: messageRowId,
    tripId,
    party: 'educator',
    authorName: senderName,
    body,
    channel: 'email',
    subject,
    /* Cleared below on a successful send. Until then the thread says, plainly,
       that this one has not gone anywhere. */
    sendError: 'Not sent yet.',
  })

  if (!t.venueEmail) {
    await db
      .update(message)
      .set({ sendError: 'Not sent. This venue publishes no booking email.' })
      .where(eq(message.id, messageRowId))
  } else {
    const { inReplyTo, references } = threadingHeaders({
      token: t.relayToken,
      messages: thread,
    })

    const sent = await sendRelayMessage({
      token: t.relayToken,
      messageRowId,
      senderName,
      centreName: c.name,
      venueEmail: t.venueEmail,
      subject,
      body,
      inReplyTo,
      references,
    })

    await db
      .update(message)
      .set(
        sent.ok
          ? { externalMessageId: sent.externalMessageId, sendError: null }
          : { sendError: sent.error },
      )
      .where(eq(message.id, messageRowId))
  }

  revalidatePath(`/trips/${tripId}`)
  revalidatePath('/trips')
  return { ok: true }
}
