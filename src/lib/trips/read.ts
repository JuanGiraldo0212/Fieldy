import { revalidatePath } from 'next/cache'
import { and, eq, isNull } from 'drizzle-orm'
import { db, message, trip } from '@/db'

/*
  Marking a thread read. Spec §5.4.5: "Unread venue messages carry a dot until
  the page is viewed."

  Deliberately NOT a server action, and not in app/trips/actions.ts.

  A 'use server' export is a public endpoint, and this one takes the centre id
  it scopes by. As an action, anybody could post their own centre id and clear
  the dots on somebody else's thread. The only caller is the trip page, which
  has already established both ids honestly, so a plain server-side module is
  both simpler and the safe shape.
*/
export async function markThreadRead(
  tripId: string,
  centreId: string,
): Promise<void> {
  /* Scoped anyway. Drizzle is exempt from RLS, so the comparison in the
     WHERE clause is the access control — the caller's honesty is not. */
  const updated = await db
    .update(message)
    .set({ readAt: new Date() })
    .from(trip)
    .where(
      and(
        eq(message.tripId, trip.id),
        eq(trip.id, tripId),
        eq(trip.centreId, centreId),
        eq(message.party, 'venue'),
        isNull(message.readAt),
      ),
    )
    .returning({ id: message.id })

  /* The nav badge and the My trips "New reply" dots are counted from these
     rows, so both go stale the moment anything here changes. Revalidating on
     every page view instead would throw away the list cache for nothing. */
  if (updated.length > 0) revalidatePath('/trips')
}
