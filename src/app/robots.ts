import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

/*
  What crawlers may read. The catalog and the outing pages are the product's
  public face and the whole point of being indexed; everything behind a login
  is one person's trips and mail, and a crawler that reaches it only sees the
  login redirect anyway. Listing those paths keeps the crawl budget on the
  211 pages that matter.

  The private pages also carry a noindex in their own metadata, so a link to
  one that leaks into a search index is dropped even if this file is ignored.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/account',
        '/inbox',
        '/trips',
        '/rooms',
        '/welcome',
        '/login',
        '/plan/',
        '/saved',
        '/dev/',
        '/api/',
        '/auth/',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
