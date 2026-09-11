# Milner Gardens and Woodland — VERIFICATION

- **Fields checked:** 96 (33 venue, 3 programs at ~20 non-null fields each, 4 images, 1 conflict)

- **Fields corrected:** 3
  - `programs[school-field-trip].cost_per_child_cad`: 200 -> null, and `cost_per_group_cad`: null -> 200. The page reads "$200 per group", not per student. Re-read from the live DOM in a browser to be certain. Recorded per child, a class of 30 would have shown as $6,000.
  - `programs[school-field-trip].age_basis`: "years" -> null, with both age and grade ranges left null. Three of the five themes on the menu say "All ages" and two say "Grade 3 and up", so there is no single published range for the program as a whole. Recorded in gaps instead.
  - `venue.general_admission_adult_cad`: 14 -> 10. $14 is the May to August figure; September, the month checked, is $10. The full month by month range is in `seasonal_notes` and `price_year_or_season`.

- **Fields set to null after review:** 4
  - `programs[].booking_email` on both school programs — the site gives two different addresses for the same coordinator and neither page is dated, so the field is null and the disagreement is in `conflicts`. The venue's general address is recorded instead.
  - `venue.has_lunch_space` — an indoor classroom space and a teaching shelter are mentioned only in the accessibility notes, and nothing says a class may eat a packed lunch anywhere.
  - `venue.has_rain_backup` — "Our programs run rain or shine" is the opposite of a rain backup. Kept as a facility note instead of a yes.
  - `venue.bus_parking` — only three accessible stalls are described.

- **Conflicts recorded:** 1
  - Two spellings of the Shoots with Roots coordinator's email address, one on the field trip page and one on the contact and visitor information pages.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on the field trip menu descriptions (watering, planting seeds in newspaper pots, bird counts uploaded to eBird, pollinating with paintbrushes), the five visit year outline (raking leaves, tree identification games, planting peas, talking stick circle, circle journal) and the visitor information page (trail surfaces, rhododendrons, old growth firs).
  - `our_note` rests on the per group price, the two grade restricted themes, the three adult cap, the closed applications, the long uphill walk and the shuttle cart, and the one backpack per family limit.
  - `practical_summary` rests on the accessibility page for washrooms and step free routing, the visitor information page for parking stalls and shuttle, and the gaps for lunch space and bus parking.

- **Meets minimum viable record:** yes. Validator reports it as publishable. The five visit program supplies `age_basis` grades with grades 1 to 7, `is_free` true and `our_note`; the venue has an address, geocoded coordinates and a hero image with alt.

- **Confidence:** high. Every price, grade band, day, duration, capacity and adult cap was read a second time from the live rendered page rather than from a cached fetch, and each check came back matching.

- **Recommended follow up by phone or email** (250-740-6383 or milnergardens@viu.ca), in priority order:
  1. Whether the $200 field trip fee includes tax, and how and when it is paid.
  2. The youngest age they will take, if your group is under five.
  3. Whether a whole class can be booked outside Thursdays and Fridays, and how much notice they want.
  4. Where a class eats a packed lunch, indoors and out.
  5. Where a bus can drop off and park.
  6. When applications for the free five visit program open again.
  7. Which of the two coordinator email addresses actually works.
