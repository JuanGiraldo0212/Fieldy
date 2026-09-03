'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  Accessibility,
  Binoculars,
  Blocks,
  Brush,
  Brain,
  Bus,
  ChevronDown,
  CircleDollarSign,
  FlaskConical,
  GraduationCap,
  Hand,
  House,
  Landmark,
  Leaf,
  MapPin,
  Palette,
  PawPrint,
  Radar,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Smile,
  Sparkle,
  SportShoe,
  Sun,
  Tag,
  Truck,
  User,
  Users,
  Volume1,
  type LucideIcon,
} from 'lucide-react'
import { AGE_BANDS, RADIUS_OPTIONS, type SearchState } from '@/lib/schemas'
import { searchHref, toggleIn } from '@/lib/catalog/url'
import { CheckRow, Chip, Field, FieldBox, cx } from '@/components/ui'
import { AddressField } from '@/components/ui/address-field'

/*
  Every control writes to the URL and lets the server re-render. That keeps one
  source of truth for the search, makes the view shareable, and means the
  catalog still works with JavaScript disabled for the parts that matter
  (plan section 8 — links get opened inside messaging apps' browsers).
*/

/* Icons and sizes are the design's own — 20px on mood chips, 18px on
   category chips and the field controls, 17px in the filter drawer. */
const MOOD_STYLE: Record<string, { label: string; tint: string; ink: string; Icon: LucideIcon }> = {
  play: { label: 'Play', tint: 'var(--color-mood-play)', ink: 'var(--color-mood-play-ink)', Icon: Blocks },
  explore: { label: 'Explore', tint: 'var(--color-mood-explore)', ink: 'var(--color-mood-explore-ink)', Icon: Binoculars },
  active: { label: 'Active', tint: 'var(--color-mood-active)', ink: 'var(--color-mood-active-ink)', Icon: SportShoe },
  creative: { label: 'Creative', tint: 'var(--color-mood-creative)', ink: 'var(--color-mood-creative-ink)', Icon: Brush },
  learn: { label: 'Learn', tint: 'var(--color-mood-learn)', ink: 'var(--color-mood-learn-ink)', Icon: GraduationCap },
  surprise: { label: 'Surprise me', tint: 'var(--color-mood-surprise)', ink: 'var(--color-mood-surprise-ink)', Icon: Sparkle },
}

const CATEGORIES: [string, string, LucideIcon][] = [
  ['animals_farms', 'Animals & Farms', PawPrint],
  ['nature_outdoors', 'Nature', Leaf],
  ['museums_history', 'Museums', Landmark],
  ['arts_performance', 'Arts', Palette],
  ['science', 'Science', FlaskConical],
  ['community_civic', 'Community', Landmark],
  ['comes_to_you', 'Comes to you', Truck],
]

const ENVIRONMENT: [string, string, LucideIcon][] = [
  ['indoor', 'Indoor', House],
  ['outdoor', 'Outdoor', Sun],
  ['comes_to_you', 'Comes to you', Truck],
  ['free', 'Free or low cost', Tag],
]

const ACCESSIBILITY: [string, string, LucideIcon][] = [
  ['wheelchair', 'Wheelchair accessible', Accessibility],
  ['sensory', 'Sensory friendly', Smile],
  ['neuro', 'Neurodiversity friendly', Brain],
  ['low_noise', 'Low noise', Volume1],
]

const FORMATS: [string, string, LucideIcon][] = [
  ['guided', 'Guided programs', GraduationCap],
  ['hands_on', 'Hands-on', Hand],
  ['interactive', 'Interactive', RefreshCw],
  ['self_guided', 'Self-guided', User],
]

const BUDGET_QUICK = [5, 10, 15, 20, 30]

