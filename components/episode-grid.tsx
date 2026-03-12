"use client";

import { SearchX } from "lucide-react";
import { EpisodeCard } from "@/components/episode-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Episode } from "@/lib/types";
import { useRef, useEffect } from "react";

interface EpisodeGridProps {
  episodes: Episode[];
  totalCount: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

function EpisodeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex gap-3 px-3 pb-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

export function EpisodeGrid({
  episodes,
  totalCount,
  isLoading,
  hasMore,
  onLoadMore,
}: EpisodeGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Latest Episodes</h1>
        <p className="text-sm text-muted-foreground">
          {totalCount} episode{totalCount !== 1 ? "s" : ""} found
        </p>
      </div>

      {episodes.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-card-enter">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="size-7 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">
            No episodes found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode, index) => (
            <div
              key={episode.episode}
              className="animate-card-enter"
              style={{ "--stagger": `${Math.min(index % 24, 8) * 50}ms` } as React.CSSProperties}
            >
              <EpisodeCard episode={episode} priority={index < 6} />
            </div>
          ))}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-card-enter"
                style={{ "--stagger": `${i * 75}ms` } as React.CSSProperties}
              >
                <EpisodeCardSkeleton />
              </div>
            ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}
