"use client";

import * as React from "react";
import { RecipesApi } from "@/lib/api/recipes";

interface RecipesPageHeaderProps {
  onNewRecipeClick?: () => void;
}

/**
 * Recipes Page Header (Figma Frame 474:229633)
 * Exact 62px header using global semantic typography (.text-display-s, .text-body-s, .text-label)
 * and theme tokens (text-text, text-text-secondary, bg-primary, bg-surface, border-border-input).
 */
export function RecipesPageHeader({ onNewRecipeClick }: RecipesPageHeaderProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportCosting = async () => {
    try {
      setIsExporting(true);
      const { url, filename } = await RecipesApi.exportCosting();
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export costing CSV", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full h-[62px] flex items-end justify-between select-none">
      {/* 1. Left: Breadcrumb & Display Title (Figma 474:229634) */}
      <div className="flex flex-col gap-1">
        <span className="text-body-s text-text-secondary">
          Menu / Recipes
        </span>
        <h1 className="text-display-s text-text">
          Recipes
        </h1>
      </div>

      {/* 2. Right: Action Buttons (Figma 474:229637) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleExportCosting}
          disabled={isExporting}
          className="h-9 px-[17px] rounded-[12px] border border-border-input bg-surface text-label text-text hover:bg-background-subtle transition-colors flex items-center justify-center cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <span>{isExporting ? "Exporting..." : "Export costing"}</span>
        </button>

        <button
          type="button"
          onClick={onNewRecipeClick}
          className="h-9 px-4 rounded-[12px] bg-primary hover:bg-primary-pressed text-label text-text-inverse transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
        >
          <span>New recipe</span>
        </button>
      </div>
    </div>
  );
}
