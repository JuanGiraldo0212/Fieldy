# b-c-archives.json

VERIFICATION

- **Fields checked:** 34 (33 venue fields plus the single program's non-null fields and both image entries), re-read against the BC Archives homepage, Access & Outreach, Plan Your Visit and Contact Us pages.
- **Fields corrected:** 3
  - `venue.website`: www.royalbcmuseum.bc.ca -> https://bcarchives.ca/ — the tracker URL is stale. BC Archives content now lives on its own domain, which is where every fact in this record was read. Noted in `gaps`.
  - `venue.name`: "B.C. Archives" -> "BC Archives" — the site writes it without periods throughout; the tracker spelling is kept only in the file name.
  - `venue.hosts_school_groups`: false -> null — a previous pass treated this venue as not serving groups. The Access & Outreach page does say "Staff provide tours of our facility and develop workshops", so the site is silent about school groups rather than closed to them. `hosts_daycare_groups` is left false because the site gives a reason: reference room registration requires being at least 16, and under-16s must be accompanied by a registered parent or guardian.
- **Fields set to null after review:** 2
  - `booking_email` — the address on both the Contact Us and Plan Your Visit pages is hidden behind Cloudflare email protection and cannot be read. The published reference desk phone number is recorded instead, and the gap is flagged.
  - `program.comes_to_you` — the Archives says it "participate[s] in community events across British Columbia", which is outreach at events, not a visit to a classroom. Neither true nor false is supportable.
- **Conflicts recorded:** 0 — the homepage hours block and the Plan Your Visit registration hours (Mon–Fri 10:00–18:00, Saturday 10:00–16:00) describe the same schedule; nothing else disagreed.
- **Authored fields written:** two of three.
  - `what_children_do` is null: the site never describes what anyone does on a facility tour or in a workshop beyond the topics covered, so there was nothing to ground it in.
  - `our_note` rests on the 16-and-over registration rule, the requirement that under-16s be accompanied by a registered parent or guardian for the whole visit, and the late-2026 move to the PARC Campus in Colwood.
  - `practical_summary` is generated from the reference room rules that are published (no food, drink or ink, quiet voices, free lockers and a coat rack in the lobby) against the unstated price, ages, capacity, washrooms and lunch space.
- **Meets minimum viable record:** no. Missing `venue.lat` and `venue.lng` (no geocoding available in this environment, and the site links to a shortened Google Maps URL rather than publishing coordinates; `geo_source` is `geocode_pending` with the full address captured). Also missing a qualifying program: the facility tour has no published age basis or range, no cost field and no `comes_to_you` value. Both hero and second image are present with verbatim site alt text.
- **Confidence:** medium. The address, hours, registration rules and reference room procedures are stated precisely on the venue's own site, but everything a group leader would need about the tours and workshops — who they are for, what they cost, how long they run, how to book — is simply not published, and the venue relocates to Colwood in late 2026.
- **Recommended follow up by phone or email** (BC Archives reference desk, 250-387-1952; the published email address is machine-obscured):
  1. Price — is there any charge for a facility tour or workshop?
  2. Youngest age — the 16+ rule covers reference room registration; does it also apply to a booked tour, and will they take a school class?
  3. Capacity — how many people can a facility tour take?
  4. Lead time — how far ahead must a tour be requested, and to which address?
  5. The move — will tours run at all through the late-2026 move to the PARC Campus in Colwood, and from which address?
  6. Lunch space — is there anywhere a group can eat on site?
  7. Washrooms and step-free access — neither is described anywhere on the site.
