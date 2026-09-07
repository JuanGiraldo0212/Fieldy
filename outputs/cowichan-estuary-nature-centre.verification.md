# VERIFICATION: cowichan-estuary-nature-centre

- **Fields checked:** 96 (33 venue, 3 programs x ~20 populated, 4 images)

- **Fields corrected: 6**
  - `venue.hours_notes`: "Sat, Sun and Stat Holidays: 1 – 3 pm" -> "Saturday and Sunday 11:00 to 15:00. Closed Monday to Friday and holidays." Reason: the first value came from a `web_fetch` of the home page that served a cached 2024 version. The live page says Summer / Fall Hours: Saturday & Sunday 11am – 3pm, closed Monday to Friday and holidays.
  - `programs[1]` (Barnacle Buddies) `days_offered`: [1] -> [2]. Reason: the fetched page was the Winter 2025 timetable (Mondays 11:00-12:00, January 2025 dates). The live page says Tuesdays.
  - `programs[1].time_slots`: ["11:00"] -> ["10:30"], same reason.
  - `programs[1].months_offered`: [1,2] -> [10,11,12]. Reason: live page runs 6 October to 15 December 2026.
  - `programs[1].age_min_years` / `age_max_years`: null -> 0 and 5. Reason: the live page states ages 0 to 5; the cached page stated no ages.
  - `programs[1].cost_per_child_cad`: null -> 10. Reason: the live page states $10 drop in per session; the cached page had no price.

- **Fields set to null after review: 4**
  - `venue.general_admission_child_cad` and `general_admission_adult_cad`. The cached home page said the centre admits by donation. That sentence is not on the live site, so it is not usable.
  - `venue.has_washrooms`. The only washroom mention on the whole site is on the summer camp page, saying campers must be able to use the washroom independently. That is about the child, not about the facility, so it was set back to null.
  - `programs[0].capacity_max`. The $250 price cap at 25 students is a price ceiling, not a stated group limit.

- **Conflicts recorded: 0.** The differences found were between a stale cached fetch and the live site, not between two live pages, so they belong in gaps rather than in conflicts.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` for all three programs.
  - Estuary Explorers rests on the program page: hands on activities, up close experiences, engaged discussion, exploring how animals use shape, size, colour and behaviour, plus the $10 per student and $250 cap.
  - Barnacle Buddies rests on the live page: 1 hour drop in, ages 0 to 5 with guardians, guided group activity, craft, $10 a session.
  - Nature Seekers rests on the live page: six consecutive Fridays, ages 6 to 12, outdoor activities and guided observation, waterproof field notebook, 12 places, $150 a child.

- **Meets minimum viable record: yes.** Venue id, name, address, latitude, longitude, category and date are all present, there is a hero image with alt text, and all three programs carry an age or grade basis with a range, a cost and an authored note.

- **Confidence: high** for the three programs and the location, which were all read from the live DOM. Medium for the practical facilities, because the site says almost nothing about them.

- **Recommended follow up by phone or email** (info@cowichanestuary.ca; the phone is only checked once a week):
  1. Price for a general or drop in group visit. Nothing is published, and the by donation line is no longer on the site.
  2. Whether the $10 Barnacle Buddies drop in covers the child, the adult or both.
  3. Whether they take daycare groups as groups, and what the youngest age is for a booked group rather than a parent and tot session.
  4. Largest class the Thursday school program can take, and whether a class of 28 gets split.
  5. How much notice they need for a Thursday booking.
  6. Washrooms, and whether there is anywhere to eat a packed lunch.
  7. Rain plan for the school session, and whether it is indoors, on the trail, or both.
  8. Coach parking at Hecate Park.
