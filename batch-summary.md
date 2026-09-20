# Batch summary — 38 unextracted venues

Run 2026-09-20, extractor v2.0. These were the rows in `extraction-tracker.csv` that had
no file in `outputs/`. One agent per venue, fetch-only (no browser), verification pass per
the prompt's STEP 3.

## Outcome

| status | count |
|---|---|
| done | 28 |
| not_for_groups | 4 |
| no_website | 3 |
| error | 3 |

96 programs written across 38 records. **6 meet the minimum viable record**; 32 do not,
almost always because the venue publishes no age or grade range, no price, or no address.
That is the honest state of these sites, not a shortfall in the pass — the West Coast and
North Island venues are small and their web presence is thin.

Schema: 37 of 38 validate clean. `cedar-coast-field-station` fails on purpose (see below).

### Meets the bar
alberni-valley-museum, remote-passages-marine-excursions, tofino-sea-kayaking-co,
jamies-whaling-station-adventure-centres-ucluelet, ecosummer-expeditions,
sea-wolf-adventures

### No website
larry-aguilar-pottery-studio (Facebook page only), henschel-fine-arts (domain resolves,
serves nothing on either protocol), cedar-coast-field-station (see below)

### Does not serve children's groups
- `cedar-coast-art-and-ecology-centre` — permanently closed, stated on their own home page
- `house-of-himwitsa-art-gallery` — retail gallery, lodge and fish store; no group content
- `tofino-tourism` — destination marketing organisation, not a venue
- `zeballos-expeditions` — business sold, site is now a single "A New Chapter" page

### Errored, needs a re-run
- `pacific-rim-national-park-reserve` and `pacific-rim-national-park-kwisitis-visitor-centre`
  — parks.canada.ca was returning HTTP 500 site-wide for the whole run. One of 60 sitemap
  URLs served. Not a rendering problem; re-run when the site is healthy.
- `kwakiutl-art-of-the-copper-maker-gallery` — calvinhunt.com serves every URL a "Bot
  Verification" page, then Cloudflare 403s. Needs a human with a browser.

## Geocoding

- 12 records are `geocode_pending` and need the backfill pass.
- 6 have **null** coordinates and no address to backfill from. Four are unreadable sites;
  `cineplex` is a national chain with no single address; `pacific-rim-national-park-reserve`
  lost its contact page to the outage.
- The rest carry `site_embed` or `geocoded` coordinates taken from the venues' own pages.

**Two traps found, worth remembering.** On boat-tour operators the published map pin is
usually the *dock*, not the venue (Sea Wolf, Ecosummer). And several venues publish only a
PO box: Mount Cain's is in Port McNeill, 77 km from the hill.

## No hero image
larry-aguilar-pottery-studio, cedar-coast-field-station,
hot-springs-cove-maquinna-provincial-park, henschel-fine-arts,
alert-bay-public-library-museum, kwakiutl-art-of-the-copper-maker-gallery

Alert Bay is the interesting one: every photo on its site is under 200px, below the
spec's 400px floor, so an empty `images` array is the correct answer rather than a miss.

## Findings that change the data, not just the record

- **The two Cedar Coast rows are one organisation, and it is permanently closed.**
  `thecedarcoast.ca` serves its real site only to a desktop User-Agent; a default fetch
  gets a 596-byte foreign-language stub canonical to `cedarcoastfieldstation.org`. That
  stub is why the field-station agent reported a hijacked domain. Keep
  `cedar-coast-art-and-ecology-centre`, drop `cedar-coast-field-station`.
- **Maquinna Marine Provincial Park was renamed Nism̓aakqin Park in 2025.** Old BC Parks
  URLs return a 66-byte meta-refresh that a naive fetcher reads as an empty page.
- **The Whale Interpretive Centre burned down** on 2024-12-31, taking its collection. It
  reopened 2026-08-01; the skeletons are not yet re-hung and the interior is unfinished
  until summer 2027.
- **McLean Mill is closed for the season** — buildings, shop and washrooms shut, grounds
  open, group tours by reservation only, train not running this year.
- **The Whale Centre has no museum**, contrary to the brief it was given.
- **Cineplex should not be one row.** As "Island wide" it can never meet the bar or appear
  on the map. Three Island cinemas each publish an address and coordinates: SilverCity
  Victoria, Cineplex Odeon Victoria, Galaxy Cinemas Nanaimo. Same program text.

## Tracker corrections needed

- `port-mcneill-district-museum`: `www.town.portmcneill.bc.ca` no longer resolves. The
  site is `portmcneill.ca`, museum at `/residents/museum/`.
- `cineplex-education-cinema-more`: `www.cineplex.com/groupsales` is a 404.
- 117 rows still read `pending` but already have extracted files and live database rows.
  The status column has been stale since before this run.

## Retrieval notes for the next pass

1. Always send a desktop User-Agent and prefer the `www.` host. A bare no-UA fetch of
   `bamfieldmsc.com` returned **an unrelated site's page** from the same shared host.
2. When a page renders in JavaScript, read the site's own JSON endpoint rather than
   reaching for a browser: Gatsby `page-data.json`, WordPress `wp-json`, Next.js
   `__NEXT_DATA__`. That is still the venue's own domain. It rescued Cineplex, Alert Bay,
   Mount Cain and Hot Springs Cove.
3. **Summarised fetch output can fabricate.** A summarised read of the Village of Zeballos
   map page returned an invented facilities list; the raw page is a single image with no
   text. Use raw HTML for anything that becomes a recorded fact.
4. Alt text: most of these sites ship empty or filename `alt` attributes, and this run had
   no browser, so many alts are `generated` without the image having been seen. Every such
   record says so in `gaps`. They need a human eye before publish.

## Lowest confidence, in priority order

kwakiutl-art-of-the-copper-maker-gallery, pacific-rim-national-park-reserve,
pacific-rim-national-park-kwisitis-visitor-centre, henschel-fine-arts,
larry-aguilar-pottery-studio, cedar-coast-field-station, cineplex-education-cinema-more,
west-coast-aquatic-safaris, zeballos-expeditions, port-mcneill-district-museum,
zeballos-heritage-museum, alert-bay-public-library-museum, hot-springs-cove-maquinna-provincial-park,
house-of-himwitsa-art-gallery, roy-henry-vickers-gallery, naawayasum-gardens-formerly-tofino-botanical-gardens,
west-coast-nest, the-whale-centre, port-alberni-echo-aquatic-centre-and-fitness-studio,
umista-cultural-centre
