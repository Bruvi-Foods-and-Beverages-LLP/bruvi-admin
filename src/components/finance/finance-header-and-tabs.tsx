"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { FinanceSectionTab } from "@/types/finance";

interface FinanceModuleHeaderProps {
  overline: string;
  title: string;
  actions?: React.ReactNode;
}

export function FinanceModuleHeader({
  overline,
  title,
  actions,
}: FinanceModuleHeaderProps) {
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

const FINANCE_TABS: Array<{
  id: FinanceSectionTab;
  label: string;
  href: string;
}> = [
  { id: "overview", label: "Overview", href: "/finance" },
  { id: "payments", label: "Payments", href: "/finance/payments" },
  { id: "refunds", label: "Refunds", href: "/finance/refunds" },
  { id: "reconciliation", label: "Reconciliation", href: "/finance/reconciliation" },
  { id: "settlements", label: "Settlements", href: "/finance/settlements" },
  { id: "tax", label: "Tax", href: "/finance/tax" },
];

export function FinanceTabBar({ active }: { active: FinanceSectionTab }) {
  return (
    <nav
      aria-label="Finance sections"
      className="w-full flex items-end gap-6 border-b border-border overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {FINANCE_TABS.map((tab) => {
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
