import Link from 'next/link'
import { setProgramActive } from '@/app/admin/actions'
import type { Program } from '@/db'
import type { MissingItem } from '@/lib/catalog/completeness'
import { EmptyState } from '@/components/ui'
import { Pill } from './venue-list'

function ages(p: Program): string {
  if (p.ageBasis === 'grades') {
    if (p.gradeMin == null) return 'Grades not set'
    const k = (g: number) => (g === 0 ? 'K' : String(g))
    return `Grades ${k(p.gradeMin)}${p.gradeMax != null ? ` to ${k(p.gradeMax)}` : '+'}`
  }
  if (p.ageMinYears == null) return 'Ages not set'
  return `Ages ${p.ageMinYears}${p.ageMaxYears != null ? ` to ${p.ageMaxYears}` : '+'}`
}

function price(p: Program): string {
  if (p.isFree) return 'Free'
  if (p.costPerChildCad != null) return `$${Number(p.costPerChildCad).toFixed(2)} a child`
  if (p.costPerGroupCad != null) return `$${Number(p.costPerGroupCad).toFixed(2)} a group`
  return 'Price not set'
}

/*
  A server component: the active toggle is a bound server action in a form,
  which works without any JavaScript on the page and needs no state.
*/
export function ProgramTable({
  venueId,
  programs,
  missing,
}: {
  venueId: string
  programs: Program[]
  missing: MissingItem[]
}) {
  if (programs.length === 0) {
    return (
      <div className="mt-3">
        <EmptyState
          title="No programs yet"
          body="A venue with no active program never appears in the catalog. Add the visit, tour or workshop they offer groups."
        />
      </div>
    )
  }

  return (
    <ul className="mt-3 grid list-none gap-2.5 p-0">
      {programs.map((p) => {
        const gaps = missing.filter((m) => m.programSlug === p.slug).length
        return (
          <li
            key={p.id}
            className="bg-surface border-border shadow-card flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border px-4 py-3.5"
          >
            <div className="min-w-[200px] flex-1">
              <Link
                href={`/admin/venues/${venueId}/programs/${p.slug}`}
                className="text-body text-text font-bold no-underline hover:text-brand"
              >
                {p.name}
              </Link>
              <div className="text-meta text-text-muted mt-0.5">
                {ages(p)}
                <span aria-hidden> · </span>
                {price(p)}
                {p.comesToYou ? (
                  <>
                    <span aria-hidden> · </span>comes to you
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {!p.active ? <Pill tone="neutral">Hidden</Pill> : null}
              {gaps > 0 ? <Pill tone="amber">{gaps} to ask</Pill> : null}
              {p.editedAt ? <Pill tone="neutral">Edited</Pill> : null}
            </div>

            <form action={setProgramActive.bind(null, p.id, !p.active)}>
              <button
                type="submit"
                className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong h-control rounded-control border px-3.5 font-semibold"
              >
                {p.active ? 'Hide from catalog' : 'Show in catalog'}
              </button>
            </form>
          </li>
        )
      })}
    </ul>
  )
}
