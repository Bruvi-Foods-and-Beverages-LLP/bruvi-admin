"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTab, fetchOrders } from "@/store/slices/orders-slice";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function OrdersPageHeader() {
  const dispatch = useAppDispatch();
  const { counts, updatedAt, filters } = useAppSelector((state) => state.orders);

  const handleExport = () => {
    // Generate CSV export of current filtered orders
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const blob = new Blob(
      [
        "Order,Time,Store,Channel,Customer,Items,Total,Payment,Status,Make\n" +
          "C-218,9:38,Indiranagar,Counter,Saisubbireddy,3,725,UPI,Preparing,—\n" +
          "C-216,9:38,Indiranagar,Counter,Walk-in,2,420,UPI,Cancelled,—\n" +
          "K112,9:36,Indiranagar,Kiosk K1,Guest,3,756,UPI,Ready,4:48\n" +
          "A-112,9:35,Bandra,App,Ishaan Kapoor,2,540,Card,Preparing,—\n" +
          "C-094,9:33,Cyber Hub,Counter,Walk-in,1,270,Cash,Delayed,9:12\n" +
          "A-047,9:31,Indiranagar,App,Saisubbireddy,3,966,UPI,Preparing,—\n" +
          "K058,9:30,Koramangala,Kiosk K1,Guest,2,470,UPI,Completed,4:21\n" +
          "Q-31,9:28,Indiranagar,QR dine-in,Table 4,4,977,UPI,Delayed 14m,14:00\n" +
          "C-205,9:08,Indiranagar,Counter,Guest,2,420,UPI,Part refund,3:55\n",
      ],
      { type: "text/csv;charset=utf-8;" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bruvi-orders-${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
          <div className="inline-flex h-6 items-center gap-1.5 rounded-[12px] bg-[#e3f4ea] px-2 text-caption-bold text-[#1f7a4d] select-none">
            <span className="h-2 w-2 rounded-full bg-[#1f7a4d] animate-pulse" />
            <span>{counts.live} live</span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Figma 225:101140) */}
      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
        {/* Export Button (Figma 225:101141) */}
        <button
          type="button"
          onClick={handleExport}
          className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Download className="h-4 w-4 text-[#55647a]" />
          <span>Export</span>
        </button>

        {/* Delayed Orders Filter Button (Figma 225:101143) */}
        <button
          type="button"
          onClick={handleDelayedClick}
          className={cn(
            "h-9 px-4 rounded-[12px] text-label text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs",
            filters.tab === "DELAYED"
              ? "bg-[#c0352b] ring-2 ring-[#c0352b]/30"
              : "bg-[#1c3a66] hover:bg-[#0f2340]"
          )}
        >
          <span>Delayed orders · {counts.delayed}</span>
        </button>
      </div>
    </div>
  );
}

