# VERIFICATION - Mark Loria Gallery

- **Fields checked:** 34 venue fields, 1 image entry, 0 programs. Every non-null value re-read against the live page in a browser.
- **Fields corrected:** 1
  - `hours_notes`: "Tues-Sat 11-6; Sun 11-3" (banner text only) -> "Monday closed. Tuesday to Saturday 11:00 to 18:00. Sunday 11:00 to 15:00. Their page calls these summer hours." Reason: the footer hours block was truncated on first read; re-read in full and it confirms Saturday 11:00 to 18:00 and Sunday 11:00 to 15:00, with Monday closed.
- **Fields set to null after review:** 3
  - `booking_method` (no booking route of any kind is published; drop-in retail)
  - `general_admission_child_cad` / `general_admission_adult_cad` (the site never says entry is free, and inferring it would be a guess)
- **Conflicts recorded:** 0

## Retrieval

This venue **needed the browser**. The site is built on Square Online and a plain fetch of the home page returned only `<head>` metadata with no body text at all. STEP 1b was followed: a tab was created, the page was polled until the client-side render finished, and text was pulled with a shadow-DOM tree walk. `sitemap.xml` fetched normally and was used to confirm the full page inventory, which is home, art, artists, exhibitions, about, five shop category pages, product pages and per-artist story pages. There is no education, schools, teachers, groups, tours or plan-your-visit page anywhere on the domain.

## Does it serve children's groups

No. Checked honestly rather than assumed:
- Full text of the home, about and exhibitions pages was searched for school, group, tour, child, kid, educat, youth, student, family, workshop and class. The only hits were biographical ("their four children have lived...", "a childhood in Kenya", "Mary is a sessional ceramics instructor... at the University of Victoria") and one exhibition titled "A GROUP OF WOMEN". None of them describe an offering.
- The sitemap contains no page that could hold one.
- Everything on the site is retail: shop categories, individual product pages with prices, a Square checkout, and past exhibition listings.

`hosts_school_groups` and `hosts_daycare_groups` are both `false`, the description says so plainly, and `programs` is an empty array. No "Group visit" program was manufactured.

## Authored fields written

None. `what_children_do`, `our_note` and `practical_summary` all live on programs, and there are no programs. The `description` is the only authored prose and it rests on the gallery's own about page copy plus the absence findings above.

## Images

One `hero`. The og:image is the gallery's own logo, so it was skipped per the rules and the reason is recorded in gaps. The home page's only other images are payment-method icons, the logo, and photographs pulled from the gallery's Instagram feed and served from `cdninstagram.com`, which is not the venue's own domain or its own site's CDN, so none of those are eligible. The image used is a banner background on the about page, served from `d932ee93f57e0124e6d8.cdn6.editmysite.com`, which is the Square Online CDN this site itself serves from. It was collected as a CSS `background-image` (a DOM image query returns only the logo), the query string was stripped and the stripped URL confirmed to load at 834x338. The alt is `generated` and was written after opening the image and looking at it, as STEP 1b requires. `rights_note` is null: the site carries only a footer line reading "MARK LORIA GALLERY 2023", which is a site-wide copyright, not a photo credit.

- **Meets minimum viable record:** No. Missing `lat`, `lng` (no geocoder in this environment, `geo_source` is `geocode_pending`) and, correctly, any program. This venue should miss the bar visibly.
- **Confidence:** High. The site is small, was read completely in a browser, and the finding that it serves no children's groups is supported by both a full-text search and the sitemap rather than by an absent page.

## Recommended follow up by phone or email

Only worth a call if someone specifically wants to take children to a commercial gallery. In that case, in priority order:
1. Whether a group of children can be brought in at all, and how many at once.
2. Whether there is any charge.
3. Washrooms.

Contact published on the site: (250) 383-8224, info@markloriagallery.com, 621 Fort St.
