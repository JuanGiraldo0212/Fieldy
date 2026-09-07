# VERIFICATION — Miniature World

- **Fields checked:** 48 non-null values across the venue block, 1 program and 4 images. The rates page was reopened in a browser after the JSON was written and every figure re-read.
- **Fields corrected:** 1 after the JSON was written. The gaps line about the prices carrying no year was rewritten to note that the rates page itself carries a modified date of 25 August 2026 in its markup, so the figures are current.
- **Decisions taken during extraction, recorded so they can be audited:**
  - `lat` / `lng` come from the place marker in the Google Maps link on the contact page (`!3d48.4223763!4d-123.3669183`), rounded to 48.42238 and -123.36692, not from the map embed centre on the same page, which sits about 150 metres west. `geo_source` is `site_embed` because both are published on the venue's own page.
  - `booking_method` is `phone`, not `shop`. The Book Now button goes to a ticketing checkout, but the groups page tells a class to book or phone for more information and the contact form has a Group Bookings option.
- **Fields set to null after review:** 4
  - `has_washrooms`, `has_lunch_space`, `wheelchair_accessible` and `stroller_accessible`. Nothing on the site addresses any of them. Being inside a hotel is not evidence.
  - `bus_parking` stays null while the parking paragraph is kept verbatim in the facility notes, because it is written about cars, not coaches.
- **Conflicts recorded:** 0. The rates page is the only page giving prices and it agrees with itself.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary`.
  - `what_children_do` rests on the exhibit descriptions on the home and groups pages: dioramas, the model railway, dollhouses, castles, the circus and the spaceship, with lighting, sound and animation.
  - `our_note` rests on the fact that every display is a diorama behind glass, on the parking paragraph on the contact page, and on the absence of any stated visit length or adult ratio.
  - `practical_summary` rests on the daily hours, the group discounts, and the four practical fields the site never mentions.
- **Price check:** the site publishes admission of $22.50 adult, $15.25 youth 13 to 17, $11.25 child 5 to 12, tots free, plus $1.00 off each for groups of 5 to 9 and $1.50 off each for groups of 10 or more. `cost_per_child_cad` 9.75 and `cost_per_adult_cad` 21.00 are the published child and adult prices less the published group discount for ten or more. This is a subtraction the site asks you to perform, not a quoted school rate; it is spelled out in the program description and flagged in gaps. There is no per class or per group fee here, so no per group figure was recorded. `tax_included` is false because the page says all admissions are subject to 5% tax.
- **Meets minimum viable record:** no. The program has no `age_basis` and no age or grade range, because the site publishes age bands for ticket prices only and states no age range for a class visit.
- **Confidence:** high on price, hours, address and coordinates, all re-read in a browser and dated in the page markup to August 2026; low on everything logistical, because the site says nothing about washrooms, lunch, access or how long to allow.
- **Recommended follow up by phone (250-385-9731):**
  1. Confirm the group price per child and whether there is a separate school rate.
  2. How long to allow for a class, and whether they book time slots.
  3. Maximum group size at one time.
  4. How many adults have to come, and whether teachers or chaperones get in free.
  5. Washrooms and anywhere to eat, inside or nearby.
  6. Step free and stroller access from Humboldt Street.
  7. Where a bus can drop off and pick up.
