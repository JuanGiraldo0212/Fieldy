import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { account, db } from '@/db'
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

  /*
    A first-time visitor has an account row, created by the trigger, but no
    centre and no room. Sending them to the catalog would strand them: they
    would see the anonymous defaults, nothing would say why, and nothing would
    ask for the one thing that makes the catalog theirs.

    So: no centre means setup first, carrying `next` through so they land where
    they were actually going once it is done.
  */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const rows = await db
      .select({ centreId: account.centreId })
      .from(account)
      .where(eq(account.id, user.id))
      .limit(1)

    if (!rows[0]?.centreId) {
      return NextResponse.redirect(
        new URL(`/welcome?next=${encodeURIComponent(next)}`, url.origin),
      )
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
