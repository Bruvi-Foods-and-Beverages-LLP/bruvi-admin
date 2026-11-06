"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTab, fetchOrders } from "@/store/slices/orders-slice";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import { OrdersApi } from "@/lib/api/orders";

export function OrdersPageHeader() {
  const dispatch = useAppDispatch();
  const { counts, updatedAt, filters } = useAppSelector((state) => state.orders);

  const handleExport = () => {
    const exportUrl = OrdersApi.getExportUrl(filters);
    window.open(exportUrl, "_blank");
  };

  const handleDelayedClick = () => {
    if (filters.tab === "DELAYED") {
      dispatch(setTab("ALL"));
      dispatch(fetchOrders({ tab: "ALL" }));
    } else {
      dispatch(setTab("DELAYED"));
      dispatch(fetchOrders({ tab: "DELAYED" }));
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      {/* Left: Overline & Title with 41 live badge */}
      <div className="flex flex-col gap-1">
        <span className="text-overline-l text-text-secondary uppercase">
          Live · updated {updatedAt}
        </span>
        <div className="flex items-center gap-3">
          <h1 className="text-display-s font-display font-black text-[#0f2340] tracking-[-1.2px]">
            Orders
          </h1>
          {/* 41 Live Badge with Pulse Dot (Figma 225:101137) */}
          <div className="inline-flex h-6 items-center gap-1.5 rounded-[12px] bg-[#e3f4ea] px-2 text-caption-bold text-[#1f7a4d] select-none font-sans [font-variation-settings:'wght'_700]">
            <span className="h-2 w-2 rounded-full bg-[#1f7a4d] animate-pulse" />
            <span>{(counts?.live ?? 0).toLocaleString("en-IN")} live</span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Figma 225:101140) */}
      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
        {/* Export Button (Figma 225:101141) */}
        <button
          type="button"
          onClick={handleExport}
          className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs font-sans [font-variation-settings:'wght'_700]"
        >
          <Download className="h-4 w-4 text-[#55647a]" />
          <span>Export</span>
        </button>

        {/* Delayed Orders Filter Button (Figma 225:101143) */}
        <button
          type="button"
          onClick={handleDelayedClick}
          className={cn(
            "h-9 px-4 rounded-[12px] text-label text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs font-sans [font-variation-settings:'wght'_700]",
            filters.tab === "DELAYED"
              ? "bg-[#c0352b] ring-2 ring-[#c0352b]/30"
              : "bg-[#1c3a66] hover:bg-[#0f2340]"
          )}
        >
          <span>Delayed orders · {(counts?.delayed ?? 0).toLocaleString("en-IN")}</span>
        </button>
      </div>
    </div>
  );
}

