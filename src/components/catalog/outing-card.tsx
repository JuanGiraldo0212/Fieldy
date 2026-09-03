import Link from 'next/link'
import type { SearchResult } from '@/lib/catalog/search'
import { Badge, InitialsTile } from '@/components/ui'

/*
  A catalog card. Programs, not venues — the design lists what a group can
  actually do, and one venue may offer four different things.

  Copy here is verbatim from docs/design-map.md section 7. Do not reword.
*/

const CATEGORY_SHORT: Record<string, string> = {
  animals_farms: 'Animals',
  nature_outdoors: 'Nature',
  museums_history: 'Museums',
  arts_performance: 'Arts',
  science: 'Science',
  community_civic: 'Community',
  comes_to_you: 'At your place',
}

export function OutingCard({ result }: { result: SearchResult }) {
  const r = result
  const green = r.feasibility.level === 'green'

  return (
    <Link
      href={`/outing/${encodeURIComponent(r.id)}`}
      className="bg-surface border-border shadow-card hover:border-brand block rounded-card border p-4 no-underline sm:p-5"
    >
      <div className="flex gap-4">
        <span className="bg-brand-tint h-20 w-20 flex-none overflow-hidden rounded-card sm:h-24 sm:w-24">
          {r.heroUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.heroUrl}
              alt={r.venueName}
              className="h-full w-full object-cover"
            />
          ) : (
            <InitialsTile
              initials={r.initials}
              caption={CATEGORY_SHORT[r.venueCategory]}
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-display-sm text-text leading-tight">
            {r.name}
          </h3>

          <p className="text-body-sm text-text-muted mt-0.5 flex flex-wrap items-center gap-x-1.5">
            <span>{r.venueName}</span>
            <span aria-hidden>·</span>
            <span>{r.travelLine}</span>
          </p>

          <p className="text-meta text-text-faint mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <span>{r.durationLabel}</span>
            <span>{r.ageLabel}</span>
            <span>{r.capacityLabel}</span>
          </p>

          {/* The amber reason line. Green cards say nothing here — silence is
              the absence of a problem. */}
          {!green ? (
            <p className="text-meta text-warn mt-2">{r.feasibility.issueText}</p>
          ) : null}

          {r.ourNote ? (
            <p className="text-body-sm text-text mt-3 line-clamp-3 italic">
              “{r.ourNote}”
            </p>
          ) : null}
        </div>
      </div>

      <div className="border-border-soft mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <Badge tone={green ? 'green' : 'amber'}>
          <span aria-hidden>{green ? '✓' : '!'}</span>
          {r.badge}
        </Badge>

        <span className="text-right">
          <span className="text-body-sm text-text block font-bold">
            {r.costLabel}
          </span>
          <span className="text-meta text-text-faint block">{r.totalLabel}</span>
        </span>
      </div>

      {/* Only daycare accounts see this. A school rate quoted to a daycare is
          a number they cannot actually pay. */}
      {r.schoolRateOnly ? (
        <p className="text-meta text-warn bg-warn-tint mt-3 rounded-control px-3 py-2">
          School rate. Daycares are quoted through group visits — phone before
          you budget.
        </p>
      ) : null}
    </Link>
  )
}
