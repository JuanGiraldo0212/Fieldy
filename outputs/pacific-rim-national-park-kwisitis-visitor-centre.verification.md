# pacific-rim-national-park-kwisitis-visitor-centre.json

VERIFICATION

- **Fields checked:** 12 (the 9 non-null venue fields, plus both image entries re-checked against the page they were found on). Every other venue field and the whole programs array is null or empty because the pages that carry that information would not load.

- **Retrieval, first:** on 2026-09-20 the Parks Canada site returned HTTP 500 for nearly every page in the Pacific Rim National Park Reserve section, and for other parks as well. Confirmed over roughly forty minutes of polling from two different fetchers, with several URL spellings (`www.pc.gc.ca/en/...`, `parks.canada.ca/...`, `parcs.canada.ca/...`, with and without `.aspx`, with and without a trailing slash), a second user agent, and the Parks Canada media CDN. The response body was a .NET error page reading "The remote computer refused the network connection", which is an origin failure behind the CDN, not a JavaScript rendering problem and not an empty site. Two things confirm the site itself is alive: `https://parks.canada.ca/` returned a full 644 KB page, and `https://parks.canada.ca/pn-np/bc/pacificrim/activ` returned a full page throughout. So the venue has real published pages that could not be read this run.

  Pages that returned 500 and therefore yielded nothing: the park home page, the Kwisitis Visitor Centre page, the hours page, the school and group programs page, the interpretive programs page, the accessibility page, the map page, the gift shop page and the closure bulletin.

- **Fields corrected:** 1
  - `venue.name`: "Pacific Rim National Park – Kwisitis Visitor Centre" -> "Kwisitis Visitor Centre" — Parks Canada's own heritage record and the park's activities menu both name the building "Kwisitis Visitor Centre". The tracker's longer form is kept only in the file name. Parks Canada writes it "Kʷisitis" in its current closure notice and "Kwisitis" in the heritage record; the plain spelling is used, and the difference is noted in gaps.

- **Fields set to null after review:** 3
  - `hosts_school_groups` and `hosts_daycare_groups` — the park's activities menu lists a "School programs" page and an "Interpretive programs" page, which is a strong hint but not a statement, and both pages returned a server error. A hint is not a fact, so both stay null rather than true.
  - `has_rain_backup` — the building is indoors, but the site never says a group has anywhere to shelter, and inferring it from the fact that a visitor centre has a roof is exactly the kind of guess this pipeline gets wrong. Null.

  Also considered and left null: `bus_parking`. Parks Canada's own text mentions "the Kʷisitis Visitor Centre parking lot", which establishes that a parking lot exists but says nothing about buses.

- **Conflicts recorded:** 0. Only two pages loaded and they do not disagree about anything.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` are program fields and there are no programs, because nothing bookable could be read. Writing them from the building's architecture record would have been invention, which is the failure mode this pipeline is built to avoid.

- **What the two working pages did support:**
  - `address`, `description` and both images come from Parks Canada's Directory of Federal Heritage Designations entry for the building at `https://www.pc.gc.ca/apps/dfhd/page_fhbro_eng.aspx?id=15874`: the address "485 Wick Road, Ucluelet, British Columbia", the two-storey form, the 1965 origin as a hotel, the 1978 to 1982 Parks Canada rebuild, the display space, theatre and restaurant section, the 2019 heritage recognition, and the parking lot, service road, small trails and boardwalk system to the beaches.
  - `seasonal_notes` is the current closure notice, verbatim, from `https://parks.canada.ca/pn-np/bc/pacificrim/activ`. It is a dated closure rather than an opening season, and it is recorded as such. The centre's actual open season is still unknown.
  - `category` is `museums_history` on the strength of the display space and theatre inside the building. The park as a whole is a separate record and is not `museums_history`.

- **Images:** both entries re-checked. Both URLs are absolute, https, on `www.pc.gc.ca`, and both were present on the `found_on_url` recorded. Both resolve to `image/jpeg`. Alt text is the site's own and is recorded verbatim, so `alt_source` is `site` for both. The caption on the first is the caption printed under the photo, verbatim; nothing was written by us. `rights_note` is the credit line printed beneath each photo, not a site-wide footer. `usage` is `unverified` for both. A `hero` exists, but it is an exterior architectural photo from a heritage register rather than the photograph Parks Canada puts at the top of the venue's own page, so it should be replaced on the re-run.

- **Location:** `geo_source` is `geocode_pending`, which matches how the coordinates were obtained, namely not at all. No geocoding service was available in this run. The full street address is captured so the backfill pass can fill `lat` and `lng` without re-reading anything.

- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng` (geocode pending), and missing a program entirely, so `programs[0].id`, `name`, `age_basis`, `comes_to_you`, a cost field and `our_note` are all absent. The hero image and `alt` requirement is met, and `id`, `name`, `address`, `category` and `checked_on` are all present.

- **Confidence:** low. Everything recorded here is solid, because it all comes from two Parks Canada pages read directly, but it is a small fraction of what this venue publishes. The record should be treated as a placeholder and re-run rather than trusted as a picture of what the centre offers.

- **Recommended follow up by phone or email** (Parks Canada, Pacific Rim National Park Reserve; no contact details could be read this run, so start from the park's contact page once the site is back):
  1. Price — is there a park entry fee for a children's group, and is there a school or group rate for a guided program?
  2. Youngest age — are preschool and daycare groups welcome at the centre, and is there a minimum age on the guided programs?
  3. Capacity — how many children can be in the building or on a program at once?
  4. Lead time — how far ahead does a school or daycare group have to book, and who takes the booking?
  5. Season and hours — when is the centre open, and which months have programs? Note the Kwisitis area closes September 16 to 25, 2026.
  6. Lunch space — is there anywhere indoors a group can eat, given there is a restaurant section in the building?
  7. Washrooms — are there washrooms in the centre, and is there a change table?
  8. Getting there — can a school bus park at the visitor centre lot, and is the route from the lot to the door step-free?
