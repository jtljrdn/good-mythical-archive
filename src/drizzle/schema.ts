import { pgTable, pgPolicy, bigint, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const gmmVideos = pgTable("gmm_videos", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	episode: bigint({ mode: "number" }).primaryKey().notNull(),
	numberInSeason: text("number_in_season"),
	title: text(),
	length: text(),
	gmmoreTitle: text("gmmore_title"),
	releaseDate: text("release_date"),
	guests: text(),
	videoUrl: text("video_url"),
	gmmoreUrl: text("gmmore_url"),
	gmmoreLength: text("gmmore_length"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	season: bigint({ mode: "number" }),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);
