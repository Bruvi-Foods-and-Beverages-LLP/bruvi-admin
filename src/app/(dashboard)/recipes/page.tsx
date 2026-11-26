"use client";

import * as React from "react";
import { RecipesPageHeader } from "@/components/recipes/recipes-page-header";
import { RecipesFilterBar } from "@/components/recipes/recipes-filter-bar";
import { RecipesTable } from "@/components/recipes/recipes-table";
import { CreateRecipeModal } from "@/components/recipes/create-recipe-modal";

/**
 * Recipes & BOM Management Page (Figma 474:229593)
 * Exact 1136px grid, 24px vertical rhythm, token adherence,
 * dynamic search, filtering, and cost/margin tracking.
 */
export default function RecipesPage() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      {/* 1. Header (Figma 474:229633) */}
      <RecipesPageHeader onNewRecipeClick={() => setIsCreateOpen(true)} />

      {/* 2. Standalone Filter Bar (Figma 474:229642) */}
      <RecipesFilterBar />

      {/* 3. High-Density Recipe Table Card (Figma 474:229672) */}
      <RecipesTable />

      {/* 4. Create Recipe Master Modal */}
      <CreateRecipeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
