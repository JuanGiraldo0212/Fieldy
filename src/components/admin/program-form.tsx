'use client'

import { useActionState, useState } from 'react'
import { saveProgram, type AdminState } from '@/app/admin/actions'
import type { ProgramFormValues } from '@/lib/catalog/admin-forms'
import {
  Fieldset,
  Input,
  Labeled,
  Select,
  TextArea,
  TriState,
} from '@/components/ui'
import {
  AGE_BASES,
  BOOKING_METHODS,
  MONTHS,
  MOOD_TAGS,
  PROGRAM_FORMATS,
  WEEKDAYS,
} from '@/lib/catalog/options'
import { slugify } from '@/lib/catalog/slug'
import { SaveRow } from './venue-form'

const EMPTY: ProgramFormValues = {
  slug: '',
  name: '',
  active: true,
  comesToYou: false,
  description: null,
  whatChildrenDo: null,
  ourNote: null,
  practicalSummary: null,
  ageBasis: null,
  ageMinYears: null,
  ageMaxYears: null,
  gradeMin: null,
  gradeMax: null,
  durationMin: null,
  capacityMin: null,
  capacityMax: null,
  leadTimeDays: null,
  costPerChildCad: null,
  costPerGroupCad: null,
  costPerAdultCad: null,
  freeAdultsPerChildren: null,
  isFree: null,
  taxIncluded: null,
  extraFeesNote: null,
  schoolRateOnly: false,
  depositRequired: null,
  paymentTiming: null,
  cancellationNote: null,
  adultsFree: null,
  chaperoneChildrenPerAdult: null,
  chaperoneAppliesTo: null,
  chaperoneHasMore: false,
  monthsOffered: null,
  daysOffered: null,
  timeSlots: null,
  indoor: null,
  outdoor: null,
  format: null,
  sensoryFriendly: null,
  lowNoise: null,
  neurodiversityFriendly: null,
  moodTags: null,
  curriculumTags: null,
  bookingEmail: null,
  bookingUrl: null,
  bookingMethod: null,
  sourceUrl: null,
  evidence: null,
}

