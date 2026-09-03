# abkhazi-gardens.json

VERIFICATION

- **Fields checked:** 41 (33 venue fields, plus the single program's non-null fields and both image entries, re-read against the Hours & Directions, Abkhazi Garden, A Tour of the Garden and homepage pages).
- **Fields corrected:** 3
  - `general_admission_child_cad`: 10 -> null — the site says "Admission is by a suggested donation of $10 per person" and never says whether children pay it, so only the adult figure is recorded.
  - `program.days_offered`: [1,2,3,4,5,6,7] -> null — the garden is open 7 days a week only from April 1 to September 30; from October 1 to March 31 it is Wednesday to Sunday. A single weekday array would have been wrong half the year, so the split is carried in `hours_notes` and the program description instead.
  - `venue.name`: "Abkhazi Gardens" -> "Abkhazi Garden" — the site consistently uses the singular; the tracker's plural is kept only in the file name.
- **Fields set to null after review:** 2
  - `wheelchair_accessible` — the site says the Teahouse is wheelchair accessible and that "many of the pathways throughout the Garden are gravel or have steps that may be physically challenging for those with mobility issues". That warns but does not state the garden is or is not accessible, so the flag stays null and the sentence is kept verbatim in `facility_notes`.
  - `bus_parking` — the directions describe street parking on Fairfield Road for cars only. The note is kept in `facility_notes.bus_parking`; the flag stays null.
- **Conflicts recorded:** 0 — the homepage banner ("OPEN: 7 Days a Week, 11AM – 5PM") and the Hours & Directions page agree for the current season; nothing else disagreed across pages.
- **Authored fields written:** all three, for the one program.
  - `what_children_do` rests on the A Tour of the Garden page: the rhododendron woodland, the south lawn, the heather-lined path beside the rock, the three ponds with resident mallards, the summerhouse, and the path dividing at the garden shed into an even route and a more challenging one.
  - `our_note` rests on the same page's description of gravel, steps and steep rock, plus the complete absence of any group information on the site.
  - `practical_summary` is generated from the address, hours and suggested donation that are published, against the washroom, lunch, rain-backup, bus-parking and group-rate gaps.
- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng` (no geocoding service in this run environment and no coordinates published on the site; `geo_source` is `geocode_pending` and the full street address is captured for a backfill pass). Also missing a qualifying program: the site publishes no age or grade range and no group or child price, so `age_basis` and every cost field on the single program are null.
- **Confidence:** medium. The address, hours, admission wording and physical description of the walk are unambiguous on the venue's own pages, but there is no group-facing content on the site at all, so the record is thin rather than uncertain.
- **Recommended follow up by phone or email** (TLC, 1-877-485-2422 or admin@conservancy.bc.ca; the Abkhazi Garden site manager is listed at volunteer@conservancy.bc.ca):
  1. Price — is there a group or school rate, and do children pay the $10 suggested donation?
  2. Youngest age — is there any minimum age, and are preschool groups welcome?
  3. Capacity — how many children can come at once, and does a group need to book?
  4. Lead time — how much notice does a group visit need, and who books it?
  5. Lunch space — is there anywhere a group can eat, given the Teahouse is a separate business?
  6. Washrooms — are there any on site, and is there a change table?
  7. Rain backup — is there any shelter beyond the summerhouse porch?
