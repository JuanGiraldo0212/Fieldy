# VERIFICATION — christ-church-cathedral

- **Fields checked:** 41 non-null values (18 in the venue block, 20 across three programs, 3 image entries), re-read against the recorded `source_url` / `found_on_url`. The labyrinth page was re-fetched with a cache-buster for this pass; the Facility Use Policy PDF (the source for the tour) was read in full.

- **Fields corrected: 1**
  - `images[2].url` / `found_on_url`: the homepage slideshow `Labyrinth.jpg` -> `nw_labyrinth.jpg` on `/visit/our-labyrinth`, because the re-fetch of the labyrinth page rendered its own lead photo, which sits on the program page it is attached to.

- **Fields set to null after review: 1**
  - `venue.hours_notes` — two pages give different visiting hours and neither is dated (see conflicts). The two readings are preserved in `conflicts` instead.

  Not set, and deliberately so: `has_washrooms`, `has_lunch_space`, `wheelchair_accessible`, `stroller_accessible`, `bus_parking` and both `hosts_*` flags. The site never addresses any of them for a visiting group. The Chapter Room kitchen and the labyrinth's wheelchair-friendly design are recorded as `facility_notes` and program text rather than promoted into booleans, and the labyrinth's accessibility statement is about the labyrinth only, not the cathedral.

- **Conflicts recorded: 1** — visiting hours. The homepage and `/visit/welcome-to-ccc` give weekday, Saturday and Sunday hours separately; `/collections/visit` says "open daily for prayer and meditation from 8.30 a.m. to 5.30 p.m.". Neither page is dated, so `hours_notes` is null.

- **Currently offered vs historic — the main risk on this record.** The only first-party, still-live evidence that tours run is section 11.4 of the Facility Use Policy (revised April 2024, posted to the site March 2025): "Formal tours of the cathedral are offered regularly, and may be booked through the Parish Administrator, or on-line." The public programme page `/programs/discover-the-cathedral` now redirects to a login screen and returns no content, so no tour schedule, duration or fee could be read. Nothing was taken from news posts. `guided-cathedral-tour` therefore carries a source and a quote but no price, ages, duration or capacity, and both its description and `our_note` tell the reader to confirm the tour still runs.

- **Prices re-checked:** no admission, donation or tour price is published anywhere, so `general_admission_child_cad`, `general_admission_adult_cad` and every program cost field are null, and `is_free` is null rather than true — an open door is not a stated free admission. The only published money on the site is the room-rental table in the PDF ($60/hr daytime and evening, $95/hr after 9pm, $50/hr for registered non-profits, $100 refundable deposit); that is a venue rental, not a children's programme, so it is summarised in gaps and `facility_notes` and not recorded as a program price.

- **Ages:** the site publishes no age or grade range for anything, so `age_basis` is null on all three programs and no range was invented from the "people of all ages" phrasing.

- **Authored fields written:** `what_children_do` for `self-guided-visit` (grounded in the nave's stated dimensions, the listed features in the Our Cathedral gallery, and the policy line keeping the nave for quiet prayer) and for `labyrinth-walk` (grounded in "one unbroken path to follow", "Choose your pace", and the passing etiquette on the labyrinth page); left null for the tour, because the site never describes what a tour actually involves. `our_note` on all three. `practical_summary` on all three, generated from the parking and kitchen `facility_notes` plus the washroom, lunch, access and hours gaps.

- **Location:** the site links to Google Maps with an address query (`maps?q=Christ Church Cathedral, 930 Burdett Avenue...`), not coordinates, and there is no map iframe, JSON-LD `GeoCoordinates` or `og:latitude`. Address extracted from the site footer and contact page, `lat`/`lng` null, `geo_source` `geocode_pending`. Correct as recorded.

- **Images:** three entries, all on the cathedral's own CloudFront CDN and all confirmed present on the `found_on_url` recorded. Every `alt` is the site's own attribute verbatim — the site uses the generic string "Slideshow image" throughout — so `alt_source` `site` is honest, though the values need a human rewrite before publish and that is flagged in gaps. No captions invented. `rights_note` is null on all three: the only credit-like text on the site is the footer's "© 2026 Christ Church Cathedral. All Rights Reserved.", which is a site-wide copyright line and not a photo credit. `usage` `unverified`. The og:image was not used as the hero because it could not be confirmed to be a photograph rather than a social card; the exterior shot from the Our Cathedral page was used instead, and this is noted in gaps.

- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (pending geocoding), and no program clears the program bar — none of the three has an `age_basis` with a range, and none has a cost field or `is_free`, because the site publishes neither. That gap is real and should be filled by a phone call, not by invention.

- **Confidence: medium** — the address, contact route, restrictions and rental facts are solid and come from a dated first-party PDF, but the one genuinely group-bookable offering rests on a single line in a rental policy while the tour's own page is behind a login, so whether tours currently run for children's groups is unconfirmed.

- **Recommended follow up by phone (250.383.2714) or admin@christchurchcathedral.bc.ca, in priority order for a daycare director:**
  1. **Price** — is there a charge or expected donation for a tour or a group visit?
  2. **Youngest age** — is there a tour version that works for under-fives, and does a young group need to book at all?
  3. **Capacity** — maximum group size inside the cathedral.
  4. **Lead time** — how much notice the Parish Administrator needs, and whether tours are still running at all.
  5. **Lunch space** — whether a group can eat anywhere on site or in the Chapter Room without renting it.
  6. **Washrooms** — not mentioned anywhere on the site.
  7. **Rain backup** — the labyrinth is the young-group-friendly part and it is outdoors on the south lawn.
