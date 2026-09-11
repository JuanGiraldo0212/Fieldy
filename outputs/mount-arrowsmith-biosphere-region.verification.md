VERIFICATION — Mount Arrowsmith Biosphere Region

What this venue actually is: a UNESCO designated biosphere region and the community organisation that runs it, not a site a group visits. The question the brief asked was whether there is anywhere a group can go, or whether this is an organisation that delivers to classrooms. The answer is the second. The organisation has an education centre at 124 West Second Avenue in Qualicum Beach with loose drop-in hours, but nothing on the site describes a visit, tour or activity for children's groups there. What it does offer is a free youth programme of four workshops, three grouped as elementary and one as high school, delivered to the class with two of them adding an outdoor session at a beach or a forest the class travels to itself. So the record is category comes_to_you with four real programs, and the "Group visit" fallback was not used.

- Fields checked: 33 venue fields, 45 program fields across 4 programs, 4 images.

- Fields corrected: 0. Every value was taken once and confirmed once, from the same page.

- Fields set to null after review: 3
  - duration_min on the coastal workshop and the terrestrial workshop (both are published as "approximately 4 to 5 hours". A range cannot honestly become one number, so the range sits in the description instead.)
  - duration_min on the sustainable development workshop (published as "approximately 1.5-2 hours", same reason. The high school workshop is published as a single figure, approximately 1.5 hours, so that one is recorded as 90.)
  - age_basis and both range pairs on all four programs (the page groups three workshops under "Elementary School Workshops" and one under "High School Workshops" and says the first three are "best suited for elementary school students". That is a description of an audience, not a published grade or age range, and converting elementary into grades 0 to 7 would be inventing a number. Left null and flagged in gaps.)

- Conflicts recorded: 0. The workshops page and the programming and events page describe the youth programme in the same terms, free, hands on, and on the same three topics.

- Cost check, the error this pipeline makes most: no per-child or per-group figure was recorded anywhere. The programme is free. is_free is true on all four, both cost fields are null, and the one thing a school does pay for, its own transport to the outdoor site, is recorded in extra_fees_note and in restrictions rather than as a price. school_rate_only is true because the whole page is written for schools and classes.

- Evidence quotes: all four were re-read word for word from the live DOM of https://www.mabr.ca/youth-program-workshops after the JSON was written. All four match, all are contiguous, all are under 25 words.

- Authored fields written: what_children_do, our_note and practical_summary on all four programs.
  - what_children_do rests on the workshop descriptions themselves: the presentation, the classroom activities on marine food webs and water pollution, the beach seine, the soil types and food webs, the scavenger hunt for local flora in a forested area, the ecological footprint and sustainable city activities, and the Dragon's Den style pitch.
  - our_note rests on the three facts that will actually decide a booking: the workshop is free but the bus is not, the outdoor site is chosen by the organisers rather than by the teacher, and two of the four run four to five hours while two stay in the classroom for under two.
  - practical_summary rests on the split between the classroom half and the outdoor half, and on every facility field being unstated.

- Images: four, one hero. The Open Graph image on every page is the organisation's round logo, so it was skipped and the hero is the banner photograph on the home page, which shows the education centre building. All four were opened directly in the browser before their alts were written, and each alt describes only what is in the frame. The two workshop photographs carry the camera's file name as their alt on the site, or no alt at all, so both were rewritten and marked generated. All four sit on the Squarespace CDN that serves the site's own images, all are https, all query strings stripped, and each was confirmed present on the page recorded in found_on_url. No rights_note on any of them, because the site carries no per-photo credit.

- Location: no Google Maps embed, no JSON-LD GeoCoordinates and no og:latitude anywhere on the site. The education centre address geocodes to 49.34703, -124.44316 in Qualicum Beach, inside the Vancouver Island box. geo_source geocoded, which matches how it was obtained. gaps says in plain words that this marks the office and not the region, because a coordinate for a whole biosphere region would be a centroid of a large area and would send a director nowhere useful.

- Things deliberately not recorded as programs, each with a line in gaps: the ten Amazing Places, which are provincial, regional and municipal parks run by other people; the Qualicum Beach NatureKids club, which is a family membership joined through NatureKids BC; the downloadable Biosphere Booklets and at home activity sheets, which are classroom resources; and the Brant Wildlife Children's Festival, which is a one day public event held in a school gymnasium.

- Retrieval: the site is Squarespace but returns full page text to a plain fetch. Every page used was also loaded and read in a live browser. No retrieval note needed.

- Meets minimum viable record: no. All four programs are missing age_basis and a published range, which is the site's gap rather than ours. Venue id, name, address, lat, lng, category and checked_on are present, there is one hero image with alt, and all four programs carry comes_to_you, is_free and an our_note.

- Confidence: high. Everything recorded comes from one page written for teachers, the free price and the transport condition are quoted verbatim, and all four evidence quotes were re-checked against the live page.

- Recommended follow up by email (Jessica.Pyett@viu.ca for the workshops, ray@mabr.ca otherwise) or phone (250) 594-0405:
  1. Which grades or ages each workshop suits. Nothing numeric is published.
  2. Whether a daycare or preschool group counts as an organization within the region for the free workshops.
  3. Capacity: no maximum or minimum class size is published.
  4. Lead time: no notice period is published, and two of the four need a field site arranged.
  5. Which beach and which forest they use, and how far each is from your school, before you cost the bus.
  6. Washrooms at the outdoor sites.
  7. Lunch: whether the four to five hour workshops include a break and where the class eats.
  8. Rain backup for the beach and forest halves.
  9. How many adults have to come. No ratio is published.
