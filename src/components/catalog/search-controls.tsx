'use client'

import { useRouter } from 'next/navigation'
import { useState, useSyncExternalStore, useTransition } from 'react'
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
import { RADIUS_OPTIONS, type SearchState } from '@/lib/schemas'
import { searchHref, toggleIn } from '@/lib/catalog/url'
import { CheckRow, Chip, Field, FieldBox, cx } from '@/components/ui'
import { AddressField } from '@/components/ui/address-field'
import { AgeBandSelect } from './age-band-select'

/*
  The controls edit a draft; Search writes it to the URL and lets the server
  re-render. The URL stays the one source of truth for the results, which keeps
  the view shareable, and the list does not jump around while she is still
  setting up the question.
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

/*
  Which arrangement the panel is in. Budget and "Leaving from" stand in the
  top rows on a desktop and sit inside the More filters drawer on a phone, and
  that is a change of order, not of styling: `order-*` moves a block on screen
  and leaves it where it was for the Tab key and the screen reader, both of
  which read the DOM. So the block is rendered in the one place or the other,
  and this decides which.

  The server assumes wide, and so does the first client render, so hydration
  matches. A phone keeps the block display:none until she opens the drawer, so
  the swap happens while there is nothing on screen to move.
*/
const PANEL_WIDE = '(min-width: 640px)'

function useWideLayout() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(PANEL_WIDE)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(PANEL_WIDE).matches,
    () => true,
  )
}

