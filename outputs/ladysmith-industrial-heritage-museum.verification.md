# VERIFICATION — Ladysmith Industrial Heritage Museum

Verified 2026-09-03.

**Finished from an interrupted run.** The JSON already existed when this pass started. It had been
written by an earlier run that stopped before STEP 3, so it was schema-valid but unchecked, had no
verification report, and the tracker row was still `pending`. This pass re-opened every source URL
in a browser, checked every non-null field against the live page, and corrected what was wrong.
Nothing was re-extracted from scratch.

**De-duplication check (the check the interrupted run never did).** The Ladysmith and District
Historical Society runs three sites off one website and the tracker has a row for each. All three
records were read side by side:

| Row | Where | Contact |
| --- | --- | --- |
| Ladysmith Museum | 721 1st Avenue, downtown | 250-245-0423 |
| Ladysmith Archives | Unit B, 1115 1st Avenue | 250-245-0100 |
| Ladysmith Industrial Heritage Museum (this record) | 614 Oyster Bay Drive | 250-245-3075 |

No duplication was found. This record's only program rests on `/industrial-heritage-museum/`, plus
the home page and the calendar page for the Saturday opening. Neither sibling uses those as
sources for its own programs. The Society-wide offerings were checked one by one for leakage: the
Historically Speaking talks, the walking heritage tour, the Learning Centre and the Tea and Tales
events are all on `/programs/`, `/museum/` and `/calendar/`, all belong to the museum record, and
none has been copied here. Going the other way, the Heritage BC February event, the Heritage Week
hand pump car ride and the June 6 Arts and Heritage Open House all take place at this site, and
none of them has been written up as a bookable programme here either, because none is published
with a price, a length or an age range. The fourth record read for this check,
`art-council-of-ladysmith-and-district.json`, is a different organisation on a different domain
and its classroom at 610 Oyster Bay Drive is next door to this yard but shares nothing with it.

**Is it a distinct visitable venue?** Yes. It is a physical site at its own address with its own
opening arrangement, its own contact and its own photographs, and the site says in as many words
"we welcome visitors of all ages". The record is honest that it is a restoration yard in progress
rather than a finished museum, and that the interpretive displays are still a plan.

- **Fields checked:** 33 in the venue block, 46 in the one program, 11 fields on each of five
  images, plus the location fields.

- **Fields corrected:** 5.
  - `time_slots`: `["09:00"]` -> null. The site publishes an opening window of 9 to noon, not a
    session start. A 9:00 slot would have read to a director as a booked session that does not
    exist. Recorded in gaps.
  - `description`, on the Humdirgen: it said "a rare log loading machine". The page says it was
    built in 1945 to tip loads off railcars into the water, which is unloading, not loading. Now
    "a very rare machine built in the site's Machine Shop in 1945 to tip logs off railcars into the
    water", which follows the page.
  - `description`, on the artifact list: it listed the Machine Shop as being refurbished and left
    out the tube tumbler. The page's refurbishing sentence names Locomotive #11, the Locomotive
    Shop, railway yard, First Aid shed, Humdirgen, tube tumbler and box car. The list now matches.
  - `description` and `hours_notes`, on the Saturday arrangement: both said "every Saturday". The
    page this record is built on says "normally every Saturday". Softened, and the disagreement
    with the home page recorded as a conflict.
  - `images[hero].alt`: the generated alt said "rough grass". The image was opened directly in the
    browser during this pass and the grass is mown, and there is a yellow machine end in the
    foreground that the old alt left out. Rewritten to describe only what is in the frame.

  `our_note` was also rewritten. It had said "Wear boots, because it is gravel, grass and track
  underfoot", which read as a description of the yard surface that the site never gives. The
  gravel is the road in, which the directions paragraph does state, and the track through the yard
  is stated. The advice now rests only on those two.

  `image_ids` was extended from three to all five, so the two images that were in the array but
  attached to nothing are now reachable from the program. That includes the one with role
  `program`, which the prompt asks to be linked.

- **Fields set to null after review:** 1, `time_slots`, above. Everything else non-null was
  confirmed on the page.

- **`geo_source` audit.** `geocode_pending` is correct and stays. Every page of the site was checked
  for a published coordinate: no Google Maps iframe, no JSON-LD GeoCoordinates, no og:latitude, no
  store locator attribute, and no coordinate anywhere in the markup of the home, programs, museum,
  calendar or projects pages. Their other two sites do carry map embeds and this one does not. A
  geocoder was then tried and could not resolve the house number 614; it returned three separate
  points along Oyster Bay Drive spread about 700 metres apart. Dropping the pin on one of them
  would have been hand placing it, so `lat` and `lng` stay null and the record misses the minimum
  viable bar visibly. The address itself, "614 Oyster Bay Drive, Ladysmith, BC", is verbatim from
  the directions paragraph.

