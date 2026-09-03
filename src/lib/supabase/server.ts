import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/*
  The request-scoped Supabase client. Reads and writes the session cookie, so
  it is the thing that knows who is asking.

  Data access does NOT go through this. The app reads and writes through
  Drizzle (src/db), which connects as the database owner and therefore bypasses
  RLS. That is deliberate and it has a consequence worth being blunt about:

    RLS IS THE SAFETY NET, NOT THE LOCK.

  Every query that touches a centre's data must scope itself to the caller's
  centre in application code. Plan section 2. If you find yourself thinking
  "RLS will catch it", it will not, because the connection Drizzle uses is
  exempt.
*/
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            /* Called from a Server Component, where cookies are read-only.
               Harmless: middleware refreshes the session on every request. */
          }
        },
      },
    },
  )
}

/*
  Service-role client. Server only, bypasses RLS, and is only for things a user
  cannot do on their own behalf: reading a venue's mail, running a job. Never
  import this into anything that renders.
*/
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) throw new Error('SUPABASE_SECRET_KEY is not set')

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
