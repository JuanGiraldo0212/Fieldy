# VERIFICATION — Bernadette McCormack, Hummingbird Studio

- **Fields checked:** 33 venue fields, 1 image entry, 0 programs. The whole site is a single page plus product pages, so verification meant re-reading that one page in the browser after the render.
- **Fields corrected:** 0.
- **Fields set to null after review:** 3
  - `address`, `lat`, `lng` — the site names Ladysmith as where the artist lives and Duncan appears only in our tracker. No street address is published anywhere, so nothing can be geocoded and no pin was placed.
- **Conflicts recorded:** 0. There is only one page, so nothing can disagree with anything.
- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` all belong to programs, and there are no programs. The venue `description` is factual and taken from what the page states about the artist and the shop.
- **Meets minimum viable record:** no. Missing `address`, `lat`, `lng`, and at least one program. This is the correct outcome, not a gap to be filled: there is no venue to visit.

## Why there is no program

The prompt says to check honestly whether a single-artist studio serves children's groups. It does not.

Fetching returned only `<head>` metadata, which is the Square Online rendering problem, so the page was read in a browser with a deep DOM walk. What is actually on it: an artist biography, a list of original paintings and prints for sale with prices in Canadian dollars, a note that Bernadette will be at the Duke Point Ferry Marketplace from 26 August to 8 September 2026, a phone number, an email address, and links to Facebook, Instagram and Society6. A link scan for pages on her own domain returned the home page and product pages only. There is no classes page, no workshops page, no studio-visit page, no opening hours and no address.

So `hosts_school_groups` and `hosts_daycare_groups` are both false, `programs` is empty, and the description says plainly that this is an online shop rather than a place a group can visit. No "Group visit" was manufactured.

- **Confidence:** high. The site is small and was read fully in a browser after render, so the absence of group offerings is a real absence rather than a rendering failure.

## Recommended follow up

Nothing to phone about for a field trip. If someone wants this venue in the catalog, the questions are prior to price and age:

1. Is there a physical studio open to visitors at all, and where is it?
2. Does she take school or daycare groups for a studio visit or a painting workshop, on request?
3. If so, what does it cost and what is the youngest age she will take?

Contact published on the site: (250) 715-5087, missmarymack80@gmail.com.

**Note for the next run:** this site returns an empty shell to a plain fetch. A fetch-only re-run will look like a dead domain. It is not.

**Note before publishing:** the site labels its photographs "Hummingbird Studio logo". The picture recorded as the hero is really a close-up of one of her dot paintings. The alt text was kept word for word because that is what the site says, but a human should rewrite it.
