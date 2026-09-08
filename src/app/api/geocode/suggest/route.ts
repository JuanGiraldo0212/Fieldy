import { NextResponse } from 'next/server'
import { queriesFor } from '@/lib/catalog/geocode'

/*
  Address suggestions for the room and centre forms.

  Proxied through us rather than called from the browser, for three reasons:
  Nominatim's usage policy wants one identifying User-Agent and one request a
  second, which we can only honour from one place; a director's browser should
  not be telling OpenStreetMap where her daycare is; and it keeps the Mapbox
  token server-side when there is one.

  Results carry their own coordinates, so picking a suggestion means we never
  geocode the string again. That matters: re-geocoding could return a different
  point from the one she chose, and she would have no way of knowing.
*/

/* Bias toward Greater Victoria without excluding the rest of the island. */
const VIEWBOX = '-123.9,48.3,-123.1,48.75'
const BBOX = { minLat: 48.0, maxLat: 51.5, minLng: -128.5, maxLng: -122.5 }

/*
  A suggestion has to be somewhere you could actually stand. Nominatim happily
  answers a half-typed street with the SUBURB it sits in, and offering
  "Fairfield" as a pickable address would put a home base in the middle of a
  neighbourhood with a confirmed tick beside it. That is the city-centroid
  problem the geocoder refuses everywhere else, so refuse it here too.
*/
const TOO_COARSE = new Set([
  'city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood', 'quarter',
  'municipality', 'county', 'region', 'state', 'province', 'country',
  'postcode', 'residential',
])

export type Suggestion = {
  label: string
  lat: number
  lng: number
}

/* One a second per Nominatim's policy, shared across everyone using this
   instance. A queue rather than a rejection: a director typing an address
   should never be told to slow down. */
let lastCall = 0
async function politeDelay() {
  /* No one is being polite to under vitest, and the ladder's tests would
     otherwise spend a real second on every rung they assert. */
  if (process.env.VITEST) return
  const since = Date.now() - lastCall
  if (since < 1100) await new Promise((r) => setTimeout(r, 1100 - since))
  lastCall = Date.now()
}

async function viaNominatim(q: string): Promise<Suggestion[]> {
  await politeDelay()
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '6')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('countrycodes', 'ca')
  url.searchParams.set('viewbox', VIEWBOX)

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Fieldy/0.1 (address autocomplete)' },
    signal: AbortSignal.timeout(6000),
  })
  if (!res.ok) return []

  const rows = (await res.json()) as {
    lat: string
    lon: string
    display_name: string
    name?: string
    addresstype?: string
    type?: string
    address?: Record<string, string>
  }[]

  return rows
    .filter((r) => !TOO_COARSE.has(r.addresstype ?? r.type ?? ''))
    .map((r) => {
      const a = r.address ?? {}
      /* Nominatim's display_name is a long comma-separated tail that ends in
         "Canada" and includes the regional district nobody says out loud.
         Rebuild something a director would actually write on a form. */
      const street = [a.house_number, a.road].filter(Boolean).join(' ')
      const place = r.name && r.name !== street ? r.name : null
      const city = a.city ?? a.town ?? a.village ?? a.municipality
      const head = [place, street].filter(Boolean).join(', ')
      const label = [head || street || place, city, a.state, a.postcode]
        .filter(Boolean)
        .join(', ')
      return {
        label: label || r.display_name.replace(/, Canada$/, ''),
        lat: Number(r.lat),
        lng: Number(r.lon),
      }
    })
    .filter(
      (s) =>
        s.lat >= BBOX.minLat && s.lat <= BBOX.maxLat &&
        s.lng >= BBOX.minLng && s.lng <= BBOX.maxLng,
    )
}

async function viaMapbox(q: string, token: string): Promise<Suggestion[]> {
  const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
  url.searchParams.set('q', q)
  url.searchParams.set('country', 'ca')
  url.searchParams.set('limit', '6')
  url.searchParams.set('proximity', '-123.3656,48.4284')
  url.searchParams.set('access_token', token)

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) return []
  const json = (await res.json()) as {
    features: {
      geometry: { coordinates: [number, number] }
      properties: { full_address?: string; name?: string }
    }[]
  }
  return json.features
    .map((f) => ({
      label: f.properties.full_address ?? f.properties.name ?? q,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
    }))
    .filter(
      (s) =>
        s.lat >= BBOX.minLat && s.lat <= BBOX.maxLat &&
        s.lng >= BBOX.minLng && s.lng <= BBOX.maxLng,
    )
}

/*
  The same ladder the submit-time geocoder climbs, for the same reason: a
  four-part address with a postcode matches nothing at Nominatim while its
  street and locality match exactly, so a director who types her whole address
  correctly is the one who gets an empty list. Rungs are tried in order and
  the first that answers wins, so a street match always beats a name match.

  Capped, because every Nominatim call waits its turn behind politeDelay, and
  the cap is four rather than three so the first name rung is inside it: a
  full address with a postcode already spends three rungs on phrasings of the
  address itself, and cutting the ladder there would drop the only rung that
  answers for a place like Butchart Gardens. The cost is paid only when every
  rung misses; the first rung is the typed text, which answers almost always.
*/
const MAX_RUNGS = 4

async function ladder(
  q: string,
  name: string | undefined,
  token: string | undefined,
): Promise<Suggestion[]> {
  for (const rung of queriesFor(q, name).slice(0, MAX_RUNGS)) {
    const hits = token ? await viaMapbox(rung, token) : await viaNominatim(rung)
    if (hits.length) return hits
  }
  return []
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const q = params.get('q')?.trim() ?? ''
  /* Two characters match half of Victoria; it wastes their quota and ours. */
  if (q.length < 3) return NextResponse.json({ suggestions: [] })

  /* The venue form knows what the place is called and OpenStreetMap often
     knows the name when it does not know the address: "800 Benvenuto Avenue,
     Brentwood Bay" is nothing, "Butchart Gardens, Brentwood Bay" is the
     garden. A room or centre address has no name to send and sends none. */
  const name = params.get('name')?.trim().slice(0, 200) || undefined

  try {
    const suggestions = await ladder(q, name, process.env.MAPBOX_TOKEN)
    return NextResponse.json({ suggestions })
  } catch {
    /* A dead geocoder must not block the form. The field stays typeable and
       the server geocodes the text on submit, exactly as it did before. */
    return NextResponse.json({ suggestions: [] })
  }
}
