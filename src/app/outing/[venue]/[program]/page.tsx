import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Baby,
  Bus,
  Camera,
  Car,
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Footprints,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Package,
  Accessibility as A11y,
  ShieldCheck,
  Toilet,
  TreeDeciduous,
  Truck,
  Umbrella,
  Users,
  Utensils,
} from 'lucide-react'
import {
  bookingLabel,
  daysLabel,
  fetchProgram,
  leadLabel,
  monthsLabel,
  practicalFacts,
  travelOptions,
  type Fact,
} from '@/lib/catalog/program'
import { haversineKm, travelLine, type TransportMode } from '@/lib/catalog/distance'
import { costPerChild, feasibility, money } from '@/lib/catalog/feasibility'
import { initialsOf } from '@/lib/catalog/search'
import { parseSearchParams } from '@/lib/catalog/url'
import {
  ConflictBanner,
  FactQuad,
  FactTile,
  OurNote,
  PracticalList,
  Section,
  TravelModes,
} from '@/components/program/sections'
import { VenueThumb } from '@/components/catalog/venue-thumb'

/* Until a session exists (slice 3), distance is from the centre of Victoria. */
const VICTORIA = { lat: 48.4284, lng: -123.3656 }

const CATEGORY_LABEL: Record<string, string> = {
  animals_farms: 'Animals and farms',
  nature_outdoors: 'Nature and outdoors',
  museums_history: 'Museums and history',
  arts_performance: 'Arts and performance',
  science: 'Science',
  community_civic: 'Community and civic',
  comes_to_you: 'Comes to you',
}

const FACT_ICONS: Record<string, React.ReactNode> = {
  washrooms: <Toilet size={20} />,
  lunch: <Utensils size={20} />,
  rain: <Umbrella size={20} />,
  strollers: <Baby size={20} />,
  wheelchair: <A11y size={20} />,
  bus: <Bus size={20} />,
  park: <TreeDeciduous size={20} />,
  restrictions: <Package size={20} />,
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  walking: <Footprints size={18} />,
  bus: <Bus size={18} />,
  parent_drivers: <Car size={18} />,
}

