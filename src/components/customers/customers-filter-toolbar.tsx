"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setFilter,
  resetFilters,
  fetchCustomers,
} from "@/store/slices/customers-slice";
import { CustomerSegment } from "@/types/customers";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Customers Filter Toolbar (Figma 225:103365)
 * Search input, Segment pills, Tier dropdown, Clear button
 */
export function CustomersFilterToolbar() {
  const dispatch = useAppDispatch();
  const { filters, segments } = useAppSelector((state) => state.customers);
  const [searchValue, setSearchValue] = React.useState(filters.q || "");

  // Sync internal search input with store
  React.useEffect(() => {
    setSearchValue(filters.q || "");
  }, [filters.q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({ key: "q", value: searchValue }));
    dispatch(fetchCustomers({ q: searchValue, page: 1 }));
  };

  const handleSegmentChange = (segment: CustomerSegment) => {
    dispatch(setFilter({ key: "segment", value: segment }));
    dispatch(fetchCustomers({ segment, page: 1 }));
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tier = e.target.value;
    dispatch(setFilter({ key: "tier", value: tier }));
    dispatch(fetchCustomers({ tier, page: 1 }));
  };

  const handleClear = () => {
    setSearchValue("");
    dispatch(resetFilters());
    dispatch(fetchCustomers({ q: "", segment: "all", tier: "Any", page: 1 }));
  };

  const segmentButtons: { id: CustomerSegment; title: string; countText: string }[] = [
    {
      id: "all",
      title: "All",
      countText: "",
    },
    {
      id: "new",
      title: "New",
      countText: segments?.new?.percentage ?? "",
    },
    {
      id: "regulars",
      title: "Regulars",
      countText: segments?.regulars?.percentage ?? "",
    },
    {
      id: "lapsed",
      title: "Lapsed 45d",
      countText: segments?.lapsed?.percentage ?? "",
    },
    {
      id: "club",
      title: "BRUVI Club",
      countText: segments?.club?.label ?? "",
    },
  ];

  return (
    <div className="w-full h-auto sm:h-[60px] px-5 py-3 border-b border-[#dce2ea] flex flex-wrap items-center justify-between gap-3 bg-white">
      {/* Left side: Search & Segment Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Bar (Figma 225:103366) */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="w-[320px] h-9 px-3 bg-[#f5f7fa] rounded-[12px] flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#1c3a66]/20 transition-all">
            <Search className="h-4 w-4 text-[#55647a] shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={() => {
                if (searchValue !== (filters.q || "")) {
                  dispatch(setFilter({ key: "q", value: searchValue }));
                  dispatch(fetchCustomers({ q: searchValue, page: 1 }));
                }
              }}
              placeholder="Name, phone, email or CUST ID"
              className="w-full bg-transparent border-none outline-none font-sans font-normal text-[14px] leading-5 text-[#0f2340] placeholder:text-[#55647a] [font-variation-settings:'wght'_400]"
            />
          </div>
        </form>

        {/* Segment Pills (Figma 225:103374 - 225:103385) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {segmentButtons.map((btn) => {
            const isActive = filters.segment === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleSegmentChange(btn.id)}
                className={cn(
                  "h-9 px-3 rounded-[18px] text-[14px] leading-5 font-sans font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer select-none [font-variation-settings:'wght'_700]",
                  isActive
                    ? "bg-[#0f2340] text-white shadow-2xs"
                    : "bg-white border border-[#dce2ea] text-[#0f2340] hover:bg-[#f5f7fa]"
                )}
              >
                <span>{btn.title}</span>
                {btn.countText && (
                  <span
                    className={cn(
                      "font-sans font-normal text-[13px] [font-variation-settings:'wght'_400]",
                      isActive ? "text-white/80" : "text-[#55647a]"
                    )}
                  >
                    {btn.countText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Tier Dropdown & Clear Button (Figma 225:103388 & 225:103395) */}
      <div className="flex items-center gap-3">
        {/* Tier dropdown */}
        <div className="relative">
          <select
            value={filters.tier}
            onChange={handleTierChange}
            className="h-9 pl-3 pr-8 rounded-[12px] border border-[#7f8ca0] bg-white text-[14px] font-sans font-bold text-[#0f2340] appearance-none cursor-pointer outline-none hover:border-[#0f2340] transition-colors [font-variation-settings:'wght'_700]"
          >
            <option value="Any">Tier: Any</option>
            <option value="Platinum">Tier: Platinum</option>
            <option value="Gold">Tier: Gold</option>
            <option value="Silver">Tier: Silver</option>
            <option value="Bronze">Tier: Bronze</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3f4b5e] pointer-events-none" />
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="font-sans font-bold text-[14px] leading-5 text-[#1c3a66] hover:underline cursor-pointer select-none [font-variation-settings:'wght'_700]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

