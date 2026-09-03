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
    }
  }
  return row
})

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