export default async function OutingPage({
  params,
  searchParams,
}: {
  params: Promise<{ venue: string; program: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { venue: venueId, program: slug } = await params
  const found = await fetchProgram(venueId, slug)
  if (!found) notFound()

  const { program: p, venue: v, images } = found
  const state = parseSearchParams(await searchParams)

  const km =
    p.comesToYou || v.lat == null || v.lng == null
      ? null
      : haversineKm(VICTORIA, { lat: v.lat, lng: v.lng })

  const costChild = p.costPerChildCad == null ? null : Number(p.costPerChildCad)
  const costGroup = p.costPerGroupCad == null ? null : Number(p.costPerGroupCad)

  const fit = feasibility(
    {
      ageBasis: p.ageBasis,
      ageMinYears: p.ageMinYears,
      capacityMax: p.capacityMax,
      costPerChildCad: costChild,
      costPerGroupCad: costGroup,
      isFree: p.isFree,
    },
    { ageMin: 3, ageMax: 5, size: state.children, budgetPerChild: state.budget_max },
  )

  const perChild = costPerChild(
    { costPerChildCad: costChild, costPerGroupCad: costGroup, isFree: p.isFree },
    state.children,
  )

  const hero = images.find((i) => i.role === 'hero')
  const gallery = images.filter((i) => i.role !== 'hero').slice(0, 3)
  const facts: Fact[] = practicalFacts(v)
  const modes = travelOptions(km, state.transport as TransportMode)

  const costLabel =
    p.isFree || costChild === 0
      ? 'Free'
      : costGroup != null
        ? `${money(costGroup)} per class`
        : costChild == null
          ? 'Price not published'
          : `${money(costChild)} a child`

  const totalLabel =
    perChild == null
      ? 'ask the venue'
      : perChild === 0
        ? 'no cost at all'
        : costGroup != null
          ? `${money(perChild)} a child for ${state.children}`
          : `${money(costChild! * state.children)} for ${state.children} children`

  const ageLabel =
    p.ageBasis === 'grades'
      ? p.gradeMin != null && p.gradeMax != null
        ? `Grades ${p.gradeMin === 0 ? 'K' : p.gradeMin} to ${p.gradeMax}`
        : 'Grades not published'
      : p.ageMinYears == null
        ? 'Ages not published'
        : `Ages ${p.ageMinYears} to ${p.ageMaxYears ?? '12'}`

  const duration =
    p.durationMin == null
      ? 'Length not published'
      : p.durationMin < 60
        ? `${p.durationMin} minutes`
        : `${p.durationMin / 60} hour${p.durationMin === 60 ? '' : 's'}`

  return (
    <main className="mx-auto max-w-[820px] px-5 pt-5 pb-20">
      <Link href="/" className="text-body-sm text-brand inline-block py-2 font-semibold no-underline">
        ← All outings
      </Link>

      {/* Header */}
      <div className="bg-surface border-border mt-2.5 rounded-panel border p-6">
        <div className="flex flex-wrap items-start gap-6">
          <div className="min-w-[260px] flex-1">
            <div className="text-meta-sm text-brand font-bold tracking-[0.08em] uppercase">
              {CATEGORY_LABEL[v.category]}
            </div>
            <h1 className="font-display text-display-lg my-2">{p.name}</h1>
            <div className="text-body text-text-muted flex flex-wrap items-center gap-2.5">
              <span>{v.name}</span>
              <span aria-hidden className="text-border-strong">·</span>
              <span className="flex items-center gap-2">
                <span className="text-brand flex">
                  {p.comesToYou ? <Truck size={17} /> : MODE_ICONS[state.transport]}
                </span>
                {travelLine(km, state.transport as TransportMode, p.comesToYou)}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {fit.level === 'green' ? (
                <span className="bg-success-tint text-success text-meta rounded-pill px-3.5 py-[7px] font-bold">
                  ✓ Fits your group
                </span>
              ) : (
                <span className="bg-warn-tint-2 text-warn text-meta rounded-pill px-3.5 py-[7px] font-bold">
                  ! {fit.issueText}
                </span>
              )}
            </div>
          </div>

          <div className="bg-thumb relative h-[150px] w-full flex-none overflow-hidden rounded-card sm:w-[260px]">
            <VenueThumb
              src={hero?.url ?? null}
              alt={hero?.alt ?? v.name}
              initials={initialsOf(v.name)}
            />
          </div>
        </div>

        <FactQuad>
          <FactTile
            icon={<CircleDollarSign size={18} />}
            label="Cost"
            value={costLabel}
            lines={[totalLabel, p.extraFeesNote]}
            warn={
              p.schoolRateOnly
                ? 'School rate. Daycares are quoted through group visits — phone before you budget.'
                : null
            }
          />
          <FactTile
            icon={<Baby size={18} />}
            label="Ages & size"
            value={ageLabel}
            lines={[
              p.capacityMax == null
                ? 'Capacity not published'
                : `Up to ${p.capacityMax} children`,
            ]}
          />
          <FactTile
            icon={<Clock size={18} />}
            label="Duration"
            value={duration}
            lines={[monthsLabel(p.monthsOffered), daysLabel(p.daysOffered)]}
          />
          <FactTile
            icon={<CalendarCheck size={18} />}
            label="Book by"
            value={leadLabel(p.leadTimeDays)}
            lines={[
              bookingLabel(
                p.bookingMethod ?? v.bookingMethod,
                p.bookingEmail ?? v.bookingEmail,
                p.bookingUrl ?? v.bookingUrl,
                v.bookingPhone,
              ),
            ]}
          />
        </FactQuad>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="bg-brand hover:bg-brand-hover text-body flex min-h-[52px] items-center gap-2.5 rounded-pill px-6 font-bold text-white"
          >
            <MessageCircle size={18} />
            Plan this trip
          </button>
          <button
            type="button"
            className="border-border-strong bg-surface hover:border-brand text-body flex min-h-[52px] items-center gap-2.5 rounded-pill border px-6 font-bold"
          >
            <span className="text-brand flex">
              <Heart size={18} />
            </span>
            Save
          </button>
        </div>

        <div className="bg-surface-2 mt-4.5 flex flex-wrap items-center gap-3 rounded-card px-4.5 py-3.5">
          <span className="text-brand flex">
            <ShieldCheck size={18} />
          </span>
          <span className="text-body-sm text-text-strong min-w-[220px] flex-1">
            Fieldy handles all communication and booking for you.
          </span>
        </div>
      </div>

      {/* Photos */}
      <Section
        icon={<Camera size={18} />}
        tint="bg-brand-tint"
        ink="text-brand"
        title="What it actually looks like"
        aside={`Photos from ${v.name}'s website`}
      >
        {gallery.length > 0 || hero ? (
          <div className="grid grid-cols-3 gap-3">
            {[hero, ...gallery].filter(Boolean).slice(0, 3).map((img) => (
              <div
                key={img!.id}
                className="bg-thumb relative h-[200px] min-w-0 overflow-hidden rounded-card"
              >
                <VenueThumb src={img!.url} alt={img!.alt} initials={initialsOf(v.name)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-text-muted">
            No photographs published on {v.name}&rsquo;s site.
          </p>
        )}

        {p.ourNote ? <OurNote note={p.ourNote} /> : null}
      </Section>

      {/* What the children do */}
      {p.description || p.whatChildrenDo ? (
        <Section
          icon={<Users size={18} />}
          tint="bg-success-tint"
          ink="text-success"
          title="What the children do"
        >
          {p.description ? (
            <p className="text-body text-text mt-0 mb-3 leading-relaxed text-pretty">
              {p.description}
            </p>
          ) : null}
          {p.whatChildrenDo ? (
            <p className="text-body text-text m-0 leading-relaxed text-pretty">
              {p.whatChildrenDo}
            </p>
          ) : null}
        </Section>
      ) : null}

      {/* Good to know */}
      <Section
        icon={<Info size={18} />}
        tint="bg-warn-tint"
        ink="text-warn"
        title="Good to know"
      >
        {p.practicalSummary ? (
          <p className="text-body text-text-strong -mt-1.5 mb-4 leading-relaxed text-pretty">
            {p.practicalSummary}
          </p>
        ) : null}
        {/* Only the note is ever shown. `field` and `values` are our plumbing
            and would put schema names in front of a director. A conflict with
            no written note is not renderable, so it is skipped. */}
        {v.conflicts?.filter((c) => c.note?.trim()).map((c, i) => (
          <ConflictBanner key={i} note={c.note!} />
        ))}
        <PracticalList facts={facts} icons={FACT_ICONS} />
      </Section>

      {/* Getting there */}
      {p.comesToYou ? (
        <div className="bg-surface border-border text-body mt-4 rounded-panel border px-5.5 py-4.5 leading-normal">
          <strong className="font-bold">No travel.</strong> They come to you —
          nothing to book, no ratio change on the road.
        </div>
      ) : modes.length > 0 ? (
        <Section
          icon={<MapPin size={18} />}
          tint="bg-brand-tint"
          ink="text-brand"
          title="Getting there"
        >
          <p className="text-body-sm text-text-muted -mt-1.5 mb-4">
            {v.address ?? v.name}
          </p>
          <TravelModes options={modes} icons={MODE_ICONS} />
        </Section>
      ) : null}

      {/* Freshness */}
      <p className="text-meta text-text-muted mt-3.5 px-1 leading-relaxed [overflow-wrap:anywhere]">
        Details checked on {p.checkedOn ?? v.checkedOn} against the venue&rsquo;s
        own pages.{' '}
        {v.website ? (
          <>
            <a href={v.website} target="_blank" rel="noreferrer">
              Venue page
            </a>
            {v.bookingPhone ? <> · {v.bookingPhone}</> : null}
          </>
        ) : null}
      </p>
    </main>
  )
}
