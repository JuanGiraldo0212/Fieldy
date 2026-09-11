VERIFICATION — kitty-coleman-woodland-gardens

- Fields checked: 47 venue and program fields, 4 image entries, both program source_urls reopened in a browser after the JSON was written.

- Fields corrected: 3
  - geo_source: `geocode_pending` -> `site_embed`. The contact page publishes the coordinates as plain text, "GPS co-ordinates 49.7883067,-125.0046239". That is the gardens' own published point for themselves, not a map viewport centre. The Google Maps link on the same page carries `ll=49.788294,-125.004626`, which is a viewport centre and was NOT used, but it agrees with the published point to five decimal places, which is the cross-check.
  - programs[0].lead_time_days: first read as applying to both programs -> kept on the group visit only. The site's two sentences are "Guided tours can be prearranged. Group reservations can be arranged one day in advance." The one day notice sits on the second sentence, so the guided tour's lead time is now null.
  - hosts_school_groups / hosts_daycare_groups: first drafted as `false` -> `null`. The site never mentions schools, classes or daycares at all. Silence is not refusal.

- Fields set to null after review: 5
  - has_washrooms (nothing on any page mentions washrooms, including the garden map)
  - has_rain_backup (a gazebo and a tea room exist but neither is offered as shelter for a booked group)
  - stroller_accessible, wheelchair_accessible (bark mulch paths through woodland, no access statement)
  - price_year_or_season (no year or season is printed next to the admission prices)
  - youngest_age_welcomed_years stayed null. "Under 5 years old: free" is a price band, not an age policy, and was not converted into an age range. Neither program carries an age or grade range for the same reason.

- Conflicts recorded: 0. The September Artisans Festival on the home page and the May Art and Bloom festival on the calendar page are two different events at the same $10 entrance fee, not two answers to the same question.

- Authored fields written:
  - `what_children_do` on the group visit, resting on the about page (over a mile of hand laid bark mulch paths, several ponds, rustic benches, a gazebo with bird feeders around it, over 3,000 rhododendrons) and the labyrinth named on the home page and marked on the published garden map. Left null on the guided tour, because the site says a tour can be arranged and never says what happens on one.
  - `our_note` on both, resting on the visit being wholly outdoors on soft paths, the absence of any washroom mention, and the fact that the tour has no published price or length.
  - `practical_summary` on both, from the published amenities (picnic area, gazebo, tea room), the daily 9 a.m. to dusk hours, and the gaps list.

- Images: 4 recorded, all on woodlandgardens.ca. Two carry the site's own non-empty alt attributes and are marked `site`. Two were written by us after opening the image files in a browser and looking at them, and are marked `generated`. There is no Open Graph image on this site, so the hero is the main home page photograph (a fountain in a pond behind rhododendron blooms). Every photograph on the about page is under 400 pixels on its longest side and was skipped. No `rights_note` was set; the only copyright line on the site is the site-wide footer, which is not a photo credit.

- Meets minimum viable record: no. `age_basis` and an age or grade range are missing, because the gardens publish neither. Everything else on the bar is present: id, name, address, lat, lng, category, checked_on, a hero image with alt, and two programs each with id, name, comes_to_you, our_note and a cost answer.

- Confidence: high on the facts, medium on fitness for a group. The site is plain static HTML that fetched and rendered identically, the prices and hours are unambiguous, and the coordinates are the venue's own. What is medium is that the site was written for individual visitors and weddings, so almost everything a director needs about groups is absent rather than uncertain.

- Recommended follow up by phone (250-338-6901) or email (bzimmerman@shaw.ca), in priority order:
  1. Price: is there a group or school rate, and do accompanying adults pay the $8?
  2. Washrooms: none are mentioned anywhere on the site. This is the single biggest unknown for an under-fives group.
  3. Guided tour: what does one cost, how long does it run, and is the guide used to young children?
  4. Youngest age welcomed and whether they take daycare or school groups at all.
  5. Capacity: how large a group can be booked on one day's notice.
  6. Lunch: whether the picnic area and tea room are available to a booked group, and whether there is any indoor fallback in rain.
  7. Access: whether the bark mulch paths take strollers, and where a bus can park at the main entrance.
