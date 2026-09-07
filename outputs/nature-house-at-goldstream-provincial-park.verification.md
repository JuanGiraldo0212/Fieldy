# VERIFICATION — Nature House at Goldstream Provincial Park

Verified 2026-09-03. The tracker had this row as `no_website` with a blank website column. That was
wrong: the venue has an operator site.

**Source note.** A search for "Nature House Goldstream Provincial Park Victoria" found
`naturehouse.ca`, the Nature House's historic domain, which now redirects to
`discoverparks.ca/nature house`. Discover Parks is a project of the BC Parks Foundation and is the
body that staffs and runs the Nature House, so that page is treated as the venue's own. The BC
Parks page for Goldstream Park was used as a second on-domain source for the school and group
booking route and the park rules. `goldstreampark.com` was opened and rejected: it is a
third-party commercial site carrying bed and breakfast advertising, not the operator, and nothing
was taken from it. BC Parks separately names RLC Park Services as the park operator; their site was
not needed for anything the record claims.

- **Fields checked:** 31 across the venue block, three programs, one image and the location fields.

- **Fields corrected:** 0.

- **Fields set to null after review:** 3.
  - `is_free` on the Nature House visit. The Discover Parks activity card shows the word "Free"
    but only inside a run-together card label, not as a sentence anyone could quote. The one
    explicit "entry is free" sentence on that page belongs to Miracle Beach, a different nature
    house, so it cannot be borrowed. Set to null with a line in gaps.
  - `address`, and with it `lat`, `lng` and `geo_source`. Neither operator page publishes a street
    address or coordinates for the Nature House. The only address available was on the
    third-party site. A park-centroid pin was available from the BC Parks map link and was
    deliberately not used.

- **Conflicts recorded:** 0. The two on-domain sources agree with each other.

- **Authored fields written:** `what_children_do` on the Nature House visit and the drop-in
  programs, and `our_note` plus `practical_summary` on all three programs. `what_children_do` rests
  on "Inside, you'll find engaging displays, hands-on activities" and on the Ambassadors page list
  of guided nature walks, evening programs and Jerry's Rangers. It was left null on the school and
  group programs because the site never describes what happens on one. The `our_note` on the first
  two programs rests on the current advisory that the exhibit space is closed after structural
  damage, which is the single most useful thing a director could know before driving out.

- **Retrieval:** the activity detail pages on discoverparks.ca render client-side and return only
  `<head>` metadata to a plain fetch. Four were tried cold, including a trailing-slash variant, and
  all four came back empty. The Chrome browser tools were unavailable on this run, so the fall
  salmon run school programs page could not be read. This is recorded as a RETRIEVAL NOTE in gaps
  so a later fetch-only re-run does not overwrite this record with an empty one. The nature house
  landing page and the Ambassadors page do render server-side and carried all the content used here.

- **Images:** one hero. The og:image on the nature house page is the Discover Parks social card,
  the same file that appears on unrelated pages of the site, so it was skipped. The gallery on that
  page is shared across all four of the operator's nature houses, so only the photo whose own alt
  text reads "Goldstream Nature House" was taken, recorded at its underlying CDN URL on
  `admin.discoverparks.ca` rather than the Next.js image proxy. `alt_source` is `site`; no alt was
  generated, because without a browser no image could be looked at.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, and a
  program carrying an age or grade range, which no page publishes.

- **Confidence:** medium. What is recorded is well supported by two on-domain pages, but the record
  is thin on exactly the things a group leader needs, and the fall school programs, which are
  probably the main reason to bring a class here, sit behind a page that would not render.

- **Recommended follow up by phone or email**, in priority order, to
  goldstreamnaturehouse@bcparksfoundation.ca:
  1. Price of a school or group program, and whether there is any charge to visit the building.
  2. Whether the exhibit space has reopened after the structural damage.
  3. Youngest age they take, and whether daycare and preschool groups are welcome.
  4. Group size they can handle, and how far ahead to book.
  5. The exact street address and meeting point, since neither is published.
  6. Lunch space, washrooms, rain backup and where a bus can park.

## Targeted browser pass, 2026-09-07

Re-opened the operator's pages in Chrome, polling until each rendered and walking into shadow DOM,
which the fetch-only run on 2026-09-03 could not do.

- **The fall salmon run school programs page now returns 404.** The page rendered fully and shows
  "Wrong turn. Sorry, we can't find the page you're looking for. 404 Not Found". The operator's own
  content list still holds an entry called Goldstream Salmon Run School Programs, but its status is
  `development` rather than `published`, last touched 2026-09-04. The public salmon run programs
  entry is in the same state, and the community groups one is archived. No salmon run programs have
  been added, because no published page states their dates, times, price, ages or booking route.
  Recorded as a SALMON RUN SCHOOL PROGRAMS line in gaps, with a note to re-run in October.
- **Program added:** `guided-school-program`, from the one school programs page that is published.
  Ninety minutes, $150 per program slot, one booking covering one adult and one class of 25,
  grades K to 3, 4 to 7 and 8 to 12, booked through the Book Now button plus a separate form, with
  the full cancellation ladder. That page also says the activity ended on 2026-05-15, which is
  recorded in the description and in `price_year_or_season`.
- **Fields corrected:** `hours_notes` (the June to September window is gone; the page now names a
  September 23 closure for fall staff training), `has_washrooms` null to true,
  `wheelchair_accessible` null to true, `facility_notes` null to an object with washrooms,
  wheelchair access and parking, `price_year_or_season`, `checked_on` on all programs.
- **Closure status:** unchanged. The Nature House page still says the exhibit space remains
  temporarily closed because of structural damage affecting the power supply, with the front desk
  and retail store open.
- **Images:** now two. Added the school programs photograph, which carries the site's own alt text.
- **Meets minimum viable record:** still no. `address`, `lat` and `lng` are still missing, since no
  page on the operator's site publishes a street address or a place pin. The programs bar is now met.
- **Confidence:** medium to high on what is recorded, low on the fall season, which is unpublished.
