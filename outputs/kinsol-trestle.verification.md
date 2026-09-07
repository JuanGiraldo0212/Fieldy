# VERIFICATION — Kinsol Trestle

- **Fields checked:** 33 venue fields, 2 programs at 46 fields each, 2 image entries, 11 gaps.
- **Fields corrected:** 4
  - `venue.website`: `www.cvrd.bc.ca/1379/Kinsol-Trestle` -> `https://cvrd.ca/parks/kinsol-trestle/`. The tracker URL is a legacy path that redirects twice, first to `cvrd.bc.ca/parks/kinsol-trestle/` and then to the canonical `cvrd.ca` host the page itself declares.
  - `programs[school-field-trip-request].lead_time_days`: `null` -> `30`. Checked that this is a minimum notice and not a recommendation. The schools page says applications "must" be submitted no less than 30 days before, and the PDF form adds "late requests cannot be accommodated". It is a hard floor, so it belongs in the lead time rather than the description.
  - `programs[school-field-trip-request].school_rate_only`: `false` -> `true`. The process is published on a page titled for schools and the copy addresses school groups specifically. Daycares are not named anywhere, so the "daycares are quoted separately" banner is the honest thing to show.
  - `venue.has_rain_backup`: `false` -> `null`. There is a "kiosk and pavillion" listed on site and the site never says whether either is roofed, so false would have been asserting something the page does not.
- **Fields set to null after review:** 2
  - `venue.bus_parking`. The page describes "a public parking area about 550 metres down the road" and lists "Parking lot" among the amenities, but says nothing about coaches, bus bays or capacity. Reading a school bus into a parking lot is exactly the inference the rules forbid.
  - `programs[*].capacity_max`. The form warns only that group size "must be planned to match the capacity of the park". That is a rule of thumb, not a number, and a minimum was never stated either, so `capacity_min` stays null too.
- **Conflicts recorded:** 0. The two sources that describe the same things agree once the units are converted: the park page gives 187 metres long and 44 metres high, the fact sheet gives 614 feet and 145 feet, which are the same numbers. The park page gives the walk in as about 1.2 km from the south parking lot and the fact sheet calls it about a fifteen minute walk, which are consistent rather than contradictory.

## What the browser changed

This venue could not have been extracted by fetching. A plain fetch of the park page returns roughly 1,500 lines of site navigation and none of the page's own content, and the same is true of the schools page. Everything below was recovered only in the browser, and a `RETRIEVAL NOTE` line is in gaps so a fetch-only re-run does not overwrite this record with an empty one.

- **Collapsed accordions.** Four panels on the park page ("How To Get Here", "Map", "Video", "Media Articles") and five on the schools page ("Field Trips", "Field Trips with Picnic Shelter Reservations", "Volunteering in Parks", "Special Events" and the class and youth group section) were all `aria-expanded="false"` and had to be clicked open. The How To Get Here panel is where the driving directions, the 1.2 km walk in distance, the year round accessible toilets on both sides and the "flat, wide, and surfaced with crushed gravel fines" trail description all live. Without opening it the record would have had no washrooms, no accessibility and no directions.
- **The 30 day rule and the insurance requirement** likewise only appear once the schools page panels are open.
- **The map is not a map.** The Map panel contains a static drawn JPEG, not an embedded Google map, so there is no `!3d`/`!4d` pair and no coordinates to take. Checked the whole rendered document for `latitude`, `longitude`, JSON-LD `GeoCoordinates` and `og:latitude` as well, and found none.
- **Images were looked at, not guessed from file names.** The page's photographs are named `Document-2025-10-10T125827.366.jpg` and similar and carry empty alt attributes, so each candidate was opened directly in the browser and described from the frame.

## Re-read in STEP 3

Both source pages were reloaded and re-read from the live DOM rather than from the earlier fetch, since fetching returns nothing usable here anyway. All quoted text matched.

- **Evidence quotes:** both confirmed contiguous and verbatim.
  - Walk out to the trestle: "The Historic Kinsol Trestle is open to the public for cyclists, hikers and equestrians" — on the park page.
  - School field trip request: "School groups must submit their application no less than 30 days before the proposed field trip." — on the schools page.
