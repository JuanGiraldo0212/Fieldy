import type { Point } from './distance'

/*
  Address to coordinates, for a centre, a room or a catalog venue.

  Same provider as scripts/geocode-catalog.ts, and the same refusal to accept a
  city centroid: a home base in the middle of Victoria would silently
  mis-measure every distance in the catalog.

  It differs from the catalog geocoder in one place, deliberately. There, a
  bare `road` match is rejected, because "100 Cook Street" returns three
  segments of Cook Street two kilometres apart and picking one is a guess. Here
  the DIRECTOR typed the address, house number and all, so a road match tells
  us the street is right and only the house is missing from the map data, which
  is true of much of Victoria. A point on the correct street is a few hundred
  metres out; refusing a perfectly good address and asking her to type it again
  is worse, and she has no better one to give.

  So: a road match is accepted only when the input carried a house number.

  Mapbox when MAPBOX_TOKEN is set, otherwise Nominatim, which needs no key and
  is what the catalog itself was geocoded with.
*/

/* "1148 Fairfield Rd" yes, "Fairfield Rd" no. */
function hasHouseNumber(address: string): boolean {
  return /^\s*\d+[a-z]?\b/i.test(address.trim())
}

const TOO_COARSE = new Set([
  'city', 'town', 'village', 'hamlet', 'suburb', 'municipality',
  'county', 'region', 'state', 'province', 'country', 'postcode',
])

/* Vancouver Island and the lower coast. A result outside it is the geocoder
   finding a same-named street in Ontario, not the centre. */
const BBOX = { minLat: 48.0, maxLat: 51.5, minLng: -128.5, maxLng: -122.5 }

function inRegion(p: Point): boolean {
  return (
    p.lat >= BBOX.minLat && p.lat <= BBOX.maxLat &&
    p.lng >= BBOX.minLng && p.lng <= BBOX.maxLng
  )
}

async function viaNominatim(
  address: string,
  original: string,
): Promise<Point | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', address)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('countrycodes', 'ca')

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Fieldy/0.1 (centre geocoder)' },
    /* A slow geocoder should not hold up a form submission forever. */
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null

  const rows = (await res.json()) as {
    lat: string
    lon: string
    addresstype?: string
    type?: string
    address?: Record<string, string>
  }[]
  const r = rows[0]
  if (!r) return null

  const precision = r.addresstype ?? r.type ?? 'unknown'
  if (TOO_COARSE.has(precision)) return null
  if (precision === 'road' && !r.address?.house_number && !hasHouseNumber(original)) {
    return null
  }

  return { lat: Number(r.lat), lng: Number(r.lon) }
}

async function viaMapbox(
  address: string,
  token: string,
  original: string,
): Promise<Point | null> {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.searchParams.set('q', address)
  url.searchParams.set('country', 'ca')
  url.searchParams.set('limit', '1')
  url.searchParams.set('access_token', token)

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return null

  const json = (await res.json()) as {
    features: {
      geometry: { coordinates: [number, number] }
      properties: { feature_type?: string }
    }[]
  }
  const f = json.features[0]
  if (!f) return null
  const kind = f.properties.feature_type ?? ''
  if (TOO_COARSE.has(kind)) return null
  if (kind === 'street' && !hasHouseNumber(original)) return null

  const [lng, lat] = f.geometry.coordinates
  return { lat, lng }
}

/*
  Progressively looser phrasings, most specific first. Nominatim matches
  literally: an address with a postcode often returns nothing at all, while the
  same address without one resolves cleanly, and a four-part address matches
  nothing while its street and locality match exactly. Every rung faces the
  same precision and region checks, so a later rung is a rephrasing of the
  question, never a lower bar.

  The name rungs are the ladder scripts/geocode-catalog.ts already climbs, and
  they are why the catalog has coordinates the address alone cannot find:
  "800 Benvenuto Avenue, Brentwood Bay" is unknown to OpenStreetMap, while
  "Butchart Gardens, Brentwood Bay" returns the garden. A venue is a named
  place; a director's home base is not, so the caller passes a name only when
  there is one. Designation suffixes defeat the index the same way there as
  here — "Butchart Gardens – National Historic Site" finds nothing — so
  anything after a dash is dropped first.
*/
export function queriesFor(address: string, name?: string): string[] {
  const out = [address]
  const noPostcode = address
    .replace(/,?\s*[A-Z]\d[A-Z]\s*\d[A-Z]\d\s*$/i, '')
    .trim()
  if (noPostcode !== address) out.push(noPostcode)

  const parts = noPostcode.split(',').map((p) => p.trim()).filter(Boolean)
  const street = parts[0]
  const locality = parts[1]
  if (street && locality && /\d/.test(street)) out.push(`${street}, ${locality}`)

  const shortName = name?.split(/\s+[–—-]\s+/)[0]?.trim()
  if (shortName) {
    if (locality) {
      out.push(`${shortName}, ${locality}`)
      if (name !== shortName) out.push(`${name}, ${locality}`)
    }
    out.push(`${shortName}, British Columbia, Canada`)
  }

  if (!/(bc|british columbia)/i.test(address)) {
    out.push(`${noPostcode}, British Columbia`)
  }
  return [...new Set(out)]
}

/*
  `name` is the venue's, when the caller has one. It only ever adds rungs to
  the ladder; every rung still has to survive the precision and region checks,
  so a name can never place a pin the address checks would have refused.
*/
export async function geocodeAddress(
  address: string,
  name?: string,
): Promise<Point | null> {
  const token = process.env.MAPBOX_TOKEN
  try {
    for (const q of queriesFor(address, name)) {
      const hit = token
        ? await viaMapbox(q, token, address)
        : await viaNominatim(q, address)
      if (hit && inRegion(hit)) return hit
    }
    return null
  } catch {
    /* Timed out or the provider is down. Null means "ask again", which is the
       right answer: guessing a coordinate here would poison every distance. */
    return null
  }
}

/*
  Coordinates that came from the address picker.

  The browser sends the point the director actually chose from the list, which
  is better than re-geocoding her text: a second lookup can return a different
  result, and she would have no way of knowing the pin moved.

  They are still checked. Not because a forged pair is much of an attack — it
  would only misplace that person's own home base — but because a malformed or
  out-of-region pair would quietly break every distance on her catalog, and
  falling back to geocoding the text is strictly better than storing nonsense.
*/
export function pickedPoint(
  lat: FormDataEntryValue | null,
  lng: FormDataEntryValue | null,
): Point | null {
  if (lat == null || lng == null) return null
  const p = { lat: Number(lat), lng: Number(lng) }
  if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return null
  if (!inRegion(p)) return null
  return p
}
