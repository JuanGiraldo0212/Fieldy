# VERIFICATION — Heritage Acres

Checked 2026-09-03 against heritageacresbc.ca (Saanich Historical Artefacts Society).

**Headline finding:** the website appears frozen around 2018. It runs WordPress 4.9.8, the footer reads "Copyright 2018", the "Upcoming Events" list on the homepage shows dates from 2018, and the train schedule page says "Train Run Dates in 2018/2019" and "For bookings, contact VIME starting February 2019". Nothing on the site can be treated as current pricing or scheduling, and the record says so rather than presenting 2018 figures as today's.

- **Fields checked:** 38 (33 venue, 2 programs, 1 image, provenance)

- **Fields corrected:** 2
  - `venue.has_lunch_space`: `null` -> `true`, supported by "several nice picnic areas" on the exhibits page and "Bring a picnic and relax in the days gone by" on the homepage, with the verbatim line kept in `facility_notes.lunch_space`. This is outdoor picnic space, which the note makes clear.
  - `programs[1].format`: `["self_guided"]` -> `null`. None of guided / self_guided / hands_on / interactive describes riding a miniature train, and the enum is closed, so it is recorded as null and noted in gaps.

- **Fields set to null after review:** 4
  - `venue.general_admission_child_cad` / `general_admission_adult_cad` and both programs' cost fields. The only admission figures anywhere on the site are on the Fall Threshing Weekend event page, which is stamped "This event has passed" and dates from September 2018: "Gate admission is $8 per person for the first two people (teens and adults) OR $20. per car/group with 3 or more teens and adults. Children 12 years and under are free." Recording eight-year-old event-day gate prices as this venue's admission would be exactly the confident-guess failure the pipeline is built to avoid. The figures are quoted in `gaps` so a director can raise them on the phone, not shown as prices.
  - `programs[1].is_free` — "by donation" is not the same as free; the donation line sits in `extra_fees_note` instead.
  - `venue.booking_email` — the site's email address is behind Cloudflare email protection and cannot be read. Not copied from anywhere else.
  - `programs[0].months_offered` — the site never states when Heritage Acres itself is open. Null here does *not* mean year-round, so "months unknown" is written explicitly into gaps as the conventions require.

- **Conflicts recorded:** 0.

- **Pages that would not render:** `/contact/`, `/rentals/`, `/our-history/` and `/events/` returned no extractable text on repeated fetches, including with cache-busting query strings and both the apex and www hostnames. The WordPress REST endpoints are also unreachable. Any group rate, school programme or rental price on those pages could not be read, and that is recorded in gaps rather than guessed around. `/exhibits/`, `/trains/`, `/gallery/`, `/membership/` and the homepage all returned clean text.

- **School tours and group rates:** searched for and not found. There is no schools, education, field trips or group visits page, and no school or group rate anywhere that rendered. What the site does say about groups is the schoolhouse line on the exhibits page — one room refitted as the original classroom, "the rest of the building is available for group meetings and receptions" — plus a homepage slide offering rental spaces "for birthday parties, weddings, family gatherings, business meetings and more". That was enough to create the single "Group visit" program the prompt prescribes for a venue that only says groups are welcome. `hosts_school_groups` and `hosts_daycare_groups` are null, not false: the site gives no minimum age or exclusion, it is simply silent.

- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary` on both programs.
  - The group visit's `what_children_do` rests on the exhibits page inventory — trails, picnic areas, the retired transit bus, old cars, trucks and tractors, the sawmill, blacksmith shop, Newman Boat House, the museum's household effects, the refitted schoolhouse classroom and the log cabin.
  - Its `our_note` rests on the site's evident staleness plus the fact that the blacksmith shop is described as "operated through the year" while nothing states what is running on an ordinary day.
  - The train rides' `what_children_do` and `our_note` rest on the VIME paragraph: rides on published dates, always by donation, with a schedule that is years out of date.

- **Images:** 1, the hero. The og:image is `LogoSample.png`, the Heritage Acres logo, so it was skipped per the rules and that is noted in gaps. The homepage's three content photographs carry a `title` attribute but no `alt`, so alt is `generated` — and because the image file itself was not opened, the alt identifies where the photograph sits rather than describing the frame; inventing "tractors in a field" from a filename would have been worse. The URL is absolute, https, and on the site's own WordPress uploads path. No caption written, no rights note (the footer's "Copyright 2018 Heritage Acres" is a site-wide line, not a photo credit).

- **Location:** `geo_source: geocode_pending`. No Maps iframe, JSON-LD or og:latitude anywhere on the pages that rendered. The address was taken verbatim from the site footer: 7321 Lochside Drive, Saanichton, British Columbia, Canada V8M 1W4.

- **Meets minimum viable record:** no. Missing `venue.lat`, `venue.lng`, and a program with `age_basis` plus a range and a cost or `is_free`. The site publishes no ages and no current price at all.

- **Confidence:** low. What the place contains is well described and reliable; everything a director must know to plan a trip — whether it is open, when, what it costs, whether a class can be booked — is either absent or eight years stale, and four pages would not render. This record is a starting point for a phone call, not a bookable listing.

- **Recommended follow up by phone (250.652.5522), in priority order:**
  1. Price — is there a gate admission now, and is there a school or group rate? The only figures on the site are from a 2018 event.
  2. Is the site open, on what days and hours, and in which months?
  3. Youngest age welcomed, and whether a daycare group is workable across an outdoor machinery site.
  4. Capacity and whether a class needs to be booked ahead, and how far ahead.
  5. Whether the buildings are unlocked and whether the blacksmith, sawmill or engines will be running on the day.
  6. Is the miniature train running, and can a group of children be accommodated?
  7. Lunch — picnic areas are confirmed, but ask about covered space.
  8. Washrooms, rain backup, bus parking, and stroller or wheelchair access on the trails.
