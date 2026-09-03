# VERIFICATION — Greater Victoria Sports Hall of Fame

- **Fields checked:** 79 (33 venue, 46 program, 3 × 11 image, plus provenance blocks)

- **Fields corrected:** 0. Nothing needed changing on the second pass — almost every field was null to begin with, because the site publishes almost nothing a group leader could act on.

- **Fields set to null after review:** 0 corrections, but the following were held null deliberately and re-confirmed rather than filled to make the record look complete:
  - `hosts_school_groups` and `hosts_daycare_groups` — **left null, not false.** The site never addresses groups either way. It is not a private gallery, not adults-only, not closed and not retail, so the "clearly does not serve children's groups" carve-out does not apply. Per the field note, silence about under-fives is null, not false.
  - `general_admission_child_cad` / `general_admission_adult_cad` / `programs[0].is_free` — no admission price and no statement that viewing is free. Not guessed in either direction.
  - `hours_notes` — the displays sit inside an arena, so it is tempting to write "follows arena hours". The site does not say that, so it stays null and the inference is confined to `our_note`, which is an authored field and marked as such.
  - `has_washrooms`, `has_lunch_space`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking`, `facility_notes` — a large public arena almost certainly has washrooms, but the Hall of Fame's own site never says so, and the app's amber "not stated" row is the honest render.

- **Conflicts recorded:** 0. The location statement is repeated identically in the footer block of every page read, and nothing on the site contradicts it.

- **Verification method:**
  - `https://www.gvshof.ca` — **re-fetched with a `?v=1` cache-buster.** The evidence quote was confirmed verbatim and unchanged: "Our displays are seen at the Save-On-Foods Memorial Centre (1925 Blanshard St.) through Gate Three." One useful finding from the cache-buster: the homepage's large inductee slideshow served a **completely different set of images** on the second fetch (a Jack Short slide instead of a Bill Prior slide). That confirms the homepage gallery is randomised per request, and it is the reason no homepage gallery image was recorded — an image URL captured from that rotator would not reliably be on the page a reviewer later opens. All three recorded images come from the Artifacts page, whose gallery is a fixed set and rendered identically on both reads.
  - `https://www.gvshof.ca/artifacts.html` — all three recorded image URLs were present in the fetched markup of this page, which is the `found_on_url` recorded against each.
  - `https://www.gvshof.ca/events.html` and `/news.html` — checked specifically for a school, youth or education program. There is none. The events listed are an induction dinner ($155 with a $50 tax receipt, Nov 2026), a HarbourCats game, a golf tournament and the PISE Family Sport and Recreation Festival, which is PISE's event, not this venue's, and is described on a partner domain. None of those prices are recorded, correctly — they are fundraiser ticket prices, not a group rate.
  - `https://www.gvshof.ca/contact/board-of-directors.html` — checked for a bookable contact. Every board email on the page is rendered as "This email address is being protected from spambots. You need JavaScript enabled to view it." and could not be read, so `booking_email` is null and that is recorded in `gaps` rather than an address being guessed from elsewhere.

- **Cost check:** the single program carries no cost field at all, so there is no per-class/per-child confusion to make.

- **Capacity check:** null. No number of any kind is published.

- **`school_rate_only`:** false. Correct — there is no rate.

- **Location:** `geo_source: "geocode_pending"`. No Maps embed, no JSON-LD, no `og:latitude` anywhere on the site. The address is recorded as the site writes it, "Save-On-Foods Memorial Centre, 1925 Blanshard St." — note for the backfill script that the site publishes **no city and no postal code**, so the geocoder should be given the venue region (Victoria, BC) from the tracker rather than relying on the address string alone. No pin was hand-placed.

- **Images:** 3 entries, exactly 1 `hero`. All absolute, all https, all on `www.gvshof.ca/images/`, all confirmed present on `artifacts.html`. **The hero is an honest compromise and a reviewer should know it:** there is no photograph anywhere on this site of the display area, of Gate Three, or of the arena exterior — nothing that shows what a group would actually see on arrival. The best available substitute is a photograph of an object that is in the collection, so an artifact photo carries the `hero` role, and `gaps` says so explicitly. All three `alt` values are `generated`, because every image in this gallery has an empty `alt` attribute; each generated alt is grounded in the gallery's own caption and claims nothing about the image beyond what the caption states, since the image files themselves were not opened. `caption` on each is the verbatim gallery caption. `rights_note` is null on all three — the footer line "All Rights Reserved © 2023 Gulf Islands..." style site-wide notice on this site is likewise not a photo credit. `usage` is `unverified` throughout.

- **Authored fields written:** all three.
  - `what_children_do` rests on the location sentence plus the Artifacts gallery captions, which enumerate exactly what is in the cases: trophies, jerseys, medals, team photographs, skates and cleats, championship programs.
  - `our_note` rests on the fact that the venue is a display inside an event building with no published hours and no staffed contact — the catch that is not obvious from the venue's name.
  - `practical_summary` rests on the near-total absence of visitor information plus the `gaps` list.
  - `mood_tags`: `explore`, and only `explore`. The children walk past cases and look at things at their own pace. `learn` was considered and rejected — there is no guide, no talk and no published interpretation, so a child would say they looked at old trophies, not that they were taught something. `play` was rejected outright: nothing here is hands-on.

- **Meets minimum viable record:** no. Missing `venue.lat`/`venue.lng` (pending geocode) **and** the program bar, because the one program has no `age_basis` with a range and no cost field or `is_free`. Neither could be filled without inventing. This venue should miss the bar visibly — a single phone call would fix most of it.

- **Confidence:** low. Only one fact about visiting is published anywhere on this site, the location sentence, and everything else in the record is either null or authored from that one sentence plus a gallery of object photos.

- **Recommended follow up by phone or email** (via the Contact President form at https://www.gvshof.ca/contact/email-the-president.html — there is no published phone number for visits; in priority order for a daycare director):
  1. **Price** — is there any charge to see the display, and is a group treated differently.
  2. **Youngest age / are groups welcome at all** — the site never says. Establish whether a booked group is even a thing they do.
  3. **Hours and access** — which days and hours Gate Three is open, and whether an event at the arena closes the display.
  4. **Capacity** — how many children fit in front of the cases at once.
  5. **Lead time** — whether they want notice before a group arrives.
  6. **Lunch space and washrooms** — whether the arena concourse facilities are open to display visitors.
  7. **Rain backup** — not needed, it is indoors, but confirm there is somewhere to wait if the gate is not yet open.
  8. **The second display** at the North Saanich Canadian Tire — where it is and whether it is easier to visit.