export function SearchControls({
  state,
  originLabel,
}: {
  state: SearchState
  originLabel: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState(state.query)
  const [budget, setBudget] = useState(String(state.budget_max))

  /* Typed budgets commit on blur or Enter, not on every keystroke: navigating
     mid-number would refetch for "1" on the way to "15". */
  const commitBudget = () => {
    const n = Number(budget)
    if (Number.isFinite(n) && n >= 0 && n !== state.budget_max) {
      go({ ...state, budget_max: n })
    }
  }

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
        <div className="border-border-strong bg-surface flex h-control-lg flex-1 items-center gap-2.5 rounded-control border px-4">
          <span className="text-text-faint flex">
            <Search size={19} />
          </span>
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
            <span className="text-brand flex">
              <GraduationCap size={18} />
            </span>
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
            <span className="text-text-faint flex">
              <ChevronDown size={15} />
            </span>
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
            <span className="text-brand flex">
              <Users size={18} />
            </span>
          </FieldBox>
        </Field>

        <Field label="Travel">
          <FieldBox>
            <span className="text-brand flex">
              <Bus size={18} />
            </span>
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

        {/* Quick amounts, and a box for anything else. The design's dropdown
            has "Or type a max" for the same reason: $10 and $15 cover most
            rooms, and the one on $7.50 should not have to round. */}
        <Field label="Budget per child">
          <FieldBox>
            <span className="text-brand flex">
              <CircleDollarSign size={18} />
            </span>
            <span className="text-text-faint">$</span>
            <input
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onBlur={() => commitBudget()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitBudget()
                }
              }}
              aria-label="Budget per child"
              className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
            />
          </FieldBox>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {BUDGET_QUICK.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={state.budget_max === b}
                onClick={() => {
                  setBudget(String(b))
                  go({ ...state, budget_max: b })
                }}
                className={cx(
                  'text-meta-sm rounded-pill border px-2.5 py-1 font-semibold',
                  state.budget_max === b
                    ? 'bg-brand-tint-2 border-brand text-brand'
                    : 'border-border-soft bg-surface text-text-muted hover:border-brand',
                )}
              >
                ${b}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-3.5">
        <Field label="Leaving from">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <div className="min-w-0 flex-1">
              <AddressField
                name="from"
                hideLabel
                rounded="rounded-control sm:rounded-l-control sm:rounded-r-none"
                defaultValue={state.from}
                placeholder={originLabel}
                onPick={(s) =>
                  go({ ...state, from: s.label, from_lat: s.lat, from_lng: s.lng })
                }
                /* Emptying the box goes back to the room's own home base
                   rather than leaving the search measured from nowhere. */
                onClear={() =>
                  go({ ...state, from: '', from_lat: null, from_lng: null })
                }
              />
            </div>
            <div className="border-border-strong bg-surface flex h-control items-center gap-2.5 rounded-control border px-3 sm:rounded-l-none sm:border-l-0">
              <span className="text-brand flex">
                <Radar size={18} />
              </span>
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
          {state.from ? (
            <p className="text-meta text-text-faint mt-1.5">
              Measuring from {state.from}.{' '}
              <button
                type="button"
                onClick={() => go({ ...state, from: '', from_lat: null, from_lng: null })}
                className="text-brand font-semibold underline"
              >
                Use {originLabel} instead
              </button>
            </p>
          ) : null}
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
              <m.Icon size={20} />
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
          {CATEGORIES.map(([value, label, Icon]) => (
            <Chip
              key={value}
              active={state.categories.includes(value)}
              onClick={() => go(toggleIn(state, 'categories', value))}
            >
              <span className="text-brand flex">
                <Icon size={18} />
              </span>
              {label}
            </Chip>
          ))}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="border-border-soft bg-surface text-body-sm text-text-strong hover:border-brand flex items-center gap-2 rounded-card border px-3.5 py-3 font-semibold"
          >
            <SlidersHorizontal size={18} />
            {filtersOpen
              ? 'Hide filters'
              : extras
                ? `More filters (${extras})`
                : 'More filters'}
            <ChevronDown
              size={16}
              className={cx('text-text-faint', filtersOpen && 'rotate-180')}
            />
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
            {ENVIRONMENT.map(([v, label, Icon]) => (
              <CheckRow
                key={v}
                checked={state.environment.includes(v)}
                onChange={() => go(toggleIn(state, 'environment', v))}
                icon={<Icon size={17} />}
              >
                {label}
              </CheckRow>
            ))}
          </div>
          <div>
            <div className="text-label text-text-muted mb-1 font-bold uppercase">
              Accessibility
            </div>
            {ACCESSIBILITY.map(([v, label, Icon]) => (
              <CheckRow
                key={v}
                checked={state.accessibility.includes(v)}
                onChange={() => go(toggleIn(state, 'accessibility', v))}
                icon={<Icon size={17} />}
              >
                {label}
              </CheckRow>
            ))}
          </div>
          <div>
            <div className="text-label text-text-muted mb-1 font-bold uppercase">
              Program type
            </div>
            {FORMATS.map(([v, label, Icon]) => (
              <CheckRow
                key={v}
                checked={state.formats.includes(v)}
                onChange={() => go(toggleIn(state, 'formats', v))}
                icon={<Icon size={17} />}
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
