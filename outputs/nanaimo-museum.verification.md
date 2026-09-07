# VERIFICATION — nanaimo-museum

- **Fields checked:** 68 (33 venue fields, 7 programs re-read against their own source URLs, 4 images, location, both conflicts)

- **Fields corrected:** 2
  - `venue.hours_notes`: "Tuesday to Saturday, closed Sundays, Mondays and stat holidays" -> same, plus the dates "September 8, 2026 to June 26, 2027". Reason: the plain fetch returned a cached copy of the hours table showing the 2025-2026 season (September 2, 2025 to June 20, 2026). The live browser DOM shows the current 2026-2027 season. The browser copy was taken.
  - `programs[3].grade_max` (Bastion tour): kept at 12 after finding the school programs index card says K-7 while the tour's own page and the booking form both say K-12. Recorded as a conflict rather than quietly picking one.

- **Fields set to null after review:** 3
  - `venue.youngest_age_welcomed_years` — the home learner page says the in person field trips suit "learners aged 5-18", but that sentence sits under home schooling and the museum's general admission is by donation and open to all. Rather than turn one sentence into a door policy, this is null with the exact wording written out in gaps.
  - `venue.hosts_daycare_groups` — the site never mentions daycares or under fives. Silence, not refusal, so null rather than false.
  - `venue.has_washrooms` / `has_lunch_space` / `has_rain_backup` — nothing on the visit, hours or location pages addresses any of them. Not inferred from the museum being indoors.

- **Conflicts recorded:** 3
  1. Field trip season: the school programs page gives September 22 to December 17, 2026 and January 19 to June 24, 2027, while the Petroglyphs program page still shows September 23 to November 26, 2025 and January 13 to June 25, 2026, a season that ended before today. `months_offered` for Petroglyphs was set to null with "unknown" noted in gaps.
  2. Opening hours: the hours table says 10:00am to 4:00pm Tuesday to Saturday; the same page's own summary text still says 10:00am to 5:00pm Monday to Saturday, and that older version is what a search engine shows. Table value taken.
  3. Bastion tour grade range: K-7 on the school programs index card, K-12 on the tour's page and booking form. K-12 taken.

- **Price checks (per class vs per child):** every price on this record is **per class or per group**, never per child, and each was re-read on the live page:
  - `$75 per class` for the three 90 minute in person programs, verbatim on each program page, recorded as a group cost.
  - `$25 per class` for the 30 minute Bastion add on module.
  - `$30 per class` for the pre recorded virtual program, plus `$10 per class` for the live follow up.
  - `$65 flat rate for up to 10 guests` for the private gallery tour, plus `$6.50` per additional guest to a maximum of 25, recorded as a group cost with the extra in the fees note.
  - The only per person figure on the site is the self guided `$0.75/clipboard`, and the site does not say whether one clipboard is one child, so no per child cost was recorded. That is stated as an open question rather than assumed.
  - `school_rate_only` is true for the four class rates, which sit on pages headed for schools and home learners, and false for the private gallery tour, which is priced for any group.

- **Evidence quotes:** all 7 re-fetched from their source URLs with the cache bypassed and confirmed present word for word. None uses an ellipsis, none exceeds 25 words.

- **Images:** 4 entries, one hero. Each URL was confirmed present in the live markup of the page recorded as `found_on_url`. All are https on the museum's own WordPress uploads path. Every alt is `generated` and every image was opened and looked at in the browser before its alt was written; the site's own alt on the one image that has one is a filename, which is why nothing is marked `site`. No captions were invented, and no `rights_note` was taken from the site wide footer copyright line. The site's Open Graph image is a plain social card rather than a photograph, so the hero is the entrance photograph from the tours page instead, which is said in gaps.

- **Location:** `geocoded`, not `site_embed`. The location page carries a Google Maps link whose coordinates are the map viewport centre in the `@lat,lng` form, with no `!3d…!4d…` place pin, no JSON-LD `GeoCoordinates` and no `og:latitude`. The published street address was geocoded to 49.16502, -123.93631. Sanity checked: it lands on Museum Way in downtown Nanaimo, about 150 m from the Nanaimo Art Gallery record on Commercial Street, and about 170 m east of the map centre in the site's own link, which is exactly the offset you would expect from a viewport centre.

- **Browser vs fetch:** the browser changed two things here. It produced the current 2026-2027 opening hours where the fetch served the previous year's table, and it read the photographs, which are CSS page backgrounds rather than ordinary images and do not appear in fetched markup at all. The collapsed sections on the school programs page did render to a plain fetch and were confirmed again in the live DOM after clicking them open.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all 7 programs.
  - `what_children_do` rests on the physical detail in each program's own copy: the mini loom each child receives, the petroglyph rubbings, the wooden desks with ink wells and the walk to the cottage, the three floors of the Bastion, the discovery sheets that ask children to match pictures with objects, the camera moving through the decorated cottage.
  - `our_note` rests on the class rate being per class, the Tuesday to Friday window, the stale dates on the Petroglyphs page, the outdoor walk in Coal Miner's Child, the Bastion not being wheelchair accessible and the walk eating into its half hour, pre registration being required for the self guided visit, the separate $10 live add on for the virtual program, and the absence of any published age range on the private gallery tour.
  - `practical_summary` rests on the museum being wheelchair accessible, the Bastion not being, which programs go outdoors, and the three facility gaps.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked_on are all present, there is one hero image with alt, and every guided program carries id, name, grade range with grades as the basis, comes_to_you, a group cost and an our_note.

- **Confidence:** high. Every price, grade band, duration and availability window is a verbatim quote from the museum's own program pages, re-read in a live browser, and the two places where its own pages disagree are recorded rather than smoothed over.

- **Recommended follow up by phone or email**, in the order a daycare director would want it:
  1. **Youngest age.** Can a group of three and four year olds book anything? The published programs start at kindergarten and the home learner page says ages 5 to 18. The private gallery tour has no age range attached and is the likeliest way in.
  2. **Price for a group that is not a school class.** The $75, $25 and $30 rates are all written as per class, on pages headed for schools and home learners. Ask what a daycare pays.
  3. **Group size.** No maximum or minimum is published for the school programs. The private tours cap at 25.
  4. **Lead time.** Nothing numeric. The site only warns that replies can take a week or more.
  5. **Somewhere to eat lunch.** Not mentioned anywhere, and the museum sits inside a conference centre, so it is worth asking whether a group can eat on site.
  6. **Washrooms.** Not mentioned anywhere on the site.
  7. **Rain backup.** Coal Miner's Child and the Bastion tour both go outdoors on foot. Ask what happens in heavy rain.
  8. **How many adults have to come.** No ratio is published.
