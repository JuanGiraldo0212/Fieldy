ALTER TABLE "program" ALTER COLUMN "mood_tags" SET DATA TYPE text[];--> statement-breakpoint
--> hand-added: rewrite the retired value while the column is still text.
--> Without this the cast back to the new enum fails on any row holding 'fun'.
UPDATE "program"
   SET "mood_tags" = array_replace("mood_tags", 'fun', 'play')
 WHERE 'fun' = ANY("mood_tags");--> statement-breakpoint
DROP TYPE "public"."mood_tag";--> statement-breakpoint
CREATE TYPE "public"."mood_tag" AS ENUM('play', 'explore', 'active', 'creative', 'learn');--> statement-breakpoint
ALTER TABLE "program" ALTER COLUMN "mood_tags" SET DATA TYPE "public"."mood_tag"[] USING "mood_tags"::"public"."mood_tag"[];