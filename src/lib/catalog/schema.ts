/*
  Zod schema for the catalog records in `outputs/*.json`, written field for
  field from `Full prototype build complete/outing-schema.md` (v2).

  Conventions from that file, which this schema enforces:
  - Nulls are data. `null` means "not published" and renders as an honest amber
    row; it is never a validation failure. A wrong number is worse than a blank.
  - Money is CAD numbers, not strings.
  - days_offered is ISO weekday, 1 = Monday.
  - months_offered null means year round, not unknown.
  - Ids are stable slugs and must survive a venue renaming a program.
*/

import { z } from 'zod'

const nullableStr = z.string().nullable().optional().default(null)
const nullableNum = z.number().nullable().optional().default(null)
const nullableBool = z.boolean().nullable().optional().default(null)
const nullableStrArr = z.array(z.string()).nullable().optional().default(null)

export const venueCategoryValues = [
  'animals_farms',
  'nature_outdoors',
  'museums_history',
  'arts_performance',
  'science',
  'community_civic',
  'comes_to_you',
] as const

export const bookingMethodValues = [
  'email',
  'phone',
  'web_form',
  'shop',
] as const

export const catalogVenueSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  website: nullableStr,
  description: nullableStr,
  category: z.enum(venueCategoryValues),
  address: nullableStr,

  /*
    outing-schema.md marks lat/lng REQUIRED — distance, travel time, the radius
    filter and both maps all depend on them. They are nullable here on purpose:
    13 of the 15 provided records have no coordinates yet, and making this fatal
    would block the import entirely. scripts/geocode-catalog.ts fills them, and
    the import's diff report counts every record still missing them.
  */
  lat: nullableNum,
  lng: nullableNum,
  geo_source: nullableStr,

  hosts_school_groups: nullableBool,
  hosts_daycare_groups: nullableBool,
  youngest_age_welcomed_years: nullableNum,

  booking_email: nullableStr,
  booking_phone: nullableStr,
  booking_url: nullableStr,
  booking_method: z.enum(bookingMethodValues).nullable().optional().default(null),

  has_washrooms: nullableBool,
  has_lunch_space: nullableBool,
  has_rain_backup: nullableBool,
  stroller_accessible: nullableBool,
  wheelchair_accessible: nullableBool,
  bus_parking: nullableBool,

  facility_notes: z.record(z.string(), z.string()).nullable().optional().default(null),
  nearby_park: nullableStr,
  restrictions: nullableStrArr,
  languages: nullableStrArr,

  general_admission_child_cad: nullableNum,
  general_admission_adult_cad: nullableNum,

  hours_notes: nullableStr,
  seasonal_notes: nullableStr,
  price_year_or_season: nullableStr,

  checked_on: z.iso.date(),
  checked_by: nullableStr,
})

export const catalogProgramSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: nullableStr,
  what_children_do: nullableStr,
  our_note: nullableStr,
  practical_summary: nullableStr,

  /* outing-schema.md types this as a plain bool, but the provided records carry
     null for "not applicable". Null means not comes-to-you. */
  comes_to_you: z
    .boolean()
    .nullable()
    .optional()
    .default(false)
    .transform((v) => v ?? false),

  age_min_years: nullableNum,
  age_max_years: nullableNum,
  grade_min: nullableNum, // K = 0
  grade_max: nullableNum,
  age_basis: z.enum(['years', 'grades']).nullable().optional().default(null),

  duration_min: nullableNum,
  capacity_max: nullableNum,
  capacity_min: nullableNum,

  cost_per_child_cad: nullableNum,
  cost_per_group_cad: nullableNum,
  cost_per_adult_cad: nullableNum,
  free_adults_per_children: nullableNum,
  is_free: nullableBool,
  tax_included: nullableBool,
  extra_fees_note: nullableStr,

  school_rate_only: z.boolean().nullable().optional().default(false),
  deposit_required: nullableBool,
  payment_timing: nullableStr,
  cancellation_note: nullableStr,

  months_offered: z.array(z.number().int().min(1).max(12)).nullable().optional().default(null),
  days_offered: z.array(z.number().int().min(1).max(7)).nullable().optional().default(null),
  time_slots: nullableStrArr,
  lead_time_days: nullableNum,

  chaperone_ratio: z
    .union([
      z.object({
        children_per_adult: z.number(),
        applies_to: z.string().nullable().optional(),
      }),
      z.array(
        z.object({
          children_per_adult: z.number(),
          applies_to: z.string().nullable().optional(),
        }),
      ),
    ])
    .nullable()
    .optional()
    .default(null),
  adults_free: nullableBool,

  indoor: nullableBool,
  outdoor: nullableBool,
  format: z
    .array(z.enum(['guided', 'self_guided', 'hands_on', 'interactive']))
    .nullable()
    .optional()
    .default(null),

  sensory_friendly: nullableBool,
  low_noise: nullableBool,
  neurodiversity_friendly: nullableBool,

  mood_tags: z
    .array(z.enum(['fun', 'explore', 'active', 'creative', 'learn']))
    .nullable()
    .optional()
    .default(null),
  curriculum_tags: nullableStrArr,

  booking_email: nullableStr,
  booking_url: nullableStr,
  booking_method: z.enum(bookingMethodValues).nullable().optional().default(null),

  source_url: nullableStr,
  evidence: nullableStr,
  checked_on: z.iso.date().nullable().optional().default(null),
  image_ids: nullableStrArr,
})

export const catalogImageSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  role: z.enum(['hero', 'program', 'space', 'activity']),
  /* Required by the schema: it is the accessibility text and the fallback
     caption. */
  alt: z.string().min(1),
  alt_source: nullableStr,
  caption: nullableStr,
  found_on_url: nullableStr,
  width: nullableNum,
  height: nullableNum,
  rights_note: nullableStr,
  /* Only the first three render. `unverified` holds the image back for review. */
  usage: z
    .enum(['licensed', 'venue_supplied', 'public_domain', 'unverified'])
    .optional()
    .default('unverified'),
})

export const catalogFileSchema = z.object({
  venue: catalogVenueSchema,
  /*
    outing-schema.md's "minimum viable record" wants one program, but a venue
    that has permanently closed legitimately has zero — the extraction did its
    job by recording the closure in `gaps`. Zero programs is a warning, not a
    failure: the catalog lists programs, so such a venue simply never appears.
  */
  programs: z.array(catalogProgramSchema),
  images: z.array(catalogImageSchema).optional().default([]),

  /* Provenance. `gaps` drives the amber "not stated" rows; `conflicts` drives
     the "sources disagree — confirm when booking" banner. */
  gaps: nullableStrArr,
  conflicts: z
    .array(
      z.object({
        field: z.string(),
        values: z.array(z.string()),
        sources: z.array(z.string()).optional().default([]),
        note: z.string().nullable().optional(),
      }),
    )
    .nullable()
    .optional()
    .default(null),
  pages_opened: nullableStrArr,
  pages_useful: nullableStrArr,
  extracted_at: nullableStr,
  extractor_version: nullableStr,
})

export type CatalogFile = z.infer<typeof catalogFileSchema>
export type CatalogVenue = z.infer<typeof catalogVenueSchema>
export type CatalogProgram = z.infer<typeof catalogProgramSchema>
export type CatalogImage = z.infer<typeof catalogImageSchema>
