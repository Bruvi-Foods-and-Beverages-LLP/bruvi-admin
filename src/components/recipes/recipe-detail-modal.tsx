"use client";

import * as React from "react";
import Image from "next/image";
import { X, FlaskConical, Clock, ChefHat } from "lucide-react";
import { RecipeItem } from "@/types/recipes";

interface RecipeDetailModalProps {
  recipe: RecipeItem | null;
  onClose: () => void;
}

/**
 * Recipe Detail & BOM Specification Modal
 * Displays complete Bill of Materials (BOM), gram/ml precision,
 * ingredient costs, packaging, and gross margin calculations.
 * Styled strictly with global typography (.text-heading-s, .text-price-m, .text-price-xs, .text-body-s, .text-overline)
 * and semantic theme tokens (bg-surface, bg-background-subtle, text-text, text-text-secondary, border-border).
 */
export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-[20px] bg-surface p-6 shadow-2xl flex flex-col gap-5 border border-border">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-surface-brand text-primary flex items-center justify-center shrink-0 border border-border overflow-hidden">
              {recipe.image ? (
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FlaskConical className="w-6 h-6 text-success" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-heading-s text-text">
                  {recipe.name}
                </h3>
                <span className="text-caption-bold px-2 py-0.5 rounded-pill bg-gray-100 text-text-brand">
                  {recipe.version}
                </span>
              </div>
              <span className="text-caption text-text-secondary">
                {recipe.sku} · {recipe.category} · {recipe.station} Station · Owner: {recipe.owner}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:bg-background-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Specs Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-[12px] bg-background-subtle border border-border flex flex-col">
            <span className="text-overline text-text-muted">
              Cost / Serve
            </span>
            <span className="text-price-m text-text mt-0.5">
              ₹{recipe.costPerServe.toFixed(2)}
            </span>
            <span className="text-caption text-text-secondary">BOM + Packaging</span>
          </div>

          <div className="p-3 rounded-[12px] bg-background-subtle border border-border flex flex-col">
            <span className="text-overline text-text-muted">
              Selling Price
            </span>
            <span className="text-price-m text-text mt-0.5">
              ₹{recipe.sellingPrice.toFixed(0)}
            </span>
            <span className="text-caption text-text-secondary">{recipe.sizes}</span>
          </div>

          <div className="p-3 rounded-[12px] bg-surface-brand border border-sky-300 flex flex-col">
            <span className="text-overline text-text-brand">
              Gross Margin
            </span>
            <span className="text-price-m text-success mt-0.5">
              {recipe.margin.toFixed(1)}%
            </span>
            <span className="text-caption text-text-brand">Target: {recipe.targetMargin.toFixed(0)}%</span>
          </div>
        </div>

        {/* Bill of Materials (BOM) Table */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-caption-bold text-text uppercase tracking-wider">
              Bill of Materials (BOM Formulation)
            </span>
            {recipe.prepTimeSeconds && (
              <span className="text-caption text-text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Prep: {recipe.prepTimeSeconds}s
              </span>
            )}
          </div>

          <div className="rounded-[12px] border border-border overflow-hidden">
            <div className="bg-background-subtle px-3 py-2 flex items-center justify-between text-caption-bold text-text-muted uppercase border-b border-border">
              <span className="w-1/2">Ingredient</span>
              <span className="w-1/4 text-center">Quantity</span>
              <span className="w-1/4 text-right">Cost</span>
            </div>

            <div className="divide-y divide-border max-h-52 overflow-y-auto">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="px-3 py-2 flex items-center justify-between text-body-s hover:bg-background-subtle"
                  >
                    <span className="w-1/2 font-medium text-text">
                      {ing.name}
                    </span>
                    <span className="w-1/4 text-center text-text-secondary">
                      {ing.quantity} {ing.unit}
                    </span>
                    <span className="w-1/4 text-right text-price-xs text-text">
                      ₹{(ing.costPaise / 100).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-body-s text-text-muted">
                  {recipe.ingredientsSummary || "Standard formulation configured."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barista Station Protocol */}
        {recipe.stationNotes && (
          <div className="p-3 rounded-[12px] bg-surface-warm border border-cream-300 flex items-start gap-2.5">
            <ChefHat className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-bold text-warning">
                Station Preparation Protocol ({recipe.station})
              </span>
              <span className="text-caption text-warning leading-relaxed">
                {recipe.stationNotes}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-caption text-text-secondary">
            Last updated {recipe.changed} by {recipe.owner}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-[12px] bg-primary hover:bg-primary-pressed text-label text-text-inverse transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
