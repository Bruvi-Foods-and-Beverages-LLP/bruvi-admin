"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { LabBatchItem } from "@/types/lab";

interface LabDetailKpiRowProps {
  batch: LabBatchItem;
}

export function LabDetailKpiRow({ batch }: LabDetailKpiRowProps) {
  const sold = batch.cupsSold || 2340;
  const total = batch.totalCups || 4000;
  const pctSold = total > 0 ? Math.round((sold / total) * 100) : 58;
  const revenueLakhs = ((sold * (batch.pricePaise || 26000)) / 10000000).toFixed(2);
  const rating = batch.rating ?? 4.5;
  const ratingCount = batch.ratingCount || 312;
  const buyAgain = batch.wouldBuyAgainPct ?? 61;
  const promoteBar = 60;
  const diffPromote = buyAgain - promoteBar;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
      {/* 1. Cups Sold */}
      <div className="rounded-[16px] border border-[#dce2ea] bg-white p-4 flex flex-col justify-between min-h-[106px] shadow-2xs">
        <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-semibold">
          CUPS SOLD
        </span>
        <div className="flex items-baseline gap-1.5 my-0.5">
          <span className="text-price-l text-[#0F2340]">
            {sold.toLocaleString()}
          </span>
          <span className="text-caption text-[#55647A]">/ {total.toLocaleString()}</span>
        </div>
        <div className="text-caption text-[#55647A]">{pctSold}% of total cup cap</div>
      </div>

      {/* 2. Revenue */}
      <div className="rounded-[16px] border border-[#dce2ea] bg-white p-4 flex flex-col justify-between min-h-[106px] shadow-2xs">
        <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-semibold">
          REVENUE
        </span>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-price-l text-[#0F2340]">₹{revenueLakhs}L</span>
        </div>
        <div className="text-caption text-[#55647A]">
          @ ₹{Math.round((batch.pricePaise || 26000) / 100)} / cup retail
        </div>
      </div>

      {/* 3. Rating */}
      <div className="rounded-[16px] border border-[#dce2ea] bg-white p-4 flex flex-col justify-between min-h-[106px] shadow-2xs">
        <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-semibold">
          AVG RATING
        </span>
        <div className="flex items-center gap-1.5 my-0.5">
          <Star className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-price-l text-[#0F2340]">{rating.toFixed(1)}</span>
          <span className="text-caption text-[#55647A]">/ 5.0</span>
        </div>
        <div className="text-caption text-[#55647A]">
          {ratingCount.toLocaleString()} ratings (13.3% rate)
        </div>
      </div>

      {/* 4. Would Buy Again */}
      <div className="rounded-[16px] border border-[#dce2ea] bg-white p-4 flex flex-col justify-between min-h-[106px] shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-semibold">
            BUY AGAIN
          </span>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] ${
              diffPromote >= 0
                ? "bg-[#DCFCE7] text-[#15803D]"
                : "bg-[#FEF3E2] text-[#B45309]"
            }`}
          >
            {diffPromote >= 0 ? `+${diffPromote}%` : `${diffPromote}%`}
          </span>
        </div>
        <div className="flex items-baseline my-0.5">
          <span className="text-price-l text-[#0F2340]">{buyAgain}%</span>
        </div>
        <div className="text-caption text-[#15803D] font-medium">
          Passes 60% promote bar
        </div>
      </div>

      {/* 5. Pilot Window Days Left */}
      <div className="rounded-[16px] border border-[#dce2ea] bg-white p-4 flex flex-col justify-between min-h-[106px] shadow-2xs col-span-2 sm:col-span-1">
        <span className="text-overline tracking-[1.54px] text-[#55647A] uppercase font-semibold">
          PILOT WINDOW
        </span>
        <div className="flex items-baseline gap-1 my-0.5">
          <span className="text-price-l text-[#0F2340]">7 days</span>
          <span className="text-caption text-[#55647A]">left</span>
        </div>
        <div className="text-caption text-[#55647A]">
          Day 8 of 15 · Ends 10 Oct
        </div>
      </div>
    </div>
  );
}

