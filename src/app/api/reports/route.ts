import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, report } from '@/db'
import { newId } from '@/lib/ids'
import { clientIp, hitRateLimit, limitKey } from '@/lib/rate-limit'

/*
  Data correction reports. Spec §5.2: "Data freshness line: 'Details checked on
  <date>. Something wrong? Tell us.' One tap opens the report form."

  Anonymous is allowed on purpose. The catalog is only trustworthy if correcting
  it is one tap, and requiring a login to tell us we are wrong would mean we
  mostly do not get told.
*/

const reportSchema = z.object({
  program_id: z.string().min(1).max(200),
  venue_id: z.string().min(1).max(200),
  /* Which fact is wrong, when the reporter picked one. */
  field: z.string().max(80).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
})

/* Five reports a minute from one client. Durable, across instances and
   deploys — see src/lib/rate-limit.ts. */
const RULE = { max: 5, windowSeconds: 60 }

export async function POST(request: Request) {
  const limit = await hitRateLimit(
    limitKey('report-ip', clientIp(request.headers)),
    RULE,
  )
  if (limit.limited) {
    return NextResponse.json(
      { error: 'Too many reports. Try again in a minute.' },
      { status: 429, headers: { 'retry-after': String(limit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'We could not read that. Try again.' }, { status: 400 })
  }

  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    /* The form's own controls keep the lengths in range, so anything that
       lands here is malformed rather than mistyped. Zod's wording for it
       ("String must contain at most 2000 character(s)") goes straight into a
       banner the reporter reads, so it does not get to speak. */
    return NextResponse.json(
      { error: 'That report did not come through. Try again.' },
      { status: 400 },
    )
  }

  const { program_id, venue_id, field, note } = parsed.data

  /* A report with neither a field nor a note tells us nothing actionable. */
  if (!field && !note?.trim()) {
    return NextResponse.json(
      { error: 'Say what is wrong, or pick which detail.' },
      { status: 400 },
    )
  }

  try {
    await db.insert(report).values({
      id: newId(),
      programId: program_id,
      venueId: venue_id,
      accountId: null,
      field: field ?? null,
      note: note?.trim() || null,
      status: 'new',
    })
  } catch {
    /* Do not echo the database error back: it would leak schema detail to an
       unauthenticated caller. Plan section 8 — log ids and outcomes only. */
    console.error('report insert failed', { program_id, venue_id })
    return NextResponse.json({ error: 'Could not save that' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
