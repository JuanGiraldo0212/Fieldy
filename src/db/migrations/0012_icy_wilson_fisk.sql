ALTER TABLE "room" ALTER COLUMN "icon" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "room" ALTER COLUMN "icon" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."room_icon";--> statement-breakpoint
CREATE TYPE "public"."room_icon" AS ENUM('baby', 'smile', 'heart', 'star');--> statement-breakpoint
UPDATE "room" SET "icon" = CASE "icon"
	WHEN 'baby' THEN 'baby'
	WHEN 'cap' THEN 'star'
	ELSE 'smile'
END;--> statement-breakpoint
ALTER TABLE "room" ALTER COLUMN "icon" SET DATA TYPE "public"."room_icon" USING "icon"::"public"."room_icon";--> statement-breakpoint
ALTER TABLE "room" ALTER COLUMN "icon" SET DEFAULT 'smile'::"public"."room_icon";
