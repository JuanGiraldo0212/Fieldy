# VERIFICATION — comox-valley-art-gallery

- **Fields checked:** 125 (33 venue, 2 programs at 46 fields each, 2 image blocks)
- **Fields corrected:** 2
  - `venue.lat` / `venue.lng`: `49.69094791, -124.99957522` -> `49.6905, -124.99789`, and `geo_source` `site_embed` -> `geocoded`. **The Google Maps embed in their location section carries only `!2d`/`!3d`, which is the map viewport centre, not a place pin.** There is no `!3d…!4d…` pair, no JSON-LD GeoCoordinates and no og:latitude anywhere on the page. The centre sits about 190 m from the building. The recorded point comes from geocoding the published street address and matches a named place record for the gallery at 580 Duncan Avenue.
  - `programs[1].outdoor`: `true` -> `null`. Several Make Art sessions are pictured under tents on the plaza and captioned that way, but the page text says only that the projects are "held at the Comox Valley Art Gallery". Whether a given session is inside or out is not stated, so it is unknown rather than outdoors. The point is made in `our_note` instead.
- **Fields set to null after review:** 4
  - `programs[0].days_offered` — the gallery opens Wednesday to Saturday, but nothing says a booked group tour is limited to those days, so it was not asserted.
  - `venue.has_lunch_space`, `venue.has_rain_backup`, `venue.stroller_accessible` — the accessibility section covers admission, building, washrooms and public health only. Step-free access does not license a stroller claim.
  - `venue.bus_parking` — the site says there is on-street parking and parking lots within walking distance, which is not a statement about a bus.
- **Conflicts recorded:** 0. The site is internally consistent; the "exhibition spaces temporarily closed for install" banner is a dated notice rather than a contradiction, and it is captured in the seasonal notes.
- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary` on both programs.
  - Guided tour: rests on "to book private or guided tours for small groups or classes" plus the exhibitions listing. It is deliberately short because the site describes no activity beyond looking.
  - Make Art: rests on "Drop-in activities and workshops... through hands-on art-making", "Materials are provided, and facilitators are on-hand to provide instruction", and the captioned session list (screen printing, community mural, collage, paper kites, lanterns, tie-dye).
  - Both practical summaries are generated from the facility fields (washrooms and wheelchair access confirmed, the rest null) plus the gaps list.
- **Price check:** `is_free` true on both programs rests on two verbatim statements, "Admission is free. Donations are appreciated." on the home page and "Admission: Programming is barrier-free (no cost). Donations are appreciated." in the accessibility section, plus "Participation is barrier-free (no cost); donations are appreciated." on the Make Art page. **Caveat recorded in gaps:** the free statement covers admission and programming generally; the site never says separately whether a booked private or guided tour carries a fee. `general_admission_child_cad` and `general_admission_adult_cad` are 0 because the site states admission is free outright, which is different from "by donation".
- **Meets minimum viable record:** no. Missing a program with `age_basis` plus a published range. The gallery publishes no ages or grades for tours or Make Art, only "open to people of all ages and abilities". The two programs that do carry an age band, the STREAM Incubator (ten to fifteen) and the Youth Media Project (sixteen to thirty), are registered programs for individuals rather than something a class or daycare can book, so neither was recorded as a program. Everything else in the bar is met: venue id, name, address, lat, lng, category, checked_on, and a hero image with alt.
- **Confidence:** high on facts, medium on completeness. Address, hours, accessibility, washrooms, contact route, free admission and the group-tour invitation were all read in the live DOM. What is missing is missing from the site.
- **Images:** both confirmed present on the `found_on_url` recorded, both on the gallery's own WordPress uploads path, both https, query strings not applicable. Both have empty alt attributes on the site so both alts are `generated`, written after opening each image file in a browser and looking at it. Captions are verbatim from the text beneath each image. `rights_note` on each is the per-image credit line from that caption, not a site-wide footer copyright. Dimensions come from the pages' own `og:image:width` / `og:image:height` markup. The largest available version of each was taken rather than the 700 px display cache.

## Recommended follow up by phone or email, in priority order

1. **Price** — does a booked private or guided tour for a class carry a fee, or does the free programming statement cover it.
2. **Youngest age** they will take on a booked tour, and whether a daycare group is welcome as well as a school class.
3. **Capacity** — how many children they can take in the gallery at once.
4. **Lead time** — how far ahead to ask, and whether tours can run outside Wednesday to Saturday.
5. **How many adults** they want with a group; the only rule published is that children must be accompanied by adult support persons.
6. **Lunch space** — anywhere indoors, or is the plaza the fallback.
7. **Bus parking** — on-street parking is mentioned but nothing about a bus.
8. **Dates** — Make Art sessions run on the gallery's own calendar, so ask which of them a group could join, and confirm the exhibition rooms are open on your date.
