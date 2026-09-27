import Link from 'next/link'
import {
  Baby,
  Bus,
  Car,
  Check,
  ChevronRight,
  Clock,
  Footprints,
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
      className="bg-surface border-border hover:border-brand hover:bg-surface-hover animate-rise-in flex w-full flex-wrap items-start gap-3 rounded-card-lg border p-3.5 text-left no-underline sm:gap-5 sm:p-5"
    >
      {/* Thumbnail, falling back to an initials tile when the venue has no
          usable photo or the remote one fails to load. */}
      <span className="bg-thumb relative block h-[76px] w-[76px] flex-none overflow-hidden rounded-thumb sm:h-[104px] sm:w-[104px]">
        <VenueThumb
          src={r.heroUrl}
          alt={r.heroAlt ?? r.venueName}
          initials={r.initials}
          caption={CATEGORY_SHORT[r.venueCategory]}
        />
      </span>

      {/* Body */}
      <span className="block min-w-0 flex-1 basis-[150px] sm:basis-[230px]">
        <span className="font-display text-body-lg text-text block leading-tight font-bold sm:text-display-sm">
          {r.name}
        </span>

        <span className="text-meta text-text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 sm:text-body-sm">
          <span>{r.venueName}</span>
          <span aria-hidden className="text-border-strong hidden sm:inline">
            ·
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="text-brand flex">
              <ModeIcon result={r} />
            </span>
            {r.travelLine}
          </span>
        </span>

        <span className="text-body-sm text-text-strong mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex">
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

        {/* Two lines, then an ellipsis. The whole note is on the outing page;
            here it only has to say why this one is worth a look. */}
        {r.ourNote ? (
          <span className="text-body-sm text-text-strong mt-2 line-clamp-2 italic sm:mt-3">
            “{r.ourNote}”
          </span>
        ) : null}
      </span>

      {/* The design's phone card ends in a chevron: the whole card is the
          link, and the arrow is what says so on a touch screen. */}
      <span aria-hidden className="text-text-faint mt-6 flex flex-none sm:hidden">
        <ChevronRight size={20} />
      </span>

      {/* Rail. Stacks under the body below the design's 620px breakpoint, and
          sits in its own right-hand column above it. On a phone it is one
          quiet line — the badge and the total — rather than the desktop
          column, because the design gives the card four lines in all. */}
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

        <span className="block text-right sm:text-inherit">
          <span className="flex items-baseline gap-[7px]">
            <span className="font-display text-fact font-bold sm:text-price">
              {r.bigTotal}
            </span>
            <span className="text-meta text-text-muted whitespace-nowrap">
              {r.bigTotalCaption}
            </span>
          </span>
          <span className="text-meta text-text-strong mt-0.5 block sm:text-body-sm sm:mt-1.5">
            {r.perChildLine}
          </span>
        </span>
      </span>
    </Link>
  )
}
