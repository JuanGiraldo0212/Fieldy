# VERIFICATION - Metchosin Pioneer Museum

- **Fields checked:** 34 venue fields, 2 programs (46 fields each), 4 image entries. Both program `source_url`s were reopened in a browser and every non-null value re-read against the page.
- **Fields corrected:** 3
  - `programs[0].evidence`: `"Cost: F i v e  d o l l a r s/student"` (two ordinary spaces) -> the same string with a non-breaking space before the ordinary one, matching the page byte for byte. Reason: the quote has to be verbatim to be auditable, and the site's spacing is deliberate.
  - `programs[0].age_basis`: `"grades"` -> `null`. Reason: the page talks about grade level but publishes no grade range, and `age_basis` without a range is a claim the site does not make.
  - `venue.wheelchair_accessible`: `false` -> `null`, with the verbatim sentence moved into the facility note. Reason: the site says "partially accessible", which is neither yes nor no, and a bare `false` would wrongly tell a director not to come.
- **Fields set to null after review:** 4
  - `programs[0].duration_min` (the site gives 30, 45 or 60 minutes per museum depending on grade; there is no single number)
  - `programs[0].capacity_max` and `capacity_min` (see below)
  - `venue.price_year_or_season` (the field trip page is undated on its face)
- **Conflicts recorded:** 0

## Price, and the per-student check

This is the field the pipeline gets wrong most often, so it was checked twice. The page reads `Cost: F i v e  d o l l a r s/student`, with the words spelled out letter by letter, which is almost certainly there to defeat scrapers. It is unambiguously **per student**, not per class or per group, so it is recorded as `cost_per_child_cad: 5` with `cost_per_group_cad` null. `school_rate_only` is `true`: the price sits on a page headed "School Field Trips by Appointment" and is written per student, which is exactly the case that should show a daycare account a "quoted separately" banner.

## Staleness check

Explicitly checked, because a small volunteer-run museum site can be years out of date. The Book a Field Trip page was last updated 4 April 2026, so the five dollar price and the Thursday and Friday availability are current and `price_year_or_season` is correctly null. The Pioneer Museum background page is a history piece signed November 2018, and the footer copyright reads 2026. The 2018 date is noted in `gaps` so nobody mistakes the history text for current visitor information, but it does not affect any recorded fact.

## Capacity, and what was deliberately not borrowed

The Tours by Appointment page reads: "The Schoolhouse Museum is fully wheelchair accessible. Maximum occupancy is 12 visitors. The Pioneer Museum is partially accessible." The 12 sits immediately after the Schoolhouse sentence, so it most likely describes the Schoolhouse, not this museum. It was **not** copied into `capacity_max` here. The ambiguity is written into `gaps` instead, which is the honest answer.

## Keeping this record to the Pioneer Museum

There is a separate tracker row for the Metchosin Schoolhouse Museum on the same domain, handled elsewhere, and the two were not merged. That said, the site treats them as one operation, and per the instruction that is recorded in `gaps` rather than smoothed over: one Museum Society runs both, they sit across the road from each other at 4450 and 4475 Happy Valley Road, and the published field trip is a single visit that splits a class between the two buildings with a shared price, shared booking form and a shared accessibility sentence. The programs here describe the Pioneer Museum's half accurately and name the Schoolhouse half rather than pretending it is not part of the visit.

## Field-by-field notes

- `hosts_school_groups` `true`: the booking form asks for grade level and number of students.
- `hosts_daycare_groups` `null`, not `false`: the site is simply silent about under-fives and gives no minimum age or grade, which the rules say is null.
- `general_admission_child_cad` and `general_admission_adult_cad` both `0`: the home page states "Admission to both museums is free. Donations are welcome." Re-fetched and confirmed.
- `has_washrooms` and `has_lunch_space` `true`: supported by a specific sentence, "The groups may have a snack and/or lunch, washroom break, and then visit the other museum", not by a general phrase or a photograph. The sentence is stored verbatim in the facility note, and the fact that it never says *where* you eat is in `gaps`.
- `months_offered` [1-6, 9-12] and `days_offered` [4, 5] from "Availability: September to June on Thursdays and Fridays", re-read verbatim.
- `booking_method` `web_form`, `booking_email` and `booking_phone` null: the site publishes no email address and no phone number anywhere, only Gravity Forms with CAPTCHAs. Nothing was copied from a directory.
- `mood_tags` are `explore` and `learn` on both programs. Judged by what a child does for most of the Pioneer visit, which is walking through and being shown things. `play` was considered because of the dip pen and the button spinner, but those happen in the Schoolhouse half, so tagging this record `play` would oversell it.

