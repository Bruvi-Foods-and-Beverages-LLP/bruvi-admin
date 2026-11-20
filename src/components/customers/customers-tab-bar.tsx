"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type CustomerTab = "customers" | "wallet" | "segments" | "support";

export const CUSTOMER_TABS: { id: CustomerTab; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "wallet", label: "Wallet" },
  { id: "segments", label: "Segments" },
  { id: "support", label: "Support" },
];

interface CustomersTabBarProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  /** Tabs this user may open; defaults to all. */
  tabs?: CustomerTab[];
  /** Live chats not resolved yet; shows the blue dot on Support. */
  supportUnresolved?: number;
}

/**
 * Customers Sub-Navigation Tabs (Figma 225:103340)
 * Items: Customers, Wallet, Segments, Support
 */
export function CustomersTabBar({ activeTab, onTabChange, tabs, supportUnresolved = 0 }: CustomersTabBarProps) {
  const visible = tabs ? CUSTOMER_TABS.filter((t) => tabs.includes(t.id)) : CUSTOMER_TABS;

  return (
    <div role="tablist" className="w-full flex items-center gap-6 border-b border-[#dce2ea] overflow-x-auto scrollbar-none">
      {visible.map((tab) => {
        const isActive = activeTab === tab.id;
        const dot = tab.id === "support" && supportUnresolved > 0;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-9 flex items-center justify-start gap-1.5 text-[14px] leading-5 font-sans font-bold transition-all relative select-none whitespace-nowrap cursor-pointer [font-variation-settings:'wght'_700]",
              isActive
                ? "text-[#0f2340] border-b-2 border-[#1c3a66] pb-[2px]"
                : "text-[#3f4b5e] hover:text-[#0f2340] pb-0"
            )}
          >
            {tab.label}
            {dot && (
              <span
                className="relative flex h-2 w-2"
                title={`${supportUnresolved} live ${supportUnresolved === 1 ? "chat" : "chats"} not resolved`}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#2f80ed] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2f80ed]" />
                <span className="sr-only">{`, ${supportUnresolved} live chats not resolved`}</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
