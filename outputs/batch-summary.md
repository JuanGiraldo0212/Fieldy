# Batch summary — Vancouver Island field trip catalog

Last run 2026-09-07 · `extractor_version` v2.0 · **113 of 191** tracker rows have a record

All 113 files pass `validate_v2.py` with zero schema errors, and every one has a matching `verification.md`. 18 are publishable.

**Three regions complete: Greater Victoria, Cowichan Valley and Nanaimo.**

| Region | With a record | Pending |
|---|---|---|
| Greater Victoria | 72 | **0** |
| Cowichan Valley | 26 | **0** |
| Nanaimo | 14 | **0** |
| Central Island | 1 | 41 |
| West Coast / Alberni | 0 | 23 |
| North Island | 1 | 12 |
| Island wide | 0 | 1 |

## Tracker

| Status | Count |
|---|---|
| `done` | 91 |
| `not_for_groups` | 19 |
| `no_website` | 3 |
| `error` | 1 |
| `pending` | 77 |

`not_for_groups` (15): Bateman Foundation (permanently closed), Fairmont Empress (hotel), Gulf Islands Cruising School (adults-only certification), MISSA (students 19+), and the commercial galleries and studios — Madrona, Mark Loria, One Moon, Side Street, Avenue Gallery, Excellent Frameworks, Mary Fox Pottery, Susan Isaac, Bernadette McCormack, Saanichton Christmas Tree Farm, Clayworks.

`error` (1): Point Ellice House. Its entire site went offline 1 September 2026 and every path now serves a four-line notice saying the house is closed until Spring 2027. Not a retrieval failure, and worth re-running then.

## The 7 anomalies, resolved

Seven rows were marked complete with no file, all predating this pipeline. Six are now fixed.

**Royal BC Museum** had been marked `done` since before this pipeline with no file behind it. Now extracted: **12 programs**, and one of only 11 publishable records. Learning Labs are **$150 per class** ($200 for the feature exhibition), self-guided is **$2 per student** in low season and **$8** during a feature exhibition, digital field trips **$75 per class**, outreach kits **$50 per two-week loan**. Chaperones 1:5 for K to 8. Fees are tax exempt for BC schools and a 25% hardship discount is available on request.

**Five of the six `no_website` rows were wrong.** All had a blank website column, and all five turned out to have real sites:

| Venue | Site | Now |
|---|---|---|
| Nature House at Goldstream | discoverparks.ca (operator) | `done`, 3 programs |
| Victoria Butterfly Gardens | butterflygardens.com | `done`, 2 programs |
| Ladysmith Museum | ladysmithhistoricalsociety.ca/museum | `done`, 3 programs |
| Shawnigan Lake Museum | shawniganlakemuseum.com | `done`, 1 program |
| Nuyumbalees Cultural Centre | nuyumbaleesmuseumsociety.com | `done`, 2 programs |

They had been marked from a missing entry in the source directory rather than from a check. **Any remaining row whose website column looks thin or points at a tourism board deserves the same treatment** — this is now three separate cases (Gonzales Hill, plus these five).

**Henschel Fine Arts is the one genuine `no_website`,** and it is worse than blank: `henschel.ca` is dead, and `henschelfinearts.com` now serves expired-domain SEO spam on the bare host and a stale 2016 copy with dead interior links on www. Neither was recorded. It has a Facebook page, which is not the venue's own domain.

**Resolved 2026-09-07: out of scope.** A venue with no web presence cannot be catalogued usefully, so no file is expected for it. It is the only tracker row without a JSON file, and that is now the intended state rather than an anomaly.

Two live advisories worth knowing: **Goldstream's exhibit space is temporarily closed** after structural damage knocked out power, with only the front desk and shop open; and **Nuyumbalees is temporarily closed** with its two sites giving different reopening dates (June 2025 and June 2026), so its status genuinely cannot be read off the site.

**Counting note:** earlier summaries said 185 rows. The tracker holds 191.

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

## Batch 3 (venues 31–45)

42 programs, 36 images, 6 conflicts, zero non-https image URLs. Every program carries `mood_tags`.

