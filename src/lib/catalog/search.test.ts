import { describe, expect, it } from 'vitest'
import { searchStateSchema, type SearchState } from '@/lib/schemas'
import {
  applyFilters,
  applySort,
  decorate,
  emptyHint,
  effectiveAgeRange,
  initialsOf,
  resultLine,
  search,
  type CatalogRow,
} from './search'

const ORIGIN = { lat: 48.4155, lng: -123.341 } // the design's Fairfield centre

const state = (over: Partial<SearchState> = {}): SearchState =>
  searchStateSchema.parse({ ...over })

/* A row shaped like what fetchCatalog returns, with sensible passing values. */
const row = (over: Partial<CatalogRow> = {}): CatalogRow =>
  ({
    id: 'v:p',
    slug: 'p',
    name: 'Pond dipping',
    ourNote: null,
    description: 'A naturalist walks the boardwalk loop.',
    comesToYou: false,
    ageBasis: 'years',
    ageMinYears: 3,
    ageMaxYears: 12,
    gradeMin: null,
    gradeMax: null,
    durationMin: 90,
    capacityMax: 24,
    costPerChildCad: 6,
    costPerGroupCad: null,
    isFree: null,
    schoolRateOnly: false,
    indoor: false,
    outdoor: true,
    format: ['guided'],
    moodTags: null,
    sensoryFriendly: null,
    lowNoise: null,
    neurodiversityFriendly: null,
    monthsOffered: null,
    venueId: 'v',
    venueName: 'Swan Lake Nature Sanctuary',
    venueCategory: 'nature_outdoors',
    venueLat: 48.456,
    venueLng: -123.36,
    wheelchairAccessible: null,
    ...over,
  }) as CatalogRow

const noHeroes = new Map<string, string>()
const dec = (r: CatalogRow, s = state()) => decorate(r, s, ORIGIN, noHeroes)

describe('effectiveAgeRange', () => {
  it('spans the union of selected bands', () => {
    expect(effectiveAgeRange([0])).toEqual({ min: 1, max: 3 })
    expect(effectiveAgeRange([0, 3])).toEqual({ min: 1, max: 12 })
  })

  it('falls back to the default band rather than an empty range', () => {
    expect(effectiveAgeRange([])).toEqual({ min: 3, max: 5 })
    expect(effectiveAgeRange([99])).toEqual({ min: 3, max: 5 })
  })
})

describe('initialsOf', () => {
  it('takes two capitals', () => {
    expect(initialsOf('Swan Lake Nature Sanctuary')).toBe('SL')
    expect(initialsOf('Royal BC Museum')).toBe('RB')
  })

  it('copes with a lowercase name', () => {
    expect(initialsOf('crag x')).toBe('CR')
  })
})

describe('decorate — labels', () => {
  it('shows the group TOTAL big for a per-child price', () => {
    // $6 a child for 16 children. The big number is what the trip costs.
    const r = dec(row())
    expect(r.bigTotal).toBe('$96')
    expect(r.bigTotalCaption).toBe('total')
    expect(r.perChildLine).toBe('$6 per child')
  })

  it('shows the group FEE big for a per-class price', () => {
    // The venue charges $150 regardless of headcount, so that is the number.
    const r = dec(row({ costPerChildCad: null, costPerGroupCad: 150 }))
    expect(r.bigTotal).toBe('$150')
    expect(r.bigTotalCaption).toBe('per class')
    expect(r.perChildLine).toBe('$9.38 per child')
  })

  it('shows an em dash, not a zero, when no price is published', () => {
    const r = dec(row({ costPerChildCad: null }))
    expect(r.bigTotal).toBe('—')
    expect(r.bigTotalCaption).toBe('price not published')
    expect(r.perChildLine).toBe('Ask the venue')
  })

  it('says Free rather than $0', () => {
    const r = dec(row({ isFree: true, costPerChildCad: null }))
    expect(r.bigTotal).toBe('Free')
    expect(r.bigTotalCaption).toBe('no cost')
    expect(r.perChildLine).toBe('For 16 children')
  })

  it('recomputes the big total when the group size changes', () => {
    // The whole point of the big number: it answers "what will this cost us".
    expect(dec(row(), state({ children: 10 })).bigTotal).toBe('$60')
    expect(dec(row(), state({ children: 30 })).bigTotal).toBe('$180')
  })

  it('writes ages, and grades with K rather than 0', () => {
    expect(dec(row()).ageLabel).toBe('Ages 3 to 12')
    expect(dec(row({ ageMinYears: null })).ageLabel).toBe('Ages not published')
    expect(dec(row({ ageBasis: 'grades', gradeMin: 0, gradeMax: 3 })).ageLabel).toBe('Grades K to 3')
    expect(dec(row({ ageBasis: 'grades', gradeMin: 2, gradeMax: 12 })).ageLabel).toBe('Grades 2 to 12')
  })

  it('is honest about unpublished capacity and duration', () => {
    expect(dec(row({ capacityMax: null })).capacityLabel).toBe('Capacity not published')
    expect(dec(row({ durationMin: null })).durationLabel).toBe('Length not published')
    expect(dec(row({ durationMin: 90 })).durationLabel).toBe('1.5 hours')
    expect(dec(row({ durationMin: 60 })).durationLabel).toBe('1 hour')
    expect(dec(row({ durationMin: 45 })).durationLabel).toBe('45 minutes')
  })

  it('has no distance for a program that comes to you', () => {
    const r = dec(row({ comesToYou: true }))
    expect(r.distanceKm).toBeNull()
    expect(r.travelLine).toBe('they come to you')
  })

  it('has no distance when the venue has no coordinates', () => {
    const r = dec(row({ venueLat: null, venueLng: null }))
    expect(r.distanceKm).toBeNull()
    expect(r.travelLine).toBe('distance not known')
  })

  it('withholds an unverified hero image', () => {
    // Every image in the catalog is currently unverified, so every card falls
    // back to its initials tile.
    expect(dec(row()).heroUrl).toBeNull()
    expect(dec(row()).initials).toBe('SL')
  })
})

