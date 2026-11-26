"use client";

import * as React from "react";
import { RecipeSizeFormulation } from "@/types/recipes";

interface RecipeMarginCardProps {
  formulation: RecipeSizeFormulation;
  targetMargin?: number;
  regularComparisonText?: string;
}

/**
 * Gross Margin Analytics Hero Card (Figma Frame 474:230124)
 * High-impact dark navy container presenting live margin performance,
 * yield calculations, menu price, and target threshold benchmarking.
 */
export function RecipeMarginCard({
  formulation,
  targetMargin = 75.0,
  regularComparisonText,
}: RecipeMarginCardProps) {
  const isAboveTarget = formulation.marginPercentage >= targetMargin;

  return (
    <div className="w-full rounded-[16px] bg-primary text-text-inverse p-5 flex flex-col gap-4 shadow-sm select-none">
      {/* Top Header Row (Figma Frame 474:230125) */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-sky-100 font-medium">
          Gross margin
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-pill bg-[#7FD3A2]/20 text-[#7FD3A2] text-caption-bold">
          {isAboveTarget ? `Above ${targetMargin}% target` : `Below target`}
        </span>
      </div>

      {/* Hero Margin Percentage (Figma Frame 474:230128) */}
      <div className="text-display-m font-display text-white tracking-tight -mt-1">
        {formulation.marginPercentage.toFixed(1)}%
      </div>

      {/* 3 Metric Columns (Figma Frames 474:230130..474:230138) */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
        {/* Cost / serve */}
        <div className="flex flex-col">
          <span className="text-caption text-sky-200">Cost / serve</span>
          <span className="text-price-s text-white font-display mt-0.5">
            ₹{formulation.costPerServe.toFixed(2)}
          </span>
        </div>

        {/* Menu price · Size */}
        <div className="flex flex-col">
          <span className="text-caption text-sky-200 truncate">
            Menu price · {formulation.shortLabel}
          </span>
          <span className="text-price-s text-white font-display mt-0.5">
            ₹{formulation.menuPrice}
          </span>
        </div>

        {/* Yield */}
        <div className="flex flex-col">
          <span className="text-caption text-sky-200">Yield</span>
          <span className="text-label text-white font-bold mt-0.5 truncate">
            {formulation.yield}
          </span>
        </div>
      </div>

      {/* Comparison Note (Figma Frame 474:230140) */}
      {regularComparisonText && (
        <div className="text-caption text-sky-200/90 pt-1 border-t border-white/10 leading-relaxed">
          {regularComparisonText}
        </div>
      )}
    </div>
  );
}
