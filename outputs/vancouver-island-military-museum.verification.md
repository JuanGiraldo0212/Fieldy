# VERIFICATION — Vancouver Island Military Museum (vancouver-island-military-museum.json)

- **Fields checked:** 33 venue fields, 3 programs, 4 images, 1 conflict.
- **Fields corrected:** 4
  - `venue.address`: "100 Cameron Road, Nanaimo, B.C. V9R 5S5" (page header banner) -> "100 Cameron Rd., Nanaimo, BC, V9R 0C8". V9R 0C8 is what the site footer on every page, the Google Maps embed on the directions page and the educators PDF all give. Recorded as a conflict.
  - `venue.geo_source`: `site_embed` -> `geocoded`. The directions page embed is `maps.google.com/maps?q=100%20Cameron%20Rd...` which is an address search, not a `?q=LAT,LNG` place pin and not a `!3d…!4d…` pin. It carries no coordinate at all, so it does not qualify.
  - `programs[living-history-group-tour].duration_min`: 120 -> 60. The site gives a range, "60 minutes to 2 hours", and the base case is the lower bound with the range in the description.
  - `venue.booking_email`: oic@militarymuseum.ca -> eppc@militarymuseum.ca. Both are published; the education and public programs coordinator is the right contact for a group booking, and oic@ is noted in gaps.
- **Fields set to null after review:** 5
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `bus_parking` — none of these appear anywhere on the site, including the directions page which does describe the parking lot and the ramp in detail.
  - `price_year_or_season` — the admission prices carry no date or season.
  - `programs[young-explorers-program].is_free` and both cost fields stay null; the program page never states a price.
- **Conflicts recorded:** 1 (two postal codes for the same street address).
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs. They rest on the bookable tours page, the educators PDF, the Decoding the Diefenbunker description on the programs page, the hours and admission page, and the directions page paragraph about the parking lot, the stairs and the ramp.
- **Meets minimum viable record:** yes. The guided tour carries `age_basis` grades with a K to 12 range, `is_free` true, `comes_to_you` false and an authored note; the venue has an address, coordinates and a hero image with alt.
- **Confidence:** medium. The facts are all on the museum's own pages, but this is a volunteer run site and parts of it are visibly behind: the programs page still advertises a program that ran on 27 August 2026, the events listing shows nothing upcoming, and the home page still carries a closure notice for Thursday 6 August. The grade range on the tour is derived from the curriculum links in the educators handout rather than from a stated age policy, and that is flagged in gaps.
- **Staleness check:** the posted admission prices carry no date and cannot be aged. The one dated item on the site, the Young Explorers program, has passed; the events archive confirms it with "0 events found. Latest Past Events". This is recorded in the program description, in `our_note` and in gaps.
- **What the browser changed:** the site fetches cleanly, so the browser was used for images rather than for text. All four photographs on the site carry file names in place of alt text ("2026_03_01_VIMM-5320"), so each image was opened and looked at before its alt was written, and every alt here is `generated`. The browser also found the hero as a CSS `background-image` on the top section, which a `<img>` query would have missed entirely, and confirmed the site publishes no og:image.
- **Recommended follow up by phone (250-753-3814) or eppc@militarymuseum.ca, in priority order:**
  1. Price: whether the $4 and $2 admission is charged on top of the free tour, and whether a school group pays anything at all.
  2. Youngest age: whether a preschool or daycare group can be accommodated. The only stated age guidance is the 7 to 13 aim of the kids program.
  3. Capacity: how many children they can take at once, and whether a class has to split.
  4. Lead time: how far ahead the volunteers need to be asked, since none is published.
  5. Lunch space: nothing is stated. Piper Park is right beside the building and is the obvious fallback.
  6. Washrooms: not mentioned anywhere, including on the accessibility paragraph.
  7. Rain backup: the museum is indoors, but it is small, so ask what happens if the group is larger than one gallery holds.
  8. Bus parking: the lot is described as free and accessible but never as taking a bus.
