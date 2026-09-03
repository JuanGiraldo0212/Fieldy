import { and, asc, desc, eq } from 'drizzle-orm'
import { db, message, program, trip, venue } from '@/db'

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

/* The centre's trips, newest first.

   Deliberately plain: the grouping, the urgency sort and the "Needs my reply"
   filter that spec §5.6 describes belong to the slice that builds My trips
   properly. This exists so a trip is reachable again after you navigate away,
   which a trip you can only see once is not. */
export async function fetchTrips(centreId: string) {
  return db
    .select()
    .from(trip)
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(trip.centreId, centreId))
    .orderBy(desc(trip.createdAt))
}
