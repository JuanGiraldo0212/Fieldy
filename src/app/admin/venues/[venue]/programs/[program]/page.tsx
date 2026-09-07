import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchProgramForAdmin, fetchVenueForAdmin } from '@/lib/catalog/admin'
import { ProgramForm } from '@/components/admin/program-form'
import { programFormValues } from '@/lib/catalog/admin-forms'
import { adminPage } from '../../../../gate'

/* One person's own pages: nothing here is for a search index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}


export default async function AdminProgramPage({
  params,
}: {
  params: Promise<{ venue: string; program: string }>
}) {
  const { venue: venueId, program: slug } = await params
  await adminPage(`/admin/venues/${venueId}/programs/${slug}`)

  const [found, p] = await Promise.all([
    fetchVenueForAdmin(venueId),
    fetchProgramForAdmin(venueId, slug),
  ])
  if (!found || !p) notFound()

  const missing = found.score.items.filter((i) => i.programSlug === slug)

  return (
    <main className="mx-auto max-w-content px-5 pt-5 pb-20">
      <Link
        href={`/admin/venues/${venueId}`}
        className="text-body-sm text-brand inline-block py-2 font-semibold no-underline"
      >
        ← {found.venue.name}
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-display-md m-0">{p.name}</h1>
          <p className="text-meta text-text-muted mt-1 mb-0">
            {p.active ? 'In the catalog' : 'Hidden from the catalog'}
            {p.checkedOn ? ` · checked ${p.checkedOn}` : ''}
            {p.editedAt ? ' · hand-edited' : ''}
          </p>
        </div>
        {p.active ? (
          <Link
            href={`/outing/${venueId}/${slug}`}
            className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong flex h-control items-center rounded-control border px-3.5 font-semibold no-underline"
          >
            See it as a director
          </Link>
        ) : null}
      </div>

      {missing.length > 0 ? (
        <p className="bg-warn-tint text-warn text-body-sm mt-4 mb-0 rounded-control px-4 py-3">
          To ask: {missing.map((m) => m.label.toLowerCase()).join(', ')}.
        </p>
      ) : null}

      <ProgramForm mode="edit" venueId={venueId} values={programFormValues(p)} />
    </main>
  )
}
