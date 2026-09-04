import { and, eq } from 'drizzle-orm'
import { db, message, program, trip, venue } from '@/db'
import { newId } from '@/lib/ids'
import type { Attachment } from '@/lib/schemas'
import { resendClient } from './client'
import { mailDomain, tokenFromAddress } from './relay'
import { bodyFromParts } from './strip'
import { attachmentKey, putObject, rawKey, safeName } from './storage'

/*
  Inbound relay. Plan §5.4.

  A venue replies to trip-<token>@mail.<domain> and this is what turns that
  into a message in a thread. It is the only way anything a venue says reaches
  the educator, which sets the standard: a reply that arrives must end up in
  the app, or the director is left believing nobody answered.

  So every failure mode here degrades rather than rejects. An attachment we
  cannot fetch is recorded without its bytes. A message we cannot classify is
  stored unclassified. A notification we cannot send is written to
  `notify_error` and retried. The only things dropped on purpose are the two
  the plan names — mail we cannot route, and our own mail coming back at us.

  Nothing here bounces. A bounce to a venue that mistyped an address teaches
  them nothing and makes us look broken; a log line tells us.
*/

/* The normalised shape of a fetched inbound message, independent of Resend's
   response type so the simulate script and the tests can build one. */
export type InboundMessage = {
  /* Resend's id for the received email. Also our idempotency key. */
  emailId: string
  from: string
  to: string[]
  cc: string[]
  /* The envelope recipient. Survives the display-address rewriting some
     mail systems do, which is why it is checked first. */
  receivedFor: string[]
  subject: string | null
  messageId: string | null
  text: string | null
  html: string | null
  headers: Record<string, string> | null
  attachments: InboundAttachmentRef[]
  receivedAt: Date
}

export type InboundAttachmentRef = {
  id: string
  filename: string | null
  size: number
  contentType: string
}

export type InboundRoute =
  | { kind: 'trip'; token: string }
  /* Someone answered the notification email. Plan §5.4a: they get one polite
     auto-response and nothing is stored. */
  | { kind: 'noreply' }
  | { kind: 'drop'; reason: string }

/*
  Resend documents outbound attachments at 40MB and says nothing about inbound.
  Until that is measured (plan §2, an M4 test item), refuse to pull anything
  larger than this into a webhook that has a response deadline. The attachment
  is still recorded, so the educator learns it exists and can ask the venue to
  resend it.
*/
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024

function header(msg: InboundMessage, name: string): string | null {
  if (!msg.headers) return null
  const wanted = name.toLowerCase()
  for (const [k, v] of Object.entries(msg.headers)) {
    if (k.toLowerCase() === wanted) return v
  }
  return null
}

function localPart(address: string): string | null {
  const bracket = address.match(/<([^>]+)>/)
  const bare = (bracket ? bracket[1]! : address).trim().toLowerCase()
  const at = bare.lastIndexOf('@')
  return at === -1 ? null : bare.slice(0, at)
}

function domainOf(address: string): string | null {
  const bracket = address.match(/<([^>]+)>/)
  const bare = (bracket ? bracket[1]! : address).trim().toLowerCase()
  const at = bare.lastIndexOf('@')
  return at === -1 ? null : bare.slice(at + 1)
}

/*
  Where an inbound message belongs. Pure — no database, no network — because
  the routing rules are the part most worth testing and the part hardest to
  test through a webhook.

  The loop guard runs first, ahead of the plan's own ordering of these two
  checks. Same outcomes either way, but this way a message from our own domain
  cannot be stored even if it happens to carry a resolvable token, which is
  exactly the shape a mail loop takes.
*/
export function routeInbound(
  msg: InboundMessage,
  domain = mailDomain(),
): InboundRoute {
  const fromDomain = domainOf(msg.from)
  if (fromDomain && fromDomain === domain.toLowerCase()) {
    return { kind: 'drop', reason: `loop: from ${msg.from} is on ${domain}` }
  }

  const hops = Number(header(msg, 'X-Fieldy-Hops') ?? '0')
  if (Number.isFinite(hops) && hops >= 2) {
    return { kind: 'drop', reason: `loop: X-Fieldy-Hops is ${hops}` }
  }

  /*
    Envelope recipient first, then the visible To and Cc. A venue that replies
    to all puts our address somewhere in that set; which field it lands in is
    up to their client, not us.
  */
  const candidates = [...msg.receivedFor, ...msg.to, ...msg.cc]

  for (const address of candidates) {
    const token = tokenFromAddress(address, domain)
    if (token) return { kind: 'trip', token }
  }

  /*
    The notification address. Checked after the trip addresses so that a reply
    carrying both — a director replying-all to a notification — is still filed
    against the trip rather than answered by a robot.
  */
  for (const address of candidates) {
    if (
      localPart(address) === 'noreply' &&
      domainOf(address) === domain.toLowerCase()
    ) {
      return { kind: 'noreply' }
    }
  }

  /*
    Last resort. Some mail systems rewrite the recipient entirely; the header
    we set on the way out survives that, which is the reason send.ts sets it.
  */
  const tripHeader = header(msg, 'X-Fieldy-Trip')?.trim()
  if (tripHeader && /^[a-hjkmnp-tv-z0-9]{6,32}$/.test(tripHeader)) {
    return { kind: 'trip', token: tripHeader }
  }

  return {
    kind: 'drop',
    reason: `unroutable: no trip address in ${candidates.join(', ') || '(no recipients)'}`,
  }
}

