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

### Deviation — archived rooms are shown, and can come back

*Slice 3. `src/components/rooms/rooms-screen.tsx`.*

The design's room dialog has a delete flow with an armed confirm and a blocked
state for the last room. Ours archives instead, per data-model.md's second
defended rule, and then keeps the archived rooms visible in a section of their
own with a way to restore them.

The design hides archived rooms entirely. That leaves an old trip naming a room
the director cannot find anywhere, which reads as data loss even though nothing
was lost. Showing them, greyed and clearly labelled, is more honest and costs
one small section.

The last-room rule is enforced in the server action, not the dialog, so it
holds whichever way the request arrives.

### Deviation — the top bar is missing "My trips", and gains "Sign in"

*Slice 3. `src/components/layout/top-nav.tsx`.*

The design's bar is wordmark, Find outings, My trips with a count pill, Groups,
and an avatar. Ours has no My trips, because /trips does not exist until slice
7 and a nav item that 404s is worse than one that is not there yet. NavLinks
already carries the shape, including the count pill, so it goes back in with
the route.

The design only ever draws the signed-in state. The catalog is public and most
first visitors arrive from a link in a text message, so a signed-out person
sees this bar before they have an account: they get "Sign in" where the avatar
would be, and no Groups item, since it would only bounce them to login.

### Gap — address autocomplete

*Slice 3. `src/components/ui/address-field.tsx`, `/api/geocode/suggest`.*

spec §5.8 asks for it — "Address entry uses autocomplete or a map pin; distance
calculations depend on it" — but the design draws a plain text field, so the
list, its keyboard behaviour and the confirmed tick are invented.

Picking a suggestion carries its coordinates through, so the server stores the
point the director actually saw rather than geocoding her text again and
possibly landing somewhere else.

Typing free text still works. The geocoder is a convenience, not a gate: if it
is slow, down, or does not know a rural address, the form still submits and the
server geocodes the string as before.

Needs a frame.

### Gap — login and first-run setup

*Slice 3. `src/app/login/`, `src/app/welcome/`.*

Neither screen exists in the design. Both built in its language.

Login is one field, because spec §5.10 is "email plus magic link, no
passwords". The "check your email" state is given as much care as the form:
sending a link and showing nothing is how people end up requesting four of
them, and only the newest works, so it says so.

Setup is one screen rather than a wizard, for the same reason spec §5.3 gives
for the plan screen. This is the first thing a director ever does, and a
three-step flow with a progress bar is a worse first impression than eight
fields she can see all of. It arrives pre-filled with the design's own
anonymous defaults, so she corrects rather than composes.

Both need frames.

### Gap — photo viewer

*Slice 2. `src/components/program/photo-strip.tsx`.*

The design shows three 200px thumbnails and nothing happens when you tap one.
Three thumbnails that size do not tell a director whether a space suits her
group, which is the whole reason the section exists, so tapping opens the
photograph properly.

Built on a native `<dialog>` with `showModal()`, which gives the focus trap,
Escape, page inertness and the top layer for free. Arrow keys move between
photographs and wrap. Eight of the thirty venues publish more than three
photographs, so the strip shows three and the last tile carries a "+N more"
badge rather than silently dropping the rest.

Needs a frame. The credit line inside the viewer ("From {venue}'s website") is
the same attribution promised in docs/decisions.md.

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

---

## Slice 4 — the plan screen and the trip page

**Built to the design**, with these differences, all logged rather than quietly
absorbed:

1. **The send degrades honestly when mail is not configured.** `mail.fieldy.ca`
   is verified and the sender is wired, but the screens still read
   `sendingConfigured()` rather than assuming: with no `RESEND_API_KEY` the
   button says "Save request" instead of "Send request", the preview helper
   explains why, and the trip page carries an amber banner naming the address
   the request will go to. A failed or skipped send lands in the message row's
   `send_error`, which is the field the design already reserves for it, and the
   waiting pill stays hidden because nobody is waiting on a venue that was
   never written to.

   The one failure this product cannot afford is a screen that looks like it
   sent when it did not: a director who believes the venue has been asked stops
   chasing them.

