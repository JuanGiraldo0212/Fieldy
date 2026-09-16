import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/auth'
import { SetupForm } from './setup-form'

/* One person's own pages: nothing here is for a search index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}


/*
  First run. Two things get collected because the catalog cannot do its job
  without either: where you are leaving from, and who is going.

  The copy has to do one more job. Someone arrives here seconds after clicking
  their first link, having been told on /login that there is nothing to sign up
  for — and then meets a form. So the screen opens by naming the address they
  are already signed in as: the account part is done, and what is left is the
  catalog's own settings. Same reason /login avoids the word "account".

  Not in the design (docs/design-gaps.md).
*/
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/welcome')
  /* Already set up: nothing to do here. */
  if (viewer.centreId) redirect('/')

  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : '/'

  return (
    <main className="mx-auto max-w-[560px] px-5 py-10">
      <p className="text-meta text-text-faint">
        Signed in as <strong className="font-semibold">{viewer.email}</strong>
      </p>
      <h1 className="font-display text-display-lg mt-1">
        Tell us about your group
      </h1>
      <p className="text-body-lg text-text-muted mt-2">
        That was the whole of signing in. What is left is the catalog&rsquo;s own
        settings: where you leave from, and who is going. Fill them once and it
        only shows you outings that actually work. You can change any of it
        later.
      </p>

      <SetupForm next={next} defaultName={viewer.name} />
    </main>
  )
}
