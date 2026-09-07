# VERIFICATION — Ladysmith Archives

Verified 2026-09-03.

**Finished from an interrupted run.** The JSON already existed when this pass started. It had been
written by an earlier run that stopped before STEP 3, so it was schema-valid but nothing in it had
ever been checked against the live pages, there was no verification report, and the tracker row was
still `pending`. This pass re-opened every source URL in a browser, checked every non-null field,
and corrected what was wrong. Nothing was re-extracted from scratch.

**De-duplication check (the check the interrupted run never did).** The Ladysmith and District
Historical Society runs three sites off one website and the tracker has a row for each. All three
records were read side by side:

| Row | Where | Booking contact |
| --- | --- | --- |
| Ladysmith Museum | 721 1st Avenue, downtown | 250-245-0423 |
| Ladysmith Archives (this record) | Unit B, 1115 1st Avenue, below Tim Horton's | 250-245-0100 |
| Ladysmith Industrial Heritage Museum | 614 Oyster Bay Drive | 250-245-3075 |

No duplication was found. This record's only program, the research visit, rests entirely on
`/archives/`, which never appears as a source in either sibling. The Society-wide offerings were
checked one by one for leakage: the Historically Speaking talks, the walking heritage tour, the
Learning Centre and the Tea and Tales events all sit on `/programs/`, `/museum/` and `/calendar/`
and belong to the museum record, and none of them has been copied here. The point is written into
gaps so nobody merges the three later. The fourth record read for this check,
`art-council-of-ladysmith-and-district.json`, is a different organisation on a different domain
(ladysmitharts.ca) and shares nothing with this one.

**Is it a distinct visitable venue?** Yes, but only just, and the record says so plainly rather
than dressing it up. It is one reading room where people come by appointment to look up records.
The description states that in its last sentence and the first two gaps entries repeat it. The
single program was kept rather than deleted because it is a real, published, bookable offering
("please call us at 250-245-0100 to make an appointment") and not an invented one. The prompt's
stop-after-the-venue-block rule was not applied: it is for sites that clearly do not serve
children's groups, and this site gives no reason of any kind. It is simply silent, so
`hosts_school_groups` and `hosts_daycare_groups` stay null rather than false.

- **Fields checked:** 33 in the venue block, 46 in the one program, 11 on the one image, plus the
  location fields.

- **Fields corrected:** 4.
  - `lat`: 48.99798 -> 48.9979. The old value did not match the page.
  - `lng`: -123.82578 -> -123.82598. Same reason.
  - `address`: "Unit B, 1115 1st Avenue, Ladysmith, BC V9G 1A6" -> "Unit B, 1115 1st Avenue,
    Ladysmith, BC". V9G 1A6 is the postal code of the Society's PO Box 813, printed under the
    archives heading in the footer but sitting on the PO Box line, and it is the same code the site
    prints for the museum at 721 1st Avenue. Attaching it to a street address asserts something the
    site does not. Noted in gaps.
  - `price_year_or_season`: reworded so it reads as advice rather than a note to ourselves, and it
    now names the charge it applies to.

  `description` and `our_note` were also tightened. The description said "There is one reading
  room"; the site says "a spacious and comfortable reading room" and never says how many, so the
  count came out. The `our_note` said visits are arranged one at a time, which the site does not
  say, so that clause came out too and the sibling cross-reference now names both other sites.

- **Fields set to null after review:** 0. Everything non-null in the record was confirmed on the
  page.

- **`geo_source` audit.** The old record claimed `site_embed` and this pass confirmed the claim is
  true, then found the numbers wrong. The archives page carries the line "Here is a map showing the
  location of the Ladysmith Archives:" followed immediately, inside the same entry content, by a
  Google Maps iframe whose parameters are `!2d-123.8259755849529!3d48.99790137930144`. Recorded to
  five decimal places as 48.9979, -123.82598. The two static map images on the same page are keyed
  by address string and carry no coordinates, so they were not used. No pin was hand placed.

- **Evidence quote:** "The Ladysmith Archives provides free, public access to thousands of documents
  related to the history of the Ladysmith area." Confirmed verbatim, contiguous and 19 words, as
  the opening sentence under Holdings.

- **Prices re-read from the live DOM.** "Please be advised that photocopying fees apply (.25 per
  page)" is verbatim on the page, and "free, public access" supports `is_free` and both zero
  admission fields. The page's markup gives a last modified date of 2019-12-08, so the copying
  charge is roughly seven years old. That is flagged in `price_year_or_season` and in gaps rather
  than projected forward.

- **Hours cross-checked.** The contact and hours page, last modified 2025-12-17, gives "Archives
  office: Monday to Friday, 9:00 a.m. to 2:00 p.m." That is the value used, since the archives page
  itself publishes no hours at all. `days_offered` 1 to 5 follows from it.

- **Conflicts recorded:** 1. Their contact page gives fixed weekday office hours while the archives
  page says to phone for an appointment, which leaves a director not knowing whether she can walk
  in. Both answers are given to her in the note and the advice is to ring first.

- **Authored fields written:** `our_note` and `practical_summary`. `what_children_do` is null and
  stays null, because the site never describes what anyone does on a visit beyond looking up
  records. `our_note` rests on the published contents of the room, a reading room with a microfilm
  reader and printer and two computers running Ancestry.com, and on the photograph, and it points
  a director at the two sibling sites instead. `practical_summary` rests on the free admission, the
  weekday hours, the copying charge and the long list of unpublished practical facts.

- **Images:** one, the reading room photograph. Confirmed on `https://www.ladysmithhistoricalsociety.ca/archives/`,
  absolute, https and on the venue's own WordPress uploads path. It is also the page's og:image,
  which is a photograph rather than a logo or social card, so the hero rule is satisfied properly.
  The recorded URL is the 1024w entry from the image's own srcset, which is the largest offered.
  `width` and `height` stay null on purpose: the markup states 500 by 375, but those numbers belong
  to the smaller variant the page displays, not to the file recorded here. `alt_source` is `site`
  and honest, "Reading room" is real alt text rather than a filename. The image was opened directly
  in the browser and looked at: a windowless carpeted room with a wooden table, about seven office
  chairs, a map cabinet, filing cabinets and framed photographs, which is consistent with the alt.
  `caption` is null because the image has no figcaption, and `rights_note` is null because the only
  credit-shaped text on the site is the footer copyright line.

- **Facility fields re-read.** All of them stay null. The page and the contact page say nothing
  about washrooms, lunch space, step free access, stroller access or parking. Nothing was inferred
  from "below Tim Horton's", which may or may not mean stairs.

- **Meets minimum viable record:** no. The venue block is complete, with address, coordinates and a
  hero image with alt. What is missing is a program with an age or grade range, so `age_basis` is
  null. The site publishes no ages of any kind, which for a research service is the honest answer.

- **Confidence:** medium. The facts that are there are plainly stated and the coordinates now come
  straight from the site's own map. The reason it is not high is that the page has not been touched
  since December 2019, so the copying charge and the room description are both old.

- **Recommended follow up by phone or email**, in priority order, to 250-245-0100:
  1. Whether they take children at all, and the youngest age they would have in the reading room.
  2. Whether a group can come, and how many people the room holds at once.
  3. Whether the 25 cents a page copying charge still stands.
  4. Whether you can walk in during office hours or must book, given their pages disagree.
  5. How much notice they want.
  6. Whether there is a washroom, and whether the unit is reached by stairs.
