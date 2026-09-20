# port-alberni-echo-aquatic-centre-and-fitness-studio.json

VERIFICATION

- **Fields checked:** 47. The 33 venue fields plus the one program's non-null fields and the single image entry, re-read cold against the Facility Info page, the Rates & Passes PDF, the Pool Operation FAQ, the Swim Lessons page and the Drop-In Schedules page. The Facility Info page was re-fetched cold in the verification pass and every recorded quote was matched with a literal string search.

- **Fields corrected:** 4
  - `venue.name`: "Port Alberni Echo Aquatic Centre and Fitness Studio" -> "Echo Aquatic Centre & Fitness Studio". The site names it that way throughout; the tracker's longer form is kept only in the file name.
  - `image.url`: the 300x225 rendition that appears in the page markup -> the 500x375 original. The rendition on the page is under the 400px floor. Both are the same asset on the same domain, and the original was confirmed to return HTTP 200.
  - `program.cost_per_group_cad`: 3.50 -> null, with `cost_per_child_cad` set to 3.50 instead. $3.50 is a single admission per person, not a group fee.
  - `program.chaperone_ratio`: `{"children_per_adult": 1, "applies_to": "under 7"}` -> null. The site requires an adult in the water within arms' reach of any swimmer under 7, but it never states a number of children per adult. The rule itself is carried verbatim in `restrictions` and in plain words in `our_note`, and the missing number is listed in `gaps`.

- **Fields set to null after review:** 4
  - `has_washrooms` — the site describes "4 universal changerooms all equipped for portable lift" and never mentions washrooms. That is a changeroom claim, not a washroom claim, so the sentence is kept in `facility_notes.washrooms` and the flag stays null.
  - `wheelchair_accessible` — same sentence. A portable lift in the changerooms does not state that the building is accessible.
  - `youngest_age_welcomed_years` — the rate sheet's youngest band (under 5, free) is a price boundary, not a minimum age. No minimum age is published.
  - `program.age_min_years` / `age_max_years` — an earlier draft carried 5 and 12 from the child admission band. That band is a price tier, not who may swim: under-fives are free and welcome, so "Ages 5 to 12" would have hidden the group most likely to use this record. `age_basis` stays `years` because ages, not grades, are the unit this venue publishes.

- **Conflicts recorded:** 1. The Facility Info hours show the pool open Saturday afternoon and Sunday morning; the Pool Operation FAQ, which is dated "current as of November 1, 2024", says it is closed Saturday afternoons and all day Sunday. The live facility listing's hours are the value recorded, since the page disagreeing with it is the older and explicitly dated one. The director-facing note gives her both answers and tells her to settle it on the phone.

- **Authored fields written:** all three, on the one program.
  - `what_children_do` rests on the Facility Info description of a main pool, a tot pool, a hot tub and sauna in the same natatorium, the four universal changerooms, and the under-7 in-water supervision rule.
  - `our_note` rests on the complete absence of a school or daycare rate on the rate sheet, the under-7 rule, the Pool Operation FAQ's statement that the pool and fitness studio close to the public during swimming lessons, and the fact that the only downloadable pool schedule ends August 28, 2026.
  - `practical_summary` is generated from the indoor natatorium and changeroom facts against the lunch-space, bus-parking and adult-ratio gaps.

- **Location:** `geo_source` is `site_embed`, not `geocode_pending`. No geocoding was performed. The site's own footer links its address to a Google Maps place named "Echo Aquatic and Fitness Centre" whose URL carries `!3d49.251256!4d-124.7970408`, which is a published on-domain coordinate and the top of the spec's preference order in STEP 2c. Recorded to 5 decimal places as 49.25126 / -124.79704. A second maps link in the page body resolves to the Parks & Recreation Dept office about 50m away; that one was not used, and the choice is noted in `gaps`. **If the orchestrator wants every record in this batch to go through one geocoding backfill pass, set this one to null / `geocode_pending` and it will be filled with the same address.**

- **Images:** one entry, role `hero`. The homepage publishes no `og:image` and its banner is the site's generic header, so the hero is the photo the Facility Info page attaches to the Echo Aquatic Centre block. It has no alt attribute on the site, and image files were not downloaded, so the written alt is deliberately minimal and rests on the site's own labelling of the photo rather than on having seen it. `alt_source` is `generated`, `caption` is null, `rights_note` is null because the only copyright line on the site is the site-wide footer, and `usage` is `unverified`. Dimensions come from the site's own media record for that attachment, not from a guess.

- **Meets minimum viable record:** no. The venue block is complete (`id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on`, one `hero` with `alt`). The program misses the age range: this site publishes no age range for who may use the pool, only price bands, so `age_min_years`, `age_max_years`, `grade_min` and `grade_max` are all null. Everything else the bar asks of a program is present (`id`, `name`, `age_basis`, `comes_to_you`, `cost_per_child_cad`, `our_note`). The gap is real and is left visible rather than filled from the price tiers.

- **Confidence:** medium-high on what is recorded, low on what a group leader actually needs. Prices, hours, the under-7 rule and the address are unambiguous on the venue's own pages and the PDF, but this venue has no page of its own and the site is entirely silent on school and daycare groups, so the decisive booking facts have to come from a phone call.

- **Recommended follow up by phone or email** (Aquatic Centre, 250-720-2514; the email address on the site is hidden by Cloudflare email protection and could not be read):
  1. **Price** — is there a school, daycare or group swim rate, or does a group pay $3.50 per child at the door? Do the posted rates include GST?
  2. **Youngest age** — is there any minimum age for the pool, and are preschool groups welcome outside lesson times?
  3. **How many adults** — every child under 7 needs an adult in the water within arms' reach. What ratio will they accept from a daycare, and does that apply in the tot pool too?
  4. **Capacity** — how many children can come at once, and does a group need to give notice?
  5. **Lead time and times** — the live schedule did not load and the printed schedule ran out on August 28, 2026. Which sessions are open to the public now, and are weekends actually open?
  6. **Lunch space** — is there anywhere a group can eat, in the pool building or next door at Echo '67?
  7. **Washrooms** — the site describes four universal changerooms with a portable lift. Are there toilets and a change table in them?
  8. **Rain backup** — recorded as yes because the pool is indoors, but worth confirming there is somewhere dry to wait if a session is cancelled.
