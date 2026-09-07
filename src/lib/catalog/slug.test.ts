import { describe, expect, it } from 'vitest'
import { isSlug, slugify } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Beacon Hill Children’s Farm')).toBe('beacon-hill-children-s-farm')
  })

  it('drops accents rather than the letters under them', () => {
    expect(slugify('Musée Héritage')).toBe('musee-heritage')
  })

  it('spells out an ampersand', () => {
    expect(slugify('Arts & Crafts')).toBe('arts-and-crafts')
  })

  it('trims dashes at both ends and collapses runs', () => {
    expect(slugify('  -- Fort Rodd Hill (Colwood) -- ')).toBe('fort-rodd-hill-colwood')
  })

  it('caps the length without ending on a dash', () => {
    const long = slugify('a'.repeat(79) + ' bcdef')
    expect(long.length).toBeLessThanOrEqual(80)
    expect(long.endsWith('-')).toBe(false)
  })

  it('gives back an empty string for a name with nothing usable', () => {
    expect(slugify('???')).toBe('')
  })
})

describe('isSlug', () => {
  it('accepts what slugify produces', () => {
    expect(isSlug('bc-archives')).toBe(true)
    expect(isSlug('crag-x-climbing-gym')).toBe(true)
  })

  it('refuses uppercase, spaces, leading dashes and the empty string', () => {
    expect(isSlug('BC-Archives')).toBe(false)
    expect(isSlug('bc archives')).toBe(false)
    expect(isSlug('-bc')).toBe(false)
    expect(isSlug('')).toBe(false)
  })
})
