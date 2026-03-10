#!/usr/bin/env bun

/**
 * Good Mythical Archive — Daily Sync Script
 *
 * Fetches new GMM videos from YouTube, assigns episode numbers, seasons,
 * and number-in-season, pairs with GMMORE, and inserts into the database.
 * Optionally updates view counts and metadata for existing episodes.
 *
 * Usage:
 *   bun run scripts/sync.ts [options]
 *
 * Options:
 *   --dry-run              Show what would be done without writing to DB
 *   --update-existing      Also update descriptions, lengths, and view counts for existing videos
 *   --max-playlist-items N Max playlist items to fetch per channel (default: 200)
 *   --min-duration N       Minimum video duration in seconds to include (default: 300)
 *
 * Requires YOUTUBE_API_KEY and DATABASE_URL in .env.local
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql, desc, asc, count } from "drizzle-orm";
import { gmmVideos } from "../src/db/schema";
import { extractVideoId } from "../lib/youtube";
import { formatSeason } from "../lib/format";

config({ path: ".env.local" });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!YOUTUBE_API_KEY) {
  console.error(
    "Missing YOUTUBE_API_KEY in .env.local\n\n" +
      "Get a YouTube Data API v3 key from https://console.cloud.google.com/apis/credentials\n" +
      'Then add to .env.local: YOUTUBE_API_KEY="your_key_here"'
  );
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in .env.local");
  process.exit(1);
}

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const UPDATE_EXISTING = args.includes("--update-existing");

function parseIntArg(flag: string, defaultVal: number, min: number): number {
  const idx = args.indexOf(flag);
  if (idx === -1) return defaultVal;
  const val = parseInt(args[idx + 1]);
  if (!Number.isFinite(val) || val < min) {
    console.error(`Invalid ${flag} value: "${args[idx + 1]}". Must be >= ${min}.`);
    process.exit(1);
  }
  return val;
}

const MAX_PLAYLIST_ITEMS = parseIntArg("--max-playlist-items", 200, 50);
const MIN_DURATION_SECONDS = parseIntArg("--min-duration", 300, 0);

// ─── DB ──────────────────────────────────────────────────────────────────────

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle({ client, casing: "snake_case" });

// ─── YouTube API ─────────────────────────────────────────────────────────────

const CHANNELS = {
  gmm: { handle: "goodmythicalmorning", id: "UC4PooiX37Pld1T8J5SYT-SQ" },
  gmmore: { handle: "goodmythicalmore", id: "UCzJkMfMkS0IERk6Z0beJE3A" },
} as const;

const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
let quotaUsed = 0;

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`${YT_API_BASE}/${endpoint}`);
  url.searchParams.set("key", YOUTUBE_API_KEY!);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  for (let attempt = 0; attempt <= 3; attempt++) {
    const res = await fetch(url.toString());
    quotaUsed++;

    if (res.ok) return res.json();

    if ((res.status === 429 || res.status === 503) && attempt < 3) {
      const delay = 1000 * Math.pow(2, attempt);
      console.warn(`  YouTube API ${res.status}, retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    const body = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${body}`);
  }
  throw new Error("Exhausted retries");
}

const ISO_DURATION_RE = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

function parseIsoDurationParts(iso: string) {
  if (iso === "P0D") return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const match = iso.match(ISO_DURATION_RE);
  if (!match) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: parseInt(match[1] || "0"),
    hours: parseInt(match[2] || "0"),
    minutes: parseInt(match[3] || "0"),
    seconds: parseInt(match[4] || "0"),
  };
}

function parseIsoDuration(iso: string): string {
  const { days, hours: h, minutes, seconds } = parseIsoDurationParts(iso);
  const hours = h + days * 24;
  if (hours > 0)
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isoDurationToSeconds(iso: string): number {
  const { days, hours, minutes, seconds } = parseIsoDurationParts(iso);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

// ─── YouTube API response types ──────────────────────────────────────────────

interface YouTubePlaylistItem {
  contentDetails?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    publishedAt?: string;
  };
}

interface YouTubeVideoItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
}

interface YouTubeListResponse {
  items?: YouTubeVideoItem[] | YouTubePlaylistItem[];
  nextPageToken?: string;
  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };
}

interface VideoDetail {
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  durationSeconds: number;
  viewCount: number;
}

async function getChannelUploadsPlaylist(channel: { handle: string; id: string }): Promise<string> {
  try {
    const data = await ytFetch("channels", { part: "contentDetails", forHandle: channel.handle });
    if (data.items?.length) return data.items[0].contentDetails.relatedPlaylists.uploads;
  } catch {
    console.warn(`  Handle "@${channel.handle}" failed, falling back to channel ID...`);
  }
  const data = await ytFetch("channels", { part: "contentDetails", id: channel.id });
  if (!data.items?.length) throw new Error(`Channel not found: @${channel.handle} / ${channel.id}`);
  return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getVideoDetails(videoIds: string[]): Promise<Map<string, VideoDetail>> {
  const results = new Map<string, VideoDetail>();
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const data: YouTubeListResponse = await ytFetch("videos", {
      part: "snippet,contentDetails,statistics",
      id: batch.join(","),
    });
    for (const item of (data.items as YouTubeVideoItem[] | undefined) || []) {
      const id = item.id;
      const title = item.snippet?.title;
      const description = item.snippet?.description;
      const publishedAt = item.snippet?.publishedAt;
      const duration = item.contentDetails?.duration;
      if (!id || !title || description == null || !publishedAt || !duration) {
        console.warn(`  Skipping video with missing fields: ${id ?? "unknown"}`);
        continue;
      }
      results.set(id, {
        title,
        description,
        publishedAt,
        duration,
        durationSeconds: isoDurationToSeconds(duration),
        viewCount: parseInt(item.statistics?.viewCount || "0"),
      });
    }
  }
  return results;
}

async function getPlaylistItems(playlistId: string, maxItems: number): Promise<YouTubePlaylistItem[]> {
  const items: YouTubePlaylistItem[] = [];
  let pageToken: string | undefined;
  while (items.length < maxItems) {
    const params: Record<string, string> = { part: "snippet,contentDetails", playlistId, maxResults: "50" };
    if (pageToken) params.pageToken = pageToken;
    const data: YouTubeListResponse = await ytFetch("playlistItems", params);
    items.push(...((data.items as YouTubePlaylistItem[] | undefined) || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
    console.log(`  Fetched ${items.length} playlist items...`);
  }
  return items.slice(0, maxItems);
}

// ─── Episode Classification ──────────────────────────────────────────────────

const NON_EPISODE_PATTERNS = [
  /marathon/i,
  /throwback/i,
  /\(compilation\)/i,
  /\bLIVE[!.]?\b/i,
  /top 5\b.*\bmoments\b/i,
];

/** Check if a video is a regular GMM episode (not a marathon, throwback, etc.) */
function isOfficialEpisode(title: string, releaseDate: string): boolean {
  if (NON_EPISODE_PATTERNS.some((p) => p.test(title))) return false;
  const day = new Date(releaseDate).getUTCDay();
  return day !== 0 && day !== 6; // weekdays only
}

