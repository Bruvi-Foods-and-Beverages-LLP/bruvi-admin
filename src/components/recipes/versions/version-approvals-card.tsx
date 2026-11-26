"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { RecipeApprovalItem } from "@/types/recipes";
import { cn } from "@/lib/utils/cn";

interface VersionApprovalsCardProps {
  title?: string;
  items: RecipeApprovalItem[];
  methodNotice: string;
  onRequestChanges?: () => void;
  onApprove?: () => void;
}

/**
 * Stakeholder Approvals Card (Figma Frame 474:230472)
 * Multi-role governance gate requiring Bev R&D sign-off and
 * Operations Director authorization before store dispatch.
 */
export function VersionApprovalsCard({
  title = "Approvals",
  items,
  methodNotice,
  onRequestChanges,
  onApprove,
}: VersionApprovalsCardProps) {
  return (
    <div className="w-full rounded-[16px] border border-border bg-surface p-5 flex flex-col gap-4 shadow-2xs select-none">
      {/* Header */}
      <h2 className="text-title text-text font-bold">{title}</h2>

      {/* Stakeholder Sign-off List (Figma Frames 474:230475..474:230492) */}
      <div className="flex flex-col gap-3">
        {items.map((approval) => {
          const isApproved = approval.status === "APPROVED";

          return (
            <div
              key={approval.id}
              className="flex items-center justify-between gap-3 py-1"
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    isApproved
                      ? "bg-[#F5F2EB] text-text"
                      : "bg-[#E8F5FD] text-primary"
                  )}
                >
                  {approval.initials}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-label text-text font-bold truncate">
                    {approval.name}
                  </span>
                  <span className="text-caption text-text-secondary truncate">
                    {approval.dateText}
                  </span>
                </div>
              </div>

              {/* Right: Status Pill */}
              <div className="shrink-0">
                {isApproved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-[#DCFCE7] text-[#15803D] text-caption-bold">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Approved</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-warning-surface text-warning text-caption-bold">
                    Pending
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barista Method Shift Notice (Figma Frame 474:230493) */}
      <div className="pt-3 border-t border-border text-caption text-text-secondary leading-relaxed">
        {methodNotice}
      </div>

      {/* Action Buttons (Figma Frame 474:230495) */}
      <div className="pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={onRequestChanges}
          className="flex-1 h-10 px-3 rounded-[12px] border border-border-input bg-surface hover:bg-background-subtle text-text text-label inline-flex items-center justify-center transition-colors cursor-pointer select-none"
        >
          <span>Request changes</span>
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 h-10 px-3 rounded-[12px] bg-primary hover:bg-primary-pressed text-text-inverse text-label font-bold inline-flex items-center justify-center transition-colors cursor-pointer select-none shadow-2xs"
        >
          <span>Approve v5</span>
        </button>
      </div>
    </div>
  );
}
