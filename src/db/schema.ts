/*
  Drizzle schema. Mirrors the two authoritative model files 1:1:

  - `Full prototype build complete/data-model.md`   user side
  - `Full prototype build complete/outing-schema.md` catalog (v2)

  Those files own field names and enum values. Do not rename anything here
  without changing them first. Implementation notes live in plan section 4.1.

  Conventions: ULID text primary keys generated in the app; catalog ids are
  stable slugs; money is numeric(10,2) CAD; timestamps are UTC with timezone;
  dates are plain `date`; times are `HH:MM` text.
*/

import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import type {
  Ask,
  Attachment,
  DateOption,
  RoomSnapshot,
  Suggestion,
  Task,
} from '@/lib/schemas'

type ChaperoneRatio = {
  children_per_adult: number
  applies_to?: string | null
}

/* ─── Enums ──────────────────────────────────────────────────────────────── */

export const accountRole = pgEnum('account_role', [
  'ece',
  'director',
  'teacher',
  'other',
])

export const centreType = pgEnum('centre_type', [
  'daycare_preschool',
  'elementary',
  'middle',
  'secondary',
  'other',
])

export const rateClass = pgEnum('rate_class', ['daycare', 'school'])

export const roomIcon = pgEnum('room_icon', [
  'baby',
  'backpack',
  'cap',
  'users',
])

export const transportMode = pgEnum('transport_mode', [
  'walking',
  'bus',
  'parent_drivers',
  'none',
])

/* No `idea` state: a trip is created by sending a request. The design's status
   rail shows these as Asked / They answered / Confirmed / Done. */
export const tripStatus = pgEnum('trip_status', [
  'requested',
  'replied',
  'confirmed',
  'done',
  'cancelled',
])

export const statusSource = pgEnum('status_source', ['system', 'manual'])

export const messageParty = pgEnum('message_party', [
  'educator',
  'venue',
  'system',
])

export const messageChannel = pgEnum('message_channel', [
  'email',
  'web_form',
  'phone_log',
])

export const reportStatus = pgEnum('report_status', [
  'new',
  'checked',
  'fixed',
  'rejected',
])

export const venueCategory = pgEnum('venue_category', [
  'animals_farms',
  'nature_outdoors',
  'museums_history',
  'arts_performance',
  'science',
  'community_civic',
  'comes_to_you',
])

export const bookingMethod = pgEnum('booking_method', [
  'email',
  'phone',
  'web_form',
  'shop',
])

export const ageBasis = pgEnum('age_basis', ['years', 'grades'])

export const programFormat = pgEnum('program_format', [
  'guided',
  'self_guided',
  'hands_on',
  'interactive',
])

export const moodTag = pgEnum('mood_tag', [
  'fun',
  'explore',
  'active',
  'creative',
  'learn',
])

export const imageRole = pgEnum('image_role', [
  'hero',
  'program',
  'space',
  'activity',
])

export const imageUsage = pgEnum('image_usage', [
  'licensed',
  'venue_supplied',
  'public_domain',
  'unverified',
])

/* ─── Catalog ────────────────────────────────────────────────────────────────
   Maintained by us, never edited by users. Enters the system only through
   scripts/import-catalog.ts. Readable by anon; writable by nobody but the
   service role.                                                             */

