# VERIFICATION — chinese-consolidated-benevolent-association-building-and-chinese-public-school

- **Fields checked:** 6 non-null values (`id`, `name`, `website`, `description`, `category`, `checked_on`, `checked_by`). Everything else in the venue block is null, `programs` and `images` are empty arrays, and there are no pages to re-open — nothing was extracted from any page, so there is nothing to re-verify against one.

- **Website search.** The tracker lists `www.heritagebc.ca`, which is a third-party heritage advocacy directory rather than this venue's own domain, so nothing on it is a source under this pipeline's rules. Two searches ("Chinese Consolidated Benevolent Association Victoria BC official website Chinese Public School" and "'Victoria Chinese Public School' 636 Fisgard official website registration") returned only Wikipedia, historicplaces.ca, a UVic library Chinatown project, City of Victoria archives, a Times Colonist article, Flickr, a sightseeing blog and a `victoriabbs.com` sponsor page. No association- or school-owned domain surfaced. Status: **no_website**.

- **Fields corrected: 0**

- **Fields set to null after review: 2** — `address` and every geo field. A street address for the building circulates on Wikipedia, historicplaces.ca and directory pages, but no venue-owned source publishes it, and third-party listings are not sources here. Recording it would have put unverified data into a field the app treats as verified, so `address`, `lat`, `lng` and `geo_source` are all null and the gap is stated explicitly.

- **Conflicts recorded: 0**

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` only exist on programs, and there are no programs — writing any of them would mean inventing a visit that no source describes.

  Two judgement calls are flagged rather than hidden: `website` carries the tracker's `heritagebc.ca` value only because the schema requires a non-empty string, and the first gaps entry says plainly that it is not the venue's own domain; `category` is set to `community_civic` from the venue's name alone (a community association building and a community-run school), which is also flagged in gaps, because the schema requires a category and no first-party source exists to confirm one.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a hero image, and any program at all — five of the required fields, all for the same reason: there is no venue-owned website to read.

- **Confidence: low** — not because the extraction is shaky but because there is effectively nothing to extract. The record's only reliable content is the name, the city and the statement that no first-party source exists.

- **Recommended follow up, in priority order for a daycare director:** everything. In practice this venue needs a phone call before it can be catalogued at all — starting with whether the association or the school hosts visiting children's groups, then the address, whether there is any tour or programme, price, youngest age, capacity, lead time and washrooms. Worth checking with Victoria's Chinatown community organisations or the City of Victoria for a current contact number, since the association appears to have no web presence of its own.
