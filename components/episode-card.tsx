import { Eye, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Episode } from "@/lib/mock-data";
import { formatViewCount } from "@/lib/mock-data";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const formattedDate = new Date(episode.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/30">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 left-2">{episode.category}</Badge>
        <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
          {episode.duration}
        </span>
      </div>

      {/* Body */}
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">
          S{episode.season} E{episode.episodeNumber} &middot; {formattedDate}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">
          {episode.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {episode.description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center gap-3 px-3 pb-3 pt-0 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {formatViewCount(episode.viewCount)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {episode.duration}
        </span>
      </CardFooter>
    </Card>
  );
}
