import { EpisodeCard } from "@/components/episode-card";
import type { Episode } from "@/lib/mock-data";

interface EpisodeGridProps {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Latest Episodes</h1>
        <p className="text-sm text-muted-foreground">
          {episodes.length} episode{episodes.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {episodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No episodes found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </div>
  );
}
