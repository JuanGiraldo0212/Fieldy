'use client'

import { Analytics as VercelAnalytics } from '@vercel/analytics/next'

/*
  Vercel Web Analytics: how many people reach the catalog, which outings they
  open, where they stop. Cookieless and without a device identifier, so it
  needs no consent banner, and it is Vercel — already the host named in the
  privacy page — so it adds no processor that does not already see these URLs.

  What it must not learn is what a director typed. The catalog keeps its
  search in the query string (?q=, ?grade=), and a search is the closest
  thing this product has to a private thought. `beforeSend` drops the query
  from every event, so the report says "/" and "/outing/goldstream", never
  the words someone was looking for. Returning null there would drop the
  event entirely; we want the pageview, just not the tail of the URL.

  The URL has to stay absolute. The collector rejects a bare pathname with a
  400 and the pageview is simply lost, so this trims the query and the hash
  off the href rather than replacing it with `pathname`.

  Nothing renders — the component only injects the script tag — so it sits at
  the end of <body> in the root layout with the JSON-LD.
*/
export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event) => ({ ...event, url: withoutQuery(event.url) })}
    />
  )
}

// Same URL, minus the query string and the fragment. The href arrives
// absolute; a base keeps `new URL` from throwing if it ever does not, and a
// URL we cannot parse is cut at the first `?` or `#` rather than sent whole.
function withoutQuery(url: string): string {
  try {
    const parsed = new URL(url, 'https://www.fieldy.ca')
    parsed.search = ''
    parsed.hash = ''
    return parsed.href
  } catch {
    return url.split(/[?#]/)[0] ?? url
  }
}
