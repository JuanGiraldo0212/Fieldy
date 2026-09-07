# VERIFICATION — Point Ellice House Museum and Gardens

- **Fields checked:** 34 (33 venue plus 1 image). No programmes exist to check.

- **Fields corrected:** 0.

- **Fields set to null after review:** none were ever populated. The site publishes nothing to populate them with.

- **What happened.** The whole website is offline for the season. Every request to the domain, including `sitemap.xml` and every plausible sub-path, resolves to a single notice page reading, in full: the site is currently offline for the season; as of September 1st, 2026 the Point Ellice House web site is offline and the house is closed for the season; please check for updates Spring 2027.

- **Confirmed, not assumed.** Because an empty fetch is also the signature of a JavaScript-rendered site, this was escalated to the browser exactly as the method requires. In a live browser the page renders the same four lines. The rendered body text is 236 characters long, there is no shadow DOM content, no lazily loaded gallery and no navigation at all. This is a genuinely offline site, not a rendering failure.

- **Two hosts, two behaviours.** The tracker's address, `www.PointElliceHouse.com`, is dead: the `www` host returns a "Non-Existent Site" page from the BC government. The bare host, `pointellicehouse.com`, redirects to `pointellicehouse.econ.gov.bc.ca` and serves the offline notice. Both were tried. The lowercase bare host is what is recorded as the website.

- **Conflicts recorded:** 0.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` all belong to programmes, and there are no programmes to attach them to. Writing any of them would mean inventing a visit from nothing, which is the exact failure this pipeline is built to avoid.

- **Images:** 1. The exterior photograph is the only image on the notice page. It is served from the venue's own domain, it was present on the page recorded in `found_on_url`, and it has no alt attribute, so the alt is `generated` and was written after opening the image URL in a browser and looking at it. The photograph carries the museum's own logo across the sky, which is noted in gaps. No caption, no rights note, `usage` is `unverified`.

- **Location:** null. No address is published anywhere on the domain, so `lat`, `lng` and `geo_source` are all left blank rather than a pin being placed from the venue's name.

- **Deliberately not recorded as "not for groups."** `hosts_school_groups` and `hosts_daycare_groups` are left unanswered rather than set to no. The museum has historically run school programmes; the site simply is not publishing anything at the moment. Recording a no here would be a wrong answer with no visible warning.

- **Meets minimum viable record:** no. Missing `address`, `lat`, `lng` and any programme at all. This is the correct outcome, not a padding opportunity.

- **Status:** `error`, so it is re-run rather than mistaken for a venue with nothing to offer. The site itself names the date to come back: Spring 2027.

- **Confidence:** high that the site is offline and publishes nothing. Zero confidence about anything the venue actually offers, because nothing is published.

- **Recommended follow up.** Everything, and none of it from the website. Re-run this venue after Spring 2027, when the site is due back. In the meantime a director wanting Point Ellice House needs to reach the museum directly for school programmes, group tours, prices, the youngest age they take, capacity, lead time, lunch space, washrooms and wet weather cover, none of which exist online right now. No contact details are published on the notice page, so even the phone number has to come from elsewhere.
