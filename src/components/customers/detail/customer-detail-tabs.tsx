"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type CustomerDetailTab = "overview" | "orders" | "wallet" | "loyalty" | "notes";

interface CustomerDetailTabsProps {
  activeTab: CustomerDetailTab;
  onTabChange: (tab: CustomerDetailTab) => void;
  visitsCount?: number;
  notesCount?: number;
}

export function CustomerDetailTabs({
  activeTab,
  onTabChange,
  visitsCount = 23,
  notesCount = 2,
}: CustomerDetailTabsProps) {
  const tabs: { id: CustomerDetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: `Orders · ${visitsCount}` },
    { id: "wallet", label: "Wallet" },
    { id: "loyalty", label: "Loyalty" },
    { id: "notes", label: `Notes · ${notesCount}` },
  ];

  return (
    <nav
      aria-label="Customer detail views"
      className="flex items-center gap-6 border-b border-[#dce2ea] w-full select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-9 px-0 font-sans font-bold text-[14px] leading-5 transition-colors cursor-pointer relative shrink-0",
              isActive
                ? "text-[#0f2340] border-b-2 border-[#1c3a66]"
                : "text-[#3f4b5e] hover:text-[#0f2340]"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

