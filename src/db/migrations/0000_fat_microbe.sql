CREATE TYPE "public"."account_role" AS ENUM('ece', 'director', 'teacher', 'other');--> statement-breakpoint
CREATE TYPE "public"."age_basis" AS ENUM('years', 'grades');--> statement-breakpoint
CREATE TYPE "public"."booking_method" AS ENUM('email', 'phone', 'web_form', 'shop');--> statement-breakpoint
CREATE TYPE "public"."centre_type" AS ENUM('daycare_preschool', 'elementary', 'middle', 'secondary', 'other');--> statement-breakpoint
CREATE TYPE "public"."image_role" AS ENUM('hero', 'program', 'space', 'activity');--> statement-breakpoint
CREATE TYPE "public"."image_usage" AS ENUM('licensed', 'venue_supplied', 'public_domain', 'unverified');--> statement-breakpoint
CREATE TYPE "public"."message_channel" AS ENUM('email', 'web_form', 'phone_log');--> statement-breakpoint
CREATE TYPE "public"."message_party" AS ENUM('educator', 'venue', 'system');--> statement-breakpoint
CREATE TYPE "public"."mood_tag" AS ENUM('fun', 'explore', 'active', 'creative', 'learn');--> statement-breakpoint
CREATE TYPE "public"."program_format" AS ENUM('guided', 'self_guided', 'hands_on', 'interactive');--> statement-breakpoint
CREATE TYPE "public"."rate_class" AS ENUM('daycare', 'school');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('new', 'checked', 'fixed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."room_icon" AS ENUM('baby', 'backpack', 'cap', 'users');--> statement-breakpoint
CREATE TYPE "public"."status_source" AS ENUM('system', 'manual');--> statement-breakpoint
CREATE TYPE "public"."transport_mode" AS ENUM('walking', 'bus', 'parent_drivers', 'none');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('requested', 'replied', 'confirmed', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."venue_category" AS ENUM('animals_farms', 'nature_outdoors', 'museums_history', 'arts_performance', 'science', 'community_civic', 'comes_to_you');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "account_role" DEFAULT 'director' NOT NULL,
	"phone" text,
	"centre_id" text,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "account_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "centre" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "centre_type" NOT NULL,
	"address" text NOT NULL,
	"lat" real,
	"lng" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" text PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"url" text NOT NULL,
	"role" "image_role" NOT NULL,
	"alt" text NOT NULL,
	"alt_source" text,
	"caption" text,
	"found_on_url" text,
	"width" integer,
	"height" integer,
	"rights_note" text,
	"usage" "image_usage" DEFAULT 'unverified' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"trip_id" text NOT NULL,
	"party" "message_party" NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"body_full" text,
	"is_request" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"raw_ref" text,
	"channel" "message_channel" DEFAULT 'email' NOT NULL,
	"external_message_id" text,
	"send_error" text,
	"notify_error" text,
	"suggestion" jsonb
);
--> statement-breakpoint
CREATE TABLE "program" (
	"id" text PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"what_children_do" text,
	"our_note" text,
	"practical_summary" text,
	"comes_to_you" boolean DEFAULT false NOT NULL,
	"age_min_years" real,
	"age_max_years" real,
	"grade_min" integer,
	"grade_max" integer,
	"age_basis" "age_basis",
	"duration_min" integer,
	"capacity_max" integer,
	"capacity_min" integer,
	"cost_per_child_cad" numeric(10, 2),
	"cost_per_group_cad" numeric(10, 2),
	"cost_per_adult_cad" numeric(10, 2),
	"free_adults_per_children" integer,
	"is_free" boolean,
	"tax_included" boolean,
	"extra_fees_note" text,
	"school_rate_only" boolean DEFAULT false NOT NULL,
	"deposit_required" boolean,
	"payment_timing" text,
	"cancellation_note" text,
	"months_offered" integer[],
	"days_offered" integer[],
	"time_slots" text[],
	"lead_time_days" integer,
	"chaperone_ratio" jsonb,
	"adults_free" boolean,
	"indoor" boolean,
	"outdoor" boolean,
	"format" "program_format"[],
	"sensory_friendly" boolean,
	"low_noise" boolean,
	"neurodiversity_friendly" boolean,
	"mood_tags" "mood_tag"[],
	"curriculum_tags" text[],
	"booking_email" text,
	"booking_url" text,
	"booking_method" "booking_method",
	"source_url" text,
	"evidence" text,
	"checked_on" date,
	"image_ids" text[],
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" text PRIMARY KEY NOT NULL,
	"program_id" text,
	"venue_id" text,
	"account_id" text,
	"field" text,
	"note" text,
	"status" "report_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" text PRIMARY KEY NOT NULL,
	"centre_id" text NOT NULL,
	"name" text NOT NULL,
	"icon" "room_icon" DEFAULT 'users' NOT NULL,
	"age_min" real NOT NULL,
	"age_max" real NOT NULL,
	"size" integer NOT NULL,
	"ratio_children_per_adult" integer NOT NULL,
	"budget_per_child" numeric(10, 2),
	"transport" "transport_mode"[] NOT NULL,
	"address" text NOT NULL,
	"lat" real,
	"lng" real,
	"notes" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "room_notes_len" CHECK (char_length("room"."notes") <= 300)
);
--> statement-breakpoint
CREATE TABLE "saved_outing" (
	"account_id" text NOT NULL,
	"program_id" text NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_outing_account_id_program_id_pk" PRIMARY KEY("account_id","program_id")
);
--> statement-breakpoint
CREATE TABLE "trip" (
	"id" text PRIMARY KEY NOT NULL,
	"centre_id" text NOT NULL,
	"program_id" text NOT NULL,
	"room_ids" text[] NOT NULL,
	"status" "trip_status" DEFAULT 'requested' NOT NULL,
	"status_source" "status_source" DEFAULT 'system' NOT NULL,
	"relay_token" text NOT NULL,
	"venue_email" text,
	"last_venue_reply_at" timestamp with time zone,
	"date_options" jsonb NOT NULL,
	"confirmed_date" date,
	"confirmed_time" text,
	"children_count" integer NOT NULL,
	"adults_count" integer NOT NULL,
	"room_snapshots" jsonb NOT NULL,
	"cost_child" numeric(10, 2),
	"cost_adult" numeric(10, 2),
	"cost_group_fee" numeric(10, 2),
	"cost_transport" numeric(10, 2),
	"asks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tasks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trip_room_ids_non_empty" CHECK (array_length("trip"."room_ids", 1) >= 1)
);
--> statement-breakpoint
CREATE TABLE "venue" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website" text,
	"description" text,
	"category" "venue_category" NOT NULL,
	"address" text,
	"lat" real,
	"lng" real,
	"geo_source" text,
	"hosts_school_groups" boolean,
	"hosts_daycare_groups" boolean,
	"youngest_age_welcomed_years" real,
	"booking_email" text,
	"booking_phone" text,
	"booking_url" text,
	"booking_method" "booking_method",
	"has_washrooms" boolean,
	"has_lunch_space" boolean,
	"has_rain_backup" boolean,
	"stroller_accessible" boolean,
	"wheelchair_accessible" boolean,
	"bus_parking" boolean,
	"facility_notes" jsonb,
	"nearby_park" text,
	"restrictions" text[],
	"languages" text[],
	"general_admission_child_cad" numeric(10, 2),
	"general_admission_adult_cad" numeric(10, 2),
	"hours_notes" text,
	"seasonal_notes" text,
	"price_year_or_season" text,
	"checked_on" date NOT NULL,
	"checked_by" text,
	"gaps" text[],
	"conflicts" jsonb,
	"pages_opened" text[],
	"pages_useful" text[],
	"extracted_at" timestamp with time zone,
	"extractor_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_venue_id_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_trip_id_trip_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trip"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program" ADD CONSTRAINT "program_venue_id_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_venue_id_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venue"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_centre_id_centre_id_fk" FOREIGN KEY ("centre_id") REFERENCES "public"."centre"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_outing" ADD CONSTRAINT "saved_outing_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_outing" ADD CONSTRAINT "saved_outing_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_centre_id_centre_id_fk" FOREIGN KEY ("centre_id") REFERENCES "public"."centre"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip" ADD CONSTRAINT "trip_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "image_venue_id_idx" ON "image" USING btree ("venue_id");--> statement-breakpoint
CREATE INDEX "message_trip_sent_idx" ON "message" USING btree ("trip_id","sent_at");--> statement-breakpoint
CREATE INDEX "message_unread_idx" ON "message" USING btree ("read_at") WHERE "message"."read_at" is null;--> statement-breakpoint
CREATE INDEX "program_venue_id_idx" ON "program" USING btree ("venue_id");--> statement-breakpoint
CREATE UNIQUE INDEX "program_venue_slug_idx" ON "program" USING btree ("venue_id","slug");--> statement-breakpoint
CREATE INDEX "room_centre_id_idx" ON "room" USING btree ("centre_id");--> statement-breakpoint
CREATE INDEX "trip_centre_status_idx" ON "trip" USING btree ("centre_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_relay_token_idx" ON "trip" USING btree ("relay_token");--> statement-breakpoint
CREATE INDEX "venue_lat_lng_idx" ON "venue" USING btree ("lat","lng");