**Best records:** Maritime Museum of BC (8 programs, and the only publishable one in this batch), Legislative Assembly Parliamentary Education Office (6 programs including outreach to schools and a virtual classroom), Horticulture Centre of the Pacific (12).

**A second stale-cache catch.** HCP's fetched hours page served admission of $16.00 / $12.00 / $9.00; the live page reads **$17.00 / $13.00 / $11.00**. Corrected, with a note in `gaps`. This is now twice that fetching has produced a wrong price that only a live re-read caught, after Crag X. The STEP 3 re-read is earning its place.

**Prices declined on purpose.** IMAX's only published group rates sit in a PDF marked "Effective August 31, 2016", so both in-theatre programs carry null costs rather than decade-old numbers. The one price recorded there, $100 + GST per class for virtual screenings, is `cost_per_group_cad`.

**Two host gotchas.** `www.metchosinmuseum.ca` returns an empty body while `metchosinmuseum.ca` serves full HTML; same pattern at miniatureworld.com. Worth trying the bare domain before concluding a site is JS-rendered.

**An anti-scraping price.** Metchosin's field trip page writes its cost as `F i v e  d o l l a r s/student` in spaced letters with non-breaking spaces. Recorded as `cost_per_child_cad: 5`.

**`play` is being applied correctly.** Miniature World and the National Toy Museum are both `explore`/`learn`, not `play`, because everything is behind glass and the toy museum states "no touching allowed". Metchosin gets `play` because children use dip pens and button spinners.

**Kelp Reef excludes daycares** on a published minimum age of 7 (12 for the three-hour tour), so `hosts_daycare_groups` is false with a stated reason.

**STEP 1b was used and worked.** Mark Loria Gallery (Square Online, head-only) and Miniature World's rates and contact pages were both recovered by the browser. HCP needed it for its nav and program list. Several agents also used the browser purely to look at images before writing `generated` alt text, which is now standard practice.

## Batch 4 (venues 52–66)

38 programs, 36 images, **13 conflicts** (the highest of any batch), zero non-https URLs. The browser was connected throughout and every agent used it.

**Strongest records:** Shaw Centre for the Salish Sea (10 programs, $7.00 **per student** + tax with a 15-student minimum charge, grade-banded capacities, touch pool open so those programs are tagged `play`), SALTS (publishable with no warnings at all), Old Cemeteries Society, Orca Spirit.

**The stale-cache re-read caught two more wrong values, the worst yet.**

- **Sooke Region Museum**: the fetched school-tours page read *"Cost $100/class, up to 40 students"*. The live page reads **$200 per visit** for two classes, with a discount code giving $100 for one. Recorded as `cost_per_group_cad: 200`. A director quoting the cached figure would have been out by half.
- **Royal Roads**: fetched copy said *"at least three business days in advance"*; live says **10 business days**. `lead_time_days` corrected 3 → 10.

That is five stale-price catches across four batches. The STEP 3 live re-read is the single highest-value step in the prompt.

**Three retrieval lessons worth folding into STEP 1b:**

1. **The bare-domain check keeps working.** `www.sidneymuseum.ca` and `www.sookeregionmuseum.ca` both serve empty or COVID-era content while the bare domains are current.
2. **St. Ann's Academy does not resolve over https at all.** Only `http://` works, and the https attempt was returning a September 2023 snapshot. Its images are consequently http-only mixed content and had to be dropped, so that record has no hero.
3. **`web_fetch` deduplicates by path, and the trailing-slash trick does not always defeat it.** Three agents fell back to reading prices from the live DOM in Chrome instead, which is now the reliable STEP 3 method.

**Collapsed accordions hide real content.** ONC's event details, Orca Spirit's FAQ (which carries the age rule, washrooms, accessibility, parking and season) and Shaw Centre's Behind-the-Scenes pricing are all invisible to a fetch and only appear on click.

**Judgement calls worth knowing:**

