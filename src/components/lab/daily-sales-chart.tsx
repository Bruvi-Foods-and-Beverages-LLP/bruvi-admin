"use client";

import * as React from "react";
import { DailySalesMetric } from "@/types/lab";

interface DailySalesChartProps {
  data?: DailySalesMetric[];
  previousBatchLabel?: string;
  currentBatchLabel?: string;
}

const DEFAULT_SALES: DailySalesMetric[] = [
  { dayLabel: "Sat 26", cupsSold: 280, previousBatchCups: 240, isToday: false },
  { dayLabel: "Sun 27", cupsSold: 360, previousBatchCups: 310, isToday: false },
  { dayLabel: "Mon 28", cupsSold: 290, previousBatchCups: 260, isToday: false },
  { dayLabel: "Tue 29", cupsSold: 340, previousBatchCups: 280, isToday: false },
  { dayLabel: "Wed 30", cupsSold: 320, previousBatchCups: 270, isToday: false },
  { dayLabel: "Thu 1", cupsSold: 350, previousBatchCups: 300, isToday: false },
  { dayLabel: "Today", cupsSold: 400, previousBatchCups: 320, isToday: true },
];

export function DailySalesChart({
  data = DEFAULT_SALES,
  previousBatchLabel = "Batch 06",
  currentBatchLabel = "Batch 07",
}: DailySalesChartProps) {
  const maxCups = Math.max(
    ...data.map((d) => Math.max(d.cupsSold, d.previousBatchCups)),
    450
  );

  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#dce2ea]">
        <div>
          <h3 className="text-title text-[#0F2340]">
            Sales by day vs {previousBatchLabel}
          </h3>
          <p className="text-caption text-[#15803D] font-bold">
            55.7 cups / store / day (+238% vs {previousBatchLabel})
          </p>
        </div>

        <div className="flex items-center gap-4 text-[12px] text-[#55647A]">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-[#1C3A66]" />
            <span className="font-semibold text-[#0F2340]">{currentBatchLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-[#DCE2EA]" />
            <span>{previousBatchLabel}</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-52 w-full pt-4 pb-2 flex items-end justify-between gap-3 sm:gap-6 border-b border-[#EBEFF4]">
        {data.map((item, idx) => {
          const currentHeightPct = Math.round((item.cupsSold / maxCups) * 100);
          const prevHeightPct = Math.round((item.previousBatchCups / maxCups) * 100);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 z-10 bg-[#0F2340] text-white text-[11px] font-semibold py-1 px-2 rounded-[6px] pointer-events-none whitespace-nowrap shadow-md">
                {item.cupsSold} cups ({item.previousBatchCups} prev)
              </div>

              {/* Bars Pair */}
              <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                {/* Previous Batch Bar */}
                <div
                  className="w-1/2 max-w-[20px] bg-[#DCE2EA] rounded-t-[4px] transition-all duration-300"
                  style={{ height: `${prevHeightPct}%` }}
                />
                {/* Current Batch Bar */}
                <div
                  className={`w-1/2 max-w-[20px] rounded-t-[4px] transition-all duration-300 ${
                    item.isToday
                      ? "bg-[#566F2C] group-hover:bg-[#435921]"
                      : "bg-[#1C3A66] group-hover:bg-[#0F2340]"
                  }`}
                  style={{ height: `${currentHeightPct}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[11px] font-semibold ${
                  item.isToday ? "text-[#566F2C] font-bold" : "text-[#55647A]"
                }`}
              >
                {item.dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

