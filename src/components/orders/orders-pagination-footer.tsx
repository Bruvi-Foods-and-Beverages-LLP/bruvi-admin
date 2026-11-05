"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setPage, fetchOrders } from "@/store/slices/orders-slice";

export function OrdersPaginationFooter() {
  const dispatch = useAppDispatch();
  const { total, page, limit, orders } = useAppSelector((state) => state.orders);

  const startRecord = orders.length > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, total);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      dispatch(setPage(newPage));
      dispatch(fetchOrders({ page: newPage }));
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      dispatch(setPage(newPage));
      dispatch(fetchOrders({ page: newPage }));
    }
  };

  return (
    <div className="w-full h-12 px-5 flex items-center justify-between border-t border-[#dce2ea] bg-white select-none">
      {/* Left: Summary Note (Figma 225:101312) */}
      <span className="text-caption text-text-secondary">
        {startRecord}–{endRecord} of {total.toLocaleString("en-IN")} orders · newest first · auto-refresh every 10 s
      </span>

      {/* Right: Controls (Figma 225:154095) */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page <= 1}
          className="text-label text-[#55647a] hover:text-[#0f2340] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={page >= totalPages}
          className="text-label text-[#1c3a66] hover:text-[#0f2340] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

