# VERIFICATION — Greater Victoria Public Library

- **Fields checked:** 78 (33 venue, 2 × 46 program, 5 × 11 image, plus provenance blocks)

- **Fields corrected:** 2
  - `programs[0].description`: added the sentence about corporate library cards for schools, daycares and nonprofits — reason: the re-fetch of `library-cards` surfaced the "Corporate library cards" section, which is directly relevant to a daycare director and was missed on the first pass.
  - `gaps` (price entry): rewritten — reason: the original wording said the free-ness of the visit was unsupported, which contradicted `is_free: true`. The support actually exists ("Join free programs and events that bring the community together", library services page; "free library card", library cards page). The gap now says exactly what is and is not supported.

- **Fields set to null after review:** 0. Several were left null from the start rather than inferred, and I confirmed each stayed null:
  - `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `bus_parking`, `nearby_park`, `restrictions`, `languages`, `general_admission_*` — the Central Branch page describes bike racks, metered street parking and the Broughton Street Parkade, and says nothing about buses, strollers, lunch or admission.
  - `programs[0].format` — the site says GVPL offers "space and support" for class visits, which does not establish whether the visit is guided or self-guided, so `format` is null rather than guessed.
  - `programs[1].age_basis` / age and grade fields — the storytime page says "younger children" and nothing numeric. Deliberately not converted into an age range.

- **Conflicts recorded:** 0. No two pages disagreed. The only cross-page tension is that hours and features differ by branch, which is branch variation rather than a conflict, and is recorded in `gaps` plus `hours_notes`.

- **Verification method, page by page:**
  - `https://gvpl.ca/how-do-i/library-cards` — **re-fetched with a `?v=1` cache-buster.** Returned byte-identical content, including the visitor card price table ($200 / $100 / $50 / $35 / $20), so the Redis page cache on this site is serving current content, not a stale copy. Those visitor card prices are for individual out-of-area patrons and are deliberately **not** recorded as a program cost. Evidence quote confirmed verbatim: "Teachers bringing students to the library can apply for library cards ahead of time using a class visit form."
  - `https://www.gvshof.ca` and `https://www.cruising.bc.ca/private-instruction.html` were also cache-busted in the same pass for the other two venues in this batch; both matched.
  - `Library-Card-Application-Form-PreK-8-FINAL-Aug2025.pdf` — read in full. Heading reads "Library Card Application Form for Pre K-8 Students", which is the sole support for `grade_min: -1`, `grade_max: 8`, `age_basis: "grades"`. Both age fields left null, as required. The form is dated August 2025 and that date is stated in the program description so a reviewer can see how old the grade range is.
  - `https://gvpl.ca/branch/central` and `https://gvpl.ca/programs/family-storytime-with-stay-play` — read once, during STEP 1, and **not** re-fetched. Both were transcribed verbatim into the record at the time of reading and neither carries a price, which is where the stale-cache risk lies. Flagging this as a deliberate shortcut rather than claiming a second read.
  - Accessibility and washroom claims re-read against the STEP 1 fetch of the Central Branch page: "All GVPL branches, including ours, have wheelchair-accessible entrances, washrooms, and computers." That single sentence supports `has_washrooms: true` and `wheelchair_accessible: true`, and is stored verbatim in `facility_notes`. Neither was inferred from a photo or from a phrase like "family friendly".

- **Cost check:** neither program carries a per-child or per-group number, so the per-class-recorded-as-per-child error cannot arise here. `is_free: true` on both.

- **Capacity check:** `capacity_max` and `capacity_min` are null on both programs. No minimum was mis-filed as a maximum because no number is published at all.

- **`school_rate_only`:** false on both. Correct — neither is priced, and neither sits on a page written for schools and districts in the pricing sense.

- **Location:** `geo_source: "geocode_pending"`. Honest. The Central Branch page links out to a `maps.app.goo.gl` short link, which publishes no coordinates in the page source; there is no Maps iframe with `!3d/!4d`, no JSON-LD `GeoCoordinates`, and no `og:latitude`. Address extracted verbatim ("735 Broughton Street, Victoria, B.C. V8W 3H2"), `lat`/`lng` left null for the backfill script. No pin was hand-placed.

- **Images:** 5 entries, exactly 1 `hero`. Every URL is absolute, https, and on `gvpl.ca/wp-content/uploads` — the venue's own WordPress uploads directory. Each was present in the fetched markup of the `found_on_url` recorded against it. `alt_source` audited: three are `site` (verbatim non-empty alt attributes), two are `generated` because the images carried no alt at all — the homepage Open Graph image, which has no alt by definition, and the Central Branch header photo, whose `img` tag has an empty alt. No filename-style alt was accepted as alt text. `caption` is null on all five; none was invented. `rights_note` is null on all five — the site carries a footer line "All content ©2026 Greater Victoria Public Library", which is a site-wide copyright, not a photo credit, and was correctly not used. `usage` is `unverified` throughout. Note for the reviewer: the storytime photo's filename contains "iStock", so it is very likely licensed stock rather than a photo of an actual GVPL storytime; `unverified` holds it back for exactly that reason.

- **Authored fields written:** all three, on both programs.
  - `what_children_do` rests on: each branch "has a children's area designed for play, reading, and imagination"; "If you'd like your child to borrow books during the visit to the library, they will need a library card" (class visit form); and, for storytime, "stories, songs, rhymes, and puppets, followed by 30 minutes of social time and free play".
  - `our_note` rests on the absence of published logistics for class visits, the parent-signature requirement on the form, and the storytime line "Children must be accompanied by an adult".
  - `practical_summary` rests on the branch accessibility sentence plus the `gaps` list.
  - `mood_tags`: class visit is `explore` + `learn` — the children browse a collection at their own pace and the library's own words are "learning visits". Storytime is `play` only — the children sing, do the fingerplays and then have thirty minutes of free play, which is hands-on doing rather than being shown; `learn` was deliberately not added just because a library is educational.

- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng`, which are pending the geocoder backfill. Everything else on the bar is present: venue `id`, `name`, `address`, `category`, `checked_on`, a hero image with alt, and a program with `id`, `name`, `age_basis` plus a grade range, `comes_to_you`, `is_free` and `our_note`.

- **Confidence:** medium. The two facts that matter most to a director — that class visits exist and that they run from Pre-K to Grade 8 — are solidly sourced, one from the site body and one from the library's own PDF, but everything operational (duration, capacity, lead time, which of the 12 branches, lunch) is simply not published anywhere, and the record is held at system level while the practical detail lives branch by branch.

- **Recommended follow up by phone or email** (250-940-4875, in priority order for a daycare director):
  1. **Price** — confirm a booked class visit costs nothing, including for a daycare rather than a school.
  2. **Youngest age** — the Pre K-8 form implies under-fives are welcome, but ask the branch what it actually takes for a daycare group.
  3. **Capacity** — how many children a branch will host in one visit.
  4. **Lead time** — how much notice, and how far ahead the card forms need to go home.
  5. **Lunch space** — whether a group may eat indoors anywhere, at any branch.
  6. **Washrooms** — confirmed present and wheelchair-accessible at every branch; ask about change tables for under-threes.
  7. **Rain backup** — not applicable indoors, but ask whether the children's area is bookable or shared with the public during the visit.
  8. **Outreach** — ask whether a librarian will come to the daycare, since the site describes no come-to-you option and this record has `comes_to_you: false` on both programs.
