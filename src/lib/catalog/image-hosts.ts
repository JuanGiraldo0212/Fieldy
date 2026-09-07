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
  'admin.discoverparks.ca',
  'aggv.ca',
  'assets.hollywoodbowlgroup.co.uk',
  'baf35f149b6429664f25.cdn6.editmysite.com',
  'bcam.net',
  'bcarchives.ca',
  'bcforestdiscoverycentre.com',
  'beaconhillchildrensfarm.ca',
  'butchartgardens.com',
  'butterflygardens.com',
  'canadianindigenousart.com',
  'cdn.intelligencebank.com',
  'cdn.onc-prod.intergalactic.space',
  'cdn.sanity.io',
  'chemainustheatrefestival.ca',
  'coastsalishjourney.com',
  'conservancy.bc.ca',
  'cvrd.ca',
  'd932ee93f57e0124e6d8.cdn6.editmysite.com',
  'discoverthepast.com',
  'dq5pwpg1q8ru0.cloudfront.net',
  'duncan.ca',
  'excellentframeworks.ca',
  'flyingsquirrelsports.ca',
  'glaskrafter.ca',
  'gvpl.ca',
  'hcp.ca',
  'heathergoldminc.store',
  'heritageacresbc.ca',
  'i0.wp.com',
  'images.squarespace-cdn.com',
  'imaxvictoria.com',
  'img1.wsimg.com',
  'irp.cdn-website.com',
  'kelpreef.com',
  'ladysmitharts.ca',
  'ltgov.bc.ca',
  'maryfoxpottery.ca',
  'metchosinmuseum.ca',
  'militarymuseum.ca',
  'miniatureworld.com',
  'missa.ca',
  'mmbc.bc.ca',
  'nanaimoartgallery.ca',
  'nanaimomuseum.ca',
  'navalandmilitarymuseum.org',
  'nrs.objectstore.gov.bc.ca',
  'oldcem.bc.ca',
  'orcaspirit.com',
  'pcweb2.azureedge.net',
  'pointellicehouse.com',
  'rbcm.ca',
  'shop.oceanriver.com',
  'sidneymuseum.ca',
  'sookeregionmuseum.ca',
  'static.wixstatic.com',
  'theavenuegallery.com',
  'thecastle.ca',
  'tntpaintball.com',
  'vancouverislandy.com',
  'victoriahighlandgames.com',
  'www.carrhouse.org',
  'www.cowichanestuary.ca',
  'www.fgpaddle.com',
  'www.gofishbc.com',
  'www.gvshof.ca',
  'www.hatleypark.ca',
  'www.ladysmithhistoricalsociety.ca',
  'www.leg.bc.ca',
  'www.lyndiaterregallery.com',
  'www.morrellnaturesanctuary.ca',
  'www.nationaltoymuseumcanada.ca',
  'www.porttheatre.com',
  'www.royalroads.ca',
  'www.salts.ca',
  'www.uvic.ca',
  'www.victoria.ca',
] as const

const ALLOWED = new Set<string>(IMAGE_HOSTS)

/*
  The one host that is not a venue's: our own Supabase project, where the
  photographs a venue hands us are stored (the public `catalog` bucket, see
  src/lib/catalog/uploads.ts). Derived from the env rather than listed, so
  the local, preview and production projects each allow their own. NEXT_PUBLIC_
  values are inlined at build time, so this works in the browser too.
*/
export function uploadHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

/* A URL we can hand to next/image without it throwing. */
export function isRenderableImage(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    /* http on an https page is mixed content the browser blocks anyway. */
    if (u.protocol !== 'https:') return false
    return ALLOWED.has(u.hostname) || u.hostname === uploadHost()
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
