import { describe, expect, it } from 'vitest'
import { parseSearchParams, toSearchParams } from './url'

describe('the origin override in the URL', () => {
  it('round trips an address a director picked', () => {
    const s = parseSearchParams({
      from: '350 Linden Avenue, Victoria',
      flat: '48.4151121',
      flng: '-123.3530579',
    })
    expect(s.from).toBe('350 Linden Avenue, Victoria')
    expect(s.from_lat).toBeCloseTo(48.4151121)
    expect(s.from_lng).toBeCloseTo(-123.3530579)
    expect(toSearchParams(s).get('flat')).toBe('48.4151121')
  })

  it('writes all three or none', () => {
    // A label with no coordinates would show one place in the control while
    // measuring from another.
    const s = parseSearchParams({ from: 'somewhere' })
    const out = toSearchParams(s)
    expect(out.get('from')).toBeNull()
    expect(out.get('flat')).toBeNull()
  })

  it('stays out of the URL when nothing was chosen', () => {
    expect(toSearchParams(parseSearchParams({})).toString()).toBe('')
  })
})

describe('a custom budget', () => {
  it('keeps an amount that is not one of the quick options', () => {
    const s = parseSearchParams({ max: '7.5' })
    expect(s.budget_max).toBe(7.5)
    expect(toSearchParams(s).get('max')).toBe('7.5')
  })

  it('leaves the default out of the URL', () => {
    expect(toSearchParams(parseSearchParams({ max: '10' })).get('max')).toBeNull()
  })

  it('keeps a free outing at zero rather than treating it as unset', () => {
    const s = parseSearchParams({ max: '0' })
    expect(s.budget_max).toBe(0)
    expect(toSearchParams(s).get('max')).toBe('0')
  })
})
