/*
  Slice 0 placeholder.

  Slice 1 replaces this with the real catalog (docs/build-order.md). It exists
  now so the thin thread has somewhere to land: once DATABASE_URL is set and
  the catalog is imported, this renders one real venue read from Postgres.
*/
export default function Home() {
  return (
    <main className="mx-auto max-w-page px-5 py-10">
      <h1 className="font-display text-display-lg max-w-measure">
        Every outing in Victoria that actually works for your group.
      </h1>
      <p className="text-body-lg text-text-muted mt-2 max-w-[560px]">
        Tell us about the room once. We keep the details checked and get you
        booked on time.
      </p>
    </main>
  )
}
