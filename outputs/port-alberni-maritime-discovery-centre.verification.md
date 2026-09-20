# port-alberni-maritime-discovery-centre.json

VERIFICATION

- **Fields checked:** 62 (31 venue fields, the non-null fields on all five programs, and the single image entry). Every program's `source_url` was re-fetched cold in a second pass and each evidence quote was matched against the page text with whitespace normalised. All five matched word for word. The home page was re-fetched to confirm the address, the hours block, the seasonal sentence and the hero image.

- **Fields corrected:** 3
  - `venue.name`: "Port Alberni Maritime Discovery Center" -> "Port Alberni Maritime Discovery Centre". The page title tag and the Open Graph title use the American spelling, but the home page heading, the footer line on every page and the tracker all use "Centre". The footer wins as the venue's own settled name.
  - `gallery-space-rental.cost_per_group_cad`: 200 -> 100. The rates sit in two unlabelled columns. Re-reading the source confirmed the left column is headed "for Adult events" and the right "for Children events", so the children's full day is $100 and the $200 belongs to adult events. This is the per-class-versus-per-child trap in a different shape and it was caught on the second pass.
  - `childrens-summer-weekend-classes.days_offered`: [1,6,7] -> [6,7]. The page heading says Saturdays and Sundays; the Monday that also appears in the list is a single statutory holiday date, not a weekly day, so it is described in the program text instead of being promoted to a recurring weekday.

- **Fields set to null after review:** 4
  - `venue.general_admission_adult_cad` and `general_admission_child_cad` — no admission figure exists anywhere on the site. The rental rates are for private hire of a room, not admission, and were not allowed to stand in for it.
  - `lighthouse-space-rental.capacity_max` and `gallery-space-rental.capacity_max` — "over 20" and "over 60" are the points where the price doubles, not the number the room holds. They were moved to `extra_fees_note`, which is where a price condition belongs.
  - Also checked and deliberately left null rather than inferred: `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking`, `facility_notes`, `nearby_park`, `restrictions`. A keyword sweep for washroom, restroom, toilet, parking, accessible, wheelchair, stair, elevator, lunch, picnic and admission across every page in the site's own sitemap returned nothing. `facility_notes` is null because there is no sentence to put in it, not because it was skipped.
  - The occupancy numbers on the site's covid-19 page (Hutcheson Gallery 10, Lighthouse 4, Shipyard 10) were **not** used for `capacity_max`. They are 2020 distancing limits on an orphan page, and recording them would have understated the rooms badly.

- **Conflicts recorded:** 1. The Weekends by the Sea page and the covid-19 page give different days and times for the children's programs. Neither page carries a date, so the audit trail, including which page said what and why the weekend schedule was the one recorded, sits in `gaps`, and the director-facing note gives her both answers and tells her to check when she books.

- **Authored fields written:**
  - `what_children_do` on the self-guided visit only. It rests on the exhibitions page (ship models, the navigation tools in the Hutcheson Gallery, the computer display in the tsunami exhibit, the Swan as an 11 metre steam launch raised from Sproat Lake, the Tatoosh boom boat, the pier panels covering ships, industry and wildlife) and on the home page line "Step inside our lighthouse". Every clause was matched back to a verbatim sentence on the re-fetched pages.
  - `what_children_do` was left **null** on the other four programs. The site never describes what a tour covers, what happens in a Sailboats or Paddleboats class, or what a rented room is used for, and a plausible visit was not imagined to fill the space.
  - `our_note` on all five, resting on what is published against what is missing: no tour details at all, an admission price absent everywhere, exhibits that sit outside on the pier, a doubled rental rate that a full class would trip, and a children's classes page showing last summer's dates.
  - `practical_summary` on all five, generated from the facility fields (all null) plus the gaps list.

- **Meets minimum viable record:** no. Two things are missing.
  1. `venue.lat` and `venue.lng`. No geocoding service was available on this run and the site publishes no coordinates, no Google Maps embed with a lat/lng in the URL, no JSON-LD `GeoCoordinates` and no `og:latitude`. The full street address is captured and `geo_source` is `geocode_pending`, so a single backfill pass will close this without re-reading the site.
  2. No program clears the program half of the bar on its own, though between them they nearly do. The two rentals have a cost, `comes_to_you` and `our_note` but no `age_basis` or range. The weekend children's classes have `age_basis` "years" with ages 5 to 12, `comes_to_you` and `our_note` but no cost field and no `is_free`. The guided tour and the self-guided visit have neither an age range nor a price.

  The record was not padded to clear the bar. One phone call fixes both halves.

- **Confidence:** medium. Everything recorded is verbatim-supported and was re-checked against a cold second fetch, and the site is small enough that its own sitemap was read in full: of the sixteen pages it lists, the eleven that could plausibly carry group, price, facility or image information were opened, and the five left (blog, board members, sponsors, videos, job posting) carry none. The uncertainty is not about what was read, it is that a lighthouse museum on a working pier publishes nothing about admission, washrooms, stairs or how many children can come, which are the first four things a director will ask.

- **Recommended follow up by phone or email** (250-723-6164, portalbernimhs@gmail.com):
  1. **Price** — what does a group pay to get in, is there a school or daycare rate, and what does a guided tour cost?
  2. **Youngest age** — are preschool and daycare groups welcome, or is the centre really pitched at ages 5 and up as the weekend classes suggest?
  3. **Capacity** — how many children can be in the lighthouse and in the Hutcheson Gallery at once?
  4. **Lead time** — how much notice does a booked tour need, and how long does a tour run?
  5. **Lunch space** — is there anywhere indoors a group can eat, or is Harbour Quay the fallback?
  6. **Washrooms** — are there any on site, and is there a change table?
  7. **Rain backup** — the Swan, the Tatoosh and the pier panels are outside, so what happens to a visit in the rain?
  8. **Stairs and access** — can a stroller or a wheelchair get into the lighthouse and the gallery?
  9. **Children's classes** — do they still run on summer weekends, what do the children actually do in them, and does a group need to reserve?
