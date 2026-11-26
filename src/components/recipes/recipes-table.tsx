"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage, fetchRecipes, setSelectedRecipeId } from "@/store/slices/recipes-slice";
import { RecipeItem } from "@/types/recipes";
import { cn } from "@/lib/utils/cn";
import { RecipeDetailModal } from "./recipe-detail-modal";

function RecipeThumbnail({ src, alt }: { src: string | null; alt: string }) {
  const [hasError, setHasError] = React.useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-surface-brand text-primary flex items-center justify-center">
        <FlaskConical className="w-5 h-5 stroke-[2]" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  );
}

/**
 * Recipes High-Density Table (Figma Frame 474:229672)
 * Pixel-perfect 1136px table container with 8 exact columns, 56px rows,
 * warm amber tint for pending draft rows, Archivo tabular prices, and supplier cost footer.
 * Fully compliant with global semantic typography (.text-caption-bold, .text-label, .text-price-xs, .text-body-s)
 * and semantic theme tokens (bg-surface, bg-background-subtle, bg-surface-warm, text-text, text-text-secondary, text-warning).
 */
export function RecipesTable() {
  const dispatch = useAppDispatch();
  const { recipes, total, page, limit, totalPages, metrics, isLoading } =
    useAppSelector((state) => state.recipes);

  const router = useRouter();
  const [activeModalRecipe, setActiveModalRecipe] = React.useState<RecipeItem | null>(null);

  React.useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  const handleRowClick = (recipe: RecipeItem) => {
    dispatch(setSelectedRecipeId(recipe.id));
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <>
      <div className="w-full rounded-[16px] border border-border bg-surface shadow-2xs overflow-hidden flex flex-col select-none">
        {/* Scroll wrapper for responsive viewports */}
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[1094px] w-full flex flex-col">
            {/* 1. Table Header (Figma Frame 474:229673 - h: 36px, bg: #f5f7fa, px-5, gap: 16px) */}
            <div className="h-9 w-full flex items-center px-5 gap-4 bg-background-subtle border-b border-border select-none text-caption-bold text-text-secondary uppercase tracking-wider">
              <div className="w-[254px] shrink-0 text-left">Recipe</div>
              <div className="w-[80px] shrink-0 text-left">Version</div>
              <div className="w-[120px] shrink-0 text-left">Sizes</div>
              <div className="w-[96px] shrink-0 text-right">Cost/serve</div>
              <div className="w-[80px] shrink-0 text-right">Margin</div>
              <div className="w-[96px] shrink-0 text-left">Changed</div>
              <div className="w-[96px] shrink-0 text-left">Owner</div>
              <div className="w-[160px] shrink-0 text-left">Status</div>
            </div>

            {/* 2. Table Rows (Figma Frames 474:229682..474:229802 - 56px each) */}
            <div className="divide-y divide-border">
              {recipes.map((r) => {
                const isUnderTarget = r.margin < r.targetMargin;

                return (
                  <div
                    key={r.id}
                    onClick={() => handleRowClick(r)}
                    className={cn(
                      "h-14 w-full flex items-center px-5 gap-4 transition-colors cursor-pointer group",
                      r.isDraftPending
                        ? "bg-surface-warm hover:brightness-98"
                        : "bg-surface hover:bg-background-subtle"
                    )}
                  >
                    {/* Col 0: Recipe (Figma Frame 474:229683 - w: 254px) */}
                    <div className="w-[254px] shrink-0 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] border border-border overflow-hidden shrink-0 flex items-center justify-center bg-background-subtle">
                        <RecipeThumbnail src={r.image} alt={r.name} />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="text-label text-text truncate">
                          {r.name}
                        </span>
                        <span className="text-caption text-text-muted truncate">
                          {r.sku} · {r.category} · {r.station}
                        </span>
                      </div>
                    </div>

                    {/* Col 1: Version (Figma Frame 474:229688 - w: 80px) */}
                    <div
                      className={cn(
                        "w-[80px] shrink-0 text-label",
                        r.status === "DRAFT_TESTING"
                          ? "text-text-secondary"
                          : "text-text"
                      )}
                    >
                      {r.version}
                    </div>

                    {/* Col 2: Sizes (Figma Frame 474:229689 - w: 120px) */}
                    <div className="w-[120px] shrink-0 text-body-s text-text-secondary">
                      {r.sizes}
                    </div>

                    {/* Col 3: Cost/serve (Figma Frame 474:229690 - w: 96px, align right, text-price-xs) */}
                    <div className="w-[96px] shrink-0 text-right text-price-xs text-text">
                      ₹{r.costPerServe.toFixed(2)}
                    </div>

                    {/* Col 4: Margin (Figma Frame 474:229691 - w: 80px, align right, text-label-semi) */}
                    <div
                      className={cn(
                        "w-[80px] shrink-0 text-right text-label-semi",
                        isUnderTarget ? "text-warning" : "text-text"
                      )}
                    >
                      {r.margin.toFixed(1)}%
                    </div>

                    {/* Col 5: Changed (Figma Frame 474:229692 - w: 96px, text-body-s) */}
                    <div className="w-[96px] shrink-0 text-body-s text-text-secondary">
                      {r.changed}
                    </div>

                    {/* Col 6: Owner (Figma Frame 474:229693 - w: 96px, text-body-s) */}
                    <div className="w-[96px] shrink-0 text-body-s text-text">
                      {r.owner}
                    </div>

                    {/* Col 7: Status (Figma Frame 474:229694 - w: 160px) */}
                    <div className="w-[160px] shrink-0 flex items-center">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-caption-bold",
                          r.status === "LIVE" && "bg-success-surface text-success",
                          r.status === "DRAFT_PENDING" && "bg-warning-surface text-warning",
                          r.status === "DRAFT_TESTING" && "bg-info-surface text-info"
                        )}
                      >
                        {r.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Empty state if no results */}
              {recipes.length === 0 && !isLoading && (
                <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-background-subtle border border-border flex items-center justify-center text-text-muted mb-3">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <h3 className="text-heading-s text-text">
                    No recipes match your filter
                  </h3>
                  <p className="text-body-s text-text-muted mt-1 max-w-sm">
                    Try adjusting your search query, status tab, or dropdown selections.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Table Footer (Figma Frame 474:229821 - h: 48px, px-5) */}
            <div className="h-12 w-full flex items-center justify-between px-5 border-t border-border select-none text-caption text-text-secondary">
              <div>
                {total > 0
                  ? `${startRecord}–${endRecord} of ${total} recipes · costs from current supplier prices, updated ${metrics.updatedAt}`
                  : `0 recipes · updated ${metrics.updatedAt}`}
              </div>

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => {
                    const prevPage = Math.max(1, page - 1);
                    dispatch(setPage(prevPage));
                    dispatch(fetchRecipes({ page: prevPage }));
                  }}
                  className={cn(
                    "text-caption-bold transition-colors cursor-pointer",
                    page <= 1 || isLoading
                      ? "text-text-muted/50 cursor-not-allowed"
                      : "text-text hover:text-primary"
                  )}
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => {
                    const nextPage = Math.min(totalPages, page + 1);
                    dispatch(setPage(nextPage));
                    dispatch(fetchRecipes({ page: nextPage }));
                  }}
                  className={cn(
                    "text-caption-bold transition-colors cursor-pointer",
                    page >= totalPages || isLoading
                      ? "text-text-muted/50 cursor-not-allowed"
                      : "text-text hover:text-primary"
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Detail / BOM Modal */}
      {activeModalRecipe && (
        <RecipeDetailModal
          recipe={activeModalRecipe}
          onClose={() => setActiveModalRecipe(null)}
        />
      )}
    </>
  );
}
