'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { clientIp, hitRateLimit, limitKey } from '@/lib/rate-limit'
import { safeNext } from '@/lib/safe-next'
import { sendError } from './send-error'

/*
  Request a magic link. Plan M6: "Rate limits on report POST and login."

  Supabase has its own limits, but they are the provider's, not ours: the
  per-address one is whatever the email provider allows and the per-IP one
  is project-wide. These are ours, in front of theirs, and they are the
  reason the link request moved from the browser to a server action — a
  limiter the browser enforces is a suggestion.

  Two keys. Per address, because a stranger typing a director's email over
  and over fills her inbox with links she did not ask for. Per client, because
  a script cycling through addresses fills everybody's.
*/
const PER_ADDRESS = { max: 3, windowSeconds: 60 * 60 }
const PER_CLIENT = { max: 10, windowSeconds: 10 * 60 }

export type LoginState = { sent?: string; error?: string }

export async function requestMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = z
    .string()
    .trim()
    .toLowerCase()
    .email('That does not look like an email address.')
    .safeParse(formData.get('email'))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the address.' }
  }
  const email = parsed.data
  const next = safeNext(String(formData.get('next') ?? '/'))

  const h = await headers()
  const [byClient, byAddress] = await Promise.all([
    hitRateLimit(limitKey('login-ip', clientIp(h)), PER_CLIENT),
    hitRateLimit(limitKey('login-email', email), PER_ADDRESS),
  ])
  if (byAddress.limited) {
    return {
      error:
        'Too many links have gone to that address. Try again later, or use a different one.',
    }
  }
  if (byClient.limited) {
    return { error: 'Too many tries from here. Wait a few minutes and try again.' }
  }

  /*
    The origin we are actually running on, so a link sent from a preview
    deploy comes back to that preview and not to production. Supabase only
    honours this if it matches the project's Redirect URLs allow-list;
    anything else is silently replaced with the project's Site URL. A link
    that arrives pointing somewhere unexpected is that list being wrong, not
    this line — Authentication → URL Configuration in the dashboard.
  */
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const origin = `${proto}://${host}`

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })
  if (error) return { error: sendError(error) }

  return { sent: email }
}
