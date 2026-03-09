import { pgTable, pgPolicy, bigint, text, boolean, timestamp, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ── App tables ──────────────────────────────────────────────

export const gmmVideos = pgTable("gmm_videos", {
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
	season: bigint({ mode: "number" }),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

// ── Better Auth tables ──────────────────────────────────────

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
	role: text(),
	banned: boolean(),
	banReason: text("banReason"),
	banExpires: timestamp("banExpires"),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	impersonatedBy: text("impersonatedBy"),
}, (table) => [
	index("session_userId_idx").on(table.userId),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text(),
	password: text(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
}, (table) => [
	index("account_userId_idx").on(table.userId),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").on(table.identifier),
]);

export const apikey = pgTable("apikey", {
	id: text().primaryKey().notNull(),
	configId: text("configId").notNull(),
	name: text(),
	start: text(),
	referenceId: text("referenceId").notNull(),
	prefix: text(),
	key: text().notNull(),
	refillInterval: integer("refillInterval"),
	refillAmount: integer("refillAmount"),
	lastRefillAt: timestamp("lastRefillAt"),
	enabled: boolean(),
	rateLimitEnabled: boolean("rateLimitEnabled"),
	rateLimitTimeWindow: integer("rateLimitTimeWindow"),
	rateLimitMax: integer("rateLimitMax"),
	requestCount: integer("requestCount"),
	remaining: integer(),
	lastRequest: timestamp("lastRequest"),
	expiresAt: timestamp("expiresAt"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	permissions: text(),
	metadata: text(),
}, (table) => [
	index("apikey_configId_idx").on(table.configId),
	index("apikey_referenceId_idx").on(table.referenceId),
	index("apikey_key_idx").on(table.key),
]);
