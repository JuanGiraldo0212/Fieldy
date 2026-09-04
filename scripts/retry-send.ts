/*
  Retry an undelivered message.

    pnpm tsx scripts/retry-send.ts            # list what is stuck
    pnpm tsx scripts/retry-send.ts <messageId>

  A message with `send_error` set is one that never left: no API key, a key
  scoped to the wrong domain, a network blip. The row already holds everything
  the send needs, so retrying is re-running the same call rather than asking a
  director to type her request a second time.

  Development tool. The proper retry lives on the trip page and at
  /api/jobs/retry (plan §5.5); this exists so a stuck message can be pushed
  through from a terminal while that is being built.

  Honours DEV_EMAIL_OVERRIDE like every other send, so it cannot mail a real
  venue by accident.
*/

import { eq, isNotNull } from 'drizzle-orm'
import { db, centre, message, trip } from '@/db'
import { sendRelayMessage, sendingConfigured } from '@/lib/email/send'
import { deliverTo } from '@/lib/email/relay'

async function main() {
  const id = process.argv[2]

  const stuck = await db
    .select({
      id: message.id,
      subject: message.subject,
      error: message.sendError,
      tripId: message.tripId,
    })
    .from(message)
    .where(isNotNull(message.sendError))

  if (!id) {
    if (stuck.length === 0) {
      console.log('Nothing stuck.')
      return
    }
    console.log(`${stuck.length} undelivered:\n`)
    for (const m of stuck) {
      console.log(`  ${m.id}\n    ${m.subject ?? '(no subject)'}\n    ${m.error}\n`)
    }
    console.log('Retry one:  pnpm tsx scripts/retry-send.ts <messageId>')
    return
  }

  if (!sendingConfigured()) {
    console.error('RESEND_API_KEY or MAIL_DOMAIN is not set.')
    process.exitCode = 1
    return
  }

  const rows = await db
    .select()
    .from(message)
    .innerJoin(trip, eq(message.tripId, trip.id))
    .innerJoin(centre, eq(trip.centreId, centre.id))
    .where(eq(message.id, id))
    .limit(1)

  const row = rows[0]
  if (!row) {
    console.error(`No message ${id}.`)
    process.exitCode = 1
    return
  }

  const { message: m, trip: t, centre: c } = row
  if (!t.venueEmail) {
    console.error('That trip has no venue email. Nowhere to send.')
    process.exitCode = 1
    return
  }

  const { to, redirected } = deliverTo(t.venueEmail)
  console.log(`Sending ${m.id}`)
  console.log(`  subject: ${m.subject}`)
  console.log(`  to:      ${to}${redirected ? `  (redirected from ${t.venueEmail})` : ''}`)
  if (!redirected) {
    console.log('\n  WARNING: DEV_EMAIL_OVERRIDE is not set. This goes to the real venue.')
  }

  const sent = await sendRelayMessage({
    token: t.relayToken,
    messageRowId: m.id,
    senderName: m.authorName,
    centreName: c.name,
    venueEmail: t.venueEmail,
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

  if (sent.ok) {
    console.log(`\nSent. Resend id ${sent.externalMessageId}`)
  } else {
    console.error(`\nFailed: ${sent.error}`)
    process.exitCode = 1
  }
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
