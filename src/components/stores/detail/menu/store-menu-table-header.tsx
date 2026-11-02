"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StoreMenuTableHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
}

export function StoreMenuTableHeader({
  allSelected,
  someSelected,
  onToggleSelectAll,
}: StoreMenuTableHeaderProps) {
  return (
    <div className="flex items-center gap-4 h-9 px-5 bg-bg-subtle border-b border-border select-none text-[11px] font-bold text-text-secondary uppercase tracking-wider">
      {/* Master Checkbox (24px) */}
      <div className="w-6 shrink-0 flex items-center justify-center">
        <button
          type="button"
          onClick={onToggleSelectAll}
          aria-label={allSelected ? "Deselect all items" : "Select all items"}
          className={cn(
            "h-5 w-5 rounded-[4px] border-[1.5px] flex items-center justify-center transition-all cursor-pointer",
            allSelected || someSelected
              ? "bg-primary border-primary text-white"
              : "border-border-input bg-surface hover:border-text"
          )}
        >
          {allSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          {!allSelected && someSelected && (
            <span className="h-1 w-2.5 bg-white rounded-xs" />
          )}
        </button>
      </div>

      {/* ITEM column (flex-1) */}
      <div className="flex-1 min-w-[260px] text-left">
        <span>Item</span>
      </div>

      {/* BASE column (80px) */}
      <div className="w-20 shrink-0 text-right">
        <span>Base</span>
      </div>

      {/* OVERRIDE column (80px) */}
      <div className="w-20 shrink-0 text-right">
        <span>Override</span>
      </div>

      {/* COUNTER column (64px) */}
      <div className="w-16 shrink-0 text-center">
        <span>Counter</span>
      </div>

      {/* APP column (64px) */}
      <div className="w-16 shrink-0 text-center">
        <span>App</span>
      </div>

      {/* KIOSK column (64px) */}
      <div className="w-16 shrink-0 text-center">
        <span>Kiosk</span>
      </div>

      {/* QR column (64px) */}
      <div className="w-16 shrink-0 text-center">
        <span>QR</span>
      </div>

      {/* STATUS column (160px) */}
      <div className="w-40 shrink-0 text-left">
        <span>Status</span>
      </div>
    </div>
  );
}
