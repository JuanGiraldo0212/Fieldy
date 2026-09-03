# VERIFICATION — Government House (Lieutenant Governor of BC)

Verified 2026-09-03 by re-fetching the Tours and Visit pages with a `?v=1` cache-buster.

- **Fields checked:** 58 (the venue block, four programs, two image entries and the location
  fields)

- **Fields corrected:** 0

- **Fields set to null after review:** 0. The fields that matter most were null from the start and
  the re-read confirmed they must stay null:
  - `programs[private-group-tour].is_free` — the Tours page states that **public** tours are free
    and says nothing at all about the cost of a private group tour. Inheriting "free" from the
    public tour would have been a guess.
  - `age_basis` and every age/grade field on all four programs — no age, grade or minimum age is
    published anywhere on the site.
  - `capacity_max` / `capacity_min` — the request form asks for a number of attendees but publishes
    no limit; "small group tours" is not a number.
  - `lead_time_days` — no minimum notice is stated. The only timing statement is that public tour
    registration opens "up to two weeks ahead", which is a booking window, not a lead time.
  - `has_washrooms` — the word does not appear anywhere on the site, which for a one-hour tour
    with a group of small children is the single most useful missing fact.
  - `wheelchair_accessible` — left null on purpose: the site says tours include stairs, walking and
    standing with minimal seating and no elevator, but that a ramp is available. That is not a
    yes or a no, so the wording is kept verbatim in `facility_notes` instead.

- **Confirmed unchanged on re-fetch:**
  - "Small group tours for non-profit, community, or academic organizations (such as schools) can
    be booked during weekdays." — the basis for `hosts_school_groups: true`.
  - "Tours are free but space is limited, and visitors must register in advance."
  - Private tours "are only offered on weekdays (subject to availability) and are limited to one
    hour" (`duration_min` 60, `days_offered` 1–5), with exactly four selectable start times —
    10:00am, 11:00am, 1:15pm, 2:00pm — recorded as `time_slots` in 24h form. No times were
    invented and none were converted from a vague phrase.
  - "Public tours are available on a limited basis on Saturdays" (`days_offered` [6]).
  - "Tours are only conducted in English." — the basis for `languages: ["English"]`.
  - The accessibility, refreshments/tea house, parking and death cap mushroom sentences, all kept
    verbatim in `facility_notes` and `restrictions`.
  - "The grounds and gardens are open to the public 365 days a year, and are free to visit", and
    the 5:30 am – 9:00 pm spring and summer hours.
  - Costume Museum 2026 season: opens May 19, closes Friday August 28, Tuesday to Friday
    10:00 am – 4:00 pm, closed June 30 and July 1 (`months_offered` [5,6,7,8],
    `days_offered` [2,3,4,5]).
  - The scavenger hunt PDF is hosted on the venue's own domain and was read; it is the grounding
    for `what_children_do` on the grounds visit (the pond ducks, the salmon carved on the
    bandshell, the orchard trees, the flags, the Rose Garden statue, the Hosaqami pole).

- **Address:** the street address appears on the General Enquiries page, not on the Visit page,
  and is recorded as the site writes it — including the postal code printed as "V8S IV9", with
  letters where digits belong. That typo is flagged in gaps rather than silently corrected.

- **Images:** two entries, both re-confirmed. The site publishes **no body photographs** on the
  Tours or Visit pages — the only images there are the vice-regal crest SVGs, which are skipped as
  wordmarks. The hero is therefore the homepage `og:image`, which is a photograph rather than a
  logo or social card, with `width`/`height` taken from the `og:image:width` / `og:image:height`
  meta tags the page actually states. The second entry is the photograph published directly
  beneath the Cary Castle Mews description. Neither carries an alt attribute, so both are
  `alt_source: generated`, and both alt strings say plainly that they were written from the file
  name and surrounding page text without the file being viewed. No captions were invented;
  `rights_note` is null on both — the site carries only a footer line, "Copyright © 2026:
  Information Provided by the Office of the Lieutenant Governor", which is not a photo credit.

- **Location:** `geo_source` is `geocode_pending` and matches how the coordinates were obtained —
  they were not. The Visit page has no Maps embed, no JSON-LD GeoCoordinates and no
  og:latitude/og:longitude; its only location text is "in the heart of the Rockland neighbourhood".
  No pin was hand-placed.

- **Conflicts recorded:** 0. The Tours page and the Visit page agree on tours being free,
  pre-registered and stair-heavy.

- **Not extracted, on purpose:** the guided garden tours are run by The Friends of Government
  House Gardens Society and their details, cost and booking sit on `fghgs.ca`, a partner domain.
  Recorded in gaps, not extracted.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all four
  programs. They rest on: the tour's own description (history, points of interest, art and
  architecture) plus the stairs/standing/minimal-seating line; the scavenger hunt PDF's fifteen
  stops; the grounds hours and free-parking sentences; the death cap mushroom warning; and the
  Costume Museum's season dates and docent line. `mood_tags` follow what the children do — the
  house tours are `learn` alone because a guided walk through rooms is being shown things, while
  the grounds visit with the scavenger hunt is `explore` and `play` because the children work the
  sheet themselves.

- **Meets minimum viable record:** no — `venue.lat`, `venue.lng` (geocode_pending), and no program
  carries `age_basis` plus a published range, because the site publishes no ages at all. Venue id,
  name, address, category, checked_on and a hero image with alt are present, and three of the four
  programs have a cost field or `is_free`.

- **Confidence:** medium-high on everything published — the tour terms, times, days, language,
  accessibility wording, rules and season dates are printed plainly and survived a cache-busted
  re-read. Lower on what a group actually needs: no price for a private tour, no ages, no group
  size, no washrooms.

- **Recommended follow up by phone or email** (no booking email is readable — the address on the
  General Enquiries page is behind Cloudflare email protection; the published lines are
  250-387-2080 for the grounds and general correspondence, 250-387-2079 for security after hours):
  1. **Price** — whether a private group tour costs anything.
  2. **Youngest age** — whether under-fives are accepted on a one-hour tour with stairs and
     minimal seating.
  3. **Capacity** — the maximum group size for a private tour.
  4. **Lead time** — how far ahead to submit the request form.
  5. **Lunch space** — whether a group may eat on the grounds; the tea room is seasonal,
     first-come first-served and takes no reservations.
  6. **Washrooms** — not mentioned anywhere on the site.
  7. **Rain backup** — for the grounds and scavenger hunt visit.
  8. **Bus parking** — whether a coach can use the Lower Lot at the Cary Castle Mews.
