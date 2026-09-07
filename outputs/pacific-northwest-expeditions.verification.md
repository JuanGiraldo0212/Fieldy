# VERIFICATION — pacific-northwest-expeditions

- **Fields checked:** 33 venue fields. All but id, name, website, description, category, checked_on and checked_by are null, because the website no longer exists.

- **The finding: the domain is dead.** A plain fetch of `https://seakayakbc.com/` returns a complete, healthy looking home page with trip descriptions, a Nanaimo post office box, a toll free number and an email address. It is a cache. In a live browser, all four of these fail with `DNS_PROBE_FINISHED_NXDOMAIN`, which means the domain does not resolve at all:
  - `https://seakayakbc.com/`
  - `https://www.seakayakbc.com/` (the address in the tracker)
  - `http://seakayakbc.com/`
  - `http://www.seakayakbc.com/`

  The bare domain was tried before and after the www host, and http was tried once after https failed. This is not a rendering problem and not a slow client side framework; there is no server to reach. The cached copy also describes the company as being in its sixteenth year, which puts the text many years out of date on its own.

- **Fields corrected:** 0. Nothing from the cached page was carried into the record.

- **Fields set to null after review:** everything the cached page would have supplied. Specifically:
  - `address` — the cache gives only "PO Box 97, Stn. A, Nanaimo, British Columbia, V9R 5K4". A post office box is not a place a group can go, and the source is unreachable, so it is null.
  - `lat` / `lng` / `geo_source` — null, with no address to geocode.
  - `booking_email` / `booking_phone` — the cache gives both. They were not recorded, because a contact route pulled from a dead cache is exactly the kind of thing that gets a director a dead line.
  - `hosts_school_groups` / `hosts_daycare_groups` — null, not false. We could not read the site, so we do not know. Silence caused by an unreachable server is not a refusal.

- **Does it rule out young groups?** **Unknown, and that is the honest answer.** No minimum age could be checked, because the pages that would carry one, the trip and the dates and prices pages, cannot be loaded. Similar sea kayaking operators in this catalogue publish an age floor that rules daycares out, so the expectation is that one exists, but expecting it is not the same as reading it and nothing was recorded on that basis.

- **Is there a replacement site?** One web search was run. It returned only third party tourism listings, directories and review sites, plus the websites of unrelated Vancouver Island kayaking companies. None of those is a source under the rules and none is this company's own domain. There is no official site to follow.

- **Conflicts recorded:** 0.

- **Images:** empty array, explained in gaps. No page could be loaded, so no image could be confirmed as present on a live page on the venue's own domain.

- **Authored fields written:** none. There are no programs, so no `what_children_do`, `our_note` or `practical_summary`. Writing an `our_note` for a company whose website has vanished would be inventing advice.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a hero image and any program. All of it is missing for the same single reason.

- **Confidence:** high on the finding that the site is gone, since four addresses were tried in a live browser and all four failed at DNS. Zero confidence in anything about the offering itself, which is why nothing about it was recorded.

- **Tracker status:** `no_website`. Not `error`, because nothing went wrong in the run and a re-run will not help. The row needs either a new address for this company or retiring. A fetch only re-run will appear to find a working site and should not be believed; the gaps list says so in the record itself.

- **Recommended follow up:** this one needs a decision rather than a phone call. Find out whether Pacific Northwest Expeditions is still trading and under what address, and if it is not, retire the row. The toll free number in the cached page is the only lead, and it is old enough that it should be treated as unlikely to work.
