"use client";

import * as React from "react";
import { StoreOverviewMetrics } from "@/store/slices/stores-slice";

interface HourlySalesChartProps {
  hourlySales: StoreOverviewMetrics["hourlySales"];
  peakHour: string;
  peakSales: number;
  channelBreakdown: StoreOverviewMetrics["channelBreakdown"];
}

export function HourlySalesChart({
  hourlySales,
  peakHour,
  peakSales,
  channelBreakdown,
}: HourlySalesChartProps) {
  const maxSales = Math.max(...hourlySales.map((h) => h.actualSales), 1);

  return (
    <div className="flex flex-col gap-5 p-[21px] rounded-[16px] bg-surface border border-border shadow-sm">
      {/* Header Row (Figma Node 225:86642) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col">
          <h3 className="text-title text-text">
            Today by hour
          </h3>
          <p className="text-caption text-text-muted">
            {peakSales > 0 ? (
              <>Net sales · peak {peakHour} ₹{peakSales.toLocaleString("en-IN")}</>
            ) : (
              <>Net sales · awaiting orders today</>
            )}
          </p>
        </div>

        {/* Legend (Figma Node 225:86646) */}
        <div className="flex items-center gap-4 text-caption text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[2px] bg-primary" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[2px] bg-border" />
            <span>Forecast</span>
          </div>
        </div>
      </div>

      {/* Hourly Bar Chart Area (Figma Node 225:86653) */}
      <div className="flex flex-col gap-2">
        {/* Bars Container */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 border-b border-border pb-0.5 pt-4">
          {hourlySales.map((h, idx) => {
            const heightPercent = Math.max((h.actualSales / maxSales) * 100, 3);
            const isZero = h.actualSales === 0;

            return (
              <div
                key={idx}
                className="group relative flex-1 flex flex-col items-center justify-end h-full"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-9 z-20 hidden group-hover:flex flex-col items-center pointer-events-none transition-all">
                  <div className="bg-navy-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                    {h.hour}: ₹{h.actualSales.toLocaleString("en-IN")}
                  </div>
                  <div className="w-1.5 h-1.5 bg-navy-900 rotate-45 -mt-0.5" />
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[32px] rounded-t transition-all ${
                    isZero
                      ? "bg-[#eef2f6]"
                      : "bg-primary hover:bg-navy-900"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Hour Labels (Figma Node 225:86672) */}
        <div className="flex justify-between text-caption text-text-muted px-1 select-none">
          <span>6 am</span>
          <span className="hidden sm:inline">9 am</span>
          <span>12 pm</span>
          <span className="hidden sm:inline">3 pm</span>
          <span>6 pm</span>
          <span className="hidden sm:inline">9 pm</span>
          <span>11 pm</span>
        </div>
      </div>

      {/* Channel Breakdown Footer (Figma Node 225:86680) */}
      <div className="border-t border-border pt-[17px] flex flex-wrap items-center gap-6 md:gap-8">
        {/* Counter */}
        <div className="flex flex-col">
          <span className="text-caption text-text-muted">Counter</span>
          <span className="text-price-s text-text">
            {channelBreakdown.counter.count} · ₹{channelBreakdown.counter.sales.toLocaleString("en-IN")}
          </span>
        </div>

        {/* App Pickup */}
        <div className="flex flex-col">
          <span className="text-caption text-text-muted">App pickup</span>
          <span className="text-price-s text-text">
            {channelBreakdown.appPickup.count} · ₹{channelBreakdown.appPickup.sales.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Kiosk */}
        <div className="flex flex-col">
          <span className="text-caption text-text-muted">Kiosk</span>
          <span className="text-price-s text-text">
            {channelBreakdown.kiosk.count} · ₹{channelBreakdown.kiosk.sales.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Dine-in QR */}
        <div className="flex flex-col">
          <span className="text-caption text-text-muted">Dine-in QR</span>
          <span className="text-price-s text-text">
            {channelBreakdown.dineInQr.count} · ₹{channelBreakdown.dineInQr.sales.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
