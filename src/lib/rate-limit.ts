import { sql } from 'drizzle-orm'
import { db } from '@/db'

/*
  A durable, fixed-window rate limit. Plan M6.

  One row per key. The statement below both reads and claims: if the row's
  window has expired it starts a new one at 1, otherwise it adds one, and
  either way it returns the count — so two requests arriving together cannot
  both see "4" and both get through as the fifth. No gap between the check
  and the claim, for the same reason `auto_response` is written that way.

  Fixed windows are coarse — a burst at the end of one window and the start
  of the next gets through twice — and that is fine here. The point is to
  stop somebody holding a button down or scripting a form, not to meter an
  API.

  Fails open. If the database is unreachable the caller has bigger problems
  than a limiter, and refusing every login because the counter is down is
  the wrong failure.
*/
export type RateLimitRule = { max: number; windowSeconds: number }

export type RateLimitResult = {
  limited: boolean
  count: number
  /* Seconds until the window resets, for the advice in the error copy. */
  retryAfterSeconds: number
}

export async function hitRateLimit(
  key: string,
  rule: RateLimitRule,
): Promise<RateLimitResult> {
  const window = `${rule.windowSeconds} seconds`
  try {
    const rows = await db.execute<{ count: number; window_start: Date | string }>(sql`
      insert into rate_limit (key, window_start, count)
      values (${key}, now(), 1)
      on conflict (key) do update set
        count = case
          when rate_limit.window_start < now() - ${window}::interval then 1
          else rate_limit.count + 1
        end,
        window_start = case
          when rate_limit.window_start < now() - ${window}::interval then now()
          else rate_limit.window_start
        end
      returning count, window_start
    `)
    const row = rows[0]
    const count = Number(row?.count ?? 1)
    const started = row?.window_start ? new Date(row.window_start).getTime() : Date.now()
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((started + rule.windowSeconds * 1000 - Date.now()) / 1000),
    )
    return { limited: count > rule.max, count, retryAfterSeconds }
  } catch (cause) {
    console.error(
      `[rate-limit] could not record a hit: ${cause instanceof Error ? cause.message : cause}`,
    )
    return { limited: false, count: 0, retryAfterSeconds: 0 }
  }
}

/* The client address as the platform reports it. "unknown" groups every
   request with no forwarding header, which is stricter, not looser. */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}

/* A key that cannot collide across uses or grow without bound. */
export function limitKey(scope: string, subject: string): string {
  return `${scope}:${subject.toLowerCase().slice(0, 200)}`
}
