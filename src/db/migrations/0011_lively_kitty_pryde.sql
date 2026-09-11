ALTER TABLE "room" ADD COLUMN "photo_key" text;--> statement-breakpoint

--> ─── Storage ───────────────────────────────────────────────────────────────
--> Hand-written, like `mail` in 0003 and `catalog` in 0010. Private bucket for
--> each room's group photo, which is a picture of children. Nothing here is
--> ever public: reads go through /api/room-photo, which checks the viewer's
--> centre, and writes through the service role (src/lib/rooms/photo-storage.ts).
--> No policy grants a signed-in user direct access.
insert into storage.buckets (id, name, public)
values ('rooms', 'rooms', false)
on conflict (id) do nothing;