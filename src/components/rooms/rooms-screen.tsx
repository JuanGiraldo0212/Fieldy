'use client'

import { useActionState, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { archiveRoom, restoreRoom, type RoomState } from '@/app/rooms/actions'
import { RoomDialog, ROOM_ICONS, type EditableRoom, type RoomIcon } from './room-dialog'
import { cx } from '@/components/ui'

/*
  "Group profiles" — the design's own word for rooms, and what a director calls
  them. `room` stays the name in code and in the database.
*/

const TRANSPORT_LABEL: Record<string, string> = {
  walking: 'Walking',
  bus: 'Bus',
  parent_drivers: 'Parent drivers',
  none: 'None',
}

export function RoomsScreen({
  rooms,
  centreAddress,
  activeRoomId,
}: {
  rooms: EditableRoom[]
  centreAddress: string
  activeRoomId: string | null
}) {
  const [editing, setEditing] = useState<EditableRoom | null | undefined>(undefined)
  const [archiveState, archive] = useActionState<RoomState, FormData>(archiveRoom, {})
  const [, restore] = useActionState<RoomState, FormData>(restoreRoom, {})

  const live = rooms.filter((r) => !r.archivedAt)
  const archived = rooms.filter((r) => r.archivedAt)

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start gap-5">
        <div className="min-w-0 flex-1 basis-[320px]">
          <h1 className="font-display text-display-lg m-0">Group profiles</h1>
          <p className="text-body text-text-muted mt-2">
            One per room. Everything else in the app filters from these.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="border-border-strong bg-surface hover:border-brand text-body text-brand flex items-center gap-2.5 rounded-card border px-5 py-3.5 font-semibold"
        >
          <Plus size={18} />
          Add a room
        </button>
      </div>

      {archiveState.error ? (
        <p className="bg-warn-tint text-warn text-body-sm mb-4 rounded-control px-4 py-3" role="alert">
          {archiveState.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {live.map((r) => {
          const { Icon, tint, ink } = ROOM_ICONS[r.icon as RoomIcon] ?? ROOM_ICONS.users
          const isActive = r.id === activeRoomId
          return (
            <div key={r.id} className="bg-surface border-border rounded-panel border p-6 sm:px-7 sm:py-6.5">
              <div className="flex flex-wrap items-center gap-5">
                <span className={cx('flex h-room-avatar w-room-avatar flex-none items-center justify-center rounded-pill', tint, ink)}>
                  <Icon size={24} />
                </span>
                <h2 className="font-display text-room m-0 flex-1 basis-[200px]">{r.name}</h2>

                {isActive ? (
                  <span className="bg-success-tint text-success text-body-sm rounded-pill px-4.5 py-2.5 font-semibold">
                    In use
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={() => setEditing(r)}
                  className="border-border-strong bg-surface hover:border-brand text-body-sm text-brand rounded-pill border px-4.5 py-2.5 font-semibold"
                >
                  Edit
                </button>

                <form action={archive}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-muted rounded-pill border px-4.5 py-2.5 font-semibold"
                  >
                    Archive
                  </button>
                </form>
              </div>

              <div className="border-border-soft mt-5.5 grid grid-cols-2 gap-5 border-t pt-5 sm:grid-cols-4">
                <Stat label="Ages" value={`${r.ageMin} to ${r.ageMax}`} />
                <Stat label="Children" value={String(r.size)} />
                <Stat label="Adults needed" value={String(Math.ceil(r.size / r.ratioChildrenPerAdult))} />
                <Stat
                  label="Budget"
                  value={r.budgetPerChild ? `$${Number(r.budgetPerChild)} each` : 'Not set'}
                />
              </div>

              <div className="border-border-soft mt-5 flex items-center gap-3.5 border-t pt-5">
                <span className={cx('flex h-avatar w-avatar flex-none items-center justify-center rounded-pill', tint, ink)}>
                  <MapPin size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-label text-text-muted font-bold uppercase">Home base</div>
                  <div className="text-address mt-1">{r.address}</div>
                </div>
              </div>

              <p className="text-meta text-text-faint mt-3">
                Travels by {r.transport.map((t) => TRANSPORT_LABEL[t] ?? t).join(', ').toLowerCase()}.
                One adult for every {r.ratioChildrenPerAdult} children.
              </p>

              {r.notes ? (
                <div className="border-border-soft mt-5 border-t pt-5">
                  <div className="text-label text-text-muted font-bold uppercase">Notes</div>
                  <div className="text-address text-text-strong mt-1.5 leading-relaxed text-pretty">
                    {r.notes}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Archived rooms are kept and shown, because a trip that used one still
          names it. Hiding them entirely would make an old trip refer to a room
          the director cannot find. */}
      {archived.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-display text-display-sm">Archived</h2>
          <p className="text-body-sm text-text-muted mt-1">
            Kept because trips that used them still show their name and numbers.
            They do not appear when you plan.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {archived.map((r) => (
              <div
                key={r.id}
                className="bg-surface-2 border-border flex flex-wrap items-center gap-4 rounded-card border px-5 py-4"
              >
                <span className="text-body-sm text-text-muted flex-1 font-semibold">
                  {r.name} <span className="font-normal">(archived)</span>
                </span>
                <form action={restore}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="border-border-strong bg-surface hover:border-brand text-body-sm text-brand rounded-pill border px-4 py-2 font-semibold"
                  >
                    Bring it back
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {editing !== undefined ? (
        <RoomDialog
          key={editing?.id ?? 'new'}
          room={editing}
          centreAddress={centreAddress}
          onClose={() => setEditing(undefined)}
        />
      ) : null}
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-label text-text-muted font-bold uppercase">{label}</div>
      <div className="text-stat mt-2 font-semibold">{value}</div>
    </div>
  )
}
