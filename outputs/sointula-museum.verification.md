# sointula-museum.json

VERIFICATION

- **Fields checked:** 61 (33 venue fields, the non-null fields of all three programs, and all four image entries). Every price, hours, accessibility and directions line was re-read against a second, cold fetch of the Plan Your Visit and Learn With Us pages, and all seventeen quoted strings were confirmed word for word on the live pages.
- **Fields corrected:** 4
  - `programs[school-group-tour].cost_per_child_cad`: 6 -> 5. Their two pages disagree. The Plan Your Visit page ("School groups are $5.00/child with 2 accompanying adults free.") was last updated 2024-03-21 and the Learn page ("Tour cost is $6.00 per youth and includes two free adults") 2024-03-20, so the more recent page's figure is recorded and the disagreement is in `conflicts`.
  - `programs[school-group-tour].source_url`: the Learn page -> the Plan Your Visit page, so the evidence quote matches the price actually recorded.
  - `venue.hours_notes`: the body text of the Plan Your Visit page said mid-May to September 30 daily, and by appointment the rest of the year. The panel at the foot of every page gives June 1 to September 15 daily and then Tuesdays, Thursdays and Saturdays. The footer version is recorded because it carries the winter schedule the body text does not, and the disagreement is in `conflicts`.
  - `venue.name`: kept as "Sointula Museum". The society behind it is the Sointula Museum and Historical Society; the museum itself is named as in the tracker throughout the site.
- **Fields set to null after review:** 3
  - `programs[guided-group-tour].cost_per_adult_cad` — one page prices this tour at $6.00 per person flat, the other at $6.00 per youth and $8.00 per adult. Both agree on $6.00 for a young person, so only that is recorded; the adult figure is left blank and the disagreement is in `conflicts`.
  - `venue.has_rain_backup` — the whole visit is indoors, but the site never addresses weather or shelter, so this is not asserted. The indoor nature of the visit is carried on each program instead.
  - `programs[guided-group-tour].capacity_min` — "Ideal for groups of 5 or more" is a recommendation, not a stated minimum, so it sits in the description rather than as a number.
- **Judgement calls a human should look at:** `general_admission_adult_cad` is recorded as 5 from "Admission to the museum is by donation (suggested minimum is $5.00/person)". That is a suggested donation, not a ticket price, and `is_free` is left blank on every program because by-donation is not free. `has_lunch_space` is recorded as false on the strength of "There is no food or drink allowed in the museum."; the site names no alternative place to eat.
- **Conflicts recorded:** 3 (school group price, general group tour adult price, opening season and hours).
- **Authored fields written:** all three, on all three programs.
  - `what_children_do` rests on the Exhibitions and Explore pages: three exhibition rooms, Finnish settlers' belongings, the Co-op store counters, photo albums, the Media Centre seating area with twelve self-guided videos, the Rust Room's 1905 Pulteney Point foghorn and the first bilingual switchboard in B.C., plus the Learn page's detective challenge, clues and colouring certificate.
  - `our_note` rests on the published tour lengths (about an hour for a class, 45 minutes for a group tour), the accessibility note that the Rust Room is opened by staff through a downstairs door, the winter schedule of three afternoons a week, the no food or drink rule, and the directions line that has you turning left off the ferry for 350 metres.
  - `practical_summary` is generated from the washroom, ramp, stroller and parking lines against the gaps: no lunch space, no bus parking, no group size, no notice period.
- **Meets minimum viable record:** no. The venue block is complete (address, coordinates, category, hero image with alt), but no program clears the bar: the site publishes no age or grade range anywhere, so `age_basis` and both ranges are null on all three programs. The tours page says only "a teacher with a class of elementary or highschool students, a homeschool, or just a group of people interested in learning more about Malcolm Island", which is not a range. One phone call fixes it.
- **Confidence:** medium-high. The site is a plain WordPress build that fetches fully, and prices, hours, accessibility, parking and directions are all stated in the museum's own words; the deductions are the two price disagreements between their own pages and the absence of any published age range. The four image alts were written from file names and printed captions rather than from looking at the pictures, since no browser was used in this run.
- **Recommended follow up by phone or email** (250-230-9650, call or text, or info@sointulamuseum.ca; the manager is manager@sointulamuseum.ca):
  1. Price — is a school class $5.00 or $6.00 a child, and do extra adults pay $8.00?
  2. Youngest age — are preschool and daycare groups welcome, and is there a youngest age for a guided tour?
  3. Capacity — how many children can be in the building at once, and does a class get split into groups?
  4. Lead time — how much notice does a booking need, especially outside the summer when the museum is open three afternoons a week?
  5. Lunch space — where can a group eat, given no food or drink is allowed inside?
  6. Washrooms — how many, and is there a change table for the youngest children?
  7. Rain backup — not an issue indoors, but ask whether there is anywhere sheltered to wait outside the door before opening time.
  8. Ferry — which sailings suit a day trip, and does the museum have a crossing that groups usually take?
  9. Rust Room — can the downstairs door be open for your visit, and are stairs the only way down to the foghorn?