- **Ocean Networks Canada hosts nothing at either address.** Everything it runs for children is delivered in your classroom or over video, so all programs are `comes_to_you: true` and both records say so plainly. The two rows were kept separate with a cross-reference rather than cloned.
- **Orca Spirit is not ruled out for daycares.** Its open-air vessels refuse under-6s, but the semi-covered boats are all ages with infants free, so the restriction is per-vessel rather than venue-wide.
- **Ocean River publishes no minimum age.** It has a "Children 10-12" price band, which was deliberately *not* recorded as an age range, since that would have implied adults cannot come.
- **Royal Roads' booking form lists no option below grade 9**, which is suggestive but not a stated rule, so it went into `our_note` and `gaps` rather than into `grade_min`.
- **Saanichton and Side Street publish no group offering at all**, both confirmed by live text search rather than assumed. Side Street is a retail gallery despite the name.

## Batch 5 (venues 67–81) — Greater Victoria finished, Cowichan begun

32 programs, 34 images, **17 conflicts**, zero non-https URLs. The browser was connected and every agent used it; it changed a record in four of the five sub-batches.

**Publishable:** TNT Paintball, B.C. Forest Discovery Centre, Arts Council of Ladysmith, Chemainus Theatre Festival. That is 4 of 15, the best rate of any batch.

**Two venues turned out not to exist as the tracker describes them.**

- **B.C. Artifacts Mobile Museum is closed.** A plain fetch returns an older page full of live tour details. The browser follows a redirect to `bcartifacts.com`, whose first line says the mobile museum has closed. A fetch-only re-run would record a thriving business. RETRIEVAL NOTE and a conflict entry are in the record.
- **Susan Isaac has left the region.** The tracker says Sooke; the site now gives an address on **Gabriola Island**, a ferry away, and says the studio is closed until October 2026. The old Sooke address survives only inside a collapsed FAQ.

**Collapsed accordions are now the single richest hidden source.** They held the age rule at Susan Isaac, the deposit and insurance terms at Camp Thunderbird, the youth discount, minimum age, service fee and bus parking at Chemainus Theatre. Victoria Bug Zoo goes further: its price blocks are set to reveal on scroll and stay `visibility: hidden` to a text read, so even a live browser read returned a page with no prices until they were forced visible.

**A per-child/per-group trap in the opposite direction.** Camp Thunderbird's mobile teambuilding table is *headed* "Fee per participant" but its rows are banded by group size, so "30 or fewer → $606" is the whole booking. Read literally that is $18,180 for an afternoon. Recorded as `cost_per_group_cad` with a conflict logging the site's own mislabelling.

**Two more stale sources.** Camp Thunderbird's fee page is headed "EDUCATION FEES – 2017" and was last modified in 2016; its 2026 teacher booklet is current and supplied the logistics. B.C. Forest Discovery Centre's group prices still show the April–June 2025 season while its admission page has moved to 2026. Both recorded as published with `price_year_or_season` rather than projected forward.

**Silence is not refusal.** Both YMCA recreation centres offer nothing bookable by a children's group, verified across several pages and two site searches, but `hosts_school_groups` was set **null, not false**, because the sites are silent rather than exclusive. The three YMCA rows were kept separate, with genuinely different hours; one agent caught itself having cloned Downtown's hours onto Westhills and corrected it.

**Chemainus Theatre has no theatre school or student matinee** despite expectations. What a class can actually book is a seat at a performance, plus a Pay-What-You-Can relaxed performance with sensory and neurodiversity flags set true, and free Access Tickets for educational organisations. The $49 group price is the **adult** rate from a sheet headed "for 10 or more Adults", so `cost_per_child_cad` is null.

## Batch 6 (venues 84–98) — Cowichan Valley all but finished

24 programs, 29 images, 5 conflicts, zero non-https URLs. The browser was connected throughout and was decisive on five of the fifteen.

**Publishable:** Cowichan Estuary Nature Centre, the standout of the batch — Estuary Explorers K–5 at $10/student capped at $250, Barnacle Buddies for **ages 0–5** at $10 a session, and a home-learner series ages 6–12.

