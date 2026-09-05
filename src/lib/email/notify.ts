import { and, eq, lt } from 'drizzle-orm'
import { account, autoResponse, db, message, program, trip, venue } from '@/db'
import { longDate } from '@/lib/trips/asks'
import { resendClient } from './client'
import { mailDomain } from './relay'
import { sendingConfigured } from './send'
import {
  autoResponseHtml,
  autoResponseSubject,
  autoResponseText,
  notificationHtml,
  notificationSubject,
  notificationText,
  previewOf,
} from './templates/notification'

/*
  Telling the educator a venue answered. Plan §5.4a.

  This is the one piece of the relay that does not carry data. The message is
  already in the app by the time this runs — that is why the webhook stores
  first and notifies after — so a notification that never arrives costs a nudge,
  not a reply.

  Which is why nothing here is surfaced on the trip page. `notify_error` is
  written for the retry job and for us; the educator is never shown "we could
  not email you about a message you are currently reading".
*/

const NOTIFY_FROM_LOCAL = 'noreply'

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
    /\/+$/,
    '',
  )
}

const client = resendClient

/*
  Send the "they replied" nudge for one stored venue message.

  Every account at the centre with notifications on, which in the MVP is one
  person — multi-user centres are out of scope (plan §1) — but writing it as a
  set costs nothing and avoids picking an arbitrary row when a centre does have
  two directors.
*/
export async function notifyVenueReply(messageId: string): Promise<void> {
  const rows = await db
    .select({
      message,
      trip,
      program,
      venue,
    })
    .from(message)
    .innerJoin(trip, eq(message.tripId, trip.id))
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(message.id, messageId))
    .limit(1)

  const row = rows[0]
  if (!row) return

  const recipients = await db
    .select({ email: account.email })
    .from(account)
    .where(
      and(
        eq(account.centreId, row.trip.centreId),
        eq(account.emailNotifications, true),
      ),
    )

  /* Notifications off is a setting, not a failure. Nothing to retry. */
  if (recipients.length === 0) {
    await db
      .update(message)
      .set({ notifyError: null })
      .where(eq(message.id, messageId))
    return
  }

  if (!sendingConfigured()) {
    await recordNotifyResult(
      messageId,
      'Not sent. Fieldy is not connected to an email service.',
    )
    return
  }

  const first = [...row.trip.dateOptions].sort((a, b) => a.rank - b.rank)[0]
  const input = {
    venueName: row.venue.name,
    programName: row.program.name,
    authorName: row.message.authorName,
    firstDate: row.trip.confirmedDate
      ? longDate(row.trip.confirmedDate)
      : first
        ? longDate(first.date)
        : null,
    preview: previewOf(row.message.body),
    tripUrl: `${siteUrl()}/trips/${row.trip.id}#msg-${row.message.id}`,
  }

  try {
    const { error } = await client().emails.send({
      from: `"Fieldy" <${NOTIFY_FROM_LOCAL}@${mailDomain()}>`,
      to: recipients.map((r) => r.email),
      subject: notificationSubject(input),
      text: notificationText(input),
      html: notificationHtml(input),
      headers: {
        /*
          One hop. Anything that comes back at us carrying 2 or more is a loop
          and is dropped on arrival (plan §5.4a).
        */
        'X-Fieldy-Hops': '1',
        /*
          Tells well-behaved clients not to send vacation replies and not to
          treat this as a conversation. It does not stop a person hitting
          reply, which is what the auto-response below is for.
        */
        'Auto-Submitted': 'auto-generated',
      },
      /* No replyTo. Deliberate: the address this comes from does not resolve to
         a trip, and the educator answers in the app. */
    })
    await recordNotifyResult(messageId, error ? error.message : null)
  } catch (cause) {
    await recordNotifyResult(
      messageId,
      cause instanceof Error ? cause.message : 'notification failed',
    )
  }
}

async function recordNotifyResult(
  messageId: string,
  error: string | null,
): Promise<void> {
  await db
    .update(message)
    .set({ notifyError: error })
    .where(eq(message.id, messageId))
  if (error) console.warn(`[notify] ${messageId}: ${error}`)
}

/* ─── The no-reply auto-response ─────────────────────────────────────────── */

const AUTO_RESPONSE_WINDOW_MS = 24 * 60 * 60 * 1000

/*
  Someone answered the notification email. Plan §5.4a.

  They typed a real reply to their venue and it went nowhere. Silence teaches
  them that Fieldy swallowed it; one line teaches them where the reply belongs.

  Once per address per 24 hours, so a mail loop or a busy afternoon cannot turn
  this into a correspondence. The throttle is claimed before the send, not
  after: a send that fails and is never retried costs one lost auto-response,
  where a claim written after a crash would let the next delivery send another.
*/
export async function sendAutoResponse(toAddress: string): Promise<void> {
  const address = bareAddress(toAddress)
  if (!address) return

  if (!(await claimAutoResponse(address))) return

  if (!sendingConfigured()) {
    console.warn(`[notify] auto-response to ${address} skipped: sending is off`)
    return
  }

  try {
    await client().emails.send({
      from: `"Fieldy" <${NOTIFY_FROM_LOCAL}@${mailDomain()}>`,
      to: [address],
      subject: autoResponseSubject(),
      text: autoResponseText(siteUrl()),
      html: autoResponseHtml(siteUrl()),
      headers: {
        /* Two hops: if this ever comes back, the loop guard drops it on
           arrival rather than answering it again. */
        'X-Fieldy-Hops': '2',
        'Auto-Submitted': 'auto-replied',
      },
    })
  } catch (cause) {
    console.warn(
      `[notify] auto-response to ${address} failed: ${cause instanceof Error ? cause.message : cause}`,
    )
  }
}

/*
  True when this address has not been answered in the window, and marks it
  answered in the same statement. One round trip, and no gap between the check
  and the claim for two concurrent deliveries to slip through.
*/
async function claimAutoResponse(address: string): Promise<boolean> {
  const now = new Date()
  const cutoff = new Date(now.getTime() - AUTO_RESPONSE_WINDOW_MS)

  const claimed = await db
    .insert(autoResponse)
    .values({ address, lastSentAt: now })
    .onConflictDoUpdate({
      target: autoResponse.address,
      set: { lastSentAt: now },
      /* Only overwrite a row that has gone stale. A recent one blocks the
         update, no row comes back, and we stay quiet. */
      setWhere: lt(autoResponse.lastSentAt, cutoff),
    })
    .returning({ address: autoResponse.address })

  return claimed.length > 0
}

function bareAddress(address: string): string | null {
  const bracket = address.match(/<([^>]+)>/)
  const bare = (bracket ? bracket[1]! : address).trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bare) ? bare : null
}
