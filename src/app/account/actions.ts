'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { account, centre, db } from '@/db'
import { getViewer } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { geocodeAddress, pickedPoint } from '@/lib/catalog/geocode'
import { CENTRE_TYPE_VALUES, ROLE_VALUES, otherText } from '@/lib/roles'

const schema = z.object({
  name: z.string().trim().min(1, 'We need your name for the request signature.').max(120),
  role: z.enum(ROLE_VALUES),
  roleOther: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  centreName: z.string().trim().min(1, 'What is the centre called?').max(200),
  centreType: z.enum(CENTRE_TYPE_VALUES),
  centreTypeOther: z.string().trim().max(120).optional(),
  address: z.string().trim().min(1, 'We measure every distance from here.').max(300),
  notifications: z.coerce.boolean(),
})

export type AccountState = { error?: string; saved?: boolean }

export async function saveAccount(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const viewer = await getViewer()
  if (!viewer?.centreId) return { error: 'You have been signed out. Sign in again.' }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    roleOther: formData.get('roleOther') ?? '',
    phone: formData.get('phone') ?? '',
    centreName: formData.get('centreName'),
    centreType: formData.get('centreType'),
    centreTypeOther: formData.get('centreTypeOther') ?? '',
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
  let point: { lat: number | null; lng: number | null } = {
    lat: prior.lat,
    lng: prior.lng,
  }
  const chosen = pickedPoint(formData.get('addressLat'), formData.get('addressLng'))
  if (chosen) {
    point = chosen
  } else if (prior.address !== d.address || prior.lat == null) {
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
        typeOther: otherText(d.centreType, d.centreTypeOther ?? null),
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
        roleOther: otherText(d.role, d.roleOther ?? null),
        phone: d.phone || null,
        emailNotifications: d.notifications,
      })
      .where(eq(account.id, viewer.accountId))
  })

  revalidatePath('/', 'layout')
  return { saved: true }
}

/*
  Sign out.

  `scope: 'local'` rather than the library's default `'global'`: global revokes
  every refresh token the account holds, so signing out of the centre's shared
  desktop would also sign her out on her phone, which is not what the button
  says it does.

  The result is not checked, and that is deliberate. @supabase/ssr clears the
  session cookie whether or not the revocation call reaches the auth server
  (see GoTrueClient._signOut: it removes the local session on the error path
  too, for every scope but 'others'). So there is no failure to report — this
  browser is signed out either way, and the only place to go is /login.
*/
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: 'local' })

  /* The top bar draws the viewer's initials on every page, so everything
     cached above this one is now showing the wrong person. */
  revalidatePath('/', 'layout')
  redirect('/login')
}
