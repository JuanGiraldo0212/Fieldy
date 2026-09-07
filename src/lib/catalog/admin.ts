/*
  Reads for /admin. Every function here is called only after requireAdmin()
  has passed on the page; nothing in this file checks, because the page and
  the action are the boundary (src/lib/auth.ts).
*/

import { and, asc, desc, eq, like, or } from 'drizzle-orm'
import { db, image, program, report, venue } from '@/db'
import { compareCompleteness, completeness, type Completeness } from './completeness'

export type AdminVenueRow = {
  id: string
  name: string
  category: string
  bookingEmail: string | null
  bookingPhone: string | null
  checkedOn: string
  editedAt: Date | null
  programCount: number
  activeProgramCount: number
  hasHero: boolean
  openReports: number
  score: Completeness
}

/*
  The whole catalog scored in memory. Thirty venues, eighty programs and
  sixty images is four small queries and a few hundred comparisons; pushing
  the scoring into SQL would make it a second copy of completeness() that has
  to be kept in step with the first.
*/
export async function listVenuesForAdmin(): Promise<AdminVenueRow[]> {
  const [venues, programs, images, openReports] = await Promise.all([
    db.select().from(venue).orderBy(asc(venue.name)),
    db
      .select({
        venueId: program.venueId,
        slug: program.slug,
        name: program.name,
        active: program.active,
        comesToYou: program.comesToYou,
        ageBasis: program.ageBasis,
        ageMinYears: program.ageMinYears,
        gradeMin: program.gradeMin,
        costPerChildCad: program.costPerChildCad,
        costPerGroupCad: program.costPerGroupCad,
        isFree: program.isFree,
        durationMin: program.durationMin,
        capacityMax: program.capacityMax,
        leadTimeDays: program.leadTimeDays,
        daysOffered: program.daysOffered,
      })
      .from(program),
    db.select({ venueId: image.venueId, role: image.role }).from(image),
    db
      .select({ venueId: report.venueId, programId: report.programId })
      .from(report)
      .where(eq(report.status, 'new')),
  ])

  const programsByVenue = new Map<string, typeof programs>()
  for (const p of programs) {
    const list = programsByVenue.get(p.venueId) ?? []
    list.push(p)
    programsByVenue.set(p.venueId, list)
  }
  const imagesByVenue = new Map<string, typeof images>()
  for (const i of images) {
    const list = imagesByVenue.get(i.venueId) ?? []
    list.push(i)
    imagesByVenue.set(i.venueId, list)
  }
  /* A report names a program or a venue; a program's id starts with its
     venue's id, so both resolve to a venue without another query. */
  const reportsByVenue = new Map<string, number>()
  for (const r of openReports) {
    const vid = r.venueId ?? r.programId?.split(':')[0]
    if (!vid) continue
    reportsByVenue.set(vid, (reportsByVenue.get(vid) ?? 0) + 1)
  }

  const rows = venues.map((v): AdminVenueRow => {
    const ps = programsByVenue.get(v.id) ?? []
    const is = imagesByVenue.get(v.id) ?? []
    return {
      id: v.id,
      name: v.name,
      category: v.category,
      bookingEmail: v.bookingEmail,
      bookingPhone: v.bookingPhone,
      checkedOn: v.checkedOn,
      editedAt: v.editedAt,
      programCount: ps.length,
      activeProgramCount: ps.filter((p) => p.active).length,
      hasHero: is.some((i) => i.role === 'hero'),
      openReports: reportsByVenue.get(v.id) ?? 0,
      score: completeness(v, ps, is),
    }
  })

  return rows.sort((a, b) =>
    compareCompleteness(
      { ...a.score, name: a.name },
      { ...b.score, name: b.name },
    ),
  )
}

export async function fetchVenueForAdmin(venueId: string) {
  const rows = await db.select().from(venue).where(eq(venue.id, venueId)).limit(1)
  const v = rows[0]
  if (!v) return null

  const [programs, images, reports] = await Promise.all([
    db
      .select()
      .from(program)
      .where(eq(program.venueId, venueId))
      .orderBy(desc(program.active), asc(program.name)),
    db.select().from(image).where(eq(image.venueId, venueId)).orderBy(asc(image.id)),
    /* A report names either the venue or one of its programs, and a program
       id begins with its venue id. */
    db
      .select({
        id: report.id,
        programId: report.programId,
        field: report.field,
        note: report.note,
        createdAt: report.createdAt,
      })
      .from(report)
      .where(
        and(
          eq(report.status, 'new'),
          or(eq(report.venueId, venueId), like(report.programId, `${venueId}:%`)),
        ),
      )
      .orderBy(desc(report.createdAt)),
  ])

  return {
    venue: v,
    programs,
    images,
    reports,
    score: completeness(v, programs, images),
  }
}

export async function fetchProgramForAdmin(venueId: string, slug: string) {
  const rows = await db
    .select()
    .from(program)
    .where(and(eq(program.venueId, venueId), eq(program.slug, slug)))
    .limit(1)
  return rows[0] ?? null
}
