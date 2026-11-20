"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  discardChanges,
  publishPricingChanges,
} from "@/store/slices/pricing-slice";
import { Loader2 } from "lucide-react";

export function PricingBottomBar() {
  const dispatch = useAppDispatch();
  const { changedCells, products, isSubmitting } = useAppSelector(
    (state) => state.pricing
  );

  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0]
  );

  const changes = Object.entries(changedCells);
  const changesCount = changes.length;

  if (changesCount === 0) return null;

  // Build summary string (e.g. "Iced Matcha base ₹270 · Bánh Mì Paneer Mumbai ₹230 · Phin Đen App ₹160")
  const summaryParts = changes.slice(0, 3).map(([key, newPrice]) => {
    const [productId, columnKey] = key.split(":");
    const product = products.find((p) => p.id === productId);
    const colName =
      columnKey === "base"
        ? "base"
        : columnKey === "mumbai"
        ? "Mumbai"
        : columnKey === "bengaluru"
        ? "BLR"
        : columnKey === "delhi"
        ? "Delhi"
        : columnKey;
    return `${product?.name || "Product"} ${colName} ₹${newPrice}`;
  });

  const summaryText =
    summaryParts.join(" · ") + (changesCount > 3 ? ` · +${changesCount - 3} more` : "");

  const handlePublish = async () => {
    await dispatch(publishPricingChanges({ isScheduled: false }));
  };

  const handleScheduleSubmit = async () => {
    await dispatch(
      publishPricingChanges({
        isScheduled: true,
        scheduledDate: new Date(scheduleDate).toISOString(),
      })
    );
    setIsScheduleOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[1072px] bg-[#0f2340] text-white rounded-2xl px-5 py-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-200 border border-white/10">
        {/* Left Info: Badge, Count, and Summary */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ffedd5] text-[#b45309] font-extrabold text-xs shrink-0">
            {changesCount}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
            <span className="text-sm font-bold text-white shrink-0">
              {changesCount} {changesCount === 1 ? "change" : "changes"}
            </span>
            <span className="hidden sm:inline text-white/40">·</span>
            <span className="text-xs text-white/80 truncate font-medium">
              {summaryText}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => dispatch(discardChanges())}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 transition-colors disabled:opacity-50"
          >
            Schedule
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-[#22c55e] text-[#0f2340] hover:bg-[#16a34a] hover:text-white transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Publish
          </button>
        </div>
      </div>

      {/* Schedule Dialog */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#dce2ea] flex flex-col gap-4">
            <h3 className="text-base font-bold text-[#0f2340]">Schedule price update</h3>
            <p className="text-xs text-[#55647a]">
              Choose the effective date for these {changesCount} price changes to roll out across menus.
            </p>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] text-sm text-[#0f2340]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#55647a]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#0f2340] text-white"
              >
                Confirm schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

