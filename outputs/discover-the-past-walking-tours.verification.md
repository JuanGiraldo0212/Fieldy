# VERIFICATION — discover-the-past-walking-tours

Verified 2026-09-02 by reopening the school tours page and cross-reading the student tours, FAQ, Ghostly Walks, Chinatown Walks and history tours pages.

**Scope note.** Booking and the live schedule sit off-domain on FareHarbor (`fareharbor.com/embeds/book/discoverthepast/`). Nothing was extracted from there. Every date, time, price and capacity figure in this record comes from discoverthepast.com itself, and the FareHarbor dependency is recorded in gaps.

- **Fields checked:** 78 (33 venue fields, 4 programs × ~8 non-null fields each, 4 image records, location, 2 conflicts, provenance)

- **Fields corrected:** 2
  - `programs[chinatown-tour-upper-grades].description`: added the site's own offer to help arrange lunch in a Chinatown restaurant after the tour — it was on the reopened school tours page and had been missed on the first pass. It is a real practical fact for a group leader.
  - `programs[student-group-tour].indoor`: `false` → `null`. The tours are street walks, but the FAQ says the Chinatown Walks "go into a venue that does not allow dogs", so a flat false was not supported for a program that can be any of the tour types.

- **Fields set to null after review:** 1 (`student-group-tour.indoor`, above). The following were deliberately left null at extraction rather than inferred:
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking`, `facility_notes` — this is a walking tour company with no premises; none of these is addressed anywhere on the site. Nothing was inferred from the tours being outdoors.
  - `booking_email` — no email address is published anywhere on the site; every route is a form or the phone number.
  - `duration_min` on all four programs — the published 60- and 90-minute figures are for the public scheduled tours, not for the tailored school tours, so they were not carried across.
  - `venue.price_year_or_season` — the FAQ says only "Current prices" and the school tours page carries no date at all.

- **Cost checks (the per-class vs per-child trap):** the three Chinatown school tours publish `Cost $150.` and `Cost $160.` as flat figures for the tour, and the same page separately writes the temple donation as `$1/student` — the contrast confirms the $150/$160 are not per head. All three are recorded as `cost_per_group_cad`, never `cost_per_child_cad`. The general student tour has a "special rate" that is never stated, so it carries `is_free: false` with no amount and the condition in `extra_fees_note`. The per-person figures from the FAQ (Adults $24, Children 6-11 $14) are public drop-in admission, not group rates, so they sit in `venue.general_admission_adult_cad` / `general_admission_child_cad` and `hours_notes` rather than being turned into programs. `school_rate_only` is true on all four, since every one of them is published on a page written for schools and students.

- **Age / grade basis:** every school offering publishes grades, so `age_basis` is `grades` throughout and both age-in-years fields are null on all four programs. "K through Grade 3" is recorded as grades 0-3, not converted to ages 5-8. "Grade 4 through 12" is 4-12; "Grade 5 & 6" is 5-6. The general student tour's "students of all ages – from preschool to post-grad" gives a floor but no ceiling, so `grade_min` is -1 (preschool) and `grade_max` is left null rather than invented.

- **Capacity and lead time:** no numbers are published. "with enough notice, we are able to accomodate several classes at the same time" is guidance, not a minimum notice or a capacity, so `capacity_max`, `capacity_min` and `lead_time_days` are all null and both questions are in gaps.

- **Evidence quotes:** all four confirmed word for word on reopened pages.
  - `We offfer school groups a special rate that represents a significant savings over our normal per person fees.` — confirmed on /student-tours/, including the site's own typo, reproduced verbatim.
  - `Our tours for K through Grade 3 focus on visual symbols: the colourful murals that depict a Chinese family` — confirmed on /school-tours/
  - `Our tours include storytelling, hands-on activities and demonstrations. Cost $150.` — confirmed
  - `This tour is offered under agreement with Julie Lawson. Cost $160.` — confirmed

- **Page freshness:** the /school-tours/ page renders unprocessed template code (`<?php echo pulse_output(); ?>`, `[mc4wp_form id="4463"]`) and carries no modified date, so the $150/$160 rates may be older than the rest of the site. It is still linked as the current school tour request form from the contact page. This is flagged in gaps rather than treated as a reason to drop the prices. The page also returned empty on repeated https requests during verification and had to be re-fetched over http to confirm; the content matched the original fetch exactly.

- **Images:** 4 entries, all absolute and all on discoverthepast.com, each re-confirmed present on its recorded `found_on_url`. All four carry verbatim site alt text, so `alt_source` is `site` on every one; none was written by me. The hero's `width` 1648 and `height` 1283 come from the site's own `og:image:width` / `og:image:height`; the other three have no declared dimensions and are null. No captions were written. No `rights_note` was set — the only credit-like text on the site is the footer "Copyright © 2026 - Discover The Past", which is a site-wide line rather than a photo credit, so it is correctly null on all four. All `usage: unverified`. The Chinatown photo is attached as `image_ids` to the three Chinatown programs. Review-site badges (Google, TripAdvisor, Yelp), the logo SVG and the buy-tickets button graphic were all skipped.

- **Location:** `geo_source: geocode_pending`, `lat`/`lng` null. The company publishes no business address; the recorded address, 812 Wharf Street, is the Visitor Information Centre where the FAQ says most Ghostly Walks and History Walks begin. That is a meeting point rather than premises, and Chinatown Walks and Halloween Ghostly Walks start elsewhere — both facts are recorded in gaps so the address is not read as an office. No Maps iframe, JSON-LD `GeoCoordinates` or `og:latitude`/`og:longitude` exists on any page opened, and no geocoder is reachable in this run environment. No pin was placed from knowledge of the city.

- **Conflicts recorded:** 2, both genuine cross-page disagreements, recorded as structured data rather than buried in gaps.
  1. `chinatown_walk_meeting_point` — the FAQ (dated 2026-02-13) says the Bright Pearl Sculpture; the history tours page says the Sun Yat-Sen statue. Both are near Fisgard and Government, but they are different landmarks. The history tours page is undated, so no field was quietly set from either.
  2. `walking_distance_km` — the FAQ says 1.5-2 km; the Ghostly Walks page (dated 2026-04-07, the more recent) says 2-3 km. This matters for whether young children can manage the route, so it is surfaced rather than averaged. Neither figure is stored in a schema field.

  Not recorded as a conflict: the homepage says the company has run tours "since the 1960s" while the About page says "since 1999". The disagreement is real but maps to no field in this record and does not affect a booking decision, so the founding year is simply left out of `description` rather than one page being quietly preferred.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all four programs.
  - `what_children_do` rests on the site's own accounts of each route: the K-3 tour's murals, Gate of Harmonious Interest, lanterns, upturned eaves and dragons plus the lion dance, Chinese game and counting to four in Cantonese; the Grade 4-12 tour's storytelling, hands-on activities and demonstrations; and the White Jade Tiger tour's Never Ending Store, fan tan in Fan Tan Alley, the 1881 quarter in a lai see envelope and trying on Jasmine's clothing.
  - `our_note` rests on the group-rather-than-per-child pricing, the unpublished rate for the general student tour, the $1-per-student temple donation, the $10 gap between the White Jade Tiger and standard Chinatown tours, and the site's own warning that Ghostly Walks content may not suit young children.
  - `practical_summary` rests on the fully outdoor street routes and the 1.5-3 km walking distance plus the gaps list (price, capacity, notice, washrooms, wet weather).

- **Meets minimum viable record: no.** Missing `venue.lat` and `venue.lng` only. Everything else clears the bar: the venue has id, name, address, category and `checked_on`; there is a hero image with alt; and `chinatown-tour-early-years` has id, name, `age_basis: grades` with grades 0-3, `comes_to_you: false`, `cost_per_group_cad: 150` and `our_note`. Backfilling coordinates for 812 Wharf Street would make this publishable without re-reading the site.

- **Confidence: medium.** The grade ranges and the three Chinatown prices are stated plainly and were confirmed verbatim, and the FAQ is recent (2026-02-13). Against that: the school tours page is an undated, partly broken template, the general school rate is never stated, two pages disagree on the meeting point and on walking distance, the Ghostly Walks page still advertises a 2025-26 winter season, and the whole booking calendar lives off-domain and was not read.

- **Recommended follow up by phone or email** (250-384-6698, or the form at /student-tours/), in priority order for a daycare director:
  1. **Price** — the school rate for a non-Chinatown tour is never published, and the $150/$160 Chinatown figures sit on an undated page. Confirm both, and confirm they are per group.
  2. **Youngest age** — "preschool to post-grad" is the only guidance; ask for a minimum age in years, and confirm which routes suit under-fives given the Ghostly Walks content warning.
  3. **Capacity** — how many students one guide takes, and how many classes can genuinely run at once.
  4. **Lead time** — "enough notice" is all the site says; get a minimum in days.
  5. **Lunch space** — there is none; the only offer is help booking a Chinatown restaurant after the Grade 4-12 tour.
  6. **Washrooms** — nothing is published about facilities anywhere on the routes; worth planning around before a 1.5-3 km walk.
  7. **Rain backup** — the tours are entirely outdoors on city streets and no wet-weather policy is published.
  8. Also worth asking: the meeting point for a Chinatown school tour (the site names two different landmarks), tour length for the school versions, chaperone ratio and whether accompanying adults are charged, and deposit and cancellation terms.