describe('applyFilters — exclusions', () => {
  const all = (rows: CatalogRow[], s: SearchState) =>
    applyFilters(rows.map((r) => decorate(r, s, ORIGIN, noHeroes)), s)

  it('drops a venue beyond the radius', () => {
    const far = row({ venueLat: 48.65, venueLng: -123.397 }) // Sidney, ~26 km
    expect(all([far], state({ radius_km: 5 }))).toHaveLength(0)
    expect(all([far], state({ radius_km: 30 }))).toHaveLength(1)
  })

  it('treats radius 0 as any distance', () => {
    const far = row({ venueLat: 48.65, venueLng: -123.397 })
    expect(all([far], state({ radius_km: 0 }))).toHaveLength(1)
  })

  it('never puts a comes-to-you program out of range', () => {
    const r = row({ comesToYou: true, venueLat: 48.65, venueLng: -123.397 })
    expect(all([r], state({ radius_km: 3 }))).toHaveLength(1)
  })

  it('drops a walk beyond 2.5 km when walking is the mode', () => {
    // Swan Lake is about 5 km out.
    expect(all([row()], state({ transport: 'walking', radius_km: 0 }))).toHaveLength(0)
    expect(all([row()], state({ transport: 'bus', radius_km: 0 }))).toHaveLength(1)
  })

  it('filters by category', () => {
    expect(all([row()], state({ categories: ['science'] }))).toHaveLength(0)
    expect(all([row()], state({ categories: ['nature_outdoors'] }))).toHaveLength(1)
  })

  it('ANDs accessibility, and treats unknown as not matching', () => {
    const s = state({ accessibility: ['wheelchair'], radius_km: 0 })
    expect(all([row({ wheelchairAccessible: null })], s)).toHaveLength(0)
    expect(all([row({ wheelchairAccessible: false })], s)).toHaveLength(0)
    expect(all([row({ wheelchairAccessible: true })], s)).toHaveLength(1)

    const both = state({ accessibility: ['wheelchair', 'low_noise'], radius_km: 0 })
    expect(all([row({ wheelchairAccessible: true, lowNoise: null })], both)).toHaveLength(0)
    expect(all([row({ wheelchairAccessible: true, lowNoise: true })], both)).toHaveLength(1)
  })

  it('ORs program formats', () => {
    const s = state({ formats: ['hands_on', 'guided'], radius_km: 0 })
    expect(all([row({ format: ['guided'] })], s)).toHaveLength(1)
    expect(all([row({ format: ['self_guided'] })], s)).toHaveLength(0)
  })

  it('filters environment, with free meaning free', () => {
    expect(all([row()], state({ environment: ['indoor'], radius_km: 0 }))).toHaveLength(0)
    expect(all([row()], state({ environment: ['outdoor'], radius_km: 0 }))).toHaveLength(1)
    expect(all([row({ costPerChildCad: 2 })], state({ environment: ['free'], radius_km: 0 }))).toHaveLength(0)
    expect(all([row({ isFree: true })], state({ environment: ['free'], radius_km: 0 }))).toHaveLength(1)
  })

  it('searches name, venue and description', () => {
    const s = (q: string) => state({ query: q, radius_km: 0 })
    expect(all([row()], s('pond'))).toHaveLength(1)
    expect(all([row()], s('swan'))).toHaveLength(1)
    expect(all([row()], s('boardwalk'))).toHaveLength(1)
    expect(all([row()], s('dinosaur'))).toHaveLength(0)
  })
})

