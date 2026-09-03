/*
  Search state lives in the URL, never on the server.

  data-model.md section 7: "Never persisted server-side; it belongs to the
  session, and writing it to the server makes shared links behave
  unpredictably." A filtered catalog view is a thing directors text to each
  other, so the URL has to carry the whole question.

  Params are short and omitted at their default, so a shared link stays
  readable: /?ages=0&kids=10&to=walking rather than a wall of defaults.
*/

import { searchStateSchema, type SearchState } from '@/lib/schemas'

const DEFAULTS = searchStateSchema.parse({})

const list = (v: string | undefined) =>
  v ? v.split(',').filter(Boolean) : undefined

const nums = (v: string | undefined) =>
  v ? v.split(',').map(Number).filter((n) => Number.isFinite(n)) : undefined

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>,
): SearchState {
  const one = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }

  return searchStateSchema.parse({
    query: one('q') ?? undefined,
    age_bands: nums(one('ages')),
    children: one('kids') ? Number(one('kids')) : undefined,
    transport: one('to') ?? undefined,
    budget_max: one('max') ? Number(one('max')) : undefined,
    radius_km: one('within') ? Number(one('within')) : undefined,
    from: one('from') ?? undefined,
    from_lat: one('flat') ? Number(one('flat')) : undefined,
    from_lng: one('flng') ? Number(one('flng')) : undefined,
    categories: list(one('cat')),
    moods: list(one('mood')),
    environment: list(one('env')),
    accessibility: list(one('access')),
    formats: list(one('type')),
    sort: one('sort') ?? undefined,
  })
}

/* Only non-defaults are written, so the URL says what the user actually chose. */
export function toSearchParams(state: SearchState): URLSearchParams {
  const p = new URLSearchParams()
  const put = (k: string, v: string) => {
    if (v) p.set(k, v)
  }
  const same = (a: unknown[], b: unknown[]) =>
    a.length === b.length && a.every((x, i) => x === b[i])

  if (state.query !== DEFAULTS.query) put('q', state.query)
  if (!same(state.age_bands, DEFAULTS.age_bands)) put('ages', state.age_bands.join(','))
  if (state.children !== DEFAULTS.children) put('kids', String(state.children))
  if (state.transport !== DEFAULTS.transport) put('to', state.transport)
  if (state.budget_max !== DEFAULTS.budget_max) put('max', String(state.budget_max))
  if (state.radius_km !== DEFAULTS.radius_km) put('within', String(state.radius_km))
  /* All three or none: a label without coordinates would silently fall back to
     the room and show the wrong place in the "Leaving from" control. */
  if (state.from && state.from_lat != null && state.from_lng != null) {
    put('from', state.from)
    put('flat', String(state.from_lat))
    put('flng', String(state.from_lng))
  }
  if (state.categories.length) put('cat', state.categories.join(','))
  if (state.moods.length) put('mood', state.moods.join(','))
  if (state.environment.length) put('env', state.environment.join(','))
  if (state.accessibility.length) put('access', state.accessibility.join(','))
  if (state.formats.length) put('type', state.formats.join(','))
  if (state.sort !== DEFAULTS.sort) put('sort', state.sort)

  return p
}

export function searchHref(state: SearchState): string {
  const qs = toSearchParams(state).toString()
  return qs ? `/?${qs}` : '/'
}

/* Toggle one value in a list-valued filter, returning a whole new state. */
export function toggleIn<K extends keyof SearchState>(
  state: SearchState,
  key: K,
  value: string,
): SearchState {
  const current = state[key] as unknown as string[]
  const next = current.includes(value)
    ? current.filter((x) => x !== value)
    : [...current, value]
  return { ...state, [key]: next }
}
