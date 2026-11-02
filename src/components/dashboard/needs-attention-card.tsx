"use client";

import React from "react";
import Link from "next/link";
import { DashboardIssueItem } from "@/types/dashboard";

interface NeedsAttentionCardProps {
  count?: number;
  items?: DashboardIssueItem[];
}

export function NeedsAttentionCard({
  count = 0,
  items = [],
}: NeedsAttentionCardProps) {
  const getSeverityDot = (severity: DashboardIssueItem["severity"]) => {
    switch (severity) {
      case "error":
        return "bg-[#c0352b]";
      case "warning":
        return "bg-[#9a5b00]";
      case "info":
        return "bg-[#22629e]";
      default:
        return "bg-[#55647a]";
    }
  };

  return (
    <div className="w-full lg:w-[400px] rounded-[16px] bg-white border border-[#dce2ea] overflow-hidden flex flex-col shadow-sm min-h-[522px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#dce2ea] flex items-center justify-between">
        <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
          Needs attention
        </h2>
        {count > 0 && (
          <span className="min-w-[24px] h-[20px] px-2 rounded-[10px] bg-[#c0352b] text-white font-sans font-extrabold text-[12px] leading-[16px] inline-flex items-center justify-center">
            {count}
          </span>
        )}
      </div>

      {/* Items List or Empty State */}
      {items.length > 0 ? (
        <div className="divide-y divide-[#dce2ea] flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="px-5 py-[13px] flex items-start gap-3 hover:bg-[#f8fafc] transition-colors"
            >
              {/* Status Dot (8x8px rounded) */}
              <span
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getSeverityDot(
                  item.severity
                )}`}
              />

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
                  {item.title}
                </h3>
                <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              {/* Action Link / Button */}
              {item.actionUrl.startsWith("tel:") ? (
                <a
                  href={item.actionUrl}
                  className="font-sans font-bold text-[12px] leading-[16px] text-[#1c3a66] whitespace-nowrap hover:underline shrink-0 mt-0.5"
                >
                  {item.actionLabel}
                </a>
              ) : (
                <Link
                  href={item.actionUrl}
                  className="font-sans font-bold text-[12px] leading-[16px] text-[#1c3a66] whitespace-nowrap hover:underline shrink-0 mt-0.5"
                >
                  {item.actionLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 px-6 text-center flex flex-col items-center justify-center flex-1">
          <div className="w-10 h-10 rounded-full bg-[#e3f4ea] text-[#1f7a4d] flex items-center justify-center font-bold text-lg mb-2">
            ✓
          </div>
          <p className="font-sans font-bold text-[14px] leading-[20px] text-[#0f2340]">
            All systems normal
          </p>
          <p className="font-sans font-normal text-[12px] leading-[16px] text-[#3f4b5e] mt-1 max-w-[240px]">
            No operational alerts or critical issues requiring immediate action.
          </p>
        </div>
      )}
    </div>
  );
}
