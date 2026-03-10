CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gmm_videos_title_trgm_idx" ON "gmm_videos" USING gin ("title" gin_trgm_ops);
