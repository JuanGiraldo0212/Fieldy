import type { Resend } from 'resend'
import { resendClient } from './client'
import {
  deliverTo,
  fromHeader,
  mailDomain,
  messageId,
  relayAddress,
} from './relay'

/*
  Outbound relay. Plan §5.3.

  Fieldy sends on the educator's behalf and the venue replies to us, so the
  headers here are the entire routing contract: get the Reply-To wrong and a
  reply lands in a mailbox nobody reads.

  This module never throws at the caller. A send that fails returns its reason,
  which the caller writes to `message.send_error`, and the trip page offers a
  retry. A trip that exists with an undelivered message is recoverable; a
  transaction rolled back because a third party had a bad minute is not.
*/

export type SendResult =
  | { ok: true; externalMessageId: string | null; redirectedTo: string | null }
  | { ok: false; error: string }

export function sendingConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_DOMAIN)
}

/*
  Deliberately not `import 'server-only'`.

  That would be the stronger guard — a build error rather than a runtime one —
  but it also makes this module unimportable outside a bundler, and
  `scripts/retry-send.ts` needs the real sender rather than a copy of it. A
  second copy of the header construction is a worse risk than this one.

  What is actually protected: `RESEND_API_KEY` has no `NEXT_PUBLIC_` prefix, so
  Next replaces it with undefined in any client bundle and the key cannot leak
  that way. The check below turns what would be a confusing undefined into a
  loud error if this ever runs in a browser.
*/
function resend(): Resend {
  if (typeof window !== 'undefined') {
    throw new Error('sendRelayMessage is server-side only')
  }
  return resendClient()
}

export async function sendRelayMessage({
  token,
  messageRowId,
  senderName,
  centreName,
  venueEmail,
  subject,
  body,
  inReplyTo,
  references,
}: {
  token: string
  messageRowId: string
  senderName: string
  centreName: string
  venueEmail: string
  subject: string
  body: string
  /* The venue's own Message-ID, when we are answering them. */
  inReplyTo?: string | null
  references?: string[]
}): Promise<SendResult> {
  if (!sendingConfigured()) {
    return { ok: false, error: 'Not sent yet. Fieldy is not connected to an email service.' }
  }

  const domain = mailDomain()
  const { to, redirected } = deliverTo(venueEmail)

  const headers: Record<string, string> = {
    /*
      A second way to resolve the trip. Some mail systems rewrite the envelope
      recipient, and when that happens the address is gone but this survives.
    */
    'X-Fieldy-Trip': token,
    'Message-ID': messageId(token, messageRowId, domain),
  }
  if (inReplyTo) headers['In-Reply-To'] = inReplyTo
  if (references?.length) headers['References'] = references.join(' ')
  /*
    A redirected send must be obvious in the receiving mailbox, or someone will
    eventually mistake a development copy for real venue correspondence.
  */
  if (redirected) headers['X-Fieldy-Redirected-From'] = venueEmail

  try {
    const { data, error } = await resend().emails.send({
      from: fromHeader({ senderName, centreName, token, domain }),
      /* The venue answers to the trip address, never to the educator. */
      replyTo: relayAddress(token, domain),
      to: [to],
      subject: redirected ? `[dev → ${venueEmail}] ${subject}` : subject,
      text: body,
      headers,
    })

    if (error) {
      return { ok: false, error: `Could not send: ${error.message}` }
    }
    return {
      ok: true,
      externalMessageId: data?.id ?? null,
      redirectedTo: redirected ? to : null,
    }
  } catch (cause) {
    /*
      A network blip or a bad key. The message row still exists with this
      recorded on it, so nothing is lost and the retry has something to retry.
    */
    return {
      ok: false,
      error: `Could not send: ${cause instanceof Error ? cause.message : 'unknown error'}`,
    }
  }
}
