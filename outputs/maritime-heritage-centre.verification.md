VERIFICATION — maritime-heritage-centre

- Fields checked: 52 venue and program fields, 5 image entries, both program source_urls reopened in a browser and re-read from the live DOM.

- Fields corrected: 3
  - hours_notes: a plain fetch of the school programs page returned "Monday - Friday 10:00 AM to 4:30 PM, Saturday - Sunday 10:00 AM to 2:00 PM, Closed for holidays Dec 23 - Jan 6" in the page footer, on a page whose generator tag was two major versions behind every other page on the site. Opening the same URL in a browser showed the current footer, "Tuesday - Friday ... Saturday ..., Closed ... December 21 to January 5", identical to the rest of the site. The fetched footer was a stale cached copy. hours_notes now carries the live site-wide value. This is recorded as a RETRIEVAL NOTE in gaps so a fetch-only re-run does not reintroduce it.
  - geo_source: `site_embed` -> `geocoded`. The contact page map is `maps.google.com/maps?q=Maritime%20Heritage%20Centre&t=m&z=16&output=embed`, a search by name with no coordinates at all. The address link in the footer carries `@50.019962,-125.3192368,18593m`, which is a map viewport centre 6 km west of the building and was not used. lat/lng are geocoded from the published street address, and cross-check against the destination pair inside that same link (50.0199923, -125.2368285) to about 15 metres.
  - hosts_daycare_groups: drafted `false` -> `null`. The site never mentions daycares or preschools. The school program is written for classes and grades, which is silence about under fives, not a refusal.

- Fields set to null after review: 6
  - has_washrooms, has_lunch_space, has_rain_backup, stroller_accessible, wheelchair_accessible, bus_parking. The venue rentals page mentions a fully equipped kitchen for hire and the home page mentions ample parking, but both are written for wedding and event renters, not for a class, and neither states a washroom or an eating space for a school visit. facility_notes is null for the same reason.
  - age_basis, age and grade ranges on both programs. The school page says only "Can be adapted for all grades", which is not a range. No grades were converted into ages.
  - chaperone_ratio, adults_free, lead_time_days, deposit_required, payment_timing, cancellation_note all stayed null; none are published.

- Price re-read from the live DOM: $60 per class, twice on the page, once in the body copy and once in the Details list as "$60 per class (includes up to 30 students)". Recorded as `cost_per_group_cad` 60 with `cost_per_child_cad` null. Read per child, a class of 30 would have come out at $1,800 instead of $60, an error of $1,740, and that risk is named explicitly in gaps. `school_rate_only` is true: the page is titled for school programs and the copy says "your students". The post is dated August 2025 and carries no school year, which is recorded in price_year_or_season.

- Conflicts recorded: 2, both between the contact page and the site-wide footer, both live and both confirmed in a browser.
  1. Opening days. The contact page lists Monday through Sunday. The footer lists Tuesday to Friday and Saturday only. hours_notes takes the footer value, which appears on the home page (modified June 2026, later than the contact page's May 2026).
  2. Christmas closure. December 23 to January 6 on the contact page, December 21 to January 5 in the footer. seasonal_notes takes the footer value on the same basis.

- Authored fields written:
  - `what_children_do` on both programs. The school one rests on the three listed components: climbing aboard the BCP 45 and hearing about life at sea and the fishing industry, a scavenger hunt through the exhibits in small groups, and a hands on activity such as knot tying or signal flags. The drop in one rests on the four named interactive stations: knot board, bridge simulator, magnetic signal flag board and lighthouse light.
  - `our_note` on both. The school one names the per class reading of the $60 and the three practical things the site never says. The drop in one compares the two ways of getting a group in.
  - `practical_summary` on both, from the price, the duration, the indoor setting and the gaps list.
  - mood_tags are a real reading of the visit rather than the museum category. The school program is play, explore and learn: hands on the ropes and the boat, small groups finding things on a hunt, and a subject they come away knowing. The drop in visit drops `learn`, because without a guide the interactive stations are what they actually do.

- Images: 5 recorded, all on the venue's own WordPress uploads path, all https, all query strings stripped. Four of the five are CSS `background-image` values rather than `<img>` tags and would not have appeared in a plain DOM image query. All five alts were written by us after opening the image files in a browser and looking at them, and are marked `generated`; the site's own alt attributes on this site are post titles rather than descriptions of the photographs. Widths and heights are recorded only where the page's own og:image meta tags state them. No `rights_note`; the site has only a footer copyright line.

- Kept separate from other records: nothing was taken from `maritime-museum-of-british-columbia.json` (Victoria) or `port-alberni-maritime-discovery-centre.json` (Port Alberni). Every fact here comes from maritimeheritagecentre.ca. The Discovery Passage Aquarium is named on their page as a suggested pairing and is explicitly recorded in gaps as a separate organisation with nothing extracted from it.

- Meets minimum viable record: no. `age_basis` and an age or grade range are missing, because the site publishes neither. Everything else on the bar is present: id, name, address, lat, lng, category, checked_on, a hero image with alt, and a program with id, name, comes_to_you, a group cost and our_note.

- Confidence: high. The school program is a real, current, specifically priced offering with a booking address, confirmed twice on the live page. The one thing that would have gone wrong silently was the stale cached footer, and it was caught in the browser.

- Recommended follow up by email (info@maritimeheritagecentre.ca) or phone (250-286-3161), in priority order:
  1. Price: confirm $60 is still the class rate for the 2026 to 2027 school year, what a class over 30 costs, and whether accompanying adults pay the $8 admission.
  2. Youngest age: whether a daycare or preschool group is taken at all, and whether the program can be shortened for under fives.
  3. Capacity: 30 students is the published ceiling, but whether two classes can be booked back to back is not.
  4. Lead time: no minimum notice is published.
  5. Lunch: whether a class can eat on site, and whether there is anywhere to leave coats and bags.
  6. Washrooms: not stated anywhere on the site.
  7. Rain backup is a non-issue since the visit is indoors, but coach parking at 621 Island Highway is not stated and should be asked about.
  8. Opening days: their own pages disagree about Mondays and Sundays.
