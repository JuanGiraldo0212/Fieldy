'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { db, savedOuting } from '@/db'
import { getViewer } from '@/lib/auth'

/*
  Save an outing to the shortlist. Design's "Saved" tab on My trips.

  Saved per account rather than per centre: a shortlist is one person's
  thinking, and two educators at the same centre should not be quietly
  removing each other's ideas.
*/

export type SaveState = { saved?: boolean; error?: string }

export async function toggleSaved(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const viewer = await getViewer()
  if (!viewer) {
    return { error: 'Sign in and we will keep this on your shortlist.' }
  }

  const programId = String(formData.get('programId') ?? '')
  if (!programId) return { error: 'Which outing?' }

  const existing = await db
    .select({ programId: savedOuting.programId })
    .from(savedOuting)
    .where(
      and(
        eq(savedOuting.accountId, viewer.accountId),
        eq(savedOuting.programId, programId),
      ),
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(savedOuting)
      .where(
        and(
          eq(savedOuting.accountId, viewer.accountId),
          eq(savedOuting.programId, programId),
        ),
      )
    revalidatePath('/trips')
    return { saved: false }
  }

  /* onConflictDoNothing rather than a second existence check: two taps in
     quick succession race, and a primary key violation is not something to
     show a director. */
  await db
    .insert(savedOuting)
    .values({ accountId: viewer.accountId, programId })
    .onConflictDoNothing()

  revalidatePath('/trips')
  return { saved: true }
}
