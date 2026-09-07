# VERIFICATION — Excellent Frameworks - Home of the EJ Hughes Gallery

- **Fields checked:** 33 venue fields, 2 image entries, 7 gaps. No programs to check.
- **Fields corrected:** 1
  - `website`: `https://www.excellentframeworks.ca` -> `https://excellentframeworks.ca`. The www host redirects to the bare domain, and the page's own canonical link is the bare domain.
- **Fields set to null after review:** 0. Everything already null was never supported by the site in the first place (no washrooms, no lunch space, no accessibility, no admission price, no languages, no restrictions).
- **Conflicts recorded:** 0. Two small discrepancies were found and judged not worth showing a director: the story page says the business has been in Duncan "over forty years" while a sidebar on the shows page says "over 50 years", and the shows page footer omits the "and long weekends" part of the Sunday closure. The hours themselves agree on every page.

## The judgement call: is this a visitable gallery or a shop with art on the walls?

Read in full: home, custom framing, contact, our story, and the whole "Gallery Shows and Calls to Artists" category listing (two further pages of it exist and were not opened once the pattern was clear).

Everything on the site is retail or trade. Custom framing, glass replacement, insurance quotes, jersey framing, art consultation for businesses, art supplies, and a selling gallery of E.J. Hughes reproductions plus consigned work by named Vancouver Island artists with prices attached ("$365", "Sold"). The "shows" are calls for artists to submit work for a selling exhibition, not events for visitors. There is no schools page, no education page, no tours, no workshops, no group rate, no minimum or maximum group size, no notice period, no admission price, and the word school, class, student, daycare, child or teacher appears nowhere on any page opened.

The one line that comes closest to inviting a visit is on the home page: "His vision lives on at the E. J. Hughes Gallery and you are invited to come and share it." That is an invitation to walk in and look at art for sale during shop hours. It is not an offering for a group of children. Recorded as `not_for_groups`, consistent with the other commercial galleries already in this catalog.

`hosts_school_groups` and `hosts_daycare_groups` are both **false** rather than null, which is the correct use of false here: the site is not merely silent, it describes a business whose entire published activity is retail.

- **Authored fields written:** none of `what_children_do` / `our_note` / `practical_summary`, because there are no programs. The `description` is authored summary grounded in the home, custom framing, story and shows pages, and its last sentence states plainly what was and was not found.
- **Images:** 2 entries, both confirmed on the venue's own WordPress uploads directory and both confirmed present on the `found_on_url` recorded. The site publishes no og:image photograph, only a logo tile (`meta-msapplication-TileImage`), so the hero is the gallery interior photograph from the story page instead, and that is stated in gaps. The gallery interior image has no alt on the site, so the alt was written after opening the image in the browser and looking at it (`generated`). The front door photograph carries the site's own alt text, recorded verbatim (`site`). No captions were invented. `rights_note` is null on both: the only credit line on the site is the site-wide footer copyright, which is not a photo credit.
- **Location:** the contact page embeds a Google map whose URL carries `!2d-123.71091748432843!3d48.778670079279806` alongside the place string `115 Kenneth St, Duncan, BC V9L 1N5`. Those are coordinates the site itself publishes, so `geo_source` is `site_embed`, recorded to five decimal places. No pin was hand placed.
- **Meets minimum viable record:** **no**. Venue block is complete (id, name, address, lat, lng, category, checked_on, one hero with alt) but there are no programs, and there cannot be. That is the correct outcome for a `not_for_groups` venue and matches how the other retail galleries in this catalog were recorded.
- **Confidence:** **high**. The site is a plain WordPress build that fetched cleanly with full body text on every page, the business is plainly trading (a blog post dated April 2026), and the absence of any children's or group offering is consistent across every page.

## Recommended follow up by phone or email

Only if someone decides to challenge the `not_for_groups` call. In that case, one call to 250-746-7112:

1. Whether they would ever host a class or daycare group in the gallery, and from what age.
2. Whether it costs anything to bring a group in.
3. How many children they could take at once in the gallery room.
4. How much notice they would want.
5. Washrooms, and whether there is anywhere for a group to leave coats or eat.

Nothing on the site answers any of these, and none of it should be guessed.