2. **The waiting pill and "Waiting for venue reply" are suppressed** while a
   request is undelivered. Nobody is waiting on a venue that was never written
   to.

3. **Date slots are shown in the trip's date cards**, which the design does not
   draw. A morning booking and an afternoon one are different trips to a
   toddler room, and the request asked for one of them.

4. **The checklist has an Edit toggle** — inline date, Remove, and one row for
   adding a step. Spec §5.4.4 requires all three; the design draws the read-only
   state only.

5. **The manual status selector is invented**, because the design's rail is
   read only and offers no control. The rail stays exactly as drawn and a
   select sits under it, with the source line spec §5.4.1 asks for. A select
   rather than tapping a rail step, for one reason: `cancelled` is a real
   status that is deliberately not on the rail, and a control that can only
   reach the four drawn steps cannot cancel a trip.

   The spec gives two source lines, "moved here when the venue replied" and
   "set by you". A third was needed: a brand new trip is `system` too and no
   venue has replied to it, so it says "set when the request went out" rather
   than claiming one did.

   Every manual change writes a `system` message into the thread, the same as
   an applied suggestion will. A status that changed with nothing in the thread
   to explain it is how two people at one centre end up disagreeing about what
   happened.

6. **System events render, reply bubbles do not.** The thin inline grey line of
   spec §5.4.5 is here because the status selector produces one. The venue
   bubbles it will sit between arrive with slice 5.

**Not built here, by design:** the reply bubbles, the compose box and the
suggestion banner. They arrive with slices 5 and 6, along with the mail that
produces them.


---

## Slice 5 — the thread, the compose box, and the mail behind them

7. **The compose field is a textarea, not the design's `<input>`.** The
   prototype (line 962) draws a single-line input 54px tall inside a 56px
   field. At rest this is that control, pixel for pixel — same height, same
   border, same radius, same paperclip. It grows instead of clipping once a
   follow-up runs past one line.

   A follow-up to a venue is routinely three sentences: "Thank you — one more
   thing. Is there anywhere the children can leave their wellies?" An input
   scrolls that sideways under the cursor, which is unusable on a phone, and
   this is the control that carries every word a director says to a venue after
   the first request.

8. **The compose box has a "sending" state, which the design does not draw.**
   The button reads "Sending…" and is disabled while the action runs. Without
   it, a director on a phone taps Send, sees nothing change, and taps again —
   and the venue gets the same question twice.

9. **The paperclip in the compose field stays decoration.** It is decoration in
   the prototype too, and sending attachments is out of scope for the MVP
   (plan §1). Rendered `aria-hidden`, not as a button: an affordance that does
   nothing when tapped is worse than no affordance.

10. **"Show full message" is built, though the design never draws it.**
    Spec §5.4.5 requires it. It appears only when `body_full` actually differs
    from the stripped body, so it is never a toggle that expands to the same
    text.

11. **An attachment chip with no working link.** Not a state the design
    considers, because the design has no failure modes. When we could not
    fetch or store the bytes, the chip still names the file and is not a link.
    A director who learns the venue sent "Booking form.pdf" can ask for it
    again; one who is shown nothing cannot.

12. **A failed message says so inside the thread.** The design's thread has no
    error state. A follow-up that did not send carries its `send_error` under
    the author line rather than looking like a message that went out.

13. **`--color-disabled` / `--color-disabled-ink` are new tokens**, lifted from
    the prototype's own disabled Send button (`#E8EFF7` on `#9FB6D9`). They
    were not in design-map §3 because nothing before this slice had a disabled
    primary button.

14. **`/dev/components` now exists**, which design-map §9 lists as a gap. It
    covers slice 5's thread and compose states. Earlier slices' components are
    not in it yet.

**Copy corrected here:** the trip page said "Replies will appear here and in
your email." — the stale string design-map §7.1 flags. It now reads "Replies
appear here, and we'll email you when one arrives.", and lives on the compose
box where the design puts it.
