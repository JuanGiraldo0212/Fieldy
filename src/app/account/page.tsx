import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { account, db } from '@/db'
import { getCentre, getViewer } from '@/lib/auth'
import { signOut } from './actions'
import { AccountForm } from './account-form'

/* One person's own pages: nothing here is for a search index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}


export default async function AccountPage() {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/account')
  if (!viewer.centreId) redirect('/welcome?next=/account')

  const [rows, centre] = await Promise.all([
    db.select().from(account).where(eq(account.id, viewer.accountId)).limit(1),
    getCentre(viewer.centreId),
  ])
  const me = rows[0]

  return (
    <main className="mx-auto max-w-[520px] px-5 pt-8 pb-20">
      <h1 className="font-display text-display-md m-0">Your account</h1>
      <p className="text-body text-text-muted mt-1.5 mb-5">
        Email and a link. No password to set up or remember.
      </p>

      <AccountForm
        name={me?.name ?? ''}
        email={me?.email ?? viewer.email}
        role={me?.role ?? 'director'}
        roleOther={me?.roleOther ?? ''}
        phone={me?.phone ?? ''}
        centreName={centre?.name ?? ''}
        centreType={centre?.type ?? 'daycare_preschool'}
        centreTypeOther={centre?.typeOther ?? ''}
        address={centre?.address ?? ''}
        notifications={me?.emailNotifications ?? true}
      />

      {/* Sign out lives here, not in the top bar. That row already scrolls
          sideways at 375px, and the avatar that leads to this page is where a
          person looks for it. A plain form with a server action, so it works
          on a page whose JavaScript has not loaded yet. */}
      <form action={signOut} className="mt-3.5">
        <button
          type="submit"
          className="border-border-strong bg-surface hover:border-brand text-body text-text-strong h-control-lg w-full rounded-control border font-bold"
        >
          Sign out
        </button>
      </form>

      <p className="text-meta text-text-faint mt-8">
        What we keep and for how long:{' '}
        <Link href="/privacy" className="text-brand font-semibold no-underline">
          privacy and terms
        </Link>
        . To delete a trip&rsquo;s thread or your account, write to{' '}
        <a href="mailto:hello@fieldy.ca" className="text-brand font-semibold no-underline">
          hello@fieldy.ca
        </a>
        .
      </p>
    </main>
  )
}
