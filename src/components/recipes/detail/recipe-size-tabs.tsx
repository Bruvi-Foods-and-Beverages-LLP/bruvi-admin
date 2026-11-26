"use client";

import * as React from "react";
import { RecipeSizeFormulation } from "@/types/recipes";
import { cn } from "@/lib/utils/cn";

interface RecipeSizeTabsProps {
  sizes: RecipeSizeFormulation[];
  activeSizeCode: string;
  onSelectSize: (code: string) => void;
}

/**
 * Size Switcher Tabs Component (Figma Frame 474:230028)
 * Standardized 36px high segmented line tabs switching dynamically
 * between Regular, Large, and Jumbo BOM formulations.
 */
export function RecipeSizeTabs({
  sizes,
  activeSizeCode,
  onSelectSize,
}: RecipeSizeTabsProps) {
  return (
    <div className="w-full border-b border-border flex items-end gap-6 h-9 select-none">
      {sizes.map((s) => {
        const isActive = s.code === activeSizeCode;

        return (
          <button
            key={s.code}
            type="button"
            onClick={() => onSelectSize(s.code)}
            className={cn(
              "h-9 px-1 inline-flex items-center text-label transition-all cursor-pointer relative",
              isActive
                ? "text-text border-b-2 border-primary font-bold"
                : "text-text-secondary hover:text-text font-medium"
            )}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
