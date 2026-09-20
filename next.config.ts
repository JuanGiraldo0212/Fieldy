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
    - they are resized and re-encoded — when the optimizer is on, which as of
      2026-09-20 it is not; see `unoptimized` below

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
    /*
      The optimizer is OFF (2026-09-20).

      Vercel meters image transformations, the month's allowance ran out, and
      every `/_next/image` request started coming back `402` with
      `x-vercel-error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`. The failure
      is total rather than graceful: not a larger file, a broken image on
      every card in the catalog.

      `unoptimized` makes next/image render the `src` it is given verbatim, so
      a photograph is fetched straight from /api/photo/<key>. Nothing that the
      proxy is there for changes — our server still fetches the venue's file,
      the allowlist still gates it, no visitor's browser contacts seventy
      venue domains. What is given up is the resize and the re-encode: a phone
      now receives the venue's original bytes for a 104px tile. That is spent
      in bandwidth, which is not metered the way transformations are, and the
      route's 31-day `s-maxage` keeps the CDN answering rather than the venue.

      To put the optimizer back: delete this one line, having first bought the
      quota for it. Everything below is kept correct for that day and is inert
      until then — `unoptimized` skips srcset generation, so the width ladder
      is never consulted and `minimumCacheTTL` has no cache to govern.
    */
    unoptimized: true,
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
