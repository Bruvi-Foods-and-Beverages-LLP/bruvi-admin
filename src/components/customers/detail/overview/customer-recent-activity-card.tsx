"use client";

import * as React from "react";
import { CustomerRecentActivityItem } from "@/types/customers";
import { cn } from "@/lib/utils/cn";

interface CustomerRecentActivityCardProps {
  activities: CustomerRecentActivityItem[];
  onViewFullTimeline?: () => void;
}

export function CustomerRecentActivityCard({
  activities,
  onViewFullTimeline,
}: CustomerRecentActivityCardProps) {
  const getDotColor = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-[#1f7a4d]";
      case "info":
        return "bg-[#22629e]";
      case "warning":
        return "bg-[#b45309]";
      default:
        return "bg-[#55647a]";
    }
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case "paid":
        return "bg-[#e3f4ea] text-[#1f7a4d]";
      case "preparing":
        return "bg-[#e4f0fa] text-[#22629e]";
      case "completed":
        return "bg-[#f5f7fa] text-[#3f4b5e]";
      default:
        return "bg-[#f5f7fa] text-[#3f4b5e]";
    }
  };

  return (
    <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
      {/* Card Header (Figma 474:239847) */}
      <div className="h-[59px] px-5 flex items-center justify-between border-b border-[#dce2ea]">
        <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340] tracking-tight [font-variation-settings:'wght'_800]">
          Recent activity
        </h3>
        <button
          type="button"
          onClick={onViewFullTimeline}
          className="font-sans font-bold text-[14px] leading-5 text-[#1c3a66] hover:text-[#0f2340] hover:underline transition-colors cursor-pointer"
        >
          Full timeline →
        </button>
      </div>

      {/* Activities List */}
      <div className="flex flex-col divide-y divide-[#dce2ea]">
        {activities.map((item) => (
          <div
            key={item.id}
            className="px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-[#f5f7fa]/60 select-none"
          >
            {/* 8px Status Indicator Dot */}
            <div
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                getDotColor(item.statusType)
              )}
            />

            {/* Title & Subtitle */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate [font-variation-settings:'wght'_700]">
                {item.title}
              </span>
              <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] truncate [font-variation-settings:'wght'_500]">
                {item.subtitle}
              </span>
            </div>

            {/* Optional Status Badge Pill */}
            {item.statusBadge && (
              <div className="shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700]",
                    getBadgeStyle(item.statusBadge)
                  )}
                >
                  {item.statusBadge}
                </span>
              </div>
            )}

            {/* Financial Amount */}
            <div className="w-20 text-right shrink-0">
              <span
                className={cn(
                  "font-display font-extrabold text-[14px] leading-5 tracking-tight tnum [font-variation-settings:'wdth'_112,'wght'_800] [font-feature-settings:'tnum'_1]",
                  item.isPositive ? "text-[#1f7a4d]" : "text-[#0f2340]"
                )}
              >
                {item.amountText}
              </span>
            </div>

            {/* Timestamp */}
            <div className="w-24 text-right shrink-0">
              <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] whitespace-nowrap [font-variation-settings:'wght'_500]">
                {item.timeText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

