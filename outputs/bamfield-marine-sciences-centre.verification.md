# bamfield-marine-sciences-centre.json

VERIFICATION

- **Fields checked:** 68 (33 venue fields plus `facility_notes` and `restrictions`, the non-null fields on all three programs, and all three image entries). Every quoted string in the record was re-tested as a literal substring against a freshly fetched copy of the page it came from: the Field Trip Pricing page, Educators, Field Trip Activities, Field Trips Program Bursaries, the Education overview, the site FAQ, Contact, Accommodation, Bring Your Group, the 2 nights / 3 days sample itinerary PDF and the 2026 accommodations PDF. All 21 passed.

- **Fields corrected:** 4
  - `cost_per_child_cad` on all three programs: nothing was recorded as a group price. The pricing table column is headed "Estimated Cost per Person", so $713, $994 and $1,275 are per person, not per class. This was the field most at risk of the usual error and it was checked twice, once against the table header and once against the FAQ, which independently talks about cost "per person, per night".
  - `cost_per_child_cad`: 285 -> 713 for the shortest trip. An earlier read took the FAQ's "approximately $285 per person, per night". The FAQ figure is labelled for Fall 2025 and Spring 2026 and does not match the pricing page, so the pricing page value is used and the disagreement is recorded in `conflicts`.
  - `capacity_min`: 12 -> null. The site says group sizes must be "in multiples of 12", which is a rounding rule, not a published minimum. Twelve happens to be the smallest legal multiple, but the site never calls it a minimum, so the rule is carried in each program description and in `gaps` instead.
  - `facility_notes` key `has_lunch_space` -> `lunch_space`, to match how the other keys are written.

- **Fields set to null after review:** 6
  - `age_basis`, `grade_min`, `grade_max`, `age_min_years`, `age_max_years` on all three programs. Three of the centre's own pages give three different answers, so no range is recorded. Taking the bursary page's "kindergarten up to grade 12" would have been eligibility for a bursary read as eligibility for the trip.
  - `hosts_daycare_groups`. The Educators page says "learners of all ages", the Education page says high school and undergraduate. That is a disagreement, not a stated minimum age, so the flag stays null rather than false.
  - `bus_parking`. The sample itinerary has a group "Arrive at BMSC by bus", which says buses reach the site but not that one can park. Left null and put in `gaps`.
  - `has_rain_backup`. There are labs and classrooms indoors, but nothing on the site offers them as a wet weather alternative to the beach and boat work.
  - `wheelchair_accessible`. The housing PDF asks groups with accessibility needs to contact the team first, which is an invitation to ask, not an answer. The sentence is kept verbatim in `facility_notes`.
  - `price_year_or_season`. The pricing page carries no year or season anywhere.
  - `duration_min` on all three programs. The lengths are published in nights and days, not minutes; converting three days to 4,320 minutes would have rendered as a session length it is not. The length is in each program name instead.

- **Conflicts recorded:** 2
  - Who the trips are for. Three pages, three answers: high school and undergraduate, learners of all ages, and classes from kindergarten to grade 12.
  - What it costs. The FAQ says about $285 per person per night for Fall 2025 and Spring 2026; the pricing page starts at $713 per person for two nights. The pricing page value is recorded because the FAQ figure is explicitly tied to past seasons.

- **Authored fields written:** all three, on each of the three programs.
  - `what_children_do` rests on the 2 nights / 3 days sample itinerary PDF (arrive by bus, check in at the Whale Lab, bags to the dorms, safety orientation, invertebrate diversity lab, oceanography skiff up Grappler Inlet, dredging aboard the Alta, boat shuttle and a twenty minute hike to Brady's Beach, plankton microscopy, rainforest hike, bioluminescence off the dock) and on the Field Trip Activities page for the longer stays, including the sea urchin embryo lab that the site says is only available on 4-night stays.
  - `our_note` rests on the accommodation page and housing PDF (shared bunk rooms, cafeteria meals), the How to Get Here page (about 76 km of logging road from Port Alberni, no gas and no cell service in between), the pricing page (travel not included, Barkley Star and Kiixin tours cost extra) and the bursaries page (whole class or individual student, with its own deadline).
  - `practical_summary` is generated from the facility fields that are answered (dining hall, dorms, washrooms and showers on each floor) against the gaps that are not (adult numbers, whether chaperones pay, step free access, bus parking, and the fact that the final price is quoted per group).

- **Meets minimum viable record:** no. Two required items are missing.
  - `venue.lat` and `venue.lng` are null. No geocoding service was available in this run and the site publishes no coordinates, no Google Maps embed and no JSON-LD. The full street address is captured and `geo_source` is `geocode_pending` for a backfill pass.
  - `age_basis` and both ranges are null on every program, because the site's three statements about who the trips serve contradict each other.
  - Everything else clears the bar: `id`, `name`, `address`, `category`, `checked_on`, a `hero` image with `alt`, and three programs each with `id`, `name`, `comes_to_you`, a cost field and `our_note`.

- **Confidence:** medium. The prices, seasons, the multiples-of-twelve rule, the activity list and the day by day shape of a trip are all stated plainly on the centre's own pages and in its own PDFs, but the two things a director asks first, what ages they take and what it will actually cost her group, are both unsettled on the site itself.

- **Image note:** none of the photographs on the site carry alt text, and the WordPress media library returns empty `alt_text` and empty captions for all three. No browser was available, so the three alt strings were written from the file names and from where each photo sits on the page, not from looking at the images. This is stated in `gaps`. The homepage banner is a Slider Revolution gallery that does not appear in the page source, so the hero was taken from the facilities page. `rights_note` is null on all three: the site's only credit lines ("Photo: Jeff Reynolds", "Photo: Andrew Hendry", "Photo: Anna Brailey") sit at the foot of a page rather than beneath a specific image.

- **Recommended follow up by phone or email** (fieldtrips@bamfieldmsc.com, or (250) 728-3301 ext. 273):
  1. Price. What is the real per person figure for our group size and dates, do teachers and chaperones pay the same, and what do the Barkley Star and Kiixin trips add?
  2. Youngest age. What is the youngest year group you will take, given one page says all ages and another says high school and up?
  3. Capacity. We have to book in multiples of twelve, so does that count include the adults, and how many can you take at once?
  4. Lead time. When do applications open for our season, and when is the bursary deadline?
  5. How many adults have to come, and do they sleep in the same building as the children?
  6. Lunch space and washrooms. Are there washrooms in the lab and classroom buildings, not just the dorms?
  7. Rain backup. What happens to the beach and boat days if the weather closes in?
  8. Deposit and cancellation. What do you take up front and what happens if we have to pull out?
