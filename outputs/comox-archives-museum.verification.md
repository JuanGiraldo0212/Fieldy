# VERIFICATION — comox-archives-museum

- **Fields checked:** 58 (33 venue, 1 program block of 46 fields, 2 image blocks, 3 conflicts)
- **Fields corrected:** 2
  - `venue.website`: `www.comoxmuseum.ca` -> `https://comoxmuseum.ca/` — the www host redirects to the bare domain and the page's own canonical link is `https://comoxmuseum.ca/`. Tracker column corrected to match.
  - `venue.name`: `Comox Archives & Museum` (tracker) -> `Comox Archives and Museum` — the site writes it out in full everywhere.
- **Fields set to null after review:** 5
  - `programs[0].format` — a self-guided visit is the obvious reading but the site never describes how a visit is run, so it was not asserted.
  - `venue.has_washrooms`, `venue.has_lunch_space`, `venue.has_rain_backup`, `venue.wheelchair_accessible` — the two interior photographs show an indoor gallery but no facility is described in text anywhere on the site, so none was inferred from a photo.
  - `general_admission_child_cad` / `general_admission_adult_cad` and `programs[0].is_free` all left null. **The site never mentions admission at all.** It is not "by donation" here; the only donation wording is an invitation to support the society's ongoing work through CanadaHelps and a Square link. That wording sits in the fees note, not in a price field.
- **Conflicts recorded:** 3 — opening hours (10am-4pm vs 12pm-4pm), email address (gmail vs shaw), phone number (250-339-2885 vs 250-339-2285, one digit apart). All three were confirmed in the live DOM on both pages, not just in a fetch.
- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary` on the single Group visit program.
  - `what_children_do` rests on "The museum displays showcase the early development and history of the region. There is also a temporary exhibit area..." plus the current 1945–46 exhibit description.
  - `our_note` rests on the single-building scale of the museum and on the total absence of group, price and age information.
  - `practical_summary` is generated from the facility fields (all null) plus the gaps list.
- **Meets minimum viable record:** no. Missing a program with `age_basis` plus a published range. The site publishes no ages, grades, prices, capacity or lead time for anything, so the program cannot clear the bar without invention. Venue block itself is complete: id, name, address, lat, lng, category, checked_on and a hero image with alt are all present.
- **Confidence:** medium. The address, hours, contact route, exhibit content and images are all solid and were confirmed in a live browser. Everything about *groups* is absent, so the record is honest but thin rather than uncertain.
- **Location:** `geocoded`. The site has no map embed, no coordinates, no JSON-LD address block. 49.67255, -124.92426 from the published street address (1729 Comox Avenue, Comox), which resolves to that exact house number on Comox Avenue in Comox. Sits well inside the Vancouver Island box and within a few hundred metres of Comox town centre.
- **Question in the brief, answered:** no school programs exist on this site. The archives are a research service, viewed by appointment arranged by phone, aimed at family historians rather than children. Admission is **not** advertised as by donation, and is not advertised at all.

## Recommended follow up by phone or email, in priority order

1. **Price** — is there any admission charge, and is there a group rate? Nothing is published.
2. **Do they take school or daycare groups at all?** Their own news post shows a children's art camp visiting for a museum art tour, but no such tour is offered anywhere on the site.
3. **Youngest age** they will take in a booked group.
4. **Capacity** — how many children fit in the gallery at once.
5. **Lead time** — how far ahead they need to know.
6. **Lunch space** — is there anywhere indoors to eat, and is the park or waterfront the fallback.
7. **Washrooms** — how many, and is there a change table.
8. **Opening time on the day** — settle the 10am versus 12pm discrepancy before planning a morning.
