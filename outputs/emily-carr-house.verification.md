# VERIFICATION — Emily Carr House (Carr House)

Checked on 2026-09-03 against https://www.carrhouse.org. Extractor v2.0.

- **Fields checked: 32 venue fields + 1 program + images + location.** Almost all resolved to null, for one reason described below.

- **Blocking finding: the site is JavaScript-rendered and served no body content to the fetcher.** Nine URLs were opened (homepage, sitemap, `/school-groups`, `/plan-your-visit`, `/plan-your-visit-`, `/frequently-asked-questions`, `/about-carr-house`, `/contact-us`, `/educational-resources`). Every HTML page returned only its `<head>` metadata — no headings, no paragraphs, no image tags, no JSON-LD, no map embed. The `www` and apex hosts behave identically, and a cache-busting query changed nothing. `sitemap.xml` returned normally, which is how the page inventory was obtained, so this is a rendering limitation and not a block or an outage. No browser-capable fetch was available in this run environment.

  Everything recorded therefore comes from page metadata, which is the venue's own published text on its own domain:
  - `/school-groups` → "Carr House offers a range of educational programs for school groups, from guided tours to scavenger hunts."
  - `/` → "Book a tour at Carr House and learn about Emily Carr and her legacy and upcoming events at this national historic site."
  - `/plan-your-visit-` → "Book a guided tour or art class, see our upcoming events or book a rental!"
  - `/educational-resources` → "Educational videos, activities and tours about Emily Carr and Carr House!"

- **Fields corrected: 0** (nothing survived long enough to need correcting).

- **Fields set to null after review: 5 categories**
  - `address`, and therefore `lat`, `lng`, `geo_source`. The street address is well known but it was not readable on the site in this run, and the rules forbid filling it from outside the venue's own pages or hand-placing a pin. `geo_source` is null rather than `geocode_pending`, because there is no address for the backfill script to work from.
  - `booking_email`, `booking_phone`, `booking_method` — no contact details were readable.
  - `general_admission_child_cad` / `general_admission_adult_cad`, `hours_notes` — not readable.
  - All facility booleans — not readable.
  - `programs[0].what_children_do` — the site names "guided tours" and "scavenger hunts" but never describes what a visit consists of, so this was left null rather than imagined.

- **Images: 0 recorded, deliberately.** Each page carries an og:image on the venue's own domain (e.g. `https://www.carrhouse.org/uploads/b/769b2f10-164b-11ec-87f7-2f2c96c7cfb2/Carr%20House%20August%202022.jpg`). Because page bodies did not render, no image had a readable alt attribute, and `alt` cannot honestly be generated for a photograph whose frame has not been seen — the rule is to describe only what is visibly in the frame. Rather than write a guess, the candidate hero URL is listed in `gaps` so a human can view it and caption it in one pass. This is why the record has no hero.

- **Conflicts recorded: 0.**

- **Authored fields written:** `our_note` and `practical_summary` on the one program. `our_note` rests on the single readable sentence about school programmes plus the honest statement of what is missing; `practical_summary` states plainly that nothing practical is published in readable form. `what_children_do` was left null on purpose. `mood_tags` `["explore","learn"]` rests on the two named activities — a guided tour is `learn`, a scavenger hunt is children finding things at their own pace, which is `explore`.

- **Meets minimum viable record: no.** Missing: `venue.address`, `venue.lat`, `venue.lng`, a hero image, and a program with `age_basis` plus a published age or grade range. Nothing was padded to clear the bar.

- **Confidence: low** — not because the site is thin, but because our fetch could not read it. Carr House very likely publishes prices, hours and school-programme detail that a browser would show; this record should be re-run with a JavaScript-capable fetch before anyone concludes the venue publishes nothing.

- **Recommended follow up by phone or email**, in priority order for a daycare director:
  1. **Re-run this venue with a browser-based fetch** — this single action probably resolves most of the list below.
  2. **Price** for a school or daycare group.
  3. **Youngest age** welcomed, and whether the guided tour or the scavenger hunt suits under-fives.
  4. **Capacity** — the house is small; ask the maximum group size and whether a class is split.
  5. **Lead time** for booking.
  6. **Lunch space**, indoors or otherwise.
  7. **Washrooms** and **step-free access** in a heritage house.
  8. Confirm the street address and booking contact.
