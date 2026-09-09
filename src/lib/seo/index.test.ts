import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clip,
  jsonLdScript,
  outingDescription,
  outingJsonLd,
  outingPath,
  outingTitle,
  venueCity,
  type OutingMeta,
} from './index'

afterEach(() => {
  vi.unstubAllEnvs()
})

const base = (): OutingMeta => ({
  program: {
    slug: 'facility-tour-workshop',
    name: 'Facility tour or workshop',
    description: 'A guided tour of the archives with a hands-on records workshop.',
    whatChildrenDo: null,
    practicalSummary: null,
    ageBasis: 'grades',
    ageMinYears: null,
    ageMaxYears: null,
    gradeMin: 0,
    gradeMax: 7,
    costPerChildCad: null,
    costPerGroupCad: null,
    isFree: true,
    durationMin: 90,
    comesToYou: false,
    active: true,
    updatedAt: new Date('2026-09-01T00:00:00Z'),
  },
  venue: {
    id: 'bc-archives',
    name: 'BC Archives',
    category: 'museums_history',
    address: '675 Belleville St, Victoria, BC',
    lat: 48.42,
    lng: -123.37,
    website: 'https://bcarchives.ca',
  },
})

describe('the title and snippet a search result shows', () => {
  it('names the program and the venue, not the brand', () => {
    expect(outingTitle(base())).toBe('Facility tour or workshop · BC Archives')
  })

  it('leads with where, who and cost before the prose', () => {
    expect(outingDescription(base())).toBe(
      'BC Archives, Victoria BC. Grades K to 7, free. A guided tour of the archives with a hands-on records workshop.',
    )
  })

  /* The catalog reaches up the island; the town comes from the address. */
  it('names the venue\'s own town, not Victoria for everyone', () => {
    const m = base()
    m.venue.name = 'Ladysmith Museum'
    m.venue.address = 'Unit B, 1115 1st Avenue, Ladysmith, BC'
    expect(outingDescription(m)).toMatch(/^Ladysmith Museum, Ladysmith BC\./)
    m.venue.address = null
    expect(outingDescription(m)).toMatch(/^Ladysmith Museum, Vancouver Island BC\./)
  })

  it('says a program comes to the classroom instead of a place', () => {
    const m = base()
    m.program.comesToYou = true
    m.program.isFree = null
    m.program.costPerChildCad = '8.50'
    m.program.ageBasis = 'years'
    m.program.ageMinYears = 3
    m.program.ageMaxYears = 5
    expect(outingDescription(m)).toMatch(/^BC Archives comes to your classroom\. Ages 3 to 5, \$8\.50 a child\./)
  })

  /* Nulls are data: an unpublished price or age is left out, never guessed. */
  it('leaves out what the venue has not published', () => {
    const m = base()
    m.program.isFree = null
    m.program.gradeMax = null
    m.program.description = null
    expect(outingDescription(m)).toBe('BC Archives, Victoria BC.')
  })

  it('cuts a long snippet on a word, with an ellipsis', () => {
    const m = base()
    m.program.description = 'word '.repeat(80)
    const d = outingDescription(m)
    expect(d.length).toBeLessThanOrEqual(155)
    expect(d.endsWith('word…')).toBe(true)
  })

  it('clip leaves a short string alone and squashes whitespace', () => {
    expect(clip('  two\n words ')).toBe('two words')
  })
})

describe('the town in an address', () => {
  it.each([
    ['675 Belleville Street, Victoria, BC V8W 9W2', 'Victoria'],
    ['9799 Waterwheel Crescent, Chemainus, British Columbia, Canada V0R 1K0', 'Chemainus'],
    ['9811 Seaport Place, Sidney, BC, V8L 4X3', 'Sidney'],
    ["Fisherman's Wharf, Dock A, 1 Dallas Rd. Victoria, BC, Canada", 'Victoria'],
    ['Discovery Harbour Marina (G dock), Campbell River, BC', 'Campbell River'],
    ['1845 Cowichan Bay Rd, Cowichan Bay, BC V0R 1N0', 'Cowichan Bay'],
    ['Save-On-Foods Memorial Centre, 1925 Blanshard St.', null],
    ['1925 Blanshard St, BC', null],
    [null, null],
  ])('%s → %s', (address, city) => {
    expect(venueCity(address)).toBe(city)
  })
})

describe('structured data for one outing', () => {
  it('is a Service from the venue with an offer only when priced', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.fieldy.ca')
    const ld = outingJsonLd(base()) as Record<string, unknown>
    expect(ld['@type']).toBe('Service')
    expect(ld.url).toBe('https://www.fieldy.ca/outing/bc-archives/facility-tour-workshop')
    expect(ld.offers).toMatchObject({ price: 0, priceCurrency: 'CAD' })
    expect(ld.provider).toMatchObject({ name: 'BC Archives', url: 'https://bcarchives.ca' })

    const m = base()
    m.program.isFree = null
    expect((outingJsonLd(m) as Record<string, unknown>).offers).toBeUndefined()

    m.program.costPerGroupCad = '120'
    expect((outingJsonLd(m) as Record<string, unknown>).offers).toMatchObject({
      price: 120,
      description: 'Per group',
    })
  })

  it('cannot be closed early by a venue description', () => {
    expect(jsonLdScript({ a: '</script><b>' })).toBe('{"a":"\\u003c/script>\\u003cb>"}')
  })

  it('encodes the path segments', () => {
    expect(outingPath('a b', 'c/d')).toBe('/outing/a%20b/c%2Fd')
  })
})
