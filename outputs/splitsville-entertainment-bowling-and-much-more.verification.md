# VERIFICATION — Splitsville Bowl Nanaimo (splitsville-entertainment-bowling-and-much-more.json)

- **Fields checked:** 61 venue and program fields, 4 images, 3 conflicts.
- **Fields corrected:** 5
  - `venue.website`: www.splitsville.ca -> https://www.splitsvillebowl.ca/nanaimo-bowling. splitsville.ca 301s to splitsvillebowl.ca; the chain rebranded. The bare domain and the www host both redirect to the same live site.
  - `venue.name`: "Splitsville Entertainment – Bowling and Much More" (tracker) -> "Splitsville Bowl Nanaimo", the name the site now uses on every page and in its JSON-LD.
  - `venue.lat`/`lng`: first taken from the page's `BowlingAlley` JSON-LD (49.1666, -123.9424) -> 49.16855, -123.98640 from the `LocalBusiness` JSON-LD on the same page. The first point sits about 3.2 km east of 171 Calder Road; the second matches an independent geocode of the address to within about 40 m. Recorded as a conflict.
  - `programs[school-trip-bowling].cost_per_child_cad`: 20.00 (the page banner) -> 7.99, the itemised per person price for 60 minutes of bowling. The banner contradicts its own list. Recorded as a conflict.
  - `programs[kids-party-package]`: first written as `cost_per_child_cad` 16.50 -> `cost_per_group_cad` 99.00 with `capacity_max` 6. The footnote is explicit: "$99, up to six (6) kids per package. $16.50 per child based on 6 kids (1 package)". This is a per-group price.
- **Fields set to null after review:** 4
  - `has_washrooms` — never mentioned on any page.
  - `has_lunch_space` — the centre plainly has tables, so `false` would be wrong, but outside food is banned. Left null with the ban in `restrictions`.
  - `youngest_age_welcomed_years` — the site says bowling suits "ages 3 to 93" but also that under-threes can bowl with an adult helping, so there is no minimum to record.
  - `price_year_or_season` — no page carries a year or season for any price.
- **Conflicts recorded:** 3 (the $20 banner against the $7.99 list; full opening hours against a "we are updating our hours, please call" line on the same page; two JSON-LD map points about 3 km apart).
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs. They rest on the school trips price list, the Nanaimo party package footnotes, the per lane pricing table, the accessibility answer in the site FAQ, the outside-food and supervision rules, and the free on-site parking line on the Nanaimo page.
- **Meets minimum viable record:** yes. Address, coordinates, hero image with alt and a program with age basis, range, cost, `comes_to_you` and an authored note are all present.
- **Confidence:** medium-high. The Nanaimo-specific prices, hours and address are on the centre's own page and were re-read from the live DOM; the school trip prices are published once for the whole chain and are not repeated for Nanaimo.
- **What the browser changed:** the site's FAQ answers are inside collapsed accordions and return nothing to a plain fetch. Reading them live produced the six-guests-per-lane limit, the "children under 12 must be supervised by an adult or caregiver over 16" rule, the 48 hour reschedule-for-credit cancellation terms, the outside food ban, the wheelchair accessible lanes answer and the 72 hour party booking minimum. The browser also surfaced the second, correct JSON-LD coordinate block.
- **Recommended follow up by phone (250-754-2442) or the events form, in priority order:**
  1. Price: get a written per-child quote for a school trip at the Nanaimo centre, and settle whether $20 or $7.99 is the starting point and whether tax is on top.
  2. Youngest age: whether a preschool group is welcome, since the only age rule published is the 15-and-under party limit.
  3. Capacity: how many lanes they will hold for one group, since six children per lane is the hard limit.
  4. Lead time: minimum notice for a weekday school booking.
  5. Lunch space: where a group eats, given outside food is not allowed.
  6. Washrooms: number and location, and whether there is a change table.
  7. Bus parking: whether a school bus can park or turn in the Calder Road lot.
