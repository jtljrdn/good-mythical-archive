CREATE UNIQUE INDEX "gmm_videos_video_url_idx" ON "gmm_videos" ("video_url");--> statement-breakpoint
CREATE INDEX "gmm_videos_gmm_episode_number_idx" ON "gmm_videos" ("gmm_episode_number");--> statement-breakpoint
CREATE INDEX "gmm_videos_title_idx" ON "gmm_videos" ("title");
