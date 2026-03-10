import "server-only";

import { sql, ilike, inArray, asc, desc, count, SQL } from "drizzle-orm";
import { publicClient } from "@/src/clients/drizzle-client";
import { gmmVideos } from "@/src/db/schema";
import { getYoutubeThumbnailUrl } from "@/lib/youtube";
import type { Episode, EpisodeSearchParams, PaginatedResponse } from "@/lib/types";

function mapRowToEpisode(row: typeof gmmVideos.$inferSelect): Episode {
  return {
    episode: row.episode,
    gmmEpisodeNumber: row.gmmEpisodeNumber,
    numberInSeason: row.numberInSeason,
    title: row.title,
    description: row.description,
    length: row.length,
    gmmoreTitle: row.gmmoreTitle,
    releaseDate: row.releaseDate,
    guests: row.guests,
    videoUrl: row.videoUrl,
    gmmoreUrl: row.gmmoreUrl,
    gmmoreLength: row.gmmoreLength,
    season: row.season,
    category: row.category,
    viewCount: row.viewCount,
    thumbnailUrl: getYoutubeThumbnailUrl(row.videoUrl),
  };
}

export async function searchEpisodes(
  params: EpisodeSearchParams
): Promise<PaginatedResponse<Episode>> {
  const {
    search,
    seasons,
    categories,
    sortOrder = "desc",
    page = 1,
    limit = 24,
  } = params;

  const conditions: SQL[] = [];

  if (search) {
    // Escape SQL ILIKE wildcards to prevent pattern-based data extraction
    const escapedSearch = search.replace(/%/g, '\\%').replace(/_/g, '\\_');
    conditions.push(ilike(gmmVideos.title, `%${escapedSearch}%`));
  }
  if (seasons && seasons.length > 0) {
    conditions.push(inArray(gmmVideos.season, seasons));
  }
  if (categories && categories.length > 0) {
    conditions.push(inArray(gmmVideos.category, categories));
  }

  const where = conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined;
  const orderBy = sortOrder === "asc" ? asc(gmmVideos.episode) : desc(gmmVideos.episode);
  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    publicClient
      .select()
      .from(gmmVideos)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    publicClient
      .select({ count: count() })
      .from(gmmVideos)
      .where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    data: rows.map(mapRowToEpisode),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / Math.max(1, limit)),
  };
}

export async function getDistinctSeasons(): Promise<number[]> {
  const rows = await publicClient
    .selectDistinct({ season: gmmVideos.season })
    .from(gmmVideos)
    .where(sql`${gmmVideos.season} IS NOT NULL`)
    .orderBy(desc(gmmVideos.season));

  return rows.map((r) => r.season).filter((s): s is number => s !== null);
}

export async function getDistinctCategories(): Promise<string[]> {
  const rows = await publicClient
    .selectDistinct({ category: gmmVideos.category })
    .from(gmmVideos)
    .where(sql`${gmmVideos.category} IS NOT NULL`)
    .orderBy(asc(gmmVideos.category));

  return rows.map((r) => r.category).filter((c): c is string => c !== null);
}

export async function getTotalEpisodeCount(): Promise<number> {
  const result = await publicClient
    .select({ count: count() })
    .from(gmmVideos);

  return result[0]?.count ?? 0;
}
