# VERIFICATION — Cumberland Museum and Archives

**Finished from an interrupted run.** The JSON already existed with 8 programs and 4 images but had
no verification report and a `pending` tracker row, which meant STEP 3 had never been run against it.
Nothing was re-extracted from scratch. Every page was reopened in a live browser on 2026-09-07 and
every non-null field was checked against the rendered DOM.

- **Fields checked:** 96 across the venue block, 8 programs and 4 images, plus every price re-read
  from the live DOM rather than from any cached copy.

- **Fields corrected:** 9
  - `venue.lat`: null -> 49.61899 (geocoded from the contact page address; the earlier run reported
    no geocoding service was reachable, one was reachable this time)
  - `venue.lng`: null -> -125.03165 (same)
  - `venue.geo_source`: `geocode_pending` -> `geocoded`
  - `programs[japanese-townsite-story-walk].evidence`: "Duration: 45 mins" -> "Fee: 6$ per Student"
    (the old quote was verbatim but supported the duration, not the price; the price is the claim
    that needs auditing)
  - `programs[chinatown-story-walk].evidence`: "Duration: 45 minutes" -> "$6 per Student" (same reason)
  - `programs[no-6-mine-play].evidence`: the long descriptive sentence -> "Fee: $6 per Student" (same reason)
  - `programs[featured-exhibition-guided-tour].evidence`: "Duration: 60 mins" -> "Fee: $6 per Student" (same reason)
  - `programs[private-group-tour].time_slots`: null -> ["10:00", "11:00", "13:00", "14:00"]
    (the private tour form's own start time list, which the earlier run had not captured)
  - `images[space-gallery-welcome-wall].width`/`height`: null -> 800 / 517 (stated in the markup on the visit page)

- **Alt text rewritten after looking at all four images again:** 4
  - hero: removed "standing against a wall inside the museum", which is not visible in the frame.
  - welcome wall: removed "a bench", which is not in the picture.
  - child in gallery: the child is **sitting on a wooden mine cart**, not standing, and there are no
    boots on display. This alt was describing things that are not there.
  - story walk sign: the woman is holding a large green leaf and standing behind an angled panel,
    not beside a sign on a grass path.

- **Fields set to null after review:** 0. Nothing had to be pulled.

- **Prices: all seven re-read from the live DOM, none wrong.** $2 self guided, $6 for each of the four
  guided programs, $10 for the combination tour, and no price at all for the private tour. Every one is
  written "per Student" on the page, so the per-child readings are quotes, not inferences. The stale
  price list that hit the previous batch did not affect this venue.

- **Also re-confirmed live:** the 30 per booking maximum, Wednesday to Friday only, the 9:30 / 11:00 /
  1:00 start times, the grade dropdown that runs K to 12 with no preschool option, the $2 child and $6
  adult general admission, the Tuesday to Sunday 11:00 to 16:30 hours, the address, the phone number and
  programs@cumberlandmuseum.ca. The three odd looking `source_url` values are correct: the self guided
  page really does live at a URL ending `-copy/` and the Stolen Bases tour really does live at the
  `junior-archivists` URL. Both were traced from the links on the school programs page.

- **Conflicts recorded:** 1, re-confirmed on both live pages. The Junior Historians program page and the
  school programs listing both say Grades K to 5; the booking form's own dropdown says Grades K to 3.
  `grade_max` stays null because neither page is dated, and the note tells a director both answers.

- **Location:** the visit page embed carries `!2d`/`!3d` only, which is the map viewport centre, and the
  contact page embed is a plain place name search. Neither is a place pin, so this is **not** `site_embed`.
  The coordinates now recorded were geocoded from the street address and land about 180 m from where that
  map is centred, which is the sanity check passing.

- **Images:** all four URLs reopened. All are on cumberlandmuseum.ca, all https, all present on the
  `found_on_url` recorded. Two are CSS background images on the school programs page, and the story walk
  picture was traced to the No. 1 Japanese Town card specifically, so its `image_ids` link is right. One
  hero exists and it is the og:image. No captions were invented and no `rights_note` was taken from the
  footer copyright line.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all eight programs.
  They rest on the program pages' own descriptions of the activity, the meeting points, the weather
  warnings, and on the fact that washrooms, lunch space and accessibility are nowhere on this site.
  They were read back this pass for dashes, field names and marketing language.

- **Meets minimum viable record:** yes.

- **Confidence:** high. Every price, grade range, capacity, day and start time was read off a live
  rendered page today, and three program pages that a plain fetch returns empty were read in the browser.

- **Recommended follow up by phone or email** (programs@cumberlandmuseum.ca, 250 336 2445), in priority order:
  1. **Price** — confirm $2 / $6 / $10 per student are current, since no year is printed anywhere, and
     ask what a private group tour costs.
  2. **Youngest age** — every school program is written from Kindergarten up and the booking form has no
     preschool option, so ask whether a daycare group can be taken and by which route.
  3. **Capacity** — 30 per booking is on the form, not the program pages; confirm it, and ask the upper
     limit on a combination tour.
  4. **Lead time** — no minimum notice is published anywhere.
  5. **Lunch space** — nothing about eating at the museum; the picnic tables are at No. 6 Mine Park.
  6. **Washrooms** — not mentioned on the site at all.
  7. **Rain backup** — three programs are fully outdoors and two say to come dressed for the weather.
  8. Adults: how many have to come, and whether they pay.
