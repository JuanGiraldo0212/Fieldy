# Design gaps

Things built that the design does not show, and places the build knowingly
departs from it. Seeded from `docs/design-map.md` §9; entries are added as they
are actually hit, with what was built and why.

Two kinds of entry:

- **Gap** — the design has no frame for this. Built in the design's language,
  and it should be drawn properly before launch.
- **Deviation** — the design has a frame, and we did something else on purpose.
  Needs a reason, and the reason has to survive being read back.

---

## Built so far

### Deviation — catalog map is a component, not an iframe

*Slice 1. `src/components/catalog/catalog-map.tsx`.*

The design embeds `venue-map-bright.html` as an iframe that loads Leaflet from
unpkg, because the prototype had no build step. Ours is a client component using
the `leaflet` npm package: same tiles, same pins, same dashed single-venue line,
same `fitBounds` padding and `maxZoom`. No runtime CDN dependency, and no iframe
whose state has to be kept in sync with the page's own.

Visually identical. Recorded because someone comparing file to file will notice
the iframe is gone.

### Deviation — a missing fact is not a feasibility failure

*Slice 1. `src/lib/catalog/feasibility.ts`, plan §5.1.*

The design's `fit()` raises a reason when age, capacity or price is
**unpublished**. On the real catalog that made every one of 39 programs amber —
33 publish no capacity, 18 no youngest age, 13 no price — and only 9 of the 94
reasons raised were an actual mismatch.

Now only known mismatches go amber. Unknowns still render as "Capacity not
published" / "Price not published" / "Ages not published" and still become
pre-selected asks on the request.

The three retired strings are listed in `docs/design-map.md` §7 so nobody
reinstates them from the prototype.

### Deviation — filter drawer applies immediately

*Slice 1. `src/components/catalog/search-controls.tsx`.*

The design's drawer edits a draft and commits on **Apply**, with **Cancel**
discarding. Ours applies each toggle straight to the URL.

Reason: every other control on the screen applies immediately, and with twelve
checkboxes the draft/commit distinction costs more than it buys. Revisit if the
filter set grows, or if testing shows people expect Cancel to undo.

### Deviation — the "Fun" mood chip is "Play"

*Slice 1. `src/components/catalog/search-controls.tsx`, and the `mood_tag` enum.*

The design's six mood chips are Fun, Explore, Active, Creative, Learn, Surprise
me. Five of those name what the children do. "Fun" names how it is supposed to
feel — and it implies the other four are not, which is both untrue and unhelpful
when a director is choosing between them.

The programs tagged `fun` had a common thread that was not a feeling: petting
the goats, the dress-up box, sitting in a fighter jet's cockpit, playing fan tan
and trying on the costume. In every case **the children do the thing themselves
rather than being shown it**. That is `play`, and it is observable rather than a
value judgement.

Same six programs, same pink chip and tint, new label and a Blocks icon in place
of Sparkles. The design's frame needs its label updated.

### Gap — the report form

*Slice 2. `src/components/program/report-form.tsx`, `src/app/api/reports/route.ts`.*

The design has the link and the thanks state, but no form between them. Built
plainly: the labels already on the page are offered as chips so "which detail is
wrong" is a tap rather than a sentence, the note is optional, and no account is
needed. Requiring a login to tell us we are wrong would mean we mostly do not
get told.

Two copy changes from the design, both to drop an em dash:
"Tell us — takes one tap" is "Tell us, it takes one tap", and
"Thanks — we will re-check this venue this week." is "Thanks. We will re-check
this venue this week."

Needs a frame.

### Gap — catalog empty state

*Slice 1. `src/app/page.tsx`.*

The prototype never renders a no-results state. Built plainly, and it names the
filter most likely to be the cause — walking, which only reaches 2.5 km — rather
than only apologising.

Needs a frame.

### Deviation — `unverified` images render anyway

*Slice 1. Resolved; see `docs/decisions.md` for the full reasoning.*

`outing-schema.md` withholds `usage: "unverified"` images from rendering, and all
23 catalog images carry that value, so the catalog had no photography at all.

They now render, credited and proxied. The `usage` value was deliberately NOT
rewritten to `licensed` — nobody licensed these, and a false provenance claim in
the data would be worse than a missing picture. The render rule changed instead,
which is one condition and reversible.

Three venues still have no hero image at all, so 12 of 15 have photography and
the rest keep the initials tile.

---

## Still to build (from design-map §9)

Carried forward, not yet reached:

1. Status rail has no "Idea" step — dropped from the design's five, since a trip
   only exists once a request is sent.
2. Manual status selector and the "moved here when the venue replied" / "set by
   you" source line — required by spec §5.4.1 and interaction 7, no control in
   the design.
3. `unclear` suggestion intent renders no banner. Decided behaviour, not an
   omission.
4. Report form — the design has a one-tap link; plan §8 and `/api/reports` need
   fields.
5. `/inbox` screen and the nav unread badge.
6. `/login`, magic-link sent and expired states, centre and first-room
   onboarding.
7. Loading skeletons for catalog, trip and thread.
8. Network and validation error states; the "sending" moment after tapping Send;
   send-failure retry on the trip page.
9. `/dev/components` token and state gallery.
10. Help centre destination for "Visit our help center".
11. Spacing scale is not a clean 4pt grid; normalising will shift some frames.
12. Account and trip-page relay copy overridden — the design promises forwarded
    email copies, the relay is send-only. See design-map §7.1.
13. Reply notification email — no template designed.
