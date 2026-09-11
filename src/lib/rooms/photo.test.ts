import { describe, expect, it } from 'vitest'
import {
  ROOM_PHOTO_MAX_BYTES,
  checkRoomPhoto,
  mimeOfKey,
  photoIdOfKey,
  roomPhotoKey,
  roomPhotoSrc,
} from './photo'

describe('checkRoomPhoto', () => {
  it('accepts a JPEG, PNG or WebP', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(checkRoomPhoto({ name: 'g', size: 1024, type })).toEqual({ ok: true })
    }
  })

  it('refuses anything else, by type not by name', () => {
    const r = checkRoomPhoto({ name: 'group.jpg', size: 10, type: 'image/svg+xml' })
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining('JPEG, PNG or WebP') })
  })

  it('refuses an empty file and one over the cap', () => {
    expect(checkRoomPhoto({ name: 'g.jpg', size: 0, type: 'image/jpeg' })).toMatchObject({ ok: false })
    expect(
      checkRoomPhoto({ name: 'g.jpg', size: ROOM_PHOTO_MAX_BYTES + 1, type: 'image/jpeg' }),
    ).toMatchObject({ ok: false, error: expect.stringContaining('2 MB') })
  })
})

describe('keys and paths', () => {
  it('keys a photo under its centre and room, by type', () => {
    expect(roomPhotoKey('c1', 'r1', 'p1', 'image/webp')).toBe('c1/r1/p1.webp')
  })

  it('reads the photo id and type back out of a key', () => {
    const key = roomPhotoKey('c1', 'r1', '01JABC', 'image/jpeg')
    expect(photoIdOfKey(key)).toBe('01JABC')
    expect(mimeOfKey(key)).toBe('image/jpeg')
    expect(mimeOfKey('c1/r1/p1.exe')).toBe('application/octet-stream')
  })

  it('serves from a path that changes with the photo', () => {
    expect(roomPhotoSrc('r1', 'c1/r1/p1.jpg')).toBe('/api/room-photo/r1/p1')
    expect(roomPhotoSrc('r1', 'c1/r1/p2.jpg')).toBe('/api/room-photo/r1/p2')
    expect(roomPhotoSrc('r1', null)).toBeNull()
  })
})
