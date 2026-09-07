# VERIFICATION: Old Cemeteries Society of Victoria

- **Fields checked:** 61 (venue block 32, three programs, four images, plus provenance)
- **Fields corrected:** 0. The re-read matched the first pass on every price, grade and time.
- **Fields set to null after review:** 3
  - `programs[0].duration_min` left null. The site gives about an hour for the private group tours and the Sunday tours but never says how long a school tour runs, so it was not carried across.
  - `venue.has_washrooms`, `venue.has_lunch_space` left null. Nothing on any page mentions either, and inferring them from a public cemetery would be a guess.
  - `venue.languages` left null. There is a page called French Walking Tour and Biographies, but it is not clear whether that is a tour given in French or a tour about French settlers, so no language was recorded.
- **Conflicts recorded:** 1
  - What a group pays. The school tours page says "Cost for each tour: $45" and the private group tours page says "The cost is $10 per person". Both were re-read live and both still say that. Neither page states which applies to a class, so both prices are recorded on their own programs and the conflict note tells a director to settle it when she books. The school page was last updated in November 2024 and the private group page in April 2026.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on "guided walking history tours", "we'll visit RBC's most iconic graves" and "These wheelchair-accessible walking tours follow the paved pathways".
  - `our_note` rests on the two different price bases, on the private group page being written for seniors' groups, and on the Sunday tours needing no reservation.
  - `practical_summary` rests on the absence of any washroom, lunch or wet weather text plus the paved path and private bus lines.
- **Live re-read of price pages:** school tours, private group tours and the 2026 schedule were all re-opened in a browser with a fresh query string. $45 per tour, $10 per person and $5 / $2 all confirmed unchanged, as were Grade 4 and up, the 2 pm start and the Feb 15 to Dec 13 season.
- **Images:** four, all on the society's own domain, all confirmed to load with the query string stripped. Two use the site's own alt text word for word. Two had no alt at all, so the images were opened and looked at in a browser before an alt was written; those are marked generated. The social sharing image on the home page is the society logo, not a photograph, so the hero was taken from the school tours page instead.
- **Meets minimum viable record:** no. `lat` and `lng` are missing, and `geo_source` is set to `geocode_pending` so the address can be geocoded in a later pass. Everything else the bar asks for is present.
- **Confidence:** high. Prices, the grade floor, the season, the days and the meeting point are all stated plainly in their own words and were confirmed on a second live read.

## Recommended follow up by phone or email

Voice mail 250-598-8870, or oldcemvictoria@gmail.com.

1. **Price.** Does a class pay $45 for the whole tour or $10 a head? The two pages disagree.
2. **Youngest age.** School tours are written for Grade 4 and up. Ask whether a younger group can have a shortened private tour, since the private group page sets no age at all.
3. **Capacity.** No maximum or minimum group size is published for either group tour.
4. **Lead time.** How much notice the tour coordinator needs is never stated, and booking goes to a voice mail box.
5. **How many adults.** No supervision ratio is published.
6. **Lunch and washrooms.** Neither is mentioned anywhere. This is a working cemetery with no building of its own, so assume nothing.
7. **Rain.** No wet weather policy is published for an entirely outdoor tour.
8. **Bus drop off.** Their page says a private bus can drive in to meet the guide, and that vehicles can enter only on weekdays. Worth confirming for the date you want.
