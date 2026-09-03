import type { ReactNode } from 'react'
import { Lightbulb, TriangleAlert } from 'lucide-react'
import { cx } from '@/components/ui'
import type { Fact, TravelOption } from '@/lib/catalog/program'

/*
  The outing page's building blocks. Sizes, spacing and copy are taken from the
  design's PROGRAM DETAIL section, not from the design map's summary.
*/

/* A white panel with a tinted icon roundel and a heading. */
export function Section({
  icon,
  tint,
  ink,
  title,
  aside,
  children,
}: {
  icon: ReactNode
  tint: string
  ink: string
  title: string
  aside?: string
  children: ReactNode
}) {
  return (
    <section className="bg-surface border-border mt-4 rounded-panel border p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3.5">
        <span
          className={cx(
            'flex h-avatar w-avatar flex-none items-center justify-center rounded-pill',
            tint,
            ink,
          )}
        >
          {icon}
        </span>
        <h2 className="font-display text-display-sm m-0 flex-1">{title}</h2>
        {aside ? (
          <span className="text-meta-sm text-text-muted">{aside}</span>
        ) : null}
      </div>
      {children}
    </section>
  )
}

/* Cost / Ages & size / Duration / Book by. One shared surface, hairline rules
   between, so it reads as one block of facts rather than four cards. */
export function FactQuad({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-2 mt-5.5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] overflow-hidden rounded-card">
      {children}
    </div>
  )
}

export function FactTile({
  icon,
  label,
  value,
  lines,
  warn,
}: {
  icon: ReactNode
  label: string
  value: string
  lines?: (string | null)[]
  warn?: string | null
}) {
  return (
    <div className="border-border-soft border-r px-4.5 py-4 last:border-r-0">
      <div className="flex items-center gap-2">
        <span className="text-brand flex">{icon}</span>
        <span className="text-label text-text-muted font-bold uppercase">
          {label}
        </span>
      </div>
      <div className="text-fact mt-1.5 font-bold">{value}</div>
      {lines?.filter(Boolean).map((l) => (
        <div key={l} className="text-meta text-text-muted [overflow-wrap:anywhere]">
          {l}
        </div>
      ))}
      {warn ? (
        <div className="text-meta-sm text-warn mt-1.5 leading-snug font-bold">
          {warn}
        </div>
      ) : null}
    </div>
  )
}

/* Our own advice. Warmer than a warning, and visually distinct from the
   venue's own words, because a director should know which is which. */
export function OurNote({ note }: { note: string }) {
  return (
    <div className="bg-note-tint border-note-border mt-4 flex gap-3.5 rounded-card border p-4">
      <span className="text-note-icon flex flex-none">
        <Lightbulb size={18} />
      </span>
      <div>
        <div className="text-label text-note-ink mb-1.5 font-bold uppercase">
          Our note
        </div>
        <div className="text-body text-text-strong leading-relaxed text-pretty">
          {note}
        </div>
      </div>
    </div>
  )
}

/* Structured `conflicts` from the extraction: two of the venue's own pages
   disagree. Showing both beats quietly picking one. */
export function ConflictBanner({ note }: { note: string }) {
  return (
    <div className="bg-warn-tint text-warn text-meta mb-4 flex items-start gap-3 rounded-control px-4 py-3.5 leading-normal">
      <span className="flex flex-none">
        <TriangleAlert size={18} />
      </span>
      <span>
        <strong className="font-bold">Sources disagree.</strong> {note}
      </span>
    </div>
  )
}

/*
  The practical block. An unknown is amber and says so plainly: it is what the
  director will ask the venue, and it becomes a pre-selected ask on the request.

  Cards size themselves to their content. Venues that write a proper note give
  us a paragraph ("Four gender-neutral single-stall washrooms, two close to the
  front lobby...") while others give us two words, and forcing both into one
  narrow column either truncates the useful one or leaves the terse one mostly
  empty. A long value takes two columns, a very long one takes the full width.
*/
function spanFor(value: string): string {
  if (value.length > 240) return 'sm:col-span-3'
  if (value.length > 90) return 'sm:col-span-2'
  return ''
}

export function PracticalList({
  facts,
  icons,
}: {
  facts: Fact[]
  icons: Record<string, ReactNode>
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {facts.map((f) => (
        <div
          key={f.key}
          className={cx(
            'bg-surface-2 border-border-soft flex gap-3.5 rounded-card border px-4 py-3.5',
            spanFor(f.value),
          )}
        >
          <span className="text-brand flex-none">{icons[f.key]}</span>
          <div className="min-w-0">
            <div className="text-body-sm leading-tight font-bold">{f.label}</div>
            <div
              className={cx(
                'text-meta mt-1 leading-normal',
                f.known ? 'text-text-muted' : 'text-warn',
              )}
            >
              {f.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* Three modes side by side, the active one ringed. Comparing them is the
   point: the bus is often slower than walking over a short distance. */
export function TravelModes({
  options,
  icons,
}: {
  options: TravelOption[]
  icons: Record<string, ReactNode>
}) {
  return (
    <div className="flex flex-1 flex-wrap gap-2.5">
      {options.map((o) => (
        <div
          key={o.mode}
          className="bg-surface-2 border-border-soft relative min-w-[118px] flex-1 rounded-card border px-4 py-3.5"
        >
          {o.primary ? (
            <div
              aria-hidden
              className="bg-surface absolute inset-0 rounded-card"
              style={{ boxShadow: 'inset 0 0 0 1.5px var(--color-brand)' }}
            />
          ) : null}
          <div className="relative">
            <div className="text-meta-sm text-text-muted flex items-center gap-2 font-semibold">
              <span className="text-brand flex">{icons[o.mode]}</span>
              {o.label}
            </div>
            <div className="font-display text-travel mt-1.5 font-bold">
              {o.time}
            </div>
            <div className="text-meta-sm text-text-faint min-h-[18px] leading-snug">
              {o.caveat}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
