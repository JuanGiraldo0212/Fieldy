/*
  Every host the catalog's photographs are served from.

  ONE list, read by two places that must never disagree:

    - next.config.ts, as the `remotePatterns` allowlist for the image optimizer
    - VenueThumb, to decide whether an image is renderable at all

  Why an allowlist and not a wildcard: `next/image` would otherwise proxy any
  URL that reached the database, which makes our optimizer an open proxy for
  anyone who can get a string into the catalog.

  Why VenueThumb checks it too: `next/image` THROWS on an unconfigured host,
  during render, before any onError handler can catch it. One new venue whose
  photos sit somewhere new would take down the whole catalog page. Checking here
  turns that into an initials tile for one card.

  Keeping it current: `pnpm import:catalog` fails loudly when a record carries a
  host that is not in this list, and prints the line to paste. It is checked at
  import rather than at render because import is where a human is watching.
*/
export const IMAGE_HOSTS = [
  'aggv.ca',
  'bcam.net',
  'bcarchives.ca',
  'beaconhillchildrensfarm.ca',
  'butchartgardens.com',
  'cdn.intelligencebank.com',
  'conservancy.bc.ca',
  'discoverthepast.com',
  'dq5pwpg1q8ru0.cloudfront.net',
  'flyingsquirrelsports.ca',
  'gvpl.ca',
  'heritageacresbc.ca',
  'i0.wp.com',
  'images.squarespace-cdn.com',
  'ltgov.bc.ca',
  'navalandmilitarymuseum.org',
  'pcweb2.azureedge.net',
  'rbcm.ca',
  'thecastle.ca',
  'victoriahighlandgames.com',
  'www.carrhouse.org',
  'www.fgpaddle.com',
  'www.gofishbc.com',
  'www.gvshof.ca',
  'www.hatleypark.ca',
  'www.victoria.ca',
] as const

const ALLOWED = new Set<string>(IMAGE_HOSTS)

/* A URL we can hand to next/image without it throwing. */
export function isRenderableImage(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    /* http on an https page is mixed content the browser blocks anyway. */
    return u.protocol === 'https:' && ALLOWED.has(u.hostname)
  } catch {
    return false
  }
}

export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}
