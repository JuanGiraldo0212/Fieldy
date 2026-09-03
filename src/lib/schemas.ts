/*
  Zod schemas for the objects stored as jsonb on `trip` and `message`.

  These are always read and written with their parent row, so they are validated
  here rather than given tables. Field names come from data-model.md sections
  4a, 4b, 4c, 5a — authoritative, do not rename.
*/

import { z } from 'zod'

/* ─── trip.date_options (data-model 4a) ──────────────────────────────────── */

export const dateOptionSchema = z.object({
  date: z.iso.date(),
  slot: z.enum(['morning', 'afternoon', 'either']),
  /* 1 = first choice. The request message asks in this order. */
  rank: z.number().int().min(1),
})

/* ─── trip.tasks (data-model 4b) ─────────────────────────────────────────── */

export const taskKind = z.enum([
  'send_request',
  'book_transport',
  'approval',
  'consent_out',
  'consent_in',
  'headcount',
  'day_before',
  'custom',
])

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  kind: taskKind,
  due_date: z.iso.date(),
  /* Days before the trip date this was generated from. Becomes null the moment
     a human edits the date, so regeneration stops overwriting their choice. */
  offset_days: z.number().int().nullable(),
  done: z.boolean(),
  done_at: z.iso.datetime({ offset: true }).nullable(),
})

/* Default offsets. Buffer is a system setting, default 3 days — exposed on the
   design document itself as `taskBufferDays`. */
export const TASK_OFFSETS = {
  book_transport: -14,
  approval: -10,
  consent_out: -10,
  consent_in: -3,
  headcount: -2,
  day_before: -1,
} as const

export const DEFAULT_TASK_BUFFER_DAYS = 3
export const DEFAULT_LEAD_TIME_DAYS = 14

/* ─── trip.asks (data-model 4c) ──────────────────────────────────────────── */

export const askSchema = z.object({
  /* `fact:Washrooms`, `conflict`, `fees`, or a generic topic key. */
  key: z.string(),
  /* Short chip label, reused in the trip's request summary. */
  label: z.string(),
  /* The sentence that goes in the message. */
  question: z.string(),
  source: z.enum(['gap', 'conflict', 'generic', 'custom']),
})

/* ─── trip.room_snapshots ────────────────────────────────────────────────── */

/* Copied at creation. Required adults is computed from these, not from the live
   rooms, for the same reason children_count is copied. */
export const roomSnapshotSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().int(),
  ratio: z.number().int(),
})

/* ─── message.attachments ────────────────────────────────────────────────── */

export const attachmentSchema = z.object({
  name: z.string(),
  /* A private object key, not a public URL. Signed at render time, one hour. */
  url: z.string(),
  mime: z.string().nullable(),
  size: z.number().int().nullable(),
})

/* ─── message.suggestion (data-model 5a) ─────────────────────────────────── */

/* Four intents. There is no `needs_info`: summarising a venue's questions in
   our own words is generation, not extraction, and the classifier is rule
   based. A questions-only reply reads as `unclear` and sits in the thread. */
export const suggestionIntent = z.enum([
  'confirmed',
  'proposed_dates',
  'declined',
  'unclear',
])

export const suggestionSchema = z.object({
  intent: suggestionIntent,
  dates: z.array(z.iso.date()).nullable(),
  time: z.string().nullable(),
  /* The quoted sentence the reading came from. Always shown — the user must be
     able to check the machine's work. */
  evidence: z.string(),
  confidence: z.number().min(0).max(1).nullable(),
  /* Per message, so a dismissed banner never returns. */
  dismissed_at: z.iso.datetime({ offset: true }).nullable(),
})

/* Below this, force `unclear` and show no action buttons. */
export const SUGGESTION_CONFIDENCE_FLOOR = 0.6

/* ─── search_state (client only, data-model 7) ───────────────────────────── */

/* Never persisted server side: it belongs to the session, and writing it to the
   server makes shared links behave unpredictably. Lives in the URL. */
export const searchStateSchema = z.object({
  query: z.string().default(''),
  age_bands: z.array(z.number().int().min(0).max(14)).default([1]),
  children: z.number().int().min(1).default(16),
  transport: z.enum(['walking', 'bus', 'parent_drivers']).default('bus'),
  budget_max: z.number().min(0).default(10),
  /* 0 is "any distance": start wide and let the director narrow it, rather
     than hiding programs behind a radius she never chose. */
  radius_km: z.number().min(0).default(0),
  /*
    Where to measure from, when it is not the active room's home base. A
    director planning around a different starting point — the school she is
    borrowing a bus from, a park the group is already at — should be able to
    say so without editing her room. Carried in the URL with its coordinates so
    a shared link measures from the same place.
  */
  from: z.string().default(''),
  from_lat: z.number().nullable().default(null),
  from_lng: z.number().nullable().default(null),
  categories: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),
  environment: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([]),
  formats: z.array(z.string()).default([]),
  sort: z.enum(['best_match', 'distance', 'duration', 'price']).default('best_match'),
})

/*
  What a director picks in "Age / Grade".

  Two bands for the years before school, then one entry per grade, because
  that is how a teacher describes her class and how venues publish their
  programs. A band carries BOTH an age range and, where there is one, a grade.

  The grade is the point. A venue that publishes "Grades 2 to 12" gives no
  ages at all, so without a grade to compare we could only ever say "no
  youngest age published" — and a Grade 1 class would be told a Grades 2 to 12
  program fits them. With a grade on the band, that is a real check.

  Ages for a grade are the ordinary BC pairing, grade n covering n+5 to n+6.
  They are used ONLY to filter age-published programs. Nothing here converts a
  venue's grades into ages, which stays forbidden: see feasibility.ts.

  Kindergarten is grade 0, which is what `grade_min: 0` means in the catalog.
  It also closes what would otherwise be a gap: with the bands half-open, "3 to
  5" ending at 5 and Grade 1 starting at 6 would leave five-year-olds belonging
  to neither.
*/
export const AGE_BANDS: readonly (readonly [number, number, string, number | null])[] = [
  [1, 3, '1 to 3 years', null],
  [3, 5, '3 to 5 years', null],
  /* Grade 0 in the catalog, and the band that closes the gap between the
     pre-school years and Grade 1. */
  [5, 6, 'Kindergarten', 0],
  ...Array.from({ length: 12 }, (_, i) => {
    const grade = i + 1
    return [grade + 5, grade + 6, `Grade ${grade}`, grade] as const
  }),
] as const

export const RADIUS_OPTIONS = [3, 5, 10, 30, 0] as const // 0 = any
export const DEFAULT_RADIUS_KM = 5

export type DateOption = z.infer<typeof dateOptionSchema>
export type Task = z.infer<typeof taskSchema>
export type TaskKind = z.infer<typeof taskKind>
export type Ask = z.infer<typeof askSchema>
export type RoomSnapshot = z.infer<typeof roomSnapshotSchema>
export type Attachment = z.infer<typeof attachmentSchema>
export type Suggestion = z.infer<typeof suggestionSchema>
export type SuggestionIntent = z.infer<typeof suggestionIntent>
export type SearchState = z.infer<typeof searchStateSchema>
