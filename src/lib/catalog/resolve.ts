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

  The two reconciliations below are exported on their own because the outing
  page needs them without needing the catalog: it renders one venue, but the
  distance it prints and the dark pin on its map have to agree with the card
  the director tapped to get there.
*/

export type RawParams = Record<string, string | string[] | undefined>

/* Where a logged-out visitor is measured from. Once someone has a room, we
   measure from that room's own home base instead, which is what the
   design's "Leaving from" control shows. */
export const VICTORIA = { lat: 48.4284, lng: -123.3656 }

/* The fields of a room that a search reads. Structural rather than the whole
   row, so the pure functions below stay callable from a test with no db. */
export type RoomForSearch = {
  name: string
  address: string
  lat: number | null
  lng: number | null
  ageMin: number
  ageMax: number
  size: number
  budgetPerChild: string | null
  transport: Parameters<typeof preferredTransport>[0]
}

export type ResolvedOrigin = {
  origin: { lat: number; lng: number }
  originLabel: string
  originAddress: string
}

/*
  A room replaces the anonymous defaults, but only where the URL is silent.
  Someone who has explicitly narrowed the search has said what they want,
  and having their own room quietly overwrite it on the next navigation
  would be maddening.
*/
export function stateWithRoom(
  urlState: SearchState,
  params: RawParams,
  room: RoomForSearch | null,
): SearchState {
  if (!room) return urlState
  return {
    ...urlState,
    age_bands: params.ages ? urlState.age_bands : bandsFor(room.ageMin, room.ageMax),
    children: params.kids ? urlState.children : room.size,
    budget_max: params.max
      ? urlState.budget_max
      : Number(room.budgetPerChild ?? urlState.budget_max),
    transport: params.to
      ? urlState.transport
      : preferredTransport(room.transport, urlState.transport),
  }
}

/*
  Where distances are measured from, most specific first: an address the
  director picked for this search, then her active room's home base, then
  the centre of Victoria for someone signed out.

  The map reads the same value, so the dark pin is always the place the
  numbers on the cards were measured from. Those two disagreeing would be
  worse than either being wrong on its own.

  A room with no coordinates still names the map's pin: geocoding can fail
  and the fallback point is then Victoria, but "Sunbeam Room" is a truer
  label for it than the label of a place she has never mentioned.
*/
export function resolveOrigin(
  state: SearchState,
  room: RoomForSearch | null,
): ResolvedOrigin {
  const origin =
    state.from_lat != null && state.from_lng != null
      ? { lat: state.from_lat, lng: state.from_lng }
      : room?.lat != null && room.lng != null
        ? { lat: room.lat, lng: room.lng }
        : VICTORIA

  return {
    origin,
    originLabel: state.from || room?.name || 'Victoria',
    originAddress: state.from || room?.address || 'Victoria',
  }
}

export type ResolvedCatalog = ResolvedOrigin & {
  viewer: Awaited<ReturnType<typeof getViewer>>
  activeRoom: Awaited<ReturnType<typeof getActiveRoom>>
  state: SearchState
  results: SearchResult[]
}

export async function resolveCatalog(params: RawParams): Promise<ResolvedCatalog> {
  const viewer = await getViewer()
  const activeRoom = await getActiveRoom(viewer?.centreId ?? null)

  const state = stateWithRoom(parseSearchParams(params), params, activeRoom)
  const { origin, originLabel, originAddress } = resolveOrigin(state, activeRoom)

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
