# port-mcneill-district-museum.json

VERIFICATION

- **Fields checked:** 38 (33 venue fields, the single program's non-null fields, and the one image entry). The museum page was re-fetched cold on a second request and every recorded string was matched against the raw HTML word for word: `Admission is by donation and greatly appreciated`, `Open by appointment`, `tel:2509563881`, `Box 1179, Port McNeill, BC V0N 2R0`, the three video exhibit titles, the opening sentence, and the marker `data-lat="50.5887037" data-lng="-127.089708"`. A keyword sweep of the same page for *school*, *group*, *tour*, *washroom*, *parking*, *accessib*, *hour*, *age*, *child* and *fee* returned nothing in the page's own text, which is what the gaps list records.

- **Fields corrected:** 2
  - `venue.website`: the tracker's `www.town.portmcneill.bc.ca` -> `https://portmcneill.ca/residents/museum/`. The old host does not resolve at all (DNS failure, not a redirect). The town's site is now portmcneill.ca and the museum has no domain of its own, so the museum's own page is recorded.
  - `venue.geo_source`: `geocode_pending` -> `site_embed`, with `lat` 50.5887037 and `lng` -127.089708. The museum page carries its own map marker in the page source, so no geocoding was needed and no pin was hand-placed.

- **Fields set to null after review:** 3
  - `general_admission_adult_cad` — the page says admission is by donation, which is not a published price. Left null, and the donation wording is carried in the program description instead.
  - `is_free` — donation is not free, and the site never uses the word, so this stays null rather than true.
  - `format` — "Open by appointment" does not say whether someone shows you round or you look on your own, so neither `guided` nor `self_guided` is supported. Recorded in gaps instead.

- **Conflicts recorded:** 0. Only one page on the site carries museum content, so there was nothing to disagree with. The Visitor Centre page links to the museum but publishes no museum facts of its own, and the Contact page is the town hall's.

- **Authored fields written:** all three, for the single program.
  - `what_children_do` rests on the two things the page actually describes: displays of logging memorabilia from the North Island, and the three named video exhibits. Nothing else about the visit is described, so nothing else was written.
  - `our_note` rests on the appointment-only notice, the absence of any posted opening hours, and the by-donation admission. It points the director at the phone call, because on this site the call is the only route to any practical detail.
  - `practical_summary` is generated from the two published practicals (a phone number and the donation) against a long gaps list covering washrooms, lunch, parking, access, duration and ages.

- **A note on scope:** the town site covers an arena, a campground, a harbour, parks and a pool. Only the museum page was extracted, per the venue row. The one other museum image on the page is noted in gaps but not recorded.

- **Meets minimum viable record:** no. The venue block is complete (`id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and one `hero` with `alt`), but the single program misses two of its required fields: `age_basis` plus a range, and a cost field or `is_free`. The site publishes no age or grade range at all, and admission is by donation rather than a price, so both are correctly absent rather than fillable. Note also that the recorded `address` is the mailing address the site prints, a post office box; no street address is published anywhere on the site, though the map marker puts the pin in the right place.

- **Confidence:** medium. Everything recorded is verbatim from the museum's own page and was confirmed on a second cold fetch, and the coordinates are the site's own marker rather than a geocode, but the page is short and silent on every question a daycare director actually has.

- **Recommended follow up by phone or email** (250-956-3881; no museum email is published, and the only address on the page is the town's and is hidden behind Cloudflare email protection):
  1. Price — what is a group of children expected to give at the door, and is there a set school or group rate?
  2. Youngest age — are preschool and daycare groups welcome, and is there any minimum age?
  3. Capacity — how many children can be in the museum at once?
  4. Lead time — how much notice does the appointment need, and who arranges it?
  5. Opening hours and duration — what times can a group come, what months is the museum open, and how long does a visit take?
  6. Lunch space — is there anywhere a group can eat, indoors or nearby?
  7. Washrooms — are there any on site, and is there a change table?
  8. Getting there and parking — what is the street address, and is there room for a bus or a van?
  9. Access — is the building step-free for strollers and wheelchairs?
  10. Format — does someone show the group round, or do they look on their own?
