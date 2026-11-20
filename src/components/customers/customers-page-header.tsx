"use client";

import * as React from "react";
import { useAppSelector } from "@/store";
import { CustomersApi } from "@/lib/api/customers";

/**
 * Customers Header Bar (Figma 225:103330)
 * Overline: "GROWTH · 1,84,200 REGISTERED"
 * Title: "Customers"
 * Actions: "Export CSV" and "Create segment"
 */
export function CustomersPageHeader({
  onCreateSegment,
  showActions = true,
}: {
  onCreateSegment?: () => void;
  /** Export and Create segment need customer access (hidden for support-only staff). */
  showActions?: boolean;
}) {
  const { stats, filters } = useAppSelector((state) => state.customers);

  const handleExport = () => {
    const exportUrl = CustomersApi.getExportCsvUrl(filters);
    window.open(exportUrl, "_blank");
  };

  const registeredDisplay = stats?.registeredText ?? "—";

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      {/* Left: Overline & Title (Figma 225:103332) */}
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[1.68px] select-none">
          Growth · {registeredDisplay} registered
        </span>
        <h1 className="text-display-s font-display font-black text-[#0f2340] tracking-[-1.2px]">
          Customers
        </h1>
      </div>

      {/* Right: Actions (Figma 225:103335) */}
      {showActions && (
      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
        {/* Export CSV Button (Figma 225:103336) */}
        <button
          type="button"
          onClick={handleExport}
          className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer flex items-center justify-center font-sans [font-variation-settings:'wght'_700] shadow-2xs"
        >
          Export CSV
        </button>

        {/* Create segment Button (Figma 225:103338) */}
        <button
          type="button"
          onClick={onCreateSegment}
          className="h-9 px-4 rounded-[12px] bg-[#1c3a66] text-label text-white hover:bg-[#152c4f] active:bg-[#0f2340] transition-colors cursor-pointer flex items-center justify-center font-sans [font-variation-settings:'wght'_700] shadow-2xs"
        >
          Create segment
        </button>
      </div>
      )}
    </div>
  );
}

