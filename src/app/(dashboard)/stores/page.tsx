"use client";

import * as React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchStores, StoreEntity } from "@/store/slices/stores-slice";
import { fetchCities } from "@/store/slices/cities-slice";
import { StoreIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronDown, ChevronRight, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function StoresPage() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector((state) => state.stores.stores);
  const isStoresLoading = useAppSelector((state) => state.stores.isLoading);
  const apiCities = useAppSelector((state) => state.cities.cities);
  const isCitiesLoading = useAppSelector((state) => state.cities.isLoading);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<"All" | "Open" | "Busy mode" | "Closed" | "Needs attention">("All");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);

  // Both stores and cities are fetched via Redux async thunks
  React.useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchCities());
  }, [dispatch]);

  const isLoading = isStoresLoading || isCitiesLoading;

  // Overall store counts and status metrics
  const totalStores = stores.length;
  const openCount = stores.filter((s) => s.status === "Open" || s.status === "Busy mode").length;
  const attentionCount = stores.filter((s) => s.status === "Needs attention").length;
  const totalSales = stores.reduce((acc, s) => acc + (s.salesToday || 0), 0);

  // Dynamic city aggregation (merging City API data with store distribution)
  const cityAggregationMap = new Map<string, { id: string; name: string; count: number; sales: number }>();

  // Seed with operational cities from City API
  for (const c of apiCities) {
    const key = c.name.trim().toLowerCase();
    cityAggregationMap.set(key, {
      id: c.id,
      name: c.name.trim(),
      count: 0,
      sales: 0,
    });
  }

  // Aggregate store counts and sales per city
  for (const s of stores) {
    const rawCity = (s.city || "").trim();
    if (!rawCity) continue;
    const key = rawCity.toLowerCase();
    const existing = cityAggregationMap.get(key);
    if (existing) {
      existing.count += 1;
      existing.sales += s.salesToday || 0;
    } else {
      cityAggregationMap.set(key, {
        id: `city-${key}`,
        name: rawCity,
        count: 1,
        sales: s.salesToday || 0,
      });
    }
  }

  const allCityEntries = Array.from(cityAggregationMap.values());

  // Cities for the filter tabs: ONLY show locations that have at least 1 store
  const tabCities = allCityEntries
    .filter((c) => c.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

  // Dynamic Sales Breakdown: Only cities with stores
  const salesCitiesSource = allCityEntries
    .filter((c) => c.count > 0)
    .sort((a, b) => {
      if (b.sales !== a.sales) return b.sales - a.sales;
      return b.count - a.count;
    });

  const top3Cities = salesCitiesSource.slice(0, 3);
  const remainingCities = salesCitiesSource.slice(3);

  const othersSales = remainingCities.reduce((acc, c) => acc + c.sales, 0);

  // Palette colors for top 3 cities and Others
  const CITY_PALETTE = [
    "#1C3A66", // Brand Navy (Top 1)
    "#A9D8F3", // Brand Sky (Top 2)
    "#6B4430", // Brand Coffee (Top 3)
    "#7F8CA0", // Neutral Gray (Others)
  ];

  // Filtered store list
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      selectedCity === "All" ||
      store.city.trim().toLowerCase() === selectedCity.trim().toLowerCase();

    const matchesStatus = selectedStatus === "All" || store.status === selectedStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      {/* 1. Page Header (Figma 225:86144) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
        <div className="flex flex-col gap-1">
          <span className="text-overline-l text-[#3F4B5E]">
            Operations · Network
          </span>
          <h1 className="text-display-s text-[#0F2340]">
            Stores
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Button */}
          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stores, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `bruvi-stores-${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            disabled={isLoading || stores.length === 0}
            className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] bg-white text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>

          {/* Add store Primary Button */}
          <Link
            href="/stores/new"
            className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add store</span>
          </Link>
        </div>
      </div>

      {/* 2. Four Stats Cards Row (Figma 225:86157) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full">
        {isLoading ? (
          <>
            {/* Card 1 Skeleton: Stores */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <Skeleton className="h-3.5 w-12 bg-[#ebeff4]" />
              <Skeleton className="h-8 w-10 bg-[#ebeff4]" />
            </div>

            {/* Card 2 Skeleton: Open now */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <Skeleton className="h-3.5 w-16 bg-[#ebeff4]" />
              </div>
              <Skeleton className="h-8 w-10 bg-[#ebeff4]" />
            </div>

            {/* Card 3 Skeleton: Needs attention */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#fce8e6] bg-[#fce8e6] p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                <Skeleton className="h-3.5 w-20 bg-rose-200" />
              </div>
              <Skeleton className="h-8 w-10 bg-rose-200" />
            </div>

            {/* Card 4 Skeleton: Sales by city today */}
            <div className="w-full lg:flex-1 h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs min-w-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 bg-[#ebeff4]" />
                <Skeleton className="h-6 w-16 bg-[#ebeff4]" />
              </div>
              <Skeleton className="h-3 w-full rounded-[6px] bg-[#ebeff4]" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-24 bg-[#ebeff4]" />
                <Skeleton className="h-3 w-24 bg-[#ebeff4]" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Card 1: Stores */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <span className="text-caption text-[#55647A]">Stores</span>
              <span className="text-price-l text-[#0F2340]">
                {totalStores}
              </span>
            </div>

            {/* Card 2: Open now */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#107E3E]" />
                <span className="text-caption text-[#55647A]">Open now</span>
              </div>
              <span className="text-price-l text-[#0F2340]">
                {openCount}
              </span>
            </div>

            {/* Card 3: Needs attention */}
            <div className="w-full lg:w-[160px] h-[106px] rounded-[16px] border border-[#fce8e6] bg-[#fce8e6] p-[17px_21px] flex flex-col justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c0352b]" />
                <span className="text-caption text-[#c0352b]">Needs attention</span>
              </div>
              <span className="text-price-l text-[#c0352b]">
                {attentionCount}
              </span>
            </div>

            {/* Card 4: Sales by city today (Figma 225:86171) */}
            <div className="w-full lg:flex-1 h-[106px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-caption text-[#55647A]">
                  Sales by city today
                </span>
                <span className="text-price-m text-[#0F2340]">
                  ₹{totalSales.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="h-3 w-full rounded-[6px] bg-[#f5f7fa] overflow-hidden flex gap-[2px] shrink-0">
                {totalSales > 0 ? (
                  <>
                    {top3Cities.map((c, idx) => {
                      const pct = totalSales > 0 ? (c.sales / totalSales) * 100 : 0;
                      if (pct <= 0) return null;
                      return (
                        <div
                          key={c.name}
                          style={{ width: `${pct}%`, backgroundColor: CITY_PALETTE[idx] }}
                          className={cn("h-full", idx === 0 && "rounded-l-[4px]")}
                          title={`${c.name}: ₹${c.sales.toLocaleString("en-IN")}`}
                        />
                      );
                    })}
                    {othersSales > 0 && (
                      <div
                        style={{
                          width: `${(othersSales / totalSales) * 100}%`,
                          backgroundColor: CITY_PALETTE[3],
                        }}
                        className="h-full rounded-r-[4px]"
                        title={`Others: ₹${othersSales.toLocaleString("en-IN")}`}
                      />
                    )}
                  </>
                ) : (
                  <div className="h-full w-full bg-[#ebeff4]" />
                )}
              </div>

              {/* Dynamic Legends: Top 3 cities + Others */}
              <div className="flex items-center gap-5 text-[12px] text-[#55647A] font-sans truncate overflow-x-auto no-scrollbar">
                {top3Cities.length === 0 ? (
                  <span className="text-[12px] text-[#7F8CA0]">
                    {stores.length === 0
                      ? "No operational store data recorded yet"
                      : "Zero sales recorded today across all locations"}
                  </span>
                ) : (
                  <>
                    {top3Cities.map((c, idx) => (
                      <div key={c.name} className="flex items-center gap-2 shrink-0">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CITY_PALETTE[idx] }}
                        />
                        <span>
                          {c.name} ({c.count}) ₹{c.sales.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    {othersSales > 0 && (
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CITY_PALETTE[3] }}
                        />
                        <span>Others ₹{othersSales.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Main Data Card: Filter Bar + High-Density Table (Figma 225:86186) */}
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Bar (Figma 225:86187) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#dce2ea]">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-[260px] shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7F8CA0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store name or code"
                disabled={isLoading}
                className="w-full h-9 pl-9 pr-3 rounded-[12px] bg-[#f5f7fa] border-none text-xs text-[#0F2340] placeholder:text-[#7F8CA0] focus:ring-1 focus:ring-[#1C3A66] transition-all outline-none disabled:opacity-50"
              />
            </div>

            {/* City Tabs and Status Controls */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-16 rounded-[12px] bg-[#ebeff4]" />
                <Skeleton className="h-9 w-24 rounded-[12px] bg-[#ebeff4]" />
                <Skeleton className="h-9 w-28 rounded-[12px] bg-[#ebeff4]" />
              </div>
            ) : (
              <>
                {/* Segmented City Pills */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 border border-[#bcc6d3] rounded-[12px] p-1 bg-white">
                  <button
                    type="button"
                    onClick={() => setSelectedCity("All")}
                    className={cn(
                      "h-full px-3 py-1 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                      selectedCity === "All"
                        ? "bg-[#1C3A66] text-white font-bold"
                        : "text-[#55647A] hover:bg-[#f5f7fa]"
                    )}
                  >
                    All · {totalStores}
                  </button>

                  {tabCities.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCity(c.name)}
                      className={cn(
                        "h-full px-3 py-1 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                        selectedCity.trim().toLowerCase() === c.name.trim().toLowerCase()
                          ? "bg-[#1C3A66] text-white font-bold"
                          : "text-[#55647A] hover:bg-[#f5f7fa]"
                      )}
                    >
                      {c.name} · {c.count}
                    </button>
                  ))}
                </div>

                {/* Status Dropdown (Figma 225:86208) */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                    className="flex h-9 items-center gap-2 rounded-[12px] border border-[#7f8ca0] bg-white px-3 text-xs font-semibold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
                  >
                    <span>Status: {selectedStatus === "All" ? "Any" : selectedStatus}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#7F8CA0]" />
                  </button>

                  {isStatusMenuOpen && (
                    <div className="absolute left-0 mt-1.5 w-44 rounded-xl border border-[#dce2ea] bg-white p-1.5 shadow-floating z-30">
                      {(["All", "Open", "Busy mode", "Closed", "Needs attention"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(status);
                            setIsStatusMenuOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                            selectedStatus === status
                              ? "bg-[#1C3A66] text-white font-bold"
                              : "text-[#0F2340] hover:bg-[#f5f7fa]"
                          )}
                        >
                          {status === "All" ? "Status: Any" : status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sorted text */}
          <div className="text-body-s text-[#55647A] shrink-0">
            Sorted by today’s sales
          </div>
        </div>

        {/* Table Header Row (Figma 225:86216) */}
        <div className="hidden md:flex h-9 items-center gap-4 bg-[#f5f7fa] border-b border-[#dce2ea] px-5 text-caption-bold text-[#55647A] tracking-wider uppercase select-none">
          <div className="w-[302px] shrink-0">STORE</div>
          <div className="w-[96px] shrink-0">CITY</div>
          <div className="w-[120px] shrink-0">MANAGER</div>
          <div className="w-[160px] shrink-0">HOURS TODAY</div>
          <div className="w-[120px] shrink-0">STATUS</div>
          <div className="w-[96px] shrink-0 text-right">SALES TODAY</div>
          <div className="w-[64px] shrink-0 text-right">RATING</div>
          <div className="w-6 shrink-0" />
        </div>

        {/* Table Content: Loading Skeleton (AS01), Empty State, or Real Rows */}
        {isLoading ? (
          <div className="divide-y divide-[#dce2ea] animate-in fade-in duration-150">
            {[1, 2, 3, 4, 5].map((rowIdx) => (
              <div
                key={rowIdx}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-3.5"
              >
                {/* Store Name & Code */}
                <div className="w-[302px] shrink-0 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-44 bg-[#ebeff4]" />
                  <Skeleton className="h-3 w-24 bg-[#ebeff4]" />
                </div>

                {/* City */}
                <div className="w-[96px] shrink-0">
                  <Skeleton className="h-4 w-16 bg-[#ebeff4]" />
                </div>

                {/* Manager */}
                <div className="w-[120px] shrink-0">
                  <Skeleton className="h-4 w-24 bg-[#ebeff4]" />
                </div>

                {/* Hours */}
                <div className="w-[160px] shrink-0">
                  <Skeleton className="h-4 w-28 bg-[#ebeff4]" />
                </div>

                {/* Status Badge */}
                <div className="w-[120px] shrink-0">
                  <Skeleton className="h-6 w-16 rounded-[6px] bg-[#ebeff4]" />
                </div>

                {/* Sales Today */}
                <div className="w-[96px] shrink-0 flex justify-end">
                  <Skeleton className="h-4 w-14 bg-[#ebeff4]" />
                </div>

                {/* Rating */}
                <div className="w-[64px] shrink-0 flex justify-end">
                  <Skeleton className="h-4 w-10 bg-[#ebeff4]" />
                </div>

                {/* Chevron Placeholder */}
                <div className="w-6 shrink-0 flex justify-end">
                  <Skeleton className="h-3.5 w-3.5 rounded-full bg-[#ebeff4]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            {/* Store Icon Circle */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7fa] border border-[#dce2ea] text-[#55647A] mb-4">
              <StoreIcon className="h-8 w-8 text-[#55647A]" />
            </div>

            {/* Empty State Heading */}
            <h3 className="text-heading-s text-[#0F2340]">
              {stores.length === 0 ? "No stores configured yet" : "No stores match your filter"}
            </h3>

            {/* Empty State Subtitle */}
            <p className="text-body-s text-[#55647A] max-w-sm mt-1">
              {stores.length === 0
                ? "Your organization does not have any physical outlets or kiosks configured yet."
                : "Try resetting your search query or city selection to see available stores."}
            </p>

            {/* Add store button if zero total stores */}
            {stores.length === 0 && (
              <Link
                href="/stores/new"
                className="mt-6 h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 font-bold"
              >
                <Plus className="h-4 w-4" />
                <span>Add first store</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#dce2ea]">
            {filteredStores.map((store) => {
              const badgeBg =
                store.status === "Open"
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : store.status === "Busy mode"
                  ? "bg-[#FEF3E2] text-[#B45309]"
                  : "bg-[#FEE2E2] text-[#B91C1C]";

              return (
                <div
                  key={store.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-3 hover:bg-[#f5f7fa]/60 transition-colors cursor-pointer group"
                >
                  {/* Store Name & Code */}
                  <div className="w-[302px] shrink-0 flex flex-col">
                    <span className="text-label text-[#0F2340] truncate">
                      {store.name}
                    </span>
                    <span className="text-caption text-[#55647A]">
                      {store.code} · {store.type}
                    </span>
                  </div>

                  {/* City */}
                  <div className="w-[96px] shrink-0 text-body-s text-[#55647A] truncate">
                    {store.city}
                  </div>

                  {/* Manager */}
                  <div className="w-[120px] shrink-0 text-body-s text-[#0F2340] truncate">
                    {store.manager}
                  </div>

                  {/* Hours */}
                  <div className="w-[160px] shrink-0 text-body-s text-[#0F2340] truncate">
                    {store.hours}
                  </div>

                  {/* Status */}
                  <div className="w-[120px] shrink-0 flex items-center">
                    <span className={cn("px-2.5 py-0.5 rounded-[6px] text-xs font-semibold truncate", badgeBg)}>
                      {store.statusDetail || store.status}
                    </span>
                  </div>

                  {/* Sales Today */}
                  <div className="w-[96px] shrink-0 text-right text-price-xs text-[#0F2340]">
                    ₹{store.salesToday.toLocaleString("en-IN")}
                  </div>

                  {/* Rating */}
                  <div className="w-[64px] shrink-0 text-right text-label text-[#0F2340] flex items-center justify-end gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#0F2340] text-[#0F2340]" />
                    <span>{store.rating.toFixed(1)}</span>
                  </div>

                  {/* Right Chevron */}
                  <div className="w-6 shrink-0 flex justify-end">
                    <ChevronRight className="h-4 w-4 text-[#7F8CA0] group-hover:text-[#0F2340] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
