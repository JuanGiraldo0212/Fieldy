# Batch summary — Greater Victoria

Last run 2026-09-03 · `extractor_version` v2.0 · **30 of 185** tracker rows processed

All 30 files pass `validate_v2.py` with zero schema errors.

## Tracker

| Status | Count |
|---|---|
| `done` | 27 |
| `no_website` | 7 |
| `not_for_groups` | 3 |
| `pending` | 154 |
| `error` | 0 |

`not_for_groups`: Bateman Foundation (permanently closed), Fairmont Empress (hotel, nothing bookable by a children's group), Gulf Islands Cruising School (adults-only certification).

## Publishable against the minimum viable record

**9 of 30 today.** **11 of 30** once `scripts/geocode-catalog.ts` runs — AGGV, Craigdarroch, B.C. Aviation, Crag X, Discover the Past, Observatory, Fairway Gorge, Flying Squirrel, Fort Rodd Hill, Freshwater Fisheries, GVPL.

The rest fail on what venues publish, not on extraction — overwhelmingly a missing age range, or "admission by donation", which is neither a price nor free.

## Batch 2 (venues 16–30) — what came back

**Strong records:** Centre of the Universe ($80 per class, grades K–12, ratios published), Fort Rodd Hill (4 programs incl. three curriculum-linked), Fairway Gorge Paddling Club, Flying Squirrel, Freshwater Fisheries (5 programs), Government House (4).

**Notable findings**

- **Emily Carr House — re-run and recovered.** The first pass returned only `<head>` metadata because the site is Square Online, renders client-side, and keeps its content in shadow DOM. Re-extracted 2026-09-03 with a rendering browser: address, phone, email, seasonal hours, wheelchair access, parking, pet policy, one hero image and 3 programs (school groups, 40-minute guided tour, self-guided drop-in). Still not publishable — the site genuinely publishes no ages and no admission amount ("by donation"). See `emily-carr-house.verification.md` for the retrieval method; **a fetch-only re-run will wrongly conclude this site is empty.**
- **Gonzales Hill was rescued from `no_website`.** The tracker pointed at tourismvictoria.com (third-party). The operator page is `crd.ca`; the tracker's website column was corrected. CRD's interpretive school programs run at four other parks, not this one, so no program was invented.
- **Heritage Acres' site is frozen around 2018** — WordPress 4.9.8, 2018 events, 2018 admission figures on an expired event page. Those figures were quoted in `gaps`, not recorded as prices.
- **Helmcken House is not routinely open** — "typically open during July and August, the weekends in December and other special events." Recorded factually rather than as a closure.
- **Flying Squirrel's tracker URL is broken** (`/victoriabritish-columbia`); live path is `/victoria-british-columbia/`. Corrected in the record.
- **Freshwater Fisheries is mostly off-island** — every program except Rod Loan runs at Abbotsford, Summerland, Clearwater or Fort Steele. Recorded without borrowing from the separate Duncan hatchery row.
- **GVPL publishes no outreach offering** — nothing about librarians visiting schools or daycares — so both programs are `comes_to_you: false` and the absence is in gaps.

**Prompt changes applied cleanly.** All 33 new programs carry `mood_tags` (play 16, learn 19, explore 14, active 11, creative 3). All image URLs are https. Generated alt was used where site alt was a filename or absent, with the reasoning stated in gaps.

**Stale-cache check** (added after the Crag X incident) ran on every price-bearing page. No drift this batch. One retrieval quirk found: the fetcher de-duplicates by path, so query-string cache-busters return empty — trailing-slash variants force a genuine second fetch.

## Browser re-runs, 2026-09-03

`STEP 1b` was added to the prompt after three venues turned out to be rendering failures rather than thin venues. Two have been re-run with a rendering browser:

- **Emily Carr House** — recovered from an empty record. See above.
- **Beacon Hill Children's Farm** — recovered. Programs 1 → 3, images 0 → 5, and the admission figures corrected from $6/$5 to **$7 adult / $6 child**, which the fetch run had guessed low. The new **Farm Friends Storytime** (Thursdays 10:45–11:15, ages 2–5, daycares of 10 or fewer) is the venue's first program with a real age range and is aimed directly at the daycare audience. Now blocked *only* on a street address, which the site never publishes.
- **Beacon Hill Park** — checked, no fix needed. The City page carries exactly one photograph and it was already recorded with the site's own alt text. Its hero URL was switched from the Drupal cropped derivative with an `itok` token to the untokened full-size original. It remains unpublishable because victoria.ca states no ages and no admission for the park.

Every photograph on both Beacon Hill Farm and Carr House is a CSS `background-image`, invisible to a DOM image query — the reason both records had no images. Each recorded image was opened and viewed before its alt was written.

## Two inconsistencies to settle

1. **`category` null vs required.** The prompt says "Enums are closed. If nothing fits, leave null and note it in gaps", but `validate_v2.py:152` treats `venue.category` as required and errors on null. The Fairmont Empress hit this and was filed `community_civic` with the override in gaps. Either add a category for venues that fit none, or relax the validator.
2. **`rights_note` is still null on every image, all 30 venues.** These sites carry only site-wide footer copyright lines, which STEP 2b correctly excludes. If the app prints photo credits, that text will have to come from somewhere else.

## Geocoding

Across all 30: `site_embed` 6, `geocode_pending` 20, `null` 4 (no address published). No pin was hand-placed from general knowledge.
