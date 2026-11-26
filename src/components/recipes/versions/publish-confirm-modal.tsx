"use client";

import * as React from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface PublishConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipeName?: string;
  versionLabel?: string;
  pilotStoresCount?: number;
  stores?: string[];
  effectiveDate?: string;
  reviewDate?: string;
  baristasCount?: number;
  isPublishing?: boolean;
}

/**
 * Enterprise Recipe Publish Confirmation Modal (Figma Frame 474:230835)
 * Standardized governance dialog before deploying recipe BOM modifications
 * to store POS/KDS terminals and barista training apps.
 *
 * Strict GEMINI.md compliance:
 * - 560px width, rounded-[24px] elevation container
 * - Libre Caslon overline, Manrope ExtraBold heading-m (24px)
 * - Standardized semantic tokens (bg-surface, bg-background-subtle, bg-info-surface, text-text, text-text-secondary, text-success)
 * - Zero arbitrary hex overrides
 */
export function PublishConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  recipeName = "Salted Cream Cold Brew",
  versionLabel = "v5",
  pilotStoresCount = 2,
  stores = ["Indiranagar · BLR-IND", "Koramangala"],
  effectiveDate = "Mon 5 Oct at opening",
  reviewDate = "Mon 12 Oct",
  baristasCount = 9,
  isPublishing = false,
}: PublishConfirmModalProps) {
  const [notifyBaristas, setNotifyBaristas] = React.useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
    >
      {/* Dialog Surface Card (Figma Frame 474:230835 - 560px width, rounded-[24px]) */}
      <div className="w-full max-w-[560px] rounded-[24px] bg-surface shadow-2xl border border-border overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-text-muted hover:text-text hover:bg-background-subtle transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Header (Figma Frame 474:230836) */}
        <div className="p-6 pb-0 flex flex-col gap-2">
          {/* Overline in Libre Caslon Text */}
          <span className="text-overline text-text-secondary uppercase">
            {recipeName}
          </span>

          {/* Heading in Manrope ExtraBold (24px / 32px) */}
          <h2 className="text-heading-m text-text font-extrabold pr-8">
            Publish {versionLabel} to {pilotStoresCount} pilot stores?
          </h2>

          {/* Subtitle description */}
          <p className="text-body-s text-text-secondary leading-relaxed">
            {versionLabel} replaces v4 from {effectiveDate}. The other 10 stores stay on v4 until the review on {reviewDate}.
          </p>
        </div>

        {/* 2. Body Details (Figma Frame 474:230840) */}
        <div className="p-6 flex flex-col gap-4">
          {/* Card A: Formulation Diff Summary (Figma Frame 474:230841) */}
          <div className="w-full rounded-[16px] bg-background-subtle px-4 py-1 divide-y divide-border">
            {/* Row 1: Condensed milk */}
            <div className="h-10 flex items-center justify-between">
              <span className="text-body-s text-text-secondary">
                Condensed milk
              </span>
              <span className="text-body-s text-text font-bold">
                30 ml → 25 ml
              </span>
            </div>

            {/* Row 2: Sea salt */}
            <div className="h-10 flex items-center justify-between">
              <span className="text-body-s text-text-secondary">
                Sea salt (salted cream)
              </span>
              <span className="text-body-s text-text font-bold">
                0.6 g → 0.5 g
              </span>
            </div>

            {/* Row 3: Cost & margin delta */}
            <div className="h-10 flex items-center justify-between">
              <span className="text-body-s text-text-secondary">
                Cost · margin (Large)
              </span>
              <span className="text-body-s text-success font-bold">
                ₹54.20 → ₹52.90 · 80.6% → 81.1%
              </span>
            </div>
          </div>

          {/* Card B: Affected Stores (Figma Frame 474:230851) */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-label text-text font-bold">
              Affected stores
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {stores.map((store) => (
                <span
                  key={store}
                  className="h-6 px-2.5 rounded-full border border-border bg-surface text-caption text-text-secondary inline-flex items-center"
                >
                  {store}
                </span>
              ))}
            </div>
          </div>

          {/* Card C: KDS & Staff App Info Banner (Figma Frame 474:230858) */}
          <div className="w-full rounded-[16px] bg-surface-brand p-3 flex items-start gap-3 border border-border/50">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-body-s text-text font-bold">
                KDS and staff app will show the new steps
              </span>
              <span className="text-caption text-text-secondary leading-relaxed">
                Step 2 becomes “Pour 25 ml” with a training note. Each barista must acknowledge the change before their first make.
              </span>
            </div>
          </div>

          {/* Card D: Notify Baristas Row with Toggle (Figma Frame 474:230868) */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex flex-col">
              <span className="text-label text-text font-bold">
                Notify baristas
              </span>
              <span className="text-caption text-text-secondary">
                Push to {baristasCount} baristas at both stores now, reminder Mon 6:00 am
              </span>
            </div>

            {/* Toggle switch (Figma Frame 474:230872) */}
            <button
              type="button"
              role="switch"
              aria-checked={notifyBaristas}
              onClick={() => setNotifyBaristas((prev) => !prev)}
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0",
                notifyBaristas ? "bg-primary" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform block absolute top-1",
                  notifyBaristas ? "translate-x-5" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* 3. Footer Action Buttons (Figma Frame 474:230874 - h: 81px, bg-background-subtle) */}
        <div className="px-6 py-4 bg-background-subtle border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="h-12 px-6 rounded-[12px] border border-border-input bg-surface hover:bg-background-subtle text-text text-label font-bold transition-colors cursor-pointer select-none"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPublishing}
            className="h-12 px-6 rounded-[12px] bg-primary hover:bg-primary-pressed text-text-inverse text-label font-bold transition-colors cursor-pointer select-none shadow-2xs inline-flex items-center justify-center gap-2"
          >
            {isPublishing ? "Publishing..." : `Publish ${versionLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}
