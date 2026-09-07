import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { account, centre, db, room } from '@/db'
import { createClient } from './supabase/server'

/*
  Who is asking, and what they can see.

  Every read of a centre's data goes through the centre id this returns.
  Drizzle connects as the database owner and is exempt from RLS, so this is
  the actual access control, not a convenience. See src/lib/supabase/server.ts.
*/

export type Viewer = {
  accountId: string
  email: string
  name: string
  centreId: string | null
  /* May open /admin and edit the catalog. See account.is_admin in the schema. */
  isAdmin: boolean
}

/* `cache` dedupes this within a single render pass: a page and three of its
   components can each ask who the viewer is without three round trips. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const rows = await db
    .select({
      accountId: account.id,
      email: account.email,
      name: account.name,
      centreId: account.centreId,
      isAdmin: account.isAdmin,
    })
    .from(account)
    .where(eq(account.id, user.id))
    .limit(1)

  const row = rows[0]
  if (!row) {
    /* Authenticated but no account row. The trigger should have made one, so
       this means the trigger did not run — a broken install, not a new user. */
    return {
      accountId: user.id,
      email: user.email ?? '',
      name: '',
      centreId: null,
      isAdmin: false,
    }
  }
  return row
})

/*
  The admin gate. Null for a signed-out visitor and for a signed-in one who is
  not an admin; the caller decides between a login redirect and a 404. Every
  /admin page AND every admin server action calls this — rendering a form only
  to admins is not a boundary, because the action's POST can be sent without
  the form. Same rule as the centre scoping above: Drizzle is exempt from RLS,
  so this check is the whole of the access control.
*/
export async function requireAdmin(): Promise<Viewer | null> {
  const viewer = await getViewer()
  return viewer?.isAdmin ? viewer : null
}

/* The rooms a viewer can actually use: theirs, and not archived. */
export const getRooms = cache(async (centreId: string) => {
  return db
    .select()
    .from(room)
    .where(eq(room.centreId, centreId))
    .orderBy(room.createdAt)
})

export const getCentre = cache(async (centreId: string) => {
  const rows = await db.select().from(centre).where(eq(centre.id, centreId)).limit(1)
  return rows[0] ?? null
})

/*
  The room the catalog measures against. Until a room picker exists, the first
  non-archived room is the active one; slice 4's plan screen is where choosing
  between them starts to matter.
*/
export async function getActiveRoom(centreId: string | null) {
  if (!centreId) return null
  const rooms = await getRooms(centreId)
  return rooms.find((r) => r.archivedAt == null) ?? null
}
