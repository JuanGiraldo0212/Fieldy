'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { AGE_BANDS, RADIUS_OPTIONS, type SearchState } from '@/lib/schemas'
import { searchHref, toggleIn } from '@/lib/catalog/url'
import { CheckRow, Chip, Field, FieldBox, cx } from '@/components/ui'

/*
  Every control writes to the URL and lets the server re-render. That keeps one
  source of truth for the search, makes the view shareable, and means the
  catalog still works with JavaScript disabled for the parts that matter
  (plan section 8 — links get opened inside messaging apps' browsers).
*/

const MOOD_STYLE: Record<string, { label: string; tint: string; ink: string }> = {
  fun: { label: 'Fun', tint: 'var(--color-mood-fun)', ink: 'var(--color-mood-fun-ink)' },
  explore: { label: 'Explore', tint: 'var(--color-mood-explore)', ink: 'var(--color-mood-explore-ink)' },
  active: { label: 'Active', tint: 'var(--color-mood-active)', ink: 'var(--color-mood-active-ink)' },
  creative: { label: 'Creative', tint: 'var(--color-mood-creative)', ink: 'var(--color-mood-creative-ink)' },
  learn: { label: 'Learn', tint: 'var(--color-mood-learn)', ink: 'var(--color-mood-learn-ink)' },
  surprise: { label: 'Surprise me', tint: 'var(--color-mood-surprise)', ink: 'var(--color-mood-surprise-ink)' },
}

const CATEGORIES: [string, string][] = [
  ['animals_farms', 'Animals & Farms'],
  ['nature_outdoors', 'Nature'],
  ['museums_history', 'Museums'],
  ['arts_performance', 'Arts'],
  ['science', 'Science'],
  ['community_civic', 'Community'],
  ['comes_to_you', 'Comes to you'],
]

const ENVIRONMENT: [string, string][] = [
  ['indoor', 'Indoor'],
  ['outdoor', 'Outdoor'],
  ['comes_to_you', 'Comes to you'],
  ['free', 'Free or low cost'],
]

const ACCESSIBILITY: [string, string][] = [
  ['wheelchair', 'Wheelchair accessible'],
  ['sensory', 'Sensory friendly'],
  ['neuro', 'Neurodiversity friendly'],
  ['low_noise', 'Low noise'],
]

const FORMATS: [string, string][] = [
  ['guided', 'Guided programs'],
  ['hands_on', 'Hands-on'],
  ['interactive', 'Interactive'],
  ['self_guided', 'Self-guided'],
]

const BUDGET_QUICK = [5, 10, 15, 20, 30]

