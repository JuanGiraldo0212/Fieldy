# jamies-whaling-station-adventure-centres-tofino.json

VERIFICATION

- **Fields checked:** 313 non-null values (20 in the venue block, 248 across the ten programs, 45 across the five images), each re-read against the page recorded in its `source_url` or `found_on_url`. Every one of the ten `evidence` quotes and all five image `alt` strings were re-matched character for character against the page source in a second pass; all ten and all five matched. All five image URLs were re-requested and returned HTTP 200 from the venue's own `www.jamies.com` uploads directory. All nine published price tables were re-parsed from the page markup and every adult, youth and child figure in the record matched.

- **Fields corrected:** 4
  - `tofino-zodiac-whale-watching.age_basis`: `years` -> `null`, and `age_min_years` left null. The zodiac pages publish no eligibility age at all. The only entry rule is a height: "Anyone under the height of 4'8" (142cm) is also unable to join our Zodiac tours." The age numbers on the page ("Ages 12 and Under", "Ages 13-18") are price brackets, not a permitted range, and recording them as ages would have invented a minimum the venue never set. The same correction was applied to `tofino-zodiac-bear-watching`, `freedom-cove-floating-gardens` and `tofino-pelagic-wildlife-tour`.
  - `tofino-cruiser-bear-watching.outdoor`: `true` -> `null`. The Stellar Sea is described as "Fully covered vessel with panoramic views throughout" with "Interior cabin with bench seating", and unlike the whale cruiser no open rear deck is mentioned. Windows that open is not the same as deck access.
  - `venue.has_rain_backup`: `true` -> `null`. "Our tours are Rain or Shine" means they sail in the rain, not that there is an indoor alternative, and the same page says departures may be cancelled or delayed for rough seas. The wording is kept verbatim in the facility notes instead.
  - `hot-springs-cove-day-tour.cost_per_child_cad` and `cost_per_adult_cad` both set to 265. Every bracket on that page carries the same figure, so recording a separate child rate would have implied a discount that does not exist.

- **Fields set to null after review:** 6
  - `capacity_max` on the whale cruiser, bear cruiser, sea otter, Hot Springs Cove and Big Tree Trail programs. Vessel capacities (Lukwa 45, Stellar Sea 40, Chinook Princess 33, Eagle 44 twelve) are published on the boats page, but no tour page states a per-booking maximum and no page says which vessel runs which departure. Carrying a number across would have been a guess. It is in gaps instead. Capacity twelve is kept on the four zodiac-based programs, where the tour page itself says "12-passenger vessels", and 45 is kept on the private tour, where that page itself says "The Lukwa can host up to 45 passengers."
  - `lead_time_days` on every program. The site gives seasonal booking advice, not a minimum notice.
  - `venue.bus_parking`. The parking answer describes a free guest lot with RV motorhome stalls and never mentions buses. The verbatim line is kept in the facility notes.
  - `venue.wheelchair_accessible` and `stroller_accessible`. Nothing on the site addresses either at the dock or on the boats. The zodiac and Big Tree Trail mobility warnings are exclusions, not an accessibility statement, and are recorded as restrictions.
  - `venue.has_lunch_space`. Snacks on board is not a lunch space on shore.
  - `months_offered` on the sea otter, Big Tree Trail, Freedom Cove and pelagic programs, with the word unknown recorded against them in gaps, so the null is not read as year-round. Hot Springs Cove is genuinely null-as-year-round, on "Hot Springs Cove Season: Year-round".

- **Conflicts recorded:** 1. The Tofino covered cruiser page says the whale boat has "2 marine toilets"; the family tips page says the same boat has "1 Marine Toilet". Neither page is dated, so the flag stays a plain yes and the disagreement is carried in `conflicts` for the director. Checked and found to agree: the Tofino address across the footer, contact, locations and every tour page; the 4'8" height rule across five separate pages; the whale season across the landing page and the FAQ; the bear season across the landing page and the FAQ; all nine price tables against their tour pages.

- **Authored fields written:** all three on nine of ten programs.
  - `what_children_do` rests on the site's own physical descriptions: the heated cabin and open rear deck with snacks allowed on the whale cruiser, the flotation suit and forward facing seats on the zodiacs, the bench seating and whispers-only rule on the bear cruiser, the 30 to 40 minute boardwalk hike and thermal pools at Hot Springs Cove, and the 1.2 km split-log boardwalk on Meares Island. It is **null on the private charter**, because that page describes vessels and options but never describes a visit.
  - `our_note` rests on the catch that the tour pages bury: the height rule on four programs, the no food and whispers rule on bear watching, the low tide departure that moves day to day, the six and a half hour day and no drinking water at Hot Springs Cove, and the fact that nobody guides the Meares Island walk once you land.
  - `practical_summary` is generated from the washroom, parking, rain and food facts that are published, set against the gaps that are not: no group or school rate anywhere on the site, no indoor lunch space on shore, no stated capacity for most tours, and no wheelchair or stroller information.

- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng`: no geocoding service is available in this run and the site publishes no coordinates, only short Google Maps share links with no latitude or longitude in them. `geo_source` is `geocode_pending` and the full street address is captured for a backfill pass. Every other venue requirement is met, including one hero image with alt text. Six of the ten programs clear the program bar on their own; the four zodiac-based ones (`tofino-zodiac-whale-watching`, `tofino-zodiac-bear-watching`, `freedom-cove-floating-gardens`, `tofino-pelagic-wildlife-tour`) have `age_basis` null because the venue gates them by height rather than by age, and the private charter has no published cost because its rate is hourly.

- **Confidence:** high. Every page returned full body text to a plain fetch, prices and the height rule are stated explicitly and repeated consistently across separate pages, and the Tofino and Ucluelet content is cleanly separated on the site so there is no risk of an Ucluelet fact landing here. The record is thin only where the site itself is silent, which is everything to do with children's groups specifically.

- **Recommended follow up by phone or email** (Tofino office, 250-725-3919 or 1-800-667-9913, info@jamies.com):
  1. Price. Is there any group, school or daycare rate, or is a private charter at $850 an hour the only way to get a group rate?
  2. Youngest age. Infants ride free on the big Tofino cruisers, but is there a practical youngest age they would recommend for a group of three and four year olds?
  3. Capacity. How many can come on one booking of the whale cruiser, the bear cruiser and the sea otter tour, and does the Big Tree Trail zodiac crossing carry the same height rule as the zodiac tours?
  4. Lead time. What is the real minimum notice for a group booking, and does a group have to pay in full up front?
  5. Lunch space. Is there anywhere at the Tofino station for a group to eat before or after, given food is banned on bear tours?
  6. Washrooms. Are there washrooms in the building as well as on the boats, and is there a change table?
  7. Rain backup. If the sea is too rough on the day, is the booking moved or refunded?
  8. Access. Can a stroller or a wheelchair get down to the dock and onto the covered cruisers?
