/*
  Catalog search. Plan section 5.1a.

  Where the work happens, and why:

  The cheap, indexed predicates (active programs, the venue join) run in SQL.
  Everything else — distance, feasibility, moods, sorting — runs in TypeScript
  against the already-tested pure functions in distance.ts and feasibility.ts.

  That is a deliberate choice at this size. The catalog is 39 programs across 15
  venues; re-expressing the feasibility rules as SQL would mean two
  implementations of the same copy-bearing logic, and the one in SQL would have
  no tests. When the catalog outgrows a single fetch — a few thousand programs,
  not a few dozen — push the boolean filters down first (category, indoor,
  comes_to_you, accessibility, format), because those are pure column
  predicates. Leave feasibility here.
*/

import { and, eq, isNotNull } from 'drizzle-orm'
import { db, image, program, venue } from '@/db'
import { AGE_BANDS, type SearchState } from '@/lib/schemas'
import {
  haversineKm,
  isReachable,
  travelLine,
  type Point,
  type TransportMode,
} from './distance'
import {
  badgeLabel,
  costPerChild,
  feasibility,
  money,
  type Feasibility,
} from './feasibility'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type CatalogRow = Awaited<ReturnType<typeof fetchCatalog>>[number]

export type SearchResult = CatalogRow & {
  distanceKm: number | null
  travelLine: string
  feasibility: Feasibility
  badge: string
  bigTotal: string
  bigTotalCaption: string
  perChildLine: string
  ageLabel: string
  capacityLabel: string
  durationLabel: string
  perChild: number | null
  heroUrl: string | null
  initials: string
  /* Carried through so the card can pick the travel-mode icon. */
  transport: SearchState['transport']
  /* The design only shows the school-rate flag to daycare accounts: a school
     rate quoted to a daycare is a number they cannot actually pay. There is no
     session until slice 3, and the anonymous default centre type is a daycare,
     so it shows. */
  showRateFlag: boolean
}

/* ─── Fetch ──────────────────────────────────────────────────────────────── */

export async function fetchCatalog() {
  const rows = await db
    .select({
      id: program.id,
      slug: program.slug,
      name: program.name,
      ourNote: program.ourNote,
      description: program.description,
      comesToYou: program.comesToYou,
      ageBasis: program.ageBasis,
      ageMinYears: program.ageMinYears,
      ageMaxYears: program.ageMaxYears,
      gradeMin: program.gradeMin,
      gradeMax: program.gradeMax,
      durationMin: program.durationMin,
      capacityMax: program.capacityMax,
      costPerChildCad: program.costPerChildCad,
      costPerGroupCad: program.costPerGroupCad,
      isFree: program.isFree,
      schoolRateOnly: program.schoolRateOnly,
      indoor: program.indoor,
      outdoor: program.outdoor,
      format: program.format,
      moodTags: program.moodTags,
      sensoryFriendly: program.sensoryFriendly,
      lowNoise: program.lowNoise,
      neurodiversityFriendly: program.neurodiversityFriendly,
      monthsOffered: program.monthsOffered,
      venueId: venue.id,
      venueName: venue.name,
      venueCategory: venue.category,
      venueLat: venue.lat,
      venueLng: venue.lng,
      wheelchairAccessible: venue.wheelchairAccessible,
    })
    .from(program)
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(program.active, true))

  return rows.map((r) => ({
    ...r,
    /* numeric columns come back as strings; the money is CAD and small. */
    costPerChildCad: r.costPerChildCad == null ? null : Number(r.costPerChildCad),
    costPerGroupCad: r.costPerGroupCad == null ? null : Number(r.costPerGroupCad),
  }))
}

export async function fetchHeroImages(): Promise<Map<string, string>> {
  const rows = await db
    .select({ venueId: image.venueId, url: image.url, usage: image.usage })
    .from(image)
    .where(and(eq(image.role, 'hero'), isNotNull(image.url)))

  const out = new Map<string, string>()
  for (const r of rows) {
    /* Only licensed, venue_supplied and public_domain render. `unverified`
       holds the image back for review — which is currently every image, so
       every card falls back to its initials tile. */
    if (r.usage === 'unverified') continue
    if (!out.has(r.venueId)) out.set(r.venueId, r.url)
  }
  return out
}

