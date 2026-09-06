import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Phone, Plus } from 'lucide-react'
import { fetchVenueForAdmin } from '@/lib/catalog/admin'
import { VENUE_CATEGORIES } from '@/lib/catalog/options'
import { AskPanel } from '@/components/admin/ask-panel'
import { PhotoManager } from '@/components/admin/photo-manager'
import { ProgramTable } from '@/components/admin/program-table'
import { VenueForm, type VenueFormValues } from '@/components/admin/venue-form'
import { adminPage } from '../../gate'

const CATEGORY = new Map<string, string>(VENUE_CATEGORIES)

export default async function AdminVenuePage({
  params,
}: {
  params: Promise<{ venue: string }>
}) {
  const { venue: venueId } = await params
  await adminPage(`/admin/venues/${venueId}`)

  const found = await fetchVenueForAdmin(venueId)
  if (!found) notFound()
  const { venue: v, programs, images, reports, score } = found

  const live = programs.find((p) => p.active)

  const values: VenueFormValues = {
    id: v.id,
    name: v.name,
    category: v.category,
    website: v.website,
    description: v.description,
    address: v.address,
    lat: v.lat,
    lng: v.lng,
    nearbyPark: v.nearbyPark,
    hostsSchoolGroups: v.hostsSchoolGroups,
    hostsDaycareGroups: v.hostsDaycareGroups,
    youngestAgeWelcomedYears: v.youngestAgeWelcomedYears,
    languages: v.languages,
    restrictions: v.restrictions,
    bookingEmail: v.bookingEmail,
    bookingPhone: v.bookingPhone,
    bookingUrl: v.bookingUrl,
    bookingMethod: v.bookingMethod,
    hasWashrooms: v.hasWashrooms,
    hasLunchSpace: v.hasLunchSpace,
    hasRainBackup: v.hasRainBackup,
    strollerAccessible: v.strollerAccessible,
    wheelchairAccessible: v.wheelchairAccessible,
    busParking: v.busParking,
    facilityNotes: v.facilityNotes,
    generalAdmissionChildCad: v.generalAdmissionChildCad,
    generalAdmissionAdultCad: v.generalAdmissionAdultCad,
    priceYearOrSeason: v.priceYearOrSeason,
    hoursNotes: v.hoursNotes,
    seasonalNotes: v.seasonalNotes,
  }

  return (
    <main className="mx-auto max-w-page px-5 pt-5 pb-20">
      <Link href="/admin" className="text-body-sm text-brand inline-block py-2 font-semibold no-underline">
        ← Catalog
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-[260px] flex-1">
          <div className="text-meta-sm text-brand font-bold tracking-[0.08em] uppercase">
            {CATEGORY.get(v.category) ?? v.category}
          </div>
          <h1 className="font-display text-display-md my-1">{v.name}</h1>
          <p className="text-meta text-text-muted m-0">
            Checked {v.checkedOn}
            {v.checkedBy ? ` by ${v.checkedBy}` : ''}
            {v.editedAt ? ' · hand-edited, the import leaves it alone' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {v.bookingPhone ? (
            <a
              href={`tel:${v.bookingPhone.replace(/[^\d+]/g, '')}`}
              className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong flex h-control items-center gap-2 rounded-control border px-3.5 font-semibold no-underline"
            >
              <Phone size={16} />
              {v.bookingPhone}
            </a>
          ) : null}
          {v.website ? (
            <a
              href={v.website}
              target="_blank"
              rel="noreferrer"
              className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong flex h-control items-center gap-2 rounded-control border px-3.5 font-semibold no-underline"
            >
              <ExternalLink size={16} />
              Website
            </a>
          ) : null}
          {live ? (
            <Link
              href={`/outing/${v.id}/${live.slug}`}
              className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong flex h-control items-center gap-2 rounded-control border px-3.5 font-semibold no-underline"
            >
              See it as a director
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="lg:order-2 lg:sticky lg:top-24">
          <AskPanel
            venueId={v.id}
            score={score}
            gaps={v.gaps}
            conflicts={v.conflicts}
            reports={reports.map((r) => ({
              id: r.id,
              programName: r.programId
                ? (programs.find((p) => p.id === r.programId)?.name ?? r.programId)
                : null,
              field: r.field,
              note: r.note,
              createdAt: r.createdAt.toISOString().slice(0, 10),
            }))}
          />
        </div>

        <div className="grid gap-8 lg:order-1">
          <section id="programs" className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-display-sm m-0">Programs</h2>
              <Link
                href={`/admin/venues/${v.id}/programs/new`}
                className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong flex h-control items-center gap-2 rounded-control border px-3.5 font-semibold no-underline"
              >
                <Plus size={16} />
                Add a program
              </Link>
            </div>
            <ProgramTable
              venueId={v.id}
              programs={programs}
              missing={score.items.filter((i) => i.programSlug)}
            />
          </section>

          <section id="photos" className="scroll-mt-24">
            <h2 className="font-display text-display-sm m-0">Photos</h2>
            <PhotoManager
              venueId={v.id}
              venueName={v.name}
              photos={images.map((i) => ({
                id: i.id,
                url: i.url,
                role: i.role,
                alt: i.alt,
                caption: i.caption,
                usage: i.usage,
                rightsNote: i.rightsNote,
                foundOnUrl: i.foundOnUrl,
              }))}
            />
          </section>

          <section>
            <h2 className="font-display text-display-sm m-0">Venue</h2>
            <VenueForm mode="edit" values={values} />
          </section>
        </div>
      </div>
    </main>
  )
}
