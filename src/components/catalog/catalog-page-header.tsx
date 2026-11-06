"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RbacGuard } from "@/components/auth/rbac-guard";
import { cn } from "@/lib/utils/cn";

export const NAV_TABS = [
  { label: "Products", href: "/catalog" },
  { label: "Customisation", href: "/catalog/customisation" },
  { label: "Pricing", href: "/catalog/pricing" },
  { label: "Store overrides", href: "/catalog/store-overrides" },
];

interface CatalogPageHeaderProps {
  activeNavTab?: string;
  totalProductsCount?: number;
  /** Overrides the default "Catalog / Products" breadcrumb */
  breadcrumb?: string;
  /** Overrides the default "Products" page title */
  title?: string;
  /** Replaces the default Import CSV / New product actions */
  actions?: React.ReactNode;
  /** Optional meta row rendered under the title (e.g. type chip + summary) */
  meta?: React.ReactNode;
}

/**
 * Catalog Page Header (Figma 225:90280)
 * Height 115px container with breadcrumb, bold title, actions, and subnav tabs
 */
export function CatalogPageHeader({
  activeNavTab = "Products",
  breadcrumb = "Catalog / Products",
  title = "Products",
  actions,
  meta,
}: CatalogPageHeaderProps) {
  const tabs = NAV_TABS.map((tab) => ({
    ...tab,
    active: activeNavTab === tab.label,
  }));

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,SKU,Name,Category,BasePrice,Status,Channels\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bruvi-catalog-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Breadcrumb + Title & Action Buttons (Figma 225:90281) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
        {/* Left: Overline & Display Title */}
        <div className="flex flex-col gap-1">
          <span className="text-[14px] leading-5 font-normal text-text-secondary font-sans">
            {breadcrumb}
          </span>
          <h1 className="text-display-s text-text">
            {title}
          </h1>
          {meta}
        </div>

        {/* Right: Actions Row (Figma 225:90285) */}
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : (
        <div className="flex items-center gap-2">
          {/* Import CSV Button (Figma 225:90286) */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-9 px-[17.5px] rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-white text-[14px] leading-5 font-bold text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer shadow-2xs font-sans"
          >
            Import CSV
          </button>

          {/* New product Primary Button (Figma 225:90288) */}
          <RbacGuard roles={["SUPER_ADMIN", "ADMIN", "HQ_OPS"]}>
            <Link
              href="/catalog/new"
              prefetch
              className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-[14px] leading-5 font-bold text-white transition-colors shadow-2xs cursor-pointer flex items-center gap-2 font-sans"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New product</span>
            </Link>
          </RbacGuard>
        </div>
        )}
      </div>

      {/* 2. Subnavigation Tabs Row (Figma 225:90294) */}
      <div className="flex items-center gap-6 border-b border-[#dce2ea] overflow-x-auto no-scrollbar w-full">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "pb-2.5 text-[14px] leading-5 font-bold transition-all relative shrink-0 font-sans cursor-pointer",
              tab.active
                ? "text-[#0F2340]"
                : "text-[#55647A] hover:text-[#0F2340]"
            )}
          >
            {tab.label}
            {tab.active && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1C3A66] rounded-t-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
