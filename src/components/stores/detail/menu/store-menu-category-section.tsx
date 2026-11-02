"use client";

import * as React from "react";

interface StoreMenuCategorySectionProps {
  categoryName: string;
  shownCount: number;
  totalCount: number;
}

export function StoreMenuCategorySection({
  categoryName,
  shownCount,
  totalCount,
}: StoreMenuCategorySectionProps) {
  return (
    <div className="flex items-center gap-2 h-9 px-5 border-b border-border bg-surface/75 select-none">
      <span className="text-overline uppercase text-text font-serif tracking-[1.5px]">
        {categoryName}
      </span>
      <span className="text-caption text-text-muted">
        {shownCount} of {totalCount} shown
      </span>
    </div>
  );
}
