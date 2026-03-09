"use client";

import { Search, ChevronDown } from "lucide-react";
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
import { CATEGORIES, SEASONS } from "@/lib/mock-data";

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedSeasons: number[];
  onSeasonToggle: (season: number) => void;
}

export function FilterSidebar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedSeasons,
  onSeasonToggle,
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

          {/* Categories */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Categories
              <ChevronDown className="size-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-1">
              {CATEGORIES.map((category) => (
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

          {/* Seasons */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Seasons
              <ChevronDown className="size-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1">
              <div className="grid grid-cols-4 gap-1.5">
                {SEASONS.map((season) => {
                  const isActive = selectedSeasons.includes(season);
                  return (
                    <Button
                      key={season}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => onSeasonToggle(season)}
                    >
                      S{season}
                    </Button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </aside>
  );
}
