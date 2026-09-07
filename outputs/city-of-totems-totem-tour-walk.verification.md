# VERIFICATION - city-of-totems-totem-tour-walk

- **Fields checked:** 41 (33 venue, 1 program block, 1 image, plus provenance)
- **Fields corrected:** 1
  - `venue.name`: "City of Totems – Totem Tour Walk" -> "City of Totems Totem Tour Walk". The tracker name carries an en dash; removed so no dash reaches a reader.
- **Fields set to null after review:** 3
  - `venue.booking_phone` and `venue.booking_email`. The City Hall line and the general duncan@duncan.ca address are published, but they are the City's general contact, not a booking route for the walk. Nothing is booked, so both are null and the phone number is recorded in gaps instead.
  - `programs[0].duration_min`. The site never says how long the route takes or how far it is.
- **Conflicts recorded:** 0. The two Totems Tour pages describe the same walk, one from January 2024 emphasising the painted footprints and one from August 2026 emphasising the QR digital tour. They complement rather than contradict, so both are reflected in the one program.

## Programs re-checked against source
Re-opened `https://duncan.ca/visitors/totems-tour/` and `.../totem-tour-walk/` in a browser after writing the JSON.
- Evidence quote "Embark on a journey of culture and history by following the yellow footprints and start the self-guided walking tour" is present word for word on the Totems Tour page. 19 words.
- No price appears anywhere. `is_free` is set true on the basis that this is a walk on public streets with no admission point, ticket or booking route published; the reasoning is recorded in gaps rather than hidden.
- No age or grade range is published, so `age_basis` is null and both range pairs are null.
- No capacity, no lead time, no chaperone guidance.
- `school_rate_only` false: no price is published for schools or anyone else.

## Guided / school version, and route map
Both were checked explicitly, since the brief asked.
- **Guided or school version:** none published. Neither Totems Tour page, the About the Totems page nor the Totem Collection page mentions a guided tour, a school programme or a booking route. A site search on duncan.ca for "totem tour school guided" returned only a 2020 council agenda PDF. `hosts_school_groups` and `hosts_daycare_groups` are therefore **null, not false** - the site is silent rather than refusing.
- **Route map or brochure PDF:** none published. A site search for "totem tour map" returned the same council agenda and nothing else. The interactive map is hosted off-domain at onthisspot.ca, which is not the venue's own site, so it was not used as a source. This is recorded in gaps.

## Images
One image, `hero-yellow-footprints`. Confirmed absolute, https, on duncan.ca, and present on the Totems Tour page recorded as `found_on_url`. Alt is the site's own alt attribute verbatim, so `alt_source` is `site`. Caption is the page's own caption text verbatim. Width and height are the markup values, 1280 x 588. No credit line sits with the photo, so `rights_note` is null. The page publishes no og:image, which is noted in gaps. The image was opened directly and looked at: a red wooden building signed Cowichan Valley Museum with yellow footprints along the sidewalk, which matches the site's alt.

## Location
No coordinates are published anywhere on the site: no map iframe, no JSON-LD GeoCoordinates, no og:latitude. The tour has no published start point. The only street address the site gives is Duncan City Hall, 200 Craig Street, which sits in the downtown core where the poles stand. That address is recorded, `lat`/`lng` are null and `geo_source` is `geocode_pending` so it can be backfilled in one pass. No pin was hand-placed.

## Authored fields
- `what_children_do` rests on: yellow footprints painted on the pavement marking a self-guided route, over 40 poles in the downtown core, an interpretive sign at each pole carrying the carver's story, and QR-coded decals giving video, written content and audio.
- `our_note` rests on: it is self-guided with no booking, there is no published map or brochure, and the digital tour is reachable online in advance.
- `practical_summary` rests on the facility fields, all of which are null, plus the gaps list.

- **Meets minimum viable record:** no. Missing `venue.lat`, `venue.lng` (geocode pending), and no program carries an age basis with a range, because the site publishes none.
- **Confidence:** high on what is recorded, because everything came from four pages of the City's own site and was re-read live. The gaps are wide but they are genuinely gaps, not retrieval failures.

## Recommended follow up, in priority order
1. Ages: is there any guidance on which ages the walk suits, and how long it takes.
2. Whether a guided or school version can be arranged, and who to ask.
3. Whether a printed route map exists at City Hall or the Cowichan Valley Museum.
4. Where a group should start, and where a bus can drop off and park.
5. Nearest public washrooms on the route.
6. Somewhere to eat, and what a group does if it rains.
