# VERIFICATION — Metchosin Schoolhouse Museum

- **Fields checked:** 63 non-null values across the venue block, 2 programs and 4 images, each re-read against the page it came from on 2026-09-03.
- **Fields corrected:** 0 after the JSON was written. Every quote was re-tested against the live page in a browser and all passed, including the availability line, the snack and washroom line, the wheelchair line and the activity list.
- **Decisions taken during extraction, recorded so they can be audited:**
  - `website` uses the bare host rather than the www host from the tracker. The www host returns an empty body to a fetch; the bare host serves the full page.
  - `capacity_max` of 12 sits on the small group tour only. The 12 visitor maximum is stated on the tours page, not the field trip page, so the field trip carries it in gaps instead of as a number.
- **Fields set to null after review:** 3
  - `duration_min` on both programs. The site gives "30, 45, or 60 minutes for each museum, considering grade level", which is a range chosen by grade, not a single published length. It is described in the program text instead.
  - `has_rain_backup`. The museum is indoors but the site never addresses a wet weather plan for the outdoor part of a two museum visit.
  - `age_basis` and both range pairs on both programs. Nothing on the site publishes an age or grade range; the inquiry form asks the teacher for the grade level.
- **Conflicts recorded:** 1. The home page says admission to both museums is free, and the tours page says a second day costs extra without naming a figure. Neither page carries a visible date for the claim, so the cost fields on the tour are left null.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on both programs.
  - `what_children_do` rests on "Dip pen and ink cursive writing exercise, button spinning, artifact hunt, and interpretation of museum displays." and on the tours page wording about the dip pen and button spinner.
  - `our_note` rests on the split class arrangement, the Thursday and Friday September to June availability, the 12 visitor maximum, and the fact that the only booking route is an inquiry form.
  - `practical_summary` rests on the wheelchair line, the snack, lunch and washroom sentence, and the missing bus parking, adult ratio and youngest age.
- **Meets minimum viable record:** no. `lat` and `lng` are pending geocoding, and no program has `age_basis` plus a range because the site publishes neither ages nor grades.
- **Confidence:** high on the price, days, months, address, hours and accessibility, all of which are stated plainly and were re-read in a browser; medium overall only because the two museums are described together and the ages are unstated.
- **Recommended follow up by phone or email** (no phone or email is published, so this means the inquiry form), in priority order:
  1. The youngest age they will take, and whether a preschool or daycare group is welcome.
  2. Maximum class size, given the schoolhouse holds 12 visitors at a time.
  3. How many adults have to come.
  4. How much notice they need to book a Thursday or Friday.
  5. What a small group tour costs, and what a second day at the Pioneer Museum costs.
  6. Where the group eats the snack or lunch, and whether it is under cover.
  7. Bus parking and drop off on Happy Valley Road.
