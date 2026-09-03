'use client'

import Image from 'next/image'
import { useState } from 'react'

/*
  A venue photograph, with the initials tile as its fallback.

  Client-side because these URLs point at thirteen venues' own websites, and
  those rot: a venue redesigns, a CDN path changes, an image 404s. A broken
  image icon on every card would be worse than the tile we already have, so an
  error swaps back to it silently.

  next/image, not a raw <img>: see next.config.ts for why.
*/
export function VenueThumb({
  src,
  alt,
  initials,
  caption,
}: {
  src: string | null
  alt: string
  initials: string
  caption?: string
}) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={alt}
        width={104}
        height={104}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        // The thumbnail is 104px; ask for a little more for retina.
        sizes="104px"
      />
    )
  }

  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
      <span className="font-display text-price text-brand font-semibold">
        {initials}
      </span>
      {caption ? (
        <span className="text-eyebrow text-text-muted uppercase">{caption}</span>
      ) : null}
    </span>
  )
}
