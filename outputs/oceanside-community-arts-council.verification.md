# VERIFICATION — oceanside-community-arts-council

- **Fields checked:** 36 (33 venue fields, the empty programs array, the empty images array, coordinates)

- **Fields corrected:** 2
  - `venue.booking_email`: info@mcmillanartscentre.com -> null. That address is published on the council's contact page under "Email – Exhibitions & Classes", and it goes to the arts centre, which is a separate record. It is not a route for booking a visit to the council, so it has been dropped rather than presented as one. The other published address is for the artist directory and social network.
  - `venue.booking_method`: email -> null. With no email kept and no form aimed at visits, there is no booking route to name.

- **Fields set to null after review:** 3
  - `hosts_school_groups` and `hosts_daycare_groups` stay null, not false. The council never addresses children's groups either way, and silence is not refusal. It is not an adults-only body and it says in its own strategic plan that it wants to develop arts education and outreach for children.
  - `price_year_or_season`. No prices of any kind are published on the council's own site.

- **Conflicts recorded:** 0

- **Authored fields written:** none of the three, because there are no programs. `venue.description` is the only written prose, and it rests on the About page (chartered 1976 by the BC Arts Council, area from Nanoose Bay to Bowser matching School District 69, over 900 members, owns the upper half of the McMillan Arts Centre), The MAC page ("The Oceanside Community Arts Council proudly owns and operates the MAC") and the contact page (office at 133 McMillan Street, 11 am to 3 pm Tuesday to Sunday).

- **How this was kept separate from the McMillan Arts Centre record:** the council owns and operates the MAC, so a single record would double-count one building. The MAC record (`mcmillan-arts-centre-the-mac.json`) carries everything bookable in Parksville: the galleries, the gift shop, the Creative Kids after school club and summer classes, the community garden, and the phone and web form that reach them. This record carries the council as an organisation, with no programs, no images and a first gap that names the MAC record explicitly and says why both exist. Nothing was copied across in either direction, and no program from the arts centre's site has been re-listed here even though the council links to several of them, because those pages sit on mcmillanartscentre.com. This follows the treatment already used for the Nanaimo Arts Council and the Nanaimo Art Gallery.

- **Meets minimum viable record:** no. There is no hero image and no program. Both are correct: the site publishes nothing a children's group can book, and its only pictures are the council logo, a magazine cover, a line drawing asking for a volunteer, and a farmers market poster.

- **Confidence:** high. The site is small, the six live event listings were each read, the Story Time category was opened and confirmed empty, and every page was checked in a browser as well as by fetch. The conclusion that the council itself hosts nothing bookable is well supported.

- **Recommended follow up by phone or email** (250-248-8185), in priority order:
  1. **Anything for a group at all.** Would the council put a class or a daycare room in touch with one of its member artists, or arrange a session, and if so at what cost?
  2. **Where to go instead.** Ask whether the MAC will take a booked group, since that is the building they run and its own site says nothing about group bookings either.
  3. **Outreach plans.** Their strategic plan names arts education and outreach for children as a goal, so ask whether anything is coming.
