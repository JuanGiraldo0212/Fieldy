# VERIFICATION — Fairway Gorge Paddling Club

- **Fields checked:** 61 non-null fields across the venue block (24), three programs (30) and two images (7), each re-read against the page recorded in `source_url` / `found_on_url`.
- **Fields corrected:** 1
  - `programs[2].evidence`: "2026 Camp Fees: 4 day camps: $352.00 5 day camps: $440.00" -> "Prices range from $352 to $440 per week." — the first version stitched a heading and two bullet items into one string; the replacement is a single contiguous sentence on the page.
- **Fields set to null after review:** 0. Fields deliberately left null from the start rather than inferred: `age_min_years` / `age_max_years` / `age_basis` on both group programs (the Group Adventures page says only "for adults, youth and children" and gives no minimum age), `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking`, `tax_included` on the two group programs, `lead_time_days`, `months_offered` on the group programs.
- **Conflicts recorded:** 0. Two figures sit at different scopes rather than conflicting: the page header says the club can accommodate "groups of 10 to 120 people", while the dragon boat section gives 16-20 paddlers per boat and a maximum of 5 boats per session. Per-boat capacity is what is recorded in `capacity_min` / `capacity_max`, and the 10-120 range is in the venue description.
- **Price re-check (cache-busted):** `/group-adventures/?v=2` and `/junior-programs/kids-camps/?v=2` were re-fetched with cache-busters in STEP 3 and returned byte-identical prices to the first pass — $350 per dragon boat, $35 per person for kayak, $352 (4 day) and $440 (5 day) for camps. No stale-cache discrepancy.
- **Cost-field check:** $350 is per boat, so it is recorded as `cost_per_group_cad`, not per child. $35 is explicitly "per person" and is recorded as `cost_per_child_cad`. Camp fees are per child. The corporate dragon boat packages ($2,800 / $5,250 + GST) are adult workplace programs and were not recorded as a program.
- **Authored fields written:**
  - `what_children_do` for all three programs, grounded in the site's own statements — FGPC supplying paddles, PFDs, a coach and a steersperson; the 1.5 hour and 2 hour durations; the camp's list of paddlecraft, safety skills, games and mini regatta.
  - `our_note` for all three, resting on the published minimum crew of 16, the one-adult-per-ten-participants school requirement, the missing minimum age, the 9am-4pm camp day and the pizza-lunch partnership.
  - `practical_summary` for all three, built from the facility fields (all null) plus the gaps list.
- **Location:** `geo_source` is `site_embed`. The coordinates come from the Google Maps embed URL published on the club's own Location and Hours page (`!3d48.43915953808649!2d-123.38095668416082`), rounded to 5 decimals. No geocoder was used and no pin was hand-placed.
- **Images:** 2 entries, both on `www.fgpaddle.com` and both confirmed present on the Group Adventures page recorded in `found_on_url` (one as that page's `og:image`, one as the page's lead photo). The homepage `og:image` was skipped because it is a "NEWS UPDATE" graphic, not a photograph — noted in gaps. Neither image carries an alt attribute, so both alts are `generated`; gaps states plainly that they rest on the file name and page context rather than on viewing the photo. No captions were invented and no `rights_note` was taken from the footer copyright line.
- **Meets minimum viable record:** yes. Venue has id, name, address, lat/lng, category, checked_on and a hero image with alt; the Paddlesport Adventure Camp program carries id, name, `age_basis: years` with ages 6-12, `comes_to_you: false`, a cost and an `our_note`.
  - Caveat for the human reviewer: the record clears the bar on the summer camp, which is a per-child registration through the club store, not a group booking. The two genuine group offerings (dragon boat, ocean kayak) have prices and capacities but no published age range, so on their own they would not clear it. That is a real property of the site, not padding — but a reviewer should know the bar was cleared by the camp.
- **Confidence:** high for prices, durations, capacities and the chaperone requirement, which are stated plainly and were confirmed twice; medium for the record overall, because the club publishes nothing at all about the age floor or the on-site facilities a group leader needs.
- **Recommended follow up by phone (778-432-3472) or email (info@fgpaddle.com), in priority order:**
  1. Youngest age accepted in a dragon boat and in a kayak — the single biggest unknown for a daycare or primary class.
  2. Whether $350 per boat and $35 per person include GST.
  3. Whether a class of 25 can be split across two boats and what that costs.
  4. Lead time — how far ahead summer and shoulder-season dates need to be booked.
  5. Washrooms, change rooms and somewhere to eat lunch on site.
  6. What happens to a booked session in bad weather or high wind.
  7. Season — which months group bookings actually run.
