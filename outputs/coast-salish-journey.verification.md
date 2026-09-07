# VERIFICATION - coast-salish-journey

- **Fields checked:** 40 (33 venue, 1 program block, 1 image, plus provenance)
- **Fields corrected:** 1
  - `venue.lat`/`venue.lng`: null -> 48.73886 / -123.65043, and `geo_source` null -> `site_embed`. The location page publishes a Google Maps embed whose URL carries the coordinates directly, which is an on-domain fact rather than a geocode.
- **Fields set to null after review:** 4
  - `programs[0].what_children_do`. The site describes the activity, carving a plaque with bent and straight knives, but never describes children doing it and gives no age guidance. Writing it would have implied a children's session the site does not offer.
  - `programs[0].duration_min`. "Two day" is stated but no daily hours, so minutes would be invented.
  - `programs[0].is_free` and all three cost fields. No price appears anywhere on the site.
- **Conflicts recorded:** 1, on the contact email.

## What is actually bookable by a school or daycare group
This was the specific question in the brief, so it was checked page by page.
- The home page says Herb Rice "has taught in public schools, exclusive private schools and universities". That is **biography about where he has taught in the past**, not an offering the site sells, describes or prices. It was deliberately not turned into a program.
- The only bookable thing published anywhere on the site is the two day **Introduction to Woodcarving workshop**, and it is written for individuals who already have some interest in carving, not for a class or a group.
- That workshop page carries the notice **"All classes canceled until further notice."**, confirmed live in a browser as well as by fetch.
- There is no school programme, no outreach visit, no group rate, no studio visit and no gallery opening hours.
- `hosts_school_groups` and `hosts_daycare_groups` are therefore **null, not false**. The site does not refuse groups, it simply never addresses them.

## Program re-checked against source
Re-opened `https://coastsalishjourney.com/workshop.html` live.
- Evidence quote "This two day workshop is specifically for those who have been interested in carving" is present word for word. 13 words.
- `extra_fees_note` quotes the page verbatim on lunch at a local cafe at added cost and knives available to buy in class.
- No price, no dates, no ages, no capacity, no session times. All null.
- `school_rate_only` false: nothing is priced for schools or anyone else.
- `booking_email` is the address the workshop page prints for registration.

## Images
One image, `activity-carving-workshop-group`, from the workshop pictures page linked off the workshop page. Confirmed absolute, https, on the venue's own domain, and present on the `found_on_url` recorded. It has no alt attribute at all, so an alt was written after opening the image and looking at it: adults standing behind a table in a workshop room holding carved plaques. `alt_source` is `generated`. No caption was invented and no rights note applies.

**There is no hero.** The only photograph on the home page is a portrait of Herb Rice credited "Photo by Andrew Leong, Courtesy of the Cowichan News Leader/Pictorial". That is a headshot with a third party credit, which the rules exclude on both counts. The site has no og:image and no banner photograph. This is recorded in gaps and is why the record is not publishable.

## Retrieval
The site is plain static HTML from an earlier era and fetched cleanly over https, both with and without the www prefix; www redirects to the bare domain. No browser workaround was needed to read it. The browser was used to confirm the cancellation notice live, to enumerate the workshop photographs, and to look at the image before writing its alt.

## Staleness
This site is years out of date and a director should be told so. The workshop registration link still carries a September 2018 subject line. The artists page links to a web directory that no longer serves a real site. Classes are cancelled with no restart date. None of this was projected forward or tidied up.

## Authored fields
- `our_note` rests on: nothing addressed to groups anywhere on the site, one workshop for individuals using knives, no age guidance, and the cancellation notice.
- `practical_summary` rests on the facility fields, all null, plus the gaps list.
- `what_children_do` is null on purpose, as above.

- **Meets minimum viable record:** no. Missing a hero image, and no program has an age basis with a range or a cost field, because the site publishes none of them.
- **Confidence:** high that this is what the site says, medium that it still reflects the business. The site has not been meaningfully updated in years and the one offering it describes is cancelled, so a phone call may find a different picture entirely.

## Recommended follow up, in priority order
1. Whether anything is running at all, and whether the studio at Whippletree Junction is still open to visitors.
2. Price, and whether a group rate exists.
3. Youngest age, given the workshop uses carving knives.
4. Group size the studio can take.
5. How much notice is needed.
6. Washrooms, somewhere to eat and parking. None of these are mentioned anywhere on the site.
