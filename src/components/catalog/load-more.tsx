'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { loadMoreOutings } from '@/app/catalog-actions'

/*
  The bottom of the catalog list. Three states, in order of what the visitor
  has:

  1. No JavaScript: a link, "Show the other N outings", which reloads the
     same search with everything rendered. It is in the server HTML, so a
     text-message browser that never runs a script still gets the whole
     catalog.
  2. JavaScript, before anything is loaded: the same words as a button, plus
     a sentinel. When the sentinel scrolls into view the next batch is
     fetched and appended; the button is for anyone who would rather tap,
     and for screen readers, which do not scroll.
  3. Everything loaded: nothing. A list that has ended should look ended.

  Batches come back as rendered cards from a server action, so the cards
  appended here are the same component, computed from the same search, as
  the forty the page arrived with.
*/
export function LoadMore({
  params,
  offset,
  remaining: initialRemaining,
  fallbackHref,
}: {
  params: Record<string, string>
  offset: number
  remaining: number
  fallbackHref: string
}) {
  const [batches, setBatches] = useState<React.ReactNode[]>([])
  const [next, setNext] = useState(offset)
  const [remaining, setRemaining] = useState(initialRemaining)
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)
  const [enhanced, setEnhanced] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const inFlight = useRef(false)

  useEffect(() => setEnhanced(true), [])

  const load = () => {
    if (inFlight.current || remaining === 0) return
    inFlight.current = true
    startTransition(async () => {
      try {
        const r = await loadMoreOutings({ params, offset: next })
        setBatches((b) => [...b, r.cards])
        setNext(r.nextOffset)
        setRemaining(r.remaining)
        setFailed(false)
      } catch {
        setFailed(true)
      } finally {
        inFlight.current = false
      }
    })
  }

  useEffect(() => {
    const el = sentinel.current
    if (!el || remaining === 0 || failed) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) load()
      },
      /* Start fetching a screen early, so the join is not a visible wait. */
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, next, failed])

  return (
    <>
      {batches.length > 0 ? <div className="mt-3 grid gap-3">{batches}</div> : null}

      {remaining > 0 ? (
        <div ref={sentinel} className="mt-5 text-center">
          {enhanced ? (
            <button
              type="button"
              onClick={load}
              disabled={pending}
              className="border-border-strong bg-surface hover:border-brand text-body-sm inline-block rounded-pill border px-5 py-3 font-bold disabled:opacity-60"
            >
              {pending
                ? 'Loading…'
                : failed
                  ? 'That did not load. Try again'
                  : `Show the other ${remaining} outing${remaining === 1 ? '' : 's'}`}
            </button>
          ) : (
            <a
              href={fallbackHref}
              className="border-border-strong bg-surface hover:border-brand text-body-sm inline-block rounded-pill border px-5 py-3 font-bold no-underline"
            >
              Show the other {remaining} outing{remaining === 1 ? '' : 's'}
            </a>
          )}
        </div>
      ) : null}
    </>
  )
}
