"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { StoreMenuCategory } from "@/types/store-menu";

interface StoreMenuCategorySectionProps {
  categoryName: string;
  shownCount: number;
  totalCount: number;
  /** Store-level settings for this category; omitted for categories without one (read-only header). */
  category?: StoreMenuCategory;
  onToggleVisible?: (visible: boolean) => void;
  onEditHours?: () => void;
  disabled?: boolean;
}

export function StoreMenuCategorySection({
  categoryName,
  shownCount,
  totalCount,
  category,
  onToggleVisible,
  onEditHours,
  disabled = false,
}: StoreMenuCategorySectionProps) {
  return (
    <div className="flex items-center gap-2 h-9 px-5 border-b border-border bg-surface/75 select-none">
      <span className="text-overline uppercase text-text font-serif tracking-[1.5px]">
        {categoryName}
      </span>
      <span className="text-caption text-text-muted">
        {shownCount} of {totalCount} shown
      </span>

      {category && (
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onEditHours}
            disabled={disabled}
            title="Set when this category is available"
            className={cn(
              "text-caption cursor-pointer hover:underline disabled:opacity-50",
              !category.isVisible
                ? "text-text-muted"
                : category.liveNow
                  ? "text-[#1f7a4d]"
                  : "text-[#9a5b00]"
            )}
          >
            {category.statusLabel} · {category.windowLabel}
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={category.isVisible}
            aria-label={`Show ${categoryName} at this store`}
            disabled={disabled}
            onClick={() => onToggleVisible?.(!category.isVisible)}
            className={cn(
              "w-8 h-5 rounded-full relative p-0.5 transition-colors cursor-pointer disabled:opacity-50",
              category.isVisible ? "bg-[#1c3a66]" : "bg-[#bcc6d3]"
            )}
          >
            <span
              className={cn(
                "block w-4 h-4 rounded-full bg-white shadow-xs transition-transform",
                category.isVisible ? "translate-x-3" : "translate-x-0"
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
}
