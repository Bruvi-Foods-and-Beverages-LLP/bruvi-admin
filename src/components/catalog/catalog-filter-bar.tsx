"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setFilterSearch,
  setFilterCategory,
  setFilterStatus,
  setFilterChannel,
  fetchCatalogProducts,
} from "@/store/slices/catalog-slice";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatusFilterOption, ChannelFilterOption } from "@/types/catalog";

/**
 * Catalog Filter Bar (Figma 225:90303)
 * Height 36px standalone flex container with search, rounded-pill category tabs, and filter dropdowns
 */
export function CatalogFilterBar() {
  const dispatch = useAppDispatch();
  const { filters, categories, isLoading } = useAppSelector(
    (state) => state.catalog
  );

  const [localSearch, setLocalSearch] = React.useState(filters.search || "");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  const [isChannelMenuOpen, setIsChannelMenuOpen] = React.useState(false);

  // Debounced search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setFilterSearch(localSearch));
        dispatch(fetchCatalogProducts({ search: localSearch, page: 1 }));
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  const selectedStatus = filters.status || "ALL";
  const selectedChannel = filters.channel || "ALL";

  return (
    <div className="w-full flex flex-wrap items-center gap-2 select-none">
      {/* 1. Search Input (Figma 225:90304 - w: 217px, h: 36px, r: 12px) */}
      <div className="relative w-full sm:w-[217px] h-9 shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#55647A]" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search name or SKU"
          disabled={isLoading}
          className="w-full h-9 pl-9 pr-3 rounded-[12px] bg-[#f5f7fa] border border-[#7f8ca0] text-[14px] leading-5 text-[#0F2340] placeholder:text-[#7f8ca0] focus:border-[#1C3A66] focus:ring-1 focus:ring-[#1C3A66] transition-all outline-none font-sans disabled:opacity-50"
        />
      </div>

      {/* 2. Category Filter Pills (Figma 225:90312..225:90327 - individual h: 36px, r: 18px pills) */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {isLoading && categories.length === 0 ? (
          <div className="flex items-center gap-1">
            <Skeleton className="h-9 w-16 rounded-[18px] bg-[#ebeff4]" />
            <Skeleton className="h-9 w-24 rounded-[18px] bg-[#ebeff4]" />
            <Skeleton className="h-9 w-20 rounded-[18px] bg-[#ebeff4]" />
          </div>
        ) : (
          categories.map((c) => {
            const isSelected =
              (c.slug === "all" && !filters.category) ||
              filters.category === c.slug;

            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  const nextCat = c.slug === "all" ? undefined : c.slug;
                  dispatch(setFilterCategory(nextCat));
                  dispatch(fetchCatalogProducts({ category: nextCat, page: 1 }));
                }}
                className={cn(
                  "h-9 px-3.5 rounded-[18px] text-[14px] leading-5 font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1 font-sans",
                  isSelected
                    ? "bg-[#0F2340] text-white shadow-2xs"
                    : "bg-white border border-[#dce2ea] text-[#0F2340] hover:bg-[#f5f7fa]"
                )}
              >
                <span>{c.name}</span>
                <span
                  className={cn(
                    "text-[14px] leading-5 font-bold ml-0.5",
                    isSelected ? "text-[#A9D8F3]" : "text-[#55647A]"
                  )}
                >
                  {c.count}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Spacer to push dropdowns right on wide screens */}
      <div className="hidden lg:block flex-1" />

      {/* 3. Status Dropdown (Figma 225:90331 - h: 36px, r: 12px, border: #7f8ca0) */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsStatusMenuOpen(!isStatusMenuOpen);
            setIsChannelMenuOpen(false);
          }}
          className="flex h-9 items-center justify-between gap-2 rounded-[12px] border border-[#7f8ca0] bg-white px-3.5 text-[14px] leading-5 font-bold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer font-sans"
        >
          <span>
            Status:{" "}
            {selectedStatus === "ALL"
              ? "Any"
              : selectedStatus === "HIDDEN_IN_STORE"
              ? "Hidden in store"
              : selectedStatus === "OUT_OF_STOCK"
              ? "Out of stock"
              : selectedStatus === "ACTIVE"
              ? "Active"
              : selectedStatus === "DRAFT"
              ? "Draft"
              : selectedStatus === "ARCHIVED"
              ? "Archived"
              : selectedStatus}
          </span>
          <ChevronDown className="h-4 w-4 text-[#3F4B5E]" />
        </button>

        {isStatusMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-[12px] border border-[#dce2ea] bg-white p-1.5 shadow-floating z-30 font-sans">
            {[
              { key: "ALL", label: "Status: Any" },
              { key: "ACTIVE", label: "Active" },
              { key: "HIDDEN_IN_STORE", label: "Hidden in store" },
              { key: "DRAFT", label: "Draft" },
              { key: "ARCHIVED", label: "Archived" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  const statusVal = item.key as StatusFilterOption;
                  dispatch(setFilterStatus(statusVal));
                  dispatch(fetchCatalogProducts({ status: statusVal, page: 1 }));
                  setIsStatusMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer",
                  selectedStatus === item.key
                    ? "bg-[#1C3A66] text-white"
                    : "text-[#0F2340] hover:bg-[#f5f7fa]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Channel Dropdown (Figma 225:90337 - h: 36px, r: 12px, border: #7f8ca0) */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => {
            setIsChannelMenuOpen(!isChannelMenuOpen);
            setIsStatusMenuOpen(false);
          }}
          className="flex h-9 items-center justify-between gap-2 rounded-[12px] border border-[#7f8ca0] bg-white px-3.5 text-[14px] leading-5 font-bold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer font-sans"
        >
          <span>
            Channel:{" "}
            {selectedChannel === "ALL"
              ? "All"
              : selectedChannel === "COUNTER"
              ? "Counter POS"
              : selectedChannel === "KIOSK"
              ? "Self Kiosk"
              : selectedChannel === "APP"
              ? "Mobile App"
              : "Table QR"}
          </span>
          <ChevronDown className="h-4 w-4 text-[#3F4B5E]" />
        </button>

        {isChannelMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-[12px] border border-[#dce2ea] bg-white p-1.5 shadow-floating z-30 font-sans">
            {[
              { key: "ALL", label: "Channel: All" },
              { key: "COUNTER", label: "Counter POS" },
              { key: "KIOSK", label: "Self Kiosk" },
              { key: "APP", label: "Mobile App" },
              { key: "QR", label: "Table QR Dine-in" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  const channelVal = item.key as ChannelFilterOption;
                  dispatch(setFilterChannel(channelVal));
                  dispatch(fetchCatalogProducts({ channel: channelVal, page: 1 }));
                  setIsChannelMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-[8px] text-[13px] font-semibold transition-colors cursor-pointer",
                  selectedChannel === item.key
                    ? "bg-[#1C3A66] text-white"
                    : "text-[#0F2340] hover:bg-[#f5f7fa]"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
