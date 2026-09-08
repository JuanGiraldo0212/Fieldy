# VERIFICATION — gildas-box-of-treasures-theatre

- **Fields checked:** 33 (the venue block only; there are no programs and no images to check)

- **Fields corrected:** 1
  - `venue.website`: the tracker's value was carried over unchanged, but it is now recorded in gaps as a third party directory address rather than a venue site. Nothing on it was used as a source. See the tracker note below.

- **Fields set to null after review:** 6
  - `address` — the only street address for this theatre appears on third party directories. A directory is not a source under the rules, so nothing was recorded.
  - `lat` / `lng` / `geo_source` — follow from the missing address. There is no address to geocode.
  - `hosts_school_groups` / `hosts_daycare_groups` — there is no venue owned page to be silent or explicit, so these are unknown, not no. An extraction that wrote false here would be claiming a refusal nobody made.

- **Conflicts recorded:** 0

- **Authored fields written:** none of the three. `what_children_do`, `our_note` and `practical_summary` all live on programs, and there are no programs. The venue `description` is written from what was actually checked: that the listed link no longer opens the page it names, that no venue owned site could be found, and that the operator's own site does not mention the theatre.

- **Meets minimum viable record:** no. Missing `address`, `lat`, `lng`, a hero image and any program. Five of the required fields are absent, and all five are absent for the same reason: there is no venue owned page to read.

- **Confidence:** high on the finding, which is that this venue has no website and cannot be confirmed to be operating. Low on the venue itself, since nothing about what it offers could be verified. The finding was checked three ways: the tracker link in a live browser, a web search for a site belonging to the theatre or its operator, and a direct read of the Wei Wai Kum First Nation site including its business list, facility rentals page, culture page and its own site search.

- **What was actually checked, so this is not re-run blind:**
  - `https://native-dance.ca/...` and `https://www.native-dance.ca/...` refuse the connection over https, in a live browser, on 2026-09-07.
  - The `http://www.native-dance.ca/...` form loads and then silently redirects the entire path to `https://indigenousdance.ca/en/home/`. The showcase page for this theatre no longer exists. This is the "silently redirects to a home page" failure mode: a plain fetch of the original address returns an almost empty body and looks unremarkable.
  - Bare domain forms were tried before concluding the link was broken.
  - `gildasboxoftreasures.com`, `boxoftreasures.ca` and `gildas.ca` do not resolve.
  - `weiwaikum.ca` was read directly. The theatre appears on none of the Nation's business lists, on the Facility Rentals page, or on the culture and history page, and a site search for "Gildas" returns "Sorry, no posts matched your criteria."
  - `weiwaikumhouseoftreasures.com` exists and is live, but it is the Nation's retail art gallery and gift shop at Discovery Harbour. It says nothing about a theatre or performances and is a different entity.

- **Recommended follow up by phone or email**, in priority order for a daycare director:
  1. **Is it still running at all** — call Wei Wai Kum First Nation reception on 1-250-286-6949 and ask whether the theatre still puts on performances. Everything else depends on this answer.
  2. **Price** — nothing is known.
  3. **Youngest age** — nothing is known.
  4. **Capacity** — nothing is known.
  5. **Lead time** — nothing is known.
  6. **Lunch space, washrooms, wet weather cover** — nothing is known, and there is no confirmed address to attach any of it to.

  If the answer to the first question is no, this row should be retired rather than re-run. If it is yes, the row needs a working address and a contact, neither of which currently exists.
