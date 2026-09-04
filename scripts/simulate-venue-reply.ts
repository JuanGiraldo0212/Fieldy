/*
  Simulate a venue reply. Plan M4, build-order slice 5.

    pnpm simulate:reply                     # newest trip awaiting a reply
    pnpm simulate:reply <tripId>
    pnpm simulate:reply <tripId> --decline  # a "sorry, we're full" reply
    pnpm simulate:reply <tripId> --dates    # a reply proposing other dates
    pnpm simulate:reply <tripId> --file reply.txt
    pnpm simulate:reply <tripId> --attach     # with a PDF, to exercise Storage

  This replaces the prototype's "simulate a venue reply" row, which
  docs/design-map.md §5 marks as prototype-only and not to be built. It is the
  only way to exercise the inbound leg without a real venue writing to us, and
  it exercises the real one: a genuine Svix signature, the real webhook route,
  the real fetch, the real storage writes and the real notification path.

  Two things run here:

  1. A **fixture server**, standing in for Resend. It answers the received-email
     fetch the webhook makes, serves attachment bytes, and swallows the
     notification the webhook then sends — printing it instead of delivering it.
     That last part is why a demo run costs nothing: the Free tier's hundred
     emails a day are not spent on a rehearsal.
  2. The **signed POST** to /api/email/inbound.

  For the app to reach the fixture server, the dev server needs
  RESEND_BASE_URL pointed at it. This script prints the exact line to add to
  .env.local, and refuses to run if it is not set, because a run without it
  would send the notification through the real Resend and fetch a message id
  that does not exist there.
*/

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { desc, eq, inArray } from 'drizzle-orm'
import { Webhook } from 'svix'
import { db, message, program, trip, venue } from '@/db'
import { relayAddress } from '@/lib/email/relay'

const FIXTURE_PORT = Number(process.env.SIMULATE_PORT ?? 4599)

/*
  A real, if minimal, PDF — 
  enough that a browser opening the signed URL renders a page rather than
  refusing a file that claims to be a PDF and is not.
*/
const FIXTURE_PDF = Buffer.from(
  `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 52>>stream
BT /F1 12 Tf 20 50 Td (Fieldy fixture booking form) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>`,
  'latin1',
)
const APP_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
  .replace(/\/+$/, '')

/* ─── The replies ────────────────────────────────────────────────────────── */

/*
  Written the way venues actually write: a greeting, an answer, a signature,
  and our own request quoted underneath by their mail client. The quoted part
  matters — it is what strip.ts has to remove, and a fixture without it would
  test the easy half of the inbound path.
*/
function confirmReply(v: { name: string; date: string }): string {
  return [
    'Hi Sarah,',
    '',
    `${v.date} works for us — we can take the group at 9:30am. I have pencilled you in.`,
    '',
    'There is a picnic shelter you are welcome to use for lunch, and the closest washrooms are by the main entrance.',
    '',
    'Best,',
    'Margaret Doyle',
    `Education Coordinator | ${v.name}`,
    '250-555-0134',
    '',
    `On Mon, Sep 22, 2026 at 9:14 AM Sarah Chen (Sunnyside Daycare) via Fieldy <`,
    'trip-token@mail.fieldy.ca> wrote:',
    '',
    '> Hello,',
    '>',
    '> We are hoping to bring our preschool room to your guided tour.',
    '>',
    '> Sarah Chen',
  ].join('\n')
}

function declineReply(v: { name: string }): string {
  return [
    'Good morning,',
    '',
    'Unfortunately we are fully booked for school groups until the end of November, so we cannot take a booking on either of those dates.',
    '',
    'Kind regards,',
    'Margaret Doyle',
    `${v.name}`,
    '',
    '________________________________',
    'From: Sarah Chen (Sunnyside Daycare) via Fieldy <trip-token@mail.fieldy.ca>',
    'Sent: Monday, September 22, 2026 9:14 AM',
    'Subject: Group visit request',
  ].join('\n')
}

function proposeReply(v: { name: string; alt: string[] }): string {
  return [
    'Hello,',
    '',
    `Neither of those dates works I am afraid, but we could offer ${v.alt.join(' or ')} instead. Let me know which suits and I will hold it.`,
    '',
    'Margaret',
    `${v.name}`,
  ].join('\n')
}

/* ─── Main ───────────────────────────────────────────────────────────────── */

