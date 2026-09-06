'use client'

import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'
import { useEffect, useRef } from 'react'

/*
  The catalog map. Ported from `venue-map-bright.html` in the design.

  Deviation worth naming: the design embeds this as an iframe loading Leaflet
  from unpkg, because the prototype had no build step. Here it is a client
  component using the leaflet npm package — same map, same pins, same tiles,
  but no runtime dependency on a CDN and no iframe to keep in sync with the
  page's own state. Logged in docs/design-gaps.md.

  One pin per distinct venue coordinate. Programs that come to you have no pin,
  because there is nowhere to put one.

  Leaflet is imported INSIDE the effect, not at the top of the file. It reads
  `window` while its own module is evaluating, so a static import cannot be
  evaluated on the server at all — and "use client" does not save it, because a
  client component is still prerendered. That threw during SSR and every page
  rendering a map answered 500 while streaming perfectly good HTML, which is
  why the pages looked fine and only the server log knew. `ssr: false` is the
  usual answer and is not available to us: both callers are Server Components,
  where next/dynamic rejects it (next/dist/docs/01-app/02-guides/lazy-loading).

  The type import above is erased at compile time, so it costs no evaluation.
  The stylesheet is inert on the server and stays at the top.
*/

export type MapPin = {
  lat: number
  lng: number
  name: string
  caption: string
}

const HOME_COLOR = '#16202B' // --color-map-pin-home
const VENUE_COLOR = '#1668D6' // --color-map-pin-venue

function pinIcon(L: typeof Leaflet, color: string, glyph: string) {
  return L.divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:999px;
      font-weight:700;font-size:13px;color:#fff;
      background:${color};border:2px solid #fff;
      box-shadow:0 2px 6px rgba(22,32,43,0.3);
    ">${glyph}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  })
}

export function CatalogMap({
  home,
  homeLabel,
  pins,
}: {
  home: { lat: number; lng: number }
  homeLabel: string
  pins: MapPin[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    /* The import is a promise, so this effect can be cleaned up before Leaflet
       has arrived. `cancelled` covers that window: without it a fast unmount
       leaves a map bound to a detached node and nothing left to remove it. */
    let cancelled = false

    void import('leaflet').then(({ default: L }) => {
      const el = ref.current
      if (cancelled || !el || mapRef.current) return

      const map = L.map(el, {
        scrollWheelZoom: false, // the page scrolls; the map should not steal it
        zoomControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      const points: [number, number][] = []

      L.marker([home.lat, home.lng], { icon: pinIcon(L, HOME_COLOR, '◉') })
        .addTo(map)
        .bindPopup(`<b>You start here</b><br>${homeLabel}`)
      points.push([home.lat, home.lng])

      for (const p of pins) {
        L.marker([p.lat, p.lng], { icon: pinIcon(L, VENUE_COLOR, '★') })
          .addTo(map)
          .bindPopup(`<b>${p.name}</b>${p.caption ? `<br>${p.caption}` : ''}`)
        points.push([p.lat, p.lng])
      }

      /* A dashed line only when there is exactly one venue to draw it to.
         With twenty pins it would be a scribble. */
      if (pins.length === 1 && pins[0]) {
        L.polyline(
          [
            [home.lat, home.lng],
            [pins[0].lat, pins[0].lng],
          ],
          { color: VENUE_COLOR, weight: 2, dashArray: '6 6', opacity: 0.8 },
        ).addTo(map)
      }

      if (points.length > 1) {
        map.fitBounds(points, { padding: [46, 46], maxZoom: 15 })
      } else {
        map.setView(points[0] ?? [48.4284, -123.3656], 13)
      }
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [home, homeLabel, pins])

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Map of the outings in this list"
      className="bg-map-canvas rounded-card h-[340px] w-full overflow-hidden"
    />
  )
}
