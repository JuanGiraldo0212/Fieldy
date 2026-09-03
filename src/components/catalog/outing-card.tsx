import Link from 'next/link'
import {
  Baby,
  Bus,
  Car,
  Check,
  Clock,
  Footprints,
  Info,
  TriangleAlert,
  Truck,
  Users,
} from 'lucide-react'
import type { SearchResult } from '@/lib/catalog/search'
import { VenueThumb } from './venue-thumb'

/*
  A catalog card. Programs, not venues — the design lists what a group can
  actually do, and one venue may offer four different things.

  Structure, sizes and copy are taken from the design's own results loop.
  Icons are Lucide at 24x24 with stroke-width 2, rendered at the sizes the
  design uses: 18px in the meta row, 17px for the travel mode, 14px in the
  badge, 16px in the rate flag.
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

function ModeIcon({ result }: { result: SearchResult }) {
  if (result.comesToYou) return <Truck size={17} />
  if (result.transport === 'walking') return <Footprints size={17} />
  if (result.transport === 'parent_drivers') return <Car size={17} />
  return <Bus size={17} />
}

export function OutingCard({ result: r }: { result: SearchResult }) {
  const green = r.feasibility.level === 'green'

  return (
    <Link
      href={`/outing/${r.venueId}/${r.slug}`}
      className="bg-surface border-border hover:border-brand hover:bg-surface-hover animate-rise-in flex w-full flex-wrap gap-5 rounded-card-lg border p-5 text-left no-underline"
    >
      {/* Thumbnail, falling back to an initials tile when the venue has no
          usable photo or the remote one fails to load. */}
      <span className="bg-thumb relative block h-[104px] w-[104px] flex-none overflow-hidden rounded-thumb">
        <VenueThumb
          src={r.heroUrl}
          alt={r.heroAlt ?? r.venueName}
          initials={r.initials}
          caption={CATEGORY_SHORT[r.venueCategory]}
        />
      </span>

      {/* Body */}
      <span className="block min-w-0 flex-1 basis-[230px]">
        <span className="font-display text-display-sm text-text block leading-tight font-bold">
          {r.name}
        </span>

        <span className="text-body-sm text-text-muted mt-1 flex flex-wrap items-center gap-2">
          <span>{r.venueName}</span>
          <span aria-hidden className="text-border-strong">
            ·
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="text-brand flex">
              <ModeIcon result={r} />
            </span>
            {r.travelLine}
          </span>
        </span>

        <span className="text-body-sm text-text-strong mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="flex items-center gap-[7px]">
            <span className="text-brand flex">
              <Clock size={18} />
            </span>
            {r.durationLabel}
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="text-brand flex">
              <Baby size={18} />
            </span>
            {r.ageLabel}
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="text-brand flex">
              <Users size={18} />
            </span>
            {r.capacityLabel}
          </span>
        </span>

        {/* The amber reason line. Green cards say nothing here — silence is
            the absence of a problem. */}
        {!green ? (
          <span className="text-meta text-warn mt-2.5 block">
            {r.feasibility.issueText}
          </span>
        ) : null}

        {r.ourNote ? (
          <span className="text-body-sm text-text-strong mt-3 block italic">
            “{r.ourNote}”
          </span>
        ) : null}
      </span>

      {/* Rail. Stacks under the body below the design's 620px breakpoint, and
          sits in its own right-hand column above it. */}
      <span className="border-border-soft flex basis-full flex-row items-center justify-between gap-3 sm:max-w-full sm:basis-[196px] sm:flex-col sm:items-end sm:justify-center sm:border-l sm:pl-5 sm:text-right">
        {green ? (
          <span className="bg-success-tint text-success text-meta-sm inline-flex items-center gap-[7px] rounded-pill px-3 py-[7px] font-bold whitespace-nowrap">
            <Check size={14} />
            Fits your group
          </span>
        ) : (
          <span className="bg-warn-tint-2 text-warn text-meta-sm inline-flex items-center gap-[7px] rounded-pill px-3 py-[7px] font-bold whitespace-nowrap">
            <TriangleAlert size={14} />
            Needs confirmation
          </span>
        )}

        <span className="block">
          <span className="flex items-baseline gap-[7px]">
            <span className="font-display text-price font-bold">{r.bigTotal}</span>
            <span className="text-meta text-text-muted whitespace-nowrap">
              {r.bigTotalCaption}
            </span>
          </span>
          <span className="text-body-sm text-text-strong mt-1.5 block">
            {r.perChildLine}
          </span>
        </span>
      </span>

      {/* Only daycare accounts see this. A school rate quoted to a daycare is
          a number they cannot actually pay. */}
      {r.showRateFlag ? (
        <span className="bg-info-tint border-info-border text-info-ink text-meta flex basis-full items-center gap-2.5 rounded-control border px-3.5 py-[11px] font-semibold">
          <span className="text-brand flex">
            <Info size={16} />
          </span>
          School rate — daycares are quoted separately
        </span>
      ) : null}
    </Link>
  )
}
