"use client";

import React from "react";
import { DashboardKpi } from "@/types/dashboard";

interface KpiMetricCardsProps {
  kpi?: DashboardKpi;
}

export function KpiMetricCards({ kpi }: KpiMetricCardsProps) {
  if (!kpi) return null;

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full">
      {/* 1. Net sales today (Dark Navy Card 264px) */}
      <div className="w-full sm:w-[calc(50%-8px)] lg:w-[264px] flex-shrink-0 h-[160px] rounded-[16px] bg-[#0f2340] p-5 flex flex-col justify-between shadow-sm">
        <div>
          <span className="font-sans font-bold text-[14px] leading-[20px] text-[#cde9f9]">
            Net sales today
          </span>
          <div className="font-display font-extrabold text-[40px] leading-[44px] text-white mt-1 tracking-tight">
            {kpi.netSales.formatted}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center">
            <span className="px-2 py-0.5 rounded-[10px] bg-[#163829] text-[#7fd3a2] font-sans font-bold text-[12px] leading-[16px]">
              ▲ {kpi.netSales.changePercent}% {kpi.netSales.changeLabel}
            </span>
          </div>
          <span className="font-sans font-medium text-[12px] leading-[16px] text-[#9fb6d6]">
            {kpi.netSales.targetFormatted}
          </span>
        </div>
      </div>

      {/* 2. Orders (White Card 202px) */}
      <div className="w-full sm:w-[calc(50%-8px)] lg:w-[202px] flex-shrink-0 h-[160px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-sm">
        <div>
          <span className="font-sans font-bold text-[14px] leading-[20px] text-[#3f4b5e]">
            Orders
          </span>
          <div className="font-display font-extrabold text-[32px] leading-[38px] text-[#0f2340] mt-1 tracking-tight">
            {kpi.orders.value.toLocaleString()}
          </div>
        </div>
        <div
          className={`font-sans font-bold text-[12px] leading-[16px] ${
            kpi.orders.value > 0 ? "text-[#1f7a4d]" : "text-[#3f4b5e]"
          }`}
        >
          {kpi.orders.value > 0 ? (
            <>▲ {kpi.orders.changePercent}% · {kpi.orders.liveNow} live now</>
          ) : (
            <>0 orders · 0 live now</>
          )}
        </div>
      </div>

      {/* 3. Avg order value (White Card 202px) */}
      <div className="w-full sm:w-[calc(50%-8px)] lg:w-[202px] flex-shrink-0 h-[160px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-sm">
        <div>
          <span className="font-sans font-bold text-[14px] leading-[20px] text-[#3f4b5e]">
            Avg order value
          </span>
          <div className="font-display font-extrabold text-[32px] leading-[38px] text-[#0f2340] mt-1 tracking-tight">
            {kpi.avgOrderValue.formatted}
          </div>
        </div>
        <div
          className={`font-sans font-bold text-[12px] leading-[16px] ${
            kpi.avgOrderValue.valuePaise > 0 ? "text-[#1f7a4d]" : "text-[#3f4b5e]"
          }`}
        >
          {kpi.avgOrderValue.valuePaise > 0 ? (
            <>▲ {kpi.avgOrderValue.changePercent.toFixed(1)}%</>
          ) : (
            <>0.0%</>
          )}
        </div>
      </div>

      {/* 4. App + kiosk share (White Card 202px) */}
      <div className="w-full sm:w-[calc(50%-8px)] lg:w-[202px] flex-shrink-0 h-[160px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-sm">
        <div>
          <span className="font-sans font-bold text-[14px] leading-[20px] text-[#3f4b5e]">
            App + kiosk share
          </span>
          <div className="font-display font-extrabold text-[32px] leading-[38px] text-[#0f2340] mt-1 tracking-tight">
            {kpi.digitalShare.totalPercent}%
          </div>
        </div>
        <div className="font-sans font-bold text-[12px] leading-[16px] text-[#3f4b5e]">
          App {kpi.digitalShare.appPercent}% · Kiosk {kpi.digitalShare.kioskPercent}%
        </div>
      </div>

      {/* 5. Avg make time (White Card 202px) */}
      <div className="w-full sm:w-[calc(50%-8px)] lg:w-[202px] flex-shrink-0 h-[160px] rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col justify-between shadow-sm">
        <div>
          <span className="font-sans font-bold text-[14px] leading-[20px] text-[#3f4b5e]">
            Avg make time
          </span>
          <div className="font-display font-extrabold text-[32px] leading-[38px] text-[#0f2340] mt-1 tracking-tight">
            {kpi.avgMakeTime.formatted}
          </div>
        </div>
        <div
          className={`font-sans font-bold text-[12px] leading-[16px] ${
            kpi.avgMakeTime.formatted !== "--" ? "text-[#9a5b00]" : "text-[#3f4b5e]"
          }`}
        >
          {kpi.avgMakeTime.formatted !== "--" ? (
            <>▲ {kpi.avgMakeTime.diffFormatted} · target {kpi.avgMakeTime.targetFormatted}</>
          ) : (
            <>Target: {kpi.avgMakeTime.targetFormatted}</>
          )}
        </div>
      </div>
    </div>
  );
}
