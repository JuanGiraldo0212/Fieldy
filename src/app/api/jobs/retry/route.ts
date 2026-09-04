import { runRetries } from '@/lib/jobs/retry'

/*
  The cron endpoint. Plan §2: a pg_cron job in Supabase calls this every five
  minutes to push through anything the relay could not deliver first time.

  It is on the public internet, so it is behind a shared secret. Without one
  anybody could make us re-send every stuck request in the table on demand,
  which is both a way to spend our daily email quota and a way to mail a venue
  repeatedly.

  POST only. A GET that changes things is a URL a crawler can pull.
*/

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[retry] CRON_SECRET is not set — refusing to run')
    return json({ error: 'not configured' }, 500)
  }

  const offered = request.headers.get('authorization')
  if (offered !== `Bearer ${secret}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  try {
    const report = await runRetries()
    /* One line per tick, so a growing backlog is visible in the logs without
       anybody having to query for it. */
    console.info(
      `[retry] sends ${report.sends.recovered}/${report.sends.attempted}, notifications ${report.notifications.recovered}/${report.notifications.attempted}${report.skipped ? ` (skipped: ${report.skipped})` : ''}`,
    )
    return json(report, 200)
  } catch (cause) {
    console.error(
      `[retry] failed: ${cause instanceof Error ? cause.message : cause}`,
    )
    return json({ error: 'retry run failed' }, 500)
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
