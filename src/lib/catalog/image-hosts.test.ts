import { describe, expect, it } from 'vitest'
import { decodePhotoKey, isRenderableImage, PHOTO_ROUTE, photoSrc } from './image-hosts'

describe('photoSrc / decodePhotoKey', () => {
  const urls = [
    'https://rbcm.ca/images/hero.jpg',
    'https://images.squarespace-cdn.com/content/v1/abc/def+ghi/1600w/photo.jpg?format=2500w',
    'https://www.uvic.ca/legacy/assets/photos/Été%20à%20la%20galerie.png',
    'https://static.wixstatic.com/media/a_b~mv2.jpg/v1/fill/w_980,h_654/a_b~mv2.jpg',
  ]

  it('round-trips a URL through a single path segment', () => {
    for (const url of urls) {
      const src = photoSrc(url)
      expect(src.startsWith(`${PHOTO_ROUTE}/`)).toBe(true)
      const key = src.slice(PHOTO_ROUTE.length + 1)
      expect(key).toMatch(/^[A-Za-z0-9_-]+$/)
      expect(key).not.toContain('/')
      expect(decodePhotoKey(key)).toBe(url)
    }
  })

  it('refuses a key it did not make', () => {
    expect(decodePhotoKey('')).toBeNull()
    expect(decodePhotoKey('not/base64url')).toBeNull()
    expect(decodePhotoKey('%2Fetc%2Fpasswd')).toBeNull()
  })
})

describe('isRenderableImage', () => {
  it('accepts an allowlisted https host only', () => {
    expect(isRenderableImage('https://rbcm.ca/a.jpg')).toBe(true)
    expect(isRenderableImage('http://rbcm.ca/a.jpg')).toBe(false)
    expect(isRenderableImage('https://evil.example/a.jpg')).toBe(false)
    expect(isRenderableImage('https://rbcm.ca.evil.example/a.jpg')).toBe(false)
    expect(isRenderableImage(null)).toBe(false)
  })
})
