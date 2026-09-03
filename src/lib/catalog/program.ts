/*
  One outing, for the program detail page. Spec §5.2.

  The practical block is the point of this screen. outing-schema.md: "Nulls are
  data. Never guess a value to fill a hole. `null` renders as an amber 'not
  stated on the site' row, which is a feature — it tells the director what to
  ask." Those amber rows become the pre-selected asks on the request (plan 5.2),
  so an unknown here is not a dead end, it is the next step.
*/

import { and, eq } from 'drizzle-orm'
import { db, image, program, venue } from '@/db'
import { travelCaveat, travelTime, type TransportMode } from './distance'

export async function fetchProgram(venueId: string, slug: string) {
  const rows = await db
    .select()
    .from(program)
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(and(eq(program.venueId, venueId), eq(program.slug, slug)))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  const images = await db
    .select()
    .from(image)
    .where(eq(image.venueId, venueId))

  return { program: row.program, venue: row.venue, images }
}

/* ─── Practical facts ────────────────────────────────────────────────────── */

export type Fact = {
  key: string
  label: string
  value: string
  /* An unknown renders amber and becomes an ask. Known renders quiet. */
  known: boolean
}

/*
  The venue's own note about a fact always wins over a bare yes/no — "Beside the
  studio, change table" tells a director more than "Yes" ever will.
*/
function factOf(
  key: string,
  label: string,
  flag: boolean | null,
  note: string | undefined,
  yes: string,
  no: string,
): Fact {
  if (note) return { key, label, value: note, known: true }
  if (flag === true) return { key, label, value: yes, known: true }
  if (flag === false) return { key, label, value: no, known: true }
  return { key, label, value: 'Not stated on the site', known: false }
}

export function practicalFacts(v: {
  hasWashrooms: boolean | null
  hasLunchSpace: boolean | null
  hasRainBackup: boolean | null
  strollerAccessible: boolean | null
  wheelchairAccessible: boolean | null
  busParking: boolean | null
  facilityNotes: Record<string, string> | null
  nearbyPark: string | null
  restrictions: string[] | null
}): Fact[] {
  const n = v.facilityNotes ?? {}
  const facts: Fact[] = [
    factOf('washrooms', 'Washrooms', v.hasWashrooms, n.washrooms, 'Yes', 'None on site'),
    factOf('lunch', 'Lunch space', v.hasLunchSpace, n.lunch_space ?? n.has_lunch_space, 'Yes', 'None'),
    factOf('rain', 'Rain backup', v.hasRainBackup, n.rain_backup ?? n.has_rain_backup, 'Indoor space available', 'None — bring rain gear'),
    factOf('strollers', 'Strollers', v.strollerAccessible, n.stroller_accessible ?? n.strollers, 'Stroller accessible', 'Not stroller accessible'),
    factOf('wheelchair', 'Wheelchair access', v.wheelchairAccessible, n.wheelchair_accessible ?? n.wheelchair, 'Wheelchair accessible', 'Not wheelchair accessible'),
    factOf('bus', 'Bus parking', v.busParking, n.bus_parking, 'Yes', 'No bus parking'),
  ]

  facts.push(
    v.nearbyPark
      ? { key: 'park', label: 'Nearby park', value: v.nearbyPark, known: true }
      : { key: 'park', label: 'Nearby park', value: 'Not stated on the site', known: false },
  )

  if (v.restrictions?.length) {
    facts.push({
      key: 'restrictions',
      label: 'Restrictions',
      value: v.restrictions.join('. '),
      known: true,
    })
  }

  return facts
}

/* ─── Getting there ──────────────────────────────────────────────────────── */

export type TravelOption = {
  mode: TransportMode
  label: string
  time: string
  caveat: string
  primary: boolean
}

export function travelOptions(
  km: number | null,
  active: TransportMode,
): TravelOption[] {
  if (km == null) return []
  const labels: Record<TransportMode, string> = {
    walking: 'On foot',
    bus: 'By bus',
    parent_drivers: 'Driving',
  }
  return (['walking', 'bus', 'parent_drivers'] as TransportMode[]).map((mode) => ({
    mode,
    label: labels[mode],
    time: travelTime(km, mode),
    caveat: travelCaveat(km, mode),
    primary: mode === active,
  }))
}

/* ─── Labels the outing page shows and the card does not ─────────────────── */

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

export function monthsLabel(months: number[] | null): string {
  if (!months?.length) return 'Year round'
  if (months.length === 12) return 'Year round'
  const sorted = [...months].sort((a, b) => a - b)
  /* A contiguous run reads as a season, which is how venues describe it. */
  const contiguous = sorted.every((m, i) => i === 0 || m === sorted[i - 1]! + 1)
  if (contiguous && sorted.length > 1) {
    return `${MONTHS[sorted[0]! - 1]} to ${MONTHS[sorted.at(-1)! - 1]}`
  }
  return sorted.map((m) => MONTHS[m - 1]!.slice(0, 3)).join(', ')
}

export function daysLabel(days: number[] | null): string {
  if (!days?.length) return 'Days not published'
  if (days.length === 7) return 'Any day'
  if (days.length === 5 && days.every((d) => d <= 5)) return 'Weekdays'
  return days
    .slice()
    .sort((a, b) => a - b)
    .map((d) => DAYS[d - 1]!.slice(0, 3))
    .join(', ')
}

export function leadLabel(days: number | null): string {
  if (days == null) return 'Not published'
  if (days === 0) return 'Same day'
  return `${days} days ahead`
}

export function bookingLabel(
  method: string | null,
  email: string | null,
  url: string | null,
  phone: string | null,
): string {
  const contact = email ?? url ?? phone
  if (!method && !contact) return 'Not published'
  const m: Record<string, string> = {
    email: 'Email',
    phone: 'Phone',
    web_form: 'Web form',
    shop: 'Book online',
  }
  const label = method ? (m[method] ?? method) : 'Contact'
  return contact ? `${label} · ${contact}` : label
}
