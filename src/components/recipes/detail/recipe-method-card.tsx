"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { RecipeStep } from "@/types/recipes";

interface RecipeMethodCardProps {
  stepsCount: number;
  targetMakeTime: string;
  steps: RecipeStep[];
}

/**
 * Recipe Preparation Method Card (Figma Frame 474:230092)
 * Step-by-step Standard Operating Procedure (SOP) instructions
 * for baristas, KDS stations, and quality control audits.
 */
export function RecipeMethodCard({
  stepsCount,
  targetMakeTime,
  steps,
}: RecipeMethodCardProps) {
  return (
    <div className="w-full rounded-[16px] border border-border bg-surface p-5 flex flex-col gap-4 shadow-2xs">
      {/* Header (Figma Frame 474:230093) */}
      <div className="flex items-center justify-between">
        <h2 className="text-title text-text font-bold">Method</h2>
        <div className="flex items-center gap-1.5 text-caption text-text-secondary">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {stepsCount} steps · target make time {targetMakeTime}
          </span>
        </div>
      </div>

      {/* Steps Grid (Figma Frames 474:230096..474:230112) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="p-3.5 rounded-[12px] bg-background-subtle border border-border flex flex-col gap-1"
          >
            <span className="text-label text-primary font-bold">
              {step.stepNumber}
            </span>
            <span className="text-label text-text font-bold truncate">
              {step.title}
            </span>
            <span className="text-caption text-text-secondary leading-snug line-clamp-2">
              {step.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
