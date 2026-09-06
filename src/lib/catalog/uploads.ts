import { createAdminClient } from '@/lib/supabase/server'
import { storageConfigured } from '@/lib/email/storage'
import { CATALOG_BUCKET } from './photos'

/*
  The storage calls behind admin photo uploads. Server only — this reaches
  for the service-role client. Everything that can be said without a
  connection (what is allowed, how it is keyed, what its URL is) is in
  photos.ts, so the browser can import that half.

  Modelled on src/lib/email/storage.ts: a failed call is a returned error,
  not a throw, because a photo that will not store is a bad minute and an
  admin page that will not render is a worse one.
*/

export async function putPhoto(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!storageConfigured()) {
    return { ok: false, error: 'Storage is not configured on this server.' }
  }
  try {
    const { error } = await createAdminClient()
      .storage.from(CATALOG_BUCKET)
      .upload(key, body, { contentType, upsert: false })
    return error ? { ok: false, error: error.message } : { ok: true }
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : 'upload failed',
    }
  }
}

/* Best effort: a row without its object is the case worth avoiding, so the
   caller deletes the object first and the row only after. */
export async function removePhoto(key: string): Promise<boolean> {
  if (!storageConfigured()) return false
  try {
    const { error } = await createAdminClient().storage.from(CATALOG_BUCKET).remove([key])
    return !error
  } catch {
    return false
  }
}
