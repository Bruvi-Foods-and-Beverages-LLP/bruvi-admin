"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";

interface VersionReasonCardProps {
  title: string;
  description: string;
  avgSweetness: number;
  maxSweetness?: number;
}

/**
 * Version Change Justification Card (Figma Frame 474:230361)
 * Displays customer sentiment context, sensory review scores,
 * and R&D authorship rationale driving the recipe modification.
 */
export function VersionReasonCard({
  title,
  description,
  avgSweetness,
  maxSweetness = 5,
}: VersionReasonCardProps) {
  return (
    <div className="w-full rounded-[16px] bg-surface-warm border border-border p-5 flex items-center justify-between gap-4 shadow-2xs select-none">
      {/* Left: Icon Badge + Text Information (Figma Frame 474:230362) */}
      <div className="flex items-start gap-4 min-w-0">
        <div className="w-10 h-10 rounded-[12px] bg-surface border border-border flex items-center justify-center shrink-0 text-text-muted shadow-2xs">
          <MessageSquare className="w-5 h-5 text-text-secondary" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-overline-l text-text-secondary uppercase">
            Reason for change
          </span>
          <h2 className="text-title text-text font-bold mt-0.5 leading-snug">
            {title}
          </h2>
          <p className="text-caption text-text-secondary leading-relaxed mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Metric Rating Box (Figma Frame 474:230372) */}
      <div className="flex flex-col items-end shrink-0 pl-4 border-l border-border/60">
        <span className="text-display-s text-text font-display leading-none">
          {avgSweetness.toFixed(1)}
        </span>
        <span className="text-caption text-text-secondary mt-1 whitespace-nowrap">
          avg sweetness / {maxSweetness}
        </span>
      </div>
    </div>
  );
}
