import { getActiveRoom, getViewer } from '@/lib/auth'
import {
  bandsFor,
  fetchCatalog,
  fetchHeroImages,
  preferredTransport,
  search,
  type SearchResult,
} from './search'
import { parseSearchParams } from './url'
import type { SearchState } from '@/lib/schemas'

/*
  The catalog as one request sees it: the URL's search state reconciled with
  the viewer's active room, the point distances are measured from, and the
  ranked results.

  Shared by the catalog page and the action that loads more cards for it,
  so the second batch is computed from exactly the same inputs as the first
  and card 41 follows card 40 in the same order.
*/

export type RawParams = Record<string, string | string[] | undefined>

/* Where a logged-out visitor is measured from. Once someone has a room, we
   measure from that room's own home base instead, which is what the
   design's "Leaving from" control shows. */
export const VICTORIA = { lat: 48.4284, lng: -123.3656 }

export type ResolvedCatalog = {
  viewer: Awaited<ReturnType<typeof getViewer>>
  activeRoom: Awaited<ReturnType<typeof getActiveRoom>>
  state: SearchState
  origin: { lat: number; lng: number }
  originLabel: string
  originAddress: string
  results: SearchResult[]
}

export async function resolveCatalog(params: RawParams): Promise<ResolvedCatalog> {
  const viewer = await getViewer()
  const activeRoom = await getActiveRoom(viewer?.centreId ?? null)

  /*
    A room replaces the anonymous defaults, but only where the URL is silent.
    Someone who has explicitly narrowed the search has said what they want,
    and having their own room quietly overwrite it on the next navigation
    would be maddening.
  */
  const urlState = parseSearchParams(params)
  const state: SearchState = activeRoom
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

  /*
    Where distances are measured from, most specific first: an address the
    director picked for this search, then her active room's home base, then
    the centre of Victoria for someone signed out.

    The map reads the same value, so the dark pin is always the place the
    numbers on the cards were measured from. Those two disagreeing would be
    worse than either being wrong on its own.
  */
  const origin =
    state.from_lat != null && state.from_lng != null
      ? { lat: state.from_lat, lng: state.from_lng }
      : activeRoom?.lat != null && activeRoom.lng != null
        ? { lat: activeRoom.lat, lng: activeRoom.lng }
        : VICTORIA

  const originLabel = state.from || activeRoom?.name || 'Victoria'
  const originAddress = state.from || activeRoom?.address || 'Victoria'

  const [rows, heroes] = await Promise.all([fetchCatalog(), fetchHeroImages()])
  const results = search(rows, state, origin, heroes)

  return { viewer, activeRoom, state, origin, originLabel, originAddress, results }
}

/* Only string-valued params travel to the load-more action. */
export function plainParams(params: RawParams): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'string') out[k] = v
    else if (Array.isArray(v) && typeof v[0] === 'string') out[k] = v[0]
  }
  return out
}
