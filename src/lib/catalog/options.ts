/*
  The catalog's pick-lists with their labels, for the admin forms.

  Plain arrays rather than the pg enums from src/db/schema.ts, so a client
  component can import this without dragging drizzle into the bundle. They
  must agree with the enums, and options.test.ts checks that they do — the
  same reason src/lib/roles.ts exists: two copies that drifted once already.

  Labels are the words the outing page uses, where it has any.
*/

export type Option<V extends string = string> = readonly [V, string]

export const VENUE_CATEGORIES = [
  ['animals_farms', 'Animals and farms'],
  ['nature_outdoors', 'Nature and outdoors'],
  ['museums_history', 'Museums and history'],
  ['arts_performance', 'Arts and performance'],
  ['science', 'Science'],
  ['community_civic', 'Community and civic'],
  ['comes_to_you', 'Comes to you'],
] as const satisfies readonly Option[]

export const BOOKING_METHODS = [
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['web_form', 'Web form'],
  ['shop', 'Online shop'],
] as const satisfies readonly Option[]

export const AGE_BASES = [
  ['years', 'Ages in years'],
  ['grades', 'School grades'],
] as const satisfies readonly Option[]

export const PROGRAM_FORMATS = [
  ['guided', 'Guided'],
  ['self_guided', 'Self-guided'],
  ['hands_on', 'Hands-on'],
  ['interactive', 'Interactive'],
] as const satisfies readonly Option[]

export const MOOD_TAGS = [
  ['play', 'Play'],
  ['explore', 'Explore'],
  ['active', 'Active'],
  ['creative', 'Creative'],
  ['learn', 'Learn'],
] as const satisfies readonly Option[]

export const IMAGE_ROLES = [
  ['hero', 'Hero (the card photo)'],
  ['program', 'Program'],
  ['space', 'Space'],
  ['activity', 'Activity'],
] as const satisfies readonly Option[]

export const IMAGE_USAGES = [
  ['unverified', 'Unverified (from their website)'],
  ['venue_supplied', 'Supplied by the venue'],
  ['licensed', 'Licensed'],
  ['public_domain', 'Public domain'],
] as const satisfies readonly Option[]

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

/* ISO weekday, 1 = Monday, as days_offered stores it. */
export const WEEKDAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
] as const

/*
  The facility facts the outing page shows, with the facility_notes keys each
  one reads. practicalFacts() in program.ts prefers the note over the flag,
  and the extractor wrote notes under more than one spelling; the first key
  is the one a save writes, the rest are read and then retired.
*/
export const FACILITY_FIELDS = [
  { key: 'hasWashrooms', noteKeys: ['washrooms'], label: 'Washrooms', yes: 'Yes', no: 'None on site' },
  { key: 'hasLunchSpace', noteKeys: ['lunch_space', 'has_lunch_space'], label: 'Lunch space', yes: 'Yes', no: 'None' },
  { key: 'hasRainBackup', noteKeys: ['rain_backup', 'has_rain_backup'], label: 'Rain backup', yes: 'Indoor space available', no: 'None' },
  { key: 'strollerAccessible', noteKeys: ['stroller_accessible', 'strollers'], label: 'Strollers', yes: 'Accessible', no: 'Not accessible' },
  { key: 'wheelchairAccessible', noteKeys: ['wheelchair_accessible', 'wheelchair'], label: 'Wheelchair access', yes: 'Accessible', no: 'Not accessible' },
  { key: 'busParking', noteKeys: ['bus_parking'], label: 'Bus parking', yes: 'Yes', no: 'No bus parking' },
] as const

export type FacilityKey = (typeof FACILITY_FIELDS)[number]['key']

/* The note for one facility, whichever spelling it was stored under. */
export function facilityNote(
  notes: Record<string, string> | null | undefined,
  noteKeys: readonly string[],
): string | null {
  for (const k of noteKeys) {
    const v = notes?.[k]
    if (v) return v
  }
  return null
}

export const values = <V extends string>(opts: readonly Option<V>[]): V[] =>
  opts.map(([v]) => v)
