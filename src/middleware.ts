import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/*
  Refreshes the auth token on every request and writes the rotated cookie back.

  Without this a session silently expires mid-visit and the next Server
  Component render sees a logged-out user, which looks like being kicked out
  for no reason. getUser() rather than getSession(): getSession trusts the
  cookie, getUser verifies it with the auth server.
*/
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: [
    /* Everything except static assets and the image optimizer. The catalog is
       public, so this refreshes a session when there is one and does nothing
       when there is not. */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
