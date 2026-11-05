"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CatalogProduct } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

interface ProductDetailHeaderProps {
  product: CatalogProduct;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7.99997 2L9.79997 5.73333L13.8666 6.26667L10.8666 9.06667L11.6 13.0667L7.99997 11.1333L4.39997 13.0667L5.1333 9.06667L2.1333 6.26667L6.19997 5.73333L7.99997 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "customisation", label: "Customisation" },
  { id: "recipe", label: "Recipe" },
  { id: "availability", label: "Availability" },
  { id: "performance", label: "Performance" },
];

/**
 * Product Detail Header (Figma 225:90880)
 * Title row with breadcrumbs, title, metadata pills, actions, and tab bar
 */
export function ProductDetailHeader({
  product,
  activeTab = "overview",
  onTabChange,
}: ProductDetailHeaderProps) {
  const router = useRouter();

  const categoryName = product.categoryName || "Vietnamese";
  const categorySlug = product.categorySlug || "vietnamese";
  const categoryColor = product.categoryColor || "#6B4430";
  const categoryBgColor = product.categoryBgColor || "#F3E8DF";

  const isDraft = product.status === "DRAFT";
  const isHidden = (product.hiddenStoresCount && product.hiddenStoresCount > 0) || product.status === "HIDDEN_IN_STORE";
  const isArchived = product.status === "ARCHIVED";

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      {/* 1. Title Row & Actions (Figma 225:90881) */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Left: Breadcrumbs + Title + Badges */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Breadcrumb (Figma 225:90883) */}
          <nav aria-label="Breadcrumb" className="font-sans text-[14px] leading-5 text-[#3F4B5E]">
            <Link href="/catalog" className="hover:text-[#0F2340] hover:underline transition-colors">
              Catalog
            </Link>{" "}
            /{" "}
            <Link href="/catalog" className="hover:text-[#0F2340] hover:underline transition-colors">
              Products
            </Link>{" "}
            /{" "}
            <Link
              href={`/catalog?category=${categorySlug}`}
              className="hover:text-[#0F2340] hover:underline transition-colors"
            >
              {categoryName}
            </Link>
          </nav>

          {/* Product Title (Figma 225:90884 - Archivo Black 32px / 38px, -0.96px tracking) */}
          <h1 className="text-display-s text-[#0F2340] truncate">
            {product.name}
          </h1>

          {/* Badges Bar (Figma 225:90885) */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {/* SKU (Manrope Regular 14px) */}
            <span className="font-sans text-[14px] leading-5 text-[#3F4B5E] font-normal">
              SKU {product.sku}
            </span>

            {/* Divider */}
            <div className="w-[1px] h-4 bg-[#BCC6D3]" aria-hidden="true" />

            {/* Category Pill (Figma 225:90888 - Manrope Bold 12px) */}
            <span
              className="h-6 px-2 rounded-[4px] inline-flex items-center font-sans text-[12px] leading-4 font-bold"
              style={{
                backgroundColor: categoryBgColor,
                color: categoryColor,
              }}
            >
              {categoryName}
            </span>

            {/* Status Pill (Figma 225:90890 - Manrope Bold 12px) */}
            {isHidden ? (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 font-sans text-[12px] leading-4 font-bold bg-[#FDF0D8] text-[#9A5B00]">
                <span className="h-2 w-2 rounded-full bg-[#9A5B00]" />
                <span>Hidden in {product.hiddenStoresCount || 1} stores</span>
              </span>
            ) : isDraft ? (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 font-sans text-[12px] leading-4 font-bold bg-[#EBEFF4] text-[#55647A]">
                <span className="h-2 w-2 rounded-full bg-[#55647A]" />
                <span>Draft</span>
              </span>
            ) : isArchived ? (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 font-sans text-[12px] leading-4 font-bold bg-[#FEE2E2] text-[#B91C1C]">
                <span className="h-2 w-2 rounded-full bg-[#B91C1C]" />
                <span>Archived</span>
              </span>
            ) : (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 font-sans text-[12px] leading-4 font-bold bg-[#E3F4EA] text-[#1F7A4D]">
                <span className="h-2 w-2 rounded-full bg-[#1F7A4D]" />
                <span>Active · 12 stores</span>
              </span>
            )}

            {/* Bestseller Badge (Figma 225:90893 - Manrope Bold 12px) */}
            {product.isBestseller && (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1 font-sans text-[12px] leading-4 font-bold bg-[#A9D8F3] text-[#0F2340]">
                <StarIcon className="h-4 w-4 text-[#0F2340]" />
                <span>Bestseller</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Duplicate & Edit Buttons (Figma 225:90899 - Manrope Bold 14px) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              router.push(`/catalog/new?duplicate=${product.id}`);
            }}
            className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#BCC6D3] text-[#0F2340] font-sans text-[14px] leading-5 font-bold hover:bg-[#F5F7FA] transition-colors cursor-pointer"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => {
              router.push(`/catalog/${product.id}/edit`);
            }}
            className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-white font-sans text-[14px] leading-5 font-bold transition-colors cursor-pointer"
          >
            Edit product
          </button>
        </div>
      </div>

      {/* 2. Horizontal Tab Bar (Figma 225:90904 - Manrope Bold 14px) */}
      <div className="w-full border-b border-[#DCE2EA] flex items-center gap-6 pt-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "h-9 px-0 inline-flex items-center font-sans text-[14px] leading-5 font-bold transition-all relative cursor-pointer",
                isActive
                  ? "text-[#0F2340] border-b-2 border-[#1C3A66]"
                  : "text-[#3F4B5E] hover:text-[#0F2340] border-b-2 border-transparent"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
