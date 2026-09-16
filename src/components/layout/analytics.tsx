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

  Nothing renders — the component only injects the script tag — so it sits at
  the end of <body> in the root layout with the JSON-LD.
*/
export function Analytics() {
  return (
    <VercelAnalytics
      beforeSend={(event) => ({ ...event, url: pathOf(event.url) })}
    />
  )
}

// The pathname alone, with any query string and hash cut off. The URL arrives
// absolute; a relative base keeps `new URL` from throwing if it ever is not.
function pathOf(url: string): string {
  try {
    return new URL(url, 'https://www.fieldy.ca').pathname
  } catch {
    return url.split(/[?#]/)[0] ?? url
  }
}
