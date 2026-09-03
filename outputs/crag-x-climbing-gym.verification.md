# VERIFICATION — crag-x-climbing-gym

- **Fields checked:** 58 non-null values (26 in the venue block, 29 across three programs, 3 image fields), each re-read against the page recorded in `source_url` / `found_on_url`. School Groups, Club Sessions and Group Lesson were re-fetched with a cache-buster for this pass.

- **Fields corrected: 6**
  - `programs[2].cost_per_child_cad`: 45 -> null — "$45 per climber" is not on the live Group Lesson page; it appeared only in a cached copy returned by the first fetch.
  - `programs[2].capacity_min`: 10 -> null — same reason ("10 climbers minimum" absent from the live page).
  - `programs[2].is_free`: false -> null — with no published price, "not free" is an assumption.
  - `programs[2].evidence`: "$45 per climber" -> "2.5 hour session." — the old quote is no longer on the page word for word; the new one is and it supports `duration_min`.
  - `programs[2].description`: "one week of FREE entry" -> "two weeks", and "qualifies for a Crag X Access card" -> "has the skills to pass the Crag X belay test" — the live page says both differently.
  - `programs[0].description`: removed the cross-reference to "$45 per climber, minimum 10" for the same reason.

- **Fields set to null after review: 3** — `programs[2].cost_per_child_cad`, `programs[2].capacity_min`, `programs[2].is_free` (listed above).

- **Conflicts recorded: 1** — two fetches of `https://www.cragx.ca/group-lesson` returned different content (priced vs unpriced, one week vs two weeks of free entry). Neither version is dated, so the price and minimum are null and the conflict carries both readings.

  Deliberately *not* recorded as a conflict: the School Groups rate ($69/$59 per person, 2 hours) and the Group Lesson (2.5 hours) sit on separate pages describing separate offerings for separate audiences, not two readings of one fact. Each program description points at the other so a caller can ask.

- **Prices re-checked:** "$69 per person for groups of 6-12. $59 per person for 13 or more." and "Lesson: $49 per student / Climbing sessions: $20 per student" are both **per person** and are recorded as `cost_per_child_cad`, not as group costs. "Rates are per person. Taxes extra." supports `tax_included: false` on the two school programs. Day pass $22 adult / $20 student, plus "Youth rates are the same rate as students/military", supports the venue's general admission pair. No page is dated, so `price_year_or_season` stays null.

- **Ages re-checked:** both school offerings publish "Ages 12+" in years, so `age_basis` is `years`, `age_min_years` 12, and both grade fields stay null. No grade range is published anywhere on the site. The Group Lesson page publishes no age at all, so `age_basis` there is null.

- **Capacity re-checked:** "You'll need a minimum of 6 students to run a series and our maximum is 15 students" — 6 is `capacity_min`, 15 is `capacity_max`, correct way round. The one-time lesson's "groups of 6-12" is a price tier rather than a stated booking limit, so both capacity fields there are null and the tiers live in the description and `extra_fees_note`.

- **Authored fields written:** `what_children_do` for the two school programs (harness, figure-eight knot, belaying, then climbing — from the School Groups and Club Sessions copy, plus the FAQ's "15m high walls"); left null for the Group Lesson because that page describes the syllabus but not what the session looks like for a child. `our_note` on all three, resting on the per-person tiering, the child-policy waiver rule, the total cost of a full series, and the under-12 belay restriction. `practical_summary` on all three, generated from the indoor/rain-backup facts plus the washroom, lunch, timing and bus-parking gaps.

- **Location:** no Google Maps embed, JSON-LD `GeoCoordinates` or `og:latitude` anywhere on the site — the hours page gives the street address as plain text. Address extracted, `lat`/`lng` null, `geo_source` `geocode_pending`. Correct as recorded.

- **Images:** one entry, the homepage gallery photo on the venue's own Squarespace CDN, confirmed present on `https://www.cragx.ca/`. `alt` is the site's own alt attribute verbatim (a Squarespace filename), so `alt_source` is honestly `site` — but it is not usable alt text and is flagged in gaps for a human to rewrite. No caption invented, no `rights_note` (the site has no per-image credit), `usage` `unverified`. The og:image is the circle logo and was skipped. The School Groups photo has an empty alt and was dropped rather than described unseen.

- **Meets minimum viable record:** no — `venue.lat` and `venue.lng` are null pending geocoding. Everything else on the bar is present: the venue has id, name, address, category and `checked_on`, there is one hero with alt, and `school-group-lesson` carries id, name, `age_basis` + range, `comes_to_you`, a cost and `our_note`.

- **Confidence: high** — the group offerings, prices, ages and capacities are stated plainly on dedicated pages that re-fetched identically, and the one soft spot (the Group Lesson price) has been nulled and recorded rather than guessed.

- **Recommended follow up by phone (250-383-4628) or the group booking form, in priority order for a daycare director:**
  1. **Youngest age** — group programs are 12+; ask whether anything at all can be run for under-fives, given under-12s need one belay-tested adult each.
  2. **Price** — confirm the Group Beginner Lesson rate and minimum, which are no longer on the page.
  3. **Lead time** — "Advanced booking required" with no minimum notice stated.
  4. **Lunch space** — nothing on the site about somewhere to eat or leave bags.
  5. **Washrooms and change space** — not mentioned anywhere.
  6. **Months** — whether school lessons and club series run year-round or only in the school year.
  7. **Bus parking** — bike parking and transit are covered; coach parking is not.
