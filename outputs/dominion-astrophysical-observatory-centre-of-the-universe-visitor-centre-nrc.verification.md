# VERIFICATION — Centre of the Universe / Dominion Astrophysical Observatory

Checked on 2026-09-03 against https://www.centreoftheuniverse.org. Extractor v2.0.

- **Fields checked: 74** (32 venue fields, 3 programs re-read against their source pages, 4 images, location, provenance)

- **Fields corrected: 0.** Every price-bearing page was re-fetched in the verification pass and returned byte-identical copy — no stale-cache drift found.
  - `/school-tours` re-read: "School year 2024/5 cost: $80 per class", "Tours are 1 1/2 to 2 hours in length", "Up to 2 classes per tour", ratios "Grades K-2: one adult per 6 students / Grades 3-12: one adult per 12 students", days "Tuesdays, Wednesdays, Thursdays, and Fridays" — all match.
  - `/camps` re-read: "Cost: $10.00 per child", "Leaders are included in the program fee", "Group size: Up to 25 participants", "two-hour" — all match.
  - `/community-tours` re-read: "Cost: $10.00 per participant (leaders included)", "Group size: Up to 20 participants" — all match.
  - `/visit-us` re-read: admission $21 / $18 / $15 / free under 6, hours, "There are two spaces assigned for tour buses" — all match.
  - Note: the fetcher de-duplicates by path, so cache-busting query strings return empty; a trailing-slash variant of each path was used to force a genuine second fetch.

- **Fields set to null after review: 3**
  - `programs[0].capacity_max` → null. The site says "Up to 2 classes per tour", which is not a headcount; recorded in the description instead so nobody reads "2" as a capacity.
  - `programs[1].lead_time_days` → null. "at least one week's advance booking" applies only to groups larger than 25, not as a minimum notice for all bookings; kept in the description.
  - `programs[1].days_offered` → null. "typically scheduled weekday mornings and afternoons" is a tendency, not a published schedule; kept in the description.
  - Also deliberately left null: `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `youngest_age_welcomed_years`. The site never addresses any of them. It mentions a water-bottle refill station, which is not a washroom, and the camp booking form asks about accessibility needs, which is not an accessibility statement.

- **Costs re-checked for the per-class / per-child trap:** the school rate is $80 **per class** → `cost_per_group_cad`, `school_rate_only: true` (it sits on a page titled School Tours and is written "per class"). Camp and community rates are per child/participant → `cost_per_child_cad`. No program has both cost fields set.

- **Age basis:** the site publishes grade bands only (K-1 through 10-12), so `age_basis: "grades"`, `grade_min: 0`, `grade_max: 12`, both age fields null. Camp and community tours publish no age or grade range at all, so `age_basis` is null for those two rather than borrowed from the school page.

- **Conflicts recorded: 0.** `/educate` and `/school-tours` carry identical school-tour copy, so there is nothing to reconcile. One near-conflict was investigated and rejected: the `/visit-us` Google Maps *embed* carries `!2d-123.43437681579864!3d48.51469547195994`, about 700 m from the coordinate used. That embed parameter is a wide-area viewport centre (`!1d84574`, an ~84 km span), not a place pin, so it is not a competing claim about where the venue is. The coordinate used comes from the homepage's Google Maps place link, `?ll=48.520021,-123.418766&z=19...&cid=14698586828479140095` — zoom 19 on a specific place id, i.e. the pin itself. `geo_source: "site_embed"` is therefore honest: no geocoder was called and no pin was hand-placed.

- **Images:** 4 recorded, all absolute https on images.squarespace-cdn.com (the site's own Squarespace CDN), all confirmed present on the `found_on_url` recorded during the verification re-fetch. Every `alt` is the site's own alt attribute verbatim (`alt_source: "site"`) — none was a filename, so nothing needed generating. No captions were invented; no `rights_note` was set, because the only credit-like text is the photographer's name inside a filename and a site-wide footer copyright line, neither of which is an image credit. One hero exists. The homepage og:image is a blue logo social card, not a photograph, so it was skipped per the rule and the hero was taken from the lead photo on `/visit-us`; this is stated in gaps.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on the published inclusions: dome tour, planetarium show, chosen presentation, gallery exploration, auditorium activity, take-home craft. The "get you up and moving too" line is quoted from the grade 3-4 topic.
  - `our_note` rests on the per-class price and its 2024/5 label, the Tuesday-Friday window, the hairpin-bend warning to coaches, the "adapted to suit the age of your group" line, the pay-on-the-day-or-invoice option, and the leaders-included pricing.
  - `practical_summary` rests on the free parking with two bus spaces plus the absence of any washroom, lunch or accessibility statement.
  - `mood_tags` were judged from what the children do, not the category: school tour `["learn","explore"]` (mostly guided presentation plus gallery wandering); camp visit `["play","creative","learn"]` (hands-on exhibits and a craft they make and keep); community tour `["learn","explore"]`.

- **Meets minimum viable record: yes.** id, name, address, lat, lng, category, checked_on, one hero with alt; and the school tour carries id, name, age_basis + grade range, comes_to_you, a cost field and our_note. Validator: no errors, no NOT PUBLISHABLE warning.

- **Confidence: high.** Three group offerings are described in detail on their own pages with explicit prices, group sizes and ratios, and every one survived a second fetch unchanged; the only soft spot is the school price still being labelled for school year 2024/5.

- **Recommended follow up by phone or email** (250 363 3638 / schools@centreoftheuniverse.org), in priority order for a daycare director:
  1. **Price** — is $80 per class still current, two school years after the label on the page?
  2. **Youngest age** — nothing is published; the camp visit is "adapted to suit the age of your group" but no floor is given.
  3. **Capacity** — school tours are sold as "up to 2 classes"; ask for the actual headcount ceiling.
  4. **Lead time** — no minimum notice is published for school or community bookings.
  5. **Lunch space** — nowhere on the site; a two-hour visit up a hill needs a plan.
  6. **Washrooms** — never mentioned.
  7. **Rain backup** — the programme is indoors, but the walk between buildings is not; and confirm step-free access, since the site publishes none.
