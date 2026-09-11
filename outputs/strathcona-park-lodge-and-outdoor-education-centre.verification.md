VERIFICATION
- Fields checked: 32 venue fields, 4 programs, 5 images, 1 conflict. Every evidence quote was re-read on the live school programs page in a browser, not from the fetch.
- Fields corrected: 4
  - venue.booking_email: the youth questions page gives programs@strathcona.bc.ca, the school programs page gives programs@strathconaparklodge.com. The school programs page is the more recently modified of the two (November 2025 against February 2025), so its address is recorded and the disagreement is in conflicts.
  - venue.lat / venue.lng: geocoded to the lodge on the Gold River Highway at 49.89219, -125.65294, not to the postal address. The postal address is a P.O. box in Campbell River and geocoding the street line alone returned a point on the highway 30 km away, near the city. The recorded point sits on Upper Campbell Lake, which matches their own statement that the lodge is 5 km before the Buttle Lake park entrance.
  - programs[*].cost: every cost field was left null. Their teachers section states pricing is per participant and includes meals, accommodation and instructional activities, but no dollar figure appears anywhere. A live check confirmed the character "$" does not appear on the school programs page at all.
  - programs[1] and [2].chaperone_ratio: recorded as one adult per ten children, but flagged in gaps as our reading of their instructor ratio line rather than a stated chaperone rule.
- Fields set to null after review: 5
  - age_basis, age_min_years, age_max_years, grade_min, grade_max on all four programs. No age or grade range is published for school programs anywhere on the site. The 12 to 17 range belongs to their summer camps, which are individually booked, and was not carried across.
  - programs[*].capacity_max. The figure of 180 students describes how many are on the property in a week, not a per booking limit.
  - programs[*].lead_time_days. Planning a year ahead is explicitly a recommendation, and they add that it is never too late to ask.
  - programs[*].free_adults_per_children and adults_free. Only the trip coordinator is named as going free; nothing is said about other chaperones.
  - venue.has_rain_backup. The Barn is described as an indoor activity space but is nowhere offered as wet weather cover for a program.
- Conflicts recorded: 1, the booking address for school programs.
- Authored fields written: what_children_do, our_note and practical_summary on all four programs. what_children_do rests on the two program description PDFs, which list the activities in detail (bog walk, canoe and kayak skills, high ropes and zipline, rock climbing and rappelling, tree climb, camp skills, out trips, orienteering) and on the specialty PDF for distances and durations (2 to 7 km a day hiking, 2 km portages, a 20 metre rappel, 3 to 6 hours a day on a bike). our_note rests on the absence of any published price or age, on the per participant pricing line, and on the overnight nature of the residential weeks. practical_summary rests on the site and facilities page, the food answers in the youth questions page, and the gaps for access and parking.
- Meets minimum viable record: no. Missing age_basis and any age or grade range on every program, and missing a cost field or is_free on every program, because the site publishes neither. Venue id, name, address, coordinates, category, date and a hero image with alt are all present.
- Confidence: high on what is recorded, and high that what is missing is genuinely not published. Eleven pages and three PDFs were read, including the whole school programs page, the youth questions page and both program description PDFs, and neither a price nor an age appears in any of them.
- Recommended follow up by phone or email (programs@strathconaparklodge.com, 1-250-286-3122):
  1. Price. Ask for the per participant rate for the program and length you want, and confirm what it includes. A residential week is priced per student for the whole stay, not per night, so ask for the total per student. Ask separately what a single day program costs per child.
  2. Youngest age. Nothing on the site gives one. This decides whether a daycare or a primary class can come at all.
  3. Whether chaperones and teachers pay, and how many go free beyond the trip coordinator.
  4. Group size, both the smallest they will run for and the largest they can take on your dates.
  5. How many of your own adults must travel. The one adult per ten children figure here is read off their instructor ratio, not from a stated policy.
  6. Day program timings, since no start or finish time is published.
  7. Step free access and bus parking, neither of which is mentioned anywhere on the site.