## Authored fields written

- `what_children_do` on both programs, grounded clause by clause in the site's own lists: the stagecoach, the pioneer kitchen, home and parlour, early photographs, farm and logging implements, and for the Schoolhouse half the dip pen and ink, the button spinning and the artifact hunt.
- `our_note` on both programs. The field trip note rests on three things actually on the page: the class being split in two, the "partially accessible" sentence, and the fact that the five dollars is not broken down between the two museums. The tour note rests on the tour existing outside Sunday hours, the price being absent, and the stated extra cost for booking the museums on separate days.
- `practical_summary` on both programs, generated from the facility fields plus the gaps list.

## Images

Four entries, one `hero`. Three come from the Pioneer Museum page and use the site's own alt text verbatim (`alt_source: site`); the fourth comes from the field trip page, where the alt attribute is empty, so a `generated` alt was written after opening the image and describing only what is in the frame. All four URLs are absolute, https, on the museum's own domain, and were confirmed to return 200 with `content-type: image/jpeg`. Two were also opened and viewed.

Images not used, and why:
- `visiting-the-museum.jpg`, the Yoast primary image declared for the Pioneer Museum page, was opened and rejected. It carries a visible third-party watermark reading "© Toad Hollow Photography" and it depicts a schoolroom rather than the Pioneer Museum.
- `grade-7-button-spinning-500x375.jpg` was opened and rejected for this record: it shows children at old desks inside the one-room Schoolhouse, not the Pioneer Museum.
- Both facts are recorded in `gaps`. `rights_note` is null on all four; the site carries only a footer copyright line, which is not a photo credit.

Note for anyone re-running this venue: the museum's images are lazy-loaded with an inline SVG placeholder in `src` and the real URL in `data-src`, so a plain fetch shows every image as empty. The URLs and the site's alt text were recovered from the site's own WordPress REST API on the same domain, then confirmed against the rendered page in a browser.

## Location

`address` is 4450 Happy Valley Road, Victoria, BC, exactly as the site writes it, taken from both the home page and the contact page. No postal code is published. The site links to Google Maps short links rather than embedding coordinates, so there is no `site_embed` source, and no geocoder is reachable in this environment. `lat` and `lng` are null with `geo_source: geocode_pending`. No pin was hand-placed.

- **Meets minimum viable record:** No. Missing `lat` and `lng` (pending geocoding) and, on the program side, `age_basis` plus a range, because **the site publishes no age or grade range at all**. That is a real gap and it should be visible rather than papered over. Everything else the bar asks for is present: both programs have an id, a name, `comes_to_you`, an `our_note`, and the field trip has a cost.
- **Confidence:** Medium to high. The facts recorded are strong, the price is quoted verbatim from a page updated five months ago, and both source pages were reopened and re-read. It is not high only because the site says nothing about who the field trip is for by age, how big a group it can take, or how much notice it needs, which are the three things a director asks first.

## Recommended follow up by phone or email

There is no phone number or email published, so all of these have to go through the inquiry form at https://metchosinmuseum.ca/book-a-field-trip/. Ask them together in one message, in this order:

1. **Price:** does the five dollars per student cover both museums or only one, and is there a charge for accompanying adults?
2. **Youngest age:** will they take preschool or daycare groups, or is the field trip written for school grades only?
3. **Capacity:** how many children can come at once, and is there a minimum? The 12 visitor maximum on their tours page appears to describe the Schoolhouse.
4. **Lead time:** how far ahead they need to be asked.
5. **Lunch space:** where a group eats during the changeover break, and whether it is indoors.
6. **Washrooms:** how many and where, since only the existence of a washroom break is stated.
7. **Rain backup and bus parking:** neither is mentioned anywhere on the site.
8. **Accessibility:** what "partially accessible" means in practice for the Pioneer Museum.
