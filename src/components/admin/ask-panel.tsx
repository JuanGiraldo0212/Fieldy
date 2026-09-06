import Link from 'next/link'
import { CircleAlert, CircleHelp, MessageSquareWarning, Scale } from 'lucide-react'
import { resolveReport } from '@/app/admin/actions'
import type { Completeness, MissingItem } from '@/lib/catalog/completeness'
import { cx } from '@/components/ui'

type Conflict = { field: string; values: string[]; sources: string[]; note?: string }

type ReportRow = {
  id: string
  programName: string | null
  field: string | null
  note: string | null
  createdAt: string
}

/*
  The phone-call list. Three sources, in the order they matter:

  1. What the catalog columns say is missing (completeness). These are the
     rows a director sees as "Needs confirmation" today; each links to the
     field that fixes it.
  2. What the extractor wrote down about the website, verbatim: `gaps` and
     `conflicts`. Older and wordier, but it says WHY the column is empty —
     "the email is behind Cloudflare protection" is worth knowing before
     dialling.
  3. What directors reported as wrong.
*/
export function AskPanel({
  venueId,
  score,
  gaps,
  conflicts,
  reports,
}: {
  venueId: string
  score: Completeness
  gaps: string[] | null
  conflicts: Conflict[] | null
  reports: ReportRow[]
}) {
  const blocking = score.items.filter((i) => i.severity === 'blocking')
  const venueAsks = score.items.filter((i) => i.severity === 'ask' && !i.programSlug)
  const programAsks = score.items.filter((i) => i.programSlug)

  const byProgram = new Map<string, { name: string; items: MissingItem[] }>()
  for (const i of programAsks) {
    const g = byProgram.get(i.programSlug!) ?? { name: i.programName ?? i.programSlug!, items: [] }
    g.items.push(i)
    byProgram.set(i.programSlug!, g)
  }

  const nothing =
    score.items.length === 0 && !gaps?.length && !conflicts?.length && reports.length === 0

  return (
    <aside className="bg-surface border-border rounded-card-lg border p-5" aria-labelledby="ask-title">
      <h2 id="ask-title" className="font-display text-display-sm m-0">To ask the venue</h2>

      {nothing ? (
        <p className="text-body-sm text-text-muted mt-2 mb-0">
          Nothing. Every fact the catalog shows is filled in.
        </p>
      ) : null}

      {blocking.length > 0 ? (
        <Group title="Blocking" tone="danger" icon={<CircleAlert size={16} />}>
          {blocking.map((i) => (
            <Row key={i.key} item={i} venueId={venueId} />
          ))}
        </Group>
      ) : null}

      {venueAsks.length > 0 ? (
        <Group title="About the venue" tone="amber" icon={<CircleHelp size={16} />}>
          {venueAsks.map((i) => (
            <Row key={i.key} item={i} venueId={venueId} />
          ))}
        </Group>
      ) : null}

      {[...byProgram.entries()].map(([slug, g]) => (
        <Group key={slug} title={g.name} tone="amber" icon={<CircleHelp size={16} />}>
          {g.items.map((i) => (
            <Row key={i.key} item={i} venueId={venueId} />
          ))}
        </Group>
      ))}

      {reports.length > 0 ? (
        <Group title="Directors said" tone="brand" icon={<MessageSquareWarning size={16} />}>
          {reports.map((r) => (
            <li key={r.id} className="py-2">
              <div className="text-body-sm">
                {r.programName ? <span className="font-semibold">{r.programName}: </span> : null}
                {r.field ? <span className="text-text-muted">{r.field} — </span> : null}
                {r.note ?? 'no note'}
              </div>
              <div className="text-meta text-text-faint mt-1 flex flex-wrap items-center gap-2">
                <span>{r.createdAt}</span>
                <ReportButton id={r.id} status="fixed" label="Fixed" />
                <ReportButton id={r.id} status="checked" label="Checked, was right" />
                <ReportButton id={r.id} status="rejected" label="Dismiss" />
              </div>
            </li>
          ))}
        </Group>
      ) : null}

      {conflicts?.length ? (
        <Group title="Sources disagree" tone="neutral" icon={<Scale size={16} />}>
          {conflicts.map((c, i) => (
            <li key={i} className="text-body-sm py-2">
              <span className="font-semibold">{c.field}:</span> {c.values.join(' vs ')}
              {c.note ? <span className="text-text-muted"> — {c.note}</span> : null}
            </li>
          ))}
        </Group>
      ) : null}

      {gaps?.length ? (
        <details className="mt-4">
          <summary className="text-body-sm text-text-strong cursor-pointer font-semibold">
            What the website did not say ({gaps.length})
          </summary>
          <ul className="text-meta text-text-muted mt-2 grid list-disc gap-1.5 pl-5">
            {gaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </aside>
  )
}

function Group({
  title,
  tone,
  icon,
  children,
}: {
  title: string
  tone: 'danger' | 'amber' | 'brand' | 'neutral'
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const tones = {
    danger: 'text-danger',
    amber: 'text-warn',
    brand: 'text-brand',
    neutral: 'text-text-muted',
  }
  return (
    <div className="mt-4">
      <h3 className={cx('text-label m-0 flex items-center gap-1.5 font-bold uppercase', tones[tone])}>
        {icon}
        {title}
      </h3>
      <ul className="divide-border-soft m-0 mt-1 list-none divide-y p-0">{children}</ul>
    </div>
  )
}

/* The link lands on the fieldset that answers the question. */
function Row({ item, venueId }: { item: MissingItem; venueId: string }) {
  const href = item.programSlug
    ? `/admin/venues/${venueId}/programs/${item.programSlug}#${item.key.split(':')[1]}`
    : `#${item.section}`
  return (
    <li className="py-1.5">
      <Link href={href} className="text-body-sm text-text block no-underline hover:text-brand">
        {item.label}
      </Link>
    </li>
  )
}

function ReportButton({
  id,
  status,
  label,
}: {
  id: string
  status: 'checked' | 'fixed' | 'rejected'
  label: string
}) {
  return (
    <form action={resolveReport.bind(null, id, status)} className="inline">
      <button type="submit" className="text-meta text-brand font-semibold hover:underline">
        {label}
      </button>
    </form>
  )
}
