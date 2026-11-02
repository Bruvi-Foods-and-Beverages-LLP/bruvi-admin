"use client";

import * as React from "react";

interface StoreMenuBulkBarProps {
  selectedCount: number;
  onMarkAvailable: () => void;
  onMarkSoldOut: () => void;
  onOpenHideChannelsModal: () => void;
  onOpenPriceOverrideModal: () => void;
  onClearSelection: () => void;
  isSubmitting?: boolean;
}

export function StoreMenuBulkBar({
  selectedCount,
  onMarkAvailable,
  onMarkSoldOut,
  onOpenHideChannelsModal,
  onOpenPriceOverrideModal,
  onClearSelection,
  isSubmitting = false,
}: StoreMenuBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 h-auto min-h-[48px] px-5 py-2.5 bg-navy-900 text-white select-none transition-all">
      {/* Left: Count + Actions */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="text-label text-white font-bold whitespace-nowrap">
          {selectedCount} selected
        </span>

        <div className="h-4 w-px bg-white/20 hidden sm:block" />

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onMarkAvailable}
            className="text-label text-white hover:text-sky-300 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            Mark available
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onMarkSoldOut}
            className="text-label text-white hover:text-sky-300 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            Mark sold out
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onOpenHideChannelsModal}
            className="text-label text-white hover:text-sky-300 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            Hide on channel…
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onOpenPriceOverrideModal}
            className="text-label text-white hover:text-sky-300 transition-colors cursor-pointer font-bold disabled:opacity-50"
          >
            Set price override…
          </button>
        </div>
      </div>

      {/* Right: Clear Selection */}
      <button
        type="button"
        onClick={onClearSelection}
        className="text-label-semi text-[#BCC6D3] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
      >
        Clear selection
      </button>
    </div>
  );
}
