import { createAdminClient } from '@/lib/supabase/server'

/*
  The private `mail` bucket. Plan §2 and §5.4 steps 3 and 5.

  Two things live here and nothing else: the raw inbound email as JSON under
  `raw/<trip_id>/<ulid>.json`, and attachments under
  `att/<trip_id>/<ulid>/<name>`. Both are private, both are reached through
  signed URLs minted at render time, and the raw copies are deleted after 90
  days by a pg_cron job (plan M6) while the message rows they belong to stay.

  Why keep the raw message at all, when `body_full` already has the text: a
  stripping bug, a threading question, or a venue disputing what they sent are
  all answered by the bytes that actually arrived, and none of them are
  answerable by a column we derived from those bytes.
*/

const BUCKET = 'mail'

/* An hour is long enough to read a PDF and short enough that a copied URL is
   not a permanent hole in a private bucket. */
const SIGNED_URL_TTL_SECONDS = 3600

export function storageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  )
}

export function rawKey(tripId: string, id: string): string {
  return `raw/${tripId}/${id}.json`
}

export function attachmentKey(
  tripId: string,
  id: string,
  filename: string,
): string {
  return `att/${tripId}/${id}/${safeName(filename)}`
}

/*
  Object keys are path-like, so a filename is the one place a venue's mail
  client gets to write into our key space. Strip anything that could climb out
  of the prefix or confuse a storage backend, and keep the extension, which is
  what tells a browser how to open it.
*/
export function safeName(filename: string): string {
  const cleaned = filename
    .replace(/[\\/]/g, '-')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 120)
  return cleaned || 'attachment'
}

export async function putObject(
  key: string,
  body: Uint8Array | string,
  contentType: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!storageConfigured()) {
    return { ok: false, error: 'Storage is not configured.' }
  }
  try {
    const { error } = await createAdminClient()
      .storage.from(BUCKET)
      .upload(key, body, { contentType, upsert: true })
    return error ? { ok: false, error: error.message } : { ok: true }
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : 'upload failed',
    }
  }
}

/*
  Null rather than a throw when signing fails. An attachment chip that cannot
  be opened is a bad afternoon; a trip page that will not render because one
  object key went missing is a worse one.
*/
export async function signedUrl(key: string): Promise<string | null> {
  if (!storageConfigured()) return null
  try {
    const { data, error } = await createAdminClient()
      .storage.from(BUCKET)
      .createSignedUrl(key, SIGNED_URL_TTL_SECONDS)
    return error ? null : (data?.signedUrl ?? null)
  } catch {
    return null
  }
}
