-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "gmm_videos" (
	"episode" bigint PRIMARY KEY NOT NULL,
	"number_in_season" text,
	"title" text,
	"length" text,
	"gmmore_title" text,
	"release_date" text,
	"guests" text,
	"video_url" text,
	"gmmore_url" text,
	"gmmore_length" text,
	"season" bigint
);
--> statement-breakpoint
ALTER TABLE "gmm_videos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "gmm_videos" AS PERMISSIVE FOR SELECT TO public USING (true);
*/