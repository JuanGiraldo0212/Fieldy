# VERIFICATION — black-creek-studio-gallery

- **Fields checked:** 33 venue fields, 0 programs, 0 images.
- **Fields corrected:** 5.
  - `address`: `8269 North Island Highway, Black Creek, BC V9J 1H4` -> `null`. The only source for it was a fetch of a page the browser proves is not live.
  - `booking_phone`: `250 337 1941` -> `null`. Same reason.
  - `booking_email`: `info@bscottfinearts.ca` -> `null`. Same reason.
  - `hours_notes`: `Open most days` -> `null`. Same reason.
  - `description`: rewritten from the cached marketing copy to a factual statement of what could and could not be confirmed.
- **Fields set to null after review:** 5 (the four above plus `lat`/`lng`/`geo_source`, which follow from the address being null).
- **Conflicts recorded:** 0. The disagreement here is between our own fetch layer and the live web, not between two of the venue's pages, so it belongs in `gaps` and not in front of a director.
- **Authored fields written:** none. There are no programs, so `what_children_do`, `our_note` and `practical_summary` do not apply. `description` was authored from verified facts only.
- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a hero image, and at least one program. All five are missing because the site is gone, not because they were not looked for.
- **Confidence:** high in the finding, which is that the site is dead. Low in anything about the venue itself, because nothing about it could be verified.

## What the browser exposed

`https://bscottfinearts.ca/` and `https://www.bscottfinearts.ca/` both return a WP Engine holding page, `Site Not Configured | 404 Not Found`, 461 characters of body text and five links, all to wpengine.com support articles.

A plain fetch of the same bare URL returns a complete, healthy Brian Scott Fine Arts home page: gallery locations, a Black Creek street address, a phone number, an email address, opening notes and a "Learn with Brian" section. That content is a cache. Every sub-path fetched cold (`/about-brian-scott/`, `/learn/`) returned empty, and `http://www.bscottfinearts.ca/` returned empty, which is what a dead domain looks like once the cached home page is stepped past. **A fetch-only re-run of this venue will look successful and will produce a confident record built entirely on a dead site.**

One web search was made for a replacement domain. `brianscottfinearts.com` and `bscottfinearts.com` do not resolve. `brianscottfineart.com` resolves to a squatted spam blog in Azerbaijani and Turkish with no connection to the artist. No live official site exists.

## Recommended follow up by phone or email

Everything, in this order. Nothing below is known.

1. Does the gallery still operate, and is there a current website.
2. Price for a group of children, if any.
3. Youngest age welcomed.
4. Group size the studio can take.
5. Notice needed to book.
6. Somewhere to eat, washrooms, and what happens if it rains.

The cached copy gave a Black Creek address and phone number. Both are recorded in `gaps` as unverified starting points for that call, and deliberately not in the record's own fields.
