import { searchStateSchema, type SearchState } from '@/lib/schemas'
import {
  bandsFor,
  fetchCatalog,
  fetchHeroImages,
  preferredTransport,
  search,
  type SearchResult,
} from './search'

/*
  The catalog as one room sees it, with no search typed. Spec §5.9: "same
  cards as the catalog, feasibility against the active room."

  The catalog page builds this same state from the URL plus the room; here
  there is no URL, so the room is the whole story. Used by the Saved tab —
  its rows and its empty-state suggestions — so a saved outing shows the
  same travel line and the same amber reason it showed when she saved it.
*/

/* Where a logged-out visitor is measured from. Same value as the catalog. */
export const VICTORIA = { lat: 48.4284, lng: -123.3656 }

export type ActiveRoom = {
  name: string
  ageMin: number
  ageMax: number
  size: number
  budgetPerChild: string | null
  /* The room's own enum, which also has `none`. */
  transport: Parameters<typeof preferredTransport>[0]
  lat: number | null
  lng: number | null
}

export function stateForRoom(room: ActiveRoom | null): SearchState {
  const base = searchStateSchema.parse({})
  if (!room) return base
  return {
    ...base,
    age_bands: bandsFor(room.ageMin, room.ageMax),
    children: room.size,
    budget_max: Number(room.budgetPerChild ?? base.budget_max),
    transport: preferredTransport(room.transport, base.transport),
  }
}

export async function catalogForRoom(room: ActiveRoom | null): Promise<SearchResult[]> {
  const state = stateForRoom(room)
  const origin =
    room?.lat != null && room.lng != null ? { lat: room.lat, lng: room.lng } : VICTORIA
  const [rows, heroes] = await Promise.all([fetchCatalog(), fetchHeroImages()])
  return search(rows, state, origin, heroes)
}

/*
  Three that fit right now. Green first, then in the catalog's own best-match
  order, skipping anything already on the shortlist — suggesting something
  she has already saved is not a suggestion.
*/
export function suggestFor(
  results: SearchResult[],
  excludeIds: Iterable<string>,
  count = 3,
): SearchResult[] {
  const skip = new Set(excludeIds)
  return results
    .filter((r) => !skip.has(r.id))
    .sort((a, b) => Number(b.feasibility.level === 'green') - Number(a.feasibility.level === 'green'))
    .slice(0, count)
}