/**
 * Extract official GMM episode number from YouTube description.
 * Returns null if not found or if the number is suspiciously wrong.
 */
function extractGmmNumber(description: string, nextGmmEpisodeNumber: number): number | null {
  const match = description?.match(/GMM\s*#\s*(\d+)/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  // Sanity check: compare against the expected GMM episode number (not the sequential index)
  // to catch typos like "GMM # 23740" instead of "GMM # 2740"
  if (Math.abs(num - nextGmmEpisodeNumber) > 500) return null;
  return num;
}

// ─── Season Detection ────────────────────────────────────────────────────────

const MIN_GAP_DAYS = 10;

/**
 * Determine what season starts at a given date based on the month.
 * From 2018+: Jan/Feb = main odd season, Jun/Jul = GMS year, Aug/Sep = main even season.
 */
function detectNewSeason(
  dateStr: string,
  prevMainSeason: number
): { season: number; isGms: boolean } {
  const d = new Date(dateStr);
  const month = d.getUTCMonth(); // 0-indexed
  if (month <= 1) {
    return { season: prevMainSeason + 1, isGms: false }; // Jan-Feb
  } else if (month >= 5 && month <= 6) {
    return { season: d.getUTCFullYear(), isGms: true }; // Jun-Jul GMS
  } else {
    return { season: prevMainSeason + 1, isGms: false }; // Aug-Sep+
  }
}

// ─── Update Existing Videos ──────────────────────────────────────────────────

async function updateExistingVideos() {
  console.log("\n--- Updating existing videos with latest YouTube data ---\n");

  const allVideos = await db
    .select({ episode: gmmVideos.episode, videoUrl: gmmVideos.videoUrl, gmmoreUrl: gmmVideos.gmmoreUrl })
    .from(gmmVideos);

  // GMM videos
  const gmmToUpdate: { episode: number; videoId: string }[] = [];
  const videoIdToEpisode = new Map<string, number>();
  for (const v of allVideos) {
    const vid = extractVideoId(v.videoUrl);
    if (vid) {
      gmmToUpdate.push({ episode: v.episode, videoId: vid });
      videoIdToEpisode.set(vid, v.episode);
    }
  }

  console.log(`Fetching details for ${gmmToUpdate.length} GMM videos...`);
  const gmmDetails = await getVideoDetails(gmmToUpdate.map((v) => v.videoId));

  if (!DRY_RUN) {
    const updateData: { episode: number; description: string; length: string; viewCount: number }[] = [];
    for (const [videoId, detail] of gmmDetails) {
      const episode = videoIdToEpisode.get(videoId);
      if (!episode) continue;
      updateData.push({
        episode,
        description: detail.description,
        length: parseIsoDuration(detail.duration),
        viewCount: detail.viewCount,
      });
    }

    for (let i = 0; i < updateData.length; i += 100) {
      const batch = updateData.slice(i, i + 100);
      const values = batch.map(
        (u) => sql`(${u.episode}::bigint, ${u.description}::text, ${u.length}::text, ${u.viewCount}::bigint)`
      );
      await db.execute(sql`
        UPDATE gmm_videos SET
          description = v.description, length = v.length, view_count = v.view_count
        FROM (VALUES ${sql.join(values, sql`, `)}) AS v(episode, description, length, view_count)
        WHERE gmm_videos.episode = v.episode
      `);
    }
    console.log(`Updated ${updateData.length} GMM videos`);
  } else {
    console.log(`[DRY RUN] Would update ${gmmDetails.size} GMM videos`);
  }

  // GMMORE lengths
  const gmmoreToUpdate: { episode: number; videoId: string }[] = [];
  const moreVideoIdToEpisode = new Map<string, number>();
  for (const v of allVideos) {
    if (v.gmmoreUrl) {
      const vid = extractVideoId(v.gmmoreUrl);
      if (vid) {
        gmmoreToUpdate.push({ episode: v.episode, videoId: vid });
        moreVideoIdToEpisode.set(vid, v.episode);
      }
    }
  }

  if (gmmoreToUpdate.length > 0) {
    console.log(`Fetching details for ${gmmoreToUpdate.length} GMMORE videos...`);
    const moreDetails = await getVideoDetails(gmmoreToUpdate.map((v) => v.videoId));

    if (!DRY_RUN) {
      const moreUpdateData: { episode: number; gmmoreLength: string }[] = [];
      for (const [videoId, detail] of moreDetails) {
        const episode = moreVideoIdToEpisode.get(videoId);
        if (!episode) continue;
        moreUpdateData.push({ episode, gmmoreLength: parseIsoDuration(detail.duration) });
      }

      for (let i = 0; i < moreUpdateData.length; i += 100) {
        const batch = moreUpdateData.slice(i, i + 100);
        const values = batch.map((u) => sql`(${u.episode}::bigint, ${u.gmmoreLength}::text)`);
        await db.execute(sql`
          UPDATE gmm_videos SET gmmore_length = v.gmmore_length
          FROM (VALUES ${sql.join(values, sql`, `)}) AS v(episode, gmmore_length)
          WHERE gmm_videos.episode = v.episode
        `);
      }
      console.log(`Updated ${moreUpdateData.length} GMMORE lengths`);
    } else {
      console.log(`[DRY RUN] Would update ${moreDetails.size} GMMORE lengths`);
    }
  }
}

// ─── Fetch & Insert New Videos ───────────────────────────────────────────────

async function fetchNewVideos() {
  console.log("\n--- Fetching new videos ---\n");

  // Collect existing video IDs (read outside transaction -- used only for YouTube API filtering)
  const existingVideos = await db.select({ videoUrl: gmmVideos.videoUrl }).from(gmmVideos);
  const existingVideoIds = new Set(existingVideos.map((v) => extractVideoId(v.videoUrl)).filter(Boolean));

  // Fetch GMM uploads
  console.log(`\nFetching recent GMM uploads (max ${MAX_PLAYLIST_ITEMS})...`);
  const gmmPlaylistId = await getChannelUploadsPlaylist(CHANNELS.gmm);
  const gmmPlaylistItems = await getPlaylistItems(gmmPlaylistId, MAX_PLAYLIST_ITEMS);
  console.log(`  Retrieved ${gmmPlaylistItems.length} playlist items`);

  // Filter to new videos only
  const newVideoIds: string[] = [];
  for (const item of gmmPlaylistItems) {
    const videoId = item.contentDetails?.videoId;
    if (videoId && !existingVideoIds.has(videoId)) newVideoIds.push(videoId);
  }

  console.log(`  ${newVideoIds.length} new (not in database)`);
  if (newVideoIds.length === 0) {
    console.log("\nDatabase is already up to date!");
    return;
  }

  // Get full details
  console.log("\nFetching details for new videos...");
  const newDetails = await getVideoDetails(newVideoIds);

  // Filter by duration
  let filtered = [...newDetails.entries()].filter(
    ([_, d]) => d.durationSeconds >= MIN_DURATION_SECONDS
  );
  const skippedShorts = newDetails.size - filtered.length;
  if (skippedShorts > 0) console.log(`  Filtered out ${skippedShorts} videos < ${MIN_DURATION_SECONDS}s`);

  // Fetch GMMORE for same-day pairing
  console.log("\nFetching GMMORE uploads for same-day pairing...");
  const gmmorePlaylistId = await getChannelUploadsPlaylist(CHANNELS.gmmore);
  const gmmorePlaylistItems = await getPlaylistItems(gmmorePlaylistId, MAX_PLAYLIST_ITEMS);
  const gmmoreVideoIds = gmmorePlaylistItems
    .map((item) => item.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));
  const gmmoreDetails = await getVideoDetails(gmmoreVideoIds);

  // Sort GMMORE videos by publish time so earliest per date wins
  const gmmoreByDate = new Map<string, { videoId: string; title: string; duration: string }>();
  const sortedGmmore = [...gmmoreDetails.entries()].sort(
    (a, b) => new Date(a[1].publishedAt).getTime() - new Date(b[1].publishedAt).getTime()
  );
  for (const [videoId, detail] of sortedGmmore) {
    if (detail.durationSeconds < MIN_DURATION_SECONDS) continue;
    const dateStr = detail.publishedAt.split("T")[0];
    if (!gmmoreByDate.has(dateStr)) {
      gmmoreByDate.set(dateStr, { videoId, title: detail.title, duration: parseIsoDuration(detail.duration) });
    }
  }
  console.log(`  Built GMMORE date lookup with ${gmmoreByDate.size} unique dates`);

  // The read-compute-insert cycle runs inside a single transaction to prevent
  // race conditions when two sync runs execute concurrently.
  let inserted = 0;
  let paired = 0;

  const doInsert = async (
    tx: Pick<typeof db, "execute" | "insert" | "select" | "update" | "delete">
  ) => {
    // Acquire row-level locks on the rows we read via FOR UPDATE (issue #3/#6)
    const [latestEpisode] = await tx.execute(sql`
      SELECT episode, video_url, publish_date, release_date, season
      FROM gmm_videos ORDER BY episode DESC LIMIT 1 FOR UPDATE
    `);

    const [latestRealEp] = await tx.execute(sql`
      SELECT gmm_episode_number, season, release_date, number_in_season
      FROM gmm_videos WHERE gmm_episode_number IS NOT NULL
      ORDER BY gmm_episode_number DESC LIMIT 1 FOR UPDATE
    `);

    const [highestMainResult] = await tx.execute(sql`
      SELECT max(season) AS s FROM gmm_videos WHERE season IS NOT NULL AND season < 100
    `);
    let prevMainSeason = Number((highestMainResult as any)?.s ?? 26);

    const currentSeason = Number((latestRealEp as any)?.season ?? prevMainSeason);
    const [seasonCountResult] = await tx.execute(sql`
      SELECT count(*) AS cnt FROM gmm_videos
      WHERE season = ${currentSeason} AND gmm_episode_number IS NOT NULL
    `);
    let numberInSeason = Number((seasonCountResult as any)?.cnt ?? 0);

    // Date cutoff to avoid picking up old videos
    let latestDateCutoff: Date | null = null;
    if ((latestEpisode as any)?.publish_date) {
      latestDateCutoff = new Date((latestEpisode as any).publish_date);
    } else if ((latestEpisode as any)?.release_date) {
      latestDateCutoff = new Date((latestEpisode as any).release_date);
    }

    let prevRealDate: Date | null = (latestRealEp as any)?.release_date
      ? new Date((latestRealEp as any).release_date)
      : null;

    console.log(`Latest episode in DB: #${(latestEpisode as any)?.episode ?? "N/A"}`);
    console.log(`Latest real episode: GMM #${(latestRealEp as any)?.gmm_episode_number ?? "N/A"} (season ${currentSeason})`);
    console.log(`Current season ep count: ${numberInSeason}`);
    console.log(`Highest main season: ${prevMainSeason}`);
    console.log(`Date cutoff: ${latestDateCutoff?.toISOString().split("T")[0] ?? "N/A"}`);

    // Filter out videos published before latest episode
    if (latestDateCutoff) {
      const before = filtered.length;
      filtered = filtered.filter(([_, d]) => new Date(d.publishedAt) > latestDateCutoff);
      const skippedOld = before - filtered.length;
      if (skippedOld > 0) console.log(`  Filtered out ${skippedOld} videos before date cutoff`);
    }

    console.log(`  ${filtered.length} new episodes to add`);
    if (filtered.length === 0) {
      console.log("\nNo new full-length episodes to add.");
      return;
    }

    // Sort oldest first for sequential numbering
    const sorted = filtered.sort(
      (a, b) => new Date(a[1].publishedAt).getTime() - new Date(b[1].publishedAt).getTime()
    );

    let nextEpisode = (Number((latestEpisode as any)?.episode) || 0) + 1;
    let nextGmmEpisodeNumber = (Number((latestRealEp as any)?.gmm_episode_number) || 0) + 1;
    let activeSeason = currentSeason;

    console.log(`\nInserting ${sorted.length} new episodes starting at index #${nextEpisode}...\n`);

    for (const [videoId, detail] of sorted) {
      if (existingVideoIds.has(videoId)) continue;

      const dateStr = detail.publishedAt.split("T")[0];
      const gmmore = gmmoreByDate.get(dateStr);
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const gmmoreUrl = gmmore ? `https://www.youtube.com/watch?v=${gmmore.videoId}` : null;

      // Determine official episode number
      const descNum = extractGmmNumber(detail.description, nextGmmEpisodeNumber);
      const isOfficial = isOfficialEpisode(detail.title, dateStr);
      let gmmEpisodeNumber: number | null = null;

      if (descNum != null) {
        gmmEpisodeNumber = descNum;
        nextGmmEpisodeNumber = descNum + 1;
      } else if (isOfficial) {
        gmmEpisodeNumber = nextGmmEpisodeNumber;
        nextGmmEpisodeNumber++;
      }

      // Season detection: check for gap indicating new season
      if (gmmEpisodeNumber != null && prevRealDate) {
        const currDate = new Date(dateStr);
        const gapDays = Math.round((currDate.getTime() - prevRealDate.getTime()) / 86400000);

        if (gapDays >= MIN_GAP_DAYS) {
          const detected = detectNewSeason(dateStr, prevMainSeason);
          activeSeason = detected.season;
          if (!detected.isGms) prevMainSeason = detected.season;
          numberInSeason = 0; // reset for new season
          const label = detected.isGms ? `GMS ${detected.season}` : `Season ${detected.season}`;
          console.log(`  ** New season detected: ${label} (${gapDays}d gap) **`);
        }
      }

      // number_in_season for real episodes
      let epNumberInSeason: string | null = null;
      if (gmmEpisodeNumber != null) {
        numberInSeason++;
        epNumberInSeason = String(numberInSeason);
        prevRealDate = new Date(dateStr);
      }

      if (gmmore) paired++;

      const epLabel = gmmEpisodeNumber != null ? `GMM#${gmmEpisodeNumber}` : "(non-episode)";
      const seasonLabel = formatSeason(activeSeason);
      const moreLabel = gmmore ? `+ MORE` : "";

      if (!DRY_RUN) {
        await tx.insert(gmmVideos).values({
          episode: nextEpisode,
          title: detail.title,
          description: detail.description,
          length: parseIsoDuration(detail.duration),
          publishDate: detail.publishedAt,
          releaseDate: dateStr,
          videoUrl,
          viewCount: detail.viewCount,
          season: activeSeason,
          gmmoreTitle: gmmore?.title ?? null,
          gmmoreUrl,
          gmmoreLength: gmmore?.duration ?? null,
          gmmEpisodeNumber,
          numberInSeason: epNumberInSeason,
        }).onConflictDoNothing({ target: gmmVideos.videoUrl });
      }

      existingVideoIds.add(videoId);
      console.log(
        `  [${inserted + 1}/${sorted.length}] #${nextEpisode} ${epLabel} ${seasonLabel}${epNumberInSeason ? ` E${epNumberInSeason}` : ""} ${moreLabel} | ${detail.title.slice(0, 50)}`
      );

      nextEpisode++;
      inserted++;
    }
  };

  if (!DRY_RUN) {
    await db.transaction(async (tx) => doInsert(tx));
  } else {
    await doInsert(db);
  }

  console.log(
    `\nInserted ${inserted} new episodes (${paired} paired with GMMORE)`
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Good Mythical Archive — Sync ===");
  console.log(`  ${new Date().toISOString()}`);
  if (DRY_RUN) console.log("  DRY RUN MODE");

  try {
    if (UPDATE_EXISTING) {
      await updateExistingVideos();
    }

    await fetchNewVideos();

    console.log(`\nDone! YouTube API HTTP requests made: ${quotaUsed}`);
  } catch (err) {
    console.error("\nError:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
