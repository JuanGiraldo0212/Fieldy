'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { and, eq, ne } from 'drizzle-orm'
import { z } from 'zod'
import { db, image, program, report, venue } from '@/db'
import { requireAdmin } from '@/lib/auth'
import { newId } from '@/lib/ids'
import { geocodeAddress, pickedPoint } from '@/lib/catalog/geocode'
import { isSlug, slugify } from '@/lib/catalog/slug'
import {
  AGE_BASES,
  BOOKING_METHODS,
  FACILITY_FIELDS,
  IMAGE_ROLES,
  IMAGE_USAGES,
  MOOD_TAGS,
  PROGRAM_FORMATS,
  VENUE_CATEGORIES,
  values,
} from '@/lib/catalog/options'
import { checkPhotos, photoKey, photoKeyOfUrl, publicPhotoUrl } from '@/lib/catalog/photos'
import { putPhoto, removePhoto as removePhotoObject } from '@/lib/catalog/uploads'

/*
  The catalog editor's writes. Plan: admin slice.

  Every action starts with requireAdmin(). Rendering the form only to admins
  is not a boundary — the POST can be sent without the form — and Drizzle is
  exempt from RLS, so this line is the whole of the access control.

  Every save stamps `edited_at`, which is what tells scripts/import-catalog.ts
  to leave the row alone from now on, and `checked_on` / `checked_by`, which
  is what the outing page's freshness line reads.

  Nulls stay honest. A three-way control sends '' | 'true' | 'false' and
  '' becomes null, never false. An empty text field becomes null, not ''.
*/

export type AdminState = {
  error?: string
  ok?: boolean
  /* Saved, with something worth saying — an address that would not geocode. */
  notice?: string
  /* Changes on every successful save so a form can show "Saved" again. */
  at?: number
}

const NOT_ADMIN = 'You are not signed in as an admin.'

/* ─── Field helpers ──────────────────────────────────────────────────────── */

