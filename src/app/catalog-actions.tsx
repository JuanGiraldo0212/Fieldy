'use server'

import { z } from 'zod'
import { OutingCard } from '@/components/catalog/outing-card'
import { resolveCatalog } from '@/lib/catalog/resolve'

/*
  The next batch of catalog cards, rendered on the server. Spec §5.1 keeps
  the catalog a Server Component; this keeps the cards that arrive later
  the same component, rendered the same way, from the same search — the
  client only asks for "the ones after N" and appends what comes back.

  The search state travels as the page's own query parameters, so the
  batch is computed from exactly what the URL said and nothing else. The
  offset is the only extra input, and it is clamped.
*/

const BATCH = 40

const inputSchema = z.object({
  params: z.record(z.string(), z.string().max(500)).default({}),
  offset: z.number().int().min(0).max(10_000),
})

export type LoadMoreResult = {
  cards: React.ReactNode
  /* Where the batch after this one starts. */
  nextOffset: number
  remaining: number
}

export async function loadMoreOutings(raw: unknown): Promise<LoadMoreResult> {
  const parsed = inputSchema.safeParse(raw)
  if (!parsed.success) return { cards: null, nextOffset: 0, remaining: 0 }
  const { params, offset } = parsed.data

  const { results } = await resolveCatalog(params)
  const slice = results.slice(offset, offset + BATCH)
  const nextOffset = offset + slice.length

  return {
    cards: slice.map((r) => <OutingCard key={r.id} result={r} />),
    nextOffset,
    remaining: Math.max(0, results.length - nextOffset),
  }
}
