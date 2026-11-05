"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setFilters, clearFilters, fetchOrders } from "@/store/slices/orders-slice";
import { Search, ChevronDown, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function OrdersFilterToolbar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.orders);

  const [searchInput, setSearchInput] = React.useState(filters.search || "");
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  // Debounced search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== (filters.search || "")) {
        dispatch(setFilters({ search: searchInput }));
        dispatch(fetchOrders({ search: searchInput }));
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput, dispatch, filters.search]);

  // Click outside listener for dropdowns
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".filter-dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchInput("");
    dispatch(clearFilters());
    dispatch(fetchOrders({ search: "", store: "All 12", channel: "All", status: "All" }));
  };

  const handleSelectStore = (store: string) => {
    dispatch(setFilters({ store }));
    dispatch(fetchOrders({ store }));
    setActiveDropdown(null);
  };

  const handleSelectChannel = (channel: string) => {
    dispatch(setFilters({ channel }));
    dispatch(fetchOrders({ channel }));
    setActiveDropdown(null);
  };

  const handleSelectStatus = (status: string) => {
    dispatch(setFilters({ status }));
    dispatch(fetchOrders({ status }));
    setActiveDropdown(null);
  };

  const hasActiveFilters =
    Boolean(searchInput) ||
    filters.store !== "All 12" ||
    filters.channel !== "All" ||
    filters.status !== "All";

  return (
    <div className="w-full min-h-[56px] px-5 py-2.5 flex flex-wrap items-center gap-2 border-b border-[#dce2ea] bg-white">
      {/* 1. Search Input (Figma 225:101155) */}
      <div className="relative flex-1 min-w-[260px] max-w-[485px] h-9">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#7f8ca0]" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Order no., customer, phone, UPI ref"
          className="w-full h-9 pl-9 pr-8 rounded-[12px] bg-[#f5f7fa] border border-[#7f8ca0] text-body-s text-[#0f2340] placeholder:text-[#7f8ca0] focus:outline-none focus:border-[#2f5690] focus:ring-2 focus:ring-[#cde9f9] transition-all"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#7f8ca0] hover:text-[#0f2340]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Store Filter Dropdown (Figma 225:101163) */}
      <div className="relative filter-dropdown-container">
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "store" ? null : "store")}
          className="h-9 px-3 rounded-[12px] bg-white border border-[#7f8ca0] text-body-s text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Store: {filters.store || "All 12"}</span>
          <ChevronDown className="h-4 w-4 text-[#3f4b5e]" />
        </button>

        {activeDropdown === "store" && (
          <div className="absolute left-0 mt-1 w-48 rounded-[12px] bg-white border border-[#dce2ea] shadow-floating py-1.5 z-30">
            {["All 12", "Indiranagar", "Bandra", "Cyber Hub", "Koramangala"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectStore(s)}
                className={cn(
                  "w-full px-3.5 py-1.5 text-left text-body-s transition-colors flex items-center justify-between cursor-pointer",
                  filters.store === s
                    ? "bg-[#e8f5fd] text-[#1c3a66] font-bold"
                    : "text-[#0f2340] hover:bg-[#f5f7fa]"
                )}
              >
                <span>{s}</span>
                {filters.store === s && <span className="text-[#1c3a66] text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Channel Filter Dropdown (Figma 225:101169) */}
      <div className="relative filter-dropdown-container">
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "channel" ? null : "channel")}
          className="h-9 px-3 rounded-[12px] bg-white border border-[#7f8ca0] text-body-s text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Channel: {filters.channel || "All"}</span>
          <ChevronDown className="h-4 w-4 text-[#3f4b5e]" />
        </button>

        {activeDropdown === "channel" && (
          <div className="absolute left-0 mt-1 w-44 rounded-[12px] bg-white border border-[#dce2ea] shadow-floating py-1.5 z-30">
            {["All", "Counter", "Kiosk K1", "App", "QR dine-in"].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => handleSelectChannel(ch)}
                className={cn(
                  "w-full px-3.5 py-1.5 text-left text-body-s transition-colors flex items-center justify-between cursor-pointer",
                  filters.channel === ch
                    ? "bg-[#e8f5fd] text-[#1c3a66] font-bold"
                    : "text-[#0f2340] hover:bg-[#f5f7fa]"
                )}
              >
                <span>{ch}</span>
                {filters.channel === ch && <span className="text-[#1c3a66] text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Status Filter Dropdown (Figma 225:101173) */}
      <div className="relative filter-dropdown-container">
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
          className="h-9 px-3 rounded-[12px] bg-white border border-[#7f8ca0] text-body-s text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Status: {filters.status || "All"}</span>
          <ChevronDown className="h-4 w-4 text-[#3f4b5e]" />
        </button>

        {activeDropdown === "status" && (
          <div className="absolute left-0 mt-1 w-44 rounded-[12px] bg-white border border-[#dce2ea] shadow-floating py-1.5 z-30">
            {["All", "Preparing", "Ready", "Delayed", "Completed", "Cancelled", "Part refund"].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectStatus(st)}
                  className={cn(
                    "w-full px-3.5 py-1.5 text-left text-body-s transition-colors flex items-center justify-between cursor-pointer",
                    filters.status === st
                      ? "bg-[#e8f5fd] text-[#1c3a66] font-bold"
                      : "text-[#0f2340] hover:bg-[#f5f7fa]"
                  )}
                >
                  <span>{st}</span>
                  {filters.status === st && <span className="text-[#1c3a66] text-xs">✓</span>}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* 5. Date Filter (Figma 225:101177) */}
      <div className="relative">
        <button
          type="button"
          className="h-9 px-3 rounded-[12px] bg-white border border-[#7f8ca0] text-body-s text-[#0f2340] hover:bg-[#f5f7fa] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 text-[#3f4b5e]" />
          <span>{filters.date || "Today · Fri 2 Oct"}</span>
        </button>
      </div>

      {/* 6. Clear Button (Figma 225:101181) */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="h-9 px-2 text-label text-[#1c3a66] hover:text-[#0f2340] hover:underline transition-all cursor-pointer flex items-center"
        >
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

