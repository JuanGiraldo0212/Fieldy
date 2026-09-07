# VERIFICATION — canadian-indigenous-art-inc

- **Fields checked:** 36 (33 venue, images array, provenance). No programs to check.
- **Fields corrected:** 2
  - `images[0].url`: switched from the untransformed original to the `-700x700` derivative, because the derivative is the URL actually present on the home page recorded in `found_on_url`. The original resolves too, but was not on the page.
  - `venue.lat` / `venue.lng`: first taken from an independent lookup of the street address, which resolved only to the Wharf Street segment. Replaced with the coordinates the site itself publishes in the map script on its contact page, `49.16617774304996, -123.93654108465945`, recorded to five decimal places.
- **Fields set to null after review:** 4
  - `booking_method`, `booking_url` — the shop's checkout is for buying art and posting it, not for booking a visit. Recording `shop` would suggest a visit can be booked.
  - `youngest_age_welcomed_years` — not addressed.
  - `has_washrooms`, `has_lunch_space`, accessibility and parking — nothing on the site addresses any of them.
- **Conflicts recorded:** 0.
- **Authored fields written:** none of the three. There are no programs, so `what_children_do`, `our_note` and `practical_summary` do not exist on this record. `venue.description` is a factual summary, not authored advice.
- **Meets minimum viable record:** no, and deliberately. Missing: at least one program. This is the prompt's rule for a venue that does not serve children's groups, and the same shape as `mark-loria-gallery-contemporary-indigenous-art.json` already in this catalog. A "Group visit" programme was **not** invented.
- **Why `hosts_school_groups` and `hosts_daycare_groups` are `false` rather than `null`:** this is not silence. It is a retail gallery with a cart, a checkout, a shipping policy and a fourteen day returns window, whose entire navigation is product categories. Every page was searched for school, field trip, group visit, tour, workshop, demonstration, children, kids, student, education and class, and not one of those words appears anywhere on the site. That is the "retail only" carve out in the prompt, not an unanswered question. The gaps list still tells a director to ring first if she wants to take children in.
- **Coordinates:** `site_embed`. The contact page carries two Google Maps JS blocks. The first builds a marker titled "North Vancouver Gallery" at 49.320080, -123.095550, which lands in North Vancouver where their other shop is. The second uses `49.16617774304996, -123.93654108465945` as both the map centre and the marker position, so it is a place pin and not a viewport centre. An independent lookup of 78 Wharf St, Nanaimo returns the same block of Wharf Street, so the point is sane.
- **On the relocation:** the site's own popup, dated 25 March 2026, is titled "The Nanaimo Gallery Has Moved!!". That page now throws a WordPress error and its body could not be read, so the previous address is unknown. The address recorded here, 78 Wharf St, is what appears in the footer of every page and in the FAQ page whose own modified date is 28 April 2026, a month after the move notice, so it is the current one.
- **Confidence:** high. The site is plain server rendered WordPress, everything was confirmed live, and the finding is a negative one that is easy to be sure about.
- **Recommended follow up by phone (250-591-4767) or email (info@canadianindigenousart.com), in priority order, and only if a director wants to try anyway:**
  1. Will they let a group of children in at all, and how many at once?
  2. Is there any charge, or any talk or demonstration on offer?
  3. Is anything allowed to be touched, or is it look only?
  4. Washrooms, and whether a group can wait indoors.
  5. Where a bus or a group would park near 78 Wharf St.
