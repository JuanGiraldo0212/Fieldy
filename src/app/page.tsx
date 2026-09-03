import Link from 'next/link'
import { getActiveRoom, getViewer } from '@/lib/auth'
import {
  emptyHint,
  fetchCatalog,
  fetchHeroImages,
  resultLine,
  search,
  bandsFor,
  preferredTransport,
} from '@/lib/catalog/search'
import { parseSearchParams, toSearchParams } from '@/lib/catalog/url'
import { CatalogMap, type MapPin } from '@/components/catalog/catalog-map'
import { OutingCard } from '@/components/catalog/outing-card'
import { SearchControls, SortControl } from '@/components/catalog/search-controls'
import { EmptyState } from '@/components/ui'

/*
  The catalog. Public, no login — the first thing anyone sees, and it has to
  work from a link shared in a text message.

  A Server Component: the list is rendered on the server and the search state
  comes from the URL, so the page is useful before any JavaScript runs. That is
  plan section 8, and it matters because these links get opened inside
  messaging apps' in-app browsers.
*/

/*
  Where a logged-out visitor is measured from. Once someone has a room, we
  measure from that room's own home base instead, which is what the design's
  "Leaving from" control shows.
*/
const VICTORIA = { lat: 48.4284, lng: -123.3656 }

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const mapOpen = params.map === '1'

  const viewer = await getViewer()
  const activeRoom = await getActiveRoom(viewer?.centreId ?? null)

  /*
    A room replaces the anonymous defaults, but only where the URL is silent.
    Someone who has explicitly narrowed the search has said what they want, and
    having their own room quietly overwrite it on the next navigation would be
    maddening.
  */
  const urlState = parseSearchParams(params)
  const state = activeRoom
    ? {
        ...urlState,
        age_bands: params.ages
          ? urlState.age_bands
          : bandsFor(activeRoom.ageMin, activeRoom.ageMax),
        children: params.kids ? urlState.children : activeRoom.size,
        budget_max: params.max
          ? urlState.budget_max
          : Number(activeRoom.budgetPerChild ?? urlState.budget_max),
        transport: params.to
          ? urlState.transport
          : preferredTransport(activeRoom.transport, urlState.transport),
      }
    : urlState

  const origin =
    activeRoom?.lat != null && activeRoom.lng != null
      ? { lat: activeRoom.lat, lng: activeRoom.lng }
      : VICTORIA

  const [rows, heroes] = await Promise.all([fetchCatalog(), fetchHeroImages()])
  const results = search(rows, state, origin, heroes)

  /*
    One pin per distinct venue coordinate — several programs at the same venue
    would otherwise stack invisibly on one point. Programs that come to you
    have no pin, and neither do the four venues still missing coordinates.
  */
  const seen = new Set<string>()
  const pins: MapPin[] = []
  for (const r of results) {
    if (r.comesToYou || r.venueLat == null || r.venueLng == null) continue
    const key = `${r.venueLat},${r.venueLng}`
    if (seen.has(key)) continue
    seen.add(key)
    pins.push({
      lat: r.venueLat,
      lng: r.venueLng,
      name: r.venueName,
      caption: r.travelLine,
    })
  }

  const mapHref = () => {
    const p = toSearchParams(state)
    if (!mapOpen) p.set('map', '1')
    const qs = p.toString()
    return qs ? `/?${qs}` : '/'
  }

  return (
    <main className="mx-auto max-w-page px-5 pb-16">
      <header className="py-8">
        <h1 className="font-display text-display-lg max-w-measure">
          Every outing in Victoria that actually works for your group.
        </h1>
        <p className="text-body-lg text-text-muted mt-2 max-w-[560px]">
          Tell us about the room once. We keep the details checked and get you
          booked on time.
        </p>
      </header>

      {/* Signed in but never finished setup: they closed the tab on /welcome,
          or clicked an old link. Without this they browse the anonymous
          defaults forever with nothing explaining why the catalog is not
          theirs. */}
      {viewer && !viewer.centreId ? (
        <Link
          href="/welcome"
          className="bg-brand-tint border-info-border text-info-ink mb-4 flex flex-wrap items-center gap-3 rounded-card border px-4 py-3.5 no-underline"
        >
          <span className="text-body-sm flex-1 font-semibold">
            Finish setting up and the catalog will only show outings that work
            for your group.
          </span>
          <span className="text-body-sm font-bold">Pick up where you left off →</span>
        </Link>
      ) : null}

      <SearchControls
        state={state}
        originLabel={activeRoom ? activeRoom.name : 'Victoria'}
      />

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-text-muted font-semibold">
          {resultLine(results)}
        </p>
        <div className="flex items-center gap-4">
          <SortControl state={state} />
          <Link
            href={mapHref()}
            scroll={false}
            className="text-meta text-brand font-semibold"
          >
            {mapOpen ? 'Hide map' : 'Show map'}
          </Link>
        </div>
      </div>

      {mapOpen ? (
        <div className="mb-5">
          <CatalogMap
            home={origin}
            homeLabel={activeRoom?.address ?? 'Victoria'}
            pins={pins}
          />
          <p className="text-meta-sm text-text-faint mt-2">
            One pin per venue in this list. The dark pin is{' '}
            {activeRoom ? activeRoom.name : 'Victoria'}. Programs that come to
            you have no pin.
          </p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid gap-3">
          {results.map((r) => (
            <OutingCard key={r.id} result={r} />
          ))}
        </div>
      ) : (
        /* Not in the design — logged in docs/design-gaps.md. Built plainly,
           and it says which filter to loosen rather than just apologising. */
        <EmptyState title="Nothing matches yet" body={emptyHint(state)} />
      )}
    </main>
  )
}
