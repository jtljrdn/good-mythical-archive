"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { FilterSidebar } from "@/components/filter-sidebar";
import { EpisodeGrid } from "@/components/episode-grid";
import type { Episode, PaginatedResponse } from "@/lib/types";

interface EpisodeBrowserProps {
  initialData: PaginatedResponse<Episode>;
  seasons: number[];
  categories: string[];
}

export function EpisodeBrowser({
  initialData,
  seasons,
  categories,
}: EpisodeBrowserProps) {
  const [episodes, setEpisodes] = useState<Episode[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isInitialMount = useRef(true);

  const fetchEpisodes = useCallback(
    async (
      params: {
        search: string;
        seasons: number[];
        categories: string[];
        sort: "asc" | "desc";
        page: number;
      },
      append: boolean
    ) => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.search) query.set("search", params.search);
        if (params.seasons.length > 0)
          query.set("seasons", params.seasons.join(","));
        if (params.categories.length > 0)
          query.set("categories", params.categories.join(","));
        query.set("sort", params.sort);
        query.set("page", String(params.page));
        query.set("limit", "24");

        const res = await fetch(`/api/episodes?${query.toString()}`);
        if (!res.ok) {
          console.error("Failed to fetch episodes:", res.status, res.statusText);
          return;
        }
        const data: PaginatedResponse<Episode> = await res.json();

        if (append) {
          setEpisodes((prev) => [...prev, ...data.data]);
        } else {
          setEpisodes(data.data);
        }
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Re-fetch when filters/sort change (not on first mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchEpisodes(
        {
          search: searchQuery,
          seasons: selectedSeasons,
          categories: selectedCategories,
          sort: sortOrder,
          page: 1,
        },
        false
      );
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedSeasons, selectedCategories, sortOrder, fetchEpisodes]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || page >= totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEpisodes(
      {
        search: searchQuery,
        seasons: selectedSeasons,
        categories: selectedCategories,
        sort: sortOrder,
        page: nextPage,
      },
      true
    );
  }, [
    isLoading,
    page,
    totalPages,
    searchQuery,
    selectedSeasons,
    selectedCategories,
    sortOrder,
    fetchEpisodes,
  ]);

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
    <>
      <Navbar totalEpisodes={initialData.total} filteredCount={total} />
      <div className="flex flex-1 pt-14">
        <FilterSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedSeasons={selectedSeasons}
          onSeasonToggle={handleSeasonToggle}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          seasons={seasons}
          categories={categories}
        />
        <main className="flex-1 overflow-auto p-6">
          <EpisodeGrid
            episodes={episodes}
            totalCount={total}
            isLoading={isLoading}
            hasMore={page < totalPages}
            onLoadMore={handleLoadMore}
          />
        </main>
      </div>
    </>
  );
}
