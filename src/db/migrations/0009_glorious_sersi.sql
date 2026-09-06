ALTER TYPE "public"."account_role" ADD VALUE 'manager';--> statement-breakpoint
ALTER TYPE "public"."account_role" ADD VALUE 'ecea';--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "role_other" text;--> statement-breakpoint
ALTER TABLE "centre" ADD COLUMN "type_other" text;