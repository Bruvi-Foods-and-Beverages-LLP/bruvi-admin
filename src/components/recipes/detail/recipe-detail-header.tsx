"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, History } from "lucide-react";
import { RecipeDetailItem } from "@/types/recipes";

interface RecipeDetailHeaderProps {
  recipe: RecipeDetailItem;
  onOpenVersionHistory?: () => void;
  onCreateNewVersion?: () => void;
}

/**
 * Recipe Detail Header Component (Figma Frame 474:230010)
 * Breadcrumbs, Archivo Display title (32px), live & draft badges,
 * and version management action triggers.
 */
export function RecipeDetailHeader({
  recipe,
  onOpenVersionHistory,
  onCreateNewVersion,
}: RecipeDetailHeaderProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
      {/* Left: Breadcrumbs + Title + Status Badges */}
      <div className="flex flex-col gap-1">
        {/* Breadcrumb (Figma Frame 474:230012) */}
        <div className="flex items-center gap-1.5 text-body-s text-text-secondary">
          <Link
            href="/recipes"
            className="hover:text-text transition-colors"
          >
            Recipes
          </Link>
          <span>/</span>
          <span className="text-text font-medium">{recipe.name}</span>
        </div>

        {/* Title + Badges (Figma Frame 474:230013) */}
        <div className="flex flex-wrap items-center gap-3 mt-0.5">
          <h1 className="text-display-s text-text font-display">
            {recipe.name}
          </h1>

          {/* Live Status Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-success-surface text-success text-caption-bold">
            {recipe.statusLabel || `${recipe.version} · Live in ${recipe.liveStoresCount || 12} stores`}
          </span>

          {/* Draft Pending Badge */}
          {recipe.draftVersionLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-warning-surface text-warning text-caption-bold">
              {recipe.draftVersionLabel}
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions (Figma Frame 474:230019) */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/recipes/${recipe.id}/versions`}
          className="h-9 px-4 rounded-[12px] border border-border-input bg-surface hover:bg-background-subtle text-text text-label inline-flex items-center gap-2 transition-colors cursor-pointer select-none"
        >
          <History className="w-4 h-4 text-text-secondary" />
          <span>Version history</span>
        </Link>

        <button
          type="button"
          onClick={onCreateNewVersion}
          className="h-9 px-4 rounded-[12px] bg-primary hover:bg-primary-pressed text-text-inverse text-label inline-flex items-center gap-2 transition-colors cursor-pointer select-none shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create new version</span>
        </button>
      </div>
    </div>
  );
}
