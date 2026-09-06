/*
  Where the app tells the outside world it lives.

  Two callers, two needs. Mail we send from a job has no request to look at, so
  it can only use the configured value. Mail we send from a request could use
  the request's own host — and should, on a preview deploy, so a link sent from
  a preview comes back to that preview. But on production the request host is
  not canonical: fieldy.ca 308s to www, and the deployment also answers on
  fieldy-three.vercel.app, so a login started there would mail a vercel link.
  Production therefore pins the configured site and ignores the host.
*/

const FALLBACK = 'http://localhost:3000'

/** The canonical origin, no trailing slash. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  return (configured || FALLBACK).replace(/\/+$/, '')
}

/*
  The origin to put in a link we are mailing in response to this request.

  Supabase only honours an emailRedirectTo that is on the project's Redirect
  URLs allow-list; anything else is silently replaced with the project's Site
  URL. A link that arrives pointing somewhere unexpected is that list being
  wrong, not this function — Authentication → URL Configuration in the
  dashboard.
*/
export function requestOrigin(h: { get(name: string): string | null }): string {
  if (process.env.VERCEL_ENV === 'production') return siteUrl()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}
