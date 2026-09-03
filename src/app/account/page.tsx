import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { account, db } from '@/db'
import { getCentre, getViewer } from '@/lib/auth'
import { AccountForm } from './account-form'

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
        Email and a link. No password to forget at 7:40 am.
      </p>

      <AccountForm
        name={me?.name ?? ''}
        email={me?.email ?? viewer.email}
        role={me?.role ?? 'director'}
        phone={me?.phone ?? ''}
        centreName={centre?.name ?? ''}
        centreType={centre?.type ?? 'daycare_preschool'}
        address={centre?.address ?? ''}
        notifications={me?.emailNotifications ?? true}
      />
    </main>
  )
}
