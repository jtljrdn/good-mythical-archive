import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEpisodeByNumber } from "@/lib/queries/episodes";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const episode = await getEpisodeByNumber(Number(id));
  if (!episode) return {};

  const title = episode.title ?? `Episode ${episode.episode}`;
  const description =
    episode.description ??
    `Good Mythical Morning Episode ${episode.episode}${episode.season ? ` — Season ${episode.season}` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Mythidex`,
      description,
      type: "video.episode",
      url: `https://mythidex.dev/episode/${episode.episode}`,
      ...(episode.thumbnailUrl && {
        images: [{ url: episode.thumbnailUrl, width: 480, height: 360 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Mythidex`,
      description,
      ...(episode.thumbnailUrl && { images: [episode.thumbnailUrl] }),
    },
    alternates: {
      canonical: `https://mythidex.dev/episode/${episode.episode}`,
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { id } = await params;
  const episode = await getEpisodeByNumber(Number(id));
  if (!episode) notFound();

  // JSON-LD structured data for Google rich results.
  // Data is from our own database and JSON.stringify safely escapes all values.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: episode.title,
    description: episode.description,
    ...(episode.thumbnailUrl && { thumbnailUrl: episode.thumbnailUrl }),
    ...(episode.videoUrl && { url: episode.videoUrl }),
    ...(episode.releaseDate && { uploadDate: episode.releaseDate }),
    ...(episode.length && { duration: episode.length }),
    ...(episode.viewCount && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WatchAction" },
        userInteractionCount: episode.viewCount,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>EpisodePage {id}</div>
    </>
  );
}
