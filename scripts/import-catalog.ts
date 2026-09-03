/*
  Catalog import. Plan section 4.3.

  The only way catalog data enters the system; there is no admin UI in the MVP.

  Rules this script holds to:
  - Validates every file first. One failure aborts the whole run, with the path
    and the error. A partial catalog is worse than none.
  - Upserts venues by slug and programs by (venue_id, slug), in one transaction.
  - Fields present in the JSON overwrite the database; fields absent are left
    untouched, so hand edits to columns the JSON does not carry survive.
  - Programs in the database but missing from the JSON are marked active=false,
    never deleted, because trips reference them.
  - Images are copied as references. Nothing is uploaded.
  - Validates and loads. It does not transform — geocoding lives in its own
    script for exactly that reason.

  Usage:
    pnpm import:catalog              validate and load
    pnpm import:catalog --dry-run    validate and report, touch no database
*/

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { and, eq, inArray, notInArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { image, program, venue } from '@/db/schema'
import { catalogFileSchema, type CatalogFile } from '@/lib/catalog/schema'

const CATALOG_DIR = 'outputs'
const dryRun = process.argv.includes('--dry-run')

/* ─── Read and validate ──────────────────────────────────────────────────── */

const files = readdirSync(CATALOG_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()

if (files.length === 0) {
  console.error(`No catalog files in ${CATALOG_DIR}/`)
  process.exit(1)
}

const parsed: { file: string; data: CatalogFile }[] = []

for (const file of files) {
  const path = join(CATALOG_DIR, file)
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    console.error(`\n${path}\n  not valid JSON: ${(e as Error).message}`)
    process.exit(1)
  }

  const result = catalogFileSchema.safeParse(raw)
  if (!result.success) {
    console.error(`\n${path}`)
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    }
    console.error('\nAborted. A partial catalog is worse than none.')
    process.exit(1)
  }
  parsed.push({ file, data: result.data })
}

/* ─── Warnings: honest gaps that do not fail the import ──────────────────── */

const warn = {
  noCoords: [] as string[],
  noHero: [] as string[],
  unverifiedImages: 0,
  totalImages: 0,
  noAgeBasis: [] as string[],
  noCost: [] as string[],
  noPrograms: [] as string[],
}

for (const { data } of parsed) {
  const v = data.venue
  if (v.lat == null || v.lng == null) warn.noCoords.push(v.id)
  const imgs = data.images ?? []
  if (!imgs.some((i) => i.role === 'hero')) warn.noHero.push(v.id)
  if (data.programs.length === 0) warn.noPrograms.push(v.id)
  for (const i of imgs) {
    warn.totalImages++
    if (i.usage === 'unverified') warn.unverifiedImages++
  }
  for (const p of data.programs) {
    if (!p.age_basis) warn.noAgeBasis.push(`${v.id}:${p.id}`)
    if (
      p.cost_per_child_cad == null &&
      p.cost_per_group_cad == null &&
      p.is_free == null
    ) {
      warn.noCost.push(`${v.id}:${p.id}`)
    }
  }
}

const totalPrograms = parsed.reduce((n, p) => n + p.data.programs.length, 0)

console.log(`\nValidated ${parsed.length} venues, ${totalPrograms} programs, ${warn.totalImages} images — 0 errors.\n`)

/* ─── Load ───────────────────────────────────────────────────────────────── */

const money = (n: number | null | undefined) => (n == null ? null : String(n))
const int = (n: number | null | undefined) =>
  n == null ? null : Math.round(n)

type Diff = {
  newVenues: string[]
  newPrograms: string[]
  priceChanges: string[]
  deactivated: string[]
}

const diff: Diff = {
  newVenues: [],
  newPrograms: [],
  priceChanges: [],
  deactivated: [],
}