/*
  The display name a thread shows for a venue message.

  The From display name if there is one, because "Margaret Doyle" reads like a
  person a director can ring. The venue's own name if there is not, because
  "bookings" does not.
*/
export function authorNameFrom(from: string, venueName: string): string {
  const display = from.match(/^\s*"?([^"<]+?)"?\s*</)?.[1]?.trim()
  if (display && !display.includes('@')) return display
  return venueName
}

export type InboundOutcome =
  | { stored: true; messageId: string; tripId: string }
  | { stored: false; reason: string; noreplyTo?: string }

/*
  Store a venue reply. Steps 3 to 7 of plan §5.4; the notification (step 8) is
  the caller's, so it can defer it with `after()` and answer Resend first.
*/
export async function handleInbound(
  msg: InboundMessage,
  domain = mailDomain(),
): Promise<InboundOutcome> {
  const route = routeInbound(msg, domain)

  if (route.kind === 'drop') return { stored: false, reason: route.reason }
  if (route.kind === 'noreply') {
    return { stored: false, reason: 'noreply', noreplyTo: msg.from }
  }

  const rows = await db
    .select({
      id: trip.id,
      status: trip.status,
      centreId: trip.centreId,
    })
    .from(trip)
    .where(eq(trip.relayToken, route.token))
    .limit(1)

  const t = rows[0]
  if (!t) {
    return { stored: false, reason: `no trip for token ${route.token}` }
  }
  /*
    A finished trip's address stops accepting mail. Not an error — a venue
    saying "thanks, see you then" a week after the visit is polite, not
    actionable, and reopening a closed thread to hold it would put the trip
    back in front of a director who is done with it.
  */
  if (t.status === 'cancelled' || t.status === 'done') {
    return { stored: false, reason: `trip ${t.id} is ${t.status}` }
  }

  /*
    Idempotency. Svix retries a webhook that did not answer 2xx quickly enough,
    and a retry must not put the venue's reply in the thread twice. The insert
    below leans on the unique index on `external_message_id` (migration 0005);
    this check keeps the common case cheap and lets us say so in the log.
  */
  const seen = await db
    .select({ id: message.id })
    .from(message)
    .where(
      and(
        eq(message.tripId, t.id),
        eq(message.externalMessageId, msg.emailId),
      ),
    )
    .limit(1)
  if (seen[0]) {
    return { stored: false, reason: `already stored as ${seen[0].id}` }
  }

  const messageRowId = newId()

  /*
    The raw message first, before anything derived from it. If the process dies
    after this point we have the bytes and can replay; if it died before, there
    would be nothing to replay from.
  */
  const key = rawKey(t.id, messageRowId)
  const raw = await putObject(
    key,
    JSON.stringify(
      {
        email_id: msg.emailId,
        from: msg.from,
        to: msg.to,
        cc: msg.cc,
        received_for: msg.receivedFor,
        subject: msg.subject,
        message_id: msg.messageId,
        headers: msg.headers,
        text: msg.text,
        html: msg.html,
        received_at: msg.receivedAt.toISOString(),
      },
      null,
      2,
    ),
    'application/json',
  )

  const attachments = await storeAttachments(t.id, messageRowId, msg)
  const { body, bodyFull } = bodyFromParts({ text: msg.text, html: msg.html })

  const venueName = await venueNameForTrip(t.id)

  await db.transaction(async (tx) => {
    await tx
      .insert(message)
      .values({
        id: messageRowId,
        tripId: t.id,
        party: 'venue',
        authorName: authorNameFrom(msg.from, venueName),
        body: body || '(The venue sent no message text.)',
        bodyFull: bodyFull || null,
        subject: msg.subject,
        sentAt: msg.receivedAt,
        attachments,
        rawRef: raw.ok ? key : null,
        channel: 'email',
        externalMessageId: msg.emailId,
        rfcMessageId: msg.messageId,
      })
      /* The index this leans on is partial and scoped to the id, so a second
         delivery of the same email lands here and changes nothing. */
      .onConflictDoNothing()

    /*
      Only `requested` moves. A trip a director has already confirmed by hand
      must not be dragged back to "They answered" because the venue sent a
      follow-up about parking.
    */
    if (t.status === 'requested') {
      await tx
        .update(trip)
        .set({
          status: 'replied',
          statusSource: 'system',
          lastVenueReplyAt: msg.receivedAt,
          updatedAt: new Date(),
        })
        .where(and(eq(trip.id, t.id), eq(trip.status, 'requested')))
    } else {
      await tx
        .update(trip)
        .set({ lastVenueReplyAt: msg.receivedAt, updatedAt: new Date() })
        .where(eq(trip.id, t.id))
    }
  })

  /*
    Step 7, the rule-based classifier, lands here in slice 6. It is synchronous
    and takes milliseconds, so it belongs in this handler rather than a job —
    the seam is one call writing `message.suggestion`, and nothing above needs
    to change to accommodate it.
  */

  return { stored: true, messageId: messageRowId, tripId: t.id }
}

