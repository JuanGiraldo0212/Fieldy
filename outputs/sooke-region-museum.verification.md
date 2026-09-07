# VERIFICATION - Sooke Region Museum

- **Fields checked:** 62 (venue block 33, two programs' non-null fields, three image entries)
- **Fields corrected:** 7. All seven were caught by re-reading the price page live rather than through a plain fetch.
  - `programs[0].cost_per_group_cad`: 100 -> 200. A plain fetch of the school tours page served a 2023/2024 version reading "Cost $100/class." The live page reads "Cost $200 per visit." with a single class discount code bringing one class to $100.
  - `programs[0].capacity_max`: 40 -> null. The stale page said "We can accommodate up to 40 students at one time." The live page says "We can accommodate 2 classes per visit" and gives no head count. The live page's "groups are kept to a maximum of 8" is the size of each activity group, not a booking limit, so it was not used as a capacity and is described in words instead.
  - `programs[0].grade_max`: 8 confirmed, but the wording changed from "K-Grade 8" to "Kindergarten to Grade 8". Recorded as grades 0 to 8 with a grade basis, not converted to ages.
  - `programs[0].months_offered`: null -> [4, 5, 11, 12], from "spring tour dates in April and May" and "fall tours (in November, December)".
  - `programs[0].days_offered`: [2,3,4,5] -> null. The stale page said Tuesday to Friday. The live page gives only a list of specific dates, so the weekday pattern is no longer published and was not inferred from the dates.
  - `programs[0].time_slots`: null -> ["09:45"], from "School tours start at 9:45am with a welcome circle, ending by 12pm." `duration_min` set to 135 from the same sentence.
  - `venue.hours_notes`: replaced the covid era holiday hours that a fetch of the www host returned with the current September to May schedule from the Visit page.
- **Fields set to null after review:** 4
  - `capacity_max` (see above)
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`. The school tour has children eat snacks they bring, but no room is named and no washroom is mentioned anywhere on the site. Not inferred.
  - `chaperone_ratio`. The site says chaperones move between stations with the students and are important, but never gives a number.
- **Conflicts recorded:** 1
  - The Learn page says fall booking opens in September 2025 and the School Tours page says September 2026. The School Tours page is the one they keep current.
- **Authored fields written:** all three on both programs.
  - `what_children_do` for the school tour rests on the activity descriptions published in full on the school tours page: bannock cooked over the fire and eaten with jam, butter making and tasting, washing clothes by hand, flower pounding and tree ring prints, artifact handling, hand carders and drop spindles, the Forestry Path walk, and Aunt Tilly greeting Kindergarten to Grade 5 in Moss Cottage.
  - `our_note` for the school tour rests on the price being per visit for two classes with a single class code at $100, chaperones and teachers not being charged, and the 9:45 to noon window with children bringing their own snacks.
  - `practical_summary` rests on the free parking line from the Visit page plus the missing washroom, lunch and rain fields.
- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` only, marked geocode_pending with the full address captured. The school tour program itself clears the program bar.
- **Confidence:** high for the school tour, which was read live and re-checked live in step 3 with every quoted string matched against the page. Low for the group visit program, which has no published price or size.
- **Recommended follow up by phone or email** (250-642-6351 or programs@sookeregionmuseum.ca), in priority order:
  1. What a group outside Kindergarten to Grade 8 pays, and whether daycare groups are taken at all
  2. Youngest age they will take
  3. Maximum head count for a booking, since only the per activity group of 8 is published
  4. How far ahead the fall list opens and how quickly it fills
  5. Whether there is an indoor room for lunch if the weather turns
  6. Washrooms
  7. What happens to the outdoor stations in heavy rain
  8. Where a bus parks and whether it can turn on site
