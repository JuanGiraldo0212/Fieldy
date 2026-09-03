/*
  Distance and travel time. Plan section 2 and 5.1a.

  Fixed speeds, not a routing API — until usage justifies one. The numbers come
  from the design, which produces the copy the catalog actually shows:

    walking          4.6 km/h
    bus             15   km/h, plus a 9 minute wait
    parent drivers  32   km/h, plus 4 minutes

  Walking is not offered beyond 2.5 km ("too far with this group"). That is a
  filter, not a feasibility reason — see feasibility.ts.
*/

export type TransportMode = 'walking' | 'bus' | 'parent_drivers'

const SPEED_KMH: Record<TransportMode, number> = {
  walking: 4.6,
  bus: 15,
  parent_drivers: 32,
}

/* Waiting for the bus, or parking the cars. Real minutes that a pure
   distance-over-speed figure would quietly drop. */
const OVERHEAD_MIN: Record<TransportMode, number> = {
  walking: 0,
  bus: 9,
  parent_drivers: 4,
}

const MODE_WORD: Record<TransportMode, string> = {
  walking: 'on foot',
  bus: 'by bus',
  parent_drivers: 'driving',
}

/* Beyond this, walking stops being offered at all. */
export const WALK_LIMIT_KM = 2.5

const EARTH_RADIUS_KM = 6371
const toRad = (deg: number) => (deg * Math.PI) / 180

export type Point = { lat: number; lng: number }

/*
  Great-circle distance. Good to a few metres at city scale, which is well
  inside the error introduced by using straight-line distance for what is
  actually a walk along streets.
*/
export function haversineKm(a: Point, b: Point): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/* Whole minutes, including the mode's overhead. */
export function travelMinutes(km: number, mode: TransportMode): number {
  return Math.round((km / SPEED_KMH[mode]) * 60) + OVERHEAD_MIN[mode]
}

/* "35 min", "1 hr", "1 hr 12 min" — the design's format. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`
}

export function travelTime(km: number, mode: TransportMode): string {
  return formatDuration(travelMinutes(km, mode))
}

/*
  The line under a card's venue name: "18 min by bus · 4.2 km", or
  "they come to you" for a program that travels to the centre.
*/
export function travelLine(
  km: number | null,
  mode: TransportMode,
  comesToYou: boolean,
): string {
  if (comesToYou) return 'they come to you'
  if (km == null) return 'distance not known'
  return `${travelTime(km, mode)} ${MODE_WORD[mode]} · ${formatKm(km)} km`
}

/* One decimal, and no trailing ".0" — "4 km", "4.2 km". */
export function formatKm(km: number): string {
  const r = Math.round(km * 10) / 10
  return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

/* The caveat shown under each mode in the outing page's travel block. */
export function travelCaveat(km: number, mode: TransportMode): string {
  if (mode === 'walking' && km > WALK_LIMIT_KM) return 'too far with this group'
  if (mode === 'bus') return 'includes a 9 min wait'
  return ''
}

/*
  Whether a program is reachable at all with a given mode. Used to EXCLUDE from
  results, never to mark a card amber: an unreachable outing is not a near miss
  worth showing, and the design has no badge for it.
*/
export function isReachable(
  km: number | null,
  mode: TransportMode,
  comesToYou: boolean,
): boolean {
  if (comesToYou) return true
  if (km == null) return true // unknown distance is not a reason to hide it
  if (mode === 'walking') return km <= WALK_LIMIT_KM
  return true
}
