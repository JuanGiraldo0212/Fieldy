import { describe, expect, it } from 'vitest'
import { pickedPoint, queriesFor } from './geocode'

/*
  The address picker sends the coordinates of whatever the director chose, so
  the server does not geocode her text a second time and land somewhere else.
  Those coordinates arrive from the browser, so they are checked.
*/
describe('pickedPoint', () => {
  it('accepts a point in the region', () => {
    // 350 Linden Avenue, which is what the picker returns for that address.
    expect(pickedPoint('48.4151121', '-123.3530579')).toEqual({
      lat: 48.4151121,
      lng: -123.3530579,
    })
  })

  it('ignores a missing pair, so the server geocodes the text instead', () => {
    expect(pickedPoint(null, null)).toBeNull()
    expect(pickedPoint('48.41', null)).toBeNull()
    expect(pickedPoint(null, '-123.35')).toBeNull()
  })

  it('refuses anything that is not a number', () => {
    expect(pickedPoint('over there', '-123.35')).toBeNull()
    expect(pickedPoint('', '')).toBeNull()
    expect(pickedPoint('NaN', '0')).toBeNull()
  })

  it('refuses a point outside the region', () => {
    // Toronto. A forged pair only misplaces that person's own home base, but
    // storing it would quietly break every distance on their catalog.
    expect(pickedPoint('43.6532', '-79.3832')).toBeNull()
    // Null Island, the classic geocoder failure.
    expect(pickedPoint('0', '0')).toBeNull()
  })

  it('refuses a swapped pair', () => {
    // lat and lng the wrong way round is a real mistake, and -123 is not a
    // latitude anywhere.
    expect(pickedPoint('-123.3530579', '48.4151121')).toBeNull()
  })
})

/*
  The ladder is the whole of the geocoder's recall: OpenStreetMap knows plenty
  of these venues by name and none of them by their full mailing address, and
  the catalog's own coordinates came from exactly these rungs.
*/
describe('queriesFor', () => {
  it('drops the postcode, which Nominatim matches literally', () => {
    expect(queriesFor('800 Benvenuto Avenue, Brentwood Bay, BC V8M 1J8')).toContain(
      '800 Benvenuto Avenue, Brentwood Bay, BC',
    )
  })

  it('tries street and locality alone, which is what a four-part address hides', () => {
    // "110 Island Highway, View Royal, Victoria, British Columbia" matches
    // nothing; "110 Island Highway, View Royal" is Craigflower Manor.
    expect(
      queriesFor('110 Island Highway, View Royal, Victoria, British Columbia'),
    ).toContain('110 Island Highway, View Royal')
  })

  it('asks by name when there is one, and drops the designation suffix', () => {
    const qs = queriesFor(
      '800 Benvenuto Avenue, Brentwood Bay, BC V8M 1J8',
      'Butchart Gardens – National Historic Site',
    )
    expect(qs).toContain('Butchart Gardens, Brentwood Bay')
    expect(qs).toContain('Butchart Gardens, British Columbia, Canada')
  })

  it('asks the address before the name, so a street match always wins', () => {
    const qs = queriesFor('1040 Moss Street, Victoria, BC', 'Art Gallery of Greater Victoria')
    expect(qs[0]).toBe('1040 Moss Street, Victoria, BC')
    expect(qs.indexOf('Art Gallery of Greater Victoria, Victoria')).toBeGreaterThan(0)
  })

  it('adds no name rungs for a home base, which has no name to ask by', () => {
    expect(queriesFor('350 Linden Avenue, Victoria, BC')).toEqual([
      '350 Linden Avenue, Victoria, BC',
      '350 Linden Avenue, Victoria',
    ])
  })
})
