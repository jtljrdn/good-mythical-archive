import { EpisodeBrowser } from "@/components/episode-browser";
import {
  searchEpisodes,
  getDistinctSeasons,
  getDistinctCategories,
} from "@/lib/queries/episodes";

export default async function Page() {
  const [initialData, seasons, categories] = await Promise.all([
    searchEpisodes({ page: 1, limit: 24, sortOrder: "desc" }),
    getDistinctSeasons(),
    getDistinctCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <EpisodeBrowser
        initialData={initialData}
        seasons={seasons}
        categories={categories}
      />
    </div>
  );
}
