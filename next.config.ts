import type { NextConfig } from 'next'

/*
  Catalog photographs are the venues' own, published on their own public sites.
  We render them credited (see docs/decisions.md), and we render them through
  next/image rather than hotlinking, which means:

    - they are fetched and cached by our server, not by every visitor's browser,
      so we are not spending thirteen venues' bandwidth on our traffic
    - a visitor's browser never contacts thirteen third-party hosts, which would
      leak who is browsing the catalog to every one of them
    - they are resized and re-encoded, so a 3 MB hero does not land on a phone

  remotePatterns is an allowlist, deliberately. A wildcard would let any URL that
  ever reaches the database turn our optimizer into an open proxy. This list is
  every host in outputs/*.json; regenerate it if the catalog gains a venue whose
  images sit somewhere new — the import's diff report is the place to notice.
*/
const IMAGE_HOSTS = [
  'aggv.ca',
  'bcam.net',
  'bcarchives.ca',
  'butchartgardens.com',
  'conservancy.bc.ca',
  'discoverthepast.com',
  'dq5pwpg1q8ru0.cloudfront.net',
  'i0.wp.com',
  'images.squarespace-cdn.com',
  'navalandmilitarymuseum.org',
  'thecastle.ca',
  'victoriahighlandgames.com',
  'www.victoria.ca',
]

const nextConfig: NextConfig = {
  // Catalog and program pages must render usefully without JS (plan section 8),
  // because links get opened inside messaging apps' browsers.
  reactStrictMode: true,
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
    // Venue photos change rarely; a long cache spares their servers.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
}

export default nextConfig
