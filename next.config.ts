import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Catalog and program pages must render usefully without JS (plan section 8),
  // because links get opened inside messaging apps' browsers.
  reactStrictMode: true,
}

export default nextConfig
