"use client";

import React from "react";

interface DashboardHeaderProps {
  greeting?: string;
  updatedAtFormatted?: string;
  onExport?: () => void;
  onOpenReport?: () => void;
}

export function DashboardHeader({
  greeting = "Good morning",
  updatedAtFormatted = "LIVE",
  onExport,
  onOpenReport,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-[12px] leading-[16px] uppercase tracking-[1.68px] text-[#3f4b5e]">
          {updatedAtFormatted}
        </span>
        <h1 className="font-display font-black text-[32px] leading-[38px] tracking-[-0.96px] text-[#0f2340]">
          {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="h-[36px] w-[80px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-[#0f2340] font-sans font-bold text-[14px] leading-[20px] transition-colors hover:bg-[#f5f7fa] active:bg-[#e8edf2] cursor-pointer flex items-center justify-center"
        >
          Export
        </button>
        <button
          type="button"
          onClick={onOpenReport}
          className="h-[36px] w-[149px] rounded-[12px] bg-[#1c3a66] text-white font-sans font-bold text-[14px] leading-[20px] transition-colors hover:bg-[#152e52] active:bg-[#0f2340] cursor-pointer flex items-center justify-center"
        >
          Open daily report
        </button>
      </div>
    </div>
  );
}
