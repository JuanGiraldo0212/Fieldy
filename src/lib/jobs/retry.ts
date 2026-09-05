import { and, eq, gt, isNotNull, sql } from 'drizzle-orm'
import { centre, db, message, trip } from '@/db'
import { notifyVenueReply } from '@/lib/email/notify'
import { sendingConfigured, sendRelayMessage } from '@/lib/email/send'

/*
  The retry job. Plan §2: "If a step fails it is recorded on the message
  (`send_error`, `notify_error`) and retried by a Supabase cron job (pg_cron)
  calling /api/jobs/retry every 5 minutes."

  Two very different failures, deliberately handled by one job:

  - **`send_error`** is a request that never reached a venue. The educator can
    see it — the trip page says so and offers a retry — so this is a safety net
    under a visible problem.
  - **`notify_error`** is a nudge that never reached the educator. Nobody can
    see it, by design (§5.4a: the message is already in the app), so this job is
    the only thing that will ever fix it.

  Neither retries forever. A message that has been failing for a week is not
  going to start working, and quietly re-sending to an address that bounces
  every five minutes is how a domain's reputation gets spent.
*/

/* After this, a stuck message is a thing to look at, not a thing to retry. */
const GIVE_UP_AFTER_DAYS = 7

/* A cron tick should finish well inside its five minutes even when a backlog
   has built up. Whatever is left waits for the next one. */
const BATCH = 25

export type RetryReport = {
  sends: { attempted: number; recovered: number }
  notifications: { attempted: number; recovered: number }
  skipped?: string
}

export async function runRetries(): Promise<RetryReport> {
  if (!sendingConfigured()) {
    /* Nothing here can succeed without a mail provider, and pretending to try
       would just rewrite the same error onto every row every five minutes. */
    return {
      sends: { attempted: 0, recovered: 0 },
      notifications: { attempted: 0, recovered: 0 },
      skipped: 'sending is not configured',
    }
  }

  return {
    sends: await retrySends(),
    notifications: await retryNotifications(),
  }
}

function recentEnough() {
  return gt(
    message.sentAt,
    sql`now() - ${`${GIVE_UP_AFTER_DAYS} days`}::interval`,
  )
}

/*
  Requests that never left. Re-sending is re-running the same call — the row
  already holds the body, the subject and the token — so nothing is composed
  again and the venue cannot receive two different versions of one request.
*/
async function retrySends(): Promise<{ attempted: number; recovered: number }> {
  const stuck = await db
    .select({ message, trip, centre })
    .from(message)
    .innerJoin(trip, eq(message.tripId, trip.id))
    .innerJoin(centre, eq(trip.centreId, centre.id))
    .where(
      and(
        isNotNull(message.sendError),
        eq(message.party, 'educator'),
        isNotNull(trip.venueEmail),
        recentEnough(),
      ),
    )
    .limit(BATCH)

  let recovered = 0

  for (const row of stuck) {
    const { message: m, trip: t, centre: c } = row
    const sent = await sendRelayMessage({
      token: t.relayToken,
      messageRowId: m.id,
      senderName: m.authorName,
      centreName: c.name,
      venueEmail: t.venueEmail!,
      subject: m.subject ?? 'Group visit request',
      body: m.body,
    })

    await db
      .update(message)
      .set(
        sent.ok
          ? { externalMessageId: sent.externalMessageId, sendError: null }
          : { sendError: sent.error },
      )
      .where(eq(message.id, m.id))

    if (sent.ok) recovered++
  }

  return { attempted: stuck.length, recovered }
}

/*
  Nudges that never arrived. `notifyVenueReply` rewrites `notify_error` itself
  — null on success, the reason on failure — so this only has to choose the
  rows and count what cleared.
*/
async function retryNotifications(): Promise<{
  attempted: number
  recovered: number
}> {
  const stuck = await db
    .select({ id: message.id })
    .from(message)
    .where(
      and(
        isNotNull(message.notifyError),
        eq(message.party, 'venue'),
        recentEnough(),
      ),
    )
    .limit(BATCH)

  let recovered = 0

  for (const row of stuck) {
    await notifyVenueReply(row.id)
    const after = await db
      .select({ notifyError: message.notifyError })
      .from(message)
      .where(eq(message.id, row.id))
      .limit(1)
    if (after[0]?.notifyError == null) recovered++
  }

  return { attempted: stuck.length, recovered }
}
