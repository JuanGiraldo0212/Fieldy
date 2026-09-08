import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

/*
  The suggestion list is the only way to attach a coordinate the geocoder
  cannot find from the address text, so what matters is that it climbs the
  ladder rather than giving up on the first phrasing — and that it stops as
  soon as something answers, because every rung is a second of someone's time.
*/

/* One Nominatim row, shaped as the route reads it. */
function row(name: string, lat = 48.5, lon = -123.4) {
  return {
    lat: String(lat),
    lon: String(lon),
    display_name: `${name}, Canada`,
    name,
    addresstype: 'tourism',
    address: { city: 'Victoria', state: 'British Columbia' },
  }
}

function respondTo(answers: Record<string, unknown[]>) {
  const asked: string[] = []
  vi.stubGlobal('fetch', async (url: URL | string) => {
    const q = new URL(String(url)).searchParams.get('q') ?? ''
    asked.push(q)
    return { ok: true, json: async () => answers[q] ?? [] } as Response
  })
  return asked
}

const call = (query: string) =>
  GET(new Request(`http://localhost/api/geocode/suggest?${query}`))

afterEach(() => vi.unstubAllGlobals())

describe('GET /api/geocode/suggest', () => {
  it('answers from the typed text and asks nothing else', async () => {
    const asked = respondTo({
      '1040 Moss Street, Victoria, BC': [row('Art Gallery of Greater Victoria')],
    })

    const json = await (await call('q=1040 Moss Street, Victoria, BC')).json()

    expect(json.suggestions).toHaveLength(1)
    expect(asked).toEqual(['1040 Moss Street, Victoria, BC'])
  })

  it('falls through to street and locality, which a four-part address hides', async () => {
    const asked = respondTo({
      '110 Island Highway, View Royal': [row('Craigflower Manor')],
    })

    const json = await (
      await call('q=110 Island Highway, View Royal, Victoria, British Columbia')
    ).json()

    expect(json.suggestions[0].label).toContain('Craigflower Manor')
    expect(asked[0]).toBe('110 Island Highway, View Royal, Victoria, British Columbia')
  })

  it('falls through to the venue name, which is all OpenStreetMap knows', async () => {
    const asked = respondTo({
      'Butchart Gardens, Brentwood Bay': [row('The Butchart Gardens')],
    })

    const json = await (
      await call(
        'q=800 Benvenuto Avenue, Brentwood Bay, BC V8M 1J8' +
          '&name=Butchart Gardens – National Historic Site',
      )
    ).json()

    expect(json.suggestions[0].label).toContain('Butchart Gardens')
    /* The address was asked for first, every way, before the name. */
    expect(asked.slice(0, 3)).toEqual([
      '800 Benvenuto Avenue, Brentwood Bay, BC V8M 1J8',
      '800 Benvenuto Avenue, Brentwood Bay, BC',
      '800 Benvenuto Avenue, Brentwood Bay',
    ])
  })

  it('sends no name rungs for a home base, and stops at the cap', async () => {
    const asked = respondTo({})

    const json = await (
      await call('q=350 Linden Avenue, Victoria, BC V8V 4G2')
    ).json()

    expect(json.suggestions).toEqual([])
    expect(asked).toEqual([
      '350 Linden Avenue, Victoria, BC V8V 4G2',
      '350 Linden Avenue, Victoria, BC',
      '350 Linden Avenue, Victoria',
    ])
  })

  it('asks nothing at all for two characters', async () => {
    const asked = respondTo({})

    const json = await (await call('q=80')).json()

    expect(json.suggestions).toEqual([])
    expect(asked).toEqual([])
  })

  it('returns an empty list when the geocoder throws, so the form still submits', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new Error('down')
    })

    const json = await (await call('q=1040 Moss Street, Victoria, BC')).json()

    expect(json.suggestions).toEqual([])
  })
})
