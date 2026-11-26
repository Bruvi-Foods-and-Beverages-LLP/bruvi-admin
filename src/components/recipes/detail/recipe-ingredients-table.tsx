"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecipeSizeFormulation } from "@/types/recipes";

interface RecipeIngredientsTableProps {
  formulation: RecipeSizeFormulation;
  onEditInDraft?: () => void;
}

/**
 * Ingredients BOM Specification Table (Figma Frame 474:230035)
 * Detailed Bill-of-Materials table with exact scaling dependencies,
 * milligram/milliliter accuracy, per-ingredient packaging cost,
 * and cost-per-serve sum matching master ERP calculations.
 */
export function RecipeIngredientsTable({
  formulation,
  onEditInDraft,
}: RecipeIngredientsTableProps) {
  const calculatedCost = formulation.ingredients.reduce(
    (acc, ing) => acc + ing.costPaise / 100,
    0
  );

  return (
    <div className="w-full rounded-[16px] border border-border bg-surface overflow-hidden flex flex-col shadow-2xs">
      {/* 1. Header (Figma Frame 474:230036) */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border">
        <div className="flex flex-col gap-1">
          <h2 className="text-title text-text font-bold">
            Ingredients · {formulation.shortLabel}
          </h2>
          <p className="text-caption text-text-secondary leading-relaxed">
            {formulation.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditInDraft}
          className="text-label text-primary hover:text-navy-900 inline-flex items-center gap-1 shrink-0 font-bold transition-colors cursor-pointer group"
        >
          <span>Edit in v5 draft</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* 2. Table Header Row (Figma Frame 474:230043) */}
      <div className="h-9 px-5 bg-background-subtle border-b border-border flex items-center text-caption-bold text-text-secondary uppercase tracking-wider select-none">
        <div className="flex-1 min-w-0">Ingredient</div>
        <div className="w-44 shrink-0 hidden sm:block">Scales with</div>
        <div className="w-16 shrink-0 text-right">Qty</div>
        <div className="w-12 shrink-0 text-center">Unit</div>
        <div className="w-20 shrink-0 text-right">Cost</div>
      </div>

      {/* 3. Table Rows (Figma Frames 474:230049..474:230085) */}
      <div className="divide-y divide-border">
        {formulation.ingredients.map((ing) => {
          const costRupees = (ing.costPaise / 100).toFixed(2);

          return (
            <div
              key={ing.id}
              className="px-5 py-3.5 flex items-center hover:bg-background-subtle/50 transition-colors"
            >
              {/* Ingredient Name */}
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-body-s text-text font-medium truncate block">
                  {ing.name}
                </span>
                <span className="text-caption text-text-muted block sm:hidden">
                  {ing.scalesWith || "Standard"}
                </span>
              </div>

              {/* Scales With */}
              <div className="w-44 shrink-0 text-body-s text-text-secondary hidden sm:block truncate pr-2">
                {ing.scalesWith || "Fixed"}
              </div>

              {/* Quantity */}
              <div className="w-16 shrink-0 text-right text-body-s text-text font-medium">
                {ing.quantity}
              </div>

              {/* Unit */}
              <div className="w-12 shrink-0 text-center text-body-s text-text-secondary">
                {ing.unit}
              </div>

              {/* Cost in Rupees */}
              <div className="w-20 shrink-0 text-right text-price-xs text-text font-display">
                ₹{costRupees}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Footer Total Row (Figma Frame 474:230086) */}
      <div className="h-11 px-5 bg-background-subtle border-t border-border flex items-center justify-between select-none">
        <span className="text-label text-text font-bold">Cost per serve</span>
        <span className="text-price-xs text-text font-display font-bold">
          ₹{calculatedCost.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
