# ecosummer-expeditions.json

VERIFICATION

- **Fields checked:** 58 (33 venue fields, the non-null fields of all three programs, and both image entries), re-read against the Robson Bight Basecamp dates page, the Day Tour dates page, the Day Tour participation requirements, the Orca Camp FAQ, the itinerary, What's Included, the cancellation policy, the West Coast Trail FAQ, Our Camp, Safety, Contact and the home page. The two price pages were re-fetched independently after the JSON was written and both quoted rates came back word for word.

- **Fields corrected:** 4
  - `programs[0].cost_per_child_cad`: null -> 1950 — the basecamp rate is published for children specifically ("$1950.00 per youth (ages 8-16) plus 5 % GST"), so it belongs in the child field rather than being withheld as an adult-only multi-day price.
  - `programs[1].capacity_min`: 10 -> 4 — the day tour line reads "Group size 4 minimum, 10 maximum". The 4 is a minimum for the trip to run and the 10 is the per-booking cap, so they were split correctly rather than both read as a maximum.
  - `venue.youngest_age_welcomed_years`: 9 -> 8 — the day tour's 9 is the highest of the trip minimums, not the venue's youngest. The Orca Camp FAQ says "We are happy to accommodate children as young as 8 years old at Orca Camp" and the home page agrees with "children who are eight years and over".
  - `programs[2].months_offered`: [8] -> null, with "unknown" recorded against months in gaps — both listed West Coast Trail departures fall in August, but those are one season's Parks Canada dates, not a published season. Reading them as the months the trip runs would have been an inference.

- **Fields set to null after review:** 5
  - `venue.has_washrooms` — the only toilet described anywhere is the composting system out at the remote camp, which a group reaches by boat. Nothing is said about the Telegraph Cove meeting beach, so the flag stays null and the camp sentence is kept verbatim in the facility note.
  - `venue.bus_parking` — the site says parking at the base is free and included with the camp tour. That is car parking for guests; nothing addresses a bus. Flag null, sentence kept verbatim in the facility note.
  - `venue.has_rain_backup` — the site says extended rain is unusual but possible and describes a covered outdoor lounge at camp. Neither amounts to a wet weather alternative for a group.
  - `programs[0].duration_min` — the trip is 4 days and 3 nights. Converting that to a minute count would have been my arithmetic, not their figure, so the shape of the trip is carried in the description instead.
  - `programs[1].cost_per_adult_cad` was kept at 400 but `extra_fees_note` was set null — the day tour page lists what is included and never lists an extra charge.

- **Conflicts recorded:** 0. The two different youngest ages, 8 for the basecamp and 9 for the day tour, are statements about two different trips rather than two answers to one question, so each program carries its own minimum and the difference is written into gaps. Prices, the address, the group sizes and the meeting times agree wherever two pages mention them.

- **Authored fields written:**
  - `what_children_do` for the two kayaking programs, resting on the day by day itinerary (the half hour water taxi to Warden Beach, tents with raised beds, four to six hours of paddling a day, the rainforest and waterfall hikes, the camp kitchen and beach fire) and on the day tour overview and participation page (the 40 minute landing craft ride in one direction, two to three hours of paddling morning and afternoon, the provided lunch, the sea stars and anemones in the intertidal zone). Left null for the West Coast Trail, because the site never describes it as something a child would do.
  - `our_note` for all three, resting on the published minimum ages, the camping arrangements, the 4 person minimum and 10 person cap on the day tour, the unpriced group discount the home page twice invites you to ask about, and the trail's own account of pack weight, ladders and exhaustion.
  - `practical_summary` for all three, generated from what is included against the washroom, wet weather, adult supervision, deposit and lead time gaps.

- **Location:** `geo_source` is `geocoded`, and that is honest. The site does publish one map pin, but the image it hangs on is named for Orca Camp and the pin sits at Warden Beach, roughly 14 km southeast of the Telegraph Cove address, which is the remote camp rather than the place a group drives to. The geocode of "1584 Bauza Creek Road, Telegraph Cove" resolves to the house number exactly and returns "At The Water's Edge Adventures", which is the same business name the directions page tells you to follow the signs for, and the itinerary gives that address as the day one meeting place. The camp pin is recorded in gaps so it is not lost.

- **Images:** both entries carry the site's own alt text, both sit on the venue's own domain, and both were present on the page recorded against them. The home page has no Open Graph image, so the hero is the home page banner photo, which is the one image on the site with a written description of its own. No caption was invented and no rights note was taken, since the only copyright line on the site is the site-wide footer. Every other photograph on these pages has an empty alt attribute; rather than describe images I could not open, they were left out and the reason is in gaps.

- **Meets minimum viable record:** yes. Venue id, name, address, coordinates, category, date and a hero image with alt are all present, and the two kayaking programs each carry an id, name, age basis with a published minimum age, a cost, the fact that it does not come to you, and a note.

- **Confidence:** high. This is a plain static site that returns full page text to an ordinary fetch, and the prices, ages, group sizes, meeting times and address are stated in unambiguous words on the venue's own pages. The one soft spot is that the rates carry no year label while the departure lists on two pages are both headed 2025, so the figures may be a season behind.

- **Recommended follow up by phone or email** (info@ecosummer.com, +1 250 230 4399):
  1. Price — what is the group discount the home page keeps mentioning, is there a youth or school rate beyond the published $1950, and are the 2025 rates still current?
  2. Youngest age — is 8 firm for the camp and 9 firm for the day tour, and what does a custom trip for children under 9 cost?
  3. Capacity — can a group take the whole 12 seat camp or the whole 10 seat day tour, and what happens if fewer than 4 sign up for the day?
  4. Lead time — how far ahead does a group need to book, how big is the deposit, and when is the balance due?
  5. Adults — how many adults have to come with a group of children, and do they pay the adult rate?
  6. Washrooms — is there a toilet at the Telegraph Cove beach where everyone meets and waits for the boat?
  7. Rain backup — what happens to a booked day if the weather closes the strait, and is a reschedule offered?
