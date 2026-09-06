import { afterEach, describe, expect, it } from 'vitest'
import { checkPhotos, photoKey, photoKeyOfUrl, publicPhotoUrl } from './photos'

const jpeg = (name = 'a.jpg', size = 1024) => ({ name, size, type: 'image/jpeg' })

describe('checkPhotos', () => {
  it('accepts a few photographs', () => {
    expect(checkPhotos([jpeg(), { name: 'b.png', size: 10, type: 'image/png' }])).toEqual({ ok: true })
  })

  it('wants at least one', () => {
    expect(checkPhotos([])).toMatchObject({ ok: false })
  })

  it('refuses anything that is not a JPEG, PNG or WebP, by type not by name', () => {
    const r = checkPhotos([{ name: 'photo.jpg', size: 10, type: 'application/pdf' }])
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining('not a JPEG') })
  })

  it('refuses an empty file and one over 10 MB', () => {
    expect(checkPhotos([jpeg('e.jpg', 0)])).toMatchObject({ ok: false, error: expect.stringContaining('empty') })
    expect(checkPhotos([jpeg('big.jpg', 11 * 1024 * 1024)])).toMatchObject({ ok: false, error: expect.stringContaining('10 MB') })
  })

  it('caps a batch', () => {
    expect(checkPhotos(Array.from({ length: 9 }, (_, i) => jpeg(`${i}.jpg`)))).toMatchObject({ ok: false })
  })
})

describe('keys and urls', () => {
  const prior = process.env.NEXT_PUBLIC_SUPABASE_URL
  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = prior
  })

  it('keys by venue and id with the extension the type implies', () => {
    expect(photoKey('bc-archives', '01ABC', 'image/webp')).toBe('venues/bc-archives/01ABC.webp')
  })

  it('round-trips a public url back to its key, and refuses other hosts', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co/'
    const key = 'venues/bc-archives/01ABC.jpg'
    const url = publicPhotoUrl(key)
    expect(url).toBe('https://example.supabase.co/storage/v1/object/public/catalog/venues/bc-archives/01ABC.jpg')
    expect(photoKeyOfUrl(url)).toBe(key)
    expect(photoKeyOfUrl('https://bcarchives.ca/x.jpg')).toBeNull()
  })
})
