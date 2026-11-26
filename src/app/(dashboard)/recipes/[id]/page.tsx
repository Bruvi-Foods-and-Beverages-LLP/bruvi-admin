"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipesApi } from "@/lib/api/recipes";
import { RecipeDetailItem } from "@/types/recipes";
import { RecipeDetailHeader } from "@/components/recipes/detail/recipe-detail-header";
import { RecipeSizeTabs } from "@/components/recipes/detail/recipe-size-tabs";
import { RecipeIngredientsTable } from "@/components/recipes/detail/recipe-ingredients-table";
import { RecipeMethodCard } from "@/components/recipes/detail/recipe-method-card";
import { RecipeMediaPreviewCard } from "@/components/recipes/detail/recipe-media-preview-card";
import { RecipeMarginCard } from "@/components/recipes/detail/recipe-margin-card";
import { RecipeAllergensCard } from "@/components/recipes/detail/recipe-allergens-card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Enterprise Recipe Detail & BOM Page (Figma Frame 474:229970)
 * 100% token conformance with master ERP specification:
 * - 1136px grid width, 24px vertical rhythm
 * - Archivo Display headers and tabular price figures
 * - Interactive size formulation switching (Regular, Large, Jumbo)
 * - Bill-of-Materials milligram/milliliter scaling & unit costs
 * - SOP preparation steps & target make times
 * - Gross margin analytics & target threshold benchmarking
 */
export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = (params?.id as string) || "rec_salted_cream_cold_brew";

  const [recipe, setRecipe] = React.useState<RecipeDetailItem | null>(null);
  const [activeSizeCode, setActiveSizeCode] = React.useState<string>("large");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [notification, setNotification] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    RecipesApi.getRecipeById(recipeId)
      .then((data) => {
        if (isMounted && data) {
          setRecipe(data);
          setActiveSizeCode(data.activeSize || "large");
        }
      })
      .catch((err) => {
        console.error("Failed to load recipe detail:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1136px] mx-auto min-h-[400px] flex flex-col items-center justify-center gap-3 select-none">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-body-s text-text-secondary">
          Loading recipe formulation & BOM...
        </span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="w-full max-w-[1136px] mx-auto min-h-[400px] flex flex-col items-center justify-center gap-4 text-center select-none">
        <h2 className="text-heading-s text-text">Recipe not found</h2>
        <p className="text-body-s text-text-secondary max-w-md">
          The requested recipe could not be located in the Master ERP registry.
        </p>
        <Link
          href="/recipes"
          className="h-9 px-4 rounded-[12px] bg-primary text-text-inverse text-label inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to recipes</span>
        </Link>
      </div>
    );
  }

  // Active formulation based on selected size
  const activeFormulation =
    recipe.sizesFormulations.find((s) => s.code === activeSizeCode) ||
    recipe.sizesFormulations[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12 select-none">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-primary text-white text-caption-bold px-4 py-2.5 rounded-[12px] shadow-lg animate-in fade-in slide-in-from-top-2">
          {notification}
        </div>
      )}

      {/* 1. Header (Figma Frame 474:230010) */}
      <RecipeDetailHeader
        recipe={recipe}
        onOpenVersionHistory={() =>
          showNotification("Opening version history log for " + recipe.name)
        }
        onCreateNewVersion={() =>
          showNotification("Initiating draft v" + (parseInt(recipe.version.replace(/\D/g, "") || "4", 10) + 1) + " checkout")
        }
      />

      {/* 2. Size Switcher Tabs (Figma Frame 474:230028) */}
      <RecipeSizeTabs
        sizes={recipe.sizesFormulations}
        activeSizeCode={activeSizeCode}
        onSelectSize={(code) => setActiveSizeCode(code)}
      />

      {/* 3. Two-Column Split Layout (Figma Frame 474:230033) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: BOM Ingredients Table & Preparation Method (Figma Frame 474:230034 - 720px / 12 cols span 7-8) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {/* Card 1: Ingredients BOM Specification (Figma Frame 474:230035) */}
          <RecipeIngredientsTable
            formulation={activeFormulation}
            onEditInDraft={() =>
              showNotification("Switched to editing mode in v5 draft")
            }
          />

          {/* Card 2: Method Preparation Steps (Figma Frame 474:230092) */}
          <RecipeMethodCard
            stepsCount={recipe.method.stepsCount}
            targetMakeTime={recipe.method.targetMakeTime}
            steps={recipe.method.steps}
          />
        </div>

        {/* Right Column: Media, Gross Margin & Metadata (Figma Frame 474:230113 - 400px / 12 cols span 5-4) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          {/* Card 1: Media Preview & SOP Training (Figma Frame 474:230114) */}
          <RecipeMediaPreviewCard
            imageUrl={recipe.mediaPreview.imageUrl}
            videoDuration={recipe.mediaPreview.videoDuration}
            photosCount={recipe.mediaPreview.photosCount}
            onPlayVideo={() =>
              showNotification("Opening SOP Barista Training Video (0:42)")
            }
            onViewPhotos={() =>
              showNotification("Viewing 3 official plating photos")
            }
          />

          {/* Card 2: Gross Margin Hero Card (Figma Frame 474:230124) */}
          <RecipeMarginCard
            formulation={activeFormulation}
            targetMargin={recipe.targetMargin || 75.0}
            regularComparisonText={recipe.regularComparisonText}
          />

          {/* Card 3: Allergens & Station Metadata (Figma Frame 474:230142) */}
          <RecipeAllergensCard
            allergens={recipe.allergensList}
            stationDetail={recipe.stationDetail}
            ownerDetail={recipe.ownerDetail}
            liveSinceText={recipe.liveSinceText}
          />
        </div>
      </div>
    </div>
  );
}
