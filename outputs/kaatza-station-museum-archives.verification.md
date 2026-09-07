# VERIFICATION — Kaatza Station Museum & Archives

- **Fields checked:** 33 venue fields, 2 programs at 46 fields each, 2 image entries, 9 gaps.
- **Fields corrected:** 2
  - `programs[museum-visit].days_offered`: `[2,3,4,5]` -> `null`. The opening days change with the season, Tuesday to Friday from September to June and Tuesday to Saturday in July and August, so a single weekday list would be wrong for half the year. The pattern is written out in the program description and in the venue's opening hours instead.
  - `venue.address`: the site's own page text says "125 B South Shore Road" while the machine readable business block in the page source says "125 South Shore Road". Kept the human written version with the unit letter, since that is what a driver needs. Not raised as a conflict because it is the same building.
- **Fields set to null after review:** 4
  - `venue.has_washrooms`, `venue.has_lunch_space`, `venue.stroller_accessible`, `venue.wheelchair_accessible`. A 1913 railway station photographed with steps up to the platform tempts an inference. The site says nothing about any of it, so all four stay null.
- **Conflicts recorded:** 0. The seasonal hours are stated identically on the home page, the about page, the contact page and in the footer of every interior page.

## Re-read in STEP 3

The site is a Wix build. A plain fetch does return full body text here, but every claim was re-read from the live rendered page in the browser anyway, since Wix pages are the class of page most likely to serve something stale. The home page welcome paragraph, the seasonal hours, the address, both email addresses and the Bell Tower School note all matched word for word.

No prices exist on this site at all, for anyone, so there was nothing price bearing to re-check. That is itself the largest gap in the record.

- **Evidence quotes:** both confirmed contiguous and verbatim on their source pages.
  - Museum visit: "The museum contains a variety of exhibits dedicated to the history of Lake Cowichan and the forestry industry" — on `/about`.
  - Bell Tower School: "The school is not open to visitors at this time, but tours can be arranged if booked ahead." — on `/bell-tower-school`, following the word "Note:" which was not included so the quote stays contiguous.
- **School and daycare groups:** both left **null**, not false. The site never mentions schools, classes, daycares, students or children anywhere. Silence is not refusal, so these render as "not stated, ask when you book" rather than as a closed door.
- **Age basis:** null on both programs, and no age or grade range is set, because the museum publishes none. This is the single reason the record falls below the publishable bar, and it should stay visible rather than be filled with an invented range.
- **Costs:** null on both, with `is_free` also null. There is no admission price anywhere on the site, and no statement that entry is free or by donation. Recording either would be invention.
- **`school_rate_only`:** false on both. No price was published for schools specifically because no price was published at all.
- **mood_tags:** `explore` and `learn` on both. The displays are model rooms, cased artifacts and photographs to look at, and the outdoor rolling stock is walked around rather than climbed on. Nothing on the site describes children handling anything, so `play` would be wrong. The grounds are flat and small, so `active` would be overstating it.
- **Images:** 2 entries, both on the site's own Wix media CDN, both confirmed present on the page recorded in `found_on_url`, both absolute and https. Both were opened in the browser and looked at before their alt was written, because the site's alt attributes are file names ("TVI-KaatzaStationMuseum-24.jpg", "DSC02306.JPG") rather than alt text, which is exactly the case the rules treat as an accessibility failure. Both are therefore `generated`. No captions were invented. `rights_note` null on both, since the only credit on the site is the footer copyright line.
- **Location:** the site publishes its own business coordinates in the page source, `"businessLocationCoordinates":{"latitude":48.8229803,"longitude":-124.0581217}`, alongside the matching street address. Recorded to five decimal places with `geo_source` `site_embed`. No pin was hand placed and no third party lookup was used.
- **Staleness:** the site's copyright line reads 2021 and the Mill Room and a Chinese Heritage exhibit are both flagged on the site as unfinished. The seasonal hours are written as a standing pattern with no year attached, so nothing was projected forward and `price_year_or_season` stays null. Both points are in gaps.
- **Meets minimum viable record:** **no**. Venue block is complete, and there is a hero with alt. What is missing is `age_basis` plus a published range on both programs, and any cost field or `is_free`. Neither is published, so the record misses the bar visibly, which is the intended behaviour.
- **Confidence:** **medium**. Everything recorded is well supported and was re-read live, but this is a small volunteer run museum whose site answers almost nothing a director actually needs, so the record is thin by the venue's own doing rather than by any gap in the extraction.

## Recommended follow up by phone or email

Call 250-749-6142 or email kaatzamuseum@shaw.ca, in this order:

1. **Price** — what a class or daycare group costs, per child, and whether accompanying adults pay.
2. **Youngest age** — whether they take preschool and daycare groups at all, and from what age.
3. **Capacity** — how many children fit in the station rooms at one time, and whether they split a group.
4. **Lead time** — how far ahead to book, and specifically how far ahead for the Bell Tower School tour, which only runs if arranged.
5. **Lunch space** — whether there is anywhere indoors or on the grounds for a group to eat.
6. **Washrooms** — whether there are any on site and whether they suit small children.
7. **Rain backup** — the outdoor rolling stock is a good part of the visit, so ask what is left on a wet day.
8. Also worth asking whether the Mill Room has reopened, and how long a visit usually takes.
