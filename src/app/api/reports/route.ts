import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, report } from '@/db'
import { newId } from '@/lib/ids'

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

/*
  A crude per-IP limiter. In-memory, so it resets on deploy and does not span
  instances — it stops someone holding down a button, not a determined flood.
  Plan M6 replaces it with something durable; until then this is the difference
  between a nuisance and a full table.
*/
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  /* Keep the map from growing without bound on a long-lived instance. */
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k)
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many reports. Try again in a minute.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected JSON' }, { status: 400 })
  }

  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid report' },
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
