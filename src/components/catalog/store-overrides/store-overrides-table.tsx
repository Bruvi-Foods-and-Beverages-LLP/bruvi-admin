"use client";

import { Pagination, usePagination } from "@/components/ui/pagination";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setActiveTab,
  deleteStoreOverride,
  fetchStoreOverrides,
  OverrideFilterTab,
} from "@/store/slices/store-overrides-slice";
import { StoreOverride } from "@/types/catalog";
import { AlertCircle, RefreshCw, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StoreOverridesTable() {
  const dispatch = useAppDispatch();
  const { overrides, activeTab, isLoading, error, searchQuery, isSubmitting } =
    useAppSelector((state) => state.storeOverrides);

  // Group and count overrides for tabs
  const now = new Date();

  const counts = React.useMemo(() => {
    let price = 0;
    let availability = 0;
    let expiring = 0;
    let ended = 0;
    let active = 0;

    overrides.forEach((o) => {
      const isEnded = o.effectiveTo && new Date(o.effectiveTo) < now;
      if (isEnded) {
        ended++;
        return;
      }

      active++;
      if (o.overridePricePaise !== null && o.overridePricePaise !== undefined) {
        price++;
      }
      if (!o.isAvailable || o.autoHiddenReason) {
        availability++;
      }
      if (o.effectiveTo) {
        const diffDays =
          (new Date(o.effectiveTo).getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (diffDays >= 0 && diffDays <= 7) {
          expiring++;
        }
      }
    });

    return {
      active,
      price,
      availability,
      expiring,
      ended,
    };
  }, [overrides, now]);

  // Filter overrides based on activeTab and searchQuery
  const filteredOverrides = React.useMemo(() => {
    return overrides.filter((o) => {
      const isEnded = o.effectiveTo && new Date(o.effectiveTo) < now;

      if (activeTab === "ENDED" && !isEnded) return false;
      if (activeTab !== "ENDED" && isEnded) return false;

      if (activeTab === "PRICE" && (o.overridePricePaise === null || o.overridePricePaise === undefined)) {
        return false;
      }
      if (activeTab === "AVAILABILITY" && (o.isAvailable && !o.autoHiddenReason)) {
        return false;
      }
      if (activeTab === "EXPIRING") {
        if (!o.effectiveTo) return false;
        const diffDays =
          (new Date(o.effectiveTo).getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (diffDays < 0 || diffDays > 7) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesProduct = o.products?.name.toLowerCase().includes(q) || o.products?.sku.toLowerCase().includes(q);
        const matchesStore = o.outlets?.name.toLowerCase().includes(q) || o.outlets?.city.toLowerCase().includes(q);
        const matchesReason = o.autoHiddenDetail?.toLowerCase().includes(q);
        if (!matchesProduct && !matchesStore && !matchesReason) return false;
      }

      return true;
    });
  }, [overrides, activeTab, searchQuery, now]);
  const pager = usePagination(filteredOverrides, 10, "overrides");
  const resetPager = pager.reset;
  React.useEffect(() => {
    resetPager();
  }, [activeTab, searchQuery, resetPager]);

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete and end this store override?")) {
      dispatch(deleteStoreOverride(id));
    }
  };

  if (isLoading && overrides.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>
        <div className="w-full rounded-2xl border border-[#dce2ea] bg-white p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && overrides.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-[#fee2e2] bg-[#fef2f2] p-8 text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-[#ef4444]" />
        <h3 className="text-base font-bold text-[#991b1b]">Unable to load store overrides</h3>
        <p className="text-xs text-[#b91c1c] max-w-md">{error}</p>
        <button
          onClick={() => dispatch(fetchStoreOverrides())}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2340] text-white text-xs font-bold hover:bg-[#1c3a66] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const tabs: { label: string; count: number; tab: OverrideFilterTab }[] = [
    { label: "Active", count: counts.active, tab: "ALL" },
    { label: "Price", count: counts.price, tab: "PRICE" },
    { label: "Availability", count: counts.availability, tab: "AVAILABILITY" },
    { label: "Expiring soon", count: counts.expiring, tab: "EXPIRING" },
    { label: "Ended", count: counts.ended, tab: "ENDED" },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Filter Chips (Figma 474:229196) */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.tab;
          return (
            <button
              key={t.tab}
              type="button"
              onClick={() => dispatch(setActiveTab(t.tab))}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
                isActive
                  ? "bg-[#0f2340] text-white"
                  : "bg-white border border-[#dce2ea] text-[#55647a] hover:bg-[#f5f7fa] hover:text-[#0f2340]"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-[#f5f7fa] text-[#55647a]"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Overrides Table (Figma 474:229196) */}
      <div className="w-full rounded-2xl border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="h-12 bg-[#f5f7fa] border-b border-[#dce2ea] text-xs font-semibold text-[#55647a]">
                <th className="py-2 px-5 min-w-[340px]">Override · scope</th>
                <th className="py-2 px-4 min-w-[120px]">Type</th>
                <th className="py-2 px-4 min-w-[140px]">Set by</th>
                <th className="py-2 px-4 min-w-[140px]">Expires</th>
                <th className="py-2 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce2ea]">
              {filteredOverrides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-[#55647a]">
                    No store overrides found for this filter.
                  </td>
                </tr>
              ) : (
                pager.pageItems.map((override) => {
                  const isPriceOverride =
                    override.overridePricePaise !== null &&
                    override.overridePricePaise !== undefined;
                  const isUnavailable = !override.isAvailable || override.autoHiddenReason;

                  // Title formatting
                  let title = override.products?.name || "Product override";
                  if (isPriceOverride) {
                    const priceRupees = Math.round(override.overridePricePaise! / 100);
                    title = `${override.products?.name || "Product"} at ₹${priceRupees}`;
                  } else if (isUnavailable) {
                    title = `${override.products?.name || "Product"} unavailable`;
                  }

                  // Scope subtitle
                  const storeName = override.outlets?.name || "Store";
                  const storeCity = override.outlets?.city || override.city || "";
                  const scopeSubtitle = `${storeName}${storeCity ? ` (${storeCity})` : ""} · all channels`;

                  // Reason line
                  const reasonLine = override.autoHiddenDetail
                    ? `Reason: ${override.autoHiddenDetail}`
                    : override.autoHiddenReason
                    ? `Auto · ${override.autoHiddenReason.toLowerCase().replace(/_/g, " ")}`
                    : "Configured by HQ operations";

                  // Type badge
                  let typeBadgeText = "Price";
                  let typeBadgeClass = "bg-[#e0f2fe] text-[#0369a1]";

                  if (override.autoHiddenReason === "STOCKOUT") {
                    typeBadgeText = "Auto · stock";
                    typeBadgeClass = "bg-[#fef3c7] text-[#b45309]";
                  } else if (isUnavailable) {
                    typeBadgeText = "Availability";
                    typeBadgeClass = "bg-[#f3e8ff] text-[#7e22ce]";
                  } else if (isPriceOverride) {
                    typeBadgeText = "Price";
                    typeBadgeClass = "bg-[#e0f2fe] text-[#0369a1]";
                  }

                  // Expiry
                  let expiryText = "No end · Permanent";
                  if (override.effectiveTo) {
                    const exp = new Date(override.effectiveTo);
                    const diffDays = Math.ceil(
                      (exp.getTime() - now.getTime()) / (1000 * 3600 * 24)
                    );
                    const formatted = exp.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    });
                    expiryText = diffDays > 0 ? `${formatted} · in ${diffDays} days` : `Ended ${formatted}`;
                  }

                  return (
                    <tr
                      key={override.id || `${override.outletId}:${override.productId}`}
                      className="hover:bg-[#f8fafc] transition-colors"
                    >
                      {/* Override · scope */}
                      <td className="py-3 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-[#0f2340]">
                            {title}
                          </span>
                          <span className="text-xs text-[#55647a] font-medium">
                            {scopeSubtitle}
                          </span>
                          <span className="text-[11px] text-[#7f8ca0] font-normal">
                            {reasonLine}
                          </span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${typeBadgeClass}`}
                        >
                          {typeBadgeText}
                        </span>
                      </td>

                      {/* Set by */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-[#0f2340]">Kavya R.</span>
                          <span className="text-[11px] text-[#7f8ca0]">HQ Operations</span>
                        </div>
                      </td>

                      {/* Expires */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#55647a]">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-[#7f8ca0]" />
                          <span>{expiryText}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(override.id)}
                          disabled={isSubmitting}
                          title="Delete override"
                          className="p-1.5 rounded-lg text-[#7f8ca0] hover:text-[#ef4444] hover:bg-[#fee2e2]/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredOverrides.length > 0 && <Pagination {...pager.paginationProps} />}
      </div>
    </div>
  );
}

