# VERIFICATION - St. Ann's Academy National Historic Site

- **Fields checked:** 78 (venue block 33, three programs' non-null fields, zero image entries)
- **Fields corrected:** 5
  - `venue.hours_notes`: the plain fetch over the secure address returned a September 2023 page. A live read over the plain address shows the site is current, with an August 2026 notice on the home page and a 2026 footer. Hours taken from the Hours of Operation page, which gives Saturday and Sunday 1:00pm to 4:00pm.
  - `programs[1].cost_per_child_cad`: recorded as $5 per person, not per group. The page says "A donation of $5.00 per person is required", so a class of 25 is $125.
  - `programs[1].capacity_min` / `capacity_max`: set to 10 and 30. The Admission page says tours are for groups of 10 or more, the FAQ says a group tour should be no larger than 30. Checked that the minimum went in the minimum field and the maximum in the maximum field.
  - `programs[0]` grade range: the heading says "K-5" and the body says "Recommended for: Grades 2-3, adaptable for Grades K - 5". Recorded as grades 0 to 5 on a grade basis, with both age fields left empty. Not converted to ages.
  - `venue.general_admission_adult_cad`: $5 -> null, after the admission conflict below. Neither page is dated, so per the rule the field goes empty and the disagreement is surfaced to the reader instead.
- **Fields set to null after review:** 3
  - `general_admission_child_cad`, `general_admission_adult_cad` (see the conflict)
  - `has_rain_backup`. One school program station is outdoors and nothing on the site says what happens in rain.
  - `programs[0].capacity_max`. The page says the class splits into two groups but never gives a head count, so no number was invented.
- **Conflicts recorded:** 3
  - Whether there is an admission charge at all: one page says no fee, another says by donation with $5 suggested per adult.
  - Parking cost: three pages give $2 for two hours, $8 per day, and $2 per hour to a $7 daily maximum.
  - Summer opening: the FAQ says daily 10am to 4pm, the Hours page says weekend afternoons only. The Hours page is the maintained one.
- **Authored fields written:** all three on all three programs.
  - `what_children_do` for the school program rests on the three numbered activity descriptions: wood graining with poster paint after examining the woodwork, Chinook phrases and archival photographs, and an outdoor mapping exercise on the grounds. For the guided and self guided visits it rests on the Visitor Information description of the parlours, chapel, carvings, gold leaf, stained glass, Casavant organ, Novitiate garden and 1925 summerhouse.
  - `our_note` rests on the program being free with a facilitator at every station, the outdoor activity and poster paint warning about clothes, the cloakroom, lunch space on request, the $5 being per person on the guided tour, and the repeated warning that rentals can close the inside.
  - `practical_summary` rests on the verbatim washroom and lunch lines from the programs page, the elevator arrangement from the accessibility page, and the instruction that buses park on the street.
- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (geocode_pending, address captured) and a hero image. The school program otherwise clears the program bar with a grade range, a free flag and a note.
- **On the two questions asked:** the site is open to visitors, on Saturday and Sunday afternoons from 1pm to 4pm with weekday visits by appointment, and the grounds are open dawn to dusk. Tours are staffed both ways: the school program has a facilitator at every station, guided group tours are run by staff, and even the self guided route has staff or volunteer docents available to answer questions.
- **On images:** none could be recorded. The secure form of the address does not resolve, so every image on the site is served over an insecure link that a browser will refuse to load on a secure page. The home page photographs are also all under 250 pixels across. The photo gallery images carry proper written descriptions and would be usable if the site is ever secured. This is stated in gaps.
- **Confidence:** medium to high on the facts, which come from a live read and were re-checked string by string in step 3. Lower on presentation, because the record has no picture and three of their own pages disagree with each other on price and hours.
- **Recommended follow up by phone or email** (250-953-8829, office cell 250-883-1824, or stanns.academy@gov.bc.ca), in priority order:
  1. Confirm whether anything is charged at the door, since their pages disagree
  2. Youngest age they will take, and whether the program works for a preschool or daycare group
  3. Maximum class or group size for the school program
  4. How much notice is needed to book
  5. Confirm lunch space, which is only available on request
  6. What happens to the outdoor mapping station in heavy rain
  7. Confirm the parking price and free parking for booked appointments, and where the bus waits
