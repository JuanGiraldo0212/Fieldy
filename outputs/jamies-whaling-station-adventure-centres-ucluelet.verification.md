# jamies-whaling-station-adventure-centres-ucluelet.json

VERIFICATION

- **Fields checked:** 292 non-null values (22 in the venue block, 235 across the 9 programs, 35 across the 4 images), each re-read against the page recorded in its `source_url` or `found_on_url`. Every `evidence` quote, every `restrictions` string and every `facility_notes` value was matched character for character against the fetched page text; all 9 program quotes and all 12 venue strings now match.

- **Scope check first.** jamies.com covers Tofino and Ucluelet from one site. Only the Ucluelet side is in this record: the Ucluelet address, the Ucluelet phone, the Ucluelet vessels (Pacific Springs and the Zodiacs, both listed on the fleet page as based in Ucluelet), and only tours whose own pages say "Location: Ucluelet". Tofino-only offerings were left out on purpose: the large cruiser tours, the Sea Otter and Inlets tour, Hot Springs Cove, Meares Island, Freedom Cove, the pelagic tour, the fall and winter tours, Tofino kayaking and kayak rentals. The venue `id` is `jamies-whaling-station-ucluelet` so it cannot collide with the Tofino record. This is a genuinely separate operation, not a duplicate row: it has its own address, its own phone numbers, its own boats, its own season dates and a different minimum age from Tofino.

- **Fields corrected:** 4
  - `ucluelet-harbour-kayak-tour.evidence`: a 31 word quote -> "Our minimum age is 5 years old in order to join one of our tours." The original ran past the 25 word limit.
  - `ucluelet-coast-kayak-tour.evidence`: a 25 word quote -> "You must be comfortable with paddling in ocean swell and in unprotected waters", for the same reason.
  - `ucluelet-barkley-sound-kayak-tour.evidence`: "Ages: Ages 12+ Duration: 6 Hours" -> "Location: Ucluelet User Ages: Ages 12+". The first string is not contiguous on the page; an icon label sits between the two halves.
  - `venue.restrictions[1]`: the Zodiac height rule was first recorded with straight quote marks. Corrected to the characters the page actually uses.

- **Fields deliberately left null after review:** 7
  - `ucluelet-whale-and-bear-package` cost fields. Every Ucluelet tour card on the index pages shows the same "From CA$ 179.14", including cards whose own tour page charges $147.34 for a child. The card prices are not trustworthy, so no price was taken from them and the package carries none.
  - `ucluelet-zodiac-whale-watching.age_min_years`. That page publishes a height requirement and no minimum age. The 3 and over figure comes from the family tips page and is recorded at venue level instead.
  - `hosts_school_groups` and `hosts_daycare_groups`. The site never uses the words school, class, daycare or student anywhere. That is silence, not a refusal, so both stay null rather than false.
  - `has_lunch_space`, `has_rain_backup`, `bus_parking`. Each has real text on the site that does not actually answer the question, so the flags stay null and the sentences are kept verbatim in `facility_notes`. "Our tours are Rain or Shine" is a warning, not a backup plan; "there is parking in front of the Jamie's building" says nothing about a bus.
  - `wheelchair_accessible` and `stroller_accessible`. Nothing on the site addresses either for the Ucluelet office, the dock or the boats. The Zodiac page's warning about limited mobility is a caution about one vessel, not an access statement, and is kept in `restrictions`.

- **Location:** `geo_source` is `site_embed`, not `geocode_pending`. The contact page's own map block publishes the marker for this location in the page source as `{"lat":48.9428108,"lng":-125.5450765,"markerInfo":"<p>Ucluelet</p>"}`, alongside a separate Tofino marker. That is a published on-domain coordinate, which the spec ranks above geocoding, so no geocoding service was needed. Recorded to six decimal places, matching the marker.

- **Prices re-checked against the per student trap.** Every whale and bear price here is per person from a tier table on the tour's own page: adults $179.14, youth 13 to 18 $157.94, seniors and students $168.54, children $147.34. The one group price in the record is the private tour at $2,703, which is recorded in `cost_per_group_cad` and not per child. `tax_included` is false everywhere because each page lists 5% GST plus port, research, fuel and online booking fees added at checkout. `school_rate_only` is false on all nine programs; no price on this site is written for schools.

- **Conflicts recorded:** 4 (Ucluelet bear season, Ucluelet whale season start, youngest age on an Ucluelet boat, and the minimum age for the six hour kayak tour, which is given two ways on one page). For the two season conflicts the value kept is the one from the Ucluelet page that names the 2026 season, since it is both dated and specific to this location, rather than the generic home page card. The audit trail of which page says what is in `gaps`.

- **Authored fields written:** all three on eight of the nine programs.
  - `what_children_do` rests only on what the pages describe: heated cabin and open rear deck on the cruiser, flotation suits and fixed forward facing seats on the Zodiac, bears flipping rocks for crabs at low tide, a child in the front of a double kayak with an adult behind. It is null on the private charter, because the site never says what that trip contains.
  - `our_note` rests on the catches a director would not spot: the 142 centimetre height rule that quietly excludes most children under about nine, bear departure times that follow the tide rather than the clock, the no food rule on bear trips, the extra hour of check-in and disembarking on top of a three hour tour, and the fact that the kayak tours are run by a separate company with its own cancellation rules.
  - `practical_summary` is generated from the washroom, parking, food and weather facts that are published, set against the missing group rate, group booking route and bus parking.

- **Meets minimum viable record:** yes. Venue has `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and one `hero` image with alt text taken verbatim from the site. Eight of the nine programs carry `id`, `name`, `age_basis` with the published age range, `comes_to_you`, a cost field and `our_note`. The private charter program is the one that falls short: `age_basis` is null because the site only says "All ages" for it, which the family tips page contradicts.

- **Images:** 4 kept, all on the venue's own WordPress uploads path, all https and absolute, all confirmed present in the source of the page recorded in `found_on_url`, and all four carry the site's own alt text so nothing is `generated`. The one caption is the gallery's own caption text, verbatim. No `rights_note` is set, because the only copyright line on the site is the site-wide footer. The og:image on each Ucluelet page is a CSS banner with no alt text and an opaque file name, so a described gallery photograph from the same Ucluelet page was used as the hero instead; that choice is noted in `gaps`.

- **Confidence:** high. Prices, ages, durations, the height rule, the address, the phone number and the coordinates all come straight from the venue's own Ucluelet pages and were re-read a second time. The confidence is high on what the site says and not on what a daycare would be quoted, because the site has no school or group content at all.

- **Recommended follow up by phone or email** (Ucluelet office 250-726-7444, toll free 1-877-726-7444, info@jamies.com):
  1. Price. Is there any group, school or daycare rate, and what would a boat leaving Ucluelet actually cost for a whole group, given the $2,703 figure and the $850 an hour figure do not match?
  2. Youngest age. The Ucluelet boats are listed as 3 and over but the private tour says all ages. Can under threes come at all, and does the 142 centimetre height rule have any exception?
  3. Capacity. The Ucluelet boats hold 12. Can a group of 12 children plus adults book a whole boat, and what is the largest group they can take from Ucluelet?
  4. Lead time. How much notice does a group booking need, and does it book online or through the office?
  5. Lunch space. Is there anywhere at the Ucluelet office for a group to eat before or after, given food is banned on bear trips?
  6. Washrooms. Are there washrooms on shore at the Ucluelet office as well as on the boat, and is there a change table?
  7. Rain backup. The site says rain or shine. What actually happens if a booked group's trip is called off for sea conditions on the day?
  8. Dates. Does bear watching from Ucluelet finish at the end of September or run into October?
