'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db, trip } from '@/db'
import { getViewer } from '@/lib/auth'
import { newId } from '@/lib/ids'
import { taskSchema, type Task } from '@/lib/schemas'
import { setTaskDate, toggleTask } from '@/lib/trips/tasks'

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