if (!dryRun) {
  const client = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false })
  const db = drizzle(client)

  const existingVenues = new Set(
    (await db.select({ id: venue.id }).from(venue)).map((r) => r.id),
  )
  const existingPrograms = new Map(
    (
      await db
        .select({
          id: program.id,
          venueId: program.venueId,
          costChild: program.costPerChildCad,
          costGroup: program.costPerGroupCad,
        })
        .from(program)
    ).map((r) => [r.id, r]),
  )

  for (const { data } of parsed) {
    const v = data.venue

    if (!existingVenues.has(v.id)) diff.newVenues.push(v.id)

    const venueRow = {
      id: v.id,
      name: v.name,
      website: v.website,
      description: v.description,
      category: v.category,
      address: v.address,
      lat: v.lat,
      lng: v.lng,
      geoSource: v.geo_source,
      hostsSchoolGroups: v.hosts_school_groups,
      hostsDaycareGroups: v.hosts_daycare_groups,
      youngestAgeWelcomedYears: v.youngest_age_welcomed_years,
      bookingEmail: v.booking_email,
      bookingPhone: v.booking_phone,
      bookingUrl: v.booking_url,
      bookingMethod: v.booking_method,
      hasWashrooms: v.has_washrooms,
      hasLunchSpace: v.has_lunch_space,
      hasRainBackup: v.has_rain_backup,
      strollerAccessible: v.stroller_accessible,
      wheelchairAccessible: v.wheelchair_accessible,
      busParking: v.bus_parking,
      facilityNotes: v.facility_notes,
      nearbyPark: v.nearby_park,
      restrictions: v.restrictions,
      languages: v.languages,
      generalAdmissionChildCad: money(v.general_admission_child_cad),
      generalAdmissionAdultCad: money(v.general_admission_adult_cad),
      hoursNotes: v.hours_notes,
      seasonalNotes: v.seasonal_notes,
      priceYearOrSeason: v.price_year_or_season,
      checkedOn: v.checked_on,
      checkedBy: v.checked_by,
      gaps: data.gaps,
      conflicts: data.conflicts?.map((c) => ({
        field: c.field,
        values: c.values,
        sources: c.sources,
        note: c.note ?? undefined,
      })),
      pagesOpened: data.pages_opened,
      pagesUseful: data.pages_useful,
      extractedAt: data.extracted_at ? new Date(data.extracted_at) : null,
      extractorVersion: data.extractor_version,
      updatedAt: new Date(),
    }

    await db
      .insert(venue)
      .values(venueRow)
      .onConflictDoUpdate({ target: venue.id, set: venueRow })

    /* Images are replaced wholesale: they are a pure projection of the JSON,
       with no hand-edited columns to preserve. */
    await db.delete(image).where(eq(image.venueId, v.id))
    if ((data.images ?? []).length > 0) {
      await db.insert(image).values(
        data.images.map((i) => ({
          id: `${v.id}:${i.id}`,
          venueId: v.id,
          url: i.url,
          role: i.role,
          alt: i.alt,
          altSource: i.alt_source,
          caption: i.caption,
          foundOnUrl: i.found_on_url,
          width: int(i.width),
          height: int(i.height),
          rightsNote: i.rights_note,
          usage: i.usage,
        })),
      )
    }

    const seenProgramIds: string[] = []

    for (const p of data.programs) {
      const id = `${v.id}:${p.id}`
      seenProgramIds.push(id)

      const prior = existingPrograms.get(id)
      if (!prior) {
        diff.newPrograms.push(id)
      } else if (
        prior.costChild !== money(p.cost_per_child_cad) ||
        prior.costGroup !== money(p.cost_per_group_cad)
      ) {
        diff.priceChanges.push(
          `${id}: child ${prior.costChild ?? '—'} → ${money(p.cost_per_child_cad) ?? '—'}, group ${prior.costGroup ?? '—'} → ${money(p.cost_per_group_cad) ?? '—'}`,
        )
      }

      const programRow = {
        id,
        venueId: v.id,
        slug: p.id,
        name: p.name,
        description: p.description,
        whatChildrenDo: p.what_children_do,
        ourNote: p.our_note,
        practicalSummary: p.practical_summary,
        comesToYou: p.comes_to_you,
        ageMinYears: p.age_min_years,
        ageMaxYears: p.age_max_years,
        gradeMin: int(p.grade_min),
        gradeMax: int(p.grade_max),
        ageBasis: p.age_basis,
        durationMin: int(p.duration_min),
        capacityMax: int(p.capacity_max),
        capacityMin: int(p.capacity_min),
        costPerChildCad: money(p.cost_per_child_cad),
        costPerGroupCad: money(p.cost_per_group_cad),
        costPerAdultCad: money(p.cost_per_adult_cad),
        freeAdultsPerChildren: int(p.free_adults_per_children),
        isFree: p.is_free,
        taxIncluded: p.tax_included,
        extraFeesNote: p.extra_fees_note,
        schoolRateOnly: p.school_rate_only ?? false,
        depositRequired: p.deposit_required,
        paymentTiming: p.payment_timing,
        cancellationNote: p.cancellation_note,
        monthsOffered: p.months_offered,
        daysOffered: p.days_offered,
        timeSlots: p.time_slots,
        leadTimeDays: int(p.lead_time_days),
        chaperoneRatio: p.chaperone_ratio,
        adultsFree: p.adults_free,
        indoor: p.indoor,
        outdoor: p.outdoor,
        format: p.format,
        sensoryFriendly: p.sensory_friendly,
        lowNoise: p.low_noise,
        neurodiversityFriendly: p.neurodiversity_friendly,
        moodTags: p.mood_tags,
        curriculumTags: p.curriculum_tags,
        bookingEmail: p.booking_email,
        bookingUrl: p.booking_url,
        bookingMethod: p.booking_method,
        sourceUrl: p.source_url,
        evidence: p.evidence,
        checkedOn: p.checked_on,
        imageIds: p.image_ids?.map((i) => `${v.id}:${i}`) ?? null,
        active: true,
        updatedAt: new Date(),
      }

      await db
        .insert(program)
        .values(programRow)
        .onConflictDoUpdate({ target: program.id, set: programRow })
    }

    /* Never deleted: trips reference them. */
    const stale = await db
      .select({ id: program.id })
      .from(program)
      .where(
        and(
          eq(program.venueId, v.id),
          notInArray(program.id, seenProgramIds),
          eq(program.active, true),
        ),
      )
    if (stale.length > 0) {
      await db
        .update(program)
        .set({ active: false, updatedAt: new Date() })
        .where(inArray(program.id, stale.map((s) => s.id)))
      diff.deactivated.push(...stale.map((s) => s.id))
    }
  }

  await client.end()
}

