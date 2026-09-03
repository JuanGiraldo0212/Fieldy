'use client'

import { useActionState, useState } from 'react'
import { createCentreAndRoom, type SetupState } from './actions'
import { CheckRow, Field, FieldBox } from '@/components/ui'

/*
  One screen, not a wizard. Spec §5.3 says the plan screen is one screen and
  not a wizard, and the same reasoning holds harder here: this is the very
  first thing a director does, and a three-step flow with a progress bar is a
  worse first impression than eight fields she can see all of.

  Defaults are the design's own anonymous defaults, so the form arrives mostly
  filled in and she corrects rather than composes.
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

const TRANSPORT: [string, string][] = [
  ['walking', 'Walking'],
  ['bus', 'Bus'],
  ['parent_drivers', 'Parent drivers'],
]

export function SetupForm({
  next,
  defaultName,
}: {
  next: string
  defaultName: string
}) {
  const [state, action, pending] = useActionState<SetupState, FormData>(
    createCentreAndRoom,
    {},
  )
  const [transport, setTransport] = useState<string[]>(['bus'])

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="next" value={next} />
      {transport.map((t) => (
        <input key={t} type="hidden" name="transport" value={t} />
      ))}

      <section className="bg-surface border-border rounded-panel border p-6">
        <h2 className="font-display text-display-sm">You</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Your name">
            <FieldBox>
              <input
                name="name"
                required
                defaultValue={defaultName}
                placeholder="Dana Mireau"
                className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Your role">
            <FieldBox>
              <select
                name="role"
                defaultValue="director"
                className="text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
              >
                {ROLES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </FieldBox>
          </Field>
        </div>
        <p className="text-meta text-text-faint mt-2">
          Your name goes on the request, so the venue knows who is asking.
        </p>
      </section>

      <section className="bg-surface border-border mt-4 rounded-panel border p-6">
        <h2 className="font-display text-display-sm">Your centre</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Centre or school">
            <FieldBox>
              <input
                name="centreName"
                required
                placeholder="Garry Oak Childcare"
                className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Type of centre">
            <FieldBox>
              <select
                name="centreType"
                defaultValue="daycare_preschool"
                className="text-body-sm h-select w-full cursor-pointer appearance-none border-0 bg-transparent font-semibold outline-none"
              >
                {CENTRE_TYPES.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </FieldBox>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Address">
            <FieldBox>
              <input
                name="address"
                required
                placeholder="1148 Fairfield Rd, Victoria"
                className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
              />
            </FieldBox>
          </Field>
          <p className="text-meta text-text-faint mt-2">
            Every distance and travel time is measured from here, so a street
            number helps.
          </p>
        </div>
      </section>

      <section className="bg-surface border-border mt-4 rounded-panel border p-6">
        <h2 className="font-display text-display-sm">Your first room</h2>
        <p className="text-body-sm text-text-muted mt-1">
          One room is enough to start. Add the others whenever you like.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Room name">
            <FieldBox>
              <input
                name="roomName"
                required
                defaultValue="Preschool room"
                className="text-body-sm w-full border-0 bg-transparent font-semibold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Children in the room">
            <FieldBox>
              <input
                name="size"
                type="number"
                min={1}
                required
                defaultValue={16}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Youngest age">
            <FieldBox>
              <input
                name="ageMin"
                type="number"
                min={0}
                max={18}
                required
                defaultValue={3}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Oldest age">
            <FieldBox>
              <input
                name="ageMax"
                type="number"
                min={0}
                max={18}
                required
                defaultValue={5}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Children per adult">
            <FieldBox>
              <input
                name="ratio"
                type="number"
                min={1}
                required
                defaultValue={8}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
              />
            </FieldBox>
          </Field>
          <Field label="Budget per child">
            <FieldBox>
              <span className="text-text-faint">$</span>
              <input
                name="budget"
                type="number"
                min={0}
                step="0.5"
                required
                defaultValue={10}
                className="text-body-sm w-full border-0 bg-transparent font-bold outline-none"
              />
            </FieldBox>
          </Field>
        </div>
        <p className="text-meta text-text-faint mt-2">
          This is the licensed ratio for this room. We never average it across
          rooms, so a multi-room trip adds each room&rsquo;s adults separately.
        </p>

        <div className="mt-4">
          <div className="text-label text-text-muted mb-1.5 font-bold uppercase">
            How you travel
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
      </section>

      {state.error ? (
        <p
          className="bg-warn-tint text-warn text-body-sm mt-4 rounded-control px-4 py-3"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || transport.length === 0}
        className="bg-brand-solid hover:bg-brand-solid-hover text-body mt-5 h-control-lg w-full rounded-control font-bold text-white disabled:opacity-60"
      >
        {pending ? 'Setting up' : 'Save and start planning'}
      </button>
    </form>
  )
}
