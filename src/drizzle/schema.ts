import { pgTable, index, foreignKey, unique, text, timestamp, integer, boolean, uniqueIndex, pgPolicy, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
	impersonatedBy: text(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_fkey"
		}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_fkey"
		}).onDelete("cascade"),
]);

export const apikey = pgTable("apikey", {
	id: text().primaryKey().notNull(),
	configId: text().notNull(),
	name: text(),
	start: text(),
	referenceId: text().notNull(),
	prefix: text(),
	key: text().notNull(),
	refillInterval: integer(),
	refillAmount: integer(),
	lastRefillAt: timestamp({ withTimezone: true, mode: 'string' }),
	enabled: boolean(),
	rateLimitEnabled: boolean(),
	rateLimitTimeWindow: integer(),
	rateLimitMax: integer(),
	requestCount: integer(),
	remaining: integer(),
	lastRequest: timestamp({ withTimezone: true, mode: 'string' }),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	permissions: text(),
	metadata: text(),
}, (table) => [
	index("apikey_configId_idx").using("btree", table.configId.asc().nullsLast().op("text_ops")),
	index("apikey_key_idx").using("btree", table.key.asc().nullsLast().op("text_ops")),
	index("apikey_referenceId_idx").using("btree", table.referenceId.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	role: text(),
	banned: boolean(),
	banReason: text(),
	banExpires: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("user_email_key").on(table.email),
]);

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
	publishDate: timestamp("publish_date", { withTimezone: true, mode: 'string' }),
	category: text(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	viewCount: bigint("view_count", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gmmEpisodeNumber: bigint("gmm_episode_number", { mode: "number" }),
}, (table) => [
	index("gmm_videos_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("gmm_videos_gmm_episode_number_idx").using("btree", table.gmmEpisodeNumber.asc().nullsLast().op("int8_ops")),
	index("gmm_videos_season_idx").using("btree", table.season.asc().nullsLast().op("int8_ops")),
	index("gmm_videos_title_idx").using("btree", table.title.asc().nullsLast().op("text_ops")),
	uniqueIndex("gmm_videos_video_url_idx").using("btree", table.videoUrl.asc().nullsLast().op("text_ops")),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);
