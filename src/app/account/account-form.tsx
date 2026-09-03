'use client'

import { useActionState, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { saveAccount, type AccountState } from './actions'
import { cx } from '@/components/ui'

/*
  The account screen. spec §5.10.

  The relay explainer is the important half. A director is about to let us send
  mail in her name, and she should understand exactly what that means before it
  happens, not after a venue replies to an address she does not recognise.
*/

const ROLES: [string, string][] = [
  ['director', 'Director'],
  ['ece', 'ECE'],
  ['teacher', 'Teacher'],
  ['other', 'Other'],
]

const CENTRE_TYPES: [string, string][] = [
  ['daycare_preschool', 'Daycare or preschool'],
  ['elementary', 'Elementary'],
  ['middle', 'Middle school'],
  ['secondary', 'Secondary'],
  ['other', 'Other'],
]

/* Which rates a centre sees, and why. The design's own copy. */
const TYPE_NOTE: Record<string, string> = {
  daycare_preschool:
    'Venue school rates often do not apply, so we flag those and you can ask for a quote.',
  elementary: 'School and district rates apply, and grade-based programs are shown as published.',
  middle: 'School and district rates apply, and grade-based programs are shown as published.',
  secondary: 'School and district rates apply, and grade-based programs are shown as published.',
  other: 'We will show every rate we have and flag the ones written for schools.',
}

export function AccountForm({
  name,
  email,
  role,
  phone,
  centreName,
  centreType,
  address,
  notifications,
}: {
  name: string
  email: string
  role: string
  phone: string
  centreName: string
  centreType: string
  address: string
  notifications: boolean
}) {
  const [state, action, pending] = useActionState<AccountState, FormData>(saveAccount, {})
  const [pickedRole, setPickedRole] = useState(role)
  const [pickedType, setPickedType] = useState(centreType)
  const [notify, setNotify] = useState(notifications)

  const field =
    'border-border-strong bg-input text-body h-field w-full rounded-control border px-3.5 outline-none focus:border-brand'
  const label = 'text-label text-text-muted mb-1.5 block font-bold uppercase'

  return (
    <form action={action}>
      <input type="hidden" name="role" value={pickedRole} />
      <input type="hidden" name="centreType" value={pickedType} />
      {notify ? <input type="hidden" name="notifications" value="on" /> : null}

      <div className="bg-surface border-border flex flex-col gap-3.5 rounded-card-lg border p-5.5">
        <div>
          <label className={label} htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={name} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" value={email} readOnly disabled className={cx(field, 'text-text-muted')} />
          <p className="text-meta text-text-faint mt-1.5">
            This is how you sign in, so it cannot be changed here. Write to us if
            you need to move it.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={phone} placeholder="250-555-0184" className={field} />
          <p className="text-meta text-text-faint mt-1.5">
            Optional. We offer it to the venue as a second way to reach you.
          </p>
        </div>

        <div>
          <span className={label}>Role</span>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map(([v, l]) => (
              <Pill key={v} active={pickedRole === v} onClick={() => setPickedRole(v)}>
                {l}
              </Pill>
            ))}
          </div>
        </div>

        <div>
          <span className={label}>Type of centre</span>
          <div className="flex flex-wrap gap-1.5">
            {CENTRE_TYPES.map(([v, l]) => (
              <Pill key={v} active={pickedType === v} onClick={() => setPickedType(v)}>
                {l}
              </Pill>
            ))}
          </div>
          <p className="text-meta text-text-muted mt-2 leading-normal">
            {TYPE_NOTE[pickedType]}
          </p>
        </div>

        <div>
          <label className={label} htmlFor="centreName">Centre or school</label>
          <input id="centreName" name="centreName" required defaultValue={centreName} className={field} />
        </div>

        <div>
          <label className={label} htmlFor="address">Address</label>
          <input id="address" name="address" required defaultValue={address} className={field} />
          <p className="text-meta text-text-faint mt-1.5">
            Every distance is measured from here. Rooms can have their own if
            they leave from somewhere else.
          </p>
        </div>
      </div>

      {/* Copy per docs/design-map.md §7.1: the design promises forwarded
          copies, but the relay is send-only, so this says what actually
          happens. */}
      <div className="bg-relay-tint border-note-border mt-3.5 rounded-card-lg border p-5.5">
        <h2 className="font-display m-0 text-[19px]">How your requests are sent</h2>
        <p className="text-body-sm text-text-strong mt-2 leading-relaxed text-pretty">
          Requests are sent from your name through a Fieldy address. The venue
          sees your name and centre, and your email is in the message so they
          can always reach you directly. Their replies come back here, and we
          email you when one arrives.
        </p>

        <button
          type="button"
          onClick={() => setNotify((v) => !v)}
          aria-pressed={notify}
          className="mt-4 flex w-full items-center gap-3 text-left"
        >
          <span className="text-body-sm flex-1 font-semibold">
            Email me when a venue replies
          </span>
          <span
            className={cx(
              'flex h-[30px] w-[52px] items-center rounded-pill p-[3px] transition-colors',
              notify ? 'bg-brand justify-end' : 'bg-border-strong justify-start',
            )}
          >
            <span className="bg-surface h-6 w-6 rounded-pill" />
          </span>
        </button>
      </div>

      {state.error ? (
        <p className="bg-warn-tint text-warn text-body-sm mt-3.5 rounded-control px-4 py-3" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.saved ? (
        <p className="bg-success-tint text-success text-body-sm mt-3.5 flex items-center gap-2.5 rounded-control px-4 py-3">
          <CircleCheck size={18} />
          Saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-solid hover:bg-brand-solid-hover text-body mt-4 h-control-lg w-full rounded-control font-bold text-white disabled:opacity-60"
      >
        {pending ? 'Saving' : 'Save and keep planning'}
      </button>
    </form>
  )
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'text-body-sm rounded-pill border px-3.5 py-2.5 font-semibold',
        active
          ? 'bg-brand-tint-2 border-brand border-[1.5px]'
          : 'border-border-strong bg-input hover:border-brand',
      )}
    >
      {children}
    </button>
  )
}
