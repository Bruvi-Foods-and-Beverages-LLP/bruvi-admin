"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type StoreDetailTab = "overview" | "hours" | "menu" | "devices" | "staff";

interface StoreDetailTabsProps {
  activeTab: StoreDetailTab;
  onTabChange: (tab: StoreDetailTab) => void;
}

export function StoreDetailTabs({ activeTab, onTabChange }: StoreDetailTabsProps) {
  const tabs: { key: StoreDetailTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "hours", label: "Hours" },
    { key: "menu", label: "Menu" },
    { key: "devices", label: "Devices" },
    { key: "staff", label: "Staff" },
  ];

  return (
    <div className="border-b border-border flex items-center gap-6 select-none h-[37px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "h-full pb-2 transition-colors relative cursor-pointer text-body-s",
              isActive
                ? "text-text font-bold"
                : "text-text-muted hover:text-text font-medium"
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
