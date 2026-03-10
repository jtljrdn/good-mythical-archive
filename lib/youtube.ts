const VIDEO_ID_RE =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;

/**
 * Extract a YouTube video ID from a URL.
 */
export function extractVideoId(videoUrl: string | null): string | null {
  if (!videoUrl) return null;
  const match = videoUrl.match(VIDEO_ID_RE);
  return match?.[1] ?? null;
}

/**
 * Extract a YouTube video ID from a URL and construct a thumbnail URL.
 */
export function getYoutubeThumbnailUrl(videoUrl: string | null): string | null {
  const id = extractVideoId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
