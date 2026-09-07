import { describe, expect, it } from 'vitest'
import { resolveOrigin, stateWithRoom, VICTORIA, type RoomForSearch } from './resolve'
import { parseSearchParams } from './url'

const ROOM: RoomForSearch = {
  name: 'Sunbeam Room',
  address: '350 Linden Avenue, Victoria',
  lat: 48.4151121,
  lng: -123.3530579,
  ageMin: 3,
  ageMax: 5,
  size: 18,
  budgetPerChild: '12.00',
  transport: ['bus', 'walking'],
}

describe('where a search is measured from', () => {
  it('sends a signed-out visitor to the centre of Victoria', () => {
    const r = resolveOrigin(parseSearchParams({}), null)
    expect(r.origin).toEqual(VICTORIA)
    expect(r.originLabel).toBe('Victoria')
    expect(r.originAddress).toBe('Victoria')
  })

  it("uses the active room's home base, and names it", () => {
    const r = resolveOrigin(parseSearchParams({}), ROOM)
    expect(r.origin).toEqual({ lat: ROOM.lat, lng: ROOM.lng })
    expect(r.originLabel).toBe('Sunbeam Room')
    expect(r.originAddress).toBe('350 Linden Avenue, Victoria')
  })

  it('lets an address picked for this search beat the room', () => {
    const state = parseSearchParams({
      from: 'Beacon Hill Park',
      flat: '48.4123',
      flng: '-123.3650',
    })
    const r = resolveOrigin(state, ROOM)
    expect(r.origin.lat).toBeCloseTo(48.4123)
    expect(r.originLabel).toBe('Beacon Hill Park')
  })

  /* Geocoding can fail. The point falls back, the name should not: a pin
     labelled with a place she never mentioned is worse than a coarse pin. */
  it('keeps naming a room that has no coordinates', () => {
    const r = resolveOrigin(parseSearchParams({}), { ...ROOM, lat: null, lng: null })
    expect(r.origin).toEqual(VICTORIA)
    expect(r.originLabel).toBe('Sunbeam Room')
  })
})

describe('the room filling in what the URL left silent', () => {
  it('takes the room size, budget and travel when nothing was typed', () => {
    const s = stateWithRoom(parseSearchParams({}), {}, ROOM)
    expect(s.children).toBe(18)
    expect(s.budget_max).toBe(12)
    expect(s.transport).toBe('bus')
  })

  it('never overwrites what the director typed', () => {
    const params = { kids: '30', max: '25', to: 'walking', ages: '2' }
    const s = stateWithRoom(parseSearchParams(params), params, ROOM)
    expect(s.children).toBe(30)
    expect(s.budget_max).toBe(25)
    expect(s.transport).toBe('walking')
  })

  it('leaves a signed-out search exactly as parsed', () => {
    const urlState = parseSearchParams({})
    expect(stateWithRoom(urlState, {}, null)).toEqual(urlState)
  })
})
