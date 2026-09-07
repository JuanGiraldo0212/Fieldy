# VERIFICATION - Shaw Centre for the Salish Sea

Checked 2026-09-03. extractor_version v2.0.

## Fields checked: 178

Every non-null field in the venue block, all 10 programs and all 5 images was re-read
against its source page. The four price-bearing pages (school-programs, groups,
admission-hours, tours) were re-read **live in a browser**, not from the fetch cache:
`web_fetch` deduplicated both the plain and the trailing-slash URL, so the STEP 3 re-read
was done by navigating to each page in Chrome and pulling the price text out of the live
DOM. Every price below is what the live page said today.

## Fields corrected: 4

- `programs[art-in-the-aquarium].format`: `["guided","hands_on"]` -> `["self_guided","hands_on"]`.
  The page says "Supplies and instruction not included", so nobody from the Centre teaches it.
- `programs[self-guided-group-visit].age_basis`: `"years"` -> `null`. The $8.00 figure is the
  4 to 12 admission band, not a program age range. Setting a range from it would have implied
  the visit is closed to children under 4, which is false since under 3s are free.
- `programs[behind-the-scenes-tour].lead_time_days`: `2` -> `null`. "Minimum of 48 hours
  advanced notice recommended" is a recommendation, and the 7 day figure applies only to
  off-schedule bookings for groups of 4 or more. Both are described in the program text instead.
- `venue.has_lunch_space`: `true` -> `false`. First read from "there is a large lawn area";
  the field trip tips sheet says plainly "we do not have space in our Centre to consume snacks
  or lunch", so the indoor answer is no and the lawn is the facility note.

## Fields set to null after review: 3

- `venue.has_washrooms` - not stated anywhere on the site, including the facilities page and
  the field trip tips PDF. Not inferred from "cubbies are available".
- `venue.youngest_age_welcomed_years` - the minimum age of 3 belongs to one program, not the venue.
- `venue.languages` - not stated.

## Price checks (the common error)

- **$7.00 is per student, not per group.** Live text: "$7.00 (+tax) per student. Minimum
  price equal to 15 students." Recorded as `cost_per_child_cad: 7.0` with the 15-student
  minimum charge in the extra fees note. `tax_included: false`.
- **$17 on the behind the scenes tour is per person, not per group.** Live text: "Cost is
  Regular Admission plus $17+tax (per person)." Recorded on both the child and adult fields,
  with the admission it sits on top of spelled out.
- **Self guided group rates are per person by age band.** $8.00 child (4 to 12), $15.50 adult.
  Recorded on the child and adult fields, not as a group cost.
- `price_year_or_season` captured as "Prices effective as of August 20, 2025", which the
  admission page states beside the price table. Prices are current, not from a past year.
- `school_rate_only: true` on all eight facilitated programs: the rate sits on a page titled
  School Programs and is written "per student". `false` on the self guided visit and the
  behind the scenes tour, which are open to any group.

## Grades and ages

All eight facilitated programs publish grade bands, so `age_basis` is `grades` and the age
fields are null. "Grades K to 2" is recorded as grade_min 0, grade_max 2. Preschool is -1.

One deliberate exception, which the validator flags as a warn: **Adventures of a Crab** carries
both `grade_min: -1, grade_max: 0` and `age_min_years: 3`. These are two separate published
statements in the same heading, "Preschool - K Programs" and "*Minimum age is 3 yrs old*", not
one range converted twice. `age_basis` stays `grades`. The minimum age matters too much to a
daycare director to drop.

The behind the scenes tour publishes an age, not a grade, so it is `age_basis: years`,
`age_min_years: 8`.

## Capacities

Every `capacity_max` is a stated per-booking maximum ("Max capacity 20/22/28 students"), never
a minimum. The only stated minimums are `capacity_min: 12` on the self guided group visit
("Minimum 12 paying guests") and `capacity_min: 2` on the behind the scenes tour.

## Chaperone ratios

