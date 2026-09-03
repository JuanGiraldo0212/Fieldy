'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { account, centre, db, room } from '@/db'
import { getViewer } from '@/lib/auth'
import { newId } from '@/lib/ids'
import { geocodeAddress, pickedPoint } from '@/lib/catalog/geocode'

/*
  Centre and first room, created together. spec §5.3: "a first time user
  creates the centre and first room in a two step form and returns here."

  One transaction on purpose. A centre with no room is a dead end — the
  catalog has nothing to measure against and every screen has to special-case
  it — so either both exist or neither does.
*/

const setupSchema = z.object({
  name: z.string().trim().min(1, 'We need your name for the request signature.').max(120),
  role: z.enum(['ece', 'director', 'teacher', 'other']),
  centreName: z.string().trim().min(1, 'What is the centre called?').max(200),
  centreType: z.enum(['daycare_preschool', 'elementary', 'middle', 'secondary', 'other']),
  address: z.string().trim().min(1, 'We measure every distance from here.').max(300),
  roomName: z.string().trim().min(1, 'Give the room a name.').max(120),
  ageMin: z.coerce.number().min(0).max(18),
  ageMax: z.coerce.number().min(0).max(18),
  size: z.coerce.number().int().min(1).max(200),
  ratio: z.coerce.number().int().min(1).max(30),
  budget: z.coerce.number().min(0).max(1000),
  transport: z.array(z.enum(['walking', 'bus', 'parent_drivers', 'none'])).min(1),
})

export type SetupState = { error?: string }

export async function createCentreAndRoom(
  _prev: SetupState,
  formData: FormData,
): Promise<SetupState> {
  const viewer = await getViewer()
  if (!viewer) return { error: 'Your session expired. Sign in again.' }

  const parsed = setupSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    centreName: formData.get('centreName'),
    centreType: formData.get('centreType'),
    address: formData.get('address'),
    roomName: formData.get('roomName'),
    ageMin: formData.get('ageMin'),
    ageMax: formData.get('ageMax'),
    size: formData.get('size'),
    ratio: formData.get('ratio'),
    budget: formData.get('budget'),
    transport: formData.getAll('transport'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Something is missing.' }
  }
  const d = parsed.data

  if (d.ageMax < d.ageMin) {
    return { error: 'The oldest age cannot be younger than the youngest.' }
  }

  /* Geocode before writing. A centre with no coordinates cannot measure a
     single distance, which is most of what the catalog does — better to say so
     now than to create it and have every card read "distance not known". */
  const point =
    pickedPoint(formData.get('addressLat'), formData.get('addressLng')) ??
    (await geocodeAddress(d.address))
  if (!point) {
    return {
      error:
        'We could not find that address. Try including the city, or a nearby street number.',
    }
  }

  const centreId = newId()
  const roomId = newId()

  await db.transaction(async (tx) => {
    await tx.insert(centre).values({
      id: centreId,
      name: d.centreName,
      type: d.centreType,
      address: d.address,
      lat: point.lat,
      lng: point.lng,
    })

    await tx.insert(room).values({
      id: roomId,
      centreId,
      name: d.roomName,
      icon: 'users',
      ageMin: d.ageMin,
      ageMax: d.ageMax,
      size: d.size,
      ratioChildrenPerAdult: d.ratio,
      budgetPerChild: String(d.budget),
      transport: d.transport,
      address: d.address,
      lat: point.lat,
      lng: point.lng,
    })

    await tx
      .update(account)
      .set({ name: d.name, role: d.role, centreId })
      .where(eq(account.id, viewer.accountId))
  })

  revalidatePath('/', 'layout')
  const next = String(formData.get('next') || '/')
  redirect(next.startsWith('/') && !next.startsWith('//') ? next : '/')
}
