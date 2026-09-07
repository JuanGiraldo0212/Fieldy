import type { MetadataRoute } from 'next'
import { eq } from 'drizzle-orm'
import { db, program, venue } from '@/db'
import { absoluteUrl, outingPath } from '@/lib/seo'

/*
  Every page a search engine should know about, read from the database on
  each request.

  Per request and not at build time, on purpose: the CI build runs with no
  database (ci.yml), and a program added on /admin has to reach the sitemap
  before the next deploy, not after it. Crawlers fetch this a few times a
  day; two hundred rows is nothing.

  Only active programs are listed, which is the same predicate the catalog
  uses (search.ts fetchCatalog). A deactivated program still answers on its
  URL for the trips that reference it, but nothing should invite a crawler
  there, and its own page says noindex.
*/
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select({
      venueId: program.venueId,
      slug: program.slug,
      programUpdatedAt: program.updatedAt,
      venueUpdatedAt: venue.updatedAt,
    })
    .from(program)
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(program.active, true))

  const newest = rows.reduce<Date | null>((acc, r) => {
    const d = later(r.programUpdatedAt, r.venueUpdatedAt)
    return acc == null || d > acc ? d : acc
  }, null)

  return [
    {
      url: absoluteUrl('/'),
      lastModified: newest ?? undefined,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...rows
      .sort((a, b) => a.venueId.localeCompare(b.venueId) || a.slug.localeCompare(b.slug))
      .map((r) => ({
        url: absoluteUrl(outingPath(r.venueId, r.slug)),
        lastModified: later(r.programUpdatedAt, r.venueUpdatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
  ]
}

function later(a: Date, b: Date): Date {
  return a > b ? a : b
}
