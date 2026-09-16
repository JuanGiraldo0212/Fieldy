import type { NextConfig } from 'next'
import { PHOTO_ROUTE } from './src/lib/catalog/image-hosts'

/*
  Catalog photographs are the venues' own, published on their own public sites.
  We render them credited (see docs/decisions.md), and through next/image rather
  than hotlinking, which means:

    - they are fetched and cached by our server, not by every visitor's browser,
      so we are not spending seventy venues' bandwidth on our traffic
    - a visitor's browser never contacts seventy third-party hosts, which
      would leak who is browsing the catalog to every one of them
    - they are resized and re-encoded, so a 3 MB hero does not land on a phone

  The venue hosts are NOT listed here as `remotePatterns`: Next caps that list
  at 50 and the catalog is past it. Instead every photograph's `src` is a path
  on our own origin, `/api/photo/<key>`, and that route holds the allowlist
  (src/lib/catalog/image-hosts.ts). `localPatterns` pins the optimizer to that
  one route, so it cannot be pointed at anything else on the site either.
*/
const nextConfig: NextConfig = {
  // Catalog and program pages must render usefully without JS (plan section 8),
  // because links get opened inside messaging apps' browsers.
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: `${PHOTO_ROUTE}/**`, search: '' }],
    /*
      Vercel bills one image transformation per unique source photograph,
      width, quality and format, and re-bills it when the cached result
      expires. Both multipliers are held down here.

      The ladder first. Next's default is fifteen widths, up to 3840, and a
      component that passes `sizes` can have a browser pick any of them. The
      largest photograph this site optimizes is a 260px strip tile, so the
      widths above 1200 were only ever a way to spend the quota — a phone
      picking 2048 for a thumbnail costs exactly as much as a hero would.
      Everything the catalog asks for now lands on one of seven:

        - 128 and 256 for the 104px catalog thumbnail
        - 384 and 640 for the 200px strip tile and the admin tile, which are
          deliberately given the same intrinsic width so the admin screens
          reuse the transformations the catalog has already paid for
        - 96, 828 and 1200 as headroom

      Raising the ceiling later is free; lowering it is not, because changing
      a width changes the cache key and every photograph still in circulation
      is transformed afresh. Budget for that before touching this list.
    */
    imageSizes: [96, 128, 256, 384],
    deviceSizes: [640, 828, 1200],
    /*
      Then the expiry. Venue photographs change about never, so there is no
      reason to buy the same transformation again every week. 31 days is the
      longest Vercel honours. The proxy route's own `s-maxage` has to agree:
      Next takes whichever of the two is LARGER, so a shorter header there
      would quietly cap this (src/app/api/photo/[key]/route.ts).
    */
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  experimental: {
    serverActions: {
      // Default is 1 MB, which no photograph fits. Files reach us through
      // server actions — a follow-up's attachments (10 MB each, 25 MB
      // together, src/lib/email/uploads.ts) and admin photo uploads (same
      // per-file cap) — so the body limit sits just above the larger total.
      bodySizeLimit: '30mb',
    },
  },
}

export default nextConfig
