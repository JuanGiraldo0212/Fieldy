import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, venue } from '@/db'
import { ProgramForm } from '@/components/admin/program-form'
import { adminPage } from '../../../../gate'

export default async function NewProgramPage({
  params,
}: {
  params: Promise<{ venue: string }>
}) {
  const { venue: venueId } = await params
  await adminPage(`/admin/venues/${venueId}/programs/new`)

  const owner = (
    await db.select({ id: venue.id, name: venue.name }).from(venue).where(eq(venue.id, venueId)).limit(1)
  )[0]
  if (!owner) notFound()

  return (
    <main className="mx-auto max-w-content px-5 pt-5 pb-20">
      <Link
        href={`/admin/venues/${venueId}`}
        className="text-body-sm text-brand inline-block py-2 font-semibold no-underline"
      >
        ← {owner.name}
      </Link>
      <h1 className="font-display text-display-md mt-2 mb-1">New program</h1>
      <p className="text-body text-text-muted mt-0 mb-2">
        One visit, tour, workshop or kit a group can book at {owner.name}. A
        name is enough to start; everything not known stays &ldquo;Not known&rdquo;.
      </p>
      <ProgramForm mode="new" venueId={venueId} />
    </main>
  )
}
