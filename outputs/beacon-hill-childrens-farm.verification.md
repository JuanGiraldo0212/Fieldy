# VERIFICATION — beacon-hill-childrens-farm

Re-extracted 2026-09-03 with a rendering browser, replacing a fetch-only record.

- **Fields checked:** 58
- **Fields corrected:** 3
  - `general_admission_adult_cad`: 6 -> 7, and `general_admission_child_cad`: 5 -> 6. The FAQ and the group visits page both read "$7.00 for adults and $6.00 for children", and the group visits page calls these "this year's suggested amounts". The earlier fetch-only run recorded $6/$5 and noted a search snippet claiming $7/$6; the browser confirms the higher figures. Recorded in `conflicts` so the older numbers are traceable if they surface in a cache.
  - `booking_url`: homepage -> the Group Visits page, which is where the booking instructions actually are.
- **Fields added that the fetch run could not see:** `lead_time_days` (48 hours), `chaperone_ratio` (two bands), `cancellation_note` (24 hours), `restrictions` (4), `facility_notes` (4 keys), `nearby_park`, `hours_notes`, `seasonal_notes`, `has_rain_backup`, `general admission` figures, **two entire programs**, and **five images**.
- **Programs: 1 -> 3.** The fetch run saw only a generic "Group visit". The rendered Plan Your Visit page carries **Farm Friends Storytime** (Thursdays 10:45-11:15, **ages 2-5**, daycares of 10 or fewer) and **Weekly Animal Talks** (Tuesdays 12:00). The storytime is the first program at this venue with a real age range, and it is aimed squarely at the daycare audience.
- **Images: 0 -> 5.** Every photograph on this site is a CSS `background-image`, so a DOM image query returns nothing. All five were found via `getComputedStyle`, then **opened in the browser and looked at** before alt was written; all are `alt_source: generated` because the site sets no alt attributes anywhere.
- **Conflicts recorded:** 1 (the admission figures, above).
- **Meets minimum viable record:** no. Blocked solely on `address` / `lat` / `lng`. The site publishes no street address at all: it locates itself as "in the heart of beautiful Beacon Hill Park in Victoria, BC", with "a parking lot directly outside the farm, along Circle Drive". Its Contact & Hours page returns a 404. **This is now the only thing standing between this venue and publication** — one address would clear it, since the storytime program already supplies `age_basis`, range, `is_free` and `our_note`.
- **Confidence:** high. Every value was read from a rendered page on the venue's own domain.

## Judgement calls

- **`is_free: true` on all three programs.** The FAQ asks "Is there an admission fee?" and answers "No, admission is by donation." That is a direct statement that no fee is charged, so `is_free` is true, with the suggested $7/$6 carried in `extra_fees_note` on every program so no one budgets zero.
- **`wheelchair_accessible` and `stroller_accessible` left null.** The site answers the accessibility question by describing gravel paths with no steep inclines and no stairs, which is not a yes or a no. The verbatim description is in `facility_notes`, so the tile shows "gravel" rather than an invented boolean.
- **`has_rain_backup: false`.** Both scheduled programs state "weather permitting - no program in the event of rain or strong wind", and no indoor alternative is mentioned anywhere.
- **`capacity_min` left null on the group visit.** "Groups of 10 or more must book" is a booking threshold, not a minimum group size, so recording it as a floor would misread it.
- **No street address assembled.** "Circle Drive" plus "Beacon Hill Park" could be stitched into something plausible, but the site never writes an address and STEP 2c forbids hand-placing. Left null with the locating text in `gaps` for a human to finish.

## Recommended follow up, in priority order for a daycare director

1. **Street address** — the single blocker on publication.
2. **Opening hours and season** — the Contact & Hours page is a 404; only stampede and feeding times are published.
3. **Maximum group size** — a cap on the goat petting area is mentioned but never numbered.
4. **Lunch space** — not addressed at all, and there are no washrooms on site.
5. **Whether a coach can set down** at the Circle Drive lot.
