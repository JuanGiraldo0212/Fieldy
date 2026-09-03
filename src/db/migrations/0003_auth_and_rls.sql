--> Hand-written. drizzle-kit does not generate triggers, policies or buckets,
--> and this is the security boundary, so it is worth reading rather than
--> generating. Plan section 4.1.

--> ─── auth.users to account ─────────────────────────────────────────────────
--> data-model.md section 1: "A trigger on auth.users insert creates the
--> account row with the email." The name is a placeholder until onboarding
--> collects a real one; the local part of the address is a better first guess
--> than an empty string, and the account screen lets them fix it.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.account (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;--> statement-breakpoint

drop trigger if exists on_auth_user_created on auth.users;--> statement-breakpoint

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();--> statement-breakpoint

--> ─── Row Level Security ────────────────────────────────────────────────────
--> The app connects through Drizzle as the table owner, which is EXEMPT from
--> RLS. These policies are therefore a safety net for anything that reaches
--> the database with a user's own credentials (the Supabase client, a leaked
--> anon key), not the primary access control. Scoping by centre in application
--> code is what actually protects a centre's data.

alter table "account" enable row level security;--> statement-breakpoint
alter table "centre" enable row level security;--> statement-breakpoint
alter table "room" enable row level security;--> statement-breakpoint
alter table "trip" enable row level security;--> statement-breakpoint
alter table "message" enable row level security;--> statement-breakpoint
alter table "saved_outing" enable row level security;--> statement-breakpoint
alter table "report" enable row level security;--> statement-breakpoint
alter table "venue" enable row level security;--> statement-breakpoint
alter table "program" enable row level security;--> statement-breakpoint
alter table "image" enable row level security;--> statement-breakpoint

--> The caller's centre, as a function so every policy says the same thing.
create or replace function public.my_centre_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select centre_id from public.account where id = auth.uid()::text
$$;--> statement-breakpoint

--> account: yourself, and nobody else.
create policy account_self on "account"
  for all to authenticated
  using (id = auth.uid()::text)
  with check (id = auth.uid()::text);--> statement-breakpoint

create policy centre_own on "centre"
  for all to authenticated
  using (id = public.my_centre_id())
  with check (id = public.my_centre_id());--> statement-breakpoint

create policy room_own on "room"
  for all to authenticated
  using (centre_id = public.my_centre_id())
  with check (centre_id = public.my_centre_id());--> statement-breakpoint

create policy trip_own on "trip"
  for all to authenticated
  using (centre_id = public.my_centre_id())
  with check (centre_id = public.my_centre_id());--> statement-breakpoint

--> A message is reachable through its trip, so it inherits the trip's centre.
create policy message_own on "message"
  for all to authenticated
  using (
    exists (
      select 1 from public.trip t
      where t.id = message.trip_id and t.centre_id = public.my_centre_id()
    )
  )
  with check (
    exists (
      select 1 from public.trip t
      where t.id = message.trip_id and t.centre_id = public.my_centre_id()
    )
  );--> statement-breakpoint

create policy saved_own on "saved_outing"
  for all to authenticated
  using (account_id = auth.uid()::text)
  with check (account_id = auth.uid()::text);--> statement-breakpoint

--> The catalog is public and read-only. Writing is the import script's job,
--> which runs as the owner and is exempt from these.
create policy catalog_read_venue on "venue"
  for select to anon, authenticated using (true);--> statement-breakpoint
create policy catalog_read_program on "program"
  for select to anon, authenticated using (true);--> statement-breakpoint
create policy catalog_read_image on "image"
  for select to anon, authenticated using (true);--> statement-breakpoint

--> Anyone may tell us the catalog is wrong, signed in or not. The catalog is
--> only trustworthy if correcting it is one tap. Nobody may read reports back.
create policy report_insert_anyone on "report"
  for insert to anon, authenticated with check (true);--> statement-breakpoint

--> ─── Storage ───────────────────────────────────────────────────────────────
--> Private bucket for raw inbound email and attachments (plan section 2).
--> Signed URLs are generated per render and expire in an hour; nothing here is
--> ever public.
insert into storage.buckets (id, name, public)
values ('mail', 'mail', false)
on conflict (id) do nothing;
