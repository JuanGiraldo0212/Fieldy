# VERIFICATION — mary-fox-pottery

- **Fields checked:** 34 (33 venue, 1 image). Programs is empty by the prompt's not-for-groups rule, so no program fields were checked.
- **Fields corrected:** 1
  - `hours_notes`: first draft carried only the summer hours from the contact page body. Corrected to carry both seasons and the Sunday by chance line, which only appears in the site wide footer.
- **Fields set to null after review:** 3
  - `booking_email` — the contact page offers a form, not an address. Nothing was copied from a directory.
  - `booking_method` — there is a contact form, but nothing to book. Recording `web_form` would imply a group can reserve something, which they cannot.
  - `has_washrooms`, `wheelchair_accessible`, `bus_parking` and every other facility field — a retail shopfront with no published facility text.
- **Conflicts recorded:** 0.
- **Authored fields written:** none of the three, because there is no program. The judgement call sits in `description` and in the first `gaps` line instead.
- **The honest judgement, since the brief asked for one:** this is a retail studio, not a venue a group can visit as a group. Four things point the same way. The gallery is described only as open to the public with shop hours. The contact page's second heading is How to Order, and covers payment by e-transfer, PayPal and a 50 per cent deposit on special orders. The About page frames the whole enterprise around buying: "Whether you are buying my art pieces or some of the tableware created here". And a search of their own site for school, group, workshop and class returns nothing but blog posts about the adult apprenticeship and about book launches. There is no class, no drop in clay session, no studio tour and no group booking anywhere. `hosts_school_groups` and `hosts_daycare_groups` are therefore both `false` under the prompt's retail-only carve-out, not left null.
- **Staleness noted:** their own blog post says the two year apprenticeship has been discontinued, while the Legacy Project pages still advertise it and the menu still links an Apprenticeship Program 2022-2025. Recorded in `gaps`. It does not affect any group-facing fact.
- **Meets minimum viable record:** no, and correctly so. There are no programs, which is the whole point of the record. The venue block is otherwise complete: id, name, address, coordinates, category, checked_on and a hero image with alt.
- **Confidence:** high. Five pages plus three site searches all agree, and nothing on the site is written for children or for groups.
- **Recommended follow up by phone or email:** none needed for the catalogue. If someone wants this venue reconsidered, the single question for (250) 245-3778 is whether a small group of children may come into the gallery during opening hours and watch from the studio doorway. For a clay session for a group in this area, the Arts Council of Ladysmith and District entry is the better lead.
