# VERIFICATION: cowichan-valley-museum-and-archives

- **Fields checked:** 79 (33 venue, 2 programs x ~20 populated, 2 images, 2 conflicts)

- **Fields corrected: 2**
  - `venue.address`: "130 Canada Avenue, Duncan, British Columbia, Canada, V9L 3Y2" -> "130 Canada Avenue, Duncan, British Columbia V9L 1T4, Canada". Reason: the home page reuses the post office box postal code. The contact page gives V9L 1T4 for the building. Recorded as a conflict.
  - `programs[0].cost_per_child_cad`: 60 -> null, with `cost_per_group_cad` set to 60. Reason: both tours are priced $60 per class, which is a group price, re-read word for word on the live page.

- **Fields set to null after review: 3**
  - `programs[1].days_offered` and `programs[1].months_offered`. The Monday to Wednesday availability and the September to December and January to June windows are printed under the general museum tour only, not under the Chinatown tour.
  - `venue.bus_parking`. The site describes car and street parking near the station but never mentions a bus or a coach, so nothing was recorded.

- **Conflicts recorded: 2** (postal code, and which month the summer timetable starts).

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` for both programs.
  - The museum tour rests on the tours page: guided or self guided, scavenger hunt to find artifacts, photos and information in each gallery, clipboards provided, K to 12, 60 minutes or your choice, $60 a class.
  - The Chinatown tour rests on the same page: grades 4 to 6, 90 minutes, $60 a class, at the museum, covering why Chinese people came to the valley, the discrimination they faced and the demolition of Chinatown.
  - The practical summaries rest on the no food or drink guideline, the parking paragraph on the contact page and the Charles Hoey V.C. Memorial Park sentence on the home page.

- **Meets minimum viable record: no.** Missing `venue.lat` and `venue.lng`. The site publishes no coordinates anywhere, its contact page map is drawn by script with no latitude or longitude in the markup, so the record is `geocode_pending` and needs one geocoding pass from the street address. Everything else on the bar is present, including a hero image with site written alt text and two programs with grade ranges, group prices and authored notes.

- **Confidence: high.** Both prices, both grade ranges and both durations were re-read from the live page, and the hours and admission by donation line were re-read from the live home page. The only soft spot is the postal code disagreement, which is recorded.

- **Recommended follow up by phone or email** (info@cvmuseum.ca, 250 746 6612):
  1. Whether the $60 class fee replaces the by donation admission or sits on top of it.
  2. Youngest age they will take, and whether preschool or daycare groups are welcome at all.
  3. Largest class they can take at once, and whether a class has to be split.
  4. How much notice they need for a booking.
  5. How many adults have to come, and whether adults pay.
  6. Whether the Chinatown tour runs on the same Monday to Wednesday pattern.
  7. Somewhere to eat, given food and drink are not allowed inside.
  8. Washrooms, step free access and where a bus can drop off and park.
  9. Opening hours after 6 September 2026, which is where the posted timetable stops.
