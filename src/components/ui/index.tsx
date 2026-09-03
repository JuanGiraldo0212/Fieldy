/*
  Shared primitives. Built once here, extended by later slices, never
  reimplemented in a screen folder.

  Every value is a token from globals.css. If a style you need is not a token,
  add the token first — see docs/design-map.md section 3.
*/

import type { ReactNode } from 'react'

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

export { cx }

/* ─── Badge ──────────────────────────────────────────────────────────────
   Feasibility badges. Two tones, because the design has no red level. */

export function Badge({
  tone,
  children,
}: {
  tone: 'green' | 'amber' | 'neutral'
  children: ReactNode
}) {
  const tones = {
    green: 'bg-success-tint text-success',
    amber: 'bg-warn-tint text-warn',
    neutral: 'bg-surface-3 text-text-muted',
  }
  return (
    <span
      className={cx(
        'text-meta inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-semibold',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

/* ─── Chip ───────────────────────────────────────────────────────────────
   Selection is a ring, not a fill — see design-map section 3.3. */

export function Chip({
  active,
  onClick,
  children,
  tint,
  ink,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  /* Mood chips carry their own fill and ink; category chips do not. */
  tint?: string
  ink?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={tint ? { background: tint, color: ink } : undefined}
      className={cx(
        'text-body-sm relative flex items-center gap-2 whitespace-nowrap rounded-card px-3.5 py-3 font-semibold',
        tint ? 'border-0' : 'border-border-soft bg-surface border',
        !tint && active && 'bg-brand-tint-2',
        'hover:border-brand',
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute inset-0 rounded-card"
          style={{ boxShadow: `inset 0 0 0 ${tint ? '2px' : '1.5px'} ${ink ?? 'var(--color-brand)'}` }}
        />
      ) : null}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  )
}

/* ─── Field shell ────────────────────────────────────────────────────────
   The bordered control every filter sits inside. 46px tall, per the design. */

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('min-w-0', className)}>
      <div className="text-label text-text-muted mb-1.5 font-bold uppercase">
        {label}
      </div>
      {children}
    </div>
  )
}

export function FieldBox({
  children,
  as = 'div',
}: {
  children: ReactNode
  as?: 'div' | 'label'
}) {
  const Tag = as
  return (
    <Tag className="border-border-strong bg-surface text-body-sm text-text flex h-control items-center gap-2.5 rounded-control border px-3 font-semibold">
      {children}
    </Tag>
  )
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'bg-surface border-border shadow-card rounded-card border',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ─── Avatar tile ────────────────────────────────────────────────────────
   The fallback when a venue has no usable photo — which is every venue
   today, since all 23 images are `usage: unverified` and withheld. */

export function InitialsTile({
  initials,
  caption,
}: {
  initials: string
  caption?: string
}) {
  return (
    <span className="bg-brand-tint text-brand flex h-full w-full flex-col items-center justify-center gap-0.5">
      <span className="font-display text-display-sm font-bold">{initials}</span>
      {caption ? (
        <span className="text-label text-text-faint uppercase">{caption}</span>
      ) : null}
    </span>
  )
}

/* ─── Empty state ────────────────────────────────────────────────────────── */

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string
  body?: string
  children?: ReactNode
}) {
  return (
    <div className="border-border bg-surface rounded-panel border border-dashed px-6 py-12 text-center">
      <h2 className="font-display text-display-sm">{title}</h2>
      {body ? (
        <p className="text-body text-text-muted mx-auto mt-2 max-w-measure">{body}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  )
}

/* ─── Checkbox row ───────────────────────────────────────────────────────── */

export function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="text-body-sm flex w-full items-center gap-3 py-2 text-left"
    >
      <span
        aria-hidden
        className={cx(
          'flex h-5 w-5 flex-none items-center justify-center rounded-check',
          checked
            ? 'bg-brand text-white'
            : 'border-border-strong border-[1.5px]',
        )}
      >
        {checked ? '✓' : null}
      </span>
      <span>{children}</span>
    </button>
  )
}
