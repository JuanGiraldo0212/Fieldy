/*
  Coordinate backfill for the catalog.

  venue-extraction-prompt.md STEP 2c already specifies how coordinates are
  obtained, in order of preference:

    1. site_embed      the site publishes them (JSON-LD GeoCoordinates, a Maps
                       iframe, og:latitude). On-domain facts, the best source.
    2. geocoded        no published coordinates, but a full street address.
    3. null            no address either. Honest, and left alone.

  and it anticipates this script: "If no geocoding service is available in the
  run environment ... set geo_source to `geocode_pending` so the records can be
  backfilled in one pass later without re-reading the sites."

  This is that pass. It only ever touches records marked `geocode_pending`, so
  it can never overwrite a better `site_embed` coordinate.

  The prompt's hard rule is kept: "Never hand-place a pin from a landmark, a
  city name, or your own knowledge of where a place is. A city-centroid
  coordinate is worse than null: it puts the venue on the map in the wrong spot
  with no visible warning, whereas null is honest." So a result that is merely
  a city, region or province is REJECTED and the record stays null.

  Providers, in order of what is configured:
    MAPBOX_TOKEN         Mapbox Geocoding (plan section 2 already needs this
                         token for room and centre addresses)
    otherwise            Nominatim / OpenStreetMap — free, no key, and we are
                         already on OSM tiles for the maps. Rate limited to one
                         request per second per their usage policy.

  Usage:
    pnpm geocode:catalog             geocode and write back to outputs/*.json
    pnpm geocode:catalog --dry-run   look up and report, write nothing
*/

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const CATALOG_DIR = 'outputs'
const dryRun = process.argv.includes('--dry-run')

/* Same bounding box validate_v2.py checks against. A result outside Vancouver
   Island and the lower coast is a geocoder mistake, not a venue. */
const BBOX = { minLat: 48.0, maxLat: 51.5, minLng: -128.5, maxLng: -122.5 }

/* Nominatim place types that mean "we only found the general area". Accepting
   one of these would put a pin in the middle of Victoria with no warning. */
const TOO_COARSE = new Set([
  'city',
  'town',
  'village',
  'hamlet',
  'suburb',
  'municipality',
  'county',
  'region',
  'state',
  'province',
  'country',
  'postcode',
])

type Hit = { lat: number; lng: number; label: string; precision: string }

const round5 = (n: number) => Math.round(n * 1e5) / 1e5

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/*
  Progressively looser phrasings of the same question. Order matters: the most
  specific first, so a street-address match always beats a name match.
*/
function buildQueries(address: string, name: string): string[] {
  const out = [address]

  // Canadian postcode: "V8M 1J8". Nominatim often finds nothing with it.
  const noPostcode = address.replace(/,?\s*[A-Z]\d[A-Z]\s*\d[A-Z]\d\s*$/i, '').trim()
  if (noPostcode !== address) out.push(noPostcode)

  /*
    Designation suffixes defeat the index. "Butchart Gardens – National
    Historic Site" finds nothing; "Butchart Gardens" finds the garden. Same for
    "Craigflower Manor and School House – National Historic Sites of Canada".
    Strip anything after an en dash, em dash or spaced hyphen.
  */
  const shortName = name.split(/\s+[–—-]\s+/)[0]!.trim()

  const parts = noPostcode.split(',').map((p) => p.trim()).filter(Boolean)

  // "110 Island Highway, View Royal" — street and locality, no venue prefix.
  if (parts.length >= 2) {
    const street = parts[0]!
    const locality = parts[1]!
    if (/\d/.test(street)) out.push(`${street}, ${locality}`)
    out.push(`${shortName}, ${locality}`)
    if (shortName !== name) out.push(`${name}, ${locality}`)
  }

  out.push(`${shortName}, British Columbia, Canada`)

  return [...new Set(out)]
}

async function geocodeNominatim(address: string): Promise<Hit | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', address)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('countrycodes', 'ca')

  const res = await fetch(url, {
    headers: {
      // Nominatim's usage policy requires an identifying User-Agent.
      'User-Agent': 'Fieldy/0.1 (catalog geocoder; https://github.com/JuanGiraldo0212/Fieldy)',
    },
  })
  if (!res.ok) throw new Error(`Nominatim ${res.status}`)
  const results = (await res.json()) as {
    lat: string
    lon: string
    display_name: string
    addresstype?: string
    type?: string
    address?: Record<string, string>
  }[]

  const r = results[0]
  if (!r) return null

  const precision = r.addresstype ?? r.type ?? 'unknown'
  if (TOO_COARSE.has(precision)) return null

  /*
    A bare road match is a street, not a place. "100 Cook Street, Victoria"
    returns three separate segments of Cook Street two kilometres apart, none
    with a house number, and picking one of them is a guess wearing a
    coordinate's clothing. Only accept a road when the house number matched.
  */
  if (precision === 'road' && !r.address?.house_number) return null

  return {
    lat: round5(Number(r.lat)),
    lng: round5(Number(r.lon)),
    label: r.display_name,
    precision,
  }
}

