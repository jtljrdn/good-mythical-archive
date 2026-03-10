"use client";

import { Eye, Users } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Episode } from "@/lib/types";
import { formatSeason, formatViewCount } from "@/lib/format";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const formattedDate = episode.releaseDate
    ? new Date(episode.releaseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={episode.videoUrl ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/30">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {episode.thumbnailUrl ? (
            <Image
              src={episode.thumbnailUrl}
              alt={episode.title ?? "Episode thumbnail"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No thumbnail
            </div>
          )}
          {episode.category && (
            <Badge className="absolute top-2 left-2">{episode.category}</Badge>
          )}
          {episode.length && (
            <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
              {episode.length}
            </span>
          )}
        </div>

        {/* Body */}
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">
            {episode.season != null && formatSeason(episode.season)}
            {episode.numberInSeason && `${episode.season != null ? " " : ""}E${episode.numberInSeason}`}
            {formattedDate && (
              <>
                {(episode.season != null || episode.numberInSeason) && " \u00b7 "}
                {formattedDate}
              </>
            )}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
            {episode.title ?? "Untitled Episode"}
          </h3>
          {episode.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {episode.description}
            </p>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center gap-3 px-3 pb-3 pt-3 text-xs text-muted-foreground">
          {episode.viewCount != null && (
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatViewCount(episode.viewCount)}
            </span>
          )}
          {episode.guests && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              <span className="truncate max-w-[120px]">{episode.guests}</span>
            </span>
          )}
        </CardFooter>
      </Card>
    </a>
  );
}
