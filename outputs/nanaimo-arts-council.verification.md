# VERIFICATION — nanaimo-arts-council

- **Fields checked:** 33 venue fields, plus the events calendar, the ArtWalk page and the one children's event, checked in a live browser as well as by fetch.

- **Fields corrected:** 0. Nothing was recorded that needed correcting; the record is mostly nulls because the organisation has no premises and publishes nothing bookable.

- **Fields set to null after review:** 3
  - `venue.address` — the only address anywhere on the site is a post office box, PO Box 401 Station A, Nanaimo BC V9R 5L3, on the contact page and in the footer. A post office box is not a place a group can go, so it is not recorded as an address. The wording is written out in gaps so nobody re-runs the venue looking for one.
  - `venue.lat` / `lng` / `geo_source` — all null, since there is no address to geocode and no map embed anywhere on the site.
  - `venue.hosts_school_groups` / `hosts_daycare_groups` — the site never mentions school or daycare groups in either direction. It gives no reason to say no, so these are null rather than false, even though the tracker row is marked `not_for_groups`.

- **Conflicts recorded:** 0. Their pages are consistent with each other.

- **Is anything bookable by a children's group?** No. This was the specific question, and the answer is that the council supports and organises rather than hosts. What it runs is ArtWalk, a free annual weekend festival in venues around downtown Nanaimo; Art Around Town, a members' exhibition in the Port Theatre lobby; three online galleries; annual ekphrastic poetry and short fiction competitions; and the Sea Wolf magazine. The autumn 2026 events calendar is film screenings, a craft fair and ArtWalk. The council has no building, no staffed venue and no rates page. The one item aimed at children is a free drop in art demonstration during the Commercial Street Night Market, run with Collage Club Nanaimo inside the Nanaimo Art Gallery's Art Lab, 15 to 20 minutes, open to all ages, described as annual. It is a drop in at a partner's venue rather than something a group books, so it is not recorded as a program, and the 2026 date has already passed.

- **Not the same organisation as the Nanaimo Art Gallery.** The gallery is at 150 Commercial Street and is catalogued separately in `nanaimo-art-gallery.json`. The two are easy to confuse because the council borrows the gallery's Art Lab for the night market demo and lists the gallery among its community partners. Nothing was copied between the records, and the gallery's address was not used for the council.

- **Images:** empty array, explained in gaps. The site has no photograph of anything a group would see. Its pictures are artwork from the online galleries, sponsor and funder logos, and one forest photograph used as a page background, which was opened and looked at and is not a picture of the council or of anywhere a group could go. Recording it as a header image would put a forest on a card for an organisation that has no premises.

- **Browser vs fetch:** the browser found one page background photograph the fetch did not return, and rendered the events calendar, which loads its listings in JavaScript and comes back empty to a plain fetch. Neither changed the outcome: the calendar is film screenings and a craft fair, and the photograph is not usable.

- **Authored fields written:** none. There are no programs, so `what_children_do`, `our_note` and `practical_summary` do not appear. The description is the only prose, and every clause in it is drawn from the about page, the ArtWalk page and the contact page.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a hero image and any program. Every one of those is missing because the site genuinely does not publish it, and the record should stay visibly short rather than be padded.

- **Confidence:** high on the conclusion, which is that there is nothing here to book. The site is small, current, dated August 2026 on its home page, and was read in full.

- **Recommended follow up by phone or email:**
  1. Ask whether they would put a group in touch with one of their member artists, or point you to a member organisation that does run sessions for children. That is the realistic use of this contact.
  2. Ask when the next night market art demonstration is, since they call it annual but have posted no new date.
  3. Ask whether a group could be walked round ArtWalk, and whether there is a meeting point or a guide, since the page addresses individual visitors only.
  - Contact is `office@nanaimoartscouncil.ca` or the form on their contact page. There is no published phone number.