**A duplicate row resolved.** "Pacific Northwest Raptors" and "The Raptors" are one organisation: `pnwraptors.com` server-side redirects to `the-raptors.com`, and the live footer reads *Also known as "Pacific Northwest Raptors Ltd."* with one address and one phone. The full record went to `the-raptors.json` (4 programs, including a Kids Encounter for ages 4–7 that was buried in a FAQ panel); `pacific-northwest-raptors.json` is a short cross-reference record with an empty programs array, so a director never sees the same venue twice. Its status stays `done`, not `not_for_groups`, because the organisation genuinely does host groups — only the name is stale. **A plain fetch of the old domain returns the new site's content and hides the rename entirely.**

**A venue that no longer exists as catalogued.** Quw'utsun Cultural and Education Centre has no public visitor operation on Cowichan Tribes' own site. What exists is the Nation's education and culture department at a different address; the old cultural centre at 200 Cowichan Way appears only in a councillor's biography and as the address of a counselling service. Empty programs, both host flags null (silence, not refusal), and gaps say a director would have to phone the education office cold.

**A seventh stale-cache catch, and the most consequential yet.** `web_fetch` served a 2024 Cowichan Estuary home page with "admission by donation" and a Winter 2025 program page. The live DOM gave Fall 2026 hours and Barnacle Buddies as Tuesdays 10:30–11:30, 6 Oct to 15 Dec 2026, ages 0–5, $10 drop-in. **The entire school program, including the $10/student price and the K–5 range, exists only in the live DOM** — three program pages returned completely empty to fetch. The "admission by donation" line is gone from the live site and was correctly not recorded.

**Kinsol Trestle could not have been done by fetch at all** — both pages return about 1,500 lines of navigation and no body. The browser recovered the address, the 1.2 km walk-in, year-round accessible toilets on both sides, the crushed-gravel accessibility line, and from five collapsed panels on the schools page: a 30-day minimum notice and a $2M liability insurance requirement. Same for BC Parks, which renders its money and facilities in JS — the whole youth-group camping section ($1/person, min 12, chaperones 1:8 minimum to 1:4 maximum), the facilities list and three advisories including a boil-water notice were all invisible to fetching.

**The suspect Ladysmith pin is explained, and it is a schema problem not a transcription error.** The Arts Council's coordinates were transcribed faithfully — but from an embed `pb` string, where `!2d`/`!3d` is the **map viewport centre**, not the place pin. No pin coordinate is published for that address at all. The Gallery page carries both forms, about 200 m apart, and the new record correctly used the `!3d`/`!4d` place pin. **STEP 2c should distinguish the two**, because `site_embed` currently reads as authoritative when it may only be a map centre.

**Judgement worth noting:** Coast Salish Journey's "Herb has taught in public schools" is biography, not an offering, and was deliberately not made into a program; its only bookable item is a carving workshop currently cancelled. Cowichan Bay Maritime Centre is **not** admission-by-donation despite expectations ($5 adult / $3 child), and its camp is $275 per child per week, verified per-child rather than assumed.

## Coordinate audit, 2026-09-07 — 16 of 31 pinned records were wrong

STEP 2c was rewritten after the Ladysmith pin turned out to be off by 2.5 km. A Google Maps embed carries **two** coordinates: `!2d`/`!3d` inside the `pb=` string is the **map viewport centre**, while `!3d…!4d…` later in the same string is the **place pin**. Only the pin means "the venue is here". They are easy to confuse because the centre is longitude-then-latitude and the pin is latitude-then-longitude.

An audit of all 31 records claiming `site_embed` found **16 wrong**: 12 were viewport centres and are now null with `geo_source: "geocode_pending"`; 4 were corrected to real place pins (Horticulture Centre ~100 m, Maritime Museum ~190 m, Avenue Gallery ~30 m, Dominion Observatory ~40 m).

The pattern is clean, and worth remembering: **where a site publishes both an embed and a `/maps/place/` link, extractors took the pin correctly. Where a site publishes only an embed, they took the centre.** Every failure was in that second group.

A numeric sanity check alone would not have caught this. Ten of 31 looked suspicious on the numbers and six of those were bad, but Ladysmith Museum sat plausibly in the middle of its own town cluster and was still a viewport centre. The offsets are 30 to 400 m, invisible to a coordinate screen.

One judgement left standing: Coast Salish Journey uses a legacy embed's `saddr` marker rather than a `!3d`/`!4d` pin. That is the marker, not the view centre, so it is right in spirit, but it is not one of the forms STEP 2c enumerates.

