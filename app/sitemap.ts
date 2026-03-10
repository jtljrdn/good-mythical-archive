import type { MetadataRoute } from "next";
import { getAllEpisodeNumbers } from "@/lib/queries/episodes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mythidex.dev";

  const episodeNumbers = await getAllEpisodeNumbers();

  const episodeEntries: MetadataRoute.Sitemap = episodeNumbers.map((ep) => ({
    url: `${baseUrl}/episode/${ep}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/api-key`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/docs`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...episodeEntries,
  ];
}
