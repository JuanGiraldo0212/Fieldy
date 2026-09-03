# VERIFICATION — Helmcken House

Checked 2026-09-03. Helmcken House is operated by the Royal BC Museum, so royalbcmuseum.bc.ca is its own domain; that domain now serves from rbcm.ca, and everything here came from rbcm.ca or royalbcmuseum.bc.ca pages.

**Is it open?** Not on an everyday basis, and not right now on the evidence of the site. The museum's Cultural Precinct page states, verbatim: *"Check the events page for opening hours. Helmcken House is typically open during July and August, the weekends in December and other special events throughout the year."* Today is 3 September, outside those windows. The museum's own "What's Happening" panel, read on 2026-09-03, lists a Native Plant Garden Tour today and events on 12 and 18 September; no Helmcken House opening appears on any of them. The site publishes two Helmcken House events — an Open House and an Old-Fashioned Christmas — but neither carries a date that rendered in the fetched text. That is recorded factually in `seasonal_notes` and in `gaps`; nothing was concluded beyond what the site says.

- **Fields checked:** 41 (33 venue, 1 program, 1 image, provenance)

- **Fields corrected:** 2
  - `venue.website`: the tracker's `www.royalbcmuseum.bc.ca/visit/helmcken-house` returns no content and there is no dedicated Helmcken House page in the site's page sitemap. Changed to the Cultural Precinct page, which is where the museum documents the house.
  - `programs[0].months_offered`: `null` -> `[7, 8, 12]`, from "typically open during July and August, the weekends in December". The "other special events throughout the year" clause is noted in gaps rather than expanded into more months.

- **Fields set to null after review:** 5
  - `venue.lat` / `venue.lng` — see Location below.
  - `venue.general_admission_child_cad` / `general_admission_adult_cad` — the Royal BC Museum's admission table sits on the same pages, but it is the museum's price, not Helmcken House's. Copying it across would have been the wrong number for this record.
  - `programs[0].is_free` — the site never says whether the open house costs anything or is included with museum admission.
  - `venue.wheelchair_accessible` and the other facility booleans — the museum's accessibility page describes the main building. An 1852 house is exactly the case where that inference would be wrong, so all were left null.
  - `programs[0].duration_min`, `time_slots`, `capacity_max` — the event page's date/time block sat beyond the fetcher's text limit and did not render. Recorded as a gap rather than guessed.

- **Conflicts recorded:** 0. The Cultural Precinct page and the event page agree on the house's history, its position ("on the east side of the museum building") and its status.

- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary` on the one program.
  - `what_children_do` rests on "Come visit historic Helmcken House" plus "The doctor's original 19th century medical kit is among the interesting items on display" and the house's described scale ("this modest house").
  - `our_note` rests on the "typically open during July and August, the weekends in December" line, on the absence of any group or school text, and on the 360-degree virtual tour the museum links as the can't-make-it-in-person option.
  - `practical_summary` is generated from the empty facility fields plus the gaps list.

- **Retrieval note (for auditability):** the Cultural Precinct page is long enough that the fetched text was cut off before the Helmcken House section. That section was read instead from the same page's own WordPress REST content (`rbcm.ca/wp-json/wp/v2/pages?slug=cultural-precinct`), and the event body from `rbcm.ca/wp-json/wp/v2/event?slug=helmcken-house-open-house`. Both are the venue's own domain serving the same page content, so every quote here is on-domain and verbatim.

- **Images:** 1, the hero. `https://rbcm.ca/wp-content/uploads/2026/04/helmcken-house.webp` is the og:image of the Helmcken House Open House event page, absolute and https, on the museum's own domain. The og:image carries no alt attribute, so alt is `generated`; it identifies the subject rather than describing the frame, because the image file itself was not opened (images are never downloaded in this pipeline) and inventing visual detail would be worse than a plain identification. No caption, no rights note — the museum publishes no credit line beside it. This is not a logo or social card; it is the event's own photograph.

- **Location:** `geo_source: geocode_pending`. The museum publishes no address or coordinates for Helmcken House itself. The address recorded, 675 Belleville Street, is the Royal BC Museum's own published address, which is where the house stands ("on the east side of the museum building"). The museum's site does carry a Google Maps link with coordinates for the museum building, but that pin is the museum, not the house, so it was not recorded as `site_embed`; the backfill will geocode the street address to the same effect and the record stays honest about it.

- **Meets minimum viable record:** no. Missing `venue.lat`, `venue.lng`, and a program with `age_basis` plus a range and a cost or `is_free` — the site publishes no ages and no price for this house.

- **Confidence:** medium. The history, the location and the opening pattern are quoted directly from the museum's own text and are solid. Everything a group leader actually needs to book — dates, price, hours, capacity, whether a class can come at all — is simply not published, and part of that is because the event page's date block did not render, so it may exist on the live page.

- **Recommended follow up by email (coconnor@royalbcmuseum.bc.ca, Program Developer, the only contact the museum publishes for this house), in priority order:**
  1. Is Helmcken House open at all this autumn, and what are the next open dates?
  2. Price — is entry free, included with museum admission, or ticketed separately?
  3. Youngest age, and whether a daycare group is welcome inside an 1852 house.
  4. Capacity — how many people fit in the house at once, which will govern whether a class splits.
  5. Lead time and whether a group slot can be reserved.
  6. Lunch space — the Cultural Precinct has outdoor seating and food trucks, but nothing is published for a booked group.
  7. Washrooms — none are stated at the house; presumably the main museum building.
  8. Rain backup — the house is indoors but the approach is through the outdoor precinct.
