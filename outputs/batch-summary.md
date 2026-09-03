# Batch summary — Greater Victoria, first 15 venues

Run date: 2026-09-02 · `extractor_version` v2.0 · 15 of 185 tracker rows processed

All 15 files pass `validate_v2.py` with zero schema errors.

## Outcomes

| Status | Count | Venues |
|---|---|---|
| `done` | 13 | Abkhazi, AGGV, B.C. Archives, B.C. Aviation, Beacon Hill Farm, Beacon Hill Park, Butchart, CFB Esquimalt, Christ Church Cathedral, Crag X, Craigdarroch, Craigflower, Discover the Past |
| `not_for_groups` | 1 | Bateman Foundation — site states the gallery closed 2023-02-18 and the Foundation suspended operations |
| `no_website` | 1 | CCBA Building & Chinese Public School — no venue-owned domain exists |
| `error` | 0 | — |

## Publishable against the minimum viable record

**2 of 15 today:** B.C. Aviation Museum, Craigdarroch Castle. Both cleared because their sites publish coordinates in a Google Maps link (`geo_source: site_embed`).

**5 of 15 once geocoding runs:** the two above plus Art Gallery of Greater Victoria, Crag X, Discover the Past. These three are complete except for `lat`/`lng`.

The remaining 10 fail on published data, not on extraction:

| Venue | Blocked by |
|---|---|
| Abkhazi Garden | no ages and no group/child rate published — admission is "suggested donation" |
| B.C. Archives | tours mentioned, but no audience, cost or booking route published |
| Beacon Hill Children's Farm | no street address ("in Beacon Hill Park"), no hero image, no age range |
| Beacon Hill Park | no address, no hero, no ages, no admission statement on victoria.ca |
| Butchart Gardens | 5–12 / 13–17 are ticket bands, not program eligibility — not promoted to age fields |
| CFB Esquimalt | no single program has both an age range and a price |
| Christ Church Cathedral | no ages, no costs published |
| Craigflower Manor | no ages; "admission by donation" is neither a price nor free |
| Bateman Foundation | permanently closed |
| CCBA / Chinese Public School | no venue-owned website |

## Geocoding

No geocoding service is reachable from the run environment. Handling per STEP 2c:

- `site_embed` — 2 (B.C. Aviation, Craigdarroch), coordinates read from the sites' own Google Maps links
- `geocode_pending` — 10, full street address captured, ready for a single backfill pass with no re-reading of sites
- `null` — 3, no address published to geocode from (Beacon Hill Farm, Beacon Hill Park, CCBA, Bateman)

No pin was hand-placed from general knowledge.

## Images

11 of 15 venues have a hero. Missing: Beacon Hill Farm and Beacon Hill Park (photos lazy-load with empty `src`; alt strings present but no URLs), Bateman and CCBA (no venue photos exist).

All 22 images are `usage: unverified` — correct for photos simply found on a venue site. No `rights_note` was recorded anywhere: the only credit-like text on any of these sites is a site-wide footer copyright line, which STEP 2b explicitly excludes.

Several sites carry unusable alt text — generic ("Slideshow image") or filenames (Squarespace). These were recorded verbatim with `alt_source: "site"` and flagged in gaps for a human rewrite rather than replaced with invented descriptions.

## Conflicts recorded

13 across 8 venues, now structured data rather than gaps prose:

- **Butchart** (2) — booking email `groups@` (2026 web page) vs `groupres@` (2024 PDF); outside food permitted (FAQ, 2026-06-28) vs no outside meals (school policy PDF, 2024)
- **CFB Esquimalt** (3) — opening hours page body vs sidebar; a stale COVID closure notice against current hours; the street address disagrees three ways across pages
- **AGGV** (2) — "at least 3 adult chaperones" vs "up to 6"; first-Saturday free admission vs by-donation
- **Discover the Past** (2) — Chinatown meeting point and walking distance both differ between pages
- **B.C. Aviation, Beacon Hill Farm, Christ Church, Crag X** (1 each)

## Lowest confidence

1. **Craigflower Manor** — only published schedule is four Saturdays in **May/June 2025**, page last modified 2025-06-02. Recorded verbatim and flagged stale rather than projected forward. Likely needs a call before listing.
2. **Christ Church Cathedral** — the only current first-party evidence that tours run is §11.4 of a Facility Use Policy PDF. The tour booking page redirects to a login.
3. **Crag X** — a cached copy of `/group-lesson` served a price ($45), a minimum (10 climbers) and an offer that the live page does not carry. Caught in STEP 3, fields nulled, discrepancy recorded. Worth knowing this site serves stale cache.
4. **Beacon Hill Children's Farm** — no address, no rendering photos, no age range, admission by suggested donation.
5. **Beacon Hill Park** — venue domain had to be reassigned to victoria.ca; the tracker's `beaconhillpark.com` is an unofficial 2001 promo site.
6. **B.C. Archives** — tracker website is stale; all facts came from `bcarchives.ca`. `hosts_daycare_groups: false` on a published reason (registration is 16+).
7. **CCBA / Chinese Public School** — nothing extractable.
8. **Abkhazi Garden** — the conservancy site says nothing about group visits at all.

## Follow-ups for the pipeline

- **Geocoding backfill** — 10 records are one pass away from having coordinates. Needs a reachable geocoder.
- **`rights_note` is null everywhere.** If the app is going to print photo credits, that text does not exist on these sites and will need to come from another route.
- **Two venues need a human alt-text pass** (Cathedral, Crag X) where the site's own alt is a filename or placeholder.
- **`checked_by` is `scraper` on all 15**, which is the flag that `our_note`, `what_children_do` and `practical_summary` are machine-drafted and need a human read before publish.
