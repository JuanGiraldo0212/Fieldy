# VERIFICATION — campbell-river-art-gallery

- **Fields checked:** 33 venue fields, 2 programs at 45 fields each, 4 images at 11 fields each. Both programme source pages and the hours, what-we-do and home pages were reopened in a live browser after the JSON was written.
- **Fields corrected:** 4.
  - `geo_source`: `site_embed` from `map_start_lat` -> `site_embed` from the plugin's marker record. Same value, different and correct basis. See the location note below, because the first reading was the trap.
  - `hours_notes`: home page wording -> hours page wording, which is the more recently dated of the two and the one that accounts for September.
  - `programs[1].school_rate_only`: `false` -> `true`. The classroom visit is titled "Gallery in the School", says "come to your school", and prices a school district rate, so daycare accounts should see the "quoted separately" banner.
  - `programs[0].school_rate_only`: left `false` after review. The programme is titled "School & Community Group Tours" and the copy says "your class or community group", so the rate is not written for schools only.
- **Fields set to null after review:** 3.
  - `venue.has_rain_backup` -> `null`. The programmes are indoors, but the site never addresses a wet weather fallback and inferring one from "it is a gallery" is a guess.
  - `venue.general_admission_child_cad` / `_adult_cad` -> `null`. Nothing on the site says what it costs to walk in, and free was an assumption.
  - `venue.price_year_or_season` -> `null`. The education page carries no year or season against its prices.
- **Conflicts recorded:** 2 (opening hours across two pages, and K to 12 against All ages within the classroom programme block).

## Location

The contact page runs a WP Google Maps map. Its `data-settings` attribute carries `map_start_lat` 50.027219 and `map_start_lng` -125.244825, which is the **map viewport centre** and is not on its own a place pin. The plugin's marker collection was read from the live page after render and contains a marker at 50.027219, -125.244825 carrying the address `1235 Shoppers Row, Campbell River, British Columbia`. That marker is the place pin, so `geo_source` is `site_embed` honestly. The two happen to coincide here because the map is centred on its own marker, which is exactly why the first reading looked fine and would have been recorded on the wrong basis. The second marker in the collection is the plugin's California default and was ignored. The point sits in downtown Campbell River, inside the island box.

## Per-group versus per-child

This was the field most at risk.

- The **group tour** is quoted "$110.00 per group". Verbatim, unambiguous, recorded as `cost_per_group_cad`. Confirmed word for word against the live DOM.
- The **classroom visit** is quoted only "Fees: $110 with use of school materials ($100 for School District 72)". It never says per group, per class or per child. It has been recorded as a whole group fee, on two grounds: the identical figure is written "per group" for the tour directly above it, and the next line reads "One hour per class". **This is an inference, not their words**, it is flagged as such in `gaps`, and it is the single item most worth confirming by email. Recording $110 per child for a class of 22 would be a $2,310 error in the wrong direction.

## Authored fields written

All six, two per programme.

- `what_children_do` rests on "staff-led guided tour of the current exhibition or an upcoming exhibition and engaging art activity" for the tour, and on the named techniques plus "come to your school ... in your classroom" for the visit. It is also grounded in a photograph on the education page showing a class of young children sitting on the gallery floor while two adults hold up a framed print. Nothing about the studio room was claimed, because the tour page does not say where the activity happens.
- `our_note` rests on the published hour and a half shape of the tour, on the absence of any group size or adult ratio, and on the classroom fee being written as covering the visit with the school's own materials.
- `practical_summary` rests on the accessibility paragraph, which is repeated identically on the hours and what-we-do pages, and on the total silence about lunch and bus parking.

## Images

Four entries, one hero. Every URL was opened in the browser and looked at before its alt was written, and every one resolves.

- Hero is the building exterior from the what-we-do page, not the page's Open Graph image, because the education page's og:image is the School Tours banner with text burned into it rather than a view of arriving. Noted in `gaps`.
- The hero's caption "A view of the building, 2022." is the site's own italic caption, verbatim.
- `space-main-gallery` uses the site's own alt, "a green hand holding a stick", verbatim, with `alt_source` `site`. Its caption is the site's, verbatim.
- The largest srcset variant was taken for the hero and the main gallery shot, so `width`/`height` are null for those two rather than carrying the markup values of the smaller rendition. The two banner images are recorded at the dimensions their own markup states.
- No `rights_note` on any entry. The site has a footer copyright line and no per-image credits, and a footer line is not a photo credit.
- All four are `unverified`. Nothing on the site invites reuse.

## Other checks

- Evidence quotes for both programmes were confirmed present character for character in the live DOM, contiguous, and under 25 words.
- `capacity_max` is null rather than guessed. No group size of any kind is published.
- `lead_time_days` is null. No notice period is published, so there was nothing to distinguish a minimum from a recommendation.
- The Art Hive was not recorded as a programme. It is a weekly open studio for adults from the unhoused and lived experience community. The Digital Programs page was not recorded either; it is an archive of past talks and workshops, several priced and dated 2020 and 2021, with nothing bookable now. The rentals page is facility hire, not a children's offering.
- `hosts_daycare_groups` is null, not false. Both programmes are written K to 12, which starts at about five, and the rule reserves false for a stated minimum above that. The classroom block also says "All ages" two lines later, which is the second recorded conflict.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked_on are all present, there is one hero with alt, and both programmes carry id, name, `age_basis` with a grade range, `comes_to_you`, a cost, and an `our_note`.
- **Confidence:** high. Both programmes are priced, dated to a page updated three days ago, quoted verbatim, and re-read in a live browser. The one soft spot is the per-group reading of the classroom fee, which is flagged in the record itself.

## Recommended follow up by phone or email

1. Is the $110 classroom fee for the whole class, and does GST go on top of either price.
2. Will they take a group of children under kindergarten age, given "K to 12" and "All ages" both appear.
3. Biggest group they can take on a tour, and how many adults they want with it.
4. How much notice they need, and which days tours run.
5. Somewhere for a group to eat lunch.
6. Where a bus can drop off and wait on Shoppers Row.
7. Whether Sundays are open, given the two pages disagree.
