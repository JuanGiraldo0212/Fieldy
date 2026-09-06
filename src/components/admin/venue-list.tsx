'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Camera, CircleAlert, MessageSquareWarning, Pencil } from 'lucide-react'
import { Chip, cx, EmptyState, inputClass } from '@/components/ui'
import { VENUE_CATEGORIES } from '@/lib/catalog/options'

export type VenueListRow = {
  id: string
  name: string
  category: string
  blocking: number
  asks: number
  openReports: number
  programCount: number
  activeProgramCount: number
  hasHero: boolean
  hasContact: boolean
  edited: boolean
  checkedOn: string
}

type Filter =
  | 'all'
  | 'call'
  | 'contact'
  | 'programs'
  | 'photo'
  | 'reports'
  | 'edited'
  | 'done'

const FILTERS: [Filter, string, (r: VenueListRow) => boolean][] = [
  ['all', 'All', () => true],
  ['call', 'Needs a call', (r) => r.blocking > 0],
  ['contact', 'No booking contact', (r) => !r.hasContact],
  ['programs', 'No active program', (r) => r.activeProgramCount === 0],
  ['photo', 'No card photo', (r) => !r.hasHero],
  ['reports', 'Has corrections', (r) => r.openReports > 0],
  ['edited', 'Hand-edited', (r) => r.edited],
  ['done', 'Fully described', (r) => r.blocking === 0 && r.asks === 0],
]

const CATEGORY = new Map<string, string>(VENUE_CATEGORIES)

/*
  Client-side over the whole list: thirty rows, and a filter that round-trips
  to the server would be slower than the eye. The rows arrive already sorted
  worst first (compareCompleteness), and nothing here reorders them.
*/
export function VenueList({ rows }: { rows: VenueListRow[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')

  const shown = useMemo(() => {
    const pred = FILTERS.find(([k]) => k === filter)?.[2] ?? (() => true)
    const needle = q.trim().toLowerCase()
    return rows.filter(
      (r) =>
        pred(r) &&
        (!needle ||
          r.name.toLowerCase().includes(needle) ||
          r.id.includes(needle)),
    )
  }, [rows, filter, q])

  const count = (k: Filter) =>
    rows.filter(FILTERS.find(([f]) => f === k)?.[2] ?? (() => true)).length

  return (
    <div className="mt-6">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a venue"
        aria-label="Find a venue"
        className={cx(inputClass, 'max-w-[420px]')}
      />

      <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(([k, label]) => (
          <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>
            {label}
            <span className="text-meta text-text-faint font-semibold">{count(k)}</span>
          </Chip>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="Nothing matches" body="Try another filter, or a shorter search." />
        </div>
      ) : (
        <ul className="mt-4 grid list-none gap-2.5 p-0">
          {shown.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/venues/${r.id}`}
                className="bg-surface border-border hover:border-brand shadow-card flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border px-4 py-3.5 no-underline"
              >
                <div className="min-w-[220px] flex-1">
                  <div className="text-body text-text font-bold">{r.name}</div>
                  <div className="text-meta text-text-muted mt-0.5">
                    {CATEGORY.get(r.category) ?? r.category}
                    <span aria-hidden> · </span>
                    {r.activeProgramCount} of {r.programCount} program{r.programCount === 1 ? '' : 's'} live
                    <span aria-hidden> · </span>
                    checked {r.checkedOn}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {r.blocking > 0 ? (
                    <Pill tone="danger" icon={<CircleAlert size={14} />}>
                      {r.blocking} blocking
                    </Pill>
                  ) : null}
                  {r.asks > 0 ? (
                    <Pill tone="amber">{r.asks} to ask</Pill>
                  ) : null}
                  {r.blocking === 0 && r.asks === 0 ? (
                    <Pill tone="green">Complete</Pill>
                  ) : null}
                  {r.openReports > 0 ? (
                    <Pill tone="brand" icon={<MessageSquareWarning size={14} />}>
                      {r.openReports} correction{r.openReports === 1 ? '' : 's'}
                    </Pill>
                  ) : null}
                  {!r.hasHero ? (
                    <Pill tone="neutral" icon={<Camera size={14} />}>
                      No photo
                    </Pill>
                  ) : null}
                  {r.edited ? (
                    <Pill tone="neutral" icon={<Pencil size={14} />}>
                      Edited
                    </Pill>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* The design's badge has no red level (components/ui Badge); the admin list
   needs one, because "cannot be booked" and "worth a call" are different
   afternoons. Kept here rather than added to Badge so no director screen can
   reach for it. */
export function Pill({
  tone,
  icon,
  children,
}: {
  tone: 'danger' | 'amber' | 'green' | 'brand' | 'neutral'
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  const tones = {
    danger: 'bg-danger text-white',
    amber: 'bg-warn-tint text-warn',
    green: 'bg-success-tint text-success',
    brand: 'bg-brand-tint text-brand',
    neutral: 'bg-surface-3 text-text-muted',
  }
  return (
    <span
      className={cx(
        'text-meta inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-semibold whitespace-nowrap',
        tones[tone],
      )}
    >
      {icon}
      {children}
    </span>
  )
}
