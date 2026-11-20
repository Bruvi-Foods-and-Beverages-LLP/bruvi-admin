"use client";

import React from "react";
import { useAppSelector } from "@/store";
import { ChannelPerformance } from "@/types/marketing";

/**
 * Channel Performance Card with 7-Day Sparkline Bar Charts (Figma 474:241455, 400x278px)
 * Push, WhatsApp, In-app, and SMS breakdown with themed sparklines and MTD revenue numbers.
 */
export function ChannelPerformanceCard() {
  const { channelPerformance } = useAppSelector((state) => state.marketing);

  const getBarColor = (theme: ChannelPerformance["theme"]) => {
    switch (theme) {
      case "sky":
        return "bg-[#a9d8f3]";
      case "coffee":
        return "bg-[#6b4430]";
      case "matcha":
        return "bg-[#566f2c]";
      case "navy":
      default:
        return "bg-[#1c3a66]";
    }
  };

  return (
    <div className="w-full lg:w-[400px] h-[278px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors shrink-0">
      {/* 1. Header (Figma 474:241456, 358x34px) */}
      <div className="w-full flex items-baseline justify-between border-b border-[#dce2ea] pb-2">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">
          Channel performance
        </h2>
        <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
          Last 7 days · revenue MTD
        </span>
      </div>

      {/* 2. Channel Rows (4 items, ~47px each) */}
      <div className="w-full flex flex-col divide-y divide-[#f0f4f8]">
        {channelPerformance.map((ch) => {
          const barColor = getBarColor(ch.theme);

          return (
            <div
              key={ch.id}
              className="w-full h-[47px] flex items-center justify-between gap-3 pt-1"
            >
              {/* Channel Name & Subtitle */}
              <div className="w-[96px] shrink-0 flex flex-col justify-center">
                <span className="text-[14px] leading-[20px] font-bold text-[#0f2340] font-manrope">
                  {ch.name}
                </span>
                <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
                  {ch.statLabel}
                </span>
              </div>

              {/* 7-Day Mini Sparkline Bar Chart (width ~166px, max height 32px) */}
              <div className="flex-1 h-8 flex items-end justify-center gap-1 px-2">
                {ch.bars.map((barVal, idx) => {
                  // Normalize height between 3px min and 32px max
                  const heightPx = Math.max(3, Math.round((barVal / 100) * 32));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPx}px` }}
                      className={`w-[18px] sm:w-[20px] rounded-[3px] transition-all ${barColor}`}
                      title={`Day ${idx + 1}: ${barVal}%`}
                    />
                  );
                })}
              </div>

              {/* Revenue MTD */}
              <div className="w-[64px] text-right shrink-0">
                <span className="text-[14px] leading-[20px] font-extrabold text-[#0f2340] font-archivo tracking-[-0.42px]">
                  {ch.revenueMtd}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

