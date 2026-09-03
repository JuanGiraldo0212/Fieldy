# VERIFICATION — emily-carr-house

Re-run 2026-09-03 with a rendering browser, replacing the fetch-only record that returned nothing.

- **Fields checked:** 41 (23 venue, 3 programs × ~6 non-null each, 1 image)
- **Fields corrected:** 0 from the previous record — the previous record had almost no non-null values to correct. Against it, this run **added**: `address`, `booking_email`, `booking_phone`, `booking_method`, `wheelchair_accessible`, `facility_notes`, `nearby_park`, `restrictions`, `hours_notes`, `seasonal_notes`, `price_year_or_season`, two further programs, and one image.
- **Fields set to null after review:** 1 — `venue.booking_url` was previously `plan-your-visit`; it is now the School Groups form, which is the page that actually takes a school booking. `image.width`/`height` left null: the browser reports 1500×2000, but the page markup does not state them and STEP 2b allows only markup-stated dimensions.
- **Conflicts between pages:** none. The FAQ's "No, you don't need to book" and the homepage's "sign up in advance on Eventbrite" describe two different offerings (self-guided drop-in vs the 40-minute guided tour), not a disagreement.
- **Meets minimum viable record:** no — missing `lat`/`lng` (geocode_pending, address captured) and no program has `age_basis` + range or a cost/`is_free`. The site publishes no ages and no admission amount for anything.
- **Confidence:** high for what is recorded. Every value was read from a rendered page on the venue's own domain, and the two thin areas (no ages, no prices) are genuine absences on the site rather than retrieval failures.

## Method note — this is why the first run failed

`carrhouse.org` is a **Square Online** site that renders entirely client-side. A plain fetch returns `<head>` metadata and nothing else; `/qr-codes-quotes`, never fetched before, came back empty on a cold request, confirming rendering rather than caching was the problem. `?format=json` returns metadata only.

Even in the browser, `get_page_text` found nothing and `document.body.innerText` returned 753 characters of navigation, because the page content sits inside **shadow DOM**. The content was reached with a TreeWalker that descends into `shadowRoot` at each element, polling until the body text settled — the render completes after `navigate` returns, so an immediate read gets an empty page.

Photographs are CSS `background-image`, not `<img>`, so they need `getComputedStyle` rather than a DOM image query. Both candidate images were opened directly in the tab and viewed before alt text was written, so the hero's `alt_source: "generated"` rests on having actually seen the frame.

**Anything re-running this venue with fetch tools alone will conclude the site is empty. It is not.**

## Recommended follow up, in priority order for a daycare director

1. **Price** — school programs and admission are both unpriced; admission is "by donation" with no suggested amount.
2. **Youngest age** — nothing published. The 40-minute guided tour is the only duration given, and it may be long for under-fives.
3. **Capacity** — no group size limit published.
4. **Lead time** — no minimum notice published; the enquiry form is the only channel.
5. **Lunch space** — not mentioned. Beacon Hill Park is the obvious fallback and is named on the site for parking.
6. **Washrooms** — not mentioned anywhere.
7. **Rain backup** — the house is indoors, but the gardens are part of the visit and wet-weather arrangements are not addressed.

Also worth asking: whether a coach can set down, given on-site parking is three vehicles and the roundabout must stay clear.
