'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
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
*/

export type MapPin = {
  lat: number
  lng: number
  name: string
  caption: string
}

const HOME_COLOR = '#16202B' // --color-map-pin-home
const VENUE_COLOR = '#1668D6' // --color-map-pin-venue

function pinIcon(color: string, glyph: string) {
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
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    const map = L.map(ref.current, {
      scrollWheelZoom: false, // the page scrolls; the map should not steal it
      zoomControl: true,
    })
    mapRef.current = map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const points: [number, number][] = []

    L.marker([home.lat, home.lng], { icon: pinIcon(HOME_COLOR, '◉') })
      .addTo(map)
      .bindPopup(`<b>You start here</b><br>${homeLabel}`)
    points.push([home.lat, home.lng])

    for (const p of pins) {
      L.marker([p.lat, p.lng], { icon: pinIcon(VENUE_COLOR, '★') })
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

    return () => {
      map.remove()
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