async function geocodeMapbox(address: string, token: string): Promise<Hit | null> {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.searchParams.set('q', address)
  url.searchParams.set('country', 'ca')
  url.searchParams.set('limit', '1')
  url.searchParams.set('access_token', token)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Mapbox ${res.status}`)
  const json = (await res.json()) as {
    features: {
      geometry: { coordinates: [number, number] }
      properties: { full_address?: string; name?: string; feature_type?: string }
    }[]
  }

  const f = json.features[0]
  if (!f) return null

  const precision = f.properties.feature_type ?? 'unknown'
  if (TOO_COARSE.has(precision)) return null

  const [lng, lat] = f.geometry.coordinates
  return {
    lat: round5(lat),
    lng: round5(lng),
    label: f.properties.full_address ?? f.properties.name ?? address,
    precision,
  }
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

const mapboxToken = process.env.MAPBOX_TOKEN
const provider = mapboxToken ? 'mapbox' : 'nominatim'
console.log(`\nGeocoding with ${provider}${dryRun ? ' (dry run)' : ''}\n`)

const files = readdirSync(CATALOG_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()

let filled = 0
let rejected = 0
let noAddress = 0
let alreadySet = 0
const needsAddress: string[] = []

for (const file of files) {
  const path = join(CATALOG_DIR, file)
  const raw = readFileSync(path, 'utf8')
  const data = JSON.parse(raw)
  const v = data.venue

  if (v.lat != null && v.lng != null) {
    alreadySet++
    continue
  }

  if (!v.address) {
    noAddress++
    needsAddress.push(`${v.id} — ${v.name}`)
    continue
  }

  /*
    A ladder, not a single shot. Nominatim matches literally: the full address
    with a postcode often returns nothing at all, while the same address
    without it, or the venue's own name, resolves cleanly — it indexes named
    places well ("Crag X Climbing Centre", "The Teahouse at Abkhazi Garden").
    Every rung is still subject to the precision and bounding-box checks, so a
    later rung is a different phrasing of the question, never a lower bar.
  */
  const queries = buildQueries(v.address, v.name)

  let hit: Hit | null = null
  let usedQuery = ''
  try {
    for (const q of queries) {
      hit = mapboxToken
        ? await geocodeMapbox(q, mapboxToken)
        : await geocodeNominatim(q)
      if (provider === 'nominatim') await sleep(1100)
      if (hit) {
        usedQuery = q
        break
      }
    }
  } catch (e) {
    console.log(`  ✗ ${v.id}\n      ${(e as Error).message}`)
    rejected++
    continue
  }

  if (!hit) {
    console.log(`  ✗ ${v.id}`)
    console.log(`      no precise match after ${queries.length} phrasings — left null rather than guessing`)
    rejected++
    continue
  }

  if (
    hit.lat < BBOX.minLat ||
    hit.lat > BBOX.maxLat ||
    hit.lng < BBOX.minLng ||
    hit.lng > BBOX.maxLng
  ) {
    console.log(
      `  ✗ ${v.id}\n      ${hit.lat}, ${hit.lng} is outside Vancouver Island — rejected\n      "${hit.label}"`,
    )
    rejected++
    continue
  }

  console.log(`  ✓ ${v.id}`)
  console.log(`      ${hit.lat}, ${hit.lng}  (${hit.precision})`)
  console.log(`      ${hit.label.slice(0, 88)}`)
  if (usedQuery !== v.address) console.log(`      matched on: "${usedQuery}"`)

  if (!dryRun) {
    /*
      Rewrite the three fields in place, preserving key order and formatting so
      the diff is three lines per venue rather than a whole-file reformat.
    */
    let next = raw
      .replace(/"lat":\s*null/, `"lat": ${hit.lat}`)
      .replace(/"lng":\s*null/, `"lng": ${hit.lng}`)
      .replace(/"geo_source":\s*"geocode_pending"/, '"geo_source": "geocoded"')

    if (next === raw) {
      // Fall back to a structural write if the shape was not what we expected.
      v.lat = hit.lat
      v.lng = hit.lng
      v.geo_source = 'geocoded'
      next = JSON.stringify(data, null, 2) + '\n'
    }
    writeFileSync(path, next)
  }

  filled++
}

console.log(`\n${filled} geocoded, ${rejected} rejected, ${noAddress} have no address, ${alreadySet} already had coordinates.`)

if (needsAddress.length) {
  console.log(`\nNo address published — these cannot be geocoded and must be filled by hand.`)
  console.log(`A city-centroid guess would be worse than null: it puts a pin in the`)
  console.log(`wrong place with no visible warning.\n`)
  for (const n of needsAddress) console.log(`  ${n}`)
}

if (!dryRun && filled > 0) {
  console.log(`\nNext: pnpm import:catalog`)
}
console.log()
