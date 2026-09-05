CREATE TABLE "rate_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
--> Mechanism, not an entity: nothing a signed-in user should read. Same as auto_response.
ALTER TABLE "rate_limit" ENABLE ROW LEVEL SECURITY;
