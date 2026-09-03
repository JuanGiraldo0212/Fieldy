# VERIFICATION — craigdarroch-castle-national-historic-site

Verified 2026-09-02 by reopening every `source_url` plus the homepage, contact page and gallery page with cache-busted requests.

- **Fields checked:** 118 (33 venue fields, 9 programs × ~9 non-null fields each, 4 image records, location, provenance)

- **Fields corrected:** 0

  No value had to be changed on the verification pass. Every evidence quote was found word for word on the reopened page:
  - `Guided Tour & Object Analysis Activity – Suitable for students Grade 1-12` — confirmed on /plan/education/
  - `Victorian for a Day – Suitable for students Grade 1-4` — confirmed
  - `From Coalmine to Castle – Suitable for students Grade 5-8` — confirmed
  - `Character Tours – Suitable for students Grade 6-9` — confirmed
  - `$50.00/session` — confirmed
  - `Distance learning programs include a slideshow presentation, videos, lesson plan and a live Q&A session with a collections expert and tour guide via Zoom.` — confirmed
  - `Architecture Tour – Suitable for students Grade 10-12` — confirmed
  - `The cost is applicable admission rates plus $50 for the guide.` — confirmed on /plan/plan-your-visit/
  - `Children 3 and under are free when accompanied by a paying adult` — confirmed on /plan/plan-your-visit/

- **Fields set to null after review:** 0 corrected on the pass, but three were deliberately left null rather than inferred at extraction time:
  - `has_washrooms` — the education FAQ answers bag storage and lunch but never mentions washrooms. Not inferred from "historic house museum".
  - `has_rain_backup` — the only lunch spaces named are the covered veranda and the South Lawn, both outdoors. A covered veranda was not read as a rain backup.
  - `venue.price_year_or_season` — the rates carry only "All prices are subject to change" with no year or season attached.

- **Cost checks (the per-class vs per-child trap):**
  - In-person education rates are published per person by age band (`Children (4-11) $8.00`, `Youth (12-17) $12.00`), so they are recorded as `cost_per_child_cad: 8` with the youth band in `extra_fees_note`. Correct as per-child.
  - Distance learning is published as `$50.00/session`, i.e. per class, so it is recorded as `cost_per_group_cad: 50` on all three distance programs, never per child.
  - The personalized guided tour's `$50 for the guide` is a flat fee on top of per-person admission, so it is `cost_per_group_cad: 50` with the admission condition in `extra_fees_note`.
  - `school_rate_only` is true on the seven education-page programs (the rates sit on the Educational Programming page and are written for students) and false on the personalized guided tour and self-guided visit, which are general-public rates.

- **Age / grade basis:** every education program publishes grades and only grades ("Suitable for students Grade 1-12" etc.), so `age_basis` is `grades`, the grade pair is set and both age-in-years fields are left null. No range was converted between the two systems. The personalized guided tour and self-guided visit publish no range at all, so `age_basis`, grades and ages are all null on those two.

- **Capacity and lead time:** neither is published anywhere on the site, so `capacity_max`, `capacity_min` and `lead_time_days` are null on all nine programs rather than guessed. No stated minimum group size exists to mistake for a maximum.

- **Accessibility (drives app filters):** `wheelchair_accessible: false` and `stroller_accessible: false` are both confirmed on two separate pages — "there are no ramps or elevators and it is not wheelchair accessible" and "the Castle is 87 stairs to the top with no elevator", plus "Visitors are encouraged to leave personal possessions (coats, backpacks, and strollers) in their vehicle" and the guidelines graphic's alt text "no large backpacks, suitcases, or strollers allowed". `facility_notes` carries the verbatim explanation for each, and the site's offer of accessibility tours on request is recorded in gaps.

- **Images:** 4 entries, all absolute and all on thecastle.ca. Each was re-confirmed present on its recorded `found_on_url`. Three carry verbatim site alt text (`Castle exterior photo`, `Interior stairway`, `Craigdarroch Castle Gift Shop`); the tour guide photo has an empty alt attribute so its alt is `generated` and describes only the subject the site's own title attribute names. No captions were written. No `rights_note` was set — the site's footer line "The Craigdarroch Castle Historical Museum Society. © 2026. All Rights Reserved." is a site-wide copyright, not a photo credit, so it was correctly left null on every image. All four are `usage: unverified`. The Open Graph image was rejected as hero because it is a 1200×630 file named `thecastle_social_media_share_01`, i.e. a social card rather than a photograph; this is stated in gaps. Widths and heights are null because the markup does not state them (filename digits were not treated as declared dimensions).

- **Location:** `geo_source: site_embed`. The coordinates 48.4226294 / -123.3437226 are taken from the `!8m2!3d…!4d…` place coordinates inside the Google Maps URL the site itself publishes in its footer and Maps & Directions block on the homepage, education page, plan-your-visit page and contact page. No geocoding service was used and no pin was hand-placed.

- **Conflicts recorded:** 0. The homepage, plan-your-visit and contact pages agree on hours, address, phone and admission rates. The education page's "Programming available Wednesday – Sunday, 10:00 AM – 4:00 PM" and plan-your-visit's "Open Wednesday through Sunday, 10:00am — 5:30pm" describe different things (programming window vs opening hours) and are not a disagreement; both are recorded in `hours_notes`.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all nine programs.
  - `what_children_do` rests on the site's own descriptions of each program: the 60-minute tour plus 30-minute object or photo analysis activity, the 10-minute Victorian dance movement break, the in-character framing of the Character Tours, and the Zoom slideshow-plus-Q&A structure of the distance programs. Nothing physical was invented; where the site describes only content and not activity, the sentence stays at that level.
  - `our_note` rests on the 87 stairs with no elevator, the no-strollers-inside rule, the two-band pricing that splits Grade 5-9 classes, the per-session pricing of the distance programs, and the recommendation to leave backpacks on the bus.
  - `practical_summary` rests on the facility fields (outdoor lunch on the veranda or South Lawn, bus parking on Joan Crescent, no step-free route) plus the gaps list (washrooms, capacity, lead time).

- **Meets minimum viable record:** yes. `venue.id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` are all set; one hero image with alt is present; and `guided-tour-object-analysis` carries id, name, `age_basis: grades` with grades 1-12, `comes_to_you: false`, `cost_per_child_cad`, and `our_note`. Validator reports no errors and no NOT PUBLISHABLE warning.

- **Confidence: high.** The education page is dated 2026-04-10 and the visit page 2026-08-27, both current, and every price, grade range and facility statement was found verbatim on a reopened page; the only soft spots are the unpublished capacity and lead time, which are recorded as gaps rather than guesses.

- **Recommended follow up by phone or email** (250.592.5323 or info@thecastle.ca), in priority order for a daycare director:
  1. **Price** — confirm whether the $8 / $12 bands are current and how a class spanning both bands is billed; the page carries no year.
  2. **Youngest age** — no education program is published below Grade 1; ask whether anything exists for a preschool or daycare group, and what the accessibility tour offered "upon request" involves for very young children who cannot manage 87 stairs.
  3. **Capacity** — no maximum or minimum group size is published for any program.
  4. **Lead time** — no minimum booking notice is published.
  5. **Lunch space** — confirmed as the covered veranda or South Lawn, both outside; ask what happens in rain.
  6. **Washrooms** — not mentioned anywhere on the site, including the education FAQ.
  7. **Rain backup** — no indoor wet-weather space is mentioned.
  8. Also worth asking: chaperone ratio and whether accompanying adults are charged, deposit and cancellation terms, and the length of a distance learning session.
