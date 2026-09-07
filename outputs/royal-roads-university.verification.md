# VERIFICATION — Royal Roads University

- **Fields checked:** 45 (33 venue, 2 programmes spot checked field by field, 3 images, location)

- **Fields corrected:** 4, all from one finding
  - `programs[0].lead_time_days`: 3 -> 10. A plain fetch of the booking form returned an older copy reading "Please choose a weekday at least three business days in advance." A live, cache-bypassed read of the same address returns a longer, different form reading "Please select a weekday at least 10 business days from today." The live version is the one recorded and the discrepancy is written up in gaps.
  - `programs[0].description`: rewritten to the live form, which also asks the anticipated number of participants, how long the group has available, which campus, and how the group will travel, listing school or charter bus.
  - `programs[0].practical_summary`: corrected to 10 business days.
  - `programs[0].our_note`: rewritten around the finding below.

- **Key finding from the live form.** When the form asks the age of the group, the options are grades 9 to 10, grades 11 to 12, post secondary students, adults or community group, and mixed group. There is no option below grade 9. That is the only age signal anywhere on the site.

- **Fields left null after review, deliberately:** 5
  - `grade_min` / `grade_max` / `age_basis` — the form's option list is not a published eligibility rule, so no range was recorded. It is stated plainly in the note a director reads and in gaps instead.
  - `hosts_daycare_groups` — left unanswered rather than set to no. The form's lowest option starts at grade 9, but the site never refuses younger groups and offers "mixed group" and "other".
  - `is_free` and every cost field — the site never says whether a group tour is charged or free. This is the single field that keeps the record below the publishable bar, and it should be filled by a phone call rather than a guess.
  - `duration_min` — the form's time options describe the group's availability, not the length of the tour.
  - `bus_parking` — the form expects coaches but no page describes where one parks.

- **Conflicts recorded:** 0. The only disagreement was between two versions of the same page over time, which is a staleness problem rather than two pages a director might both encounter, so it went to gaps with the full audit trail.

- **Scope decision.** Hatley Park Formal Gardens and the paid Hatley Castle walking tour sit on this campus but are run and published separately on hatleypark.ca and already have their own record. None of that content was copied here. This record covers only what Royal Roads itself offers a visiting group: the guided campus tour and the standing invitation to ask about the Farm at RRU. The relationship is stated in the first line of gaps and in the venue description.

- **Authored fields written:** `what_children_do` and `our_note` and `practical_summary` on the campus tour; `our_note` and `practical_summary` only on the Farm.
  - `what_children_do` on the campus tour rests on the tour page's own description of what the tour takes in: the oceanfront campus, the sustainable gardens, the university buildings and the grounds of Hatley Park National Historic Site.
  - It is deliberately null on the Farm visit, because the site describes what the Farm is but never describes a visit, and inventing one would be guessing.
  - `our_note` on the campus tour rests on the form's age options, the absence of any published price or length, and the campus-wide pay parking policy.
  - `practical_summary` on both rests on the booking route plus the list of things the site does not answer.

- **Images:** 3 recorded, all on royalroads.ca, all confirmed to return HTTP 200 and image/jpeg, all present on the page recorded in `found_on_url`. All three alts are the site's own and are genuinely descriptive, so `alt_source` is `site` throughout. No captions, no rights notes; the site prints no credit beside these photographs. The home page publishes no open graph image and its photographs are all of adult students in classrooms, so the hero is the campus path photograph from the Colwood campus page. Query strings were stripped and the images still resolve.

- **Location:** `geocode_pending`. The address 2005 Sooke Road, Victoria, BC V9B 5Y2 is published in the site footer. No coordinates are published anywhere on the domain, so the pin was left for the geocoding backfill rather than hand placed.

- **Retrieval note:** several pages on this site return body text to a plain fetch but drop every link, and a few return nothing at all. The booking form address, the Farm links and the image URLs were read in a browser. This is recorded in gaps so a fetch-only re-run is not mistaken for a thinner site.

- **Meets minimum viable record:** no. Missing `lat`/`lng`, which the backfill will supply, and missing any cost field or `is_free` on both programmes, plus an age basis and range. The tour cost is the field to chase.

- **Confidence:** medium. What is here is solid and was verified live, but a large institutional site publishes almost nothing about what a group tour costs, how long it lasts or who it will take, and the one real age signal sits inside a form rather than in a policy.

- **Recommended follow up by phone or email** (250.391.2511, or the tour request form), in priority order:
  1. **Price.** Is a group campus tour free or charged, and is there a different answer for schools and for community groups.
  2. **Youngest age.** Will they take a primary class or a daycare at all, given their form starts at grade 9, and what would a guide show them.
  3. **Capacity.** How many can come on one tour, and can a full class be split.
  4. **Lead time.** Is 10 business days a hard minimum or a preference.
  5. **Lunch space.** Is there anywhere indoors or sheltered for a group to eat.
  6. **Washrooms.** Where on the tour route are they.
  7. **Rain backup.** The tour is a walk outdoors; ask what happens in heavy rain.
  8. **Coach parking.** Their form expects a school bus but no page says where one waits, and every lot is pay parking around the clock.