- **Prices:** there are none, on either page, in the teachers' guide or on the form. The only fees named anywhere in the parks section are for reserving picnic shelters at Bright Angel Park, Glenora Trails Head Park and Elsie Miles Park, and the Kinsol Trestle is not one of them. `is_free` is left **null** on both programs rather than set true: the site says the trestle is "open to the public", which is about access, not price, and it never states that a visit costs nothing. That is deliberately the same treatment the other free-to-enter public parks in this catalog already have. `price_year_or_season` is null because no price and no year exist to attach it to.
- **Per group versus per child:** not applicable, since no money is published in either direction. Nothing was recorded in either cost field.
- **Scope kept to the trestle.** The regional district appears elsewhere in this catalog as the operator of other sites, so the school field trip process was recorded only as it applies to visiting this trestle. The picnic shelter reservation system, which covers three other parks, is deliberately not recorded as a program here and is mentioned only in gaps to explain why "no fee" does not mean "free".
- **Age basis:** null, and no age or grade range set. Nothing about ages is published, including anything about whether a 44 metre high open deck suits under fives, which is the question a daycare director would most want answered. Left as a gap rather than guessed.
- **mood_tags:** `explore` and `active` on both programs. It is a walk of about 1.2 km each way to a thing you then look at from viewing platforms, so bodies are moving for a meaningful part of it and the looking is open ended and self paced. `learn` was deliberately not added: there is no guide, no interpretive programme and no staffed presence published, so a child would say they went for a walk over a big bridge.
- **Images:** 2 entries, both on the district's own WordPress uploads directory, both https and absolute, both confirmed present on the park page. The hero is the page's own og:image, which is a photograph rather than a logo or social card, and its width and height were taken from the `og:image:width` and `og:image:height` tags the page states. The second image's caption "Kinsol Bridge" is a real `custom-image-caption` element attached to that image in the markup and is recorded verbatim; the other photographs on the page have no caption and none was written. Both alts are `generated` after opening the images and looking at them. `rights_note` null on both, since the page carries no photo credit.
- **Location:** `lat`, `lng` null and `geo_source` `geocode_pending`, with the park address "2869 Glen Eagles Road, Shawnigan Lake" captured exactly as the sidebar writes it. No coordinates are published on the site, and no pin was hand placed from the map image or from knowledge of where the trestle is.
- **Staleness:** the park page was last touched in March 2026 and the photographs were uploaded in October 2025, so the page itself is current. The teachers' guide and the request form are both labelled 2025 and were re-uploaded in February 2026, which is noted in gaps so the notice period and the insurance limit get confirmed rather than assumed. No posted schedule on this venue has passed, because none is posted.
- **Meets minimum viable record:** **no**. Missing `venue.lat` and `venue.lng`, which are pending geocoding from a good street address, and missing `age_basis` plus a range and a cost field on both programs, none of which the site publishes. The hero image and its alt are present, the venue block is otherwise complete, and both programs have `our_note` and `comes_to_you`.
- **Confidence:** **high** on everything recorded. The facts came from the district's own park page, its own schools page, its own fact sheet PDF and its own request form, and all of it was read from the live rendered page. The confidence is high precisely because the gaps are recorded as gaps rather than filled.

## Recommended follow up by phone or email

Contact parks.events@cvrd.bc.ca or 250.746.2660, in this order:

1. **Price** — whether a school or daycare visit costs anything at all, since the site never says.
2. **Youngest age** — whether they have any view on young children on the trestle deck, and whether daycare groups go through the same field trip form as schools, since only schools are named.
3. **Capacity** — what group size the park will actually accept, given they ask you to match the group to the toilets and parking.
4. **Lead time** — confirm the 30 day minimum still stands and that the 2025 form is the current one.
5. **Bus parking** — whether a school bus can get down Glen Eagles Road and turn or park at the lot. This is the biggest unknown for anyone coming from Duncan or further.
6. **Lunch space** — whether the pavilion is roofed and whether a class can eat there, or whether the picnic area is just tables in the open.
7. **Washrooms** — confirmed open year round on the site, but worth asking whether both sets are open in winter and whether either has a change table.
8. **Rain backup** — there is none published, so ask what they suggest, or plan to cancel.
