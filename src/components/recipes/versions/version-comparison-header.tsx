"use client";

import * as React from "react";
import Link from "next/link";
import { RecipeVersionComparison } from "@/types/recipes";

interface VersionComparisonHeaderProps {
  comparison: RecipeVersionComparison;
  onEditDraft?: () => void;
  onApprovePublish?: () => void;
}

/**
 * Version Control Header (Figma Frame 474:230347)
 * Breadcrumbs, Archivo Display title (32px), approval workflow badge,
 * and high-priority version lifecycle actions.
 */
export function VersionComparisonHeader({
  comparison,
  onEditDraft,
  onApprovePublish,
}: VersionComparisonHeaderProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
      {/* Left: Breadcrumbs + Title + Status Badges (Figma Frame 474:230348) */}
      <div className="flex flex-col gap-1">
        {/* Breadcrumb (Figma Frame 474:230349) */}
        <div className="flex items-center gap-1.5 text-body-s text-text-secondary">
          <Link href="/recipes" className="hover:text-text transition-colors">
            Recipes
          </Link>
          <span>/</span>
          <Link
            href={`/recipes/${comparison.recipeId}`}
            className="hover:text-text transition-colors"
          >
            {comparison.recipeName}
          </Link>
          <span>/</span>
          <span className="text-text font-medium">Versions</span>
        </div>

        {/* Title + Status Badge (Figma Frame 474:230350) */}
        <div className="flex flex-wrap items-center gap-3 mt-0.5">
          <h1 className="text-display-s text-text font-display">
            {comparison.comparisonTitle}
          </h1>

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-warning-surface text-warning text-caption-bold">
            {comparison.statusBadge}
          </span>
        </div>
      </div>

      {/* Right: Actions (Figma Frame 474:230354) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onEditDraft}
          className="h-9 px-4 rounded-[12px] border border-border-input bg-surface hover:bg-background-subtle text-text text-label inline-flex items-center justify-center transition-colors cursor-pointer select-none"
        >
          <span>Edit draft</span>
        </button>

        <button
          type="button"
          onClick={onApprovePublish}
          className="h-9 px-4 rounded-[12px] bg-primary hover:bg-primary-pressed text-text-inverse text-label font-bold inline-flex items-center justify-center transition-colors cursor-pointer select-none shadow-2xs"
        >
          <span>Approve & publish v5</span>
        </button>
      </div>
    </div>
  );
}
