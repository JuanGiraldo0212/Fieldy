'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Baby, Backpack, GraduationCap, Users, X } from 'lucide-react'
import { saveRoom, type RoomState } from '@/app/rooms/actions'
import { CheckRow, Field, FieldBox, cx } from '@/components/ui'
import { AddressField } from '@/components/ui/address-field'

/*
  The room editor. The design has it as a modal over the Group profiles screen
  rather than its own route, so it is one here too.

  Native <dialog>, and React state is the only thing that decides whether it is
  open. Nothing calls el.close(); every exit route calls onClose. The photo
  viewer learned that the hard way: letting the element close itself and
  syncing state back from the `close` event leaves the component
  mounted-but-closed when the event does not arrive, after which reopening does
  nothing at all.
*/

export const ROOM_ICONS = {
  baby: { Icon: Baby, tint: 'bg-room-baby', ink: 'text-room-baby-ink' },
  backpack: { Icon: Backpack, tint: 'bg-room-backpack', ink: 'text-room-backpack-ink' },
  cap: { Icon: GraduationCap, tint: 'bg-room-cap', ink: 'text-room-cap-ink' },
  users: { Icon: Users, tint: 'bg-room-users', ink: 'text-room-users-ink' },
} as const

export type RoomIcon = keyof typeof ROOM_ICONS

const TRANSPORT: [string, string][] = [
  ['walking', 'Walking'],
  ['bus', 'Bus'],
  ['parent_drivers', 'Parent drivers'],
]

export type EditableRoom = {
  id: string
  name: string
  icon: RoomIcon
  ageMin: number
  ageMax: number
  size: number
  ratioChildrenPerAdult: number
  budgetPerChild: string | null
  transport: string[]
  address: string
  notes: string | null
  archivedAt: Date | null
}

const NOTES_MAX = 300

export function RoomDialog({
  room,
  centreAddress,
  onClose,
}: {
  /* null means "new room" */
  room: EditableRoom | null
  centreAddress: string
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState<RoomState, FormData>(saveRoom, {})
  const [icon, setIcon] = useState<RoomIcon>(room?.icon ?? 'users')
  const [transport, setTransport] = useState<string[]>(
    room?.transport?.length ? room.transport : ['bus'],
  )
  const [notes, setNotes] = useState(room?.notes ?? '')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!el.open) el.showModal()
    const onCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }
    el.addEventListener('cancel', onCancel)
    return () => el.removeEventListener('cancel', onCancel)
  }, [onClose])

  /* A successful save closes the dialog. The action revalidates, so the list
     behind it is already correct by the time it disappears. */
  useEffect(() => {
    if (state.ok) onClose()
  }, [state.ok, onClose])

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-label={room ? `Edit ${room.name}` : 'Add a room'}
      className="bg-transparent p-0 backdrop:bg-[rgb(22_32_43_/_0.42)] open:fixed open:inset-0 open:m-auto open:max-h-none open:w-full open:max-w-[min(560px,94vw)]"
    >
      <form
        action={action}
        className="bg-surface shadow-modal max-h-[92vh] overflow-y-auto rounded-panel p-6"
      >
        {room ? <input type="hidden" name="id" value={room.id} /> : null}
        <input type="hidden" name="icon" value={icon} />
        {transport.map((t) => (
          <input key={t} type="hidden" name="transport" value={t} />
        ))}

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-display-sm m-0">
            {room ? 'Edit room' : 'New room'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-text-muted hover:text-text flex h-9 w-9 items-center justify-center rounded-pill"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <div className="text-label text-text-muted mb-2 font-bold uppercase">
            Room icon
          </div>
          <div className="flex gap-2.5">
            {(Object.keys(ROOM_ICONS) as RoomIcon[]).map((key) => {
              const { Icon, tint, ink } = ROOM_ICONS[key]
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={icon === key}
                  aria-label={key}
                  onClick={() => setIcon(key)}
                  className={cx(
                    'flex h-avatar w-avatar items-center justify-center rounded-pill',
                    tint,
                    ink,
                    icon === key && 'ring-[2px] ring-[var(--color-brand)] ring-inset',
                  )}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Room name" className="sm:col-span-2">
            <FieldBox>
              <input
                name="name"
                required
                defaultValue={room?.name ?? ''}
                placeholder="Preschool room"
                className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
              />
            </FieldBox>
          </Field>

          <Field label="Youngest age">
            <FieldBox>
              <input name="ageMin" type="number" min={0} max={18} required
                defaultValue={room?.ageMin ?? 3}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none" />
            </FieldBox>
          </Field>
          <Field label="Oldest age">
            <FieldBox>
              <input name="ageMax" type="number" min={0} max={18} required
                defaultValue={room?.ageMax ?? 5}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none" />
            </FieldBox>
          </Field>
          <Field label="Children in the room">
            <FieldBox>
              <input name="size" type="number" min={1} required
                defaultValue={room?.size ?? 16}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none" />
            </FieldBox>
          </Field>
          <Field label="Children per adult">
            <FieldBox>
              <input name="ratio" type="number" min={1} required
                defaultValue={room?.ratioChildrenPerAdult ?? 8}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none" />
            </FieldBox>
          </Field>
          <Field label="Budget per child">
            <FieldBox>
              <span className="text-text-faint">$</span>
              <input name="budget" type="number" min={0} step="0.5" required
                defaultValue={room?.budgetPerChild ?? 10}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none" />
            </FieldBox>
          </Field>
          <div className="sm:col-span-2">
            <AddressField
              label="Home base"
              required
              defaultValue={room?.address ?? centreAddress}
              hint="Where this room leaves from, if it differs from the centre."
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="text-label text-text-muted mb-1.5 font-bold uppercase">
            How this room travels
          </div>
          {TRANSPORT.map(([v, l]) => (
            <CheckRow
              key={v}
              checked={transport.includes(v)}
              onChange={() =>
                setTransport((t) =>
                  t.includes(v) ? t.filter((x) => x !== v) : [...t, v],
                )
              }
            >
              {l}
            </CheckRow>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-label text-text-muted mb-1.5 font-bold uppercase">
            Notes
          </div>
          <textarea
            name="notes"
            rows={3}
            maxLength={NOTES_MAX}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Naps, allergies, who drives, anything the app should remember"
            className="border-border-strong bg-surface text-body-sm w-full rounded-control border p-3 outline-none"
          />
          <div className="text-meta-sm text-text-faint mt-1 text-right">
            {notes.length} / {NOTES_MAX}
          </div>
        </div>

        {state.error ? (
          <p className="bg-warn-tint text-warn text-body-sm mt-3 rounded-control px-4 py-3" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || transport.length === 0}
            className="bg-brand-solid hover:bg-brand-solid-hover text-body-sm rounded-pill px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            {pending ? 'Saving' : room ? 'Save changes' : 'Create room'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-body-sm text-text-muted font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}
