# VERIFICATION — b-c-forest-discovery-centre

- **Fields checked:** 118 across the venue block, 7 programs and 4 images. Every program `source_url` was reopened after the JSON was drafted, and the two price pages were re-read from the live DOM in a browser rather than from a fetch.

- **Fields corrected:** 3
  - `venue.general_admission_child_cad`: 14 -> 12. First read took the summer rate. The shoulder season rate (4 April to 29 June 2026, and 10 to 20 September 2026) is the one a school trip will actually pay, since education programs run in May, June and September.
  - `venue.general_admission_adult_cad`: 20 -> 18, same reason.
  - `programs[group-visit].cost_per_child_cad`: 12 -> 10. The $12.00 figure is the summer season group rate. The shoulder season group rate for children 3 to 12 is $10.00.

- **Fields set to null after review:** 4
  - `venue.has_rain_backup` — set back to null. "Programs commence rain or shine" says the opposite of a rain backup, and the indoor exhibit hall is never offered as shelter for a program.
  - `venue.bus_parking` — set back to null. The only parking sentence on the site is about designated stalls for people with mobility disabilities, which is not bus parking.
  - `programs[*].lead_time_days` — null. No minimum notice is published, only "All bookings subject to availability".
  - `programs[*].chaperone_ratio` and `adults_free` — null. Nothing on the site addresses how many adults must come or whether they pay.

- **Conflicts recorded:** 3
  - Education booking email: `khieland@bcfdc.ca` on the tours and contact pages, `khieland.bcfdc@shaw.ca` in the program brochure PDF.
  - Grade range: brochure gives Grades 1 to 3 and Grades 4 to 6; the tours page says the same programs meet outcomes for kindergarten to grade 7.
  - Months: brochure says May, June and September; the tours page says Easter to Thanksgiving.

- **Price checks.** `$10.00 per student + GST` is per student, confirmed twice in the brochure, once for the Forest Ecology and Heritage programs and once for O' Christmas Tree. It is recorded as `cost_per_child_cad` with `tax_included: false` and `school_rate_only: true`, because the brochure is written for schools and prices per student. The group admission rates are per person, not per group, and are recorded as `cost_per_child_cad` 10 plus `cost_per_adult_cad` 16 on the group visit program only.

- **Stale price flag.** The group booking rates on the live tours page are still dated *April 19 to June 30, 2025* and *July 1 to September 4, 2025*, while the admission page has been updated to 2026 dates. This was confirmed from the live DOM in the browser, not from a cached fetch, so it is the site's real current state. Captured in `price_year_or_season` and repeated in the group visit description and `our_note`.

- **Grades kept as grades.** The brochure publishes both an age and a grade band for each program ("Ages 6 - 8 / Grades 1 - 3"). Only the grade pair is populated, `age_basis` is `grades`, and both age fields are null.

- **Capacity.** `capacity_max` 30 is a per booking design maximum ("Programs are designed for max. 30 students"), not a minimum. The group visit carries `capacity_min` 10 and `capacity_max` 100 from "Group sizes range from 10 to 100".

- **Location.** `geo_source` is `site_embed`. Coordinates come from the Google Maps place link on the Plan Your Visit page, `!3d48.8022943!4d-123.7153419`, published on the venue's own page. No pin was hand placed.

- **Images.** All four URLs are absolute, https, and on the venue's own domain. Each was loaded and looked at in a browser before its alt was written, so all four are `alt_source: generated` with descriptions of what is actually in the frame. None of the four carries an alt attribute on the site, and two are CSS background images rather than `<img>` elements. No captions were invented and no `rights_note` was set, because the only credit line on the site is a footer copyright. One hero is present.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all seven programs.
  - `what_children_do` rests on the tour and program descriptions on the tours page and in the brochure, in particular the logging camp buildings, the walk to the eagles' nest, handling the stone tools, making an ornament in the 1905 schoolhouse, and the 2.5 km train ride with its ten minute stop.
  - `our_note` rests on: programs commence rain or shine, the picnic area and playground, the eagles being in residence only some of the year, the Grade 3 social studies fit of the stone tool program, and the 2025 dating of the group prices.
  - `practical_summary` rests on the facility fields plus the gaps list, mainly the portable toilets, the outdoor picnic area, the wheelchair access statement and the absence of bus parking and adult ratio information.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked_on are all present, there is one hero image with alt, and six of the seven programs carry id, name, age_basis with a grade range, `comes_to_you`, a cost field and `our_note`.

- **Confidence:** high. The education prices, grade bands, duration and class size all come from the venue's own brochure PDF, and the admission and access information was confirmed against the live page in a browser. The one soft spot is that the group rates are a season out of date, which is flagged rather than corrected.

- **Recommended follow up by phone or email** (250 715 1113 ext 26, or khieland@bcfdc.ca):
  1. Confirm the current group admission rates, since the page still shows 2025 dates.
  2. Ask how many adults have to come per class, and whether they pay.
  3. Confirm which days of the week school programs run on, given the centre is closed Tuesdays and Wednesdays.
  4. Ask what happens in heavy rain, since programs run rain or shine and most of the site is outdoors.
  5. Ask about the preschool programs the site mentions but does not describe: age range, length and price.
  6. Ask about bus parking and turning space for a coach.
  7. Confirm how far ahead you need to book.
