import { and, isNotNull, lt, sql } from 'drizzle-orm'
import { db, message } from '@/db'
import { createAdminClient } from '@/lib/supabase/server'
import { storageConfigured } from '@/lib/email/storage'

/*
  Raw email retention. Plan M6: "retention of raw email (90 days, enforced
  by a pg_cron job that deletes raw/ objects older than 90 days)".

  What goes: the JSON copy of the venue's email as it arrived — headers,
  both bodies, addressing — under `raw/<trip>/<id>.json`. What stays: the
  message row, its stripped body and `body_full`, and the attachments, which
  the director may still need to open next term.

  The candidates come from `message.raw_ref`, not from listing the bucket.
  The row is the record of what we hold; an object with no row pointing at
  it is already unreachable, and a row whose object is gone must say so.
  So the row's `raw_ref` is nulled in the same pass, and only after the
  object is confirmed removed.
*/

export const RETENTION_DAYS = 90

/* A cron tick should finish inside its window even with a backlog. */
const BATCH = 200

export type RetentionReport = {
  candidates: number
  deleted: number
  failed: number
  skipped?: string
}

export async function runRetention(now = new Date()): Promise<RetentionReport> {
  if (!storageConfigured()) {
    return { candidates: 0, deleted: 0, failed: 0, skipped: 'storage is not configured' }
  }

  const cutoff = cutoffFor(now)
  const due = await db
    .select({ id: message.id, rawRef: message.rawRef })
    .from(message)
    .where(and(isNotNull(message.rawRef), lt(message.sentAt, cutoff)))
    .limit(BATCH)

  if (due.length === 0) return { candidates: 0, deleted: 0, failed: 0 }

  const storage = createAdminClient().storage.from('mail')
  let deleted = 0
  let failed = 0

  for (const row of due) {
    const key = row.rawRef!
    const { error } = await storage.remove([key])
    if (error) {
      failed++
      console.warn(`[retention] could not remove ${key}: ${error.message}`)
      continue
    }
    await db
      .update(message)
      .set({ rawRef: null })
      .where(sql`${message.id} = ${row.id}`)
    deleted++
  }

  return { candidates: due.length, deleted, failed }
}

export function cutoffFor(now: Date): Date {
  return new Date(now.getTime() - RETENTION_DAYS * 86_400_000)
}
