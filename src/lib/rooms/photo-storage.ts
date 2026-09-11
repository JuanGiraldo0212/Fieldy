import { createAdminClient } from '@/lib/supabase/server'
import { storageConfigured } from '@/lib/email/storage'
import { ROOM_PHOTO_BUCKET } from './photo'

/*
  The storage calls behind a room's group photo. Server only — this reaches
  for the service-role client. The pure half is photo.ts.

  Modelled on src/lib/catalog/uploads.ts: a failed call is a returned error,
  not a throw. The error is written for the director reading it; what the
  storage service actually said goes to the log.
*/

export async function putRoomPhoto(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!storageConfigured()) {
    return { ok: false, error: 'Photo storage is not switched on for this site.' }
  }
  try {
    const { error } = await createAdminClient()
      .storage.from(ROOM_PHOTO_BUCKET)
      .upload(key, body, { contentType, upsert: false })
    if (!error) return { ok: true }
    console.error('room photo upload failed', key, error.message)
  } catch (cause) {
    console.error('room photo upload failed', key, cause)
  }
  return { ok: false, error: 'The photo did not save. Try again, or save the room without it.' }
}

export async function getRoomPhoto(key: string): Promise<Blob | null> {
  if (!storageConfigured()) return null
  try {
    const { data, error } = await createAdminClient()
      .storage.from(ROOM_PHOTO_BUCKET)
      .download(key)
    return error ? null : data
  } catch {
    return null
  }
}

/* Best effort. Called only after the row has stopped pointing at the key, so
   a failure leaves a file nobody links to, never a broken avatar. */
export async function removeRoomPhoto(key: string): Promise<void> {
  if (!storageConfigured()) return
  try {
    await createAdminClient().storage.from(ROOM_PHOTO_BUCKET).remove([key])
  } catch {
    /* nothing to do */
  }
}