async function main() {
  const args = process.argv.slice(2)
  const tripId =
    args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--file') ?? null
  const flag = (name: string) => args.includes(`--${name}`)
  /* Only when --file is actually present. indexOf returns -1 otherwise, and
     args[0] would then be read as a filename — which makes every other flag
     look like a missing file. */
  const fileAt = args.indexOf('--file')
  const fileArg = fileAt === -1 ? undefined : args[fileAt + 1]

  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    fail(
      'RESEND_WEBHOOK_SECRET is not set.\n\n' +
        '  For local runs any Svix-shaped secret will do, as long as the dev\n' +
        '  server and this script share it. Add to .env.local:\n\n' +
        `    RESEND_WEBHOOK_SECRET=whsec_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64')}`,
    )
  }

  const base = process.env.RESEND_BASE_URL?.trim()
  const expected = `http://127.0.0.1:${FIXTURE_PORT}`
  if (base !== expected) {
    fail(
      `RESEND_BASE_URL is ${base ? `"${base}"` : 'not set'}, and must be "${expected}".\n\n` +
        '  Without it the dev server would ask the real Resend for a message id\n' +
        '  that only exists here, and would send the notification for real.\n\n' +
        '  Add to .env.local and restart `pnpm dev`:\n\n' +
        `    RESEND_BASE_URL=${expected}`,
    )
  }

  const t = await pickTrip(tripId)

  const dates = [...t.trip.dateOptions].sort((a, b) => a.rank - b.rank)
  const firstDate = dates[0] ? longish(dates[0].date) : 'Tuesday October 14'

  let text: string
  if (fileArg) {
    text = await readFile(fileArg, 'utf8')
  } else if (flag('decline')) {
    text = declineReply({ name: t.venue.name })
  } else if (flag('dates')) {
    text = proposeReply({
      name: t.venue.name,
      alt: [addDays(dates[0]?.date, 7), addDays(dates[0]?.date, 12)],
    })
  } else {
    text = confirmReply({ name: t.venue.name, date: firstDate })
  }

  const emailId = `inb_${Math.random().toString(36).slice(2, 12)}`
  const relay = relayAddress(t.trip.relayToken)
  const receivedAt = new Date()

  /* Exactly the shape GET /emails/receiving/{id} returns. */
  const fixture = {
    object: 'email',
    id: emailId,
    to: [relay],
    from: `Margaret Doyle <bookings@${slugDomain(t.venue.name)}>`,
    created_at: receivedAt.toISOString(),
    subject: `Re: Group visit request: ${t.venue.name}`,
    bcc: null,
    cc: null,
    reply_to: null,
    received_for: [relay],
    html: null,
    text,
    headers: {
      'Message-ID': `<${emailId}@${slugDomain(t.venue.name)}>`,
      'In-Reply-To': `<trip-${t.trip.relayToken}.request@mail.fieldy.ca>`,
    },
    message_id: `<${emailId}@${slugDomain(t.venue.name)}>`,
    /*
      --attach is the only way to exercise the Storage leg: the raw message
      always lands in the `mail` bucket, but the attachment download, the
      upload under att/, and the signed URL the thread mints at render are
      only reached when a reply actually carries a file.
    */
    attachments: flag('attach')
      ? [
          {
            id: 'att_1',
            filename: 'booking-form.pdf',
            size: FIXTURE_PDF.length,
            content_type: 'application/pdf',
            content_id: null,
            content_disposition: 'attachment',
          },
        ]
      : [],
  }

  const sent: unknown[] = []
  const server = await startFixtureServer(fixture, sent)

  try {
    const payload = JSON.stringify({
      type: 'email.received',
      created_at: receivedAt.toISOString(),
      data: {
        email_id: emailId,
        created_at: receivedAt.toISOString(),
        from: fixture.from,
        to: fixture.to,
        bcc: [],
        cc: [],
        received_for: fixture.received_for,
        message_id: fixture.message_id,
        subject: fixture.subject,
        attachments: [],
      },
    })

    const msgId = `msg_${emailId}`
    const timestamp = new Date()
    const signature = new Webhook(secret).sign(msgId, timestamp, payload)

    console.log(`Trip     ${t.trip.id}`)
    console.log(`Venue    ${t.venue.name}`)
    console.log(`Program  ${t.program.name}`)
    console.log(`To       ${relay}`)
    console.log(`Status   ${t.trip.status}\n`)

    const res = await fetch(`${APP_URL}/api/email/inbound`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'svix-id': msgId,
        'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
        'svix-signature': signature,
      },
      body: payload,
    })

    const body = await res.text()
    console.log(`Webhook  ${res.status} ${body}\n`)

    if (!res.ok) {
      process.exitCode = 1
      return
    }

    /* `after()` runs the notification once the response is out, so give it a
       moment before reporting what the fixture server caught. */
    await new Promise((r) => setTimeout(r, 1200))

    if (sent.length === 0) {
      console.log(
        'No notification was sent. Either the account has notifications off,\n' +
          'or RESEND_API_KEY / MAIL_DOMAIN is unset on the dev server.',
      )
    } else {
      for (const mail of sent) {
        const m = mail as {
          to?: string[]
          subject?: string
          headers?: Record<string, string>
          reply_to?: unknown
        }
        console.log('Notification (intercepted, not delivered):')
        console.log(`  to        ${m.to?.join(', ')}`)
        console.log(`  subject   ${m.subject}`)
        console.log(`  hops      ${m.headers?.['X-Fieldy-Hops'] ?? '(none)'}`)
        console.log(`  reply-to  ${m.reply_to ?? '(none, as it should be)'}`)
      }
    }

    const after = await db
      .select({ status: trip.status, statusSource: trip.statusSource })
      .from(trip)
      .where(eq(trip.id, t.trip.id))
      .limit(1)

    /*
      What actually landed. `raw_ref` is the one line worth reading twice: null
      means the private `mail` bucket was not written, which on a real Supabase
      project is a misconfiguration rather than the graceful degradation it is
      when storage is switched off entirely.
    */
    const stored = await db
      .select({
        rawRef: message.rawRef,
        attachments: message.attachments,
        body: message.body,
        notifyError: message.notifyError,
      })
      .from(message)
      .where(eq(message.externalMessageId, emailId))
      .limit(1)

    const m = stored[0]
    if (m) {
      console.log('\nStored:')
      console.log(`  raw_ref      ${m.rawRef ?? 'null  ← the mail bucket was NOT written'}`)
      console.log(
        `  attachments  ${m.attachments.length === 0 ? 'none' : m.attachments.map((a) => `${a.name} (${a.size ?? '?'} bytes) → ${a.url}`).join(', ')}`,
      )
      console.log(`  notify_error ${m.notifyError ?? 'none'}`)
      console.log(`  body         ${m.body.split('\n')[0]?.slice(0, 60)}…  (${m.body.length} chars stripped from ${text.length})`)
    }

    console.log(
      `\nTrip is now ${after[0]?.status} (${after[0]?.statusSource}).`,
    )
    console.log(`Open ${APP_URL}/trips/${t.trip.id}`)
  } finally {
    server.close()
  }
}

