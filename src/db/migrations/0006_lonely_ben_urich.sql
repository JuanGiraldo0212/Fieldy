CREATE TABLE "auto_response" (
	"address" text PRIMARY KEY NOT NULL,
	"last_sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
--> RLS with no policies at all, which is the point: nobody reachable through
--> PostgREST may read or write this. It is operational state for the inbound
--> webhook, written by the service role, and a list of addresses that have
--> emailed us is not something a signed-in user has any business reading.
alter table "auto_response" enable row level security;
