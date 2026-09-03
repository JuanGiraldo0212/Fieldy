import { describe, expect, it } from 'vitest'
import { pickedPoint } from './geocode'

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
