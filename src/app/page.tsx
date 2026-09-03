import { fetchCatalog, fetchHeroImages, resultLine, search } from '@/lib/catalog/search'
import { parseSearchParams } from '@/lib/catalog/url'
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
  Until a session exists (slice 3), distance is measured from the centre of
  Victoria. Slice 3 replaces this with the active room's home base, which is
  what the design's "Leaving from" control actually shows.
*/
const VICTORIA = { lat: 48.4284, lng: -123.3656 }

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const state = parseSearchParams(await searchParams)

  const [rows, heroes] = await Promise.all([fetchCatalog(), fetchHeroImages()])
  const results = search(rows, state, VICTORIA, heroes)

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

      <SearchControls state={state} />

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-text-muted font-semibold">
          {resultLine(results)}
        </p>
        <SortControl state={state} />
      </div>

      {results.length > 0 ? (
        <div className="grid gap-3">
          {results.map((r) => (
            <OutingCard key={r.id} result={r} />
          ))}
        </div>
      ) : (
        /* Not in the design — logged in docs/design-gaps.md. Built plainly,
           and it says which filter to loosen rather than just apologising. */
        <EmptyState
          title="Nothing matches yet"
          body={
            state.transport === 'walking'
              ? 'Walking only reaches about 2.5 km. Try the bus, or widen the distance.'
              : 'Try a wider distance, a higher budget, or fewer filters.'
          }
        />
      )}
    </main>
  )
}
