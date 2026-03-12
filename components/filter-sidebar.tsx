"use client";

import { memo, useState } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatSeason } from "@/lib/format";

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedSeasons: number[];
  onSeasonToggle: (season: number) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  seasons: number[];
  categories: string[];
}

function SortButton({
  sortOrder,
  onSortOrderChange,
}: {
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}) {
  const [spinCount, setSpinCount] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Sort by date</span>
      <Button
        variant="outline"
        size="sm"
        className="h-8 min-w-[6rem] gap-1 text-xs"
        onClick={() => {
          setSpinCount((c) => c + 1);
          onSortOrderChange(sortOrder === "desc" ? "asc" : "desc");
        }}
      >
        <ArrowUpDown
          className="size-3.5 transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${spinCount * 360}deg)` }}
        />
        {sortOrder === "desc" ? "Newest" : "Oldest"}
      </Button>
    </div>
  );
}

export const FilterSidebar = memo(function FilterSidebar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedSeasons,
  onSeasonToggle,
  sortOrder,
  onSortOrderChange,
  seasons,
  categories,
}: FilterSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card lg:flex lg:flex-col">
      <div className="border-b p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Filter Episodes
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Search */}
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>

          {/* Sort Order */}
          <SortButton sortOrder={sortOrder} onSortOrderChange={onSortOrderChange} />

          {/* Categories */}
          {categories.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                Categories
                <ChevronDown className="size-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-1">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => onCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Seasons */}
          {seasons.length > 0 && (
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                Seasons
                <ChevronDown className="size-4 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-1">
                <div className="grid grid-cols-4 gap-1.5">
                  {seasons.map((season) => {
                    const isActive = selectedSeasons.includes(season);
                    const isGms = season >= 2000;
                    return (
                      <Button
                        key={season}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`h-8 text-xs${isGms ? " col-span-2" : ""}`}
                        onClick={() => onSeasonToggle(season)}
                      >
                        {formatSeason(season)}
                      </Button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
});
