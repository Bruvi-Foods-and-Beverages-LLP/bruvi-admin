"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StoreMenuCategory } from "@/types/store-menu";

interface StoreMenuFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: StoreMenuCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  unavailableCount: number;
  filterUnavailableOnly: boolean;
  onToggleFilterUnavailable: () => void;
}

export function StoreMenuFilterBar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  unavailableCount,
  filterUnavailableOnly,
  onToggleFilterUnavailable,
}: StoreMenuFilterBarProps) {
  const categoryChips: { id: string; label: string }[] = categories.map((c) => ({
    id: c.id,
    label: c.id === "all" ? `All · ${c.count}` : c.name,
  }));

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:px-5 py-4 border-b border-border bg-surface">
      {/* Left: Search input + Category pill chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search input (Figma: width 160, height 36, rounded-12) */}
        <div className="relative flex items-center w-full sm:w-[180px] h-9 rounded-[12px] bg-bg-subtle px-3 transition-colors focus-within:ring-2 focus-within:ring-sky-300">
          <Search className="h-4 w-4 text-text-muted shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search item or SKU"
            className="w-full bg-transparent text-body-s text-text placeholder:text-text-muted outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryChips.map((chip) => {
            const isActive = !filterUnavailableOnly && selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectCategory(chip.id)}
                className={cn(
                  "h-9 px-3.5 rounded-[18px] text-label transition-all cursor-pointer whitespace-nowrap select-none",
                  isActive
                    ? "bg-primary text-white shadow-2xs font-bold"
                    : "bg-surface border border-border text-text hover:bg-gray-50 font-normal"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Unavailable Filter Badge Pill */}
      {unavailableCount > 0 && (
        <button
          type="button"
          onClick={onToggleFilterUnavailable}
          className={cn(
            "h-9 px-3.5 rounded-[18px] text-caption-bold flex items-center gap-1.5 transition-all cursor-pointer select-none shrink-0",
            filterUnavailableOnly
              ? "bg-[#B45309] text-white shadow-xs"
              : "bg-warning-surface text-warning hover:bg-[#FCEFD8]"
          )}
        >
          <span className="h-2 w-2 rounded-full bg-warning shrink-0" />
          <span>{unavailableCount} unavailable</span>
        </button>
      )}
    </div>
  );
}
