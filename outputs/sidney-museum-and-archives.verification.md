# VERIFICATION - Sidney Museum and Archives

- **Fields checked:** 41 (venue block 33, one program's non-null fields, one image entry)
- **Fields corrected:** 6
  - `venue.description`: rewritten to drop the "Take a walk through time and discover the history of Sidney, North Saanich and the greater Saanich Peninsula" passage, because a live browser read shows that text is no longer on the home page. Reason: the plain fetch had served an older cached home page.
  - `venue.general_admission_child_cad` / `general_admission_adult_cad`: "admission by donation" -> null. Reason: that line appeared only in the cached home page. The current live home page publishes no admission information at all.
  - `venue.hours_notes`: taken from the FAQ page live rather than the cached home page. Both agree on 7 days a week, 10:00am to 4:00pm.
  - `venue.seasonal_notes`: "LEGO brick exhibit runs until March 30, 2025" -> "returns in December 2026 and runs until around March 2027". Reason: the cached events page carried the 2024/25 dates, the live FAQ carries the current ones.
  - `programs[0].description`: rewritten from the live page text. The cached version's sentence "The Sidney Museum is not currently offering guided visits for school groups" is no longer on the page, which now says only "Check back for more information soon."
  - `venue.address`: 2434 -> 2423 Beacon Ave, after the conflict below.
- **Fields set to null after review:** 3
  - `general_admission_child_cad`, `general_admission_adult_cad` (see above)
  - `has_washrooms` - never stated on any page. Not inferred from the building being a museum.
- **Conflicts recorded:** 1
  - The street number. Their FAQ page gives 2434 Beacon Avenue in its Location section and 2423 Beacon Ave two paragraphs later in its Accessibility section. Every page footer says 2423, so that is the value used.
- **Authored fields written:** all three.
  - `what_children_do` rests on the About Us line about over 8,000 artifacts in the permanent exhibition galleries, the home page featured exhibit block, and the FAQ line about the permanent LEGO brick train table with a train on a circular track.
  - `our_note` rests on the FAQ accessibility passage about two short flights of stairs at the front, the rear elevator entrance off Fourth Street, and the volunteer having to open the lower doors, plus the complete absence of price, group size and duration anywhere on the site.
  - `practical_summary` rests on the same accessibility passage plus the empty facility fields.
- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (no geocoding service in this run, address captured, marked geocode_pending), and no program clears the bar because the site publishes no age or grade range and no cost or free flag for a class visit.
- **Confidence:** medium. Everything recorded was read live in a browser and the address conflict is theirs, not ours, but the record is thin because the site genuinely publishes almost nothing about group visits.
- **Recommended follow up by phone or email** (250-655-6355 or outreach@sidneymuseum.ca), in priority order:
  1. What does a class visit cost, if anything
  2. Youngest age they will take, and whether daycare groups are welcome
  3. Maximum group size in the galleries
  4. How much notice they want
  5. Anywhere for a group to eat
  6. Washrooms
  7. Whether a coach can drop off and where it parks
