import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatKm,
  haversineKm,
  isReachable,
  travelCaveat,
  travelLine,
  travelMinutes,
  travelTime,
  WALK_LIMIT_KM,
} from './distance'

/* Real coordinates from the catalog, so the numbers mean something. */
const AGGV = { lat: 48.42189, lng: -123.34763 } // Art Gallery of Greater Victoria
const CATHEDRAL = { lat: 48.4219, lng: -123.35868 } // Christ Church Cathedral
const BUTCHART = { lat: 48.56535, lng: -123.46956 } // Butchart Gardens

describe('haversineKm', () => {
  it('is zero for the same point', () => {
    expect(haversineKm(AGGV, AGGV)).toBe(0)
  })

  it('measures a short city hop', () => {
    // Gallery to cathedral is a bit over 800 m on the map.
    const km = haversineKm(AGGV, CATHEDRAL)
    expect(km).toBeGreaterThan(0.7)
    expect(km).toBeLessThan(0.9)
  })

  it('measures a cross-peninsula trip', () => {
    // Victoria to Brentwood Bay, roughly 20 km straight line.
    const km = haversineKm(AGGV, BUTCHART)
    expect(km).toBeGreaterThan(18)
    expect(km).toBeLessThan(22)
  })

  it('is symmetric', () => {
    expect(haversineKm(AGGV, BUTCHART)).toBeCloseTo(haversineKm(BUTCHART, AGGV), 9)
  })

  it('does not lose precision the way float4 coordinates would', () => {
    // 48.41616 stored as 48.4162 shifts the point by ~50 m. Two points that
    // differ only in the 5th decimal must not collapse to the same distance.
    const a = { lat: 48.41616, lng: -123.32642 }
    const b = { lat: 48.4162, lng: -123.326 }
    expect(haversineKm(a, b)).toBeGreaterThan(0.02)
  })
})

describe('travelMinutes', () => {
  it('walks at 4.6 km/h with no overhead', () => {
    // 4.6 km in exactly an hour.
    expect(travelMinutes(4.6, 'walking')).toBe(60)
    expect(travelMinutes(2.3, 'walking')).toBe(30)
  })

  it('adds a 9 minute wait to every bus trip', () => {
    // 15 km/h means 15 km in 60 min, plus the wait.
    expect(travelMinutes(15, 'bus')).toBe(69)
    // Even a trip of zero distance still costs the wait.
    expect(travelMinutes(0, 'bus')).toBe(9)
  })

  it('adds 4 minutes to parent drivers', () => {
    expect(travelMinutes(32, 'parent_drivers')).toBe(64)
    expect(travelMinutes(0, 'parent_drivers')).toBe(4)
  })

  it('makes the bus slower than walking over short distances', () => {
    // The 9 minute wait dominates a short hop: 500 m is 7 min on foot but
    // 11 by bus. They cross over at almost exactly 1 km, where both are 13.
    expect(travelMinutes(0.5, 'bus')).toBeGreaterThan(travelMinutes(0.5, 'walking'))
    expect(travelMinutes(1, 'bus')).toBe(travelMinutes(1, 'walking'))
    expect(travelMinutes(2, 'bus')).toBeLessThan(travelMinutes(2, 'walking'))
  })
})

describe('formatDuration', () => {
  it('shows minutes under an hour', () => {
    expect(formatDuration(1)).toBe('1 min')
    expect(formatDuration(59)).toBe('59 min')
  })

  it('shows a bare hour with no minutes', () => {
    expect(formatDuration(60)).toBe('1 hr')
    expect(formatDuration(120)).toBe('2 hr')
  })

  it('shows hours and minutes together', () => {
    expect(formatDuration(72)).toBe('1 hr 12 min')
    expect(formatDuration(135)).toBe('2 hr 15 min')
  })
})

describe('travelTime', () => {
  it('reads the way the design writes it', () => {
    expect(travelTime(2, 'walking')).toBe('26 min')
    expect(travelTime(4.2, 'bus')).toBe('26 min')
  })
})

describe('formatKm', () => {
  it('drops a trailing zero', () => {
    expect(formatKm(4)).toBe('4')
    expect(formatKm(4.04)).toBe('4')
  })

  it('keeps one decimal', () => {
    expect(formatKm(4.24)).toBe('4.2')
    expect(formatKm(0.85)).toBe('0.9')
  })
})

describe('travelLine', () => {
  it('says so when the program travels to the centre', () => {
    expect(travelLine(null, 'bus', true)).toBe('they come to you')
    // Distance is irrelevant when they come to you.
    expect(travelLine(30, 'bus', true)).toBe('they come to you')
  })

  it('combines time, mode word and distance', () => {
    expect(travelLine(4.2, 'bus', false)).toBe('26 min by bus · 4.2 km')
    expect(travelLine(1.5, 'walking', false)).toBe('20 min on foot · 1.5 km')
    expect(travelLine(10, 'parent_drivers', false)).toBe('23 min driving · 10 km')
  })

  it('is honest when the venue has no coordinates', () => {
    expect(travelLine(null, 'bus', false)).toBe('distance not known')
  })
})

describe('travelCaveat', () => {
  it('warns when a walk is too far for the group', () => {
    expect(travelCaveat(3, 'walking')).toBe('too far with this group')
    expect(travelCaveat(WALK_LIMIT_KM, 'walking')).toBe('')
  })

  it('always mentions the bus wait', () => {
    expect(travelCaveat(1, 'bus')).toBe('includes a 9 min wait')
  })

  it('has nothing to say about driving', () => {
    expect(travelCaveat(20, 'parent_drivers')).toBe('')
  })
})

describe('isReachable', () => {
  it('excludes a walk beyond the limit', () => {
    expect(isReachable(2.5, 'walking', false)).toBe(true)
    expect(isReachable(2.6, 'walking', false)).toBe(false)
  })

  it('does not limit bus or drivers', () => {
    expect(isReachable(26, 'bus', false)).toBe(true)
    expect(isReachable(26, 'parent_drivers', false)).toBe(true)
  })

  it('always reaches a program that comes to you, however far the venue', () => {
    expect(isReachable(500, 'walking', true)).toBe(true)
  })

  it('does not hide a venue merely because we lack its coordinates', () => {
    // Four venues have no coordinates. Hiding them would be a silent
    // disappearance; the card shows "distance not known" instead.
    expect(isReachable(null, 'walking', false)).toBe(true)
  })
})