- **Evidence quote:** "Come by and watch these amazing industrial artfacts come to life, bring your
  camera, and your questions, we welcome visitors of all ages." Confirmed verbatim and contiguous
  at 23 words, including the site's own spelling of "artfacts".

- **Prices re-read from the live DOM.** There are none. Nothing on the page, the home page or the
  calendar says whether a visit costs anything or whether donations are expected, so
  `is_free`, both admission fields and every cost field stay null and price is flagged as the
  biggest gap. `price_year_or_season` stays null because there is no price to date.

- **Staleness.** This page carries no last modified date in its markup, unlike the archives page
  (2019-12-08), the contact page (2025-12-17), the programmes page (2025-07-09) and the museum page
  (2026-07-10). Its photographs are all from a 2020 upload folder and the locomotive picture shows
  the engine outside while the text says it has since been moved into the Locomotive Shop, so parts
  of the page have aged past its own photographs. The calendar page, which lists the site as open
  9 to noon on Saturdays through July and August 2026, is the most recent confirmation available
  and is why the Saturday arrangement was kept. Both points are in gaps.

- **Conflicts recorded:** 1. The venue page says work parties are normally every Saturday; the home
  page says they are every Saturday. For a director planning a trip that is the difference between
  a timetable and a habit, so both answers are given to her with the number to ring.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary`.
  `what_children_do` rests on the named things on site, the locomotive, the log car, the Humdirgen
  and the workshops, and on the invitation to bring your questions to the volunteers. `our_note`
  rests on the site being a live restoration yard with a future interpretive plan, on Saturday
  morning being the only stated time anyone is there, and on the gravel access road in the
  directions. `practical_summary` rests on the outdoor yard, the Saturday window, the First Aid
  building being named as where visitors are received, and the run of unpublished practical facts.

- **Images:** five, one hero, which is the cap and the required count. Every URL was confirmed
  present on `https://www.ladysmithhistoricalsociety.ca/industrial-heritage-museum/` by reading the
  page's own srcset attributes, and each recorded URL is the largest entry that srcset offers
  (977w, 1024w, 1024w, 1024w and 762w). All are absolute, https and on the venue's own WordPress
  uploads path. `width` and `height` are null throughout: the markup states 500 by 375 and similar,
  but those numbers describe the smaller variants the page displays rather than the files recorded.
  Four alts are the site's own and are real descriptions rather than filenames, so `alt_source`
  `site` is honest for them. The fifth, the hero, has an empty alt attribute on the page, so the
  alt is `generated` and the image was opened in the browser and looked at before it was written.
  All five captions are the verbatim figcaption text beneath each photograph and none was written
  by us. `rights_note` is null on all five, since the only credit-shaped text on the site is the
  footer copyright line. The og:image was deliberately not used as the hero: it is an archival
  black and white photograph of the yard in its working days, which is not what a group would see
  on arrival. That is recorded in gaps.

- **Facility fields re-read.** All stay null. The page lists a lunch and washroom building among the
  surviving structures but never says it is open to visitors, so `has_washrooms` and
  `has_lunch_space` were not inferred from it, and `facility_notes` stays null rather than carrying
  a line that would imply a facility the site does not offer. Parking, bus parking, step free
  access and rain cover are not mentioned at all.

- **Meets minimum viable record:** no, and it misses on two counts. `lat` and `lng` are null because
  the site publishes no coordinates and the address will not geocode to a house number. There is
  also no program age or grade range, so `age_basis` is null. Both are honest absences rather than
  gaps to be padded.

- **Confidence:** medium to low. The description of the site and its artifacts is detailed and easy
  to confirm, and the Saturday opening is backed by three pages. What pulls it down is that the
  page is undated, everything visual on it is from 2020 and already out of step with its own text,
  and the two facts a director most needs, price and whether a group can come, are simply not
  published.

- **Recommended follow up by phone**, in priority order, to 250-245-3075, the heritage committee
  chairperson, named on the home page as Shirley Blackstaff:
  1. What a visit costs, or whether a donation is expected, for a group of children.
  2. The youngest age they would take around a working restoration yard, and whether a daycare
     group is welcome.
  3. How many children they can take at once, and whether an adult to child ratio is expected.
  4. Whether Saturday morning is really the only time, or whether a weekday can be arranged.
  5. How much notice they want.
  6. Whether the lunch and washroom building is open to visitors, whether there is any cover if it
     rains, and where a bus can park on a gravel road.
