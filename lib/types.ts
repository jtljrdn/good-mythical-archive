export interface Episode {
  episode: number;
  gmmEpisodeNumber: number | null;
  numberInSeason: string | null;
  title: string | null;
  description: string | null;
  length: string | null;
  gmmoreTitle: string | null;
  releaseDate: string | null;
  guests: string | null;
  videoUrl: string | null;
  gmmoreUrl: string | null;
  gmmoreLength: string | null;
  season: number | null;
  category: string | null;
  viewCount: number | null;
  thumbnailUrl: string | null;
}

export interface EpisodeSearchParams {
  search?: string;
  fuzzy?: boolean;
  seasons?: number[];
  categories?: string[];
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