export function SearchControls({
  state,
  originLabel,
}: {
  state: SearchState
  originLabel: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const wide = useWideLayout()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draft, setDraft] = useState(state)
  /* The two number boxes hold what was typed, so either can be emptied on the
     way to a new number; they are read as numbers only on Search. */
  const [children, setChildren] = useState(String(state.children))
  const [budget, setBudget] = useState(String(state.budget_max))
  /* The address box keeps its own text; bumping this redraws it from the draft. */
  const [addressKey, setAddressKey] = useState(0)

  /* The URL moved without us — back button, sort, a shared link — so the
     draft starts again from what the results now show. Sort is left out: it
     applies on its own and should not throw away an unsearched draft. */
  const urlKey = searchHref({ ...state, sort: 'best_match' })
  const [seenKey, setSeenKey] = useState(urlKey)
  if (urlKey !== seenKey) {
    setSeenKey(urlKey)
    setDraft(state)
    setChildren(String(state.children))
    setBudget(String(state.budget_max))
    setAddressKey((k) => k + 1)
  }

  const set = (patch: Partial<SearchState>) => setDraft((d) => ({ ...d, ...patch }))

  /* What Search would ask for. A box left empty or nonsensical falls back to
     the last searched value rather than to a surprise. */
  const kidsN = Math.floor(Number(children))
  const budgetN = Number(budget)
  const next: SearchState = {
    ...draft,
    sort: state.sort,
    children: children.trim() && Number.isFinite(kidsN) && kidsN >= 1 ? kidsN : state.children,
    budget_max:
      budget.trim() && Number.isFinite(budgetN) && budgetN >= 0 ? budgetN : state.budget_max,
  }
  const dirty = searchHref(next) !== searchHref(state)

  const search = () => {
    setChildren(String(next.children))
    setBudget(String(next.budget_max))
    startTransition(() => router.push(searchHref(next), { scroll: false }))
  }

  const extras =
    draft.environment.length + draft.accessibility.length + draft.formats.length

  /*
    Budget and where she is leaving from. On a phone these are the two the
    design leaves out of the standing row — a director changes them once a
    term, not once a search — so they sit with the rest of the filters behind
    More filters. See useWideLayout: the panel renders this block in the one
    place or the other, so that Tab and a screen reader find it where she can
    see it.
  */
  const budgetRow = (
    <div
      className={
        wide
          ? /* Still sm:-guarded: `wide` is what the server assumes, so it is
               also what a phone paints before it hydrates, and the block has
               to be out of the way from the first byte. */
            'hidden mt-3.5 sm:flex sm:items-start sm:gap-3'
          : /* The divider and the stacking belong to the drawer this block
               is the top of. Closed, it stays mounted, so what she typed
               survives being hidden. */
            filtersOpen
            ? 'border-border mt-4 grid gap-4 border-t pt-4'
            : 'hidden'
      }
    >
      {/* Quick amounts, and a box for anything else. The design's dropdown
          has "Or type a max" for the same reason: $10 and $15 cover most
          rooms, and the one on $7.50 should not have to round. */}
      <Field label="Budget per child" className="sm:basis-[300px] sm:shrink-0">
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
            aria-label="Budget per child"
            className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
          />
        </FieldBox>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {BUDGET_QUICK.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={next.budget_max === b}
              onClick={() => setBudget(String(b))}
              className={cx(
                'text-meta-sm rounded-pill border px-2.5 py-1 font-semibold',
                next.budget_max === b
                  ? 'bg-brand-tint-2 border-brand text-brand'
                  : 'border-border-soft bg-surface text-text-muted hover:border-brand',
              )}
            >
              ${b}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Leaving from" className="sm:flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
          <div className="min-w-0 flex-1">
            <AddressField
              key={addressKey}
              name="from"
              hideLabel
              rounded="rounded-control sm:rounded-l-control sm:rounded-r-none"
              defaultValue={draft.from}
              placeholder={originLabel}
              onPick={(s) => set({ from: s.label, from_lat: s.lat, from_lng: s.lng })}
              /* Emptying the box goes back to the room's own home base
                 rather than leaving the search measured from nowhere. */
              onClear={() => set({ from: '', from_lat: null, from_lng: null })}
            />
          </div>
          <div className="border-border-strong bg-surface flex h-control items-center gap-2.5 rounded-control border px-3 sm:rounded-l-none sm:border-l-0">
            <span className="text-brand flex">
              <Radar size={18} />
            </span>
            <select
              value={draft.radius_km}
              onChange={(e) => set({ radius_km: Number(e.target.value) })}
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
        {draft.from ? (
          <p className="text-meta text-text-faint mt-1.5">
            Measuring from {draft.from}.{' '}
            <button
              type="button"
              onClick={() => {
                set({ from: '', from_lat: null, from_lng: null })
                setAddressKey((k) => k + 1)
              }}
              className="text-brand font-semibold underline"
            >
              Use {originLabel} instead
            </button>
          </p>
        ) : null}
      </Field>
    </div>
  )

  return (
    <form
      /*
        On a phone the panel has no chrome of its own: the design puts the
        field, the chips and the list straight onto the page, and a card
        border there only spends 32px of a 390px row on a box nobody needs
        drawn.
      */
      className={cx(
        'sm:bg-surface sm:border-border sm:shadow-card sm:rounded-panel sm:border sm:p-[18px]',
        pending && 'opacity-70',
      )}
      onSubmit={(e) => {
        e.preventDefault()
        search()
      }}
    >
      {/* Search */}
      <div className="mb-4 flex gap-2.5">
        <div className="border-border-strong bg-surface flex h-control-lg flex-1 items-center gap-2.5 rounded-control border px-4">
          <span className="text-text-faint flex">
            <Search size={19} />
          </span>
          <input
            value={draft.query}
            onChange={(e) => set({ query: e.target.value })}
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
      </div>
      {dirty ? (
        <p
          className="text-meta text-brand -mt-2 mb-3 font-semibold"
          role="status"
        >
          Filters changed. Press Search to update the list.
        </p>
      ) : null}

      {/* The always-visible row. Three across on a phone, which is the
          design's own mobile row: age, how many, how they travel. */}
      <div className="grid grid-cols-[1.25fr_0.85fr_1fr] gap-2 sm:grid-cols-3 sm:gap-3">
        <AgeBandSelect
          value={draft.age_bands}
          onChange={(age_bands) => set({ age_bands })}
        />

        <Field label="Children">
          <FieldBox tight>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              aria-label="Number of children"
              className="text-meta-sm sm:text-body-sm w-full border-0 bg-transparent font-bold outline-none"
            />
            <span className="text-brand flex">
              <Users size={18} />
            </span>
          </FieldBox>
        </Field>

        <Field label="Travel">
          <FieldBox tight>
            <span className="text-brand flex">
              <Bus size={18} />
            </span>
            <select
              value={draft.transport}
              onChange={(e) =>
                set({ transport: e.target.value as SearchState['transport'] })
              }
              aria-label="How you travel"
              className="text-meta-sm sm:text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
            >
              <option value="walking">Walking</option>
              <option value="bus">Bus</option>
              <option value="parent_drivers">Parent drivers</option>
            </select>
          </FieldBox>
        </Field>
      </div>

      {wide ? budgetRow : null}

      {/* Moods */}
      <div className="border-border mt-4 border-t pt-4">
        <div className="font-display text-body-lg text-text mb-2.5 font-bold sm:text-label sm:text-text-muted sm:font-bold sm:uppercase">
          What are you in the mood for?
        </div>
        {/* Six chips are three wrapped rows on a phone and the design shows
            one. It scrolls sideways instead, bleeding to the page edge so the
            cut chip reads as "there are more". */}
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          {Object.entries(MOOD_STYLE).map(([key, m]) => (
            <Chip
              key={key}
              active={draft.moods.includes(key)}
              tint={m.tint}
              ink={m.ink}
              onClick={() => {
                /* Surprise me is exclusive: it replaces the result set with
                   three, so combining it with other moods is meaningless. */
                if (key === 'surprise') {
                  set({ moods: draft.moods.includes('surprise') ? [] : ['surprise'] })
                  return
                }
                const without = { ...draft, moods: draft.moods.filter((x) => x !== 'surprise') }
                setDraft(toggleIn(without, 'moods', key))
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
        <div className="font-display text-body-lg text-text mb-2.5 font-bold sm:text-label sm:text-text-muted sm:font-bold sm:uppercase">
          Browse by type
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {CATEGORIES.map(([value, label, Icon]) => (
            <Chip
              key={value}
              active={draft.categories.includes(value)}
              onClick={() => setDraft(toggleIn(draft, 'categories', value))}
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

      {wide ? null : budgetRow}

      {/*
        The drawer. Its toggles land in the same draft as everything else and
        wait for Search; the design's separate Apply and Cancel are not built —
        logged in docs/design-gaps.md.
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
                checked={draft.environment.includes(v)}
                onChange={() => setDraft(toggleIn(draft, 'environment', v))}
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
                checked={draft.accessibility.includes(v)}
                onChange={() => setDraft(toggleIn(draft, 'accessibility', v))}
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
                checked={draft.formats.includes(v)}
                onChange={() => setDraft(toggleIn(draft, 'formats', v))}
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
                  set({ environment: [], accessibility: [], formats: [] })
                }
                className="text-body-sm text-brand font-semibold underline"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
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
