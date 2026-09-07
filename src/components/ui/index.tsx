/*
  Shared primitives. Built once here, extended by later slices, never
  reimplemented in a screen folder.

  Every value is a token from globals.css. If a style you need is not a token,
  add the token first — see docs/design-map.md section 3.
*/

import { Check } from 'lucide-react'
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
  icon,
}: {
  checked: boolean
  onChange: () => void
  children: ReactNode
  icon?: ReactNode
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
        {checked ? <Check size={13} strokeWidth={2.5} /> : null}
      </span>
      {icon ? <span className="text-brand flex">{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}

/* ─── Form controls ──────────────────────────────────────────────────────
   The account and room forms carried these class strings inline. The admin
   forms have sixty fields, so they get names. Same tokens, same 48px field.

   TriState is the one that matters: every yes/no fact in the catalog is
   really yes / no / not known, and "not known" is data (schema comment on
   venue.has_washrooms). A checkbox cannot say it, so a select does. */

export const inputClass =
  'border-border-strong bg-input text-body h-field w-full rounded-control border px-3.5 outline-none focus:border-brand disabled:text-text-muted'

export const labelClass =
  'text-label text-text-muted mb-1.5 block font-bold uppercase'

export function Labeled({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('min-w-0', className)}>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="text-meta text-text-faint mt-1.5">{hint}</p> : null}
    </div>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputClass, props.className)} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={cx(inputClass, 'h-auto py-3 leading-relaxed', props.className)}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(inputClass, 'bg-input', props.className)} />
}

/* null | true | false, as '' | 'true' | 'false' on the wire. */
export function TriState({
  name,
  id,
  defaultValue,
  yes = 'Yes',
  no = 'No',
}: {
  name: string
  id?: string
  defaultValue: boolean | null | undefined
  yes?: string
  no?: string
}) {
  const v = defaultValue == null ? '' : defaultValue ? 'true' : 'false'
  return (
    <Select name={name} id={id ?? name} defaultValue={v}>
      <option value="">Not known</option>
      <option value="true">{yes}</option>
      <option value="false">{no}</option>
    </Select>
  )
}

/* A titled group on a long form, with an id so a "what is missing" list can
   link straight to it.

   The title stays a <legend> so the group keeps its name for a screen reader,
   but a legend by default sits on the fieldset's top border, half outside the
   card. Floating it makes the browser lay it out as an ordinary block inside
   the padding; the note and the grid clear it so they stack underneath. */
export function Fieldset({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <fieldset
      id={id}
      className="bg-surface border-border scroll-mt-24 rounded-card-lg border p-5.5"
    >
      <legend className="font-display text-display-sm float-left w-full p-0">{title}</legend>
      {note ? <p className="text-body-sm text-text-muted clear-both mt-1 mb-0">{note}</p> : null}
      <div className="clear-both grid gap-3.5 pt-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

/* ─── Skeleton ───────────────────────────────────────────────────────────
   A placeholder for something that has not arrived yet — today, remote venue
   photographs, which come off two dozen other people's web servers through
   our optimizer and are the slowest thing on an outing page.

   It is decorative, so it is aria-hidden: whatever it stands in for carries
   its own name once it lands, and a screen reader should not be told about
   the wait.

   The pulse is Tailwind's own `animate-pulse`, deliberately not a new
   keyframe — globals.css says the design has exactly one and to keep it that
   way. */

export function Skeleton({
  className,
  /* `dark` is for the photo viewer, the one place a skeleton sits on the dim
     backdrop rather than on one of our pale surfaces. A page-tone block there
     is a slab of light in a darkened room. */
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <span
      aria-hidden
      className={cx(
        'block animate-pulse',
        tone === 'dark' ? 'bg-white/10' : 'bg-border',
        className,
      )}
    />
  )
}
