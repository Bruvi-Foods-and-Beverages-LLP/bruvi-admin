"use client";

import * as React from "react";
import { X, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setBulkAdjustOpen, applyBulkAdjust } from "@/store/slices/pricing-slice";

export function BulkAdjustModal() {
  const dispatch = useAppDispatch();
  const { isBulkAdjustOpen, products } = useAppSelector((state) => state.pricing);

  const [priceList, setPriceList] = React.useState<string>("mumbai");
  const [adjustText, setAdjustText] = React.useState<string>("+₹10");
  const [applyScope, setApplyScope] = React.useState<"DRINKS" | "BITES" | "SELECTED" | "ALL">("DRINKS");

  if (!isBulkAdjustOpen) return null;

  const drinksCount = products.filter(
    (p) => !p.categoryName?.toLowerCase().includes("bite") && !p.categoryName?.toLowerCase().includes("food")
  ).length;
  const bitesCount = products.length - drinksCount;

  const handleApply = () => {
    let adjustType: "ADD_FLAT" | "PERCENTAGE" = "ADD_FLAT";
    let adjustValue = 0;

    const trimmed = adjustText.trim();
    if (trimmed.includes("%")) {
      adjustType = "PERCENTAGE";
      adjustValue = parseFloat(trimmed.replace(/[^0-9.-]/g, "")) || 0;
      if (trimmed.startsWith("-")) adjustValue = -Math.abs(adjustValue);
    } else {
      adjustType = "ADD_FLAT";
      adjustValue = parseFloat(trimmed.replace(/[^0-9.-]/g, "")) || 0;
      if (trimmed.startsWith("-")) adjustValue = -Math.abs(adjustValue);
    }

    dispatch(
      applyBulkAdjust({
        targetColumn: priceList,
        adjustType,
        adjustValue,
        applyScope,
      })
    );
    dispatch(setBulkAdjustOpen(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl border border-[#dce2ea] flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f2340] tracking-tight">Bulk adjust</h2>
          <button
            onClick={() => dispatch(setBulkAdjustOpen(false))}
            className="p-1 rounded-lg text-[#55647a] hover:bg-[#f5f7fa] hover:text-[#0f2340] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="flex flex-col gap-4">
          {/* 1. Price List */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Price list
            </label>
            <select
              value={priceList}
              onChange={(e) => setPriceList(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] bg-white text-sm text-[#0f2340] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0f2340]/20"
            >
              <option value="mumbai">Mumbai</option>
              <option value="base">Base (All stores)</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="delhi">Delhi NCR</option>
              <option value="kiosk">Kiosk</option>
              <option value="app">App</option>
            </select>
          </div>

          {/* 2. Adjust By */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Adjust by
            </label>
            <input
              type="text"
              value={adjustText}
              onChange={(e) => setAdjustText(e.target.value)}
              placeholder="+₹10 or +5%"
              className="w-full h-10 px-3 rounded-xl border border-[#7f8ca0] bg-white text-sm text-[#0f2340] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0f2340]/20"
            />
          </div>

          {/* 3. Apply to scope */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#55647a] uppercase tracking-wider">
              Apply to
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#f5f7fa] rounded-xl border border-[#dce2ea]">
              <button
                type="button"
                onClick={() => setApplyScope("DRINKS")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  applyScope === "DRINKS"
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "text-[#55647a] hover:text-[#0f2340]"
                }`}
              >
                Drinks · {drinksCount}
              </button>
              <button
                type="button"
                onClick={() => setApplyScope("BITES")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  applyScope === "BITES"
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "text-[#55647a] hover:text-[#0f2340]"
                }`}
              >
                Bites · {bitesCount}
              </button>
              <button
                type="button"
                onClick={() => setApplyScope("ALL")}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  applyScope === "ALL"
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "text-[#55647a] hover:text-[#0f2340]"
                }`}
              >
                All · {products.length}
              </button>
            </div>
          </div>

          {/* Preview Card (Figma 474:229036) */}
          <div className="rounded-xl bg-[#fffbeb] border border-[#fef3c7] p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#b45309]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {adjustText} to {priceList.charAt(0).toUpperCase() + priceList.slice(1)} ·{" "}
                {applyScope === "DRINKS" ? drinksCount : applyScope === "BITES" ? bitesCount : products.length}{" "}
                products
              </span>
            </div>
            <p className="text-xs text-[#92400e] leading-relaxed">
              Updates active prices in grid. Preview and publish when ready.
            </p>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => dispatch(setBulkAdjustOpen(false))}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#55647a] hover:bg-[#f5f7fa] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#0f2340] text-white hover:bg-[#1c3a66] transition-colors shadow-2xs"
          >
            Apply to grid
          </button>
        </div>
      </div>
    </div>
  );
}

