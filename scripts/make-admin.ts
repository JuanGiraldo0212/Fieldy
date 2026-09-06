/*
  Make an account an admin, or take it back.

    pnpm admin:grant <email>
    pnpm admin:grant <email> --revoke

  The flag is `account.is_admin`. It is never set from inside the app — there
  is no "become admin" button, and there is not going to be one — so this is
  the one supported way to grant it besides a line of SQL in the dashboard:

    update account set is_admin = true where email = '…';

  The account must already exist: it is created by the auth trigger on first
  sign-in. Grant after the person has signed in once.
*/

import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { account } from '@/db/schema'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()
  const revoke = process.argv.includes('--revoke')
  if (!email || email.startsWith('--')) {
    console.error('Usage: pnpm admin:grant <email> [--revoke]')
    process.exitCode = 1
    return
  }

  const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false })
  const db = drizzle(client)

  const updated = await db
    .update(account)
    .set({ isAdmin: !revoke })
    .where(eq(account.email, email))
    .returning({ id: account.id, name: account.name })

  await client.end()

  const row = updated[0]
  if (!row) {
    console.error(`No account with the email ${email}. They need to sign in once first.`)
    process.exitCode = 1
    return
  }
  console.log(`${row.name || email} (${row.id}) is ${revoke ? 'no longer' : 'now'} an admin.`)
}

main()
