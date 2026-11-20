"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { LabOverviewStats, LabBatchItem } from "@/types/lab";

interface LabOverviewKpiRowProps {
  stats?: LabOverviewStats;
  liveBatch?: LabBatchItem | null;
}

export function LabOverviewKpiRow({ stats, liveBatch }: LabOverviewKpiRowProps) {
  const soldCount = stats?.batchSold ?? (liveBatch?.cupsSold ?? 2340);
  const totalCups = liveBatch?.totalCups ?? 4000;
  const avgRating = stats?.avgRating ?? (liveBatch?.rating ?? 4.5);
  const totalRatings = stats?.totalRatings ?? (liveBatch?.ratingCount ?? 812);
  const wouldBuyAgain = stats?.wouldBuyAgainPct ?? (liveBatch?.wouldBuyAgainPct ?? 61);
  const vsPreviousPct = stats?.vsPreviousPct ?? 18;

  // Resolve image for live batch card
  const rawImage = liveBatch?.imagePath || "/images/bruvi_lab_tonic.png";
  const imageSrc = rawImage.startsWith("assets/")
    ? rawImage.replace(/^assets\//, "/")
    : rawImage.startsWith("/")
    ? rawImage
    : `/images/${rawImage}`;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* 1. Live Now Featured Card (Figma 474:244411) - Exact width 333px */}
      <Link
        href={liveBatch ? `/lab/${liveBatch.id}` : "/lab"}
        className="w-full lg:w-[333px] shrink-0 rounded-[16px] bg-[#EBF1DE] p-[16px_20px] flex items-center gap-4 transition-transform hover:scale-[1.01] shadow-2xs group"
      >
        <div className="h-14 w-14 rounded-[12px] bg-white/70 overflow-hidden shrink-0 flex items-center justify-center border border-[#566F2C]/20 relative">
          <Image
            src={imageSrc}
            alt={liveBatch?.name || "Live Lab Drink"}
            width={56}
            height={56}
            className="object-contain w-full h-full p-1"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/menu/matcha_latte.jpg";
            }}
          />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-label font-bold text-[#566F2C] whitespace-nowrap">
            {liveBatch?.batchNumber ? `Live now · Batch ${liveBatch.batchNumber}` : "Live now · Batch 07"}
          </span>
          <span className="text-heading-s font-extrabold text-[#0F2340] leading-tight truncate">
            {liveBatch?.name || "Yuzu Matcha Tonic"}
          </span>
          <span className="text-caption font-medium text-[#3F4B5E] whitespace-nowrap">
            Day 7 of 15 · ends Sat 10 Oct · {liveBatch?.storesCount ?? 6} stores
          </span>
        </div>
      </Link>

      {/* 2. Batch Sold KPI (Figma 474:244417) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs">
        <span className="text-label font-bold text-[#3F4B5E]">
          {liveBatch?.batchNumber ? `Batch ${liveBatch.batchNumber} sold` : "Batch 07 sold"}
        </span>
        <div className="text-price-l text-[#0F2340] tracking-[-0.96px] leading-[38px] my-0.5">
          {soldCount.toLocaleString()}
        </div>
        <div className="text-caption font-bold text-[#1F7A4D]">
          ▲ {vsPreviousPct}% vs Batch 06 at day 7
        </div>
      </div>

      {/* 3. Avg Rating KPI (Figma 474:244421) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs">
        <span className="text-label font-bold text-[#3F4B5E]">Avg rating</span>
        <div className="text-price-l text-[#0F2340] tracking-[-0.96px] leading-[38px] my-0.5">
          {avgRating.toFixed(1)}
        </div>
        <div className="text-caption font-medium text-[#3F4B5E]">
          {totalRatings.toLocaleString()} ratings · Batch 06 4.2
        </div>
      </div>

      {/* 4. Would Buy Again KPI (Figma 474:244425) */}
      <div className="flex-1 min-w-0 rounded-[16px] border border-[#DCE2EA] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs">
        <span className="text-label font-bold text-[#3F4B5E]">Would buy again</span>
        <div className="text-price-l text-[#0F2340] tracking-[-0.96px] leading-[38px] my-0.5">
          {wouldBuyAgain}%
        </div>
        <div className="text-caption font-medium text-[#3F4B5E]">
          Promote bar: 60%
        </div>
      </div>
    </div>
  );
}

