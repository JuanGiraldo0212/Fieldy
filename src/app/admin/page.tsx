import Link from 'next/link'
import { Plus } from 'lucide-react'
import { listVenuesForAdmin } from '@/lib/catalog/admin'
import { VenueList } from '@/components/admin/venue-list'
import { adminPage } from './gate'

/*
  The catalog, worst first. Not in the design (docs/design-gaps.md): this is
  our screen, not a director's, and it exists so the person with the phone
  knows who to call and what to ask.
*/
export default async function AdminPage() {
  await adminPage('/admin')
  const rows = await listVenuesForAdmin()

  const needCall = rows.filter((r) => r.score.blocking > 0).length
  const complete = rows.filter((r) => r.score.items.length === 0).length
  const reports = rows.reduce((n, r) => n + r.openReports, 0)

  return (
    <main className="mx-auto max-w-page px-5 pt-8 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-display-md m-0">Catalog</h1>
          <p className="text-body text-text-muted mt-1.5">
            {rows.length} venues. {needCall} cannot be booked yet, {complete} fully
            described{reports > 0 ? `, ${reports} correction${reports === 1 ? '' : 's'} waiting` : ''}.
          </p>
        </div>
        <Link
          href="/admin/venues/new"
          className="bg-brand-solid hover:bg-brand-solid-hover text-body-sm flex h-control items-center gap-2 rounded-control px-4 font-bold text-white no-underline"
        >
          <Plus size={18} />
          Add a venue
        </Link>
      </div>

      <VenueList
        rows={rows.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          blocking: r.score.blocking,
          asks: r.score.asks,
          openReports: r.openReports,
          programCount: r.programCount,
          activeProgramCount: r.activeProgramCount,
          hasHero: r.hasHero,
          hasContact: Boolean(r.bookingEmail || r.bookingPhone),
          edited: r.editedAt != null,
          checkedOn: r.checkedOn,
        }))}
      />
    </main>
  )
}