/* ─── Moods ──────────────────────────────────────────────────────────────── */

export const MOODS = ['fun', 'explore', 'active', 'creative', 'learn', 'surprise'] as const
export type Mood = (typeof MOODS)[number]

/*
  Match on the record's own mood_tags when the catalog carries them, and fall
  back to a derivation from category and format. The schema calls mood_tags
  "derivable from category, but override here when the category misleads", so
  an explicit tag always wins.
*/
function matchesMood(row: CatalogRow, mood: Mood): boolean {
  if (row.moodTags?.includes(mood as never)) return true

  const cat = row.venueCategory
  const fmt = row.format ?? []

  switch (mood) {
    case 'fun':
      return (
        cat === 'animals_farms' ||
        cat === 'science' ||
        fmt.includes('hands_on') ||
        fmt.includes('interactive')
      )
    case 'explore':
      return cat === 'nature_outdoors' || cat === 'animals_farms'
    case 'active':
      return row.outdoor === true && !row.comesToYou
    case 'creative':
      return cat === 'arts_performance'
    case 'learn':
      return (
        cat === 'museums_history' || cat === 'science' || cat === 'community_civic'
      )
    /* `surprise` never filters — it replaces the result set. */
    case 'surprise':
      return true
  }
}

/*
  A stable shuffle. Math.random would reorder the list on every render, so the
  same search URL has to produce the same three surprises.
*/
function seededPick<T>(items: T[], count: number, seed: number): T[] {
  return items
    .map((item, i) => ({ item, k: Math.abs(Math.sin((i + 1) * (seed || 1))) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, count)
    .map((x) => x.item)
}

/* ─── Labels ─────────────────────────────────────────────────────────────── */

/*
  The card's price block is three parts, and they are not the same thing as the
  outing page's cost tile. The design shows one large number with a caption
  beside it, then a per-child line underneath:

      $150   per class
      $9.38 per child

  A group fee shows the group fee big, because that is what the venue charges.
  A per-child price shows the GROUP TOTAL big, because that is what the trip
  costs. An unpublished price shows an em dash rather than a zero.
*/
function bigTotalFor(row: CatalogRow, size: number): string {
  if (row.costPerGroupCad != null) return money(row.costPerGroupCad)
  if (row.isFree || row.costPerChildCad === 0) return 'Free'
  if (row.costPerChildCad == null) return '—'
  return money(row.costPerChildCad * size)
}

function bigTotalCaptionFor(row: CatalogRow): string {
  if (row.costPerGroupCad != null) return 'per class'
  if (row.isFree || row.costPerChildCad === 0) return 'no cost'
  if (row.costPerChildCad == null) return 'price not published'
  return 'total'
}

function perChildLineFor(row: CatalogRow, size: number): string {
  const pc = costPerChild(row, size)
  if (pc == null) return 'Ask the venue'
  if (pc === 0) return `For ${size} children`
  return `${money(pc)} per child`
}

function ageLabelFor(row: CatalogRow): string {
  if (row.ageBasis === 'grades') {
    if (row.gradeMin == null && row.gradeMax == null) return 'Grades not published'
    const g = (n: number) => (n === 0 ? 'K' : String(n))
    if (row.gradeMin != null && row.gradeMax != null) {
      return `Grades ${g(row.gradeMin)} to ${g(row.gradeMax)}`
    }
    return `Grades ${g(row.gradeMin ?? row.gradeMax!)}`
  }
  if (row.ageMinYears == null) return 'Ages not published'
  if (row.ageMaxYears == null) return `Ages ${row.ageMinYears}+`
  return `Ages ${row.ageMinYears} to ${row.ageMaxYears}`
}

function capacityLabelFor(row: CatalogRow): string {
  return row.capacityMax == null
    ? 'Capacity not published'
    : `Up to ${row.capacityMax} children`
}

function durationLabelFor(row: CatalogRow): string {
  if (row.durationMin == null) return 'Length not published'
  if (row.durationMin < 60) return `${row.durationMin} minutes`
  const h = row.durationMin / 60
  return Number.isInteger(h) ? `${h} hour${h === 1 ? '' : 's'}` : `${h.toFixed(1)} hours`
}

/* Two capitals from the venue name, for the no-photo tile. */
export function initialsOf(name: string): string {
  const caps = name
    .split(/\s+/)
    .filter((w) => /^[A-Z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return caps || name.slice(0, 2).toUpperCase()
}

/* ─── Decorate ───────────────────────────────────────────────────────────── */

export function decorate(
  row: CatalogRow,
  state: SearchState,
  origin: Point | null,
  heroes: Map<string, string>,
): SearchResult {
  const band = effectiveAgeRange(state.age_bands)

  const distanceKm =
    row.comesToYou || origin == null || row.venueLat == null || row.venueLng == null
      ? null
      : haversineKm(origin, { lat: row.venueLat, lng: row.venueLng })

  const fit = feasibility(
    {
      ageBasis: row.ageBasis,
      ageMinYears: row.ageMinYears,
      capacityMax: row.capacityMax,
      costPerChildCad: row.costPerChildCad,
      costPerGroupCad: row.costPerGroupCad,
      isFree: row.isFree,
    },
    {
      ageMin: band.min,
      ageMax: band.max,
      size: state.children,
      budgetPerChild: state.budget_max,
    },
  )

  return {
    ...row,
    distanceKm,
    travelLine: travelLine(distanceKm, state.transport as TransportMode, row.comesToYou),
    feasibility: fit,
    badge: badgeLabel(fit.level),
    bigTotal: bigTotalFor(row, state.children),
    bigTotalCaption: bigTotalCaptionFor(row),
    perChildLine: perChildLineFor(row, state.children),
    ageLabel: ageLabelFor(row),
    capacityLabel: capacityLabelFor(row),
    durationLabel: durationLabelFor(row),
    perChild: costPerChild(row, state.children),
    heroUrl: heroes.get(row.venueId) ?? null,
    initials: initialsOf(row.venueName),
    transport: state.transport,
    showRateFlag: row.schoolRateOnly,
  }
}

export function effectiveAgeRange(bands: number[]): { min: number; max: number } {
  const picked = bands.length ? bands : [1]
  const valid = picked.filter((i) => i >= 0 && i < AGE_BANDS.length)
  const use = valid.length ? valid : [1]
  return {
    min: Math.min(...use.map((i) => AGE_BANDS[i]![0])),
    max: Math.max(...use.map((i) => AGE_BANDS[i]![1])),
  }
}

/* ─── Filter and sort ────────────────────────────────────────────────────── */

/*
  Exclusions, not badges. A program outside the radius, out of walking range,
  or failing a checked filter is REMOVED from results. Only age, capacity and
  budget produce an amber badge — see feasibility.ts.
*/
export function applyFilters(
  results: SearchResult[],
  state: SearchState,
): SearchResult[] {
  const q = state.query.trim().toLowerCase()

  return results.filter((r) => {
    if (state.categories.length && !state.categories.includes(r.venueCategory)) {
      return false
    }

    /* Environment. `free` reads is_free or a zero price, not a cheap one. */
    for (const env of state.environment) {
      if (env === 'indoor' && r.indoor !== true) return false
      if (env === 'outdoor' && r.outdoor !== true) return false
      if (env === 'comes_to_you' && !r.comesToYou) return false
      if (env === 'free' && !(r.isFree || r.costPerChildCad === 0)) return false
    }

    /*
      Accessibility is AND: every checked box must match. null is not false —
      an unknown value only drops out when the filter is actually on, which is
      exactly what "unknown stays out of results only when the filter is on"
      means in the schema.
    */
    for (const a of state.accessibility) {
      if (a === 'wheelchair' && r.wheelchairAccessible !== true) return false
      if (a === 'sensory' && r.sensoryFriendly !== true) return false
      if (a === 'neuro' && r.neurodiversityFriendly !== true) return false
      if (a === 'low_noise' && r.lowNoise !== true) return false
    }

    /* Program type is OR: any checked format may match. */
    if (state.formats.length) {
      const fmt = r.format ?? []
      if (!state.formats.some((f) => fmt.includes(f as never))) return false
    }

    const moods = state.moods.filter((m) => m !== 'surprise') as Mood[]
    if (moods.length && !moods.some((m) => matchesMood(r, m))) return false

    /* Radius. 0 means any. Programs that come to you are never out of range. */
    if (state.radius_km > 0 && !r.comesToYou && r.distanceKm != null) {
      if (r.distanceKm > state.radius_km) return false
    }

    if (!isReachable(r.distanceKm, state.transport as TransportMode, r.comesToYou)) {
      return false
    }

    if (q) {
      const haystack = `${r.name} ${r.venueName} ${r.description ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    return true
  })
}

/*
  `rankFeasibleFirst` is a real product setting, declared on the design document
  itself and defaulting to true. It puts green above amber for every sort EXCEPT
  distance, where the user asked a question about distance and should get an
  answer about distance.
*/
export function applySort(
  results: SearchResult[],
  state: SearchState,
  rankFeasibleFirst = true,
): SearchResult[] {
  const out = [...results]
  const dist = (r: SearchResult) => r.distanceKm ?? Infinity
  const cost = (r: SearchResult) => r.perChild ?? Infinity
  const dur = (r: SearchResult) => r.durationMin ?? Infinity
  const green = (r: SearchResult) => r.feasibility.level === 'green'

  out.sort((a, b) => {
    if (state.sort === 'distance') return dist(a) - dist(b)

    if (rankFeasibleFirst && green(a) !== green(b)) return green(a) ? -1 : 1

    if (state.sort === 'price') return cost(a) - cost(b)
    if (state.sort === 'duration') return dur(a) - dur(b)

    return dist(a) - dist(b)
  })

  return out
}

/* ─── The whole pipeline ─────────────────────────────────────────────────── */

export function search(
  rows: CatalogRow[],
  state: SearchState,
  origin: Point | null,
  heroes: Map<string, string>,
  opts: { rankFeasibleFirst?: boolean; surpriseSeed?: number } = {},
): SearchResult[] {
  const decorated = rows.map((r) => decorate(r, state, origin, heroes))
  const filtered = applyFilters(decorated, state)

  /* Surprise me replaces the result set with three, and ignores the sort. */
  if (state.moods.includes('surprise')) {
    return seededPick(filtered, 3, opts.surpriseSeed ?? 1)
  }

  return applySort(filtered, state, opts.rankFeasibleFirst ?? true)
}

/*
  What to suggest loosening when nothing matched.

  Naming the actual culprit matters: an empty catalog that says "try the bus"
  when the real cause is two ANDed accessibility filters sends the user to
  change the wrong control, and they conclude the app is broken.

  Ordered by how sharply each filter cuts, so the first plausible cause wins.
*/
export function emptyHint(state: SearchState): string {
  if (state.query.trim()) {
    return `Nothing matches “${state.query.trim()}”. Try a shorter word, or clear the search.`
  }
  if (state.accessibility.length > 1) {
    return 'Every accessibility filter has to match at once. Try just the one that matters most.'
  }
  if (state.accessibility.length === 1) {
    return 'Few venues publish their accessibility details, so this filter cuts deep. Try clearing it and asking the venue instead.'
  }
  if (state.transport === 'walking') {
    return 'Walking only reaches about 2.5 km. Try the bus, or widen the distance.'
  }
  if (state.radius_km > 0 && state.radius_km <= 5) {
    return `Nothing within ${state.radius_km} km. Try widening the distance.`
  }
  if (state.formats.length || state.environment.length) {
    return 'Try clearing a filter or two — several are on at once.'
  }
  if (state.categories.length || state.moods.length) {
    return 'Nothing in that category for this group. Try another, or clear it.'
  }
  return 'Try a wider distance, a higher budget, or fewer filters.'
}

/* The line above the results: "12 outings, 5 fit your group". */
export function resultLine(results: SearchResult[]): string {
  const n = results.length
  if (n === 0) return 'No outings match'
  const green = results.filter((r) => r.feasibility.level === 'green').length
  const outings = `${n} outing${n === 1 ? '' : 's'}`
  return green ? `${outings}, ${green} fit your group` : outings
}
