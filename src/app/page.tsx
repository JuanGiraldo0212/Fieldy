import Link from 'next/link'
import dynamic from 'next/dynamic'
import { emptyHint, resultLine } from '@/lib/catalog/search'
import { plainParams, resolveCatalog } from '@/lib/catalog/resolve'
import { toSearchParams } from '@/lib/catalog/url'
import type { MapPin } from '@/components/catalog/catalog-map'
import { OutingCard } from '@/components/catalog/outing-card'
import { LoadMore } from '@/components/catalog/load-more'
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
  Leaflet is 160 KB of JavaScript that only the open map needs, and the map
  is closed by default. A static import puts it in every catalog visit's
  bundle whether or not the map is drawn; this loads it with the map.
*/
const CatalogMap = dynamic(() =>
  import('@/components/catalog/catalog-map').then((m) => m.CatalogMap),
)

/*
  How many cards the page arrives with. Plan §8's Lighthouse target is
  measured on the signed-out catalog, where nothing narrows the list and
  every program in the region is a card — 76 of them at around 150 DOM
  nodes each, which is what a phone spends its first three seconds laying
  out. Forty is more than a screen and a half on a phone; the rest arrives
  as she scrolls (LoadMore), or behind one link when nothing runs scripts.
*/
const FIRST_PAGE = 40

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const mapOpen = params.map === '1'
  const showAll = params.all === '1'

  const { viewer, activeRoom, state, origin, originLabel, originAddress, results } =
    await resolveCatalog(params)

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
    if (showAll) p.set('all', '1')
    const qs = p.toString()
    return qs ? `/?${qs}` : '/'
  }

  const showAllHref = () => {
    const p = toSearchParams(state)
    if (mapOpen) p.set('map', '1')
    p.set('all', '1')
    return `/?${p.toString()}`
  }

  const visible = showAll ? results : results.slice(0, FIRST_PAGE)
  const hiddenCount = results.length - visible.length

  return (
    <main className="mx-auto max-w-page px-5 pb-16">
      <header className="py-8">
        <h1 className="font-display text-display-lg max-w-measure">
          Find your next field trip. We&rsquo;ll help with the rest.
        </h1>
        <p className="text-body-lg text-text-muted mt-2 max-w-[560px]">
          Search, contact venues, and keep everything in one place.
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
          <CatalogMap home={origin} homeLabel={originAddress} pins={pins} />
          <p className="text-meta-sm text-text-faint mt-2">
            One pin per venue in this list. The dark pin is {originLabel}.
            Programs that come to you have no pin.
          </p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <>
          <div className="grid gap-3">
            {visible.map((r) => (
              <OutingCard key={r.id} result={r} />
            ))}
          </div>
          {hiddenCount > 0 ? (
            <LoadMore
              params={plainParams(params)}
              offset={visible.length}
              remaining={hiddenCount}
              fallbackHref={showAllHref()}
            />
          ) : null}
        </>
      ) : (
        /* Not in the design — logged in docs/design-gaps.md. Built plainly,
           and it says which filter to loosen rather than just apologising. */
        <EmptyState title="Nothing matches yet" body={emptyHint(state)} />
      )}
    </main>
  )
}
