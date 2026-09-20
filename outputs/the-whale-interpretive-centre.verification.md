# the-whale-interpretive-centre.json

VERIFICATION

- **Fields checked:** 48 (33 venue fields, every non-null field on both programs, and all three image entries). Verified by re-fetching `https://www.killerwhalecentre.org/visit-the-wic/` and `https://www.killerwhalecentre.org/newsletter/` cold in a second pass and matching each quote, price, image URL and alt attribute against the returned page. All eleven quoted strings and all three image URLs and alt attributes were found word for word.

- **Fields corrected:** 4
  - `venue.address`: "C/O 3075 Stubbs Pl, Telegraph Cove, B. C., Canada V0N 3J0" -> "Telegraph Cove, British Columbia V0N 3J0". The Stubbs Place line is written on the contact page as a care-of mailing address for the society, not the location of the building, and the FAQ places the centre at the end of the boardwalk. Using the mail drop would have put the pin on the wrong lot. The audit trail is in `gaps`.
  - `venue.general_admission_adult_cad`: 8 -> null. The $8.00 is published under "Guided Tours and Presentations" and applies to tours and presentations, not to walking in. General admission is by donation with no amount named, so both general admission figures are null and the $8.00 sits on the tour program only.
  - `programs[1].cost_per_child_cad`: 8 kept, but `is_free` was set back to null and `extra_fees_note` added. The site says "$8.00 per person is suggested", which is a suggested donation rather than a set fee and does not distinguish adults from children, so the same figure is recorded per child and per adult and the caveat is carried in the note a director reads.
  - `programs[*].months_offered`: [8, 9] -> null. The site publishes an August 1, 2026 opening and seven-day hours but never a closing date, so a two-month array would have asserted a season the site does not state. Null plus the word "months unknown" in `gaps` is the honest form.

- **Fields set to null after review:** 5
  - `venue.booking_email` — the site publishes society@killerwhalecentre.org and a seasonal bones@killerwhalecentre.org, but the only booking instruction on the site is "Tours and presentations can be scheduled in advance by calling 250-949-1143". Neither address is named as a booking route, so the phone number stands alone and the addresses are recorded in `gaps`.
  - `venue.has_rain_backup` — the visit is indoors, but the site never addresses shelter or a wet-weather alternative, and the interior is still being finished. Inferring it from "it is a building" is exactly the inference the prompt forbids.
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` — the site says nothing about schools, daycares or children's groups either way. Silence is null, not false.
  - `venue.facility_notes` — there was no text keyed to any facility field. The location detail ("The WIC is found at the end of the Telegraph Cove boardwalk. Its entrance faces the beautiful Johnstone Strait.") is directions, not a facility note, so it lives in `what_children_do` instead.

- **Conflicts recorded:** 0. The home page calls the lost collection "the largest public collection of marine mammal skeletons in British Columbia" while the photo gallery says "in Western Canada", and the rebuild page anticipates reopening "with five articulated skeletons" where the FAQ names three survivors plus donated specimens. None of those touch a field in this record and none affects a booking decision, so nothing was manufactured into `conflicts`. The home page banner ("The Whale Interpretive Centre is open!") and the Visit page agree on the opening.

- **Authored fields written:** all three, on both programs.
  - `what_children_do` rests on the Visit page: the centre at the end of the boardwalk with its entrance facing Johnstone Strait, staff on hand "to greet visitors and share information about the marine mammals of our area", the three surviving skeletons named in the FAQ, and the line that tours are "Guided tours of the collection or presentations on marine mammals".
  - `our_note` rests on the August 1, 2026 reopening, the site's own statement that the inside "is still undergoing improvements and isn't quite finished", the complete absence of washroom, lunch, access and parking information, and the fact that tours are arranged by phone.
  - `practical_summary` is generated from the published hours, the by-donation admission and the indoor setting, against the washroom, lunch space, accessibility, parking, duration, capacity and age gaps.
  - `mood_tags` were judged from what a child does rather than the category. The self-guided visit is `explore` and `learn`: children walk the room at their own pace looking at skeletons while staff answer questions. The guided tour is `learn` and `explore`: someone explains the collection while the group moves through it. Nothing on this site is hands-on, so `play` and `creative` were not used, and the boardwalk walk is a way in rather than part of the offering, so `active` was not used.

- **Images:** three entries, all from `https://www.killerwhalecentre.org/newsletter`, all on the site's own CDN, all absolute https, all confirmed present on a second fetch. All three carry the site's own alt text verbatim, so `alt_source` is `site` throughout and nothing was generated. Captions are the gallery's own visible caption titles, verbatim. No `rights_note` was recorded because the site carries no per-photo credit line. `usage` is `unverified` for all three. The photo galleries on the home page and the Visit page were deliberately excluded: every image there has an empty alt attribute and the captions are unedited template text reading "Project name here", and with no browser available there was no way to see the images and write an honest description. One hero exists. The hero and both other photographs show the centre before the December 31, 2024 fire, which their own alt text states and which is flagged in `gaps`; the site publishes no photograph of the rebuilt interior.

- **Location:** `geo_source` is `geocode_pending`, which matches how the coordinates were obtained, which is not at all. The site publishes no map embed, no JSON-LD address block and no coordinate meta tags, and no geocoding service was available in this run. The address captured is community level only, so a backfill pass needs the boardwalk location rather than a postal code centroid.

- **Retrieval:** no browser was needed. A plain fetch returned the full page body on every page, and a desktop user agent returned the same content. This record can be re-run with fetching alone.

- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng` (nothing published on the site and no geocoding available; `geo_source` is `geocode_pending` and the address is captured for a backfill). Also missing `age_basis` on both programs: the site publishes no age range and no grade range anywhere, so there is nothing to base it on. Everything else on the bar is present, including a hero image with alt and `our_note` on both programs.

- **Confidence:** medium. The hours, the by-donation admission, the $8.00 suggested tour donation, the phone booking route and the post-fire state of the collection are unambiguous on the venue's own pages and survived a cold re-fetch, but the site carries nothing at all aimed at children's groups, no ages, no capacity and no facility information, so the record is thin rather than uncertain. The one soft judgement is filing it under science rather than museums; it is a natural history collection whose stated mission is marine mammal biology.

- **Recommended follow up by phone or email** (250-949-1143, or society@killerwhalecentre.org; media enquiries 250-949-1556):
  1. Price — is there a group or school rate, and does the suggested $8.00 per person for a tour apply to children?
  2. Youngest age — are preschool and daycare groups welcome, and is there a minimum age?
  3. Capacity — how many children can be in the building at once while the interior work continues, and how long does a tour or presentation run?
  4. Lead time — how much notice does a booked tour or presentation need, and how late in the year do they run?
  5. Lunch space — is there anywhere on or near the boardwalk a group can eat?
  6. Washrooms — are there any at the centre or elsewhere on the boardwalk, and is there a change table?
  7. Access — can a stroller or a wheelchair get along the boardwalk and into the building, and where can a bus stop?
