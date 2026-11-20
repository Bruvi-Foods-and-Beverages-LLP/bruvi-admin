"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveTab } from "@/store/slices/marketing-slice";
import { LeafIcon, PhinIcon } from "@/components/icons";

/**
 * Live Campaigns Section (Figma 474:241402, 720x278px)
 * Two live campaign cards side-by-side with brand thumbnails, progress tracks, and 3-column KPIs.
 */
export function LiveCampaignsSection() {
  const dispatch = useAppDispatch();
  const { liveCampaigns } = useAppSelector((state) => state.marketing);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header Row (Figma 474:241403, 720x26px) */}
      <div className="w-full flex items-center justify-between">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">
          Live now
        </h2>
        <button
          type="button"
          onClick={() => dispatch(setActiveTab("campaigns"))}
          className="text-[14px] leading-[20px] font-bold text-[#1c3a66] hover:underline cursor-pointer font-manrope"
        >
          All campaigns →
        </button>
      </div>

      {/* Cards Grid (Figma 474:241406, 720x240px, 2x352px cards) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveCampaigns.map((camp) => {
          const isMatcha = camp.theme === "matcha";
          const progressPercent = Math.min(100, Math.round((camp.currentDay / camp.totalDays) * 100));

          return (
            <div
              key={camp.id}
              className="h-[240px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors"
            >
              {/* 1. Card Header: Thumbnail, Titles, and Live Status Badge */}
              <div className="w-full flex items-center gap-3">
                {/* 48x48 Branded Thumbnail */}
                <div
                  className={`w-12 h-12 rounded-[8px] flex items-center justify-center shrink-0 ${
                    isMatcha ? "bg-[#ebf1de] text-[#566f2c]" : "bg-[#f3e8df] text-[#6b4430]"
                  }`}
                >
                  {isMatcha ? (
                    <LeafIcon className="w-6 h-6 text-[#566f2c]" />
                  ) : (
                    <PhinIcon className="w-6 h-6 text-[#6b4430]" />
                  )}
                </div>

                {/* Name & Channel Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-[16px] leading-[24px] font-bold text-[#0f2340] font-manrope truncate">
                    {camp.title}
                  </h3>
                  <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope truncate">
                    {camp.channels}
                  </span>
                </div>

                {/* Status Badge */}
                <span className="px-2 py-0.5 rounded-full text-[12px] font-bold bg-[#e3f4ea] text-[#1f7a4d] shrink-0 font-manrope">
                  {camp.status}
                </span>
              </div>

              {/* 2. Middle: Day Progress & Target Note */}
              <div className="w-full flex flex-col gap-1">
                <div className="flex items-center justify-between text-[12px] font-manrope">
                  <span className="font-medium text-[#3f4b5e]">
                    Day {camp.currentDay} of {camp.totalDays} · {camp.endDateLabel}
                  </span>
                  <span
                    className={`font-bold ${
                      camp.targetIsPositive ? "text-[#1f7a4d]" : "text-[#3f4b5e]"
                    }`}
                  >
                    {camp.targetHighlight}
                  </span>
                </div>

                {/* 8px Progress Track */}
                <div className="w-full h-2 rounded-[4px] bg-[#0f2340]/10 overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className={`h-full rounded-[4px] ${
                      isMatcha ? "bg-[#566f2c]" : "bg-[#6b4430]"
                    }`}
                  />
                </div>
              </div>

              {/* 3. Bottom: 3-Column Metrics (Opened/Read, Orders, Revenue) */}
              <div className="w-full flex items-center justify-between border-t border-[#f0f4f8] pt-3">
                {/* Metric 1 */}
                <div className="flex flex-col">
                  <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
                    {camp.metric1Label}
                  </span>
                  <span className="text-[16px] leading-[24px] font-extrabold text-[#0f2340] font-archivo tracking-[-0.48px]">
                    {camp.metric1Value}
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col">
                  <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
                    {camp.metric2Label}
                  </span>
                  <span className="text-[16px] leading-[24px] font-extrabold text-[#0f2340] font-archivo tracking-[-0.48px]">
                    {camp.metric2Value}
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col text-right">
                  <span className="text-[12px] leading-[16px] font-medium text-[#3f4b5e] font-manrope">
                    {camp.metric3Label}
                  </span>
                  <span className="text-[16px] leading-[24px] font-extrabold text-[#0f2340] font-archivo tracking-[-0.48px]">
                    {camp.metric3Value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

