import { decodePhotoKey, isRenderableImage } from '@/lib/catalog/image-hosts'

/*
  The catalog's photograph proxy.

  next/image fetches its sources through the optimizer, and the optimizer only
  accepts remote hosts named in `images.remotePatterns` — which Next caps at
  50. The catalog's photographs sit on 77 venue websites and counting, so the
  allowlist could not live there. It lives here instead: every photograph's
  `src` is `/api/photo/<key>`, a path on our own origin, and this handler is
  where the host is checked before a single byte is fetched.

  What this keeps from the original design (docs/decisions.md):

    - Proxy, not hotlink. A visitor's browser talks to us; we talk to the venue.
      Nobody's browser contacts seventy venue domains, and no venue learns who
      is browsing the catalog.
    - An allowlist, not a wildcard. The key is the photograph's URL, so anyone
      can construct one — but only a host in IMAGE_HOSTS (or our own Supabase
      project) is fetched. Everything else is a 400. Redirects are followed and
      the FINAL host is checked too, so an allowlisted site cannot bounce us to
      one that is not.
    - Photographs only. A response that is not `image/*` is refused, so a venue
      page that has replaced its hero with an HTML 404 does not get cached and
      served as one.

  The optimizer sits in front of this route, resizes what comes back, and caches
  it for `minimumCacheTTL` (next.config.ts); the Cache-Control here is for the
  CDN and the optimizer's own revalidation, not the browser directly.
*/

const UPSTREAM_TIMEOUT_MS = 15_000

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params
  const url = decodePhotoKey(key)
  if (!url || !isRenderableImage(url)) {
    return new Response('Not a catalog photograph', { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      headers: {
        Accept: 'image/*',
        'User-Agent': 'Fieldy/0.1 (catalog photographs; https://fieldy.ca)',
      },
    })
  } catch {
    return new Response('Photograph unreachable', { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Photograph unavailable', { status: 502 })
  }
  /* The site we asked may have redirected somewhere we did not allow. */
  if (!isRenderableImage(upstream.url)) {
    return new Response('Photograph moved off an allowed host', { status: 502 })
  }
  const type = upstream.headers.get('content-type') ?? ''
  if (!type.startsWith('image/')) {
    return new Response('Not an image', { status: 415 })
  }

  const headers = new Headers({
    'Content-Type': type,
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff',
  })
  const length = upstream.headers.get('content-length')
  if (length) headers.set('Content-Length', length)

  return new Response(upstream.body, { status: 200, headers })
}
