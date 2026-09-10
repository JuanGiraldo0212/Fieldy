import { describe, expect, it } from 'vitest'
import {
  compareCompleteness,
  completeness,
  type ProgramForScore,
  type VenueForScore,
} from './completeness'

const fullVenue: VenueForScore = {
  address: '1 Somewhere St, Victoria',
  lat: 48.42,
  lng: -123.36,
  bookingEmail: 'groups@example.ca',
  bookingPhone: null,
  hostsSchoolGroups: true,
  hostsDaycareGroups: null,
  hasWashrooms: true,
  hasLunchSpace: false,
  hasRainBackup: true,
  strollerAccessible: false,
  wheelchairAccessible: true,
  busParking: false,
  facilityNotes: null,
}

const fullProgram: ProgramForScore = {
  slug: 'tour',
  name: 'Guided tour',
  active: true,
  comesToYou: false,
  ageBasis: 'years',
  ageMinYears: 3,
  gradeMin: null,
  costPerChildCad: '8.50',
  costPerGroupCad: null,
  isFree: null,
  durationMin: 60,
  capacityMax: 30,
  leadTimeDays: 14,
  daysOffered: [1, 2, 3, 4, 5],
}

const hero = [{ role: 'hero' }]

describe('completeness', () => {
  it('finds nothing wrong with a complete venue', () => {
    const c = completeness(fullVenue, [fullProgram], hero)
    expect(c.items).toEqual([])
    expect(c.blocking).toBe(0)
    expect(c.asks).toBe(0)
  })

  it('treats no contact, no programs and no coordinates as blocking', () => {
    const c = completeness(
      { ...fullVenue, bookingEmail: null, bookingPhone: null, lat: null, lng: null },
      [],
      hero,
    )
    expect(c.items.map((i) => i.key)).toEqual(['contact', 'programs', 'coords'])
    expect(c.blocking).toBe(3)
  })

  it('a phone number alone is a booking contact', () => {
    const c = completeness(
      { ...fullVenue, bookingEmail: null, bookingPhone: '250-555-0100' },
      [fullProgram],
      hero,
    )
    expect(c.items.find((i) => i.key === 'contact')).toBeUndefined()
  })

  it('does not ask for coordinates when every program comes to you', () => {
    const c = completeness(
      { ...fullVenue, address: null, lat: null, lng: null },
      [{ ...fullProgram, comesToYou: true }],
      hero,
    )
    expect(c.items.find((i) => i.key === 'coords')).toBeUndefined()
  })

  it('distinguishes a missing address from an unpinned one', () => {
    const noAddress = completeness({ ...fullVenue, address: null, lat: null, lng: null }, [fullProgram], hero)
    const notPinned = completeness({ ...fullVenue, lat: null, lng: null }, [fullProgram], hero)
    expect(noAddress.items[0]?.label).toBe('No address')
    expect(notPinned.items[0]?.label).toMatch(/no map pin/)
  })

  it('a known no is complete; only null is a gap', () => {
    const c = completeness({ ...fullVenue, hasWashrooms: false, busParking: null }, [fullProgram], hero)
    expect(c.items.map((i) => i.key)).toEqual(['busParking'])
    expect(c.asks).toBe(1)
  })

  it('a facility note answers the question even when the flag is null', () => {
    const c = completeness(
      { ...fullVenue, hasLunchSpace: null, facilityNotes: { lunch_space: 'Picnic tables by the gate' } },
      [fullProgram],
      hero,
    )
    expect(c.items.find((i) => i.key === 'hasLunchSpace')).toBeUndefined()
  })

  it('asks about hosting only when both flags are unknown', () => {
    const both = completeness({ ...fullVenue, hostsSchoolGroups: null, hostsDaycareGroups: null }, [fullProgram], hero)
    const one = completeness({ ...fullVenue, hostsSchoolGroups: null, hostsDaycareGroups: false }, [fullProgram], hero)
    expect(both.items.map((i) => i.key)).toEqual(['hosts'])
    expect(one.items).toEqual([])
  })

  it('wants a hero photo', () => {
    const c = completeness(fullVenue, [fullProgram], [{ role: 'space' }])
    expect(c.items.map((i) => i.key)).toEqual(['hero'])
  })

  it('scores each active program and names it', () => {
    const c = completeness(
      fullVenue,
      [
        { ...fullProgram, ageMinYears: null, costPerChildCad: null, durationMin: null },
        { ...fullProgram, slug: 'old', name: 'Retired', active: false, ageMinYears: null },
      ],
      hero,
    )
    expect(c.items.map((i) => i.key)).toEqual(['tour:age', 'tour:cost', 'tour:duration'])
    expect(c.items[0]).toMatchObject({ programSlug: 'tour', programName: 'Guided tour', section: 'programs' })
  })

  it('reads grades when the basis is grades', () => {
    const c = completeness(
      fullVenue,
      [{ ...fullProgram, ageBasis: 'grades', ageMinYears: null, gradeMin: 0 }],
      hero,
    )
    expect(c.items).toEqual([])
  })

  it('free is a price; "not free" with no numbers is not', () => {
    const free = completeness(fullVenue, [{ ...fullProgram, costPerChildCad: null, isFree: true }], hero)
    const notFree = completeness(fullVenue, [{ ...fullProgram, costPerChildCad: null, isFree: false }], hero)
    expect(free.items).toEqual([])
    expect(notFree.items.map((i) => i.key)).toEqual(['tour:cost'])
  })
})

describe('compareCompleteness', () => {
  it('sorts most blocking first, then most asks, then by name', () => {
    const rows = [
      { name: 'B', blocking: 0, asks: 5 },
      { name: 'A', blocking: 0, asks: 5 },
      { name: 'C', blocking: 1, asks: 0 },
      { name: 'D', blocking: 0, asks: 9 },
    ]
    expect(rows.sort(compareCompleteness).map((r) => r.name)).toEqual(['C', 'D', 'A', 'B'])
  })
})
