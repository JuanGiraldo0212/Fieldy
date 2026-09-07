# VERIFICATION: Orca Spirit Adventures

- **Fields checked:** 78 (venue block 32, three programs, four images, plus provenance)
- **Fields corrected:** 1
  - `programs[2].cost_per_group_cad`: recorded as 1700 rather than as a per person price. The page shows "Private Open Vessel Charter, Includes 12 Adults (Ages 19+ to book), CA$ 1,700", which is a price for the whole boat, not a price each. Confirmed on a live re-read.
- **Fields set to null after review:** 5
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` left null rather than true or false. The site never mentions schools, daycares or groups of children. The semi-covered boat takes all ages, which means a daycare is not ruled out, and the open air boats exclude under sixes, which means one of the two programs is. Neither answer is published, so neither was invented.
  - `venue.bus_parking` left null. Car, street and RV parking are described; a coach is not.
  - `venue.has_lunch_space` and `venue.has_rain_backup` left null. Snacks for sale on one boat is not a lunch space.
  - `programs[*].months_offered` left null on all three. Their questions page says the season runs April through October, but the site also sells winter tours, so the two do not agree and no month list was recorded. Flagged as unknown in gaps.
- **Conflicts recorded:** 1
  - Where the semi-covered tour meets. The tour page's own details give 146 Kingston Street, the Coast Victoria Hotel and Marina, and the questions page agrees. The small print further down that same tour page says to check in at 950 Wharf Street, which is the open air boats' dock. Neither page is dated. Two of the three statements say Kingston Street, so that is what the program description says, and the note tells a director to confirm it. This matters more than usual because the two docks are a walk apart and check in closes 30 minutes before departure.
- **Booking route:** every "Book Now" button on the site goes to FareHarbor, an outside ticketing platform. Nothing was extracted from it and `booking_url` is left null, per the rule on off-domain booking. `booking_method` is recorded as `shop` because that is genuinely how you book, and the phone number and reservations email from their own contact page are recorded so a group leader has an on-site route.
- **Retrieval note:** the tour pages and the price tables fetch fine as plain HTML. The FAQ page does not: its answers only render when each question is clicked. Those answers, which carry the age rule, the washroom answer, the accessibility answer, the parking detail and the season, were read in a browser. A fetch-only re-run will see the questions and none of the answers.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on "comfortable seating, full washroom facilities, and elevated outdoor 360 degree panoramic viewing decks", "full cruiser suits", "naturalists teach you about the wildlife you're viewing" and the three hour duration.
  - `our_note` rests on the published age and height rules, the washroom answer, the infant price and the flexible departure on the private charter.
  - `practical_summary` rests on the washroom and accessibility answers, the parking answer and the absence of any group rate.
- **Live re-read of price pages:** all three tour pages were re-opened in a browser with a fresh query string. Semi-covered $159 adult, $129 youth 13 to 18, $109 child 3 to 12, infants 0 to 2 free, all per person, confirmed. Open air $169 for every band from age 6, confirmed. Private charter $1,700 for the boat, confirmed. The $4 wildlife conservation fee is listed as included on all three.
- **Images:** four, all on the venue's own domain, all confirmed to load with the query string stripped. Two use the site's own alt text word for word. Two had no alt, so both were opened and looked at in a browser before an alt was written and are marked generated. A fifth candidate was dropped because the original file is only 386 pixels on its longest side.
- **Meets minimum viable record:** no. `lat` and `lng` are missing, and `geo_source` is set to `geocode_pending`. Everything else the bar asks for is present.
- **Confidence:** high on prices, ages, duration and the height rule, which are stated plainly and were confirmed twice. Medium on the meeting point for the semi-covered boat, because their own page contradicts itself.

## Recommended follow up by phone or email

1-888-672-6722, or reservations@orcaspirit.com.

1. **Price.** No school, student or group rate is published at all. Ask whether one exists before budgeting at $109 a child.
2. **Youngest age.** The semi-covered boat says all ages and prices infants free, so a daycare is not excluded from that one. The open air boats will not take anyone under 6 or under four feet tall, so they are out for a preschool group.
3. **Capacity.** The open air boats hold 12. Nothing is published about how many the semi-covered boats hold, which matters for a class of 25.
4. **Lead time and a whole-boat booking.** Ask whether a group can take a semi-covered boat privately and what notice that needs. The charters page mentions groups of up to 150 but gives no price.
5. **How many adults.** No supervision ratio is published and chaperones pay full price.
6. **Lunch.** There is nowhere published to eat. Snacks are sold on the semi-covered boats only.
7. **Rain.** Tours run in all weather and cruiser suits are supplied on the open boats, but there is no wet weather alternative and cancelling inside 24 hours means paying in full.
8. **Where to meet.** Confirm the dock. Their own page gives both Kingston Street and Wharf Street for the semi-covered tour.
