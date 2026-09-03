# VERIFICATION — cfb-esquimalt-naval-and-military-museum

Re-opened on 2026-09-02: homepage, Tours, Visitors, Contact, and the Come-Find-Us directions PDF.

- **Fields checked:** 55 (18 venue fields, 3 programs × ~11 non-null fields, 1 image, provenance block)

- **Fields corrected:** 4
  - `programs[0].cost_per_child_cad` -> `cost_per_group_cad` = 75.00 — "There is a $75 standard fee for guided tours" is a flat charge for the tour, not a per-student price. Recording it per child would have multiplied a $75 visit into $2,250 for a class of thirty.
  - `programs[1].school_rate_only`: false -> true — the free-in-November tour is written for school groups specifically, so daycare accounts should see the "quoted separately" banner.
  - `programs[1].months_offered`: null -> [11] — the free tour is limited to November; leaving it null would have read as "year round".
  - `venue.hours_notes` — rewritten to the Visitors page body value after the sidebar disagreement was found; see conflicts.

- **Fields set to null after review:** 6
  - `venue.has_washrooms`, `has_lunch_space`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking` — none of these is addressed anywhere on the site. Nothing was inferred from the "excellent kids area" testimonials or from the fact that the museum is indoors.
  - `venue.general_admission_child_cad` — the suggested donation lists "Seniors/Students $5" only; "student" is not necessarily a child rate, so the figure is left null and the whole donation scale is recorded in the programs' `extra_fees_note` instead.
  - `programs[2].is_free` — admission is "by suggested cash donation". The site never says free, so this stays null even though it is the field that keeps the record below the publishable bar.

- **Conflicts recorded:** 3
  1. `hours_notes` — Visitors page body (modified 2026-08-11) says "Open 10:00am – 3:30pm, 7 days a week!"; the site-wide sidebar on every page splits the year into a seven-day summer (May 1 – Sep 2) and Monday-to-Friday winter (Sep 3 – Apr 30). Field set from the newer page body. Relevant right now: today is September 2.
  2. `closure_notice` — the Contact page still carries a COVID-19 "we are temporarily closed" notice; that page was last modified 2024-03-28, while the Visitors page and hours block show the museum open. Treated as stale, recorded rather than silently dropped.
  3. `address` — three building numbers across the site: Naden 20 (Contact page), Buildings Naden 37, 39 (undated directions PDF), and "Naden 5" in the sidebar map query. Field set from the only dated source. The mailing address is a PO Box and is not usable for directions.

- **Authored fields written:**
  - `what_children_do` — for the guided tour and the Oriole Gallery only. The tour version rests on the exhibit and gallery photo captions (sextant, log, barometer, submarine control display, range finder); the Oriole version rests on the site's own feature list (dress-up uniforms, flippers, masks, life jackets, magnet board, signal flags, books). Nothing was imagined about what a guide says or does.
  - `our_note` (all three) — rests on the flat $75 fee, the museum's own offer to negotiate or waive fees for groups with limited funds, the base photo-ID requirement and the ten-minute walk from the Naden gate, the November-only free window, and the 4–8 age design of the Oriole Gallery.
  - `practical_summary` (all three) — generated mostly from the *absence* of facility data, which is the honest headline for this venue.

- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (no geocoder available; `geo_source` set to `geocode_pending`, and the address itself is contested — see conflicts) and, on every program, either `age_basis` + range or a cost field. The Oriole Gallery program carries ages 4–8 in years but no price, because admission is a suggested donation; the two tour programs carry prices but no published age range.

- **Confidence:** low to medium. The tour fee and the November offer are stated plainly, but the site is internally inconsistent about its hours, its address and whether it is even open, the tours page was last modified in 2024, and no facility information exists at all. Everything here needs a phone call before a group travels onto a military base.

- **Recommended follow up by phone or email** ((250) 363-5655 / (250) 363-4312; tatiana.robinson@forces.gc.ca for tours), in priority order:
  1. Price — what a school or daycare group pays outside November, and what a group is expected to give as the suggested donation.
  2. Youngest age — the Oriole Gallery is built for 4–8s but no minimum visiting age is published.
  3. Capacity — no group size limit of any kind is published.
  4. Lead time — no booking notice period is published, and base access may need arranging in advance.
  5. Lunch space — nothing published; assume there is none on site.
  6. Washrooms — nothing published.
  7. Rain backup — the museum is indoors, but confirm the walk in from the gate and where a bus can drop off.
  8. Also confirm: which building the museum is actually in (20, 37/39 or 5), whether it opens at weekends after Labour Day, and that the COVID closure notice on the Contact page is indeed stale.