/* ─── Diff report ────────────────────────────────────────────────────────── */

const line = (label: string, items: string[]) => {
  console.log(`${label}: ${items.length}`)
  for (const i of items.slice(0, 10)) console.log(`  ${i}`)
  if (items.length > 10) console.log(`  … and ${items.length - 10} more`)
}

if (dryRun) {
  console.log('DRY RUN — nothing written.\n')
} else {
  console.log('Loaded.\n')
  line('New venues', diff.newVenues)
  line('New programs', diff.newPrograms)
  line('Changed prices', diff.priceChanges)
  line('Deactivated programs', diff.deactivated)
  console.log()
}

console.log('Warnings')
console.log(`  venues with no coordinates: ${warn.noCoords.length}/${parsed.length}${warn.noCoords.length ? '  ← distance, radius, sort and maps are all dead until geocoded' : ''}`)
if (warn.noCoords.length) console.log(`    run: pnpm geocode:catalog`)
console.log(`  venues with no hero image:  ${warn.noHero.length}/${parsed.length}`)
if (warn.noPrograms.length) {
  console.log(`  venues with NO programs:    ${warn.noPrograms.length}  ← never appear in the catalog`)
  for (const id of warn.noPrograms) console.log(`    ${id}`)
}
console.log(`  images withheld as unverified: ${warn.unverifiedImages}/${warn.totalImages}${warn.unverifiedImages === warn.totalImages && warn.totalImages > 0 ? '  ← every card falls back to the initials tile' : ''}`)
console.log(`  programs with no age_basis:  ${warn.noAgeBasis.length}/${totalPrograms}  (renders as an honest gap, becomes an ask)`)
console.log(`  programs with no published price: ${warn.noCost.length}/${totalPrograms}  (same)`)
console.log()
