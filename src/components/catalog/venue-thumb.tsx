'use client'

import Image from 'next/image'
import { useState } from 'react'
import { isRenderableImage, photoSrc } from '@/lib/catalog/image-hosts'
import { Skeleton } from '@/components/ui'

/*
  A venue photograph, with the initials tile as its fallback.

  Client-side because these URLs point at thirteen venues' own websites, and
  those rot: a venue redesigns, a CDN path changes, an image 404s. A broken
  image icon on every card would be worse than the tile we already have, so an
  error swaps back to it silently.

  next/image, not a raw <img>: see next.config.ts for why.

  The host is checked BEFORE rendering, not caught after. The photograph is
  fetched through our own proxy route (photoSrc), which refuses a host that is
  not allowlisted — so an unknown host would otherwise cost a request and land
  as a broken image. Checked here, it falls back to the tile with no request
  made, exactly like a broken image would.

  While the photograph is in flight a skeleton fills the frame. It sits BEHIND
  the image rather than in place of it: the image paints over it the moment it
  arrives, so nothing here depends on JavaScript to reveal the photograph — the
  catalog and outing pages must read without it (next.config.ts).
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
  const [settled, setSettled] = useState(false)

  if (src && !failed && isRenderableImage(src)) {
    return (
      <>
        {settled ? null : <Skeleton className="absolute inset-0" />}
        <Image
          src={photoSrc(src)}
          alt={alt}
          width={104}
          height={104}
          className="relative h-full w-full object-cover"
          /* next/image calls onLoad even when the browser had the photograph
             cached and finished before hydration, so the skeleton always
             stops. */
          onLoad={() => setSettled(true)}
          onError={() => {
            setSettled(true)
            setFailed(true)
          }}
          // The thumbnail is 104px; ask for a little more for retina.
          sizes="104px"
        />
      </>
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
