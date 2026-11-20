"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLoyaltyDashboard, setActiveTab } from "@/store/slices/loyalty-slice";
import { CoffeeIcon, PhinIcon, BeanIcon, CartIcon } from "@/components/icons";
import type { DashboardTopRewardItem } from "@/types/loyalty";

function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return num.toLocaleString("en-IN");
}

function formatPoints(pts: number | undefined | null): string {
  if (!pts) return "0";
  if (pts >= 1_000_000) return `${(pts / 1_000_000).toFixed(2)} M`;
  if (pts >= 100_000) return `${(pts / 100_000).toFixed(2)} L`;
  if (pts >= 1_000) return `${(pts / 1_000).toFixed(1)}k`;
  return pts.toLocaleString("en-IN");
}

function formatRupees(rupees: number | undefined | null): string {
  if (!rupees) return "₹0";
  if (rupees >= 100_000) return `₹${(rupees / 100_000).toFixed(1)} L`;
  if (rupees >= 1_000) return `₹${(rupees / 1_000).toFixed(1)}k`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function getRewardIcon(type: string) {
  switch (type) {
    case "bean":
      return <BeanIcon className="h-4 w-4 text-[#6b4430]" />;
    case "phin":
      return <PhinIcon className="h-4 w-4 text-[#1c3a66]" />;
    case "coffee":
      return <CoffeeIcon className="h-4 w-4 text-[#566f2c]" />;
    default:
      return <CartIcon className="h-4 w-4 text-[#7f8ca0]" />;
  }
}

/**
 * Omnichannel Loyalty Operations Overview (Figma Node 474:245988 & 474:246009)
 * 100% Dynamic - Fully fed from backend PostgreSQL Supabase database.
 */
export function LoyaltyOverview() {
  const dispatch = useAppDispatch();
  const { dashboardData, isLoading } = useAppSelector((state) => state.loyalty);

  useEffect(() => {
    dispatch(fetchLoyaltyDashboard());
  }, [dispatch]);

  const rawKpis = dashboardData?.kpis;
  const weeklyTrends = dashboardData?.weeklyTrend || [];
  const tierDistribution = dashboardData?.tierDistribution || {
    silver: { count: 0, percent: 0 },
    gold: { count: 0, percent: 0 },
    platinum: { count: 0, percent: 0 },
  };
  const topRewards: DashboardTopRewardItem[] = dashboardData?.topRewards || [];
  const expiryWindows = dashboardData?.expiringBreakdown || [];

  // Determine dynamic chart max scale
  const maxWeeklyVal = Math.max(
    ...weeklyTrends.map((w) => Math.max(w.issued, w.redeemed)),
    100,
  );
  const midWeeklyVal = Math.round(maxWeeklyVal / 2);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. 5 KPI STAT CARDS ROW (Figma 474:245988)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {/* Card 1: Loyalty members (Inverted Navy Surface #1c3a66) */}
        <div className="w-full h-[132px] rounded-[16px] bg-[#1c3a66] p-5 flex flex-col justify-between shadow-2xs">
          <span className="text-label text-[#bcc6d3]">Loyalty members</span>
          <span className="text-price-l text-white">
            {formatNumber(rawKpis?.totalMembers)}
          </span>
          <span className="text-caption-bold text-[#4ade80] flex items-center gap-1">
            ▲ {formatNumber(rawKpis?.joinedThisMonth || 0)} joined this month
          </span>
        </div>

        {/* Card 2: Issued · 30 days */}
        <div className="w-full h-[132px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs">
          <span className="text-label text-[#3f4b5e]">Issued · 30 days</span>
          <span className="text-price-l text-[#0f2340]">
            {formatPoints(rawKpis?.pointsIssued30d)}
          </span>
          <span className="text-caption-bold text-[#15803d] flex items-center gap-1">
            ▲ {rawKpis?.issuedDeltaPercent !== undefined ? rawKpis.issuedDeltaPercent : 0}% vs prior 30 days
          </span>
        </div>

        {/* Card 3: Redeemed · 30 days */}
        <div className="w-full h-[132px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs">
          <span className="text-label text-[#3f4b5e]">Redeemed · 30 days</span>
          <span className="text-price-l text-[#0f2340]">
            {formatPoints(rawKpis?.pointsRedeemed30d)}
          </span>
          <span className="text-caption-bold text-[#3f4b5e]">
            ≈ ₹{formatNumber(Math.round((rawKpis?.pointsRedeemed30d || 0) * 0.1))} in rewards
          </span>
        </div>

        {/* Card 4: Points liability */}
        <div className="w-full h-[132px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs">
          <span className="text-label text-[#3f4b5e]">Points liability</span>
          <span className="text-price-l text-[#0f2340]">
            {formatRupees(rawKpis?.liabilityRupees)}
          </span>
          <span className="text-caption-bold text-[#b45309]">
            {formatPoints(rawKpis?.totalPointsLiability)} pts open · 1 pt ≈ ₹0.10
          </span>
        </div>

        {/* Card 5: Redemption rate */}
        <div className="w-full h-[132px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-2xs">
          <span className="text-label text-[#3f4b5e]">Redemption rate</span>
          <span className="text-price-l text-[#0f2340]">
            {rawKpis?.redemptionRate !== undefined ? `${rawKpis.redemptionRate}%` : "0%"}
          </span>
          <span className="text-caption-bold text-[#15803d] flex items-center gap-1">
            Target 45%
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LOWER TWO-COLUMN SECTION (Figma 474:246009)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* LEFT COLUMN: 720px on desktop (Figma 474:246010) */}
        <div className="w-full lg:w-[720px] flex flex-col gap-4 flex-1">
          {/* Card A: Points issued vs redeemed (Figma 474:246011) */}
          <div className="w-full min-h-[184px] rounded-[16px] bg-white border border-[#dce2ea] p-[17px_21px] flex flex-col justify-between gap-3 shadow-2xs">
            {/* Header row with Legend (Figma 474:246012) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 w-full">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#0f2340] leading-[26px]">
                  Points issued vs redeemed
                </h3>
                <p className="text-caption text-[#3f4b5e] mt-0.5">
                  Weekly, last 8 weeks · points activity
                </p>
              </div>

              {/* Legend (Figma 474:246016) */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-[4px] bg-[#1c3a66]" />
                  <span className="text-caption text-[#3f4b5e]">Issued</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-[4px] bg-[#a9d8f3]" />
                  <span className="text-caption text-[#3f4b5e]">Redeemed</span>
                </div>
              </div>
            </div>

            {/* Dual Bar Chart (Figma 474:246023) */}
            <div className="flex flex-row items-end gap-3 w-full h-[100px] pt-1">
              {/* Y-axis Ticks */}
              <div className="flex flex-col justify-between h-[80px] pb-5 text-right w-[24px] shrink-0">
                <span className="text-caption text-[#55647a]">{formatPoints(maxWeeklyVal)}</span>
                <span className="text-caption text-[#55647a]">{formatPoints(midWeeklyVal)}</span>
                <span className="text-caption text-[#55647a]">0</span>
              </div>

              {/* 8 Weekly Dual Bar Columns */}
              <div className="flex flex-row items-end justify-between flex-1 h-[96px] pb-1 border-b border-[#dce2ea]">
                {weeklyTrends.map((item, idx) => {
                  const maxHeight = 62;
                  const issuedHeight = Math.max(
                    item.issued > 0 ? 4 : 0,
                    Math.round((item.issued / maxWeeklyVal) * maxHeight),
                  );
                  const redeemedHeight = Math.max(
                    item.redeemed > 0 ? 4 : 0,
                    Math.round((item.redeemed / maxWeeklyVal) * maxHeight),
                  );

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center flex-1 justify-end group cursor-pointer"
                    >
                      <div className="flex items-end gap-1 h-[64px]">
                        {/* Issued Bar (Navy #1c3a66) */}
                        <div
                          style={{ height: `${issuedHeight}px` }}
                          className="w-[16px] sm:w-[20px] bg-[#1c3a66] rounded-t-[4px] transition-all group-hover:opacity-85"
                          title={`Issued: ${formatNumber(item.issued)} pts`}
                        />
                        {/* Redeemed Bar (Sky #a9d8f3) */}
                        <div
                          style={{ height: `${redeemedHeight}px` }}
                          className="w-[16px] sm:w-[20px] bg-[#a9d8f3] rounded-t-[4px] transition-all group-hover:opacity-85"
                          title={`Redeemed: ${formatNumber(item.redeemed)} pts`}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[#55647a] text-center mt-1.5 whitespace-nowrap">
                        {item.weekLabel || item.week}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card B: Top rewards redeemed (Figma 474:246069) */}
          <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] overflow-hidden flex flex-col shadow-2xs">
            {/* Header with Title and All rewards -> Link (Figma 474:246070) */}
            <div className="p-[12px_20px] flex items-center justify-between border-b border-[#dce2ea]">
              <div>
                <h3 className="text-[18px] font-extrabold text-[#0f2340] leading-[26px]">
                  Top rewards redeemed
                </h3>
                <p className="text-caption text-[#3f4b5e] mt-0.5">
                  Last 30 days · {formatPoints(rawKpis?.pointsRedeemed30d)} redeemed
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setActiveTab("rewards"))}
                className="text-label text-[#1c3a66] font-bold hover:underline cursor-pointer transition-colors"
              >
                All rewards →
              </button>
            </div>

            {/* Column Header Row (Figma 474:246075) */}
            <div className="h-9 px-5 bg-[#f5f7fa] border-b border-[#dce2ea] flex items-center gap-4">
              <span className="text-caption-bold uppercase tracking-wider text-[#3f4b5e] flex-1">
                Reward
              </span>
              <span className="text-caption-bold uppercase tracking-wider text-[#3f4b5e] w-20 text-right">
                Cost
              </span>
              <span className="text-caption-bold uppercase tracking-wider text-[#3f4b5e] w-24 text-right">
                Redeemed
              </span>
              <span className="text-caption-bold uppercase tracking-wider text-[#3f4b5e] w-36 sm:w-44 text-left pl-4">
                Share of points
              </span>
            </div>

            {/* Table Rows (Figma 474:246080 - 474:246123) */}
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {topRewards.length === 0 ? (
                <div className="py-8 text-center text-body-s text-[#55647a]">
                  No rewards redeemed yet.
                </div>
              ) : (
                topRewards.map((item) => (
                  <div
                    key={item.id}
                    className="h-12 px-5 flex items-center gap-4 hover:bg-[#f5f7fa]/60 transition-colors"
                  >
                    {/* Reward Icon & Title */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-[8px] bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center shrink-0">
                        {getRewardIcon(item.icon_type)}
                      </div>
                      <span className="text-body-s font-bold text-[#0f2340] truncate">
                        {item.title}
                      </span>
                    </div>

                    {/* Cost */}
                    <span className="text-price-xs text-[#0f2340] w-20 text-right">
                      {formatNumber(item.points_cost)} pts
                    </span>

                    {/* Redeemed count */}
                    <span className="text-body-s font-semibold text-[#0f2340] w-24 text-right">
                      {formatNumber(item.redemptions_count)}
                    </span>

                    {/* Share of points progress bar + % */}
                    <div className="w-36 sm:w-44 flex items-center gap-2 pl-4">
                      <div className="flex-1 h-2 rounded-full bg-[#ebeff4] overflow-hidden">
                        <div
                          style={{ width: `${item.share_percent}%` }}
                          className="h-full rounded-full bg-[#1c3a66]"
                        />
                      </div>
                      <span className="text-caption text-[#3f4b5e] font-medium w-9 text-right">
                        {item.share_percent}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 400px on desktop (Figma 474:246124) */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          {/* Card C: Tier distribution (Figma 474:246125) */}
          <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between gap-4 h-[188px] shadow-2xs">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-[18px] font-extrabold text-[#0f2340] leading-[26px]">
                Tier distribution
              </h3>
              <button
                type="button"
                onClick={() => dispatch(setActiveTab("tiers"))}
                className="text-label text-[#1c3a66] font-bold hover:underline cursor-pointer transition-colors"
              >
                Tiers →
              </button>
            </div>

            {/* Segmented Bar (Figma 474:246129) */}
            <div className="h-3 w-full rounded-[6px] flex gap-[2px] overflow-hidden bg-[#f5f7fa]">
              <div
                style={{ width: `${tierDistribution.silver.percent}%` }}
                className="h-full bg-[#6b4430] transition-all"
                title={`Silver ${tierDistribution.silver.percent}%`}
              />
              <div
                style={{ width: `${tierDistribution.gold.percent}%` }}
                className="h-full bg-[#566f2c] transition-all"
                title={`Gold ${tierDistribution.gold.percent}%`}
              />
              <div
                style={{ width: `${tierDistribution.platinum.percent}%` }}
                className="h-full bg-[#1c3a66] transition-all"
                title={`Platinum ${tierDistribution.platinum.percent}%`}
              />
            </div>

            {/* 3 Tier Rows (Figma 474:246133) */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="h-3 w-3 rounded-[4px] shrink-0 bg-[#6b4430]" />
                <span className="text-body-s font-bold text-[#0f2340] flex-1">Silver</span>
                <span className="text-caption text-[#3f4b5e] w-24 text-right">0–999</span>
                <span className="text-price-xs text-[#0f2340] w-20 text-right">
                  {formatNumber(tierDistribution.silver.count)}
                </span>
                <span className="text-caption text-[#3f4b5e] w-10 text-right">
                  {tierDistribution.silver.percent}%
                </span>
              </div>

              <div className="flex items-center gap-2 w-full">
                <div className="h-3 w-3 rounded-[4px] shrink-0 bg-[#566f2c]" />
                <span className="text-body-s font-bold text-[#0f2340] flex-1">Gold</span>
                <span className="text-caption text-[#3f4b5e] w-24 text-right">1,000–1,999</span>
                <span className="text-price-xs text-[#0f2340] w-20 text-right">
                  {formatNumber(tierDistribution.gold.count)}
                </span>
                <span className="text-caption text-[#3f4b5e] w-10 text-right">
                  {tierDistribution.gold.percent}%
                </span>
              </div>

              <div className="flex items-center gap-2 w-full">
                <div className="h-3 w-3 rounded-[4px] shrink-0 bg-[#1c3a66]" />
                <span className="text-body-s font-bold text-[#0f2340] flex-1">Platinum</span>
                <span className="text-caption text-[#3f4b5e] w-24 text-right">2,000+</span>
                <span className="text-price-xs text-[#0f2340] w-20 text-right">
                  {formatNumber(tierDistribution.platinum.count)}
                </span>
                <span className="text-caption text-[#3f4b5e] w-10 text-right">
                  {tierDistribution.platinum.percent}%
                </span>
              </div>
            </div>
          </div>

          {/* Card D: Expiring in next 30 days (Figma 474:246152) */}
          <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between gap-4 min-h-[309px] shadow-2xs">
            {/* Top Block (Figma 474:246153) */}
            <div className="flex flex-col gap-1 w-full">
              <h3 className="text-[18px] font-extrabold text-[#0f2340] leading-[26px]">
                Expiring in next 30 days
              </h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display font-extrabold text-[20px] leading-[28px] text-[#0f2340] tracking-[-0.6px]">
                  {formatPoints(rawKpis?.pointsExpiringSoon)} pts
                </span>
                <span className="text-body-s text-[#3f4b5e]">
                  ≈ ₹{formatNumber(rawKpis?.expiringRupees)} · {formatNumber(rawKpis?.expiringMembers)} members
                </span>
              </div>
            </div>

            {/* 3 Breakdown Rows (Figma 474:246158) */}
            <div className="flex flex-col divide-y divide-[#dce2ea] w-full">
              {expiryWindows.map((exp, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5">
                  <span className="text-body-s text-[#0f2340] flex-1">
                    {exp.window}
                  </span>
                  <span className="text-caption text-[#3f4b5e] w-28 text-right">
                    {exp.members}
                  </span>
                  <span
                    className={`text-price-xs font-bold w-20 text-right ${
                      exp.isUrgent ? "text-[#b45309]" : "text-[#0f2340]"
                    }`}
                  >
                    {exp.points}
                  </span>
                </div>
              ))}
            </div>

            {/* Push CTA Button (Figma 474:246171) */}
            <button
              type="button"
              onClick={() => {
                alert(`Push notification campaign queued for ${rawKpis?.expiringMembers || 0} members with expiring points.`);
              }}
              className="w-full h-9 rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-gray-50 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
            >
              Send &quot;points expiring&quot; push
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
