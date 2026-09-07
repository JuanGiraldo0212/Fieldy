# VERIFICATION: One Moon Gallery

- **Fields checked:** 32 (venue block only; programs and images are both empty by design)
- **Fields corrected:** 0
- **Fields set to null after review:** 1
  - `lat` / `lng` left null with `geo_source` set to `geocode_pending`. The contact page embeds a Google map, but the coordinates in that embed URL are the centre of a driving directions map from downtown Victoria, not a pin on the gallery. Recording them would have put the venue in the wrong place with no warning, so the address was captured instead.
- **Conflicts recorded:** 0
- **Does it serve children's groups:** no, and this was checked rather than assumed. Every page on the site was read: home, artist biography, galleries, new releases, events, multimedia, reviews and contact. The site describes a private showroom on the Esquimalt Nation reserve where Darlene Gait's paintings and limited edition prints can be viewed and bought, open Saturday and Sunday from 10 am to 5 pm. There is no tour, no workshop, no group rate, no booking route for a group and no mention of schools, daycares, children or youth anywhere. The events page lists nothing more recent than 2011, and the two events that did involve the public were a grand opening and a totem raising, both in 2007. `hosts_school_groups` and `hosts_daycare_groups` are therefore both false, `programs` is an empty array, and no "Group visit" program was invented.
- **Authored fields written:** none of the three. They live on programs, and there are no programs. The venue description is factual and says plainly what the site does and does not offer.
- **Images:** none. The site has no photograph of the gallery itself. What it has is a painted banner across the top, thumbnails of paintings, and one portrait of the artist. A painting is not a photo of the place a group would arrive at, and a portrait is a headshot, so `images` is an empty array and the reason is recorded in gaps.
- **Meets minimum viable record:** no, and it should not. There is no hero image and no program because the venue does not run one. Missing required fields are `lat`, `lng`, one hero image and at least one program.
- **Confidence:** high on the finding that this is a retail gallery rather than a group venue. Medium on the contact details, because the site's copyright line stops at 2011 and nothing has been added since, so the hours and phone number may be stale.
- **Tracker status:** `not_for_groups`

## Recommended follow up by phone or email

Only worth a call if someone specifically wants an Indigenous art visit in Esquimalt.

1. Whether the gallery still keeps Saturday and Sunday hours at all, given the site has not been touched since 2011.
2. Whether the artist would host a small group of children, since the site does not address it either way.
3. Everything else, because nothing about price, capacity, washrooms, parking or accessibility is published.
