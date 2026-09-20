# pacific-rim-national-park-reserve.json

VERIFICATION

- **Fields checked:** 34 (every non-null venue field, both programs' non-null fields, and the single image entry, all re-read against the one Pacific Rim page that would load: the Activities and experiences page).

- **Retrieval, first, because it governs everything below.** On 2026-09-20 parks.canada.ca was serving an ASP.NET / Sitecore `SqlException` ("The remote computer refused the network connection") as an HTTP 500 for almost every Pacific Rim URL. The tracker's `www.pc.gc.ca/en/pn-np/bc/pacificrim` 301-redirects to `parks.canada.ca/pn-np/bc/pacificrim`, which itself returned 500. Every one of the 60 English Pacific Rim URLs in the site's own `sitemap.xml` was probed; exactly one, `/pn-np/bc/pacificrim/activ`, returned 200. The park home page, the Visit page, the fees page, the hours page, the accessibility page, the contact page, the school programs page, the interpretive programs page, the hiking page and the Long Beach page were each retried on a loop for roughly fifty minutes and never returned anything but the 500 error body. This is **not** the STEP 1b JavaScript-rendering case: the one page that did load returned complete server-rendered HTML, and `sitemap.xml` itself served fine. It is a server-side outage. Per the prompt's "if no browser is available" clause, only what that single page legitimately supports has been recorded, the RETRIEVAL NOTE is in `gaps`, and the venue's status is `error` so it can be re-run rather than mistaken for a venue with nothing to offer. No third-party listing was used, and nothing was filled from prior knowledge of the park.

- **Fields corrected:** 3
  - `programs[1].evidence`: the pathway sentence was first typed with precomposed Latin letters and did not match the page. The page writes the name with combining diacritics, so the quote was re-lifted byte for byte from the page and now matches exactly. The same correction was applied to the pathway name everywhere else it appears.
  - `venue.seasonal_notes`: re-lifted verbatim from the page, including the Nuu-chah-nulth orthography that a first pass had transliterated into plain ASCII.
  - `gaps`: five em dashes were removed and replaced with colons, per the house rule.

- **Fields set to null after review:** 4
  - `venue.stroller_accessible` and `venue.wheelchair_accessible` — the page says the multi-use pathway is used "on foot, stroller, wheelchair, or bicycle". That is one 25 km pathway, not the park. Flagging the whole park accessible from it would be wrong, so the flags stay null and the sentence is kept in `facility_notes` where it reads as the qualified fact it is.
  - `programs[1].is_free` — the page's only mention of money is "National park reserve visitors with a valid National Park Entry Pass are authorized to have beach fires", which tells you a pass exists but not that entry requires one and not what it costs. Both the cost fields and `is_free` stay null.
  - `venue.geo_source` — no address could be read, so per STEP 2c this is the third case: `lat`, `lng` and `geo_source` are all null. It is deliberately **not** `geocode_pending`, because there is no address to back-fill from; a later pass must re-read the contact page first.

- **Conflicts recorded:** 0. Only one page loaded, so nothing could disagree with anything.

- **Authored fields written:**
  - `what_children_do` — written for the self-guided visit only, resting on the page's own description of the 25 km pathway used on foot, by stroller, by wheelchair or by bicycle, plus its listing of beaches and hiking trails in the Long Beach Unit. Left **null** for the school program, because the site never describes what happens in it and imagining a plausible visit is exactly what the prompt forbids.
  - `our_note` — for the school program it rests on the fact that the park names the offering but publishes no reachable detail, so the advice is to phone and what to ask. For the self-guided visit it rests on the exposed-coast setting and the unreadable entry price.
  - `practical_summary` — generated from the facility fields (almost all null) against the `gaps` list, for both programs.

- **Meets minimum viable record:** **no.** Missing `venue.address`, `venue.lat` and `venue.lng`. All three are missing for the same reason: the park's contact page returned HTTP 500 throughout. A hero image with alt text is present, the category is set, and both programs carry `our_note` and `mood_tags`, so `address` and the coordinates are the only blockers. Neither program publishes an age or grade range or a cost, so `age_basis` and every cost field are null on both.

- **Confidence:** **low.** Everything recorded is verbatim from the park's own Activities and experiences page and was re-checked string by string, so what is here is right. But one page out of sixty is a thin base for a park this large, and the three things a director most needs (where it is, what it costs, what the school program actually is) are all missing because of the outage rather than because the park does not publish them. Re-run this venue once parks.canada.ca is healthy.

- **Scope note:** the separate Kʷisitis Visitor Centre row is left alone. Kʷisitis appears here only in `seasonal_notes`, because the park-wide closure notice that ran from September 16 to 25, 2026 closes trails and beach access in the Long Beach Unit that a group visiting the park would otherwise use. No Kʷisitis exhibits, hours, address or fees are recorded here.

- **Recommended follow up by phone or email** (no contact details could be read; Parks Canada's general line and the park's own contact page are the route once the site is back):
  1. **Price** — what does a school or daycare group pay to enter the park, is it per child or per vehicle, and is there a group rate? Is there a separate fee for the school program on top of entry?
  2. **Youngest age** — what is the school program's youngest age or grade, and do preschool and daycare groups fit it at all?
  3. **Capacity** — how many children can come at once, and how many adults must come with them?
  4. **Lead time** — how far ahead must a school program be booked, and who books it?
  5. **Lunch space** — is there anywhere sheltered a group can eat, and where?
  6. **Washrooms** — where are they in the Long Beach Unit, and is there a change table?
  7. **Rain backup** — is there any indoor option if the weather turns, given the visit is entirely on an exposed coast?
  8. **Address and bus parking** — the park's mailing and meeting address, and where a school bus can park and unload.
  9. **Custodial groups on the water** — the site says interim restrictions apply to custodial groups kayaking or canoeing and that you must contact the park in advance for permits. Worth raising if any paddling is planned.
