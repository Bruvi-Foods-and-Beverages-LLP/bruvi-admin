"use client";

import * as React from "react";
import { RecipeAllergen } from "@/types/recipes";

interface RecipeAllergensCardProps {
  allergens: RecipeAllergen[];
  stationDetail: string;
  ownerDetail: string;
  liveSinceText: string;
}

/**
 * Allergens & Station Metadata Card (Figma Frame 474:230142)
 * Allergen alerts, food safety classifications, KDS station assignment,
 * R&D beverage owner, and live store deployment timeline.
 */
export function RecipeAllergensCard({
  allergens,
  stationDetail,
  ownerDetail,
  liveSinceText,
}: RecipeAllergensCardProps) {
  return (
    <div className="w-full rounded-[16px] border border-border bg-surface p-5 flex flex-col divide-y divide-border shadow-2xs select-none">
      {/* 1. Allergens Section (Figma Frame 474:230143) */}
      <div className="pb-4 flex flex-col gap-2">
        <span className="text-caption-bold text-text-secondary uppercase tracking-wider">
          Allergens
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {allergens.map((item) => {
            if (item.type === "warning") {
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-warning-surface text-warning text-caption-bold"
                >
                  {item.label}
                </span>
              );
            }

            if (item.type === "veg") {
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-background-subtle text-text-secondary border border-border text-caption-bold"
                >
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  <span>{item.label}</span>
                </span>
              );
            }

            return (
              <span
                key={item.label}
                className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-background-subtle text-text-secondary border border-border text-caption-bold"
              >
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 2. Station Assignment (Figma Frame 474:230154) */}
      <div className="py-3.5 flex items-center justify-between">
        <span className="text-caption text-text-secondary">Station</span>
        <span className="text-label text-text font-bold">{stationDetail}</span>
      </div>

      {/* 3. Owner (Figma Frame 474:230158) */}
      <div className="py-3.5 flex items-center justify-between">
        <span className="text-caption text-text-secondary">Owner</span>
        <span className="text-label text-text font-bold">{ownerDetail}</span>
      </div>

      {/* 4. Deployment Lifecycle (Figma Frame 474:230162) */}
      <div className="pt-3.5 flex items-center justify-between">
        <span className="text-caption text-text-secondary">v4 live since</span>
        <span className="text-label text-text font-bold">{liveSinceText}</span>
      </div>
    </div>
  );
}
