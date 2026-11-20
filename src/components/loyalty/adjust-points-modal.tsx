"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setIsAdjustPointsOpen,
  adjustCustomerPoints,
} from "@/store/slices/loyalty-slice";

/**
 * Manual Points Adjustment Modal (A105)
 * Conforms to modal-level styling with rounded-[20px], Archivo/Manrope tokens,
 * and double-entry ledger security bounds.
 */
export function AdjustPointsModal() {
  const dispatch = useAppDispatch();
  const { isAdjustPointsOpen, isSubmitting } = useAppSelector((state) => state.loyalty);

  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustPoints, setAdjustPoints] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustIsDebited, setAdjustIsDebited] = useState(false);

  if (!isAdjustPointsOpen) return null;

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustUserId.trim() || !adjustPoints || !adjustReason.trim()) return;

    const pointsValue = adjustIsDebited ? -Math.abs(adjustPoints) : Math.abs(adjustPoints);
    await dispatch(
      adjustCustomerPoints({
        userId: adjustUserId,
        points: pointsValue,
        reason: adjustReason,
      }),
    );
    dispatch(setIsAdjustPointsOpen(false));
    setAdjustUserId("");
    setAdjustReason("");
    setAdjustPoints(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[20px] border border-[#dce2ea] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#dce2ea] pb-3">
          <h3 className="text-[18px] font-extrabold text-[#0f2340]">Manual Points Adjustment</h3>
          <button
            type="button"
            onClick={() => dispatch(setIsAdjustPointsOpen(false))}
            className="text-[#7f8ca0] hover:text-[#0f2340] cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAdjustSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-caption-bold text-[#0f2340]">Customer ID / UUID *</label>
            <input
              type="text"
              required
              placeholder="e.g. 01a1a01f-0d31-7788-84c9-..."
              value={adjustUserId}
              onChange={(e) => setAdjustUserId(e.target.value)}
              className="mt-1 w-full h-9 rounded-[12px] border border-[#dce2ea] bg-white px-3 text-caption font-mono text-[#0f2340] focus:outline-none focus:ring-1 focus:ring-[#1c3a66]"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-caption-bold text-[#0f2340]">Operation:</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-caption text-[#0f2340] cursor-pointer">
                <input
                  type="radio"
                  name="adjust_op"
                  checked={!adjustIsDebited}
                  onChange={() => setAdjustIsDebited(false)}
                  className="accent-[#1c3a66]"
                />
                <span className="font-semibold text-[#15803d]">Credit (+)</span>
              </label>
              <label className="flex items-center gap-1.5 text-caption text-[#0f2340] cursor-pointer">
                <input
                  type="radio"
                  name="adjust_op"
                  checked={adjustIsDebited}
                  onChange={() => setAdjustIsDebited(true)}
                  className="accent-rose-500"
                />
                <span className="font-semibold text-rose-600">Debit (−)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-caption-bold text-[#0f2340]">Points Delta *</label>
            <input
              type="number"
              required
              min={1}
              max={5000}
              value={adjustPoints}
              onChange={(e) => setAdjustPoints(parseInt(e.target.value) || 0)}
              className="mt-1 w-full h-9 rounded-[12px] border border-[#dce2ea] bg-white px-3 text-body-s font-bold text-[#0f2340] focus:outline-none focus:ring-1 focus:ring-[#1c3a66]"
            />
            <span className="text-[11px] text-[#55647a] mt-0.5 block">
              Limit: maximum 5,000 points per staff adjustment without executive override.
            </span>
          </div>

          <div>
            <label className="text-caption-bold text-[#0f2340]">Reason & Audit Note *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Goodwill gesture for delayed counter order #C-218"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="mt-1 w-full rounded-[12px] border border-[#dce2ea] bg-white p-3 text-body-s text-[#0f2340] focus:outline-none focus:ring-1 focus:ring-[#1c3a66] resize-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-[#dce2ea] pt-4">
            <button
              type="button"
              onClick={() => dispatch(setIsAdjustPointsOpen(false))}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] bg-white text-label text-[#0f2340] hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !adjustReason.trim()}
              className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-label text-white flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>Post Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

