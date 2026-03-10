ALTER TABLE "gmm_videos" ADD COLUMN "gmm_episode_number" bigint;--> statement-breakpoint
CREATE UNIQUE INDEX "gmm_videos_video_url_idx" ON "gmm_videos" USING btree ("video_url");--> statement-breakpoint
CREATE INDEX "gmm_videos_gmm_episode_number_idx" ON "gmm_videos" USING btree ("gmm_episode_number");--> statement-breakpoint
CREATE INDEX "gmm_videos_title_idx" ON "gmm_videos" USING btree ("title");--> statement-breakpoint
CREATE INDEX "gmm_videos_category_idx" ON "gmm_videos" USING btree ("category");