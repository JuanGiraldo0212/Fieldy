'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, isNull, ne } from 'drizzle-orm'
import { z } from 'zod'
import { db, room } from '@/db'
import { getViewer } from '@/lib/auth'
import { newId } from '@/lib/ids'
import { geocodeAddress, pickedPoint } from '@/lib/catalog/geocode'

/*
  Rooms. spec §5.8.

  Every action re-reads the viewer and scopes by their centre. Drizzle connects
  as the table owner and is exempt from RLS, so a missing check here is a real
  hole, not a redundant one: without the centre_id comparison a crafted room id
  would edit somebody else's room.
*/

const roomSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Give the room a name.').max(120),
  icon: z.enum(['baby', 'backpack', 'cap', 'users']),
  ageMin: z.coerce.number().min(0).max(18),
  ageMax: z.coerce.number().min(0).max(18),
  size: z.coerce.number().int().min(1).max(200),
  ratio: z.coerce.number().int().min(1).max(30),
  budget: z.coerce.number().min(0).max(1000),
  transport: z
    .array(z.enum(['walking', 'bus', 'parent_drivers', 'none']))
    .min(1, 'Pick at least one way to travel.'),
  address: z.string().trim().min(1, 'We measure every distance from here.').max(300),
  notes: z.string().trim().max(300, 'Notes are capped at 300 characters.').optional(),
})

export type RoomState = { error?: string; ok?: boolean }

export async function saveRoom(
  _prev: RoomState,
  formData: FormData,
): Promise<RoomState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const parsed = roomSchema.safeParse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    icon: formData.get('icon'),
    ageMin: formData.get('ageMin'),
    ageMax: formData.get('ageMax'),
    size: formData.get('size'),
    ratio: formData.get('ratio'),
    budget: formData.get('budget'),
    transport: formData.getAll('transport'),
    address: formData.get('address'),
    notes: formData.get('notes') ?? '',
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Something is missing.' }
  }
  const d = parsed.data

  if (d.ageMax < d.ageMin) {
    return { error: 'The oldest age cannot be younger than the youngest.' }
  }

  /* A point chosen from the picker wins: it is the one she saw. Otherwise
     only geocode when the address is new or changed, so renaming a room does
     not depend on a third-party service being up. */
  let point = pickedPoint(formData.get('addressLat'), formData.get('addressLng'))
  if (!point && d.id) {
    const existing = await db
      .select()
      .from(room)
      .where(and(eq(room.id, d.id), eq(room.centreId, viewer.centreId)))
      .limit(1)
    const prior = existing[0]
    if (!prior) return { error: 'That room is not one of yours.' }
    point =
      prior.address === d.address && prior.lat != null && prior.lng != null
        ? { lat: prior.lat, lng: prior.lng }
        : await geocodeAddress(d.address)
  } else if (!point) {
    point = await geocodeAddress(d.address)
  }

  if (!point) {
    return {
      error:
        'We could not find that address. Try including the city, or a nearby street number.',
    }
  }

  const values = {
    centreId: viewer.centreId,
    name: d.name,
    icon: d.icon,
    ageMin: d.ageMin,
    ageMax: d.ageMax,
    size: d.size,
    ratioChildrenPerAdult: d.ratio,
    budgetPerChild: String(d.budget),
    transport: d.transport,
    address: d.address,
    lat: point.lat,
    lng: point.lng,
    notes: d.notes || null,
    updatedAt: new Date(),
  }

  if (d.id) {
    await db
      .update(room)
      .set(values)
      .where(and(eq(room.id, d.id), eq(room.centreId, viewer.centreId)))
  } else {
    await db.insert(room).values({ id: newId(), ...values })
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

/*
  Archive, never delete. data-model.md's second defended rule: a trip holds
  room ids, and a hard delete would make an old trip fall back to another
  room's name and ratio, which is a wrong number presented confidently.
*/
export async function archiveRoom(
  _prev: RoomState,
  formData: FormData,
): Promise<RoomState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Which room?' }

  /* "A centre must always have at least one non-archived room", enforced here
     rather than in the database per plan §4.1. Without a room the catalog has
     nothing to measure against and every screen has to special-case it. */
  const others = await db
    .select({ id: room.id })
    .from(room)
    .where(
      and(
        eq(room.centreId, viewer.centreId),
        isNull(room.archivedAt),
        ne(room.id, id),
      ),
    )

  if (others.length === 0) {
    return {
      error:
        'This is your only room, so it has to stay. Add another one first, then archive this.',
    }
  }

  await db
    .update(room)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(room.id, id), eq(room.centreId, viewer.centreId)))

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function restoreRoom(
  _prev: RoomState,
  formData: FormData,
): Promise<RoomState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const id = String(formData.get('id') ?? '')
  await db
    .update(room)
    .set({ archivedAt: null, updatedAt: new Date() })
    .where(and(eq(room.id, id), eq(room.centreId, viewer.centreId)))

  revalidatePath('/', 'layout')
  return { ok: true }
}
