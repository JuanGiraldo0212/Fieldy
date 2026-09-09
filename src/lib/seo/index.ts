/*
  What a search engine or a link preview reads about a page.

  Titles, descriptions, canonical URLs and the structured data are computed
  here, from the same rows the page renders, so the head and the body never
  describe two different outings. The functions are pure: the page fetches,
  this file phrases.

  Why it matters: until this existed every page shipped `<title>Fieldy</title>`
  and the catalog's one-line description, so 211 program pages looked like
  211 copies of the home page. Google indexes copies reluctantly.
*/

import { siteUrl } from '@/lib/site-url'

export const SITE_NAME = 'Fieldy'

/*
  The brand name alone is not a search term anyone types for a field trip —
  and "Fieldy" is already an AI note-taker and a field-service product in
  the results. The words a director actually searches are on the right of
  the separator, on every page.
*/
export const HOME_TITLE = 'Fieldy · Field trips for Victoria BC classrooms and daycares'
export const HOME_DESCRIPTION =
  'Every school and daycare field trip around Victoria and across Vancouver Island in one place: ' +
  'prices, ages, group sizes, washrooms, bus parking. Search, then send one ' +
  'request and keep the replies together.'

export const CATEGORY_LABEL: Record<string, string> = {
  animals_farms: 'Animals and farms',
  nature_outdoors: 'Nature and outdoors',
  museums_history: 'Museums and history',
  arts_performance: 'Arts and performance',
  science: 'Science',
  community_civic: 'Community and civic',
  comes_to_you: 'Comes to you',
}

/* Absolute URL on the canonical origin, for sitemaps, canonicals and JSON-LD. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

export function outingPath(venueId: string, slug: string): string {
  return `/outing/${encodeURIComponent(venueId)}/${encodeURIComponent(slug)}`
}

/*
  Search snippets are cut at around 155 characters. The cut lands on a word
  boundary so a snippet never ends mid-word, and an ellipsis marks it as a
  cut rather than a sentence that trails off.
*/
export function clip(text: string, max = 155): string {
  const one = text.replace(/\s+/g, ' ').trim()
  if (one.length <= max) return one
  const head = one.slice(0, max - 1)
  const space = head.lastIndexOf(' ')
  return `${(space > max / 2 ? head.slice(0, space) : head).replace(/[,;:.\s]+$/, '')}…`
}

export type OutingMeta = {
  program: {
    slug: string
    name: string
    description: string | null
    whatChildrenDo: string | null
    practicalSummary: string | null
    ageBasis: 'years' | 'grades' | null
    ageMinYears: number | null
    ageMaxYears: number | null
    gradeMin: number | null
    gradeMax: number | null
    costPerChildCad: string | number | null
    costPerGroupCad: string | number | null
    isFree: boolean | null
    durationMin: number | null
    comesToYou: boolean
    active: boolean
    updatedAt: Date
  }
  venue: {
    id: string
    name: string
    category: string
    address: string | null
    lat: number | null
    lng: number | null
    website: string | null
  }
}

/*
  The town, read from the venue's own address, because the catalog reaches
  from Sooke to Campbell River and "Ladysmith Museum, Victoria BC" was what
  Google showed for a week. The city is whatever sits before "BC" or
  "British Columbia"; an address without either (a Victoria street with no
  town, or none at all) falls back to the island rather than to a guess.
*/
export function venueCity(address: string | null): string | null {
  if (!address) return null
  const m = /(?:^|,)\s*([^,]+?)\s*,?\s*(?:BC|B\.C\.|British Columbia)\b/i.exec(address)
  if (!m) return null
  /* "1 Dallas Rd. Victoria": the town follows the last full stop. */
  const part = m[1]!.split('.').pop()!.trim()
  return part.length > 1 && !/\d/.test(part) ? part : null
}

export function outingTitle(m: OutingMeta): string {
  return `${m.program.name} · ${m.venue.name}`
}

