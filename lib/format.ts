/** Format a season number for display. GMS mini-seasons (stored as year >= 2000) show as "GMS2024" etc. */
export function formatSeason(season: number): string {
  if (season >= 2000) return `GMS${season}`;
  return `S${season}`;
}

export function formatViewCount(count: number | null): string {
  if (count == null) return "";
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}