/* ─── The fixture server ─────────────────────────────────────────────────── */

/*
  Stands in for the Resend API. Three routes are enough:

    GET  /emails/receiving/{id}                    the message the webhook fetches
    GET  /emails/receiving/{id}/attachments/{aid}  a signed download URL
    POST /emails                                   the notification, swallowed

  Anything else answers 404 loudly, so a call we did not anticipate shows up as
  a failure here rather than silently reaching the real Resend.
*/
function startFixtureServer(fixture: unknown, sent: unknown[]) {
  return new Promise<{ close: () => void }>((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url ?? ''
      const send = (status: number, body: unknown) => {
        res.writeHead(status, { 'content-type': 'application/json' })
        res.end(JSON.stringify(body))
      }

      if (req.method === 'GET' && /^\/emails\/receiving\/[^/]+$/.test(url)) {
        return send(200, fixture)
      }

      if (
        req.method === 'GET' &&
        /^\/emails\/receiving\/[^/]+\/attachments\/[^/]+$/.test(url)
      ) {
        return send(200, {
          object: 'attachment',
          id: 'att_1',
          filename: 'booking-form.pdf',
          size: FIXTURE_PDF.length,
          content_type: 'application/pdf',
          content_disposition: 'attachment',
          download_url: `http://127.0.0.1:${FIXTURE_PORT}/blob`,
          expires_at: new Date(Date.now() + 3600_000).toISOString(),
        })
      }

      if (req.method === 'GET' && url === '/blob') {
        res.writeHead(200, {
          'content-type': 'application/pdf',
          'content-length': String(FIXTURE_PDF.length),
        })
        return res.end(FIXTURE_PDF)
      }

      if (req.method === 'POST' && url.startsWith('/emails')) {
        let raw = ''
        req.on('data', (c) => (raw += c))
        req.on('end', () => {
          try {
            sent.push(JSON.parse(raw))
          } catch {
            sent.push({ unparsed: raw })
          }
          send(200, { id: `sim_${Math.random().toString(36).slice(2, 10)}` })
        })
        return
      }

      console.warn(`[fixture] unhandled ${req.method} ${url}`)
      send(404, { message: 'not a route the fixture server knows' })
    })

    server.listen(FIXTURE_PORT, '127.0.0.1', () =>
      resolve({ close: () => server.close() }),
    )
  })
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

async function pickTrip(tripId: string | null) {
  const rows = await db
    .select({ trip, program, venue })
    .from(trip)
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(
      tripId
        ? eq(trip.id, tripId)
        : inArray(trip.status, ['requested', 'replied']),
    )
    .orderBy(desc(trip.createdAt))
    .limit(1)

  const row = rows[0]
  if (!row) {
    fail(
      tripId
        ? `No trip ${tripId}.`
        : 'No trip is waiting on a venue. Plan one first, then run this again.',
    )
  }
  return row!
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function longish(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return `${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

function addDays(iso: string | undefined, n: number): string {
  const base = iso ? new Date(`${iso}T12:00:00Z`) : new Date()
  base.setUTCDate(base.getUTCDate() + n)
  return longish(base.toISOString().slice(0, 10))
}

/* A plausible sending domain for the fixture's From line. Never used to send
   anything — the fixture server swallows every outbound call. */
function slugDomain(venueName: string): string {
  const slug = venueName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20)
  return `${slug || 'venue'}.example.ca`
}

function fail(message: string): never {
  console.error(`\n${message}\n`)
  process.exit(1)
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
