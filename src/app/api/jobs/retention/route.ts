import { runRetention } from '@/lib/jobs/retention'

/*
  The retention endpoint. Plan M6. pg_cron calls this once a day to delete
  raw inbound email older than 90 days; the same bearer secret as
  /api/jobs/retry, for the same reason — it is on the public internet and it
  deletes things.

  POST only. A GET that deletes is a URL a crawler can pull.
*/

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[retention] CRON_SECRET is not set — refusing to run')
    return json({ error: 'not configured' }, 500)
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  try {
    const report = await runRetention()
    console.info(
      `[retention] removed ${report.deleted}/${report.candidates}, ${report.failed} failed${report.skipped ? ` (skipped: ${report.skipped})` : ''}`,
    )
    return json(report, 200)
  } catch (cause) {
    console.error(`[retention] failed: ${cause instanceof Error ? cause.message : cause}`)
    return json({ error: 'retention run failed' }, 500)
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
