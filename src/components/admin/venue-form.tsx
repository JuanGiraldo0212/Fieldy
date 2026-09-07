'use client'

import { useActionState, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { saveVenue, type AdminState } from '@/app/admin/actions'
import { AddressField } from '@/components/ui/address-field'
import {
  Fieldset,
  Input,
  Labeled,
  Select,
  TextArea,
  TriState,
} from '@/components/ui'
import {
  BOOKING_METHODS,
  FACILITY_FIELDS,
  VENUE_CATEGORIES,
  facilityNote,
} from '@/lib/catalog/options'
import { slugify } from '@/lib/catalog/slug'

export type VenueFormValues = {
  id: string
  name: string
  category: string
  website: string | null
  description: string | null
  address: string | null
  lat: number | null
  lng: number | null
  nearbyPark: string | null
  hostsSchoolGroups: boolean | null
  hostsDaycareGroups: boolean | null
  youngestAgeWelcomedYears: number | null
  languages: string[] | null
  restrictions: string[] | null
  bookingEmail: string | null
  bookingPhone: string | null
  bookingUrl: string | null
  bookingMethod: string | null
  hasWashrooms: boolean | null
  hasLunchSpace: boolean | null
  hasRainBackup: boolean | null
  strollerAccessible: boolean | null
  wheelchairAccessible: boolean | null
  busParking: boolean | null
  facilityNotes: Record<string, string> | null
  generalAdmissionChildCad: string | null
  generalAdmissionAdultCad: string | null
  priceYearOrSeason: string | null
  hoursNotes: string | null
  seasonalNotes: string | null
}

const EMPTY: VenueFormValues = {
  id: '',
  name: '',
  category: 'museums_history',
  website: null,
  description: null,
  address: null,
  lat: null,
  lng: null,
  nearbyPark: null,
  hostsSchoolGroups: null,
  hostsDaycareGroups: null,
  youngestAgeWelcomedYears: null,
  languages: null,
  restrictions: null,
  bookingEmail: null,
  bookingPhone: null,
  bookingUrl: null,
  bookingMethod: null,
  hasWashrooms: null,
  hasLunchSpace: null,
  hasRainBackup: null,
  strollerAccessible: null,
  wheelchairAccessible: null,
  busParking: null,
  facilityNotes: null,
  generalAdmissionChildCad: null,
  generalAdmissionAdultCad: null,
  priceYearOrSeason: null,
  hoursNotes: null,
  seasonalNotes: null,
}

/*
  The venue's own facts, grouped the way the outing page shows them. Each
  fieldset has an id so the "to ask" panel can link straight to the row the
  phone call just answered.
*/
export function VenueForm({
  mode,
  values = EMPTY,
}: {
  mode: 'new' | 'edit'
  values?: VenueFormValues
}) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveVenue, {})
  const [name, setName] = useState(values.name)
  const [id, setId] = useState(values.id)
  const [idTouched, setIdTouched] = useState(mode === 'edit')
  const v = values

  return (
    <form action={action} className="mt-3 grid gap-4">
      <input type="hidden" name="mode" value={mode} />
      {mode === 'edit' ? <input type="hidden" name="id" value={v.id} /> : null}

      <Fieldset id="basics" title="Basics">
        <Labeled label="Name" htmlFor="name" className="sm:col-span-2">
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!idTouched) setId(slugify(e.target.value))
            }}
          />
        </Labeled>

        {mode === 'new' ? (
          <Labeled
            label="Id"
            htmlFor="id"
            hint="Goes in every link to this venue and cannot change later."
          >
            <Input
              id="id"
              name="id"
              value={id}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              onChange={(e) => {
                setIdTouched(true)
                setId(e.target.value)
              }}
            />
          </Labeled>
        ) : null}

        <Labeled label="Category" htmlFor="category">
          <Select id="category" name="category" defaultValue={v.category}>
            {VENUE_CATEGORIES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Labeled>

        <Labeled label="Website" htmlFor="website">
          <Input id="website" name="website" type="url" defaultValue={v.website ?? ''} placeholder="https://" />
        </Labeled>

        <Labeled label="Description" htmlFor="description" className="sm:col-span-2">
          <TextArea id="description" name="description" maxLength={2000} defaultValue={v.description ?? ''} />
        </Labeled>

        <Labeled label="Hosts school groups" htmlFor="hostsSchoolGroups">
          <TriState name="hostsSchoolGroups" defaultValue={v.hostsSchoolGroups} />
        </Labeled>
        <Labeled label="Hosts daycare groups" htmlFor="hostsDaycareGroups">
          <TriState name="hostsDaycareGroups" defaultValue={v.hostsDaycareGroups} />
        </Labeled>

        <Labeled label="Youngest age welcomed (years)" htmlFor="youngestAgeWelcomedYears">
          <Input
            id="youngestAgeWelcomedYears"
            name="youngestAgeWelcomedYears"
            type="number"
            min={0}
            max={18}
            step={0.5}
            defaultValue={v.youngestAgeWelcomedYears ?? ''}
          />
        </Labeled>

        <Labeled label="Languages" htmlFor="languages" hint="Comma separated.">
          <Input id="languages" name="languages" defaultValue={v.languages?.join(', ') ?? ''} />
        </Labeled>

        <Labeled
          label="Restrictions"
          htmlFor="restrictions"
          hint="One per line. No food in the gallery, closed-toe shoes, that sort of thing."
          className="sm:col-span-2"
        >
          <TextArea id="restrictions" name="restrictions" maxLength={2000} defaultValue={v.restrictions?.join('\n') ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset
        id="location"
        title="Where it is"
        note="Every distance, the travel filter and both maps read the point behind this address. Pick from the list when you can."
      >
        <div className="sm:col-span-2">
          <AddressField
            defaultValue={v.address ?? ''}
            hint={
              v.lat != null && v.lng != null
                ? `On the map at ${v.lat.toFixed(5)}, ${v.lng.toFixed(5)}.`
                : 'Not on the map yet.'
            }
          />
        </div>
        <Labeled
          label="Nearby park"
          htmlFor="nearbyPark"
          hint="Somewhere to run around before or after."
          className="sm:col-span-2"
        >
          <Input id="nearbyPark" name="nearbyPark" defaultValue={v.nearbyPark ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset
        id="booking"
        title="How to book"
        note="Fieldy sends the request to this email. Without an email or a phone number, a director cannot book the venue at all."
      >
        <Labeled label="Booking email" htmlFor="bookingEmail">
          <Input id="bookingEmail" name="bookingEmail" type="email" defaultValue={v.bookingEmail ?? ''} />
        </Labeled>
        <Labeled label="Booking phone" htmlFor="bookingPhone">
          <Input id="bookingPhone" name="bookingPhone" defaultValue={v.bookingPhone ?? ''} />
        </Labeled>
        <Labeled label="Booking link" htmlFor="bookingUrl">
          <Input id="bookingUrl" name="bookingUrl" type="url" defaultValue={v.bookingUrl ?? ''} placeholder="https://" />
        </Labeled>
        <Labeled label="They prefer" htmlFor="bookingMethod">
          <Select id="bookingMethod" name="bookingMethod" defaultValue={v.bookingMethod ?? ''}>
            <option value="">Not known</option>
            {BOOKING_METHODS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Labeled>
      </Fieldset>

      <Fieldset
        id="facilities"
        title="On the day"
        note="The practical list on the outing page. A note beats a yes: “Beside the studio, change table” tells a director more than “Yes”. Not known renders as “Needs confirmation” and becomes an ask on the request."
      >
        {FACILITY_FIELDS.map((f) => (
          <div key={f.key} className="grid gap-2 sm:col-span-2 sm:grid-cols-[200px_1fr]">
            <Labeled label={f.label} htmlFor={f.key}>
              <TriState name={f.key} defaultValue={v[f.key]} yes={f.yes} no={f.no} />
            </Labeled>
            <Labeled label="Note" htmlFor={`note_${f.key}`}>
              <Input
                id={`note_${f.key}`}
                name={`note_${f.key}`}
                defaultValue={facilityNote(v.facilityNotes, f.noteKeys) ?? ''}
                placeholder="Optional. What they actually said."
              />
            </Labeled>
          </div>
        ))}
      </Fieldset>

      <Fieldset id="prices" title="General admission" note="What a walk-in pays. Program prices live on each program.">
        <Labeled label="Child (CAD)" htmlFor="generalAdmissionChildCad">
          <Input id="generalAdmissionChildCad" name="generalAdmissionChildCad" type="number" min={0} step={0.01} defaultValue={v.generalAdmissionChildCad ?? ''} />
        </Labeled>
        <Labeled label="Adult (CAD)" htmlFor="generalAdmissionAdultCad">
          <Input id="generalAdmissionAdultCad" name="generalAdmissionAdultCad" type="number" min={0} step={0.01} defaultValue={v.generalAdmissionAdultCad ?? ''} />
        </Labeled>
        <Labeled label="Prices are for" htmlFor="priceYearOrSeason" hint="A year or a season, as the venue writes it: 2026, or Summer 2026.">
          <Input id="priceYearOrSeason" name="priceYearOrSeason" defaultValue={v.priceYearOrSeason ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset id="hours" title="Hours and season">
        <Labeled label="Hours" htmlFor="hoursNotes" className="sm:col-span-2">
          <TextArea id="hoursNotes" name="hoursNotes" maxLength={1000} defaultValue={v.hoursNotes ?? ''} />
        </Labeled>
        <Labeled label="Seasonal notes" htmlFor="seasonalNotes" className="sm:col-span-2">
          <TextArea id="seasonalNotes" name="seasonalNotes" maxLength={1000} defaultValue={v.seasonalNotes ?? ''} />
        </Labeled>
      </Fieldset>

      <SaveRow state={state} pending={pending} label={mode === 'new' ? 'Create venue' : 'Save venue'} />
    </form>
  )
}

/* Shared by the venue and program forms: the error, the notice, "Saved", and
   the button. Sticky at the bottom, because the forms are long and the
   button should never be a scroll away from the row just changed. */
export function SaveRow({
  state,
  pending,
  label,
}: {
  state: AdminState
  pending: boolean
  label: string
}) {
  return (
    <div className="bg-bg sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-border px-5 py-3">
      {state.error ? (
        <p className="bg-warn-tint text-warn text-body-sm m-0 flex-1 rounded-control px-4 py-2.5" role="alert">
          {state.error}
        </p>
      ) : state.notice ? (
        <p className="bg-warn-tint text-warn text-body-sm m-0 flex-1 rounded-control px-4 py-2.5">
          {state.notice}
        </p>
      ) : state.ok ? (
        <p key={state.at} className="bg-success-tint text-success text-body-sm m-0 flex flex-1 items-center gap-2.5 rounded-control px-4 py-2.5">
          <CircleCheck size={18} />
          Saved.
        </p>
      ) : (
        <span className="flex-1" />
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-solid hover:bg-brand-solid-hover text-body h-control-lg rounded-control px-6 font-bold text-white disabled:opacity-60"
      >
        {pending ? 'Saving' : label}
      </button>
    </div>
  )
}
