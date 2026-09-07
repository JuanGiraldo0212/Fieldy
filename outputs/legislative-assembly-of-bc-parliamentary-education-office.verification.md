# VERIFICATION - legislative-assembly-of-bc-parliamentary-education-office

- **Fields checked:** 112 (28 venue, 4 images x 4 attributes, and every non-null field across six programs)
- **Fields corrected:** 5
  - `venue.booking_phone`: 250.387.9243 -> null. Three of their pages give three different tour numbers and none of the pages is dated, so the field is null and all three numbers are in `conflicts` for the director to see.
  - `parliamentary-play-and-tour.capacity_max`: 40 -> 35. The page says "Maximum of 35 students and 5 adults", so 35 is the student cap. The adult allowance is written into the description rather than folded into one number.
  - `parliamentary-play-and-tour.capacity_min`: null -> 15, from "We normally ask for a minimum of 15 people". Recorded as a minimum, not a maximum.
  - `virtual-classroom-session.duration_min`: 45 -> null. The page offers a choice of 30 or 45 minutes; a single number would misrepresent it, so both are in the description.
  - `venue.lat` / `venue.lng`: left null with `geo_source` = `geocode_pending`. No coordinates, JSON-LD `GeoCoordinates` or map embed exists on any page opened.
- **Fields set to null after review:** 4
  - `wheelchair_accessible` - "easily accessible by car, bus, bike, wheelchair, mobility scooter, or by foot" is about reaching the site, not the tour route inside.
  - `has_lunch_space` - the Parliamentary Dining Room is a restaurant, not group lunch space, and nothing else is offered.
  - `has_rain_backup` - the play half of the Play and Tour is outdoors and no wet weather plan is published.
  - `virtual-classroom-session.is_free` and `speaker-in-the-schools.is_free` - the building tours are stated to be free, but neither of these two pages states a price, so neither was assumed free.
- **Grades, not ages:** three programmes publish grade bands and all three are recorded as grades with `age_basis: "grades"` and both age fields null. Little Legislators "best suited to students K-3" is `grade_min` 0, `grade_max` 3. The Play and Tour spans K to 6 and 7 to 12 across its two plays, recorded as 0 to 12. Virtual Classroom "grades 3 - 12" is 3 to 12. No grade was converted to an age.
- **Prices:** every recorded price is `is_free: true`, from "free guided tours", "Groups of 15 or more people can book a free guided tour", "Little Legislators is a free school tour program" and "Cost: Free". No per-child or per-group figure exists anywhere, so no cost field was populated and no group price was mistaken for a per-student one. `school_rate_only` is false throughout because nothing is charged.
- **Capacity check:** `school-guided-tour.capacity_max` 40 is a per-booking maximum ("Groups with more than 40 people will need to book multiple tours"), not a minimum. `virtual-classroom-session.capacity_min` 5 is correctly a minimum.
- **Lead time:** no page states a minimum notice for any programme, so `lead_time_days` is null everywhere rather than guessed from the booking form.
- **Dates:** the Play and Tour page gives Tuesday, May 19, 2026 to Tuesday, June 23, 2026, so `months_offered` is [5, 6] and the exact dates are in the description. The prices are all free, so `price_year_or_season` is not needed.
- **Conflicts recorded:** 1, on the tour phone number, written for a director in plain words with all three numbers and the email as the fallback.
- **Authored fields written:** all three, on all six programmes. They rest on: the tour length and gallery allowance, the 40 person cap, the washroom warning, the sitting calendar caveat, the K-3 framing and the topic box instruction on the booking form, the outdoor play and the late notified meeting spot, the five person online minimum and the Zoom preference, the school entrance and security screening, and the Speaker's open question format.
- **Images:** four entries, all absolute https URLs on `www.leg.bc.ca`, each present in the fetched text of the `found_on_url` recorded. Two carry the site's own alt (`alt_source: site`), and two have `alt_source: generated` because the page gave no alt. Both generated alts were written after opening the image in a browser and looking at it, so they describe only what is in the frame. The chamber caption is the line printed directly beneath that image on the tour information page. No `rights_note` was set; the site's only copyright statement is a footer link. Two further images on the school tours page pointed at an empty file path and were dropped.
- **Meets minimum viable record:** no, on one field only. `lat` and `lng` are pending geocoding from the recorded street address. Everything else on the bar is present: `id`, `name`, `address`, `category`, `checked_on`, a hero image with alt, and four programmes that each carry `age_basis` plus range or a free flag, `comes_to_you`, a cost field and `our_note`.
- **Confidence:** high. Eight pages on the venue's own domain were read cleanly, six distinct programmes are documented with their own source pages, and every price, grade band and capacity number traces to a verbatim line. The only real uncertainty is the three way phone number disagreement, which is recorded rather than resolved.
- **Recommended follow up by phone or email** (tours@leg.bc.ca, or PEO@leg.bc.ca for classroom visits), in priority order:
  1. What do the Virtual Classroom sessions and a Speaker in the Schools visit cost?
  2. What is the youngest age they will take, and do they run anything for preschool or daycare groups below kindergarten?
  3. Is there a group size limit on Little Legislators, and how long does it run?
  4. How much notice do they need for a school booking?
  5. Is there anywhere a class can eat lunch on or beside the grounds?
  6. Is the tour route inside step free, and can a group use a washroom part way through?
  7. What happens to the outdoor play if it rains, and where exactly can a bus drop off and park?
