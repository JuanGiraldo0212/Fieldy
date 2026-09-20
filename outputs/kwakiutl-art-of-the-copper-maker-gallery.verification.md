# kwakiutl-art-of-the-copper-maker-gallery.json

VERIFICATION

- **Fields checked:** 0 against the venue's own pages. No page of calvinhunt.com could be read, so there was nothing to verify a value against. What was verified instead was the retrieval failure itself, repeated across two clients, two desktop user agents, eight URLs and about half an hour.

  What happened, in order:
  1. `https://www.calvinhunt.com/` returned HTTP 200 with a 1,705 byte page titled "Bot Verification", carrying an invisible reCAPTCHA and no site content.
  2. The same URL with a desktop browser user agent returned exactly the same challenge page.
  3. `robots.txt` came back normally (`User-agent: * / Disallow:` plus a sitemap line), which proves the host is up and is not asking crawlers to stay away. `sitemap.xml` itself returned the challenge page.
  4. After a handful of requests the server switched to 403 Forbidden from Cloudflare for every URL including the home page.
  5. After a seven minute pause, `/about-5` and `/map` returned the "Bot Verification" challenge again, not 403 and not 404. The pages exist. They simply never send their content to anything that has not answered the challenge.

  The challenge is a CAPTCHA, and answering one from a script is off limits. Browser tools were excluded for this run, so the spec's "If no browser is available" path applies: extract only what page metadata legitimately supports, leave the rest null, record the reason, and set the status to `error`.

- **Fields corrected:** 0.
- **Fields set to null after review:** 0. Nothing was ever filled in. `address`, `lat`, `lng`, `geo_source`, both hosts flags, every facility field, every price field, hours, contacts and booking route are all null because no page could be read, not because a page was silent.
- **Conflicts recorded:** 0.
- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on programs, and there are no programs. Writing any of them would have meant inventing a visit, which is the one thing this record must not do. The venue `description` is written plainly and says only what is true: what the gallery is called and where it is, from our own catalogue row, and that its site could not be read.

- **Deliberate calls made here, so a re-run does not undo them:**
  - **Programs is empty, and `hosts_school_groups` / `hosts_daycare_groups` are null, not false.** The `not_for_groups` path is for a site that clearly does not serve children's groups. This site said nothing at all, because nothing could be read. An unread site is not a retail-only site, and recording `false` would have published an exclusion the venue never made. Null keeps the question open and amber in the app.
  - **No address and no pin.** The street address and coordinates for this gallery are easy to find on tourism directories and in general knowledge. Both are out of bounds: the record takes nothing from third-party listings, and a hand-placed pin is worse than null because it shows on the map with no warning. `geo_source` is null rather than `geocode_pending`, because there is no extracted address waiting to be geocoded.
  - **Category is `arts_performance`**, inferred from the venue's name alone. It is the one required enum that cannot be left blank, and the inference is flagged in gaps.
  - **No images.** None could be collected, so the catalogue card will fall back to an initials tile. That is noted in gaps.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, one `hero` image, and at least one program. The validator reports no errors and one NOT PUBLISHABLE warning listing exactly those.
- **Confidence:** low, and deliberately so. Nothing in this record is a reading of the venue's own site, so there is nothing here to be confident about. The one high-confidence finding is the retrieval failure, which is reproducible.
- **Recommended follow up by phone or email:** every field needs one, so the first step is not a phone call but a browser. Someone should open calvinhunt.com, pass the robot check, and re-run this venue properly. Once the site is readable, the order a daycare director cares about:
  1. Price — is there any charge for a group to visit the gallery or the carving studio, and does it differ for children?
  2. Youngest age — are preschool and daycare groups welcome, or is there a minimum age?
  3. Capacity — how many children can be in the gallery or the studio at once?
  4. Lead time — how much notice does a group visit need, and does the studio need to be told so a carver is working that day?
  5. Whether carving demonstrations or studio visits are offered to groups at all, or whether it is a gallery you browse.
  6. Lunch space and washrooms on site.
  7. Rain backup, parking and whether a bus can turn and park.
  8. The street address and a map pin, so the record can finally be placed.
