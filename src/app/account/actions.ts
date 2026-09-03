'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { account, centre, db } from '@/db'
import { getViewer } from '@/lib/auth'
import { geocodeAddress } from '@/lib/catalog/geocode'

const schema = z.object({
  name: z.string().trim().min(1, 'We need your name for the request signature.').max(120),
  role: z.enum(['ece', 'director', 'teacher', 'other']),
  phone: z.string().trim().max(40).optional(),
  centreName: z.string().trim().min(1, 'What is the centre called?').max(200),
  centreType: z.enum(['daycare_preschool', 'elementary', 'middle', 'secondary', 'other']),
  address: z.string().trim().min(1, 'We measure every distance from here.').max(300),
  notifications: z.coerce.boolean(),
})

export type AccountState = { error?: string; saved?: boolean }

export async function saveAccount(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'Your session expired. Sign in again.' }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    phone: formData.get('phone') ?? '',
    centreName: formData.get('centreName'),
    centreType: formData.get('centreType'),
    address: formData.get('address'),
    notifications: formData.get('notifications') === 'on',
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Something is missing.' }
  }
  const d = parsed.data

  const existing = await db
    .select()
    .from(centre)
    .where(eq(centre.id, viewer.centreId))
    .limit(1)
  const prior = existing[0]
  if (!prior) return { error: 'We could not find your centre.' }

  /* Only geocode a changed address. Editing your phone number should not
     depend on a geocoder being up. */
  let point = { lat: prior.lat, lng: prior.lng }
  if (prior.address !== d.address || prior.lat == null) {
    const hit = await geocodeAddress(d.address)
    if (!hit) {
      return {
        error:
          'We could not find that address. Try including the city, or a nearby street number.',
      }
    }
    point = hit
  }

  await db.transaction(async (tx) => {
    await tx
      .update(centre)
      .set({
        name: d.centreName,
        type: d.centreType,
        address: d.address,
        lat: point.lat,
        lng: point.lng,
      })
      .where(eq(centre.id, viewer.centreId!))

    await tx
      .update(account)
      .set({
        name: d.name,
        role: d.role,
        phone: d.phone || null,
        emailNotifications: d.notifications,
      })
      .where(eq(account.id, viewer.accountId))
  })

  revalidatePath('/', 'layout')
  return { saved: true }
}
