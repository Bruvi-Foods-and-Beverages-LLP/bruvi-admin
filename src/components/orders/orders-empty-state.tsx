"use client";

import * as React from "react";
import { ReceiptIcon } from "@/components/icons";
import { Plus, RotateCcw } from "lucide-react";

interface OrdersEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function OrdersEmptyState({
  isFiltered = false,
  onResetFilters,
}: OrdersEmptyStateProps) {
  return (
    <div className="py-16 px-6 flex flex-col items-center justify-center text-center select-none">
      {/* Circular Icon Badge (AS02 Pattern) */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#55647a] mb-4">
        <ReceiptIcon size={32} className="text-[#55647a]" />
      </div>

      {/* Heading */}
      <h3 className="text-heading-s text-[#0f2340]">
        {isFiltered ? "No orders match your filter" : "No live orders stream active"}
      </h3>

      {/* Description */}
      <p className="text-body-s text-[#55647a] max-w-md mt-1.5 mb-6 leading-relaxed">
        {isFiltered
          ? "Try adjusting your search criteria, selecting another store or clearing the status filter to see more orders."
          : "All omnichannel order queues across POS, Kiosk, App, and QR Dine-In are currently synchronized and clear."}
      </p>

      {/* Action CTA */}
      {isFiltered && onResetFilters ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="h-9 px-5 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Filters</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-9 px-5 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Refresh Live Queue</span>
        </button>
      )}
    </div>
  );
}