export function SearchControls({ state }: { state: SearchState }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState(state.query)

  const go = (next: SearchState) => {
    startTransition(() => router.push(searchHref(next), { scroll: false }))
  }

  const extras =
    state.environment.length + state.accessibility.length + state.formats.length

  return (
    <div
      className={cx(
        'bg-surface border-border shadow-card rounded-panel border p-4 sm:p-[18px]',
        pending && 'opacity-70',
      )}
    >
      {/* Search */}
      <form
        className="mb-4 flex gap-2.5"
        onSubmit={(e) => {
          e.preventDefault()
          go({ ...state, query })
        }}
      >
        <div className="border-border-strong bg-surface flex h-control-lg flex-1 items-center rounded-control border px-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place or activity"
            aria-label="Search a place or activity"
            className="text-body h-full w-full border-0 bg-transparent outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-solid hover:bg-brand-solid-hover text-body h-control-lg rounded-control px-6 font-bold text-white sm:px-8"
        >
          Search
        </button>
      </form>

      {/* The always-visible row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Age / Grade">
          <FieldBox>
            <select
              value={state.age_bands[0] ?? 1}
              onChange={(e) => go({ ...state, age_bands: [Number(e.target.value)] })}
              aria-label="Age or grade"
              className="text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
            >
              {AGE_BANDS.map((b, i) => (
                <option key={b[2]} value={i}>
                  {b[2]}
                </option>
              ))}
            </select>
          </FieldBox>
        </Field>

        <Field label="Children">
          <FieldBox>
            <input
              type="number"
              min={1}
              value={state.children}
              onChange={(e) =>
                go({ ...state, children: Math.max(1, Number(e.target.value) || 1) })
              }
              aria-label="Number of children"
              className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
            />
          </FieldBox>
        </Field>

        <Field label="Travel">
          <FieldBox>
            <select
              value={state.transport}
              onChange={(e) =>
                go({ ...state, transport: e.target.value as SearchState['transport'] })
              }
              aria-label="How you travel"
              className="text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
            >
              <option value="walking">Walking</option>
              <option value="bus">Bus</option>
              <option value="parent_drivers">Parent drivers</option>
            </select>
          </FieldBox>
        </Field>

        <Field label="Budget per child">
          <FieldBox>
            <span aria-hidden className="text-text-faint">
              $
            </span>
            <select
              value={state.budget_max}
              onChange={(e) => go({ ...state, budget_max: Number(e.target.value) })}
              aria-label="Budget per child"
              className="text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
            >
              {BUDGET_QUICK.map((b) => (
                <option key={b} value={b}>
                  {b === 30 ? '30 or more' : `Up to $${b}`}
                </option>
              ))}
            </select>
          </FieldBox>
        </Field>
      </div>

      <div className="mt-3.5">
        <Field label="Leaving from">
          <div className="flex">
            <div className="border-border-strong bg-surface text-body-sm text-text-muted flex h-control min-w-0 flex-1 items-center rounded-l-control border px-3 font-semibold">
              <span className="truncate">Your centre</span>
            </div>
            <div className="border-border-strong bg-surface flex h-control items-center rounded-r-control border border-l-0 px-3">
              <select
                value={state.radius_km}
                onChange={(e) => go({ ...state, radius_km: Number(e.target.value) })}
                aria-label="How far you will travel"
                className="text-body-sm h-select cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === 0 ? 'Any distance' : `Within ${r} km`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Field>
      </div>

      {/* Moods */}
      <div className="border-border mt-4 border-t pt-4">
        <div className="text-label text-text-muted mb-2.5 font-bold uppercase">
          What are you in the mood for?
        </div>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(MOOD_STYLE).map(([key, m]) => (
            <Chip
              key={key}
              active={state.moods.includes(key)}
              tint={m.tint}
              ink={m.ink}
              onClick={() => {
                /* Surprise me is exclusive: it replaces the result set with
                   three, so combining it with other moods is meaningless. */
                if (key === 'surprise') {
                  go({
                    ...state,
                    moods: state.moods.includes('surprise') ? [] : ['surprise'],
                  })
                  return
                }
                const without = { ...state, moods: state.moods.filter((x) => x !== 'surprise') }
                go(toggleIn(without, 'moods', key))
              }}
            >
              {m.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-4">
        <div className="text-label text-text-muted mb-2.5 font-bold uppercase">
          Browse by type
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {CATEGORIES.map(([value, label]) => (
            <Chip
              key={value}
              active={state.categories.includes(value)}
              onClick={() => go(toggleIn(state, 'categories', value))}
            >
              {label}
            </Chip>
          ))}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="border-border-soft bg-surface text-body-sm text-text-strong hover:border-brand flex items-center gap-2 rounded-card border px-3.5 py-3 font-semibold"
          >
            {filtersOpen
              ? 'Hide filters'
              : extras
                ? `More filters (${extras})`
                : 'More filters'}
          </button>
        </div>
      </div>

      {/*
        The drawer. The design edits a draft here and commits on Apply; this
        applies each toggle immediately, which is a deliberate simplification
        while the filter set is small — logged in docs/design-gaps.md.
      */}
      {filtersOpen ? (
        <div className="border-border mt-4 grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-4 sm:grid-cols-3">
          <div>
            <div className="text-label text-text-muted mb-1 font-bold uppercase">
              Environment
            </div>
            {ENVIRONMENT.map(([v, label]) => (
              <CheckRow
                key={v}
                checked={state.environment.includes(v)}
                onChange={() => go(toggleIn(state, 'environment', v))}
              >
                {label}
              </CheckRow>
            ))}
          </div>
          <div>
            <div className="text-label text-text-muted mb-1 font-bold uppercase">
              Accessibility
            </div>
            {ACCESSIBILITY.map(([v, label]) => (
              <CheckRow
                key={v}
                checked={state.accessibility.includes(v)}
                onChange={() => go(toggleIn(state, 'accessibility', v))}
              >
                {label}
              </CheckRow>
            ))}
          </div>
          <div>
            <div className="text-label text-text-muted mb-1 font-bold uppercase">
              Program type
            </div>
            {FORMATS.map(([v, label]) => (
              <CheckRow
                key={v}
                checked={state.formats.includes(v)}
                onChange={() => go(toggleIn(state, 'formats', v))}
              >
                {label}
              </CheckRow>
            ))}
          </div>
          {extras ? (
            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={() =>
                  go({ ...state, environment: [], accessibility: [], formats: [] })
                }
                className="text-body-sm text-brand font-semibold underline"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/* The sort control, which sits above the results rather than in the panel. */
export function SortControl({ state }: { state: SearchState }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  return (
    <label className="text-meta text-text-muted flex items-center gap-2">
      Sort by
      <select
        value={state.sort}
        onChange={(e) =>
          startTransition(() =>
            router.push(
              searchHref({ ...state, sort: e.target.value as SearchState['sort'] }),
              { scroll: false },
            ),
          )
        }
        className="border-border-strong bg-surface text-meta rounded-control border px-2 py-1 font-semibold"
      >
        <option value="best_match">Best match</option>
        <option value="distance">Distance: nearest</option>
        <option value="duration">Duration: shortest</option>
        <option value="price">Price: lowest</option>
      </select>
    </label>
  )
}