/*
  Fieldset ids match the completeness keys (age, cost, duration, capacity,
  lead, days) so the venue page's "to ask" list lands on the right group.
*/
export function ProgramForm({
  mode,
  venueId,
  values = EMPTY,
}: {
  mode: 'new' | 'edit'
  venueId: string
  values?: ProgramFormValues
}) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveProgram, {})
  const [name, setName] = useState(values.name)
  const [slug, setSlug] = useState(values.slug)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [basis, setBasis] = useState(values.ageBasis ?? '')
  const v = values

  return (
    <form action={action} className="mt-3 grid gap-4">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="venueId" value={venueId} />
      {mode === 'edit' ? <input type="hidden" name="slug" value={v.slug} /> : null}

      <Fieldset id="basics" title="Basics">
        <Labeled label="Name" htmlFor="name" className="sm:col-span-2">
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
          />
        </Labeled>

        {mode === 'new' ? (
          <Labeled label="Id" htmlFor="slug" hint="Goes in the link to this program and cannot change later.">
            <Input
              id="slug"
              name="slug"
              value={slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
            />
          </Labeled>
        ) : null}

        <div className="grid gap-2">
          <Check name="active" label="Show in the catalog" defaultChecked={v.active} />
          <Check name="comesToYou" label="Comes to the centre (no travel)" defaultChecked={v.comesToYou} />
        </div>

        <Labeled label="Description" htmlFor="description" className="sm:col-span-2">
          <TextArea id="description" name="description" maxLength={2000} defaultValue={v.description ?? ''} />
        </Labeled>
        <Labeled label="What children do" htmlFor="whatChildrenDo" className="sm:col-span-2">
          <TextArea id="whatChildrenDo" name="whatChildrenDo" maxLength={2000} defaultValue={v.whatChildrenDo ?? ''} />
        </Labeled>
        <Labeled
          label="Our note"
          htmlFor="ourNote"
          hint="Our own voice on the outing page. The one thing a director should know before she books."
          className="sm:col-span-2"
        >
          <TextArea id="ourNote" name="ourNote" maxLength={2000} defaultValue={v.ourNote ?? ''} />
        </Labeled>
        <Labeled label="Practical summary" htmlFor="practicalSummary" className="sm:col-span-2">
          <TextArea id="practicalSummary" name="practicalSummary" maxLength={1000} defaultValue={v.practicalSummary ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset id="age" title="Who it is for" note="Pick the basis the venue uses. Grades count K as 0.">
        <Labeled label="Basis" htmlFor="ageBasis">
          <Select id="ageBasis" name="ageBasis" value={basis} onChange={(e) => setBasis(e.target.value)}>
            <option value="">Not known</option>
            {AGE_BASES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Labeled>
        <span />
        <Labeled label="Youngest (years)" htmlFor="ageMinYears">
          <Input id="ageMinYears" name="ageMinYears" type="number" min={0} max={18} step={0.5} defaultValue={v.ageMinYears ?? ''} disabled={basis === 'grades'} />
        </Labeled>
        <Labeled label="Oldest (years)" htmlFor="ageMaxYears">
          <Input id="ageMaxYears" name="ageMaxYears" type="number" min={0} max={18} step={0.5} defaultValue={v.ageMaxYears ?? ''} disabled={basis === 'grades'} />
        </Labeled>
        <Labeled label="Lowest grade" htmlFor="gradeMin">
          <Input id="gradeMin" name="gradeMin" type="number" min={0} max={12} defaultValue={v.gradeMin ?? ''} disabled={basis === 'years'} />
        </Labeled>
        <Labeled label="Highest grade" htmlFor="gradeMax">
          <Input id="gradeMax" name="gradeMax" type="number" min={0} max={12} defaultValue={v.gradeMax ?? ''} disabled={basis === 'years'} />
        </Labeled>
      </Fieldset>

      <Fieldset id="duration" title="Size and length">
        <Labeled label="Length (minutes)" htmlFor="durationMin">
          <Input id="durationMin" name="durationMin" type="number" min={1} max={1440} defaultValue={v.durationMin ?? ''} />
        </Labeled>
        <Labeled label="Book this far ahead (days)" htmlFor="leadTimeDays">
          <Input id="leadTimeDays" name="leadTimeDays" type="number" min={0} max={365} defaultValue={v.leadTimeDays ?? ''} />
        </Labeled>
        <div id="capacity" className="scroll-mt-24 sm:col-span-2" />
        <Labeled label="Smallest group" htmlFor="capacityMin">
          <Input id="capacityMin" name="capacityMin" type="number" min={1} max={1000} defaultValue={v.capacityMin ?? ''} />
        </Labeled>
        <Labeled label="Largest group" htmlFor="capacityMax">
          <Input id="capacityMax" name="capacityMax" type="number" min={1} max={1000} defaultValue={v.capacityMax ?? ''} />
        </Labeled>
        <div id="lead" className="scroll-mt-24" />
      </Fieldset>

      <Fieldset id="cost" title="Price" note="Leave every price blank and mark Free as Not known if the venue has not published one; the page will say so.">
        <Labeled label="Free" htmlFor="isFree">
          <TriState name="isFree" defaultValue={v.isFree} />
        </Labeled>
        <Labeled label="Tax included" htmlFor="taxIncluded">
          <TriState name="taxIncluded" defaultValue={v.taxIncluded} />
        </Labeled>
        <Labeled label="Per child (CAD)" htmlFor="costPerChildCad">
          <Input id="costPerChildCad" name="costPerChildCad" type="number" min={0} step={0.01} defaultValue={v.costPerChildCad ?? ''} />
        </Labeled>
        <Labeled label="Per group (CAD)" htmlFor="costPerGroupCad">
          <Input id="costPerGroupCad" name="costPerGroupCad" type="number" min={0} step={0.01} defaultValue={v.costPerGroupCad ?? ''} />
        </Labeled>
        <Labeled label="Per adult (CAD)" htmlFor="costPerAdultCad">
          <Input id="costPerAdultCad" name="costPerAdultCad" type="number" min={0} step={0.01} defaultValue={v.costPerAdultCad ?? ''} />
        </Labeled>
        <Labeled label="Adults free" htmlFor="adultsFree">
          <TriState name="adultsFree" defaultValue={v.adultsFree} />
        </Labeled>
        <Labeled label="One free adult per how many children" htmlFor="freeAdultsPerChildren">
          <Input id="freeAdultsPerChildren" name="freeAdultsPerChildren" type="number" min={1} max={100} defaultValue={v.freeAdultsPerChildren ?? ''} />
        </Labeled>
        <div className="grid gap-2 self-end">
          <Check name="schoolRateOnly" label="Price is written for schools only" defaultChecked={v.schoolRateOnly} />
        </div>
        <Labeled label="Extra fees" htmlFor="extraFeesNote" className="sm:col-span-2">
          <Input id="extraFeesNote" name="extraFeesNote" defaultValue={v.extraFeesNote ?? ''} />
        </Labeled>
        <Labeled label="Deposit required" htmlFor="depositRequired">
          <TriState name="depositRequired" defaultValue={v.depositRequired} />
        </Labeled>
        <Labeled label="When they want payment" htmlFor="paymentTiming">
          <Input id="paymentTiming" name="paymentTiming" defaultValue={v.paymentTiming ?? ''} />
        </Labeled>
        <Labeled label="Cancellation" htmlFor="cancellationNote" className="sm:col-span-2">
          <Input id="cancellationNote" name="cancellationNote" defaultValue={v.cancellationNote ?? ''} />
        </Labeled>
        <Labeled
          label="Children per adult they require"
          htmlFor="chaperoneChildrenPerAdult"
          hint={v.chaperoneHasMore ? 'The venue states several ratios; only the first is shown. Filling this in replaces all of them.' : 'Feeds the adults helper on the trip page.'}
        >
          <Input id="chaperoneChildrenPerAdult" name="chaperoneChildrenPerAdult" type="number" min={1} max={50} defaultValue={v.chaperoneChildrenPerAdult ?? ''} />
        </Labeled>
        <Labeled label="That ratio applies to" htmlFor="chaperoneAppliesTo">
          <Input id="chaperoneAppliesTo" name="chaperoneAppliesTo" defaultValue={v.chaperoneAppliesTo ?? ''} placeholder="under 5s, or leave blank" />
        </Labeled>
      </Fieldset>

      <Fieldset id="days" title="When it runs" note="No months ticked means year round. No days ticked means not known.">
        <CheckGroup
          legend="Months"
          name="monthsOffered"
          options={MONTHS.map((m, i) => [String(i + 1), m.slice(0, 3)])}
          defaultValues={(v.monthsOffered ?? []).map(String)}
          className="sm:col-span-2"
        />
        <CheckGroup
          legend="Days"
          name="daysOffered"
          options={WEEKDAYS.map((d, i) => [String(i + 1), d.slice(0, 3)])}
          defaultValues={(v.daysOffered ?? []).map(String)}
          className="sm:col-span-2"
        />
        <Labeled label="Start times" htmlFor="timeSlots" hint="Comma separated, 24-hour: 09:30, 13:00." className="sm:col-span-2">
          <Input id="timeSlots" name="timeSlots" defaultValue={v.timeSlots?.join(', ') ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset id="setting" title="What it is like">
        <Labeled label="Indoor" htmlFor="indoor">
          <TriState name="indoor" defaultValue={v.indoor} />
        </Labeled>
        <Labeled label="Outdoor" htmlFor="outdoor">
          <TriState name="outdoor" defaultValue={v.outdoor} />
        </Labeled>
        <CheckGroup legend="Format" name="format" options={PROGRAM_FORMATS} defaultValues={v.format ?? []} className="sm:col-span-2" />
        <CheckGroup legend="Mood" name="moodTags" options={MOOD_TAGS} defaultValues={v.moodTags ?? []} className="sm:col-span-2" />
        <Labeled label="Sensory friendly" htmlFor="sensoryFriendly">
          <TriState name="sensoryFriendly" defaultValue={v.sensoryFriendly} />
        </Labeled>
        <Labeled label="Low noise" htmlFor="lowNoise">
          <TriState name="lowNoise" defaultValue={v.lowNoise} />
        </Labeled>
        <Labeled label="Neurodiversity friendly" htmlFor="neurodiversityFriendly">
          <TriState name="neurodiversityFriendly" defaultValue={v.neurodiversityFriendly} />
        </Labeled>
        <Labeled label="Curriculum tags" htmlFor="curriculumTags" hint="Comma separated.">
          <Input id="curriculumTags" name="curriculumTags" defaultValue={v.curriculumTags?.join(', ') ?? ''} />
        </Labeled>
      </Fieldset>

      <Fieldset id="booking" title="Booking this program" note="Only when it differs from the venue's own. Blank means use the venue's.">
        <Labeled label="Booking email" htmlFor="bookingEmail">
          <Input id="bookingEmail" name="bookingEmail" type="email" defaultValue={v.bookingEmail ?? ''} />
        </Labeled>
        <Labeled label="Booking link" htmlFor="bookingUrl">
          <Input id="bookingUrl" name="bookingUrl" type="url" defaultValue={v.bookingUrl ?? ''} placeholder="https://" />
        </Labeled>
        <Labeled label="They prefer" htmlFor="bookingMethod">
          <Select id="bookingMethod" name="bookingMethod" defaultValue={v.bookingMethod ?? ''}>
            <option value="">Same as the venue</option>
            {BOOKING_METHODS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Labeled>
      </Fieldset>

      <Fieldset id="source" title="Where this came from">
        <Labeled label="Source page" htmlFor="sourceUrl" className="sm:col-span-2">
          <Input id="sourceUrl" name="sourceUrl" type="url" defaultValue={v.sourceUrl ?? ''} placeholder="https://" />
        </Labeled>
        <Labeled label="Evidence" htmlFor="evidence" hint="The sentence on the page, or who said it on the phone and when." className="sm:col-span-2">
          <TextArea id="evidence" name="evidence" maxLength={2000} defaultValue={v.evidence ?? ''} />
        </Labeled>
      </Fieldset>

      <SaveRow state={state} pending={pending} label={mode === 'new' ? 'Create program' : 'Save program'} />
    </form>
  )
}

function Check({
  name,
  label,
  defaultChecked,
}: {
  name: string
  label: string
  defaultChecked: boolean
}) {
  return (
    <label className="text-body-sm flex items-center gap-2.5 font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-brand h-4.5 w-4.5" />
      {label}
    </label>
  )
}

function CheckGroup({
  legend,
  name,
  options,
  defaultValues,
  className,
}: {
  legend: string
  name: string
  options: readonly (readonly [string, string])[]
  defaultValues: string[]
  className?: string
}) {
  return (
    <div className={className}>
      <div className="text-label text-text-muted mb-1.5 font-bold uppercase">{legend}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map(([value, label]) => (
          <label key={value} className="text-body-sm flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              name={name}
              value={value}
              defaultChecked={defaultValues.includes(value)}
              className="accent-brand h-4.5 w-4.5"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}
