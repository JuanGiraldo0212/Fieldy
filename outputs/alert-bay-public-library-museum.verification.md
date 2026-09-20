# alert-bay-public-library-museum.json

VERIFICATION

- **Fields checked:** 38 (every non-null venue field plus the single program's non-null fields, re-read against the Museum page, the Contact Us page, the History of the Library page, the Summer Reading Club page and the homepage footer; the whole site was also swept page by page through its own WordPress content feed for any mention of schools, classes, groups, tours, story time, admission, washrooms, parking or the ferry, and there is none).
- **Fields corrected:** 3
  - `venue.geo_source`: `geocode_pending` -> `site_embed` — the Contact Us page publishes its own coordinates under a "Coordinates (WGS84)" heading, "Lat: 50.58489° N" and "Long: 126.92890° W". Those are on-domain facts, so they are used directly rather than geocoded. The Google map on that same page is keyed by address only, so it is not the source.
  - `venue.address`: "116 Fir Street, Box 440, Alert Bay, BC, Canada V0N 1A0" -> "116 Fir Street, Alert Bay, BC V0N 1A0" — the box number is a mailing detail, and the library's own directions link on the Contact Us page writes the address in exactly the shorter form now recorded.
  - `program.days_offered`: null -> [2, 3, 4, 5, 6] — the Contact Us page lists Tuesday to Saturday 1 to 4 and Sunday and Monday closed, so the days a group could come are published even though nothing else about a visit is.
- **Fields set to null after review:** 4
  - `venue.general_admission_child_cad` and `venue.general_admission_adult_cad` — no price and no statement that entry is free appears anywhere on the site. A small community museum is usually free, but that is an assumption, not a published fact, so both stay null and the question is in the follow up list.
  - `venue.booking_method` — the site publishes a phone number, an email address and a general contact form, but never describes booking a visit at all. A drop-in venue with no published booking route is null.
  - `venue.wheelchair_accessible` — the Accessible Services page turned out to be about print disabilities, screen readers and accessible book formats. It says nothing about getting into the building, so the flag stays null rather than being inferred from the page title.
- **Conflicts recorded:** 0 — the hours on the homepage header, the Contact Us page and the Museum page agree, and the address in the footer matches the Contact Us page.
- **Authored fields written:** all three, for the one program.
  - `what_children_do` rests on the Museum page, which names the artifacts on display and says the gift shop is there, plus the History page, which puts the library and museum in one building.
  - `our_note` rests on the published 1 to 4 opening hours, the History page's statement that the library serves the people of Cormorant Island, and the complete absence of any group content on the site.
  - `practical_summary` is generated from what is published (address, coordinates, phone, email, hours) against the washroom, lunch, parking, accessibility, price and group gaps.
- **Images:** none recorded. The six museum artifact photographs are all between 119 and 139 pixels on their longest side, the one historic library photograph is 200 by 145, and the rest of the site's pictures are the library logo and three square link tiles. Nothing clears the roughly 400 pixel floor, there is no Open Graph image and the theme's background image is set to unset and appears on no page. This is stated in gaps.
- **Meets minimum viable record:** no. Missing the hero image with alt, and the single program has no `age_basis` with a range and no cost field or free flag, because the site publishes no ages and no price. Everything else required is present: id, name, address, coordinates, category and date on the venue, and id, name, `comes_to_you` and `our_note` on the program.
- **Confidence:** high on what is recorded and low on coverage. The address, coordinates, hours, contact details and the museum's contents are unambiguous on the library's own pages, but the site simply says nothing about children's groups, so the record is thin by the site's own doing rather than by uncertainty.
- **Recommended follow up by phone or email** (250-974-5721 or abplb@shaw.ca; the Community Librarian is listed as Joyce Wilby):
  1. Price — is there any admission charge for the museum, and does a group of children pay anything?
  2. Youngest age — are preschool and daycare groups welcome, and is there a minimum age?
  3. Capacity — how many children fit in the museum at once, and does a group have to book ahead?
  4. Lead time — how much notice does a group visit need, and can it happen outside the 1 to 4 window?
  5. Programs — is there a story time or a class visit, and what does the Summer Reading Program for Kids involve?
  6. Lunch space — is there anywhere inside or nearby for a group to eat?
  7. Washrooms — are there any in the building, and is there a change table?
  8. Access and parking — is the entrance step-free for strollers, and where can a van or bus stop?
  9. Getting there — which ferry sailing suits a 1 to 4 visit, and how far is the walk from the terminal?
