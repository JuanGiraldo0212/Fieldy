import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/auth'
import { SetupForm } from './setup-form'

/*
  First run. Two things get collected because the catalog cannot do its job
  without either: where you are leaving from, and who is going.

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
      <h1 className="font-display text-display-lg">Tell us about your group</h1>
      <p className="text-body-lg text-text-muted mt-2">
        Once, and then the catalog only shows you outings that actually work.
        You can change any of it later.
      </p>

      <SetupForm next={next} defaultName={viewer.name} />
    </main>
  )
}
