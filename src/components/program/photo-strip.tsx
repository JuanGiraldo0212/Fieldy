'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { isRenderableImage } from '@/lib/catalog/image-hosts'
import { cx, Skeleton } from '@/components/ui'

/*
  The photo strip, and the viewer it opens.

  Not in the design (docs/design-gaps.md). Three thumbnails at 200px do not tell
  a director whether a space suits her group, which is the whole reason the
  section exists, so tapping one opens it properly.

  Built on a native <dialog>. It gives us the focus trap, Escape, inertness of
  the page behind and the top layer for free, and all four are things a
  hand-rolled overlay gets subtly wrong.

  Eight of the thirty venues publish more than three photographs, so the strip
  shows three and the viewer walks all of them rather than quietly dropping the
  rest.

  Every photograph here is remote and optimized on demand, so each one gets a
  skeleton while it is in flight — see Thumb and ViewerImage below.
*/

export type Photo = {
  id: string
  url: string
  alt: string
  caption: string | null
}

export function PhotoStrip({
  photos,
  venueName,
}: {
  photos: Photo[]
  venueName: string
}) {
  const usable = photos.filter((p) => isRenderableImage(p.url))
  const [openAt, setOpenAt] = useState<number | null>(null)

  if (usable.length === 0) return null

  const strip = usable.slice(0, 3)
  const extra = usable.length - strip.length

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {strip.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenAt(i)}
            aria-label={`View photo: ${p.alt}`}
            className="bg-thumb group relative h-[200px] min-w-0 overflow-hidden rounded-card"
          >
            <Thumb photo={p} />
            {/* The last tile carries the rest, rather than silently dropping
                photographs a venue took the trouble to publish. */}
            {extra > 0 && i === strip.length - 1 ? (
              <span className="text-body-sm absolute inset-0 flex items-center justify-center bg-[rgb(22_32_43_/_0.55)] font-bold text-white">
                +{extra} more
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {openAt !== null ? (
        <Viewer
          /* A fresh instance per open, so the index resets to the tile that
             was actually tapped rather than resuming where the last visit
             left off. */
          key={openAt}
          photos={usable}
          startAt={openAt}
          venueName={venueName}
          onClose={() => setOpenAt(null)}
        />
      ) : null}
    </>
  )
}

/*
  One strip tile.

  The photographs come off the venues' own servers through our image optimizer,
  and on a cold cache that is the slowest thing on the page — several seconds
  for a hero a venue never resized. A skeleton holds each frame so the outing
  reads immediately instead of opening onto three empty boxes.

  The skeleton sits behind the image, not in place of it: a `fill` image is
  absolutely positioned over it and simply paints on top when it arrives, so
  nothing about showing the photograph depends on JavaScript.
*/
function Thumb({ photo }: { photo: Photo }) {
  const [settled, setSettled] = useState(false)

  return (
    <>
      {settled ? null : <Skeleton className="absolute inset-0" />}
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        sizes="(max-width: 640px) 50vw, 260px"
        className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        /* next/image fires onLoad even when the browser had the photograph
           cached and finished before hydration. On an error the alt text takes
           over, so the skeleton stops pulsing there too. */
        onLoad={() => setSettled(true)}
        onError={() => setSettled(true)}
      />
    </>
  )
}

/*
  The full-size photograph in the viewer.

  Mounted with a key of the photo id, so walking to the next one brings its own
  skeleton back rather than holding the previous photograph on screen while a
  new one downloads.

  Here the skeleton does take the image's place — it has to, because the
  intrinsic size is unknown until the photograph lands, so there is no box for a
  backdrop to fill. `hidden` rather than an unmount: the browser still fetches a
  display:none image, and unmounting would restart the download.
*/
function ViewerImage({ photo }: { photo: Photo }) {
  const [settled, setSettled] = useState(false)

  return (
    <>
      {settled ? null : (
        <Skeleton tone="dark" className="h-[60vh] w-full max-w-[900px] rounded-card" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.alt}
        onLoad={() => setSettled(true)}
        onError={() => setSettled(true)}
        className={cx(
          'max-h-[74vh] w-auto max-w-full rounded-card object-contain',
          settled ? null : 'hidden',
        )}
      />
    </>
  )
}

function Viewer({
  photos,
  startAt,
  venueName,
  onClose,
}: {
  photos: Photo[]
  startAt: number
  venueName: string
  onClose: () => void
}) {
  const [i, setI] = useState(startAt)
  const ref = useRef<HTMLDialogElement>(null)
  const photo = photos[i]!

  const go = useCallback(
    (delta: number) => setI((n) => (n + delta + photos.length) % photos.length),
    [photos.length],
  )

  /*
    React state is the only source of truth for whether this is open, and the
    dialog closes by unmounting. Driving it the other way round — letting the
    element close itself and listening for `close` to sync state back — left
    the component mounted-but-closed when the event did not arrive, after which
    tapping the same thumbnail again did nothing, because nothing had changed
    for React to react to.

    So: nothing here ever calls el.close(). Every exit route calls onClose().
  */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* showModal, not the `open` attribute: only the former puts the dialog in
       the top layer, traps focus, and makes the rest of the page inert. */
    if (!el.open) el.showModal()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    }
    /* Escape fires `cancel`. Prevent the browser's own close so React does it,
       keeping one path out instead of two that can disagree. */
    const onCancel = (e: Event) => { e.preventDefault(); onClose() }

    el.addEventListener('keydown', onKey)
    el.addEventListener('cancel', onCancel)
    return () => {
      el.removeEventListener('keydown', onKey)
      el.removeEventListener('cancel', onCancel)
    }
  }, [go, onClose])

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        /* A click that lands on the dialog itself, not its content, is a
           backdrop click. */
        if (e.target === ref.current) onClose()
      }}
      aria-label={`Photographs of ${venueName}`}
      className="bg-transparent p-0 backdrop:bg-[rgb(22_32_43_/_0.72)] open:fixed open:inset-0 open:m-auto open:max-h-none open:w-full open:max-w-[min(1100px,94vw)]"
    >
      <div className="flex max-h-[92vh] flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-meta font-semibold text-white/80">
            {photos.length > 1 ? `${i + 1} of ${photos.length}` : null}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text flex h-9 w-9 items-center justify-center rounded-pill bg-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <ViewerImage key={photo.id} photo={photo} />

          {photos.length > 1 ? (
            <>
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
            </>
          ) : null}
        </div>

        {/* The alt text is a real description of the photograph, so it doubles
            as the caption. Credit sits here because this is the one place the
            photograph is shown at full size. */}
        <figcaption className="text-meta text-white/85">
          {photo.caption ?? photo.alt}
          <span className="block text-white/60">From {venueName}&rsquo;s website</span>
        </figcaption>
      </div>
    </dialog>
  )
}

function NavButton({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={cx(
        'text-text absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/90 shadow-modal hover:bg-white',
        side === 'left' ? 'left-2' : 'right-2',
      )}
    >
      {side === 'left' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  )
}
