import Link from 'next/link'
import { VenueForm } from '@/components/admin/venue-form'
import { adminPage } from '../../gate'

export default async function NewVenuePage() {
  await adminPage('/admin/venues/new')

  return (
    <main className="mx-auto max-w-content px-5 pt-5 pb-20">
      <Link href="/admin" className="text-body-sm text-brand inline-block py-2 font-semibold no-underline">
        ← Catalog
      </Link>
      <h1 className="font-display text-display-md mt-2 mb-1">New venue</h1>
      <p className="text-body text-text-muted mt-0 mb-6">
        Name, category and how to book are enough to start. Programs and
        photos come after, on the venue&rsquo;s page. Anything not known stays
        &ldquo;Not known&rdquo; — never guess a value to fill a hole.
      </p>
      <VenueForm mode="new" />
    </main>
  )
}
