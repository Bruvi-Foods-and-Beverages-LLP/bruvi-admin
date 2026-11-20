"use client";

import React from "react";
import { useAppSelector } from "@/store";

/**
 * Marketing KPI Stats Grid (Figma 474:241333, 1136x124px, 4x272px cards)
 * Strict 16px gap, 21px padding, Archivo price-l tokens, and Manrope metadata.
 */
export function MarketingKpiGrid() {
  const { kpis, isLoading } = useAppSelector((state) => state.marketing);

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[124px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between animate-pulse"
          >
            <div className="w-28 h-4 bg-gray-100 rounded" />
            <div className="w-20 h-8 bg-gray-200 rounded" />
            <div className="w-36 h-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Campaigns */}
      <div className="h-[124px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors">
        <span className="text-[14px] font-bold text-[#3f4b5e] font-manrope">
          Active campaigns
        </span>
        <div className="text-[32px] leading-[38px] font-extrabold font-archivo text-[#0f2340] tracking-[-0.96px]">
          {kpis.activeCampaigns}
        </div>
        <span className="text-[12px] font-medium text-[#3f4b5e] font-manrope">
          {kpis.activeCampaignsLive} live · {kpis.activeCampaignsScheduled} scheduled
        </span>
      </div>

      {/* 2. Attributed Revenue MTD */}
      <div className="h-[124px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors">
        <span className="text-[14px] font-bold text-[#3f4b5e] font-manrope">
          Attributed revenue MTD
        </span>
        <div className="text-[32px] leading-[38px] font-extrabold font-archivo text-[#0f2340] tracking-[-0.96px]">
          {kpis.revenueMtd}
        </div>
        <span className="text-[12px] font-bold text-[#1f7a4d] font-manrope">
          {kpis.revenueMtdDelta}
        </span>
      </div>

      {/* 3. Avg Open Rate */}
      <div className="h-[124px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors">
        <span className="text-[14px] font-bold text-[#3f4b5e] font-manrope">
          Avg open rate · push
        </span>
        <div className="text-[32px] leading-[38px] font-extrabold font-archivo text-[#0f2340] tracking-[-0.96px]">
          {kpis.openRate}
        </div>
        <span className="text-[12px] font-bold text-[#1f7a4d] font-manrope">
          {kpis.openRateDelta}
        </span>
      </div>

      {/* 4. Coupon Redemption */}
      <div className="h-[124px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors">
        <span className="text-[14px] font-bold text-[#3f4b5e] font-manrope">
          Coupon redemption
        </span>
        <div className="text-[32px] leading-[38px] font-extrabold font-archivo text-[#0f2340] tracking-[-0.96px]">
          {kpis.couponRedemption}
        </div>
        <span className="text-[12px] font-bold text-[#c0352b] font-manrope">
          {kpis.couponRedemptionDelta}
        </span>
      </div>
    </div>
  );
}

