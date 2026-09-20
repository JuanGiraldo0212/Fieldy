# raincoast-education-society.json

VERIFICATION

- **Fields checked:** 47 (33 venue fields, every non-null field on all three programs, and all five image entries, re-read against the school programs, interpretive programs, Raincoast Field School, Amphitrite House, What We Do, contact and home pages).

- **Fields corrected:** 4
  - `program.cost_per_child_cad`: 300 -> null, with `cost_per_group_cad` set to 300 instead. The page says "for a rate of $300 per group", not per student, and recording it per child would have overstated a class of twenty by a factor of twenty.
  - `program.capacity_min`: 20 -> 1. "Our group size is 1-20 students" gives 1 as the floor and 20 as the ceiling; 20 is the maximum, not the minimum.
  - `venue.booking_method`: `email` -> `web_form`. The contact page carries a name, email and comments form, and the school programs page's "contact us" link points at that page. The email address is still recorded separately.
  - `venue.name`: kept as "Raincoast Education Society", matching the site; no change needed, but checked against the tracker spelling.

- **Fields set to null after review:** 5
  - `program.age_basis`, `age_min_years`, `age_max_years`, `grade_min`, `grade_max` — the school programs page says the programs are for "visiting elementary and secondary schools" and that teaching is "tailored to the grade (curriculum) level", and the interpretive programs page says "all ages". None of that is a published range, so nothing was converted into numbers. A re-read of the page confirmed no grade or age range appears anywhere on it.
  - `venue.hosts_daycare_groups` — left null rather than true. "All ages" on the interpretive page is not a statement that under-fives are welcome on a coastal field program, and the site gives no minimum age either way.
  - `venue.price_year_or_season` — no year, season or school year appears beside the $300 and $600 rates, confirmed on re-read.
  - `program.chaperone_ratio` — the site says "there is a student/teacher ratio" but never gives the number, so the field stays null and the gap is recorded.
  - `venue.facility_notes` — nothing on the site describes washrooms, lunch, parking or access, so the object is null rather than padded.

- **Not recorded as programs, deliberately:** two offerings that are real but not bookable by a visiting group.
  - The Raincoast Field School is a standing arrangement with Wickaninnish Community School and Ucluelet Elementary School, Kindergarten to Grade 7, over 200 trips a year. It would have supplied the grade range this record is missing, which is exactly why it was not used: the site never says another school can join it. It is described in the venue block and in gaps instead.
  - The summer day camps, ages 6 to 12 at $250, register through the Tofino and Ucluelet recreation departments on their own booking sites. They are individual registrations, not a group booking, and the booking route is off the society's domain.

- **Evidence quotes:** all three re-read word for word against the live pages.
  - Half day: "We offer our 1.5 - 2 hour school programs for a rate of $300 per group" — contiguous, confirmed.
  - Full day: "a 5 - 6 hour program for $600 per group" — contiguous, confirmed.
  - Amphitrite House: "Open from 9:00 am to 4:00 pm everyday at Ucluelet's Amphitrite Point" — confirmed, including the site's own spelling of "everyday".
  - `duration_min` is recorded as the lower bound of each published range (90 and 300 minutes) because the field takes one number; the full range sits in each program name and description.

- **Images:** 5 entries, all on the venue's own WordPress uploads path, all absolute and https, each confirmed present on the `found_on_url` recorded. One `hero`. No `caption` was written and no `rights_note` was taken from the site-wide footer. Every alt is `generated`: the site does give alt attributes, but every one of them is the image file name ("Intertidal SQ1200", "Tall Trees PS1500", "Amphitrite House Chat PS2500"), which a screen reader would read out as gibberish. No browser was available in this run, so each alt is a short factual line naming only the subject the file name and its section state, with nothing inferred about people, season or activity. This is flagged in gaps for a human pass.

- **Conflicts recorded:** 1. The school programs page says to contact them through the contact page, while the interpretive programs page asks groups to submit a separate program form first, for programs with the same length, the same group size and the same $300 and $600 rates. The venue's own contact page is used as the booking route and the note tells the director both exist.

- **Authored fields written:** all three on all three programs.
  - `what_children_do` rests on the six topic descriptions: tide pools at low tide, plankton under a microscope, the beach seine through eelgrass, songbirds, seabirds and shorebirds with binoculars the group brings, the mudflats at Tofino Botanical Gardens, and the rainforest.
  - `our_note` rests on the flat per group rate against the 1 to 20 group size, on the repeated statements that most topics only run at low tide, and on the total absence of lunch, shelter and meeting point information. For Amphitrite House it rests on "a small museum space".
  - `practical_summary` is generated from what is published (rate, duration, group size, hours at Amphitrite Point) against the washroom, lunch, rain backup, bus parking, meeting point, adult ratio and youngest age gaps.

- **Location:** `geo_source` is `geocode_pending`, which matches how the coordinates were obtained, namely not at all. No geocoding service was available in this run. The site publishes no coordinates, no Google Maps embed and no JSON-LD address block. The full office address, 1801 Bay St, Ucluelet, BC V0R 3A0, is captured for a backfill pass. No pin was hand placed. Gaps warns that this address is the office you are asked to call ahead of, not where a field program meets.

- **Meets minimum viable record:** no. Two things are missing.
  1. `venue.lat` and `venue.lng` are null, pending geocoding of the captured address.
  2. No program carries `age_basis` or a published age or grade range. The site simply does not publish one for anything a visiting group can book.
  Everything else on the bar is present: `id`, `name`, `address`, `category`, `checked_on`, a `hero` image with `alt`, and programs with `comes_to_you`, a cost field and `our_note`.

- **Confidence:** medium to high on what is recorded, low on what is not. The price, duration, group size and opening hours are stated plainly in the venue's own words and were confirmed on a second reading, but the record has no age range, no meeting point and no facility information at all, because the site carries none.

- **Recommended follow up by phone or email** (info@raincoasteducation.org, 250-726-6805):
  1. Price — does the $300 or $600 group rate include GST, is it current for this school year, and is there a rate for a group larger than 20?
  2. Youngest age — will they take a daycare or preschool group, and what is the youngest age they run a shoreline program for?
  3. Capacity — the site says 1 to 20 students; what happens with a class of 25, and does a second educator cost more?
  4. How many adults have to come — they mention a student to educator ratio but never give it.
  5. Lead time — how far ahead to book, whether a deposit is needed, and what happens if the tide or weather forces a change.
  6. Lunch space and washrooms — where a group eats and where the toilets are on the 5 to 6 hour program, since neither is on the site.
  7. Rain backup — what happens to an outdoor, tide dependent program in bad weather.
  8. Meeting point — exactly where the group is met, and whether a bus can park and turn there.
  9. Amphitrite House — whether there is any admission charge, whether a group has to book, and how many children fit in the room at once.
