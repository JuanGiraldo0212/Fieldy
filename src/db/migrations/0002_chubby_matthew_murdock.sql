--> HAND-EDITED. Do not regenerate this file; drizzle-kit's output does not work.
--> Two repairs, both required for this migration to run at all:
-->
-->   1. drizzle-kit emitted `SET DATA TYPE text` for a mood_tag[] column.
-->      Postgres rejects that outright ("cannot be cast automatically to
-->      type text"). It has to be text[].
-->   2. The retired 'fun' value has to be rewritten while the column is
-->      still text. Without the UPDATE below, the cast back to the new enum
-->      fails on any row that still holds it.
-->
--> Verified by replaying 0000-0002 against an empty Postgres 17.
ALTER TABLE "program" ALTER COLUMN "mood_tags" SET DATA TYPE text[];--> statement-breakpoint
UPDATE "program"
   SET "mood_tags" = array_replace("mood_tags", 'fun', 'play')
 WHERE 'fun' = ANY("mood_tags");--> statement-breakpoint
DROP TYPE "public"."mood_tag";--> statement-breakpoint
CREATE TYPE "public"."mood_tag" AS ENUM('play', 'explore', 'active', 'creative', 'learn');--> statement-breakpoint
ALTER TABLE "program" ALTER COLUMN "mood_tags" SET DATA TYPE "public"."mood_tag"[] USING "mood_tags"::"public"."mood_tag"[];