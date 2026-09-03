import type { NextConfig } from 'next'
import { IMAGE_HOSTS } from './src/lib/catalog/image-hosts'

/*
  Catalog photographs are the venues' own, published on their own public sites.
  We render them credited (see docs/decisions.md), and through next/image rather
  than hotlinking, which means:

    - they are fetched and cached by our server, not by every visitor's browser,
      so we are not spending two dozen venues' bandwidth on our traffic
    - a visitor's browser never contacts two dozen third-party hosts, which
      would leak who is browsing the catalog to every one of them
    - they are resized and re-encoded, so a 3 MB hero does not land on a phone

  The host list lives in src/lib/catalog/image-hosts.ts because VenueThumb has
  to read the same list: next/image throws on an unconfigured host, so the
  component checks before rendering rather than letting one new venue crash the
  catalog.
*/
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