function ageClause(p: OutingMeta['program']): string | null {
  if (p.ageBasis === 'grades') {
    if (p.gradeMin == null || p.gradeMax == null) return null
    return `grades ${p.gradeMin === 0 ? 'K' : p.gradeMin} to ${p.gradeMax}`
  }
  if (p.ageMinYears == null) return null
  return p.ageMaxYears == null
    ? `ages ${p.ageMinYears} and up`
    : `ages ${p.ageMinYears} to ${p.ageMaxYears}`
}

function costClause(p: OutingMeta['program']): string | null {
  const child = p.costPerChildCad == null ? null : Number(p.costPerChildCad)
  const group = p.costPerGroupCad == null ? null : Number(p.costPerGroupCad)
  if (p.isFree || child === 0) return 'free'
  if (group != null) return `$${group % 1 ? group.toFixed(2) : group} per group`
  if (child != null) return `$${child % 1 ? child.toFixed(2) : child} a child`
  return null
}

/*
  The description is the search snippet, and it is written from the facts a
  director scans a card for — where, who it is for, what it costs — before
  any prose, because the prose is what the page is for and the snippet is
  what decides whether she opens it.
*/
export function outingDescription(m: OutingMeta): string {
  const { program: p, venue: v } = m
  const city = venueCity(v.address)
  const where = p.comesToYou
    ? `${v.name} comes to your classroom`
    : `${v.name}, ${city ? `${city} BC` : 'Vancouver Island BC'}`
  const facts = [ageClause(p), costClause(p)].filter(Boolean).join(', ')
  const lead = facts ? `${where}. ${capitalise(facts)}.` : `${where}.`
  const prose = p.description ?? p.whatChildrenDo ?? p.practicalSummary ?? ''
  return clip(prose ? `${lead} ${prose}` : lead)
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/*
  Structured data for one outing. schema.org has no "field trip" type. An
  Event needs a date and these run on request; a TouristAttraction is a
  place, not a program; EducationalOccupationalProgram is for degrees. The
  closest shape that validates and that Google reads is a Service provided
  by an Organization, with an Offer when a price is published and an
  audience for the age range. Nothing is invented: a null price means no
  offer, not a zero.
*/
export function outingJsonLd(m: OutingMeta) {
  const { program: p, venue: v } = m
  const url = absoluteUrl(outingPath(v.id, p.slug))
  const child = p.costPerChildCad == null ? null : Number(p.costPerChildCad)
  const group = p.costPerGroupCad == null ? null : Number(p.costPerGroupCad)

  const provider: Record<string, unknown> = {
    '@type': 'Organization',
    name: v.name,
  }
  if (v.website) provider.url = v.website
  if (v.address) provider.address = v.address
  if (v.lat != null && v.lng != null) {
    provider.location = {
      '@type': 'Place',
      name: v.name,
      geo: { '@type': 'GeoCoordinates', latitude: v.lat, longitude: v.lng },
    }
  }

  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: p.name,
    description: outingDescription(m),
    url,
    serviceType: 'Field trip',
    category: CATEGORY_LABEL[v.category] ?? v.category,
    areaServed: { '@type': 'City', name: 'Victoria', containedInPlace: 'British Columbia' },
    provider,
  }

  if (p.ageMinYears != null || p.ageMaxYears != null) {
    const audience: Record<string, unknown> = { '@type': 'PeopleAudience' }
    if (p.ageMinYears != null) audience.suggestedMinAge = p.ageMinYears
    if (p.ageMaxYears != null) audience.suggestedMaxAge = p.ageMaxYears
    out.audience = audience
  }

  const price = p.isFree || child === 0 ? 0 : (child ?? group)
  if (price != null) {
    out.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: 'CAD',
      url,
      ...(group != null && child == null && price !== 0
        ? { description: 'Per group' }
        : { description: price === 0 ? 'Free' : 'Per child' }),
    }
  }

  return out
}

/*
  Serialised for a <script type="application/ld+json">. `<` is escaped so a
  venue description containing "</script>" cannot close the tag; the JSON
  still parses because < is a plain JSON escape.
*/
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon.svg'),
    description: HOME_DESCRIPTION,
    areaServed: { '@type': 'City', name: 'Victoria', containedInPlace: 'British Columbia' },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl('/')}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}
