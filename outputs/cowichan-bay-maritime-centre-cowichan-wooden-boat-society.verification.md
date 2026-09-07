# VERIFICATION - cowichan-bay-maritime-centre-cowichan-wooden-boat-society

- **Fields checked:** 62 (33 venue, 4 program blocks, 3 images, plus provenance)
- **Fields corrected:** 3
  - `venue.hosts_school_groups`: null -> true. The children's programs page names Field Trips as one of the things the Centre runs, and the boatbuilding course page refers to teaching school children the art of boat building in their shop. That is more than silence.
  - `programs[3].cost_per_adult_cad`: was first written as `cost_per_child_cad` 2000. The $2,000 boatbuilding fee is a per-seat fee on a course with no published minimum age and no school framing, so recording it as a per-child rate would have been wrong on both counts.
  - `venue.hours_notes`: was first written as "Open 10-4 Wednesday-Sunday" -> null, because the site gives three different answers and none of the pages is dated. Recorded as a conflict instead.
- **Fields set to null after review:** 4
  - `venue.has_lunch_space`. The mezzanine is a paid hourly rental, not a room a visiting group may use, so a true here would have been misleading. The description is kept as a facility note.
  - `venue.has_rain_backup`. Part of the site is indoors and part is the pier, and the only weather statement is "Pier closed when Icy/Snowy". Kept as a facility note, not turned into a yes.
  - `venue.has_washrooms`. Never mentioned anywhere. Not inferred from photographs.
  - `programs[1].format`. Field trips are named but never described, so a format would have been guessed.
- **Conflicts recorded:** 1, on opening days.

## Prices re-read from the live DOM
All price-bearing pages were re-opened in a browser after the JSON was written, not taken from the fetch cache.
- **Admission.** Live footer reads "Admission $5 adult, $3 child". Confirmed on the home page and on the boatbuilding course page. No year is stated, no group rate, no school rate. Recorded as venue general admission and as the cost of the self-guided visit. **It is not admission by donation** - the brief flagged that possibility and the site does not support it.
- **Junior Captains Camp.** Live DOM reads "Camps are $275/week with family/sibling discounts available." That is **per child per week**, not per group: the registration instructions ask for the child's name and the weeks in the payment memo. Recorded as `cost_per_child_cad` 275. The sibling discount is not priced, so it sits in the extra fees note.
- **Boatbuilding course.** Live DOM reads "Cost: $2,000. A $1,000 deposit is due at time of registration." Per seat. Deposit recorded as required, with the refund terms and the 1 September balance deadline quoted verbatim.
- **Workshop bench rates** ($12 minimum, $22 half day, $35 full day, $400 monthly) are members-only shop time, not a children's offering, so they were not made into a program.

## Ages and capacity
- Camp: "Camps are geared towards kiddos ages 5-9" with "5 year-olds must have completed one year of kindergarten". `age_basis` is `years`, 5 to 9. One listed week, Camp 5, is marked "(Ages 9-12)"; that is a single week's variation and is described rather than widened into the range.
- Because the age floor of 5 applies to the summer camp only and not to visiting the museum, `venue.youngest_age_welcomed_years` is null and `hosts_daycare_groups` is **null, not false**. The site gives no reason to exclude under-fives from a visit.
- No capacity figure is published for any children's offering. The 65 guest figure belongs to the mezzanine rental, not to a visit, so it was not recorded as `capacity_max`.

## Schedules already passed
- All eight Junior Captains camp weeks listed for 2026 ran between 6 July and 4 September, and seven are marked FULL. As of this check the season has run. Recorded in gaps rather than projected into next year.
- The boatbuilding course gives "January 11-15 and January 18-22" with **no year**, while the payment deadline on the same page is 1 September, which has just passed. Both recorded, neither resolved.
- The home page still advertises the Wooden Boat Festival for Saturday 27 June 2026, which has gone by. Recorded in gaps.

## Evidence quotes
Each re-checked live, word for word:
- "Admission $5 adult, $3 child" - present.
- "host to many different children's events and activities, including our popular 'Len Mayea Boatbuilding Booth', Junior Captain Camps, Field Trips" - present, 20 words, contiguous.
- "Camps are $275/week with family/sibling discounts available." - present.
- "$2,000. A $1,000 deposit is due at time of registration." - present.

## Images
Three entries, one hero. The og:image on every page is the Centre's logo rather than a photograph, so it was skipped and the hero taken from the home page banner instead; noted in gaps. Every photograph on the site carries a filename in place of alt text, so all three alt lines were written after opening the images in a browser and looking at them, and `alt_source` is `generated` on all three. Query strings were stripped and each URL was confirmed to still resolve at full size without them: 2500x1667, 2048x1380 and 2500x1873. All three sit on the site's own Squarespace CDN and were present on the `found_on_url` recorded. No captions were invented. No rights notes: the only copyright text on the site is a site-wide footer line, which does not count as a photo credit.

## Location
No coordinates are published anywhere: no map iframe, no JSON-LD GeoCoordinates, no og:latitude. The street address is published in the footer of every page and is recorded. `lat`/`lng` are null and `geo_source` is `geocode_pending`. No pin was hand-placed.

## Authored fields
- `what_children_do` on the self-guided visit rests on the home page's own description of the three pods: dugout canoes, the ship's helm, pulleys, knot tying, the kids boatbuilding booth where a child builds a boat to take home, and the children's interactive tug on the patio. On the camp it rests on the camp page: beach, crabbing, rowing boats, the search and rescue boat, basic woodworking and nautical games. It is null on the field trip and the boatbuilding course, because neither is described in those terms.
- `our_note` on each program rests on: the contradicting opening days and the outdoor pier for the visit, the complete absence of published detail for the field trip, the whole-week rule and full payment at registration for the camp, and the $2,000 fee with no age floor for the course.
- `practical_summary` on each rests on the facility fields plus the gaps list.

- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng` only, pending geocoding. The programs clear the bar: the camp has an age basis with a range, a cost and an our_note.
- **Confidence:** high. The site is actively maintained, prices were confirmed from the live DOM rather than a cache, and the one real inconsistency is captured as a conflict rather than quietly resolved. The weak spot is the field trip, which is named but not described at all.

## Recommended follow up, in priority order
1. What a booked field trip costs and whether there is a group or school rate on the $5 and $3 admission.
2. Youngest age they will take for a booked group visit, and whether the boatbuilding booth runs for one.
3. How many children they can take at once, and how many adults have to come.
4. How much notice they need.
5. Somewhere for a group to eat that is not a paid mezzanine rental.
6. Washrooms, which are not mentioned anywhere on the site.
7. What happens in bad weather beyond the pier closing for ice and snow, and where a bus can drop off and park.
