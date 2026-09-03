import { describe, expect, it } from 'vitest'
import { safeNext } from './safe-next'

describe('safeNext', () => {
  it('keeps an ordinary in-app path', () => {
    expect(safeNext('/trips')).toBe('/trips')
    expect(safeNext('/outing/a/b?x=1')).toBe('/outing/a/b?x=1')
  })

  it('refuses an absolute URL', () => {
    expect(safeNext('https://evil.example.com')).toBe('/')
    expect(safeNext('http://evil.example.com')).toBe('/')
  })

  it('refuses a protocol-relative URL, which browsers treat as absolute', () => {
    expect(safeNext('//evil.example.com')).toBe('/')
  })

  it('refuses a backslash path, which some browsers normalise to //', () => {
    expect(safeNext('/\\evil.example.com')).toBe('/')
  })

  it('refuses anything that is not a path', () => {
    expect(safeNext('javascript:alert(1)')).toBe('/')
    expect(safeNext('trips')).toBe('/')
  })

  it('falls back to the catalog when there is nothing', () => {
    expect(safeNext(null)).toBe('/')
    expect(safeNext(undefined)).toBe('/')
    expect(safeNext('')).toBe('/')
  })
})
