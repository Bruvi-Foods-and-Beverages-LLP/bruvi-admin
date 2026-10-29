"use client";

import * as React from "react";
import { useAppStore } from "@/stores/use-app-store";
import { StoreSwitcher } from "./store-switcher";
import { Search, Bell, Calendar, ChevronDown, Menu } from "lucide-react";

export function Topbar() {
  const toggleCommandMenu = useAppStore((s) => s.toggleCommandMenu);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#dce2ea] bg-white px-6 md:px-8">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 text-[#55647A] hover:text-[#0F2340] rounded-lg hover:bg-[#f5f7fa] cursor-pointer"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Figma: w-480px h-36px rounded-12px bg-bg-subtle) */}
        <button
          type="button"
          onClick={toggleCommandMenu}
          className="flex h-9 w-full max-w-[480px] items-center justify-between rounded-[12px] bg-[#f5f7fa] px-3 text-[13px] text-[#7F8CA0] hover:bg-[#ebeff4] transition-colors cursor-pointer group border border-transparent focus:outline-none"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-4 w-4 text-[#7F8CA0] shrink-0" />
            <span className="truncate">Search orders, stores, products, customers</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center rounded-[6px] border border-[#dce2ea] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#7F8CA0] font-semibold shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Store Scope, Date Range, Notification Bell */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {/* Store Switcher */}
        <StoreSwitcher />

        {/* Date Filter Pill */}
        <button
          type="button"
          className="hidden md:flex h-9 items-center gap-2 rounded-[12px] border border-[#dce2ea] bg-white px-3 text-[13px] font-bold text-[#0F2340] shadow-2xs hover:bg-[#f5f7fa] transition-colors cursor-pointer"
        >
          <Calendar className="h-4 w-4 text-[#0F2340] shrink-0" />
          <span>Today · Fri 2 Oct</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#7F8CA0] shrink-0" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-[12px] border border-[#dce2ea] bg-white text-[#0F2340] shadow-2xs hover:bg-[#f5f7fa] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c0352b]" />
        </button>
      </div>
    </header>
  );
}