const str = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Too long — keep it under ${max} characters.`)
    .transform((s) => s || null)

const tri = z
  .enum(['', 'true', 'false'])
  .transform((v) => (v === '' ? null : v === 'true'))

const checkbox = z.preprocess((v) => v === 'on' || v === 'true', z.boolean())

const blankToNull = (v: unknown) => (v === '' || v == null ? null : Number(v))

/* Zod's own wording for these ("Too small: expected number to be >=0") is
   written for whoever wrote the schema, not for whoever is filling the form. */
const NOT_A_NUMBER = 'That needs to be a number.'
const between = (min: number, max: number) => `Use a number from ${min} to ${max}.`

const num = (min: number, max: number) =>
  z.preprocess(
    blankToNull,
    z
      .number({ error: NOT_A_NUMBER })
      .min(min, between(min, max))
      .max(max, between(min, max))
      .nullable(),
  )

const int = (min: number, max: number) =>
  z.preprocess(
    blankToNull,
    z
      .number({ error: NOT_A_NUMBER })
      .int('That needs to be a whole number.')
      .min(min, between(min, max))
      .max(max, between(min, max))
      .nullable(),
  )

/* numeric(10,2) wants a string; keep two decimals so a re-read compares. */
const money = z.preprocess(
  blankToNull,
  z
    .number({ error: NOT_A_NUMBER })
    .min(0, 'A price cannot be negative.')
    .max(100000, 'That price is too large.')
    .nullable(),
).transform((n) => (n == null ? null : n.toFixed(2)))

const list = (separator: RegExp, max: number) =>
  z
    .string()
    .max(max)
    .transform((s) => {
      const items = s.split(separator).map((x) => x.trim()).filter(Boolean)
      return items.length ? items : null
    })
const lines = (max: number) => list(/\n/, max)
const commas = (max: number) => list(/,/, max)

const oneOf = <V extends string>(opts: readonly (readonly [V, string])[]) =>
  z.enum(['', ...values(opts)]).transform((v) => (v === '' ? null : (v as V)))

const manyOf = <V extends string>(opts: readonly (readonly [V, string])[]) =>
  z.array(z.enum(values(opts))).transform((a) => (a.length ? a : null))

const intList = (min: number, max: number) =>
  z
    .array(z.coerce.number().int().min(min).max(max))
    .transform((a) => (a.length ? [...new Set(a)].sort((x, y) => x - y) : null))

const url = z
  .string()
  .trim()
  .max(500)
  .transform((s) => s || null)
  .refine((s) => s == null || /^https?:\/\//.test(s), 'Links need to start with http:// or https://')

const email = z
  .string()
  .trim()
  .max(200)
  .transform((s) => s || null)
  .refine((s) => s == null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), 'That does not look like an email address.')

const today = () => new Date().toISOString().slice(0, 10)

/* The field name an editor sees is the label, not the column: a message
   reading "priceYearOrSeason:" sends them hunting for a field that is
   spelled that way nowhere on the page. */
function fieldName(key: string): string {
  const words = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function firstIssue(e: z.ZodError): string {
  const i = e.issues[0]
  return i ? `${i.path.length ? `${fieldName(String(i.path[0]))}: ` : ''}${i.message}` : 'Something is missing.'
}

/* Facility notes come in one field per fact, written under the canonical key
   and with the extractor's alternative spellings retired, so the outing page
   never shows two notes for one row. Keys the form does not know are kept. */
function mergeFacilityNotes(
  existing: Record<string, string> | null,
  formData: FormData,
): Record<string, string> | null {
  const out: Record<string, string> = { ...(existing ?? {}) }
  for (const f of FACILITY_FIELDS) {
    for (const k of f.noteKeys) delete out[k]
    const typed = String(formData.get(`note_${f.key}`) ?? '').trim().slice(0, 300)
    if (typed) out[f.noteKeys[0]] = typed
  }
  return Object.keys(out).length ? out : null
}

/* ─── Venue ──────────────────────────────────────────────────────────────── */

const venueSchema = z.object({
  id: z.string().trim().max(80),
  name: z.string().trim().min(1, 'The venue needs a name.').max(200),
  category: z.enum(values(VENUE_CATEGORIES)),
  website: url,
  description: str(2000),
  address: str(300),
  nearbyPark: str(300),
  hostsSchoolGroups: tri,
  hostsDaycareGroups: tri,
  youngestAgeWelcomedYears: num(0, 18),
  languages: commas(300),
  restrictions: lines(2000),
  bookingEmail: email,
  bookingPhone: str(40),
  bookingUrl: url,
  bookingMethod: oneOf(BOOKING_METHODS),
  hasWashrooms: tri,
  hasLunchSpace: tri,
  hasRainBackup: tri,
  strollerAccessible: tri,
  wheelchairAccessible: tri,
  busParking: tri,
  generalAdmissionChildCad: money,
  generalAdmissionAdultCad: money,
  priceYearOrSeason: str(300),
  hoursNotes: str(1000),
  seasonalNotes: str(1000),
})

function venueInput(formData: FormData) {
  const get = (k: string) => formData.get(k) ?? ''
  return {
    id: get('id'),
    name: get('name'),
    category: get('category'),
    website: get('website'),
    description: get('description'),
    address: get('address'),
    nearbyPark: get('nearbyPark'),
    hostsSchoolGroups: get('hostsSchoolGroups'),
    hostsDaycareGroups: get('hostsDaycareGroups'),
    youngestAgeWelcomedYears: get('youngestAgeWelcomedYears'),
    languages: get('languages'),
    restrictions: get('restrictions'),
    bookingEmail: get('bookingEmail'),
    bookingPhone: get('bookingPhone'),
    bookingUrl: get('bookingUrl'),
    bookingMethod: get('bookingMethod'),
    hasWashrooms: get('hasWashrooms'),
    hasLunchSpace: get('hasLunchSpace'),
    hasRainBackup: get('hasRainBackup'),
    strollerAccessible: get('strollerAccessible'),
    wheelchairAccessible: get('wheelchairAccessible'),
    busParking: get('busParking'),
    generalAdmissionChildCad: get('generalAdmissionChildCad'),
    generalAdmissionAdultCad: get('generalAdmissionAdultCad'),
    priceYearOrSeason: get('priceYearOrSeason'),
    hoursNotes: get('hoursNotes'),
    seasonalNotes: get('seasonalNotes'),
  }
}

/* Where the saved point came from. A kept pin keeps the provenance it had —
   calling a coordinate `admin_geocoded` when the geocoder just refused this
   address would be a lie the next editor has no way to catch. */
function geoSourceFor(
  formData: FormData,
  point: { lat: number; lng: number },
  existing: { lat: number | null; lng: number | null; geoSource: string | null } | undefined,
): string {
  if (existing && point.lat === existing.lat && point.lng === existing.lng) {
    return existing.geoSource ?? 'admin_geocoded'
  }
  return formData.get('addressLat') ? 'admin_picked' : 'admin_geocoded'
}

export async function saveVenue(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const viewer = await requireAdmin()
  if (!viewer) return { error: NOT_ADMIN }

  const isNew = formData.get('mode') === 'new'
  const parsed = venueSchema.safeParse(venueInput(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const d = parsed.data

  /* The id is the slug in every outing URL. Minted once, on creation. */
  const id = isNew ? d.id || slugify(d.name) : d.id
  if (!isSlug(id)) {
    return { error: 'The link name can only have lowercase letters, digits and single dashes.' }
  }

  const existing = (
    await db.select().from(venue).where(eq(venue.id, id)).limit(1)
  )[0]
  if (isNew && existing) return { error: `A venue with the link name "${id}" already exists.` }
  if (!isNew && !existing) return { error: 'That venue no longer exists.' }

  /* A point picked from the address list wins. Otherwise only geocode when
     the address is new or changed, so fixing a typo in the description does
     not depend on a third-party service being up. A failure is reported,
     not fatal: the row saves and completeness() keeps flagging it.

     A failure does not throw away the pin the venue already had. Some venues
     are unknown to the geocoder at any phrasing — CFB Esquimalt's museum has
     no OpenStreetMap record — and for those the picker is empty too, so
     nulling the coordinate would lose a point published by the venue itself
     with no way to restore it from this form. The old pin is at worst as
     stale as it was a moment ago, and the notice says which address it is
     for. Clearing the address field still clears the coordinates. */
  let point = pickedPoint(formData.get('addressLat'), formData.get('addressLng'))
  let notice: string | undefined
  if (!point && d.address) {
    const had =
      existing && existing.lat != null && existing.lng != null
        ? { lat: existing.lat, lng: existing.lng }
        : null
    if (had && existing?.address === d.address) {
      point = had
    } else {
      point = await geocodeAddress(d.address, d.name)
      if (!point) {
        point = had
        notice = had
          ? 'Saved, but the new address could not be placed on the map, so the pin still shows the old one. Try a fuller address, or pick one from the list.'
          : 'Saved, but the address could not be placed on the map. Try a fuller address, or pick one from the list.'
      }
    }
  }

  const now = new Date()
  const row = {
    name: d.name,
    website: d.website,
    description: d.description,
    category: d.category,
    address: d.address,
    lat: point?.lat ?? null,
    lng: point?.lng ?? null,
    geoSource: point ? geoSourceFor(formData, point, existing) : null,
    hostsSchoolGroups: d.hostsSchoolGroups,
    hostsDaycareGroups: d.hostsDaycareGroups,
    youngestAgeWelcomedYears: d.youngestAgeWelcomedYears,
    bookingEmail: d.bookingEmail,
    bookingPhone: d.bookingPhone,
    bookingUrl: d.bookingUrl,
    bookingMethod: d.bookingMethod,
    hasWashrooms: d.hasWashrooms,
    hasLunchSpace: d.hasLunchSpace,
    hasRainBackup: d.hasRainBackup,
    strollerAccessible: d.strollerAccessible,
    wheelchairAccessible: d.wheelchairAccessible,
    busParking: d.busParking,
    facilityNotes: mergeFacilityNotes(existing?.facilityNotes ?? null, formData),
    nearbyPark: d.nearbyPark,
    restrictions: d.restrictions,
    languages: d.languages,
    generalAdmissionChildCad: d.generalAdmissionChildCad,
    generalAdmissionAdultCad: d.generalAdmissionAdultCad,
    hoursNotes: d.hoursNotes,
    seasonalNotes: d.seasonalNotes,
    priceYearOrSeason: d.priceYearOrSeason,
    checkedOn: today(),
    checkedBy: viewer.name || viewer.email,
    editedAt: now,
    updatedAt: now,
  }

  if (isNew) {
    await db.insert(venue).values({ id, ...row })
  } else {
    await db.update(venue).set(row).where(eq(venue.id, id))
  }

  revalidatePath('/', 'layout')
  if (isNew) redirect(`/admin/venues/${id}`)
  return { ok: true, notice, at: Date.now() }
}

/* ─── Program ────────────────────────────────────────────────────────────── */

const programSchema = z.object({
  venueId: z.string().min(1),
  slug: z.string().trim().max(80),
  name: z.string().trim().min(1, 'The program needs a name.').max(200),
  description: str(2000),
  whatChildrenDo: str(2000),
  ourNote: str(2000),
  practicalSummary: str(1000),
  comesToYou: checkbox,
  active: checkbox,
  ageBasis: oneOf(AGE_BASES),
  ageMinYears: num(0, 18),
  ageMaxYears: num(0, 18),
  gradeMin: int(0, 12),
  gradeMax: int(0, 12),
  durationMin: int(1, 1440),
  capacityMin: int(1, 1000),
  capacityMax: int(1, 1000),
  costPerChildCad: money,
  costPerGroupCad: money,
  costPerAdultCad: money,
  freeAdultsPerChildren: int(1, 100),
  isFree: tri,
  taxIncluded: tri,
  extraFeesNote: str(1000),
  schoolRateOnly: checkbox,
  depositRequired: tri,
  paymentTiming: str(300),
  cancellationNote: str(1000),
  monthsOffered: intList(1, 12),
  daysOffered: intList(1, 7),
  timeSlots: commas(300),
  leadTimeDays: int(0, 365),
  chaperoneChildrenPerAdult: int(1, 50),
  chaperoneAppliesTo: str(120),
  adultsFree: tri,
  indoor: tri,
  outdoor: tri,
  format: manyOf(PROGRAM_FORMATS),
  sensoryFriendly: tri,
  lowNoise: tri,
  neurodiversityFriendly: tri,
  moodTags: manyOf(MOOD_TAGS),
  curriculumTags: commas(500),
  bookingEmail: email,
  bookingUrl: url,
  bookingMethod: oneOf(BOOKING_METHODS),
  sourceUrl: url,
  evidence: str(2000),
})

function programInput(formData: FormData) {
  const get = (k: string) => formData.get(k) ?? ''
  const all = (k: string) => formData.getAll(k).map(String)
  return {
    venueId: get('venueId'),
    slug: get('slug'),
    name: get('name'),
    description: get('description'),
    whatChildrenDo: get('whatChildrenDo'),
    ourNote: get('ourNote'),
    practicalSummary: get('practicalSummary'),
    comesToYou: get('comesToYou'),
    active: get('active'),
    ageBasis: get('ageBasis'),
    ageMinYears: get('ageMinYears'),
    ageMaxYears: get('ageMaxYears'),
    gradeMin: get('gradeMin'),
    gradeMax: get('gradeMax'),
    durationMin: get('durationMin'),
    capacityMin: get('capacityMin'),
    capacityMax: get('capacityMax'),
    costPerChildCad: get('costPerChildCad'),
    costPerGroupCad: get('costPerGroupCad'),
    costPerAdultCad: get('costPerAdultCad'),
    freeAdultsPerChildren: get('freeAdultsPerChildren'),
    isFree: get('isFree'),
    taxIncluded: get('taxIncluded'),
    extraFeesNote: get('extraFeesNote'),
    schoolRateOnly: get('schoolRateOnly'),
    depositRequired: get('depositRequired'),
    paymentTiming: get('paymentTiming'),
    cancellationNote: get('cancellationNote'),
    monthsOffered: all('monthsOffered'),
    daysOffered: all('daysOffered'),
    timeSlots: get('timeSlots'),
    leadTimeDays: get('leadTimeDays'),
    chaperoneChildrenPerAdult: get('chaperoneChildrenPerAdult'),
    chaperoneAppliesTo: get('chaperoneAppliesTo'),
    adultsFree: get('adultsFree'),
    indoor: get('indoor'),
    outdoor: get('outdoor'),
    format: all('format'),
    sensoryFriendly: get('sensoryFriendly'),
    lowNoise: get('lowNoise'),
    neurodiversityFriendly: get('neurodiversityFriendly'),
    moodTags: all('moodTags'),
    curriculumTags: get('curriculumTags'),
    bookingEmail: get('bookingEmail'),
    bookingUrl: get('bookingUrl'),
    bookingMethod: get('bookingMethod'),
    sourceUrl: get('sourceUrl'),
    evidence: get('evidence'),
  }
}

export async function saveProgram(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const viewer = await requireAdmin()
  if (!viewer) return { error: NOT_ADMIN }

  const isNew = formData.get('mode') === 'new'
  const parsed = programSchema.safeParse(programInput(formData))
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const d = parsed.data

  if (d.ageMinYears != null && d.ageMaxYears != null && d.ageMaxYears < d.ageMinYears) {
    return { error: 'The oldest age cannot be younger than the youngest.' }
  }
  if (d.gradeMin != null && d.gradeMax != null && d.gradeMax < d.gradeMin) {
    return { error: 'The highest grade cannot be below the lowest.' }
  }
  if (d.capacityMin != null && d.capacityMax != null && d.capacityMax < d.capacityMin) {
    return { error: 'The largest group cannot be smaller than the smallest.' }
  }

  const owner = (
    await db.select({ id: venue.id }).from(venue).where(eq(venue.id, d.venueId)).limit(1)
  )[0]
  if (!owner) return { error: 'That venue no longer exists.' }

  const slug = isNew ? d.slug || slugify(d.name) : d.slug
  if (!isSlug(slug)) {
    return { error: 'The link name can only have lowercase letters, digits and single dashes.' }
  }
  const id = `${d.venueId}:${slug}`

  const existing = (
    await db.select().from(program).where(eq(program.id, id)).limit(1)
  )[0]
  if (isNew && existing) return { error: `This venue already has a program with the link name "${slug}".` }
  if (!isNew && !existing) return { error: 'That program no longer exists.' }

  /* One ratio from the form. The extractor sometimes stored several (an
     array); a blank form keeps whatever is there rather than wiping it. */
  const chaperoneRatio =
    d.chaperoneChildrenPerAdult != null
      ? { children_per_adult: d.chaperoneChildrenPerAdult, applies_to: d.chaperoneAppliesTo }
      : (existing?.chaperoneRatio ?? null)

  const now = new Date()
  const row = {
    venueId: d.venueId,
    slug,
    name: d.name,
    description: d.description,
    whatChildrenDo: d.whatChildrenDo,
    ourNote: d.ourNote,
    practicalSummary: d.practicalSummary,
    comesToYou: d.comesToYou,
    ageMinYears: d.ageMinYears,
    ageMaxYears: d.ageMaxYears,
    gradeMin: d.gradeMin,
    gradeMax: d.gradeMax,
    ageBasis: d.ageBasis,
    durationMin: d.durationMin,
    capacityMax: d.capacityMax,
    capacityMin: d.capacityMin,
    costPerChildCad: d.costPerChildCad,
    costPerGroupCad: d.costPerGroupCad,
    costPerAdultCad: d.costPerAdultCad,
    freeAdultsPerChildren: d.freeAdultsPerChildren,
    isFree: d.isFree,
    taxIncluded: d.taxIncluded,
    extraFeesNote: d.extraFeesNote,
    schoolRateOnly: d.schoolRateOnly,
    depositRequired: d.depositRequired,
    paymentTiming: d.paymentTiming,
    cancellationNote: d.cancellationNote,
    monthsOffered: d.monthsOffered,
    daysOffered: d.daysOffered,
    timeSlots: d.timeSlots,
    leadTimeDays: d.leadTimeDays,
    chaperoneRatio,
    adultsFree: d.adultsFree,
    indoor: d.indoor,
    outdoor: d.outdoor,
    format: d.format,
    sensoryFriendly: d.sensoryFriendly,
    lowNoise: d.lowNoise,
    neurodiversityFriendly: d.neurodiversityFriendly,
    moodTags: d.moodTags,
    curriculumTags: d.curriculumTags,
    bookingEmail: d.bookingEmail,
    bookingUrl: d.bookingUrl,
    bookingMethod: d.bookingMethod,
    sourceUrl: d.sourceUrl,
    evidence: d.evidence,
    checkedOn: today(),
    active: d.active,
    editedAt: now,
    updatedAt: now,
  }

  if (isNew) {
    await db.insert(program).values({ id, ...row })
  } else {
    await db.update(program).set(row).where(eq(program.id, id))
  }

  revalidatePath('/', 'layout')
  if (isNew) redirect(`/admin/venues/${d.venueId}/programs/${slug}`)
  return { ok: true, at: Date.now() }
}

/* Bound from the program table: `setProgramActive.bind(null, id, false)`.
   Never a delete — trips reference programs (schema comment on `active`). */
export async function setProgramActive(programId: string, active: boolean) {
  const viewer = await requireAdmin()
  if (!viewer) return
  await db
    .update(program)
    .set({ active, editedAt: new Date(), updatedAt: new Date() })
    .where(eq(program.id, programId))
  revalidatePath('/', 'layout')
}

/* ─── Photos ─────────────────────────────────────────────────────────────── */

/* There is one card photo. Making another the hero steps the old one down
   to `space` rather than leaving two rows the outing page would pick between
   by row order. */
async function demoteHeroes(venueId: string, except: string) {
  await db
    .update(image)
    .set({ role: 'space' })
    .where(and(eq(image.venueId, venueId), eq(image.role, 'hero'), ne(image.id, except)))
}

const uploadSchema = z.object({
  venueId: z.string().min(1),
  role: z.enum(values(IMAGE_ROLES)),
  alt: str(300),
  caption: str(300),
})

export async function uploadPhotos(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const viewer = await requireAdmin()
  if (!viewer) return { error: NOT_ADMIN }

  const parsed = uploadSchema.safeParse({
    venueId: formData.get('venueId') ?? '',
    role: formData.get('role') ?? 'space',
    alt: formData.get('alt') ?? '',
    caption: formData.get('caption') ?? '',
  })
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const d = parsed.data

  const owner = (
    await db.select({ id: venue.id, name: venue.name }).from(venue).where(eq(venue.id, d.venueId)).limit(1)
  )[0]
  if (!owner) return { error: 'That venue no longer exists.' }

  /* A file input with nothing chosen still submits one empty File. */
  const files = formData
    .getAll('photos')
    .filter((f): f is File => f instanceof File && f.size > 0)
  const check = checkPhotos(files)
  if (!check.ok) return { error: check.error }

  const when = today()
  const rightsNote = `Supplied by the venue. Uploaded by ${viewer.name || viewer.email} on ${when}.`
  let stored = 0
  for (const [i, f] of files.entries()) {
    const id = newId()
    const key = photoKey(d.venueId, id, f.type)
    const put = await putPhoto(key, new Uint8Array(await f.arrayBuffer()), f.type)
    if (!put.ok) {
      return {
        error:
          stored > 0
            ? `${stored} of ${files.length} stored, then ${f.name} failed: ${put.error}`
            : `Could not store ${f.name}: ${put.error}`,
      }
    }
    /* Only the first of a batch can be the hero; the rest are what the
       admin picked for them, or plain space photos. */
    const role = d.role === 'hero' && i > 0 ? 'space' : d.role
    await db.insert(image).values({
      id,
      venueId: d.venueId,
      url: publicPhotoUrl(key),
      role,
      alt: d.alt ?? owner.name,
      altSource: 'admin',
      caption: d.caption,
      foundOnUrl: null,
      rightsNote,
      usage: 'venue_supplied',
    })
    if (role === 'hero') await demoteHeroes(d.venueId, id)
    stored++
  }

  revalidatePath('/', 'layout')
  return { ok: true, at: Date.now() }
}

const photoSchema = z.object({
  imageId: z.string().min(1),
  role: z.enum(values(IMAGE_ROLES)),
  usage: z.enum(values(IMAGE_USAGES)),
  alt: z.string().trim().min(1, 'Every photo needs a description.').max(300),
  caption: str(300),
})

export async function updatePhoto(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const viewer = await requireAdmin()
  if (!viewer) return { error: NOT_ADMIN }

  const parsed = photoSchema.safeParse({
    imageId: formData.get('imageId') ?? '',
    role: formData.get('role') ?? '',
    usage: formData.get('usage') ?? '',
    alt: formData.get('alt') ?? '',
    caption: formData.get('caption') ?? '',
  })
  if (!parsed.success) return { error: firstIssue(parsed.error) }
  const d = parsed.data

  const existing = (
    await db.select().from(image).where(eq(image.id, d.imageId)).limit(1)
  )[0]
  if (!existing) return { error: 'That photo no longer exists.' }

  await db
    .update(image)
    .set({ role: d.role, usage: d.usage, alt: d.alt, caption: d.caption })
    .where(eq(image.id, d.imageId))
  if (d.role === 'hero') await demoteHeroes(existing.venueId, d.imageId)

  revalidatePath('/', 'layout')
  return { ok: true, at: Date.now() }
}

/*
  Removing a photo removes the row, and the object when the object is ours.
  A venue-site URL is nobody's to delete. The object goes first: a row that
  points at nothing is a broken image, an object nothing points at is a file.
*/
export async function removePhoto(imageId: string) {
  const viewer = await requireAdmin()
  if (!viewer) return
  const existing = (
    await db.select().from(image).where(eq(image.id, imageId)).limit(1)
  )[0]
  if (!existing) return
  const key = photoKeyOfUrl(existing.url)
  if (key) await removePhotoObject(key)
  await db.delete(image).where(eq(image.id, imageId))
  revalidatePath('/', 'layout')
}

/* ─── Reports ────────────────────────────────────────────────────────────── */

export async function resolveReport(
  reportId: string,
  status: 'checked' | 'fixed' | 'rejected',
) {
  const viewer = await requireAdmin()
  if (!viewer) return
  await db.update(report).set({ status }).where(eq(report.id, reportId))
  revalidatePath('/admin', 'layout')
}
