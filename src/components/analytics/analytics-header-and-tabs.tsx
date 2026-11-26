"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { AnalyticsSectionTab } from "@/types/analytics";

interface AnalyticsModuleHeaderProps {
  overline: string;
  title: string;
  actions?: React.ReactNode;
}

export function AnalyticsModuleHeader({
  overline,
  title,
  actions,
}: AnalyticsModuleHeaderProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted truncate">
          {overline}
        </span>
        <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px] truncate">
          {title}
        </h1>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

const ANALYTICS_TABS: Array<{
  id: AnalyticsSectionTab;
  label: string;
  href: string;
}> = [
  { id: "business", label: "Business", href: "/analytics" },
  { id: "stores", label: "Stores", href: "/analytics/stores" },
  { id: "products", label: "Products", href: "/analytics/products" },
  { id: "customers", label: "Customers", href: "/analytics/customers" },
  { id: "cohorts", label: "Cohorts", href: "/analytics/cohorts" },
  { id: "contribution", label: "Contribution", href: "/analytics/contribution" },
  { id: "profitability", label: "Profitability", href: "/analytics/profitability" },
];

export function AnalyticsTabBar({ active }: { active: AnalyticsSectionTab }) {
  return (
    <nav
      aria-label="Analytics sections"
      className="w-full flex items-end gap-6 border-b border-border overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {ANALYTICS_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "h-9 flex items-center justify-center pb-2 text-label whitespace-nowrap transition-all border-b-2 -mb-px font-sans",
              isActive
                ? "border-primary text-text font-bold"
                : "border-transparent text-text-muted font-semibold hover:text-text hover:border-border-input",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
