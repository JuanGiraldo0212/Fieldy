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
    // Venue photos change rarely; a long cache spares their servers.
    minimumCacheTTL: 60 * 60 * 24 * 7,
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
