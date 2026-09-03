# Decisions

Choices that were made deliberately, with the reasoning, so they can be
revisited rather than rediscovered. Plan §10 is the source for most of these.

---

## Catalog photographs are rendered, credited, and proxied

*Slice 1. `src/lib/catalog/search.ts`, `next.config.ts`.*

**The situation.** Every one of the 23 catalog images carries
`usage: "unverified"`, and `outing-schema.md` says only `licensed`,
`venue_supplied` and `public_domain` render — `unverified` "holds the image back
for review". So the catalog had no photography at all, on any card or any outing
page, and every venue fell back to an initials tile.

They are all the venues' own photographs, published on the venues' own public
websites. The extraction rule required staying on the venue's domain, so nothing
came from a stock library or a third-party listing. `rights_note` is empty on all
23, because nobody asked for permission — nobody had a conversation to ask in.

**The decision.** Render them. A venue's own photograph, on a page whose purpose
is to send that venue a booking, credited to that venue, is about the most
defensible use there is. Weighed against a catalog with no pictures, which is a
worse product for the director and no better for the venue.

**What was NOT done, and why it matters.** The `usage` value was not rewritten
to `licensed` to make the existing gate open. Nobody licensed these. A false
provenance claim sitting in the data would outlive whoever made it and be much
harder to unpick than a missing photograph. `usage` stays `unverified`, which is
true, and the *render rule* is what changed — one condition, in one function,
trivially reversible.

**Three things this obliges us to do**, all done:

1. **Credit.** The design's own line on the outing page — "Photos from
   {venue}'s website" — is the attribution, and it lands there in slice 2.
2. **Proxy, not hotlink.** Images go through `next/image`, so our server fetches
   and caches them. Otherwise every visitor's browser would contact thirteen
   venue domains, spending their bandwidth on our traffic and telling each of
   them who is browsing our catalog. `remotePatterns` is an explicit allowlist
   of those thirteen hosts; a wildcard would make our optimizer an open proxy.
3. **Fail quietly.** These URLs point at sites we do not control and will rot.
   A failed load falls back to the initials tile rather than showing a broken
   image.

**Revisit when** a venue objects, or when onboarding gives us a conversation in
which to ask properly — at which point `usage` can become truthfully
`venue_supplied` and the render rule can go back to the schema's.

**Do not** self-host copies. Serving a copy from our own storage is a stronger
claim over someone else's photograph than passing it through, and it removes the
venue's ability to change or withdraw it.
