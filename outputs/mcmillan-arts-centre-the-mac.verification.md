# McMillan Arts Centre - The MAC — VERIFICATION

- **Fields checked:** 82 (33 venue, 3 programs, 3 images, 1 conflict)

- **Fields corrected:** 2
  - `venue.booking_phone`: "(250) 248-8399" -> "1-250-248-8185". Both numbers are live on the site. The 8185 number appears on the contact page and the room rentals page, the 8399 number only in the map panel on the home page. The disagreement is recorded in `conflicts`.
  - `venue.address`: dropped the postal code. The home page prints V9P 2H5 under the street address, but the contact page gives V9P 2H5 as the code for their PO Box. The street address is recorded without it and the ambiguity is in gaps.

- **Fields set to null after review:** 6
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` — searching their own shop and pages for school group, field trip, daycare, preschool and class visit returned nothing relevant. Silence is not a refusal, so both are null rather than false.
  - `venue.has_washrooms`, `venue.has_lunch_space`, `venue.wheelchair_accessible`, `venue.bus_parking` — none of these is stated. The room rentals page mentions access to a full kitchen, but that is written for people hiring a room, not for a visiting group, so it was not used to claim a place to eat.
  - `programs[gallery-visit].is_free` — no admission price is published and nothing says visiting is free.
  - `programs[creative-kids-summer-classes].what_children_do` — the page describes the length, the number of classes and the location but never what the children actually do, so it was left null rather than imagined.

- **Conflicts recorded:** 1
  - Two different phone numbers for the same building.

- **Authored fields written:** `what_children_do` on two of three programs, `our_note` and `practical_summary` on all three.
  - `what_children_do` for the gallery visit rests on the About Us description of the galleries and the artists in residence page. For the after school club it rests on the product description: art games to loosen up, a short lesson, then the week's project, named as watercolour ocean silhouettes for that date.
  - `our_note` rests on the 11 to 3 Tuesday to Sunday hours, the 4 pm start after those hours close, the twelve place cap, the per child rather than per class purchase, the finished summer season and the $10 lunch hour charge.
  - `practical_summary` rests mostly on what is missing, plus the 1913 schoolhouse building, the community garden at the back and its roughly 10 to 6 opening.

- **Meets minimum viable record:** yes. Validator reports it as publishable. The after school club supplies `age_basis` years with ages 7 to 15, `cost_per_child_cad` 25 and `our_note`; the venue has an address, geocoded coordinates and a hero image with alt.

- **Confidence:** medium. The facts recorded are solid and were re-read from the live pages, but the record is thin where a director most needs it: there is no school or daycare offering here, no admission price, and nothing at all about washrooms, lunch or access. The class bookable versus family registration question, which is the reason this venue was flagged, has a clear answer: everything for children here is an individual family registration bought one seat and one date at a time in the online shop, capped at twelve places. Nothing on the site is bookable by a class.

- **Recommended follow up by phone (1-250-248-8185) or through their contact form**, in priority order:
  1. Whether a school or daycare group can visit the galleries at all, and what it costs.
  2. Whether the MAC School will run a session for a booked group rather than for individual families, and at what price.
  3. Whether anything is coming back for the under fives, since that collection is currently empty.
  4. How many children they can take at once, in the galleries and in the studio.
  5. How much notice they want for a group.
  6. Whether there is anywhere indoors for a group to eat.
  7. Washrooms, step free access and where a bus can stop on McMillan Street.