/*
  Attachments, best effort by design. Plan §5.4 step 5.

  A failed download is recorded rather than dropped: the chip still names the
  file, so a director learns the venue sent "Booking form.pdf" and can ask for
  it again. A silently missing attachment teaches her nothing, and she has no
  way to know there was ever anything to ask about.
*/
async function storeAttachments(
  tripId: string,
  messageRowId: string,
  msg: InboundMessage,
): Promise<Attachment[]> {
  const out: Attachment[] = []

  for (const a of msg.attachments) {
    const name = a.filename ?? 'attachment'
    const key = attachmentKey(tripId, messageRowId, name)
    const record: Attachment = {
      name: safeName(name),
      url: key,
      mime: a.contentType || null,
      size: Number.isFinite(a.size) ? a.size : null,
    }
    out.push(record)

    if (a.size > MAX_ATTACHMENT_BYTES) {
      console.warn(
        `[inbound] attachment ${a.id} is ${a.size} bytes, over the ${MAX_ATTACHMENT_BYTES} cap — recorded without bytes`,
      )
      continue
    }

    try {
      const bytes = await downloadAttachment(msg.emailId, a.id)
      if (!bytes) continue
      const put = await putObject(key, bytes, a.contentType || 'application/octet-stream')
      if (!put.ok) {
        console.warn(`[inbound] could not store attachment ${a.id}: ${put.error}`)
      }
    } catch (cause) {
      console.warn(
        `[inbound] could not fetch attachment ${a.id}: ${cause instanceof Error ? cause.message : cause}`,
      )
    }
  }

  return out
}

/*
  Two hops, because Resend does not put attachment bytes in the message: ask
  for a signed download URL, then fetch it. Injected for tests and for the
  simulate script, which serves both from a fixture.
*/
export type AttachmentFetcher = (
  emailId: string,
  attachmentId: string,
) => Promise<Uint8Array | null>

let fetchAttachment: AttachmentFetcher | null = null

export function setAttachmentFetcher(fn: AttachmentFetcher | null): void {
  fetchAttachment = fn
}

async function downloadAttachment(
  emailId: string,
  attachmentId: string,
): Promise<Uint8Array | null> {
  if (fetchAttachment) return fetchAttachment(emailId, attachmentId)

  const { data, error } = await resendClient().emails.receiving.attachments.get({
    emailId,
    id: attachmentId,
  })
  if (error || !data?.download_url) return null

  const res = await fetch(data.download_url)
  if (!res.ok) return null
  return new Uint8Array(await res.arrayBuffer())
}

/* The fallback author name. One small query rather than joining it into the
   trip lookup, because it is only read when the From line has no display
   name. */
async function venueNameForTrip(tripId: string): Promise<string> {
  const rows = await db
    .select({ name: venue.name })
    .from(trip)
    .innerJoin(program, eq(trip.programId, program.id))
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(trip.id, tripId))
    .limit(1)
  return rows[0]?.name ?? 'The venue'
}
