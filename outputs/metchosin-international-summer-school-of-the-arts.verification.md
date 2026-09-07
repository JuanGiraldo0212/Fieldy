# VERIFICATION - Metchosin International Summer School of the Arts (MISSA)

- **Fields checked:** 34 venue fields, 1 image entry, 0 programs. Each non-null value re-read against the page it came from.
- **Fields corrected:** 1
  - `youngest_age_welcomed_years`: null -> 19. Reason: the terms and conditions page opens with "Classes are open to students **19 years or older** at the start of their registered workshop." This was found only after reading the terms page, and it is the fact that settles the whole record.
- **Fields set to null after review:** 2
  - `price_year_or_season` (no 2027 fees are published yet, so there is no price to date)
  - `hosts_daycare_groups` was briefly considered null and set to `false`, which the rules permit because the site gives a reason, namely a stated minimum age well above five.
- **Conflicts recorded:** 0. The site does contradict itself on dates (page title says July 12 to 26, 2024; workshops page lists 18 to 31 July 2026; home page advertises 25 June to 9 July 2027), but this is a stale title on a finished season rather than two live answers to a question a director would ask, so it is written up in `gaps` rather than as a conflict.

## Does it serve children's groups

No, and this was the specific question asked. The workshops page says "Adult artists of all backgrounds are welcome", the about page describes the mandate as inspiring "serious students and professional artists" and the history as bringing together "established artists and adult students". Those are suggestive but not decisive on their own, so the terms and conditions page was opened and it states the rule outright: classes are open to students 19 years or older at the start of their registered workshop. Accommodation is restricted to registered students, and even a partner who wants to stay must register for a course.

`hosts_school_groups` and `hosts_daycare_groups` are both `false`, the age rule is recorded in `youngest_age_welcomed_years` and quoted verbatim in `restrictions`, the description says so plainly, and `programs` is an empty array.

## Location

The tracker says Victoria. The site publishes exactly one street address, the MISSA office at 770-B Hillside Ave, Victoria, BC, V8T 1Z6, and that is what is recorded in `address`, as instructed. The workshops themselves run on the campus of Pearson College in Metchosin, which the site names on the home, workshops, about and accommodation pages but never gives a street address for. The only campus location detail published is a campus map PDF. This split is written into both the `description` and `gaps` so nobody later assumes the Hillside Avenue office is where the program happens. `geo_source` is `geocode_pending`; no pin was hand-placed.

## Authored fields written

None. There are no programs, so `what_children_do`, `our_note` and `practical_summary` do not exist on this record. The `description` rests on the workshops page (disciplines, format, lunch included, 9 am to 4 pm), the about page (founded 1984, charity status, Pearson College) and the terms page (age rule).

## Images

One `hero`. This venue **needed the browser** for images. The og:image the site declares, `missa.ca/himg/share-post-image.jpg`, returns 404 when opened, so it was discarded and the reason recorded in gaps. The home page's `<img>` elements are the wordmark logo, a decorative down arrow, a "Thank You All" graphic and an Art BC badge, all of which the rules say to skip. The actual header photograph is a CSS `background-image` and does not appear in a plain fetch at all. It was collected in a browser after scrolling, the alt is `generated` and was written after opening the image at full size and looking at it, and it describes only what is in the frame. The URL is https and carries no query string. `rights_note` is null; the site has only a footer copyright line.

- **Meets minimum viable record:** No. Missing `lat`, `lng` (no geocoder available; `geo_source` is `geocode_pending`) and, correctly, any program, because an adults-only art school has nothing to offer a class or a daycare.
- **Confidence:** High. The adults-only finding is not an inference from tone, it is a written rule on the venue's own terms page, and it is quoted verbatim in the record.

## Recommended follow up by phone or email

Not worth a call for field trip purposes. If the catalogue ever wants to revisit this venue, the one question is whether MISSA has ever considered a youth or family workshop stream, since it does not currently exist. Published contact: info@missa.ca, 778-966-4772.
