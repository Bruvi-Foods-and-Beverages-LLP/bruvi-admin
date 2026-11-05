"use client";

import * as React from "react";
import Link from "next/link";
import { CatalogProduct } from "@/types/catalog";

interface ProductPerformanceCardProps {
  product: CatalogProduct;
}

interface DailyBar {
  day: string;
  heightPx: number;
  isToday?: boolean;
}

const BARS_DATA: DailyBar[] = [
  { day: "Sat", heightPx: 75 },
  { day: "Sun", heightPx: 89 },
  { day: "Mon", heightPx: 83 },
  { day: "Tue", heightPx: 67 },
  { day: "Wed", heightPx: 71 },
  { day: "Thu", heightPx: 80 },
  { day: "Today", heightPx: 96, isToday: true },
];

/**
 * Performance Analytics Card (Figma 225:90992)
 * High-precision KPIs, 7-day volume bar graph, and unit margin economics
 */
export function ProductPerformanceCard({ product }: ProductPerformanceCardProps) {
  // Margin info fallback
  const marginPercent =
    product.grossMarginPercent ||
    (product as any).margin?.grossMarginPercent ||
    80.6;

  const costRupees = (product as any).margin?.estimatedCostPaise
    ? ((product as any).margin.estimatedCostPaise / 100).toFixed(2)
    : "54.20";

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col gap-5 shadow-2xs font-sans">
      {/* 1. Header (Figma 225:90993 - Manrope ExtraBold 18px / 26px) */}
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[18px] leading-[26px] font-extrabold text-[#0F2340]">
          Performance
        </h2>
        <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
          Network · updated 9:41 am
        </span>
      </div>

      {/* 2. Top Metric Banner (Figma 225:90996) */}
      <div className="flex items-end justify-between">
        {/* Left: Sold today number (Archivo ExtraBold 40px) */}
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[14px] leading-5 font-normal text-[#3F4B5E]">
            Sold today
          </span>
          <span className="font-metric text-[40px] leading-[44px] tracking-tight text-[#0F2340]">
            312
          </span>
        </div>

        {/* Right: Growth & Volume share (Manrope Bold 12px & Medium 12px) */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-sans text-[12px] leading-4 font-bold text-[#1F7A4D] tracking-[-0.13px]">
            ▲ 9.9% vs last Fri
          </span>
          <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
            24% of all drinks
          </span>
        </div>
      </div>

      {/* 3. 7-Day Volume Chart (Figma 225:91003 - h: 120px) */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Chart Bars (h: 96px) */}
        <div className="h-24 flex items-end gap-2 w-full">
          {BARS_DATA.map((bar) => (
            <div
              key={bar.day}
              className="flex-1 flex flex-col justify-end items-center h-full"
            >
              <div
                className={`w-full rounded-[4px] transition-all ${bar.isToday ? "bg-[#1C3A66]" : "bg-[#A9D8F3]"
                  }`}
                style={{ height: `${bar.heightPx}px` }}
              />
            </div>
          ))}
        </div>

        {/* Day Labels Row (Manrope Medium 12px, Today is Bold) */}
        <div className="flex items-center gap-2 w-full text-center">
          {BARS_DATA.map((bar) => (
            <span
              key={bar.day}
              className={`flex-1 font-sans text-[12px] leading-4 ${bar.isToday
                  ? "font-bold text-[#0F2340]"
                  : "font-medium text-[#55647A]"
                }`}
            >
              {bar.day}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Performance Breakdown Rows (Figma 225:91027) */}
      <div className="flex flex-col divide-y divide-[#DCE2EA] pt-1">
        {/* Row 1: Gross margin (Figma 225:91028) */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Gross margin
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Cost ₹{costRupees} · recipe v4, Large
            </span>
          </div>
          <span className="font-metric text-[16px] leading-6 tracking-[-0.48px] text-[#0F2340]">
            {marginPercent}%
          </span>
        </div>

        {/* Row 2: Top store (Figma 225:91033) */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Top store
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Indiranagar · 41 sold today
            </span>
          </div>
          <Link
            href="/stores"
            className="font-sans text-[14px] leading-5 font-bold tracking-[-0.24px] text-[#1C3A66] hover:underline cursor-pointer"
          >
            View →
          </Link>
        </div>

        {/* Row 3: Most-picked modifier (Figma 225:91038) */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Most-picked modifier
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Size · Large
            </span>
          </div>
          <span className="font-metric text-[16px] leading-6 tracking-[-0.48px] text-[#0F2340]">
            58%
          </span>
        </div>
      </div>
    </div>
  );
}
