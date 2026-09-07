# VERIFICATION - Maritime Museum of British Columbia

- **Fields checked:** 210 or so across the venue block, eight programs, three images and provenance. Every program's `source_url` was reopened and each non-null field checked against it.
- **Fields corrected:** 4
  - `cost_per_group_cad` on all six booked programs: first read as a per student price, corrected after checking the stat block. The page gives "$150 For In-Museum Field Trip", "$200 For outreach visit to your classroom" and "$100 For a virtual field trip" alongside "30 Maximum Students per program", so all three are prices for the whole booking. `cost_per_child_cad` is null on every one of them.
  - `in-search-of-equality` grade range: 4 to 9 -> 4 to 6. The site lists grades 4 to 6 and, separately, grade 9. A 4 to 9 range would have implied grades 7 and 8 are covered. Grade 9 is stated in the description and in `curriculum_tags` instead.
  - `self-guided-group-visit` capacity: 8 first sat in `capacity_max`. It is a minimum group size for booking, so it moved to `capacity_min` and `capacity_max` is null.
  - `lead_time_days`: first set to 3 from "within 3-5 working days". That is how long they take to confirm, not how much notice they need, so it is null and the confirmation time is in `payment_timing`.
- **Fields set to null after review:** 5
  - `has_lunch_space`: they allow non messy snacks but sell no food and set aside no room, so this is not a yes. The verbatim line sits in the facility notes so the tile is still useful.
  - `has_rain_backup`: the museum is entirely indoors, but the site never addresses this, and an inference is not a fact.
  - `stroller_accessible`: the space takes wheelchairs and the washroom has a change table, neither of which is a statement about strollers.
  - `bus_parking`: only the library parkade and street parking are mentioned. The parking text is kept as a note; the boolean stays null.
  - `what_children_do` on `virtual-field-trip` and `private-mini-mariners`: the site never describes what happens in either, so neither was imagined.
- **Conflicts recorded:** 0. The one candidate was the social story, which is linked as two different files from two pages. Both open, neither changes anything a director does, and it is not worth a conflict card. The booking link appears once on the museum's own store domain and once on the raw Shopify domain, but it is the same product, so the store address was used.
- **Authored fields written:**
  - `what_children_do` on six of the eight programs, resting on the program outline PDF for Pollution Solutions (land acknowledgement, presentation, two groups rotating through stations, reflections at the end), and on the museum's own program descriptions for the suitcase activity, the knot tying and navigation, the otter and beaver pelts, and the scavenger hunt and activity books.
  - `our_note` on all eight, resting on the price being for the group rather than per child, the 30 student cap, which three of the four topics travel to schools, the museum being two rooms that most people are through in under an hour, and the unpublished cost and age range for a private Mini Mariners booking.
  - `practical_summary` on all eight, built from the washroom, wheelchair and snack lines plus the gaps list.
- **Location:** `geo_source` is `site_embed`. The coordinates come from the Google Maps embed published on the museum's own Plan Your Visit page (`!2d-123.36888492239572!3d48.42187373132481`), rounded to 5 decimals. No geocoder was used and no pin was hand placed.
- **Images:** three entries, all on the museum's own WordPress uploads path and all confirmed present on the page recorded in `found_on_url`. The hero is the exterior street view from the visit page, which carries the site's own alt text, so `alt_source` is `site`. The homepage og:image is a photograph but has no alt anywhere, which is why it was not used, and that is in gaps. The other two alts are `generated` and were written after opening each image in a browser and looking at it, so they describe what is actually in the frame rather than the file name. No caption invented. No `rights_note` taken from the footer copyright line.
- **Meets minimum viable record:** yes. The venue has id, name, address, lat, lng, category, checked_on and a hero with alt. Six programs carry id, name, `age_basis: grades` with a range, `comes_to_you`, a group cost and an `our_note`.
- **Confidence:** high. Prices, capacity, grade bands, the chaperone allowance, the deposit and the cancellation rule are all published in plain text on the museum's own pages, one of which was last updated in July 2026, and the Pollution Solutions outline PDF confirmed the grade band and the shape of the session independently. The site rendered fully to a plain fetch and no browser was needed except to look at two photographs.
- **Recommended follow up by phone or email** (programs@mmbc.bc.ca or 250-385-4222), in priority order:
  1. Whether the program prices include tax, and whether the prices on the 2025 booking form still stand.
  2. What a private Mini Mariners booking costs and which ages it suits, if your group is under five.
  3. How many children they can take at once for a self guided group visit, given the space is two rooms.
  4. Which days and start times school programs can run, since the calendar is the only guide and they invite you to ask for a date that is not listed.
  5. How much notice they need for a booking.
  6. Where a group can eat, since there is no lunch room.
  7. Where a bus can drop off and wait.
  8. For an outreach visit, what they need set up in your classroom.
