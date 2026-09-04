import { after } from 'next/server'
import { Webhook } from 'svix'
import { resendClient } from '@/lib/email/client'
import { handleInbound, type InboundMessage } from '@/lib/email/inbound'
import { notifyVenueReply, sendAutoResponse } from '@/lib/email/notify'

/*
  The inbound webhook. Plan §5.4.

  Resend posts here when mail arrives at the relay domain. The payload carries
  metadata only — no body, no headers, no attachments — so the first thing this
  does after verifying the signature is fetch the message it was told about.

  **It answers 200 to almost everything.** A 4xx or 5xx makes Svix retry, and
  there is nothing to gain from retrying a message we cannot route or have
  already stored: the retries just arrive again and fail the same way. The two
  cases that do deserve a non-2xx are a bad signature (401, because someone is
  posting who should not be) and a fetch or database failure (500, because a
  retry might well succeed).

  Nothing is bounced back to the sender, ever. Plan §5.4 step 1.
*/

/* The webhook writes to storage and the database on every call. Never cache. */
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.error('[inbound] RESEND_WEBHOOK_SECRET is not set — refusing')
    return json({ error: 'not configured' }, 500)
  }

  /*
    The signature is over the exact bytes, so the body is read as text and
    parsed afterwards. Reading it as JSON first and re-serialising would change
    the whitespace and fail every verification.
  */
  const raw = await request.text()

  try {
    /*
      Validates and throws; it does not hand back the payload — svix's `verify`
      returns nothing. The body is parsed below, from the same bytes that were
      just proven authentic.
    */
    new Webhook(secret).verify(raw, {
      'svix-id': request.headers.get('svix-id') ?? '',
      'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
      'svix-signature': request.headers.get('svix-signature') ?? '',
    })
  } catch (cause) {
    /* Unsigned or wrongly signed. This is the only thing here that is somebody
       else's fault, and the only 401. */
    console.warn(
      `[inbound] rejected an unverified delivery: ${cause instanceof Error ? cause.message : cause}`,
    )
    return json({ error: 'invalid signature' }, 401)
  }

  let event: unknown
  try {
    event = JSON.parse(raw)
  } catch {
    /* Signed by us and still not JSON. Retrying will not change that. */
    return json({ ok: true, ignored: 'unparseable body' }, 200)
  }

  const parsed = parseEvent(event)
  if (!parsed) {
    /* Some other webhook type — a bounce, a delivery receipt — pointed at this
       URL. Not ours, not an error. */
    return json({ ok: true, ignored: true }, 200)
  }

  let msg: InboundMessage
  try {
    msg = await fetchInboundMessage(parsed.emailId, parsed.receivedAt)
  } catch (cause) {
    /* Resend having a bad minute. Worth a retry, so this one is a 500. */
    console.error(
      `[inbound] could not fetch ${parsed.emailId}: ${cause instanceof Error ? cause.message : cause}`,
    )
    return json({ error: 'could not fetch message' }, 500)
  }

  let outcome
  try {
    outcome = await handleInbound(msg)
  } catch (cause) {
    console.error(
      `[inbound] could not store ${parsed.emailId}: ${cause instanceof Error ? cause.message : cause}`,
    )
    return json({ error: 'could not store message' }, 500)
  }

  if (!outcome.stored) {
    if (outcome.noreplyTo) {
      /* Someone answered the notification email. One polite line back, at most
         once a day, and nothing stored. Plan §5.4a. */
      const to = outcome.noreplyTo
      after(() => sendAutoResponse(to))
      /* "handled as no-reply", not "an email went out" — sendAutoResponse is
         throttled to one per address per 24 hours and usually stays quiet. */
      return json({ ok: true, noreply: true }, 200)
    }
    console.info(`[inbound] dropped ${parsed.emailId}: ${outcome.reason}`)
    return json({ ok: true, dropped: outcome.reason }, 200)
  }

  /*
    The reply is in the thread by now, which is what matters. The nudge goes
    out after the response so Resend is not kept waiting on our mail provider.
  */
  const messageId = outcome.messageId
  after(() => notifyVenueReply(messageId))

  return json({ ok: true, messageId }, 200)
}

/*
  Resend's `email.received` event. Anything else — and any payload that does
  not carry an email id — is not ours to handle.
*/
function parseEvent(
  event: unknown,
): { emailId: string; receivedAt: Date } | null {
  if (typeof event !== 'object' || event === null) return null
  const e = event as { type?: unknown; created_at?: unknown; data?: unknown }
  if (e.type !== 'email.received') return null

  const data = e.data as { email_id?: unknown; created_at?: unknown } | undefined
  const emailId = data?.email_id
  if (typeof emailId !== 'string' || !emailId) return null

  const stamp =
    (typeof data?.created_at === 'string' ? data.created_at : null) ??
    (typeof e.created_at === 'string' ? e.created_at : null)
  const receivedAt = stamp ? new Date(stamp) : new Date()

  return {
    emailId,
    receivedAt: Number.isNaN(receivedAt.getTime()) ? new Date() : receivedAt,
  }
}

/*
  Step one of plan §5.4: the webhook carries metadata only, so the body,
  headers and attachment list are fetched here.

  `html_format: 'cid'` keeps inline images as `cid:` references instead of
  inflating the HTML with base64 data URIs. We store the raw JSON, and a
  signature image rendered as a megabyte of base64 in every reply would fill
  the bucket with nothing anybody reads.
*/
async function fetchInboundMessage(
  emailId: string,
  receivedAt: Date,
): Promise<InboundMessage> {
  const { data, error } = await resendClient().emails.receiving.get(emailId, {
    html_format: 'cid',
  })
  if (error) throw new Error(error.message)
  if (!data) throw new Error('no message body returned')

  return {
    emailId: data.id,
    from: data.from,
    to: data.to ?? [],
    cc: data.cc ?? [],
    receivedFor: data.received_for ?? [],
    subject: data.subject ?? null,
    messageId: data.message_id ?? null,
    text: data.text ?? null,
    html: data.html ?? null,
    headers: data.headers ?? null,
    attachments: (data.attachments ?? []).map((a) => ({
      id: a.id,
      filename: a.filename,
      size: a.size,
      contentType: a.content_type,
    })),
    receivedAt: data.created_at ? new Date(data.created_at) : receivedAt,
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
