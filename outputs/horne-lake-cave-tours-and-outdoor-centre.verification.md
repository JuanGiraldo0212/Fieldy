VERIFICATION

Venue: Horne Lake Cave Tours and Outdoor Centre (horne-lake-cave-tours-and-outdoor-centre.json)
Checked 2026-09-07. Ten pages opened, all of them useful.

- Fields checked: 118 (33 venue fields, 5 programs x 46 fields re-read against their source pages, 5 image records, 3 conflicts)

- Fields corrected: 3
  - programs[0].age_min_years: 8 -> 6. The school page only publishes the October to April minimum of 8. The same tour's own listing on the home page reads "1hr 45m | Max. 10 people | Ages: 6+", so 6 is the year-round minimum for Riverbend and the 8 rule is a seasonal restriction, now stated in the description.
  - programs[1].duration_min: 180 -> 150. The school page gives "Duration 2.5-3hrs"; the minimum is the honest number and the range is in the description.
  - venue.hours_notes: moved to venue.seasonal_notes. The site publishes no opening hours, only that Summer and Fall tours depart every day and that you should call ahead in Winter and Spring, which is a season note, not opening hours.

- Fields set to null after review: 5
  - venue.has_washrooms, venue.has_lunch_space, venue.has_rain_backup. There is a visitor centre with a museum display and videos, but nothing on the site says a group may eat there or where the washrooms are. Inferring either from the existence of a visitor centre would be a guess.
  - venue.bus_parking. Nothing published, and the 12km gravel logging road makes this the single most important thing to ask.
  - image width and height on all five entries. Two of the images carry width and height attributes in the markup, but the page repeats images inside carousels and I could not attribute the two 2560x1707 pairs to specific files with certainty.

- Prices re-read from the live DOM, not from the fetch: yes.
  - School rate confirmed live as "$35/person +gst (for both youth and supervising adults)".
  - Public tour prices confirmed live: Riverbend Cave Explorer $59, Multi-Cave Experience $84, Action Pack $79, Achilles Challenge $149, Max Depth Adventure $199, all per person plus GST.
  - Per person, not per class. Every quoted rate on this site is written "/person" or "per person", so the money is recorded per child with the same figure repeated for accompanying adults, because the school page says the $35 covers "both youth and supervising adults". No per-class figure exists anywhere on the site.
  - All five evidence quotes were re-checked as contiguous strings in the live page text.

- Minimum ages, recorded per tour rather than venue wide:
  - Riverbend Cave Explorer, and the school One Cave version of it: 6 and up.
  - Multi-Cave Experience, and the school version of it: 8 and up, with 5 to 8 year olds welcome on a private tour.
  - The Action Pack (Main and Lower Caves): 8 and up.
  - Achilles Challenge: 13 and up.
  - Max Depth Adventure: 13 and up.
  - School groups from October to April: 8 and up whichever tour is chosen.
  - Venue-wide youngest age recorded as 5, which is the private tour floor.

- Capacity: capacity_max 42 on the two school programs is the per-booking ceiling with extra guides ("Extra guides can be arranged if you need to add additional groups (42 max.)"), not a minimum. capacity_min 2 comes from "Minimum tour size of 2 participants plus guide required for all tours." Per-guide group sizes of 10, 8 and 6 are recorded as capacity_max on the public tours where that is the whole booking.

- Lead time: 14 days is recorded as the minimum notice for confirming numbers, taken from their own group leader checklist ("I have emailed groups@hornelake.com about numbers (adults & youth) 2 weeks before tour"). It is their deadline for numbers rather than a booking window, and that is said in gaps.

- Conflicts recorded: 3
  1. Two different phone numbers given for the visitor centre. The field keeps the number their contact page publishes as the way to call them.
  2. Two different email addresses for confirming group numbers, on the same set of group pages.
  3. Two different youngest ages for the Multi-Cave tour, 8 on the tour list and 5 on the groups page, reconciled by their questions page as a private tour difference.

- Location: geo_source geocoded. The Google Maps link in the site footer carries only ll=49.34425,-124.750356 at zoom 11, which is a map centre and not a place pin, so it does not qualify as a site embed. The coordinates recorded, 49.34490 and -124.75067, are the OpenStreetMap point for Horne Lake Caves Provincial Park Visitor Centre, which sits about 100 metres from that map centre. Inside the Vancouver Island box and consistent with a Qualicum Beach address.

- Authored fields written: what_children_do, our_note and practical_summary on all five programs.
  - what_children_do rests on the site's own physical descriptions: the 1km uphill hike with seven stops, crouching and balancing over river rocks, the 12 inch standing squeeze, the ladders, the three tier waterfall climb, the cave slide, the belly crawls at 18 inches and the rappels.
  - our_note rests on the 12km gravel logging road, the 8 degree cave temperature, the footwear and layers guidance, the private tour route for 5 to 8 year olds, and the harness size limits.
  - practical_summary rests on the wild cave description with no lighting, paved walkways or handrails, plus the three practical fields the site never addresses.

- Images: five, one hero. All five were confirmed present on the page recorded in found_on_url, all on hornelake.com, all https, no query strings. Every one of the site's photographs carries a file name in place of alt text, so all five alts are generated and each was written after opening the image and looking at it. No captions invented. rights_note left null on all five, because the only credit line on the site is the footer copyright.

- Meets minimum viable record: yes. Venue id, name, address, lat, lng, category and checked_on are all present, there is one hero image with alt, and five programs each carry id, name, age_basis with a range, comes_to_you, a cost and our_note.

- Confidence: high. Every price and age was re-read from the live DOM rather than the fetched copy, the site is plainly current, and the two school offerings are described on a dedicated school page with a published rate.

- Recommended follow up by phone or email, in the order a daycare director would want it:
  1. Confirm the $35 rate still stands, since it carries no date or season on the page.
  2. Confirm which minimum age applies on your date, because it changes between tours and rises to 8 from October to April.
  3. Ask how a group of 42 is split on the day and how many guides come.
  4. Confirm the two week deadline for final numbers and the 50% deposit route.
  5. Ask whether a group can eat somewhere indoors and where.
  6. Ask where the washrooms are.
  7. Ask where a school bus parks and whether it can turn around after 12km of gravel logging road.
