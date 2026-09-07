# VERIFICATION: Kelp Reef Adventures

- **Fields checked:** 48 (venue block 33, three programs against the home page, 2 images, location)

- **Fields corrected:** 0.

- **Fields set to null after review:** 4
  - `venue.has_washrooms` left null. The location page mentions public washrooms available April to October, but that sentence describes a neighbouring business, the Greater Victoria Harbour Authority, not Kelp Reef. It is kept as a facility note with the attribution intact.
  - `venue.hosts_school_groups` left null. The site never mentions schools, groups or group rates at all, so neither true nor false is supportable.
  - `venue.has_rain_backup` left null. Nothing on the site describes shelter or what happens to a booking in bad weather.
  - `family-kayak-tour.cost_per_adult_cad` left null. The site publishes only the $40 children's rate for this tour. It calls that half price, which implies $80 for an adult, but implying is not publishing.

- **The age question, which was the point of this record.** Every tour has a floor. The three hour tour says "Children 12 years and older", the two hour tour says "Children 7 years and older", and the family tour prices "Children 7-12 years old are $40". There is nothing on the site for a child under 7. `hosts_daycare_groups` is therefore set to **false**, which the schema allows only when the site gives a reason, and here it gives an explicit minimum age of 7. `youngest_age_welcomed_years` is 7. A daycare or preschool group cannot use this venue.

- **Prices re-confirmed live:** the home page was re-read in a browser after the JSON was written. "3 HOUR KAYAK TOUR $120.00", "2 HOUR KAYAK TOUR $80" and the two age lines were all unchanged from the fetched copy.

- **Per person, not per group:** $120 and $80 are per paddler, so they are recorded as `cost_per_child_cad` and `cost_per_adult_cad` at the same figure rather than as a group cost. The $40 on the family tour is the children's rate only.

- **Conflicts recorded:** 0. The site is small and consistent.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on the published gear list, the safety briefing and paddling lesson before every tour, the routes described for each tour, and the double kayak arrangement on the family tour.
  - `our_note` rests on the minimum ages, the tour lengths, the six mile distance, the seasonal 4pm only family slot, and the fact that no adult price is published for that tour.
  - `practical_summary` rests on there being no indoor space described, no washrooms of their own, and no group rate, group size or notice period anywhere on the site.

- **Location:** `geo_source` is `geocode_pending`. The address published is "Fishermanʼs Wharf, Dock A, 1 Dallas Rd. Victoria, BC, Canada" with no postal code. Both the home page and the location page were checked in a browser for a Maps embed, JSON-LD coordinates and Open Graph latitude tags, and there are none. The only iframe on the location page is the booking cart. No pin was hand placed, so `lat` and `lng` are null.

- **Images:** 2 entries, both on kelpreef.com, both confirmed present on the pages recorded in `found_on_url`. Neither carries alt text on the site, and the only title attributes on other site photos are the camera default "OLYMPUS DIGITAL CAMERA", so both alts are `generated` and were written after opening each image in a browser. No captions invented and no rights notes recorded.

- **Age of the site:** the most recent blog post announces being open for the 2018 season, and the theme dates from 2014. The tour information reads as maintained, since it is the same in a live browser as in a fetch, but the gap is flagged so a director knows to confirm times and prices on the phone.

- **Meets minimum viable record:** no. All three programs have an id, name, `age_basis` of years with a published minimum age, `comes_to_you`, a cost and an `our_note`, and there is a hero image with alt. The missing required fields are `venue.lat` and `venue.lng`, which are pending geocoding from the published street address.

- **Confidence:** high on the tours, the ages and the prices, which are stated plainly and were re-checked live. Low on anything to do with groups, because the site simply does not address them.

- **Recommended follow up by phone or email** (250-386-7333 or kelpreefadventures@gmail.com), in priority order:
  1. Confirm the tour times and prices are current, since the site's newest post refers to 2018.
  2. Adult price on the Family Tour.
  3. Whether a whole group can be taken as a block, and whether there is a group rate.
  4. Maximum number of paddlers on one tour and how many guides go out.
  5. How far ahead a summer booking needs to be made.
  6. Whether there are washrooms on the dock outside the April to October window.
  7. What happens to the booking if the weather turns on the day.
