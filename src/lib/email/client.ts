import { Resend } from 'resend'

/*
  One Resend client for the whole relay — outbound sends, the inbound message
  fetch, and attachment downloads.

  It exists for `RESEND_BASE_URL`. Pointed at a local fixture server, every
  call the relay makes is answered locally: `scripts/simulate-venue-reply.ts`
  serves the received-email fetch that the webhook makes, and swallows the
  notification the webhook then sends. That is what lets slice 5 be demonstrated
  end to end without touching the Free tier's hundred emails a day, and without
  any chance of a development run reaching a real venue.

  Unset in production, where it falls back to the SDK's own base URL.
*/

let cached: Resend | null = null
let cachedFor: string | undefined

export function resendClient(): Resend {
  if (typeof window !== 'undefined') {
    throw new Error('The Resend client is server-side only')
  }
  const baseUrl = process.env.RESEND_BASE_URL?.trim() || undefined

  /* Re-made when the base URL changes, which only happens between test cases
     and between a dev server restart. */
  if (!cached || cachedFor !== baseUrl) {
    cached = new Resend(
      process.env.RESEND_API_KEY!,
      baseUrl ? { baseUrl } : undefined,
    )
    cachedFor = baseUrl
  }
  return cached
}
