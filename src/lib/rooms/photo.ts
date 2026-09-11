import type { UploadCheck, UploadLike } from '@/lib/email/uploads'

/*
  A room's group photo. The pure half: what may be uploaded, how it is keyed,
  and the path it is shown from. The storage calls are in photo-storage.ts,
  which is server only; this file is imported by the room dialog too.

  A picture of a room is a picture of children, so it is nothing like a
  catalog photograph. It lives in the private `rooms` bucket (migration 0011),
  never behind a public URL, and is read back through
  /api/room-photo/<roomId>/<photoId>, which only answers someone signed in to
  the centre that owns the room.

  The photo id is in the path so the browser can cache one forever: changing
  the photo changes the id, and the old path stops answering.

  The dialog shrinks and re-encodes the picture before it is sent
  (ROOM_PHOTO_EDGE), which also drops the EXIF block a phone writes, location
  included. The server still checks type and size, because the POST does not
  have to come from the dialog.
*/

export const ROOM_PHOTO_BUCKET = 'rooms'

export const ROOM_PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const MIME_OF_EXT: Record<string, string> = Object.fromEntries(
  Object.entries(ROOM_PHOTO_TYPES).map(([mime, ext]) => [ext, mime]),
)

/* The avatar is 56px; 800 on the long edge leaves room for a larger view
   later and still lands around 100 KB as a JPEG. */
export const ROOM_PHOTO_EDGE = 800

/* Far above what the dialog sends, well below a phone's original. */
export const ROOM_PHOTO_MAX_BYTES = 2 * 1024 * 1024

export function checkRoomPhoto(f: UploadLike): UploadCheck {
  if (!ROOM_PHOTO_TYPES[f.type]) {
    return { ok: false, error: 'The group photo has to be a JPEG, PNG or WebP.' }
  }
  if (f.size === 0) return { ok: false, error: 'That photo is empty.' }
  if (f.size > ROOM_PHOTO_MAX_BYTES) {
    return { ok: false, error: 'That photo is over 2 MB. Choose a smaller one.' }
  }
  return { ok: true }
}

export function roomPhotoKey(
  centreId: string,
  roomId: string,
  photoId: string,
  mime: string,
): string {
  return `${centreId}/${roomId}/${photoId}.${ROOM_PHOTO_TYPES[mime] ?? 'bin'}`
}

/* The last segment of a key, without its extension. */
export function photoIdOfKey(key: string): string {
  const file = key.slice(key.lastIndexOf('/') + 1)
  const dot = file.lastIndexOf('.')
  return dot > 0 ? file.slice(0, dot) : file
}

export function mimeOfKey(key: string): string {
  const ext = key.slice(key.lastIndexOf('.') + 1).toLowerCase()
  return MIME_OF_EXT[ext] ?? 'application/octet-stream'
}

export function roomPhotoSrc(roomId: string, key: string | null): string | null {
  return key ? `/api/room-photo/${roomId}/${photoIdOfKey(key)}` : null
}
