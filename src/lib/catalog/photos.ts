import { MAX_UPLOAD_BYTES, type UploadCheck, type UploadLike } from '@/lib/email/uploads'

/*
  Photographs a venue hands us, uploaded on /admin. The pure half: what may
  be uploaded, where it is keyed, and what its public URL is. The storage
  calls live in uploads.ts, which is server only; this file is imported by
  the upload form in the browser too.

  These live in the public `catalog` bucket (migration 0010) under
  `venues/<venueId>/<imageId>.<ext>`, and the image row's `url` is the plain
  public object URL, so the catalog renders them exactly like a venue-site
  photograph: through next/image, host-checked by isRenderableImage().

  This is a different case from the scraped photographs, and docs/decisions.md
  says why hosting those would be wrong. A venue that emails us a photo to use
  has supplied it; the row says so (`usage: venue_supplied`, a rights note
  naming who uploaded it and when).

  Photographs only, by MIME type and not by extension: a file called photo.jpg
  that is really a PDF would be served with the wrong type to every browser.
*/

export const CATALOG_BUCKET = 'catalog'

export const PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export const MAX_PHOTOS_PER_UPLOAD = 8

export function checkPhotos(files: UploadLike[]): UploadCheck {
  if (files.length === 0) return { ok: false, error: 'Choose at least one photo.' }
  if (files.length > MAX_PHOTOS_PER_UPLOAD) {
    return { ok: false, error: `Up to ${MAX_PHOTOS_PER_UPLOAD} photos at a time.` }
  }
  for (const f of files) {
    if (!PHOTO_TYPES[f.type]) {
      return { ok: false, error: `${f.name} is not a JPEG, PNG or WebP.` }
    }
    if (f.size === 0) return { ok: false, error: `${f.name} is empty.` }
    if (f.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: `${f.name} is over 10 MB. Resize it first.` }
    }
  }
  return { ok: true }
}

export function photoKey(venueId: string, imageId: string, mime: string): string {
  return `venues/${venueId}/${imageId}.${PHOTO_TYPES[mime] ?? 'bin'}`
}

export function publicPhotoUrl(key: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${CATALOG_BUCKET}/${key}`
}

/* The object key behind one of our own URLs; null for anyone else's. */
export function photoKeyOfUrl(url: string): string | null {
  const prefix = publicPhotoUrl('')
  return prefix && url.startsWith(prefix) ? url.slice(prefix.length) : null
}
