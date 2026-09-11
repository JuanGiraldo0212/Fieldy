# VERIFICATION — Rathtrevor Beach Nature House

- **Fields checked:** 175 (33 venue, 46 program keys across three programs, 2 image records, location, provenance)

- **Operator check, done first.** The tracker URL `www.naturehouse.ca` redirects to `https://www.discoverparks.ca/nature%20house`. This is the **same operator** as the two nature houses already in the catalog: Discover Parks, a project of the BC Parks Foundation. The Miracle Beach record was read in full before any extraction here, and its documented quirks were re-tested rather than assumed:
  - *JS-only rendering* — confirmed. A plain fetch of the Rathtrevor location page returns `Loading...` and no content. All facts here were read after waiting for the render in a browser.
  - *Broken activity search* — confirmed and now confirmed to be worse than documented. `/activities?location=Rathtrevor+Beach+Park` returns "Sorry, no results found." So does `/activities` with **no filter at all**. The Things to Do panel on the Rathtrevor location page renders empty. The one live Rathtrevor activity page was reached through the Discover Parks Ambassadors page instead.
  - *Unpublished 404 programme pages* — confirmed for Rathtrevor in a different form. Seven addresses following the naming pattern used for the other two nature houses were probed in the browser (including `self-guided-dpa-other-rathtrevor-visit-the-heart-of-the-park-rathtrevor-beach-nature-house`, `rathtrevor-spring-school-programs`, `community-group-visit-to-rathtrevor-beach-park`, `jerrys-rangers-at-rathtrevor`). All seven returned 404. The equivalent Goldstream and Miracle Beach addresses returned 200 in the same run, which proves the probe works and that Rathtrevor genuinely has no such page.

- **How this record was kept distinct.** Nothing was copied from the Goldstream or Miracle Beach records. Concretely:
  - `general_admission_child_cad` / `general_admission_adult_cad` were **not** set to 0. The "Entry to the Nature House and participation in all activities is free" sentence sits under the *Miracle Beach* heading on the shared page, not under Rathtrevor's. Rathtrevor's own section says nothing about admission.
  - `booking_email` was **not** filled with the Goldstream Nature House address. BC Parks' Rathtrevor page, unlike its Goldstream page, gives no Nature House contact and no school-group route.
  - No "Visit to the Nature House" program was created. Goldstream and Miracle Beach both have one because their pages describe what is inside. Rathtrevor's section describes nothing inside the building and lists it as closed.
  - The three programs recorded here (nature walk, Jerry's Rangers, evening presentation) come from a Rathtrevor-only activity page with Rathtrevor-only meeting points, times and a Rathtrevor-only meet-up coordinate.
  - The hero image is the photograph sitting directly under the Rathtrevor heading, opened and looked at in a browser: it is this building, with a "NATURE HOUSE" sign, not the Miracle Beach interior used on the other record.

- **Fields corrected:** 4
  - `lat` / `lng`: park centroid `49.322571, -124.26199` -> meet-up pin `49.321664, -124.269065`. The park point is what the operator publishes for the location record and what BC Parks uses to centre its own map; the programme page publishes a separate `meetupLocation` Point whose instructions name the Nature House. About 500 m apart. Both figures are named in `gaps`.
  - `days_offered` on the nature walk: initially `[1,2,3,4,5,6,7]` -> `[1,2,4,5,6,7]`. Their text is "Monday, Tuesdays, Thursdays, Fridays, Sundays and Saturdays", i.e. no Wednesday.
  - `languages`: `["English"]` -> `null`. The Miracle Beach record could support English from its audio-tour copy. Rathtrevor's pages state no language. The activity data has a field labelled `language` whose value is "Walk-in", which is clearly mislabelled and was not used.
  - `wheelchair_accessible`: `true` -> `null`. The accessibility text covers campsites, showers, flush toilets, beach access, many walking trails and day-use parking stalls. It says nothing about the trail to the Nature House or the building, and the programmes meet at the Nature House.

- **Fields set to null after review:** 5 — `general_admission_child_cad`, `general_admission_adult_cad`, `languages`, `wheelchair_accessible`, `address` (no street address is published anywhere).

- **Evidence quotes:** all three re-checked character for character against the live rendered page on 2026-09-10. All three matched.

- **Conflicts recorded:** 1 — whether anything is running here. The shared nature house page says "Now closed. See you in Summer 2027!"; the Ambassadors index labels the drop-in programmes "Ended"; the programmes' own page carries no such label and shows "Current status: Open". The director-facing note gives her all three answers in plain words and tells her to ring.

- **Authored fields written:** `what_children_do` on two of three programs, `our_note` and `practical_summary` on all three.
  - `what_children_do` is **null for Jerry's Rangers** on purpose. The site names the topics but never describes what a child does, and inventing a plausible session would be the exact error this pipeline is trying to avoid.
  - The nature walk's rests on "moderate-paced exploration along designated paths", "hour-long adventure" and "Look for Discover Parks Ambassadors in bright orange shirts!"
  - The evening one rests on "Bear Safety Talk, Park Jeopardy", "interactive experience" and the orange tent in the field.
  - `our_note`s rest on: the hour with no seating and no booking against a 25 cap; the age band starting at five; the 19:00 start and the beachside playground beside the meeting spot.

- **Meets minimum viable record:** no — `venue.address` is missing, and no street address is published for the Nature House or the park. Everything else clears the bar: coordinates, category, a hero with alt, and Jerry's Rangers carries id, name, `age_basis` "years" with 5 to 12, `comes_to_you`, `is_free`, and `our_note`.

- **Confidence:** medium. The programme facts are strong: they come from one dated, structured page on the operator's own site and every quote was verified live. The uncertainty is entirely about whether any of it will happen again, because the building is listed as shut until Summer 2027 and there is no phone number or email to ask.

- **Recommended follow up, in priority order.** There is no published contact for this venue at all, which is itself the first thing to fix. The nearest routes are the park operator, RLC Park Services, at office@rlcparks.ca or 1-250-474-1336, and BC Parks at parkinfo@gov.bc.ca.
  1. Is the Nature House really shut until summer 2027, and will the summer drop-in programmes run in 2027?
  2. Will they take a booked group, or is it strictly turn up on the day against the 25 cap?
  3. Youngest age. Jerry's Rangers says 5 to 12; is there anything for under-fives?
  4. How long does a Jerry's Rangers session run?
  5. Lunch space for a group, and whether the picnic shelters can be held.
  6. Which toilets are nearest the Nature House.
  7. Rain backup, given the building is closed and all three programmes are outdoors.
  8. Whether the trail from parking lot 1 to the Nature House is step free, and where a bus can park.
