"use client";

import * as React from "react";
import { RecipeVersionDiffItem } from "@/types/recipes";
import { cn } from "@/lib/utils/cn";

interface VersionSideBySideTableProps {
  sizeTitle: string;
  subtitle: string;
  diffItems: RecipeVersionDiffItem[];
  v4CostPerServe: number;
  v5CostPerServe: number;
  deltaCostPerServe: number;
  v4Margin: number;
  v5Margin: number;
  deltaMarginPt: number;
  menuPrice: number;
}

/**
 * Version Side-by-Side Diff Table (Figma Frame 474:230376)
 * High-density ingredient formulation comparison between live deployment and candidate draft,
 * with warm highlighted diff rows, sweetness ladder rescaling, and serve-cost/margin deltas.
 */
export function VersionSideBySideTable({
  sizeTitle,
  subtitle,
  diffItems,
  v4CostPerServe,
  v5CostPerServe,
  deltaCostPerServe,
  v4Margin,
  v5Margin,
  deltaMarginPt,
  menuPrice,
}: VersionSideBySideTableProps) {
  const [showChangesOnly, setShowChangesOnly] = React.useState<boolean>(false);

  const displayedItems = showChangesOnly
    ? diffItems.filter((item) => item.isChanged)
    : diffItems;

  return (
    <div className="w-full rounded-[16px] border border-border bg-surface overflow-hidden flex flex-col shadow-2xs select-none">
      {/* 1. Header (Figma Frame 474:230377) */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-title text-text font-bold">{sizeTitle}</h2>
          <p className="text-caption text-text-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Toggle: Show changes only (Figma Frame 474:230380) */}
        <div
          onClick={() => setShowChangesOnly((prev) => !prev)}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <span className="text-label-semi text-text-secondary group-hover:text-text transition-colors">
            Show changes only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={showChangesOnly}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
              showChangesOnly ? "bg-primary" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "w-4 h-4 rounded-full bg-white transition-transform block absolute top-1",
                showChangesOnly ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* 2. Column Headers (Figma Frame 474:230384) */}
      <div className="h-9 px-5 bg-background-subtle border-b border-border flex items-center text-caption-bold text-text-secondary uppercase tracking-wider">
        <div className="flex-1 min-w-0">Ingredient</div>
        <div className="w-24 shrink-0 text-right">V4 Live</div>
        <div className="w-24 shrink-0 text-right">V5 Draft</div>
        <div className="w-24 shrink-0 text-right">Δ Cost</div>
      </div>

      {/* 3. Table Rows (Figma Frames 474:230389..474:230432) */}
      <div className="divide-y divide-border">
        {displayedItems.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className={cn(
                "px-5 py-3.5 flex items-center transition-colors",
                item.isChanged
                  ? "bg-[#FEF9EE] hover:bg-[#FDF3DE]"
                  : "bg-surface hover:bg-background-subtle/40"
              )}
            >
              {/* Ingredient Name */}
              <div className="flex-1 min-w-0 pr-3">
                <span
                  className={cn(
                    "text-body-s truncate block",
                    item.isChanged
                      ? "text-text font-bold"
                      : "text-text font-medium"
                  )}
                >
                  {item.name}
                </span>
              </div>

              {/* V4 Live Quantity */}
              <div className="w-24 shrink-0 text-right">
                <span
                  className={cn(
                    "text-body-s",
                    item.isChanged
                      ? "line-through text-text-muted"
                      : "text-text-secondary"
                  )}
                >
                  {item.v4LiveQty}
                </span>
              </div>

              {/* V5 Draft Quantity */}
              <div className="w-24 shrink-0 text-right">
                <span
                  className={cn(
                    "text-body-s",
                    item.isChanged
                      ? "text-text font-bold"
                      : "text-text-secondary"
                  )}
                >
                  {item.v5DraftQty}
                </span>
              </div>

              {/* Delta Cost */}
              <div className="w-24 shrink-0 text-right">
                <span
                  className={cn(
                    "text-price-xs font-display",
                    item.isChanged
                      ? "text-success font-bold"
                      : "text-text-muted"
                  )}
                >
                  {item.deltaCostFormatted}
                </span>
              </div>
            </div>

            {/* Sub-row: Sweetness ladder details if applicable */}
            {item.ladderDetails && (
              <div className="px-5 py-2.5 bg-[#FEF9EE]/70 border-t border-amber-200/40 flex items-center text-caption">
                <div className="flex-1 min-w-0 pr-3 text-text-secondary pl-2">
                  {item.ladderDetails.label}
                </div>
                <div className="w-24 shrink-0 text-right text-text-secondary">
                  {item.ladderDetails.v4Levels}
                </div>
                <div className="w-24 shrink-0 text-right text-text font-bold">
                  {item.ladderDetails.v5Levels}
                </div>
                <div className="w-24 shrink-0 text-right text-text-secondary">
                  {item.ladderDetails.note}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 4. Footer Row 1: Cost per serve (Figma Frame 474:230433) */}
      <div className="h-11 px-5 bg-background-subtle border-t border-border flex items-center">
        <div className="flex-1 text-label text-text font-bold">
          Cost per serve
        </div>
        <div className="w-24 shrink-0 text-right text-price-xs text-text font-display">
          ₹{v4CostPerServe.toFixed(2)}
        </div>
        <div className="w-24 shrink-0 text-right text-price-xs text-text font-display font-bold">
          ₹{v5CostPerServe.toFixed(2)}
        </div>
        <div className="w-24 shrink-0 text-right text-price-xs text-success font-display font-bold">
          {deltaCostPerServe < 0 ? `−₹${Math.abs(deltaCostPerServe).toFixed(2)}` : `+₹${deltaCostPerServe.toFixed(2)}`}
        </div>
      </div>

      {/* 5. Footer Row 2: Gross margin at price (Figma Frame 474:230438) */}
      <div className="h-11 px-5 bg-background-subtle border-t border-border flex items-center">
        <div className="flex-1 text-label text-text font-bold">
          Gross margin at ₹{menuPrice}
        </div>
        <div className="w-24 shrink-0 text-right text-label-semi text-text">
          {v4Margin.toFixed(1)}%
        </div>
        <div className="w-24 shrink-0 text-right text-label-semi text-text font-bold">
          {v5Margin.toFixed(1)}%
        </div>
        <div className="w-24 shrink-0 text-right text-label-semi text-success font-bold">
          +{deltaMarginPt.toFixed(1)} pt
        </div>
      </div>
    </div>
  );
}
