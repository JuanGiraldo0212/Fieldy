import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNext } from '@/lib/safe-next'

/*
  Where the magic link lands. Supabase sends a one-time code; we exchange it
  for a session cookie and send them on. `next` is checked by safeNext, which
  is where the open-redirect reasoning lives.
*/
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = safeNext(url.searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing', url.origin))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    /* Expired or already used. Both are ordinary: a link sat in an inbox
       overnight, or the mail client prefetched it. Say so plainly. */
    return NextResponse.redirect(new URL('/login?error=expired', url.origin))
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