Two different published rates, and they are not in conflict: the school programs page gives
one free chaperone per 5 students for preschool to grade 8 and per 10 for grades 9 to 12, and
the group bookings page gives one free adult per 10 paying guests for self guided groups. The
school programs page itself says "Cost and chaperone rates of self-guided visits differs from
school programs noted above", so each is recorded against the program it belongs to rather
than raised as a conflict.

## Conflicts recorded: 1

Wednesdays. The admission page lists all seven days open under summer hours; the school
programs page and the facilities page both say the Centre is shut on Wednesdays during the
school year. Neither page is dated, so `hours_notes` keeps the undisputed part (daily 10:00 to
16:30) and the Wednesday question goes to the director in the conflict note and in
`seasonal_notes`.

## Images

Five entries, one hero. Every URL is absolute, https, on the Centre's own Squarespace CDN, and
query strings were stripped. Each was confirmed present on the page recorded in `found_on_url`.

All five carry `alt_source: generated`, because every alt attribute on this site is the raw
filename ("touchtank.jpg", "Hermit-Crab.jpg", "IMG_9093_edit.jpg"), which a screen reader would
read out loud. **Each image was opened in the browser and looked at before its alt was written**,
so the descriptions are of what is actually in the frame, not of what the filename suggests. No
season, occasion or identity was inferred. No caption was invented and no `rights_note` was
taken from the site-wide footer copyright line. `usage` is `unverified` throughout.

The Open Graph image was skipped: it is a 526 by 275 social card, not a photograph. Noted in gaps.

## Location

No coordinates published: no maps iframe, no JSON-LD GeoCoordinates, no og:latitude on the
pages opened. Address taken verbatim from the site-wide footer. `geo_source: geocode_pending`,
lat and lng null. No pin was hand-placed.

## Authored fields written

`what_children_do`, `our_note` and `practical_summary` on all 10 programs.

- `what_children_do` rests on the Centre's own activity descriptions: storytelling, games and
  "hands-on, hands-wet learning" for the crab program; echolocation and photo-identification
  for the whale programs; "three ocean habitats" for the safari; "hands-wet time at the
  touchpool" for zoology; "drawings, sketches or paintings" for the art session. Where a
  program is described as taking place "entirely in the Ocean's Heartbeat (Classroom)", that is
  said plainly, because it changes what a class actually gets.
- `our_note` rests on the catches that are real but easy to miss: the classroom-only programs,
  the 15-student minimum charge, the different chaperone rate above grade 8, the six-person cap
  and the explicit unsuitability warnings on the behind the scenes tour, and the sibling rule.
- `practical_summary` rests on the facility fields plus the gaps: no indoor lunch space, the
  band shell as the wet weather fallback, and washrooms being unstated everywhere.

## Meets minimum viable record: no

Missing `venue.lat` and `venue.lng` only. Everything else clears the bar: id, name, address,
category, checked_on, a hero image with alt, and eight programs each carrying id, name,
age_basis with a grade range, comes_to_you, a cost and an our_note. The record backfills to
publishable in one geocoding pass with no site re-read.

## Confidence: high

The Centre publishes an unusually complete set of facts for a group leader: a per-student
price, per-program capacities, grade bands, program lengths, chaperone rates, payment terms,
parking, lunch and a field trip tips sheet, and all of it was confirmed live today.

## Recommended follow up by phone or email

Email groups@salishseacentre.org, in this order:

1. **Lead time** for a facilitated school program. Only the self guided visit publishes one.
2. **Wednesdays.** Confirm whether they are shut on the Wednesday you want.
3. **Washrooms.** Not mentioned anywhere on the site, which is the one real hole for under fives.
4. **Youngest age for a group** below the crab program's minimum of 3.
5. **Deposit and cancellation** for school programs. Neither is published.
6. **Sensory and noise** in the galleries, if that matters to your group. Only the behind the
   scenes tour describes its noise.
7. **The self guided booking form.** It did not render when this was checked, so ask whether
   email works instead if the form gives you trouble.
