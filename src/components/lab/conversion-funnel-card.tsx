"use client";

import * as React from "react";
import { Filter, ArrowDown } from "lucide-react";
import { ConversionFunnelStage } from "@/types/lab";

interface ConversionFunnelCardProps {
  stages: ConversionFunnelStage[];
  batchName?: string;
}

export function ConversionFunnelCard({
  stages,
  batchName = "Batch 07",
}: ConversionFunnelCardProps) {
  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#dce2ea]">
        <div>
          <h3 className="text-title text-[#0F2340]">
            Conversion funnel ({batchName})
          </h3>
          <p className="text-caption text-[#55647A]">
            Cross-channel customer journey from discovery to repeat order
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-[#E8F5FD] text-[#1C3A66] flex items-center justify-center">
          <Filter className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {stages.map((stage, idx) => {
          const widthPct = Math.max(stage.pct, 14);
          const isReorder = stage.stage === "Re-ordered";
          const isTried = stage.stage === "Tried";

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-caption">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0F2340] text-body-s">
                    {stage.stage}
                  </span>
                  <span className="text-[12px] text-[#7F8CA0]">· {stage.label}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-price-xs text-[#0F2340]">
                    {stage.count.toLocaleString()}
                  </span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-[4px] ${
                      isReorder
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#F5F7FA] text-[#55647A] border border-[#dce2ea]"
                    }`}
                  >
                    {stage.pct}%
                  </span>
                </div>
              </div>

              {/* Funnel Step Bar */}
              <div className="w-full bg-[#F5F7FA] h-7 rounded-[8px] border border-[#EBEFF4] overflow-hidden p-0.5 flex">
                <div
                  className={`h-full rounded-[6px] transition-all duration-500 flex items-center px-3 ${
                    isReorder
                      ? "bg-[#566F2C] text-white"
                      : isTried
                      ? "bg-[#1C3A66] text-white"
                      : "bg-[#6F8DB5] text-white"
                  }`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="text-[11px] font-bold tracking-wider uppercase">
                    {stage.pct}%
                  </span>
                </div>
              </div>

              {/* Conversion transition indicator */}
              {idx < stages.length - 1 && (
                <div className="flex items-center justify-center py-0.5 text-[11px] text-[#7F8CA0]">
                  <ArrowDown className="h-3 w-3 stroke-[2]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

