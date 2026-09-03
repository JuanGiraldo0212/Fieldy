import { eq } from 'drizzle-orm'
import { db, program, venue } from '@/db'

/*
  Slice 0, the thin thread: one real program, read from Postgres, styled from
  the design tokens. It exists to prove scaffold, tokens, schema, migrations and
  the catalog import all meet each other.

  Slice 1 replaces this with the real catalog — search state in the URL, mood
  and category chips, the filter drawer, sort, the map toggle and feasibility
  badges. See docs/build-order.md.
*/

export default async function Home() {
  const rows = await db
    .select({
      name: program.name,
      ourNote: program.ourNote,
      venueName: venue.name,
      durationMin: program.durationMin,
      costPerChild: program.costPerChildCad,
      capacityMax: program.capacityMax,
      checkedOn: venue.checkedOn,
    })
    .from(program)
    .innerJoin(venue, eq(program.venueId, venue.id))
    .where(eq(program.active, true))
    .limit(1)

  const p = rows[0]

  return (
    <main className="mx-auto max-w-page px-5 py-10">
      <h1 className="font-display text-display-lg max-w-measure">
        Every outing in Victoria that actually works for your group.
      </h1>
      <p className="text-body-lg text-text-muted mt-2 max-w-[560px]">
        Tell us about the room once. We keep the details checked and get you
        booked on time.
      </p>

      {p ? (
        <article className="bg-surface border-border shadow-card mt-8 max-w-measure rounded-card border p-5">
          <h2 className="font-display text-display-sm">{p.name}</h2>
          <p className="text-body-sm text-text-muted mt-1">{p.venueName}</p>

          <dl className="text-meta text-text-faint mt-3 flex flex-wrap gap-x-5 gap-y-1">
            <div>
              <dt className="sr-only">Duration</dt>
              <dd>
                {p.durationMin ? `${p.durationMin} minutes` : 'Length not published'}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Cost</dt>
              <dd>
                {p.costPerChild
                  ? `$${p.costPerChild} a child`
                  : 'Price not published'}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Capacity</dt>
              <dd>
                {p.capacityMax
                  ? `Up to ${p.capacityMax} children`
                  : 'Capacity not published'}
              </dd>
            </div>
          </dl>

          {p.ourNote ? (
            <p className="text-body-sm text-text mt-4 italic">“{p.ourNote}”</p>
          ) : null}

          <p className="text-meta-sm text-text-faint mt-4">
            Details checked on {p.checkedOn}
          </p>
        </article>
      ) : (
        <p className="text-body text-text-muted mt-8">
          No programs loaded. Run <code>pnpm import:catalog</code>.
        </p>
      )}
    </main>
  )
}
