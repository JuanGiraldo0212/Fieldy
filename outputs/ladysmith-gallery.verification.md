# VERIFICATION — ladysmith-gallery

- **Fields checked:** 61 (33 venue, 1 program x full field set, 2 images)
- **Fields corrected:** 2
  - `lat` / `lng`: 48.994165 / -123.820904 -> 48.99417 / -123.81825, reason: the contact page carries both a Google Maps embed centre and a place link. The place link's `!3d…!4d…` pin is the pattern the prompt names for `site_embed` and it sits on High Street; the embed centre is the map viewport and sits about 200 m west. Pin used, both values recorded in gaps.
  - `booking_method`: `web_form` -> `null`, reason: there is no booking route for a visit. The gallery publishes a phone number and an email for buying artwork, not for booking a group.
- **Fields set to null after review:** 5
  - `general_admission_child_cad`, `general_admission_adult_cad` — the word admission never appears on either gallery page. Re-read from the live DOM to be sure, not just the fetch.
  - `has_washrooms`, `wheelchair_accessible`, `bus_parking` — no accessibility or facility text of any kind exists on the gallery pages. Nothing was inferred from the shopfront photograph.
  - Program `is_free` and `age_basis` left null for the same reason: neither is published.
- **Conflicts recorded:** 0. The two coordinate values on the contact page are a map centre and a map pin rather than two competing claims, so they are explained in `gaps` instead of being put in front of a director.
- **Authored fields written:** all three.
  - `what_children_do` rests on the September 2026 exhibition listing (mediums and dimensions of 50 hung works), the About page line about monthly exhibitions and the gallery boutique, and the interior photograph on the About page showing one long room with paintings on the walls and small works on plinths.
  - `our_note` rests on the single room shown in the interior photograph, on every piece carrying a price on the exhibition list, and on the site's own warning that hours vary on show changeover.
  - `practical_summary` rests on the total absence of facility text and of any admission price.
- **De-duplication against `art-council-of-ladysmith-and-district.json`:** the parent record's four children's classes, its Oyster Bay Drive address, its 250 phone number, `education@ladysmitharts.ca`, and its class images were all deliberately excluded. This record carries only the gallery's own High Street address, its own 604 number, `gallery@ladysmitharts.ca`, its own hours and its own two photographs. The cross reference sits in `gaps`.
- **Meets minimum viable record:** no. The program has no `age_basis` with a range and no cost field or `is_free`, because the site publishes neither an age range nor an admission price. Everything else the bar asks for is present, including an address, coordinates and a hero image with alt.
- **Confidence:** high. The site is small, it renders cleanly, the live DOM matched the fetch on every fact used, and the record's honest position is that this is a public gallery with nothing published for groups.
- **Recommended follow up by phone or email** (gallery@ladysmitharts.ca or 1-604-880-4291, in priority order):
  1. Does it cost anything for a group to come in, and is there a group rate?
  2. Youngest age they are happy to have in the room, given everything is for sale and hung at adult height.
  3. How many children they can take at once in one room.
  4. How much notice they want before a group arrives, and whether someone can talk to the children about the show.
  5. Whether there is a washroom, and where a group could eat.
  6. Step free access at the door, and whether a bus can stop on High Street.