export const venue = pgTable(
  'venue',
  {
    id: text('id').primaryKey(), // stable slug
    name: text('name').notNull(),
    website: text('website'),
    description: text('description'),
    category: venueCategory('category').notNull(),
    address: text('address'),

    /* Required by the schema, and everything spatial depends on them: distance,
       travel time, the radius filter, sort-by-distance and both maps. */
    lat: real('lat'),
    lng: real('lng'),
    geoSource: text('geo_source'),

    hostsSchoolGroups: boolean('hosts_school_groups'),
    hostsDaycareGroups: boolean('hosts_daycare_groups'),
    youngestAgeWelcomedYears: real('youngest_age_welcomed_years'),

    bookingEmail: text('booking_email'),
    bookingPhone: text('booking_phone'),
    bookingUrl: text('booking_url'),
    bookingMethod: bookingMethod('booking_method'),

    /* null means "not known" and renders as an honest "not stated on the site"
       row. false means "known to be none". The difference is load-bearing. */
    hasWashrooms: boolean('has_washrooms'),
    hasLunchSpace: boolean('has_lunch_space'),
    hasRainBackup: boolean('has_rain_backup'),
    strollerAccessible: boolean('stroller_accessible'),
    wheelchairAccessible: boolean('wheelchair_accessible'),
    busParking: boolean('bus_parking'),

    facilityNotes: jsonb('facility_notes').$type<Record<string, string>>(),
    nearbyPark: text('nearby_park'),
    restrictions: text('restrictions').array(),
    languages: text('languages').array(),

    generalAdmissionChildCad: numeric('general_admission_child_cad', {
      precision: 10,
      scale: 2,
    }),
    generalAdmissionAdultCad: numeric('general_admission_adult_cad', {
      precision: 10,
      scale: 2,
    }),

    hoursNotes: text('hours_notes'),
    seasonalNotes: text('seasonal_notes'),
    priceYearOrSeason: text('price_year_or_season'),

    checkedOn: date('checked_on').notNull(),
    checkedBy: text('checked_by'),

    /* Provenance. `gaps` already drives the amber "not stated" rows; `conflicts`
       drives the "sources disagree" banner. */
    gaps: text('gaps').array(),
    conflicts: jsonb('conflicts').$type<
      { field: string; values: string[]; sources: string[]; note?: string }[]
    >(),
    pagesOpened: text('pages_opened').array(),
    pagesUseful: text('pages_useful').array(),
    extractedAt: timestamp('extracted_at', { withTimezone: true }),
    extractorVersion: text('extractor_version'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('venue_lat_lng_idx').on(t.lat, t.lng)],
)

export const program = pgTable(
  'program',
  {
    id: text('id').primaryKey(), // `${venue_id}:${program_slug}`
    venueId: text('venue_id')
      .notNull()
      .references(() => venue.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(), // unique within the venue

    name: text('name').notNull(),
    description: text('description'),
    whatChildrenDo: text('what_children_do'),
    ourNote: text('our_note'),
    practicalSummary: text('practical_summary'),

    comesToYou: boolean('comes_to_you').notNull().default(false),

    ageMinYears: real('age_min_years'),
    ageMaxYears: real('age_max_years'),
    gradeMin: integer('grade_min'), // K = 0
    gradeMax: integer('grade_max'),
    ageBasis: ageBasis('age_basis'),

    durationMin: integer('duration_min'),
    capacityMax: integer('capacity_max'),
    capacityMin: integer('capacity_min'),

    costPerChildCad: numeric('cost_per_child_cad', {
      precision: 10,
      scale: 2,
    }),
    costPerGroupCad: numeric('cost_per_group_cad', {
      precision: 10,
      scale: 2,
    }),
    costPerAdultCad: numeric('cost_per_adult_cad', {
      precision: 10,
      scale: 2,
    }),
    freeAdultsPerChildren: integer('free_adults_per_children'),
    isFree: boolean('is_free'),
    taxIncluded: boolean('tax_included'),
    extraFeesNote: text('extra_fees_note'),

    /* True when the published price is written for schools or districts. Shows
       the "daycares are quoted separately" flag, and only to daycare accounts. */
    schoolRateOnly: boolean('school_rate_only').notNull().default(false),
    depositRequired: boolean('deposit_required'),
    paymentTiming: text('payment_timing'),
    cancellationNote: text('cancellation_note'),

    monthsOffered: integer('months_offered').array(), // 1-12; null = year round
    daysOffered: integer('days_offered').array(), // ISO weekday, 1 = Monday
    timeSlots: text('time_slots').array(), // "09:30"; overrides morning/afternoon
    leadTimeDays: integer('lead_time_days'),

    /* An object, or an array when the venue states several ratios. Feeds the
       adults/ratio helper on the trip page. */
    chaperoneRatio: jsonb('chaperone_ratio').$type<
      ChaperoneRatio | ChaperoneRatio[]
    >(),
    adultsFree: boolean('adults_free'),

    indoor: boolean('indoor'),
    outdoor: boolean('outdoor'),
    format: programFormat('format').array(),

    /* null is not false: unknown only drops out of results when the filter is on. */
    sensoryFriendly: boolean('sensory_friendly'),
    lowNoise: boolean('low_noise'),
    neurodiversityFriendly: boolean('neurodiversity_friendly'),

    moodTags: moodTag('mood_tags').array(),
    curriculumTags: text('curriculum_tags').array(),

    /* Program level overrides the venue's default: a venue's free self-guided
       visit and its paid workshop rarely book the same way. */
    bookingEmail: text('booking_email'),
    bookingUrl: text('booking_url'),
    bookingMethod: bookingMethod('booking_method'),

    sourceUrl: text('source_url'),
    evidence: text('evidence'),
    checkedOn: date('checked_on'),
    imageIds: text('image_ids').array(),

    /* Programs missing from a re-import are deactivated, never deleted,
       because trips reference them. */
    active: boolean('active').notNull().default(true),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('program_venue_id_idx').on(t.venueId),
    uniqueIndex('program_venue_slug_idx').on(t.venueId, t.slug),
  ],
)

export const image = pgTable(
  'image',
  {
    id: text('id').primaryKey(),
    venueId: text('venue_id')
      .notNull()
      .references(() => venue.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    role: imageRole('role').notNull(),
    alt: text('alt').notNull(),
    altSource: text('alt_source'),
    caption: text('caption'),
    foundOnUrl: text('found_on_url'),
    width: integer('width'),
    height: integer('height'),
    rightsNote: text('rights_note'),
    /* Only licensed, venue_supplied and public_domain render. `unverified`
       holds the image back for review — which is currently every image. */
    usage: imageUsage('usage').notNull().default('unverified'),
  },
  (t) => [index('image_venue_id_idx').on(t.venueId)],
)

/* ─── User side ──────────────────────────────────────────────────────────── */

export const account = pgTable('account', {
  /* Equals auth.users.id. A trigger on auth.users insert creates this row. */
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: accountRole('role').notNull().default('director'),
  phone: text('phone'),
  centreId: text('centre_id'),
  /* A short "the venue replied" email with a link. Not a forwarded copy: the
     relay is send-only and the educator never replies by email. */
  emailNotifications: boolean('email_notifications').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
})

export const centre = pgTable('centre', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: centreType('type').notNull(),
  /* `rate_class` is NOT a column. data-model.md calls it "derived from type",
     and the model's third defended rule is that nothing derived is stored.
     A Postgres generated column cannot express it anyway — text-to-enum casts
     are stable, not immutable, so the expression is rejected. Derive it with
     rateClassOf() in src/lib/rate-class.ts. */
  address: text('address').notNull(),
  lat: real('lat'),
  lng: real('lng'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const room = pgTable(
  'room',
  {
    id: text('id').primaryKey(),
    centreId: text('centre_id')
      .notNull()
      .references(() => centre.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    icon: roomIcon('icon').notNull().default('users'),
    ageMin: real('age_min').notNull(),
    ageMax: real('age_max').notNull(),
    size: integer('size').notNull(),
    /* Licensed ratio for THIS room. Never averaged across rooms — a multi-room
       trip sums each room's requirement separately. */
    ratioChildrenPerAdult: integer('ratio_children_per_adult').notNull(),
    budgetPerChild: numeric('budget_per_child', { precision: 10, scale: 2 }),
    transport: transportMode('transport').array().notNull(),
    address: text('address').notNull(),
    lat: real('lat'),
    lng: real('lng'),
    notes: text('notes'),
    /* Soft delete only. A hard delete would silently relabel historical trips
       with another room's name and numbers. "At least one non-archived room per
       centre" is enforced in the server action, not here. */
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('room_centre_id_idx').on(t.centreId),
    check('room_notes_len', sql`char_length(${t.notes}) <= 300`),
  ],
)

export const trip = pgTable(
  'trip',
  {
    id: text('id').primaryKey(),
    centreId: text('centre_id')
      .notNull()
      .references(() => centre.id, { onDelete: 'cascade' }),
    programId: text('program_id')
      .notNull()
      .references(() => program.id),

    /* Array, not a join table: several rooms can go together and it is read
       whole every time. */
    roomIds: text('room_ids').array().notNull(),

    status: tripStatus('status').notNull().default('requested'),
    statusSource: statusSource('status_source').notNull().default('system'),

    /* The trip's address is trip-<relay_token>@mail.<domain>. This is how an
       inbound reply finds its way back to this row. */
    relayToken: text('relay_token').notNull(),
    /* Resolved at creation, program level over venue level, so a later catalog
       edit never redirects an open thread. */
    venueEmail: text('venue_email'),
    lastVenueReplyAt: timestamp('last_venue_reply_at', { withTimezone: true }),

    dateOptions: jsonb('date_options').$type<DateOption[]>().notNull(),
    confirmedDate: date('confirmed_date'),
    confirmedTime: text('confirmed_time'),

    /* Copied from the rooms at creation, never read live: the trip must survive
       a room being edited or archived. */
    childrenCount: integer('children_count').notNull(),
    adultsCount: integer('adults_count').notNull(),
    roomSnapshots: jsonb('room_snapshots').$type<RoomSnapshot[]>().notNull(),

    costChild: numeric('cost_child', { precision: 10, scale: 2 }),
    costAdult: numeric('cost_adult', { precision: 10, scale: 2 }),
    costGroupFee: numeric('cost_group_fee', { precision: 10, scale: 2 }),
    costTransport: numeric('cost_transport', { precision: 10, scale: 2 }),

    asks: jsonb('asks').$type<Ask[]>().notNull().default([]),
    tasks: jsonb('tasks').$type<Task[]>().notNull().default([]),
    notes: text('notes'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('trip_centre_status_idx').on(t.centreId, t.status),
    uniqueIndex('trip_relay_token_idx').on(t.relayToken),
    check('trip_room_ids_non_empty', sql`array_length(${t.roomIds}, 1) >= 1`),
  ],
)

export const message = pgTable(
  'message',
  {
    id: text('id').primaryKey(),
    tripId: text('trip_id')
      .notNull()
      .references(() => trip.id, { onDelete: 'cascade' }),
    party: messageParty('party').notNull(),
    authorName: text('author_name').notNull(),
    /* Stripped: quoted history and signatures removed. */
    body: text('body').notNull(),
    /* The unstripped text, kept always, so a stripping miss is ugly rather
       than lossy. "Show full message" reads it. */
    bodyFull: text('body_full'),
    /* The opening request renders as a summary card, not a bubble. */
    isRequest: boolean('is_request').notNull().default(false),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp('read_at', { withTimezone: true }),
    attachments: jsonb('attachments').$type<Attachment[]>().notNull().default([]),
    /* Object key of the raw inbound email in the private `mail` bucket.
       Deleted after 90 days; the message survives. */
    rawRef: text('raw_ref'),
    channel: messageChannel('channel').notNull().default('email'),
    externalMessageId: text('external_message_id'),
    /* Non-null means the trip page shows a retry. */
    sendError: text('send_error'),
    /* Never surfaced: a missed nudge is not the educator's problem. */
    notifyError: text('notify_error'),
    suggestion: jsonb('suggestion').$type<Suggestion | null>(),
  },
  (t) => [
    index('message_trip_sent_idx').on(t.tripId, t.sentAt),
    index('message_unread_idx')
      .on(t.readAt)
      .where(sql`${t.readAt} is null`),
  ],
)

export const savedOuting = pgTable(
  'saved_outing',
  {
    accountId: text('account_id')
      .notNull()
      .references(() => account.id, { onDelete: 'cascade' }),
    programId: text('program_id')
      .notNull()
      .references(() => program.id, { onDelete: 'cascade' }),
    savedAt: timestamp('saved_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.accountId, t.programId] })],
)

/* Behind "Something wrong? Tell us". The catalog is only trustworthy if
   correcting it is one tap, so anonymous reports are allowed. */
export const report = pgTable('report', {
  id: text('id').primaryKey(),
  programId: text('program_id').references(() => program.id, {
    onDelete: 'cascade',
  }),
  venueId: text('venue_id').references(() => venue.id, { onDelete: 'cascade' }),
  accountId: text('account_id').references(() => account.id, {
    onDelete: 'set null',
  }),
  field: text('field'),
  note: text('note'),
  status: reportStatus('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

/* ─── Inferred types ─────────────────────────────────────────────────────── */

export type Venue = typeof venue.$inferSelect
export type Program = typeof program.$inferSelect
export type Image = typeof image.$inferSelect
export type Account = typeof account.$inferSelect
export type Centre = typeof centre.$inferSelect
export type Room = typeof room.$inferSelect
export type Trip = typeof trip.$inferSelect
export type Message = typeof message.$inferSelect
export type Report = typeof report.$inferSelect
