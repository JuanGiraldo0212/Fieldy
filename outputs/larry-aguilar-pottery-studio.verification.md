# larry-aguilar-pottery-studio.json

VERIFICATION

- **Fields checked:** 4 non-null fields in the venue block (`id`, `name`, `description`, `category`, plus `checked_on` / `checked_by`). There were no programs and no images to check, and no page on the studio's own domain to re-read. The one URL opened, the studio's Facebook page, was re-confirmed to return a page title and no body content.
- **Fields corrected:** 1
  - `website`: `www.facebook.com/Larry.Aguilar.` -> `https://www.facebook.com/Larry.Aguilar.Pottery/` — the value carried in the tracker is a truncated Facebook path that would not load. The search surfaced the full page, and a fetch of it returned the title "Larry Aguilar Pottery", which matches. It is recorded because the schema requires a website, but it is a social profile rather than the studio's own domain, so it was not used as a source for any other field. Both points are in `gaps`.
- **Fields set to null after review:** 5 — `address`, `booking_phone`, `hours_notes`, `lat` / `lng` / `geo_source`. A street address, a phone number and opening hours for this studio all appear on third-party directory and review sites. None of them is a source under the rules, so every one of those fields stays null rather than being filled from a listing. With no address there is nothing to geocode, so `lat`, `lng` and `geo_source` are all null rather than `geocode_pending`, and the reason is in `gaps`.
- **Conflicts recorded:** 0 — there is only one source, and it is empty.
- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on a program, and there is no program. Nothing on a source belonging to the studio describes a visit, so writing any of the three would have meant imagining one. The `description` is limited to the two things that are actually known: what the studio is called and that it publishes nothing.
- **Meets minimum viable record:** no. Missing `address`, `lat`, `lng` and a `hero` image on the venue, and the record has no program at all, so every program-level requirement is missing too. The only fields that clear the bar are `id`, `name`, `category` and `checked_on`.
- **Confidence:** high in the record as written, low in the venue's coverage. The search was unambiguous that no site on the studio's own domain exists, so the empty record is correct rather than uncertain. It simply cannot be filled without a phone call or a look at the Facebook page in a browser.
- **Recommended follow up by phone or email** (no contact details are published on any source belonging to the studio; a phone number and street address do appear on third-party directories and would need confirming before use):
  1. Price — is there any charge for a group visit or a hands-on session, and is it per child or per group?
  2. Youngest age — does the studio take preschoolers and under-fives, or only school-age children?
  3. Capacity — how many children can be in the studio at once?
  4. Lead time — how much notice does a group visit need, and who books it?
  5. Lunch space — is there anywhere a group can eat?
  6. Washrooms — are there any on site, and is there a change table?
  7. Rain backup — is the whole visit indoors?
  8. Address and hours — confirm the street address and the days the studio is open, neither of which the studio publishes itself.
