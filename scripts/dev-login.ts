/*
  Print a browser console line that signs you in as a seeded account.

    pnpm dev:login dana@garryoakchildcare.test

  Why this exists: the fixture accounts use `.test` addresses, which is a
  reserved TLD with no mailbox behind it, so the ordinary magic link has
  nowhere to land. Without this there is no way to click through a fixture
  centre's screens.

  This is NOT an auth bypass. Nothing in the app changes, no check is skipped,
  and no route trusts anything it would not otherwise trust. It asks Supabase's
  admin API for a real one-time token, redeems it for a real session the same
  way the callback route would, and prints the cookie that session produces.
  Anyone who can run it already holds SUPABASE_SECRET_KEY, which is full
  database access — so it grants nothing that key did not already grant.

  Local development only. The secret key never leaves .env.local, which is
  gitignored.
*/

import { createClient } from '@supabase/supabase-js'

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: pnpm dev:login <email>')
    process.exitCode = 1
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SECRET_KEY
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !secret || !publishable) {
    console.error('NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must all be set.')
    process.exitCode = 1
    return
  }

  const admin = createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  /* Implicit rather than PKCE: there is no browser here to hold the code
     verifier, and the token is redeemed in this process. */
  const anon = createClient(url, publishable, {
    auth: { autoRefreshToken: false, persistSession: false, flowType: 'implicit' },
  })

  const link = await admin.auth.admin.generateLink({ type: 'magiclink', email })
  if (link.error) {
    console.error(`Could not issue a link for ${email}: ${link.error.message}`)
    process.exitCode = 1
    return
  }

  const redeemed = await anon.auth.verifyOtp({
    type: 'magiclink',
    token_hash: link.data.properties.hashed_token,
  })
  if (redeemed.error || !redeemed.data.session) {
    console.error(`Could not redeem the link: ${redeemed.error?.message}`)
    process.exitCode = 1
    return
  }

  /* The cookie shape @supabase/ssr reads: base64- prefix, then the session as
     JSON. Chunked at 3180 characters, which is what the library does when a
     session exceeds one cookie. */
  const ref = new URL(url).hostname.split('.')[0]!
  const name = `sb-${ref}-auth-token`
  const payload = `base64-${Buffer.from(JSON.stringify(redeemed.data.session)).toString('base64')}`

  const chunks: string[] = []
  for (let i = 0; i < payload.length; i += 3180) chunks.push(payload.slice(i, i + 3180))
  const cookies =
    chunks.length === 1
      ? [[name, payload] as const]
      : chunks.map((c, i) => [`${name}.${i}`, c] as const)

  const js = cookies
    .map(([n, v]) => `document.cookie=${JSON.stringify(`${n}=${v}; path=/; max-age=3600`)}`)
    .join(';')

  console.log(`\nSigned in as ${email}. Session lasts one hour.`)
  console.log('\nOpen http://localhost:3000, then paste this into the browser console:\n')
  console.log(`${js};location.reload()`)
  console.log('')
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (e) => {
    console.error(e)
    process.exit(1)
  },
)
