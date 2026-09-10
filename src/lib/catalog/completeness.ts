/*
  What a venue is missing, computed from the columns the catalog actually
  reads. This is the list an admin works through on the phone with the venue,
  and the number that sorts /admin worst-first.

  Deliberately NOT read from `venue.gaps`. That array is the extractor's prose
  about what the website did not say, written once at extraction time; it does
  not shrink when someone fills a column in, and it names things the app never
  shows. The columns are the truth about what the director will see as
  "Needs confirmation", so the columns are what is scored.

  Two severities:
  - `blocking` — the venue cannot be used at all: no way to book it, nothing
    to book, or no coordinates (every distance, the radius filter, the sort
    and both maps go dead without them).
  - `ask` — renders as an amber "Needs confirmation" row on the outing page
    and becomes a pre-selected ask on the request. Worth a phone call, not a
    hole.

  Null is "not known" everywhere here; false is a known no and is complete.
*/

import { FACILITY_FIELDS, facilityNote } from './options'

export type Severity = 'blocking' | 'ask'

export type MissingItem = {
  key: string
  label: string
  severity: Severity
  /* Which part of the venue form the fix lives in. The UI turns this into an
     anchor; program items carry the program instead. */
  section: 'basics' | 'location' | 'booking' | 'facilities' | 'programs' | 'photos'
  programSlug?: string
  programName?: string
}

export type VenueForScore = {
  address: string | null
  lat: number | null
  lng: number | null
  bookingEmail: string | null
  bookingPhone: string | null
  hostsSchoolGroups: boolean | null
  hostsDaycareGroups: boolean | null
  hasWashrooms: boolean | null
  hasLunchSpace: boolean | null
  hasRainBackup: boolean | null
  strollerAccessible: boolean | null
  wheelchairAccessible: boolean | null
  busParking: boolean | null
  facilityNotes: Record<string, string> | null
}

export type ProgramForScore = {
  slug: string
  name: string
  active: boolean
  comesToYou: boolean
  ageBasis: 'years' | 'grades' | null
  ageMinYears: number | null
  gradeMin: number | null
  costPerChildCad: string | null
  costPerGroupCad: string | null
  isFree: boolean | null
  durationMin: number | null
  capacityMax: number | null
  leadTimeDays: number | null
  daysOffered: number[] | null
}

export type ImageForScore = { role: string }

export type Completeness = {
  items: MissingItem[]
  blocking: number
  asks: number
}

export function completeness(
  venue: VenueForScore,
  programs: ProgramForScore[],
  images: ImageForScore[],
): Completeness {
  const items: MissingItem[] = []
  const add = (item: MissingItem) => items.push(item)

  /* ─── Blocking ─── */

  if (!venue.bookingEmail && !venue.bookingPhone) {
    add({
      key: 'contact',
      label: 'No booking email or phone',
      severity: 'blocking',
      section: 'booking',
    })
  }

  const active = programs.filter((p) => p.active)
  if (active.length === 0) {
    add({
      key: 'programs',
      label: 'No active program, so the venue never appears in the catalog',
      severity: 'blocking',
      section: 'programs',
    })
  }

  /* A venue whose every program comes to you has no address to travel to. */
  const needsPlace = active.length === 0 || active.some((p) => !p.comesToYou)
  if (needsPlace && (venue.lat == null || venue.lng == null)) {
    add({
      key: 'coords',
      label: venue.address
        ? 'Address has no map pin, so distance and the map are blank'
        : 'No address',
      severity: 'blocking',
      section: 'location',
    })
  }

  /* ─── Asks: venue ─── */

  if (venue.hostsSchoolGroups == null && venue.hostsDaycareGroups == null) {
    add({
      key: 'hosts',
      label: 'Whether school or daycare groups are welcome',
      severity: 'ask',
      section: 'basics',
    })
  }

  /* A note counts as known — practicalFacts() in program.ts prefers the note
     over the flag, so a venue that wrote "beside the studio" has answered. */
  for (const f of FACILITY_FIELDS) {
    const known =
      venue[f.key] != null || facilityNote(venue.facilityNotes, f.noteKeys) != null
    if (!known) {
      add({ key: f.key, label: f.label, severity: 'ask', section: 'facilities' })
    }
  }

  if (!images.some((i) => i.role === 'hero')) {
    add({
      key: 'hero',
      label: 'No card photo (the catalog shows a letters tile)',
      severity: 'ask',
      section: 'photos',
    })
  }

  /* ─── Asks: each active program ─── */

  for (const p of active) {
    const prog = (key: string, label: string) =>
      add({
        key: `${p.slug}:${key}`,
        label,
        severity: 'ask',
        section: 'programs',
        programSlug: p.slug,
        programName: p.name,
      })

    const ageKnown =
      p.ageBasis === 'grades' ? p.gradeMin != null : p.ageMinYears != null
    if (!ageKnown) prog('age', 'Ages or grades')

    const costKnown =
      p.isFree === true || p.costPerChildCad != null || p.costPerGroupCad != null
    if (!costKnown) prog('cost', 'Price')

    if (p.durationMin == null) prog('duration', 'How long it runs')
    if (p.capacityMax == null) prog('capacity', 'Largest group they take')
    if (p.leadTimeDays == null) prog('lead', 'How far ahead to book')
    if (!p.daysOffered?.length) prog('days', 'Which days it runs')
  }

  const blocking = items.filter((i) => i.severity === 'blocking').length
  return { items, blocking, asks: items.length - blocking }
}

/* Worst first: most blocking, then most asks, then by name for a stable list. */
export function compareCompleteness(
  a: { blocking: number; asks: number; name: string },
  b: { blocking: number; asks: number; name: string },
): number {
  return (
    b.blocking - a.blocking || b.asks - a.asks || a.name.localeCompare(b.name)
  )
}
