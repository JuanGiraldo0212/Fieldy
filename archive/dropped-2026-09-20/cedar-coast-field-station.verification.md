# cedar-coast-field-station.json

VERIFICATION

- **Fields checked:** 4 that carry a value (`id`, `name`, `description`, `checked_on`, `checked_by`), plus every other venue field confirmed null against the absence of any readable first-party page. No programs and no images to check, because there was no venue-controlled page to read.

- **Fields corrected:** 2
  - `website`: `https://www.cedarcoastfieldstation.org/` -> `null` — the domain no longer belongs to the organisation. Carrying it forward would put a link on the card that sends a director to an online gambling site. Null is the honest value and the safe one.
  - `geo_source`: `geocode_pending` -> `null` — `geocode_pending` is for a record that has an extracted address waiting on a geocoder. There is no address here at all, so STEP 2c's third case applies and `lat`, `lng` and `geo_source` are all null.

- **Fields set to null after review:** 1
  - `category` — `nature_outdoors` is the obvious guess for something called a field station on the outer coast, but the guess would rest on the venue's name and the tracker row, not on anything the organisation publishes. The enum rule says leave it null and say so in gaps, so it is null.

- **Conflicts recorded:** 0. Two pages cannot disagree when no venue page is readable.

- **Authored fields written:** none of `what_children_do`, `our_note` or `practical_summary`. All three are program-level and there are no programs. Writing an `our_note` would have meant imagining a visit, which is exactly what those fields are not for. The `description` was written from what was actually verified about the domain, not from any account of the place.

- **What was actually checked, and how:**
  - `https://www.cedarcoastfieldstation.org/` returns a 596-byte stub with the title `cedarcoastfieldstation.org`, `lang="id"`, and favicons served from `imgmahasuhu.io`.
  - `sitemap.xml` lists exactly one URL, `/herbarium/`. That page returns a 93 KB document titled `KOITOTO - Bandar Togel Online 4D Terbaik dengan Bayaran Lunas`, loading scripts from `mahasuhu.sgp1.digitaloceanspaces.com`.
  - `robots.txt` is written in Indonesian and allows search engines only on `/herbarium/`.
  - `/about/`, `/visit/`, `/contact/`, `/programs/`, `/wp-json/` and the `/gallery_category/vargas-island/` URL that still appears in search results all redirect to that same gambling page. The old WordPress site is gone, not hidden.
  - A search for a current official site surfaced `cedarcoastsociety.org`. It is a parked domain: every path returns a 5.6 KB "Redirecting..." shell that posts to `router.parklogic.com`. It publishes nothing.
  - Third-party listings (a tourism board directory, a field-trip directory, a regional partner page) do carry an address, a phone number and a description. None of it was used. It is off-domain by the rules, and it almost certainly describes the organisation as it was before it lost its website.

- **Why the status is `no_website` and not `error`:** `error` tells the orchestrator to re-run the venue with a browser. A browser would render the gambling site perfectly, and the next agent would be one careless step away from writing it into the catalog. This is not a rendering failure; the venue's content is genuinely not on that domain any more, and a search found no replacement. The first line of `gaps` is written as a warning for whoever looks at this next.

- **Meets minimum viable record:** no. Missing `address`, `lat`, `lng`, `category`, and the required `hero` image with `alt`. There are no programs at all, so every program-level requirement is missing too. The record is deliberately left visibly short rather than padded from third-party listings.

- **Confidence:** high — but in the finding, not in the venue. That the listed domain has been taken over and serves unrelated content is verified directly and is not ambiguous. Confidence that Cedar Coast Field Station still runs anything for children's groups is low, because no first-party source remains to say either way.

- **Recommended follow up by phone or email:** there is no first-party contact route left to recommend. Every phone number and address now findable for this organisation comes from a third-party listing that may predate it losing its website, so the follow-up is a step earlier than usual:
  1. Establish whether the organisation still exists and still hosts groups, before spending a call on the details.
  2. Find a current contact by a route the catalog trusts, for example the BC societies register rather than a tourism directory.
  3. Access — how a group gets to the island, who runs the boat, how long the crossing takes and what it adds to the cost. On a boat-access site this gates everything else.
  4. Youngest age welcomed, and whether under-fives are permitted on the crossing at all.
  5. Price, per child or per group, and whether adults are charged.
  6. Capacity and lead time.
  7. Lunch space, washrooms and rain backup on a remote off-grid site.
  8. If the answer to (1) is no, mark the row closed rather than leaving it to be re-scraped.

- **Separate note for the orchestrator:** `extraction-tracker.csv` also carries a row for "Cedar Coast Art and Ecology Centre" at `thecedarcoast.ca`, which another agent is handling. Public sources suggest the two are related and that the Vargas Island facility changed hands between them. That is a merge-or-separate question for a human, and nothing from `thecedarcoast.ca` was read or used for this record.
