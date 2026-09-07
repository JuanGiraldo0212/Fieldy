# VERIFICATION — bailey-studio-nanaimo-theatre-group

- **Fields checked:** 58 (33 venue, 2 programs re-read against the season page in the live DOM, 4 images opened and looked at, provenance)
- **Fields corrected:** 3
  - `programs[*].capacity_max`: `172` -> `null`. 172 is the size of the room, not a stated per booking maximum. The number now sits in the description and in `gaps` where it belongs.
  - `images[0].url`: the rendered `src` is a Wix transform (`.../v1/fill/w_372,h_248,...`). Replaced with the untransformed original on the same CDN path, which is the largest available.
  - `venue.address`: the ticketing listing gives a different postcode from the contact page. The contact page value is kept and the disagreement is recorded as a conflict rather than silently resolved.
- **Fields set to null after review:** 5
  - `has_washrooms`, `has_lunch_space` — nowhere on the site. The lounge is described for refreshments only, which is not a lunch room and does not imply washrooms.
  - `bus_parking` — the site says free parking in their own lot and says nothing about buses. The verbatim line is kept in `facility_notes` so the tile is useful.
  - `stroller_accessible` — not addressed.
  - `hosts_school_groups`, `hosts_daycare_groups` — the site is silent, and silence is not a refusal. Left null, not false.
  - `programs[*].format` — nothing in the closed list fits sitting in a seat watching a play. Noted rather than forced.
- **Conflicts recorded:** 1, on the address. Their contact page gives V9R 5M2, which belongs to their post office box, and their own ticket page gives V9T 3R6 for the building. The note tells a director to drive to V9T 3R6.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on both programs.
  - `what_children_do` rests on the about page: an intimate 172 seat house with reserved seating, and "Refreshments can be enjoyed in our lounge."
  - `our_note` rests on the published minimum age of 3 for the December pantomime, on the reserved seating chart seen in their box office, and on the complete absence of any group or school booking route on the site.
  - `practical_summary` rests on the four accessibility and parking lines on the about page plus the holes listed in `gaps`.
- **Meets minimum viable record:** yes. `holiday-pantomime` carries id, name, `age_basis: years` with `age_min_years: 3`, `comes_to_you: false`, `is_free: false` and an `our_note`, and the venue has an address, coordinates, a category and a hero image with alt.
- **Confidence:** high on what is published, high on what is not. Every quoted line was re-read from the live DOM on 2026-09-07. The one soft judgement is `youngest_age_welcomed_years: 3`, which is a real published rule but is printed against the December pantomime rather than as a house rule; the caveat is spelled out in `restrictions`.
- **The direct answer to the two questions asked:**
  - **Bookable by a school or daycare as a group?** No. There is no schools page, no education page, no group rate, no block booking and no set aside matinee. Tickets are bought one seat at a time in their own online box office. The `/groups` page in their sitemap is a Wix members discussion feed for cast and crew, not group bookings.
  - **Youth or theatre school programme?** No. The only workshops are technical, stagecraft and acting sessions free to members, scheduled once enough people sign up. Children can take part in productions through family membership ($40 a year, up to two adults and any number of children under 19), and a cast member under 16 pays a $5 performance fee. That is participation, not a taught programme.
- **Recommended follow up by phone (tickets 250-758-7224, general 250-758-7246) or email (nanaimotheatregroup@gmail.com), in priority order:**
  1. Ticket price, and whether there is any rate for a group. Nothing is published on their own site.
  2. Whether they will hold a block of seats for a class, and how far ahead.
  3. Whether under threes really are turned away at the pantomime.
  4. Washrooms, and how many.
  5. Somewhere for a group to eat before or after.
  6. Whether a school bus can get into and out of the lot.
  7. Running time and whether there is an interval.
