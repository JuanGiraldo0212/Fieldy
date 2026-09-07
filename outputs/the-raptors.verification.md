VERIFICATION - the-raptors.json

- Fields checked: 41 non-null fields across the venue block, 4 programs and 3 images, plus every evidence quote re-read from the live DOM in a second pass.

- Fields corrected: 3
  - venue.name: "Pacific Northwest Raptors" -> "The Raptors". The tracker address pnwraptors.com redirects to the-raptors.com, and every page on the live site is branded The Raptors. The old name is carried in the description and in a separate cross reference record.
  - venue.website: "https://www.pnwraptors.com" -> "https://the-raptors.com", for the same reason.
  - images[program-field-trip].alt_source: "site" -> "generated". The site's own alt on that photo reads "Woman holding a golden eagle in front of a group of school children", but the image was opened and looked at and shows a large dark vulture landing on a handler's glove in front of a crowd. A written alt was used and the mismatch is recorded in gaps.

- Fields set to null after review: 4
  - programs[school-group-field-trip].duration_min. The 20 to 30 minutes is the guided tour only, not the length of the visit, so it sits in the description rather than in the duration.
  - venue.has_washrooms. Washrooms are not mentioned anywhere on the site, including in the questions panel. Nothing was inferred from photographs.
  - venue.has_rain_backup. The site never says what happens in bad weather.
  - venue.price_year_or_season. No year or season is attached to any price on the site.

- Conflicts recorded: 0. The admission prices in the site's slide out price panel match the tables on the experiences page and the age rules on the booking page exactly. Both were re-read from the live DOM.

- Authored fields written:
  - what_children_do on all four programs, resting on the guided tour and flying demonstration described on the presentations page, the species named on the home page, the glove and handling wording on the experiences page, and the FAQ answer about the Kids Encounter.
  - our_note on all four programs, resting on the absence of any published group price, the FAQ answers about outdoor path surfaces, food and parking, and the age eight floor on hands on experiences.
  - practical_summary on all four programs, resting on the picnic benches answer, the free parking answer, the wheelchair and path surface answer, and the unpublished washrooms, rain cover and bus parking.

- Meets minimum viable record: no. Coordinates are pending because no geocoding service was available in this run, and no single program carries both a published age range and a cost. The general admission program has prices but no program age range; the Kids Encounter has ages 4 to 7 but no published price. Both gaps are real and are on the site, not artefacts of the extraction.

- Confidence: high on what is published, because prices, hours, age rules and facility answers were all read from the live page after rendering and re-checked in a second pass. Low on anything about school group cost, because the venue publishes none of it.

- Recommended follow up by phone or email, in priority order:
  1. Price for a school or daycare field trip, and price for the outreach visit to a school. Nothing is published for either.
  2. Youngest age they will take for a guided field trip. Under fours are free as visitors but the guided programs give no age.
  3. Minimum and maximum group size for both the field trip and the outreach visit.
  4. How much notice they need to book, and whether a deposit is required.
  5. Washrooms. They are not mentioned anywhere on the site.
  6. Whether there is anywhere under cover if it rains, since the paths and the demonstration are outdoors.
  7. Room for a bus to park and turn.
  8. Whether they open at all between November and June. The published hours stop on 2 November.
