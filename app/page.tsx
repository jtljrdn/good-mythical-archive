"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { FilterSidebar } from "@/components/filter-sidebar";
import { EpisodeGrid } from "@/components/episode-grid";
import { MOCK_EPISODES } from "@/lib/mock-data";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);

  const filteredEpisodes = useMemo(() => {
    return MOCK_EPISODES.filter((ep) => {
      const query = searchQuery.toLowerCase();
      if (
        query &&
        !ep.title.toLowerCase().includes(query) &&
        !ep.description.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(ep.category)
      ) {
        return false;
      }
      if (selectedSeasons.length > 0 && !selectedSeasons.includes(ep.season)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategories, selectedSeasons]);

  function handleCategoryChange(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function handleSeasonToggle(season: number) {
    setSelectedSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season]
    );
  }

  return (
    <div className="flex min-h-screen flex-col">

      <div className="flex flex-1">
        <FilterSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedSeasons={selectedSeasons}
          onSeasonToggle={handleSeasonToggle}
        />
        <main className="flex-1 overflow-auto p-6">
          <EpisodeGrid episodes={filteredEpisodes} />
        </main>
      </div>
    </div>
  );
}