## Batch 7 (venues 99–113) — Cowichan finished, Nanaimo complete

**Publishable:** Nanaimo Museum (7 programs, every price a class fee), Morrell Nature Sanctuary (8 programs), Splitsville, Creative Escape, Bailey Studio, Vancouver Island Military Museum.

**Fetching returned healthy-looking copies of four sites that are not there.** This is the batch's main lesson and it changes how much a plain fetch can be trusted:

- **Nanaimo Art Gallery**: `www.nanaimogallery.ca` is a Cloudways 403 in the browser, but a fetch returned a **cached copy of the 2019 site**, complete with a 2019 exhibition and a stale rental price. The bare domain redirects to the live site at a different address entirely. A fetch-only run would have produced a seven-year-old record.
- **Pacific Northwest Expeditions**: the domain does not resolve at all, `DNS_PROBE_FINISHED_NXDOMAIN` on every form. A fetch returned a complete home page. Nothing from that cache was carried into the record, and the row is now `no_website`.
- **Goldstream's salmon-run page** and **Morrell's school registration page** are both hard 404s that fetches returned as blank or cached.

**Two per-group traps at one venue.** Splitsville's lane price is per lane for up to six guests, and its party package is $99 for up to six children, with the "$16.50 per child" on the page being that $99 divided by six. Both recorded as group costs. Only the school-trip rate is genuinely per person.

**Whose price is it.** The Port Theatre's $25 is the theatre's own Student ticket, not a group or school rate. Two other prices were deliberately not recorded: a Discovery Series student price on a page a season out of date, and a family-concert price belonging to the Vancouver Island Symphony rather than the theatre. Like Chemainus, the Port Theatre has **no current school programming** — confirmed in the live DOM, not assumed.

**A second organisation kept separate.** Nanaimo Arts Council and Nanaimo Art Gallery are different bodies. The Arts Council's only child-facing item runs in the Gallery's Art Lab, and no data was shared between the two records.

## Outstanding, needs the browser reconnected

The Chrome extension disconnected part-way through the anomalies pass, so three items are unfinished. None blocks anything; all are quick once a browser is available.

- **Goldstream's fall salmon-run school programs page** renders client-side and returned only `<head>`. Its dates, times and price are still missing. A RETRIEVAL NOTE is in that record's gaps so a fetch-only re-run does not overwrite it.
- **Shawnigan Lake Museum and Nuyumbalees heroes carry file names in place of alt text** (`Morton House Celebration_edited.jpg`, `nuyumbalees_9565-2.jpg`). Recorded verbatim with `alt_source: "site"` rather than invented. Both need a human or browser alt pass.
- **Unlabelled photographs on Victoria Butterfly Gardens and Ladysmith Museum** were left out entirely rather than described from filenames, so both records have fewer images than the sites offer.
- **Royal BC Museum**: images with empty alt attributes were skipped for the same reason, and the Provocation Packs booking block sits beyond the fetcher's text cap on both the page and its REST response.

## Three inconsistencies to settle

3. **`venue.website` is required but some venues have no website.** The prompt says a venue with no site should still get "the venue block only with a note in gaps", but `validate_v2.py` requires `website` to be a non-empty string, so such a record cannot be written. Henschel Fine Arts is stuck on this and is the only tracker row with no file. Either make `website` nullable, or decide that a venue with no web presence is out of scope and give the tracker a status that says so.

## Two earlier inconsistencies

1. **`category` null vs required.** The prompt says "Enums are closed. If nothing fits, leave null and note it in gaps", but `validate_v2.py:152` treats `venue.category` as required and errors on null. The Fairmont Empress hit this and was filed `community_civic` with the override in gaps. Either add a category for venues that fit none, or relax the validator.
2. **`rights_note` is still null on every image, all 30 venues.** These sites carry only site-wide footer copyright lines, which STEP 2b correctly excludes. If the app prints photo credits, that text will have to come from somewhere else.

## Geocoding

Across all 30: `site_embed` 6, `geocode_pending` 20, `null` 4 (no address published). No pin was hand-placed from general knowledge.
