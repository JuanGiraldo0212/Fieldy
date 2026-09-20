# naawayasum-gardens-formerly-tofino-botanical-gardens.json

VERIFICATION

- **Fields checked:** 44 (33 venue fields, the single program's non-null fields, and both image entries), re-read cold against the Naa'Waya'Sum Gardens page, the home page, Our Story, Contact, the Carving Studio page and the lodge Group Bookings page. The evidence quote, the $10 and $80 prices with their validity dates, the "OPEN 7 DAYS A WEEK | 9:00am-5:00pm" line, the street address and both image URLs were confirmed present on a second fetch of the pages recorded in `found_on_url` and `source_url`.

- **Fields corrected:** 4
  - `venue.name`: "Naa'Waya'Sum Gardens (Formerly Tofino Botanical Gardens)" -> "Naa'Waya'Sum Gardens" — the tracker name carries the old name as marketing. The site's own page heading and page title are "Naa'Waya'Sum Gardens", and the longer form it uses is "Naa'Waya'Sum Coastal Indigenous Gardens". The former name is kept in `description`, not in the name or the id. The file keeps the tracker's file name.
  - `venue.id`: "naawayasum-gardens-formerly-tofino-botanical-gardens" -> "naawayasum-gardens" — the id must be a stable slug of the current name and must not carry the old name.
  - `venue.website`: "www.clayoquotcampus.ca/" -> "https://www.clayoquotcampus.ca/naawayasum-gardens/" — the tracker column points at the operating organisation, the Clayoquot Campus. The gardens have their own page on that domain and that is what is recorded.
  - `venue.booking_phone`: two published values, resolved to "(236) 233-2518" — see conflicts below.

- **Fields set to null after review:** 5
  - `has_lunch_space` — there is a cafe on the same site with its own menu and hours, which is not the same as a place a group can eat a packed lunch. Nothing on the site addresses that, so the flag stays null.
  - `bus_parking` — the only parking figure anywhere on the site is "The lodge parking lot can accommodate a maximum of 10 cars", and it sits on the lodge group booking page rather than on anything about the gardens. The sentence is kept verbatim in `facility_notes` and the flag stays null.
  - `booking_method` — the gardens are a drop-in venue. Day passes go through an online store, which is recorded on the program, but no booking route for a visit is published, so the venue-level value is null rather than an invented one.
  - `youngest_age_welcomed_years` — "children (0-12 yrs) are free" is a price band, not a minimum age, and the site never states one.
  - `program.age_basis` with both range pairs — the site publishes no age or grade range for any offering. The free-admission band was not converted into an age range.

- **Conflicts recorded:** 2
  - Opening hours. The gardens page says open seven days a week 9am to 5pm, while a notice carried on every page says "Gardens + Cafe Closed for the season". Neither statement is dated, so `hours_notes` keeps the gardens page wording and `seasonal_notes` carries the closure notice, with the disagreement in `conflicts` for the director.
  - Booking phone. The footer on the gardens page, last modified 2026-09-01, gives General & Bookings (236) 233-2518 and the cafe as 236-312-6727. The Contact page, last modified 2026-07-17, reverses them and gives General & Bookings (236) 312-6727 and the cafe as (778) 244-4255. The cafe page independently gives 236-312-6727 as the cafe number. The value from the more recently modified page is recorded and the audit trail is in `gaps`.

- **Authored fields written:** all three, for the one program.
  - `what_children_do` rests on the gardens page: walking the 12 acres of coastal temperate rainforest, the trails, viewpoints and carvings, the inlet view, and the invitation to move slowly, listen to the cedars and notice the moss on the branches.
  - `our_note` rests on the free admission for children 0 to 12 against the $10 adult day pass, on the complete absence of washroom, lunch, rain and group-rate information, and on the seasonal closure notice.
  - `practical_summary` is generated from the published address, hours and admission against the washroom, lunch, rain-backup, bus-parking and group-rate gaps.

- **Location:** `geo_source` is `site_embed`, not `geocode_pending`. The gardens page links its own address to a Google Maps short link, which resolves to a place URL carrying `!3d49.1331587!4d-125.8904002`. That is a coordinate the venue itself publishes, which the prompt ranks above geocoding, so no geocoding service was needed and no pin was hand-placed. Recorded to five decimal places as 49.13316, -125.89040.

- **Images:** two entries, one `hero`. Both URLs are absolute, https, and on the venue's own WordPress uploads path, and both were confirmed present on the `found_on_url` recorded for them on a second fetch. No image on the site carries descriptive alt text, and the gardens page holds only one image in its markup with an empty alt attribute, so the hero was taken from the gardens tile on the home page, whose alt attribute is the file name "TofinoForest". Both alt lines are `generated` and deliberately minimal: image files are not downloaded in this pipeline and no browser was available, so neither photo was actually looked at and the alt text rests on the file name and on where the photo sits on the page. This is stated in `gaps`. No caption was invented; `rights_note` is null on both, because the footer's copyright line and the words "Photography Credits" are a site-wide notice with no link and are not a photo credit.

- **Retrieval:** no retrieval note is needed. The site is WordPress with Elementor and returns full body text to a plain fetch. Page text, prices, the address and the image markup all came back without a browser. The page list was cross-checked against the site's own REST API so that no published page was missed; there is no schools, education, tours or field trip page on the site.

- **Meets minimum viable record:** no. The venue block is complete, including `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and a `hero` image with alt. What is missing is on the program: `age_basis` and its range. The site publishes no age or grade range for any offering, so that was left null rather than derived from the free-admission band for children 0 to 12.

- **Confidence:** medium. The address, hours, admission prices and the physical description of the walk are unambiguous on the venue's own pages, but there is no group-facing or school-facing content on the site at all, and the seasonal closure notice sits directly against the published opening hours.

- **Recommended follow up by phone or email** (info@clayoquotcampus.ca, General & Bookings (236) 233-2518; the contact form has a topic for the gardens):
  1. Price — is there a group or school rate, and do the adults with a daycare or class group still each pay the $10 day pass?
  2. Youngest age — are preschool and daycare groups welcome on the trails, and is there any minimum age?
  3. Capacity — how many children can come at once, and does a group have to book ahead or can it walk in?
  4. Lead time — how much notice does a group visit need, and who arranges it?
  5. Opening — are the gardens actually open now, given the closure notice on the site, and when do they reopen?
  6. Tours — the site mentions tours, talks and scheduled programming but describes none of them. Is there anything guided a children's group can join, and what does it cost?
  7. Lunch space — is there anywhere a group can eat a packed lunch, indoors or out?
  8. Washrooms — are there any on site, and is there a change table?
  9. Rain backup — is there any shelter on the trails or indoors if the weather turns?
  10. Access and parking — are the trails passable with strollers, and where does a bus park?
