"use client";

import * as React from "react";
import { RecipeRolloutStep } from "@/types/recipes";
import { cn } from "@/lib/utils/cn";

interface VersionRolloutCardProps {
  title: string;
  subtitle: string;
  steps: RecipeRolloutStep[];
}

/**
 * Rollout Plan Timeline Card (Figma Frame 474:230444)
 * Multi-stage store deployment timeline tracking pilot outlet trials,
 * customer feedback gates, and network-wide KDS/POS promotion.
 */
export function VersionRolloutCard({
  title,
  subtitle,
  steps,
}: VersionRolloutCardProps) {
  return (
    <div className="w-full rounded-[16px] border border-border bg-surface p-5 flex flex-col gap-4 shadow-2xs select-none">
      {/* Header (Figma Frame 474:230445) */}
      <div className="flex flex-col gap-0.5">
        <h2 className="text-title text-text font-bold">{title}</h2>
        <p className="text-caption text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Timeline Steps (Figma Frames 474:230448..474:230471) */}
      <div className="flex flex-col mt-1">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={step.stepNumber} className="flex items-start gap-3 relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-200" />
              )}

              {/* Numbered Circle Indicator */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 relative z-10",
                  step.isCurrent
                    ? "bg-primary text-white"
                    : "border border-gray-300 bg-surface text-text-secondary"
                )}
              >
                {step.stepNumber}
              </div>

              {/* Step Content */}
              <div className={cn("flex flex-col min-w-0", !isLast ? "pb-5" : "pb-0")}>
                <span className="text-label text-text font-bold truncate">
                  {step.title}
                </span>
                <span className="text-caption text-text-secondary leading-snug mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
