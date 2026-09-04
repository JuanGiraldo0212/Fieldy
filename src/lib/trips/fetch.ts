import { and, asc, count, desc, eq, isNull, sql } from 'drizzle-orm'
import { db, message, program, savedOuting, trip, venue } from '@/db'

/*
  One trip, scoped by centre.

  The centre comparison is the access boundary, not a nicety: Drizzle connects
  as the table owner and is exempt from RLS, so a trip id typed into the
  address bar is only stopped here.
*/
export async function fetchTrip(tripId: string, centreId: string) {
  const rows = await db
    .select()
    .from(trip)
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(and(eq(trip.id, tripId), eq(trip.centreId, centreId)))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.tripId, tripId))
    .orderBy(asc(message.sentAt))

  return { trip: row.trip, program: row.program, venue: row.venue, messages }
}

/*
  Every trip in a centre, with the two facts My trips needs beyond the row
  itself: who spoke last, and whether a venue message is still unread.

  Both are aggregates over `message`, done in SQL rather than by loading every
  thread. A centre with forty trips would otherwise mean forty round trips to
  render one list.
*/
export async function fetchTrips(centreId: string) {
  const lastMessage = db
    .select({
      tripId: message.tripId,
      party: sql<string>`(array_agg(${message.party} order by ${message.sentAt} desc))[1]`.as('party'),
      at: sql<Date>`max(${message.sentAt})`.as('at'),
    })
    .from(message)
    .groupBy(message.tripId)
    .as('last_message')

  const unread = db
    .select({
      tripId: message.tripId,
      unread: count().as('unread'),
      /* The oldest unread one, so "New reply" opens the trip at the first
         message she has not read rather than the last. Slice 5's demo is
         exactly this: tap the row, land on the right message. */
      firstUnreadId:
        sql<string>`(array_agg(${message.id} order by ${message.sentAt} asc))[1]`.as(
          'first_unread_id',
        ),
    })
    .from(message)
    .where(and(eq(message.party, 'venue'), isNull(message.readAt)))
    .groupBy(message.tripId)
    .as('unread_venue')

  return db
    .select({
      trip,
      program,
      venue,
      lastMessageParty: lastMessage.party,
      lastMessageAt: lastMessage.at,
      unreadCount: unread.unread,
      firstUnreadId: unread.firstUnreadId,
    })
    .from(trip)
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .leftJoin(lastMessage, eq(lastMessage.tripId, trip.id))
    .leftJoin(unread, eq(unread.tripId, trip.id))
    .where(eq(trip.centreId, centreId))
    .orderBy(desc(trip.createdAt))
}

/*
  Saved outings, for the first tab. Saved per account rather than per centre:
  a shortlist is one person's thinking, and two educators at the same centre
  should not be editing each other's.
*/
export async function fetchSaved(accountId: string) {
  return db
    .select({ program, venue, savedAt: savedOuting.savedAt })
    .from(savedOuting)
    .innerJoin(program, eq(savedOuting.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(savedOuting.accountId, accountId))
    .orderBy(desc(savedOuting.savedAt))
}

export async function isSaved(accountId: string, programId: string) {
  const rows = await db
    .select({ programId: savedOuting.programId })
    .from(savedOuting)
    .where(
      and(
        eq(savedOuting.accountId, accountId),
        eq(savedOuting.programId, programId),
      ),
    )
    .limit(1)
  return rows.length > 0
}
