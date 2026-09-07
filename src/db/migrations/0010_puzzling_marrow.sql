ALTER TABLE "account" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "program" ADD COLUMN "edited_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "venue" ADD COLUMN "edited_at" timestamp with time zone;--> statement-breakpoint

--> ─── Storage ───────────────────────────────────────────────────────────────
--> Hand-written, like the `mail` bucket in 0003. Public bucket for photographs
--> a venue hands us and an admin uploads on /admin. Public because the catalog
--> is public and these are meant to be seen; the URL is the plain object URL,
--> which next/image proxies like any other catalog host. Writes go through the
--> service role only (src/lib/catalog/uploads.ts); no policy grants a signed-in
--> user an upload.
insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do nothing;