describe('applyFilters — moods', () => {
  const all = (rows: CatalogRow[], s: SearchState) =>
    applyFilters(rows.map((r) => decorate(r, s, ORIGIN, noHeroes)), s)

  it('derives explore from a nature venue', () => {
    expect(all([row()], state({ moods: ['explore'], radius_km: 0 }))).toHaveLength(1)
    expect(all([row()], state({ moods: ['creative'], radius_km: 0 }))).toHaveLength(0)
  })

  it('lets an explicit mood_tag override the category derivation', () => {
    const r = row({ moodTags: ['creative'] })
    expect(all([r], state({ moods: ['creative'], radius_km: 0 }))).toHaveLength(1)
  })

  it('ORs several moods', () => {
    expect(all([row()], state({ moods: ['creative', 'explore'], radius_km: 0 }))).toHaveLength(1)
  })

  it('reads active as outdoors and not coming to you', () => {
    expect(all([row()], state({ moods: ['active'], radius_km: 0 }))).toHaveLength(1)
    expect(all([row({ comesToYou: true })], state({ moods: ['active'] }))).toHaveLength(0)
  })
})

describe('applySort', () => {
  const green = row({ id: 'green', capacityMax: 30, costPerChildCad: 2, durationMin: 200, venueLat: 48.6, venueLng: -123.5 })
  const amber = row({ id: 'amber', capacityMax: 4, costPerChildCad: 9, durationMin: 30, venueLat: 48.42, venueLng: -123.35 })

  const sorted = (s: SearchState, rank = true) =>
    applySort([green, amber].map((r) => decorate(r, s, ORIGIN, noHeroes)), s, rank).map((r) => r.id)

  it('puts green above amber for best match, even when amber is nearer', () => {
    expect(sorted(state({ sort: 'best_match' }))).toEqual(['green', 'amber'])
  })

  it('puts green above amber for price and duration too', () => {
    expect(sorted(state({ sort: 'price' }))).toEqual(['green', 'amber'])
    expect(sorted(state({ sort: 'duration' }))).toEqual(['green', 'amber'])
  })

  it('ignores the green ranking when the user sorted by distance', () => {
    // The user asked a question about distance; answer it.
    expect(sorted(state({ sort: 'distance' }))).toEqual(['amber', 'green'])
  })

  it('respects rankFeasibleFirst being turned off', () => {
    expect(sorted(state({ sort: 'best_match' }), false)).toEqual(['amber', 'green'])
  })
})

describe('search — surprise me', () => {
  const rows = Array.from({ length: 10 }, (_, i) =>
    row({ id: `p${i}`, venueLat: 48.42 + i * 0.001, venueLng: -123.35 }),
  )

  it('returns exactly three', () => {
    const s = state({ moods: ['surprise'], radius_km: 0 })
    expect(search(rows, s, ORIGIN, noHeroes, { surpriseSeed: 7 })).toHaveLength(3)
  })

  it('is stable for the same seed, so a shared URL shows the same three', () => {
    const s = state({ moods: ['surprise'], radius_km: 0 })
    const a = search(rows, s, ORIGIN, noHeroes, { surpriseSeed: 7 }).map((r) => r.id)
    const b = search(rows, s, ORIGIN, noHeroes, { surpriseSeed: 7 }).map((r) => r.id)
    expect(a).toEqual(b)
  })

  it('changes with the seed', () => {
    const s = state({ moods: ['surprise'], radius_km: 0 })
    const a = search(rows, s, ORIGIN, noHeroes, { surpriseSeed: 1 }).map((r) => r.id)
    const b = search(rows, s, ORIGIN, noHeroes, { surpriseSeed: 99 }).map((r) => r.id)
    expect(a).not.toEqual(b)
  })
})

describe('emptyHint', () => {
  it('blames the search text first, because that is usually it', () => {
    expect(emptyHint(state({ query: 'salmon', transport: 'walking' }))).toMatch(/“salmon”/)
  })

  it('explains that accessibility filters AND together', () => {
    const h = emptyHint(state({ accessibility: ['wheelchair', 'sensory'], transport: 'walking' }))
    expect(h).toMatch(/at once/)
  })

  it('does not blame walking when accessibility is the real cause', () => {
    // The bug this exists to prevent: sending the user to change the wrong
    // control, after which they conclude the app is broken.
    const h = emptyHint(state({ accessibility: ['wheelchair'], transport: 'walking' }))
    expect(h).not.toMatch(/2\.5 km/)
  })

  it('blames walking when walking really is the constraint', () => {
    expect(emptyHint(state({ transport: 'walking', radius_km: 0 }))).toMatch(/2\.5 km/)
  })

  it('names the radius when a tight one is set', () => {
    expect(emptyHint(state({ transport: 'bus', radius_km: 3 }))).toMatch(/within 3 km/)
  })

  it('falls back to generic advice with no filters on', () => {
    expect(emptyHint(state({ transport: 'bus', radius_km: 0 }))).toMatch(/wider distance/)
  })
})

describe('resultLine', () => {
  const s = state({ radius_km: 0 })
  const mk = (r: CatalogRow) => decorate(r, s, ORIGIN, noHeroes)

  it('counts the fits', () => {
    expect(resultLine([mk(row()), mk(row({ capacityMax: 2 }))])).toBe('2 outings, 1 fit your group')
  })

  it('says nothing about fits when none do', () => {
    expect(resultLine([mk(row({ capacityMax: 2 }))])).toBe('1 outing')
  })

  it('has an honest empty case', () => {
    expect(resultLine([])).toBe('No outings match')
  })
})
