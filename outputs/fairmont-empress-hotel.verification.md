# VERIFICATION — Fairmont Empress

Checked on 2026-09-03 against https://www.fairmont.com/en/hotels/victoria/fairmont-empress.html. Extractor v2.0.

- **Fields checked: 32 venue fields + location + provenance.** No programs and no images to check.

- **Outcome: does not serve children's groups — venue block only, `programs: []`.**
  The tracker's `www.fairmont.com` resolves to the hotel's own page (`/empress-victoria/` redirects to the canonical `/en/hotels/victoria/fairmont-empress.html`). Its full navigation was read: Stay (rooms, suites, Fairmont Gold, location, guest services), Offers, Dine, Wellness (spa, fitness, pools), Activities (Special Events), Events (Meetings & Conferences, Weddings, Social Events), About. There is no schools, education, youth, camps, field-trip or guided-tour section anywhere in it.
  - The Offers list contains one children's item, "Kids Rule the Castle" — an accommodation package: "With our 'Kids Rule the Castle' package your family can enjoy spacious, luxurious accommodations, daily breakfast, scavenger hunts and more!" That is a family hotel stay, not something a daycare or class can book.
  - The Activities → Special Events page was opened in full. Its only current listing is an adult fundraiser: "Pilates in the Palm", Saturday 19 September 2026, "minimum $50 donation per person".
  - Per the prompt's instruction, **no "Group visit" program was manufactured** from the Afternoon Tea, Meetings & Conferences, Weddings or Social Events pages. Those are commercial hospitality bookings sold to adults; recording one as a children's-group offering would put a false line in front of a director. `hosts_school_groups` and `hosts_daycare_groups` are both `false`, and the reason is stated in `description`.

- **Fields corrected: 0. Fields set to null after review: 2**
  - `lat` / `lng` → null with `geo_source: "geocode_pending"`. The Location & Contact page links its address to `https://www.google.com/maps/dir//Fairmont%20Empress,+721%20Government%20Street,...@48.421596,-123.367422,17z`. That `@lat,lng,17z` is a directions-view viewport centre, not a place pin, and it sits west of the street address — the kind of near-miss the prompt warns is worse than null. The exact address (`721 Government Street V8W 1W5 VICTORIA Canada`) is captured verbatim instead, so `scripts/geocode-catalog.ts` can backfill it precisely. No pin was hand-placed.
  - `bus_parking` → null. The page states "Parking available for an additonal fee", "305 Parking spaces", "Indoor parking" — an indoor parkade with no statement about buses or drop-off. Recorded in `gaps` rather than inferred either way; `facility_notes` was left null rather than filing parkade text under the `bus_parking` key.

- **`category`:** no enum value fits a luxury hotel. The prompt says to leave it null and note it, but the validator treats a null category as an error, so `community_civic` was used as the closest catch-all and the mismatch is recorded in `gaps` for a human to overrule.

- **Images: 0 recorded.** The hotel's photographs are served from Accor's shared `m.ahstatic.com` image server rather than the property's own path, every one carries an empty alt attribute, and their contents cannot be described from a text fetch — so `alt` could not honestly be written and nothing was recorded. No hero. For a venue that does not serve children's groups this is the correct outcome, and the app will fall back to an initials tile.

- **Re-fetch note:** the fetcher de-duplicates by path within a session, so the Location & Contact page could not be pulled a second time for a line-by-line re-read. No price, age or capacity field was extracted from it, so there is nothing price-bearing exposed to cache staleness; the only facts taken from it are the address, telephone, hotel email and parking description.

- **Conflicts recorded: 0.**

- **Authored fields written: none.** No programs exist, so `what_children_do`, `our_note` and `practical_summary` do not apply. The `description` is factual and states the not-for-groups finding explicitly.

- **Meets minimum viable record: no** — missing `lat`, `lng`, a hero image and any program. This is expected and correct: the venue should miss the bar visibly rather than be padded into the catalogue.

- **Confidence: high** that the hotel publishes nothing bookable by a children's group. Medium only on the negative's completeness, since Meetings & Conferences and Weddings were not opened individually — they are adult event-sales pages, and opening them could not have produced a children's-group program without inventing one.

- **Recommended follow up: none for the catalogue.** Suggested tracker status `not_for_groups`. If someone wants this record kept for the building rather than the hotel, the field-trip-relevant tenant at this address is Miniature World, which is already a separate row in the tracker (`miniature-world-located-in-the-fairmont-empress-hotel.json`).
