"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  toggleSelectProduct,
  selectAllVisibleProducts,
  clearSelection,
  setPage,
  fetchCatalogProducts,
} from "@/store/slices/catalog-slice";
import { CoffeeIcon } from "@/components/icons";
import { ProductChannelsMatrix } from "./catalog-channel-icons";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

function formatLastEdited(dateString?: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();

  if (isToday) {
    return `Today, ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return `${dateStr}, ${timeStr}`;
}

/**
 * High-Density Catalog Product Table (Figma 225:90341)
 * Pixel-perfect implementation: 56px rows, exact column widths, custom channel SVGs & pagination
 */
export function CatalogProductTable() {
  const dispatch = useAppDispatch();
  const {
    products,
    selectedProductIds,
    isLoading,
    total,
    page,
    limit,
    totalPages,
    counts,
  } = useAppSelector((state) => state.catalog);

  const isAllSelected =
    products.length > 0 && selectedProductIds.length === products.length;
  const isIndeterminate =
    selectedProductIds.length > 0 && selectedProductIds.length < products.length;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden">
      {/* Scroll container for responsiveness on mobile/tablet */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[1094px] w-full flex flex-col">
          {/* 1. Table Header (Figma 225:90364 - h: 36px, bg: #f5f7fa, px-5, gap: 12px) */}
          <div className="h-9 w-full flex items-center px-5 gap-3 bg-[#f5f7fa] border-b border-[#dce2ea] select-none font-sans">
            {/* Checkbox Column (w: 24px) */}
            <div className="w-6 shrink-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  if (isAllSelected) {
                    dispatch(clearSelection());
                  } else {
                    dispatch(selectAllVisibleProducts());
                  }
                }}
                className={cn(
                  "h-6 w-6 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors cursor-pointer",
                  isAllSelected || isIndeterminate
                    ? "bg-[#1C3A66] border-[#1C3A66]"
                    : "bg-white border-[#7F8CA0] hover:border-[#1C3A66]"
                )}
                aria-label="Select all products"
              >
                {isAllSelected && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
                {isIndeterminate && <div className="w-2.5 h-[2px] bg-white rounded-full" />}
              </button>
            </div>

            {/* Product Column (w: 254px) */}
            <div className="w-[254px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Product
            </div>

            {/* SKU Column (w: 96px) */}
            <div className="w-[96px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              SKU
            </div>

            {/* Category Column (w: 120px) */}
            <div className="w-[120px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Category
            </div>

            {/* Base Price Column (w: 80px - Right Aligned) */}
            <div className="w-[80px] shrink-0 text-right text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Base price
            </div>

            {/* Channels Column (w: 120px) */}
            <div className="w-[120px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Channels
            </div>

            {/* Status Column (w: 160px) */}
            <div className="w-[160px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Status
            </div>

            {/* Last Edited Column (w: 120px) */}
            <div className="w-[120px] shrink-0 text-[12px] leading-4 font-bold uppercase tracking-wider text-[#55647A]">
              Last edited
            </div>

            {/* Actions Column (w: 24px) */}
            <div className="w-6 shrink-0" />
          </div>

          {/* 2. Table Rows (Loading Skeleton, Empty State, or Real Records) */}
          {isLoading ? (
            <div className="divide-y divide-[#dce2ea] animate-in fade-in duration-150">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="h-14 flex items-center px-5 gap-3">
                  <div className="w-6 shrink-0 flex items-center justify-center">
                    <Skeleton className="h-6 w-6 rounded-[4px] bg-[#ebeff4]" />
                  </div>
                  <div className="w-[254px] shrink-0 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-[8px] bg-[#ebeff4] shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-36 bg-[#ebeff4]" />
                      <Skeleton className="h-3 w-24 bg-[#ebeff4]" />
                    </div>
                  </div>
                  <div className="w-[96px] shrink-0">
                    <Skeleton className="h-4 w-16 bg-[#ebeff4]" />
                  </div>
                  <div className="w-[120px] shrink-0">
                    <Skeleton className="h-6 w-20 rounded-[4px] bg-[#ebeff4]" />
                  </div>
                  <div className="w-[80px] shrink-0 flex justify-end">
                    <Skeleton className="h-4 w-12 bg-[#ebeff4]" />
                  </div>
                  <div className="w-[120px] shrink-0">
                    <Skeleton className="h-6 w-24 rounded-[4px] bg-[#ebeff4]" />
                  </div>
                  <div className="w-[160px] shrink-0">
                    <Skeleton className="h-6 w-20 rounded-[12px] bg-[#ebeff4]" />
                  </div>
                  <div className="w-[120px] shrink-0 flex flex-col gap-1">
                    <Skeleton className="h-4 w-20 bg-[#ebeff4]" />
                    <Skeleton className="h-3 w-16 bg-[#ebeff4]" />
                  </div>
                  <div className="w-6 shrink-0" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none">
              <div className="h-14 w-14 rounded-full bg-[#f5f7fa] border border-[#dce2ea] flex items-center justify-center mb-3 text-[#7F8CA0]">
                <CoffeeIcon size={28} />
              </div>
              <h3 className="font-archivo text-[18px] font-bold text-[#0F2340]">
                No products found
              </h3>
              <p className="mt-1 text-[14px] leading-5 text-[#55647A] max-w-sm font-sans">
                Try adjusting your search query, selecting another category, or clearing status filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#dce2ea]">
              {products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);

                // Status configuration matching Figma 225:90409
                const isHiddenInStore =
                  product.status === "OUT_OF_STOCK" ||
                  Boolean(product.hiddenStoresCount && product.hiddenStoresCount > 0);
                const isDraft = product.status === "DRAFT";
                const isArchived = product.status === "ARCHIVED";

                // Subtitle: computed from database fields
                const subtitle =
                  product.shortDescription ||
                  (product.isBestseller
                    ? `Bestseller · ${product.modifierGroupsCount || 0} modifier groups`
                    : `${product.modifierGroupsCount || 0} modifier groups`);

                return (
                  <div
                    key={product.id}
                    className={cn(
                      "h-14 w-full flex items-center px-5 gap-3 transition-colors select-none font-sans",
                      isSelected
                        ? "bg-[#e8f5fd]/45"
                        : "bg-white hover:bg-[#f5f7fa]/60"
                    )}
                  >
                    {/* 1. Custom Checkbox (Figma 225:90376 / 225:90421 - w: 24px, h: 24px) */}
                    <div className="w-6 shrink-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => dispatch(toggleSelectProduct(product.id))}
                        className={cn(
                          "h-6 w-6 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors cursor-pointer",
                          isSelected
                            ? "bg-[#1C3A66] border-[#1C3A66]"
                            : "bg-white border-[#7F8CA0] hover:border-[#1C3A66]"
                        )}
                        aria-label={`Select ${product.name}`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
                      </button>
                    </div>

                    {/* 2. Product Name, Thumbnail & Subtitle (Figma 225:90377 - w: 254px, gap: 12px) */}
                    <div className="w-[254px] shrink-0 flex items-center gap-3 min-w-0">
                      {/* Image Thumbnail (40x40 rounded-[8px]) */}
                      <Link
                        href={`/catalog/${product.id}`}
                        prefetch
                        className="relative h-10 w-10 rounded-[8px] bg-[#f5f7fa] border border-[#dce2ea] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.thumbnailUrl || product.imageUrl}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <CoffeeIcon size={18} className="text-[#7F8CA0]" />
                        )}
                      </Link>

                      {/* Title & Subtitle Stack */}
                      <div className="flex flex-col justify-center min-w-0 flex-1">
                        <Link
                          href={`/catalog/${product.id}`}
                          prefetch
                          className="text-left text-[14px] leading-5 font-bold text-[#0F2340] hover:text-[#1C3A66] hover:underline truncate cursor-pointer font-sans"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[12px] leading-4 font-medium text-[#55647A] truncate font-sans">
                          {subtitle}
                        </span>
                      </div>
                    </div>

                    {/* 3. SKU (Figma 225:90382 - w: 96px, 14px Regular #55647A) */}
                    <div className="w-[96px] shrink-0 text-[14px] leading-5 font-normal text-[#55647A] font-sans truncate">
                      {product.sku}
                    </div>

                    {/* 4. Category Pill (Figma 225:90383 - w: 120px, h: 24px, r: 4px) */}
                    <div className="w-[120px] shrink-0 flex items-center">
                      <span
                        className="h-6 px-2 rounded-[4px] inline-flex items-center text-[12px] leading-4 font-bold font-sans truncate"
                        style={{
                          backgroundColor: product.categoryBgColor || "#f3e8df",
                          color: product.categoryColor || "#6b4430",
                        }}
                      >
                        {product.categoryName}
                      </span>
                    </div>

                    {/* 5. Base Price (Figma 225:90386 - w: 80px, Archivo ExtraBold, Right Aligned) */}
                    <div className="w-[80px] shrink-0 text-right text-[14px] leading-5 font-extrabold text-[#0F2340] font-archivo">
                      ₹{product.basePriceRupees}
                    </div>

                    {/* 6. Channels 4-Icon Matrix (Figma 225:90387 - w: 120px, 4 SVG boxes) */}
                    <ProductChannelsMatrix
                      counter={Boolean(product.channelCounter)}
                      kiosk={Boolean(product.channelKiosk)}
                      app={Boolean(product.channelApp)}
                      qr={Boolean(product.channelQr)}
                    />

                    {/* 7. Status Pill (Figma 225:90409 - w: 160px, h: 24px, r: 12px, 8px dot) */}
                    <div className="w-[160px] shrink-0 flex items-center">
                      {isHiddenInStore ? (
                        <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 text-[12px] leading-4 font-bold bg-[#fdf0d8] text-[#9a5b00]">
                          <span className="h-2 w-2 rounded-full bg-[#9a5b00]" />
                          <span>Hidden in {product.hiddenStoresCount || 1} store{(product.hiddenStoresCount || 1) > 1 ? "s" : ""}</span>
                        </span>
                      ) : isDraft ? (
                        <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 text-[12px] leading-4 font-bold bg-[#ebeff4] text-[#55647a]">
                          <span className="h-2 w-2 rounded-full bg-[#55647a]" />
                          <span>Draft</span>
                        </span>
                      ) : isArchived ? (
                        <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 text-[12px] leading-4 font-bold bg-[#fee2e2] text-[#b91c1c]">
                          <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />
                          <span>Archived</span>
                        </span>
                      ) : (
                        <span className="h-6 px-2 rounded-[12px] inline-flex items-center gap-1.5 text-[12px] leading-4 font-bold bg-[#e3f4ea] text-[#1f7a4d]">
                          <span className="h-2 w-2 rounded-full bg-[#1f7a4d]" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* 8. Last Edited Stack (Figma 225:90412 - w: 120px, 14px + 12px Stack) */}
                    <div className="w-[120px] shrink-0 flex flex-col justify-center">
                      <span className="text-[14px] leading-5 font-normal text-[#0F2340] font-sans truncate">
                        {formatLastEdited(product.updatedAt || product.createdAt)}
                      </span>
                      <span className="text-[12px] leading-4 font-medium text-[#55647A] font-sans truncate">
                        {product.lastEditedByName || "System"}
                      </span>
                    </div>

                    {/* 9. Action Button (Figma 225:90415 - w: 24px) */}
                    <div className="w-6 shrink-0 flex items-center justify-center">
                      <Link
                        href={`/catalog/${product.id}`}
                        prefetch
                        className="p-1 rounded-[6px] text-[#55647A] hover:text-[#0F2340] hover:bg-[#ebeff4] transition-colors cursor-pointer"
                        title="View product details"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pagination Footer Row (Figma 225:90683 - h: 48px, px-5, flex-between) */}
      <div className="h-12 w-full flex items-center justify-between px-5 border-t border-[#dce2ea] bg-white select-none font-sans">
        {/* Record Summary Text (Figma 225:90684) */}
        <div className="text-[14px] leading-5 font-normal text-[#55647A]">
          {total > 0
            ? `${startRecord}–${endRecord} of ${total} products · ${counts.hiddenInStore || 0} hidden in a store · ${counts.draft || 0} draft`
            : "0 products"}
        </div>

        {/* Page Buttons (Figma 225:90685 - h: 32px, gap: 4px, r: 12px) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => {
                const prev = Math.max(1, page - 1);
                dispatch(setPage(prev));
                dispatch(fetchCatalogProducts({ page: prev }));
              }}
              disabled={page <= 1 || isLoading}
              className="h-8 w-8 rounded-[12px] border border-[#dce2ea] bg-white flex items-center justify-center text-[#55647A] hover:bg-[#f5f7fa] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2]" />
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    dispatch(setPage(p));
                    dispatch(fetchCatalogProducts({ page: p }));
                  }}
                  className={cn(
                    "h-8 w-8 rounded-[12px] text-[14px] leading-5 font-bold transition-all cursor-pointer flex items-center justify-center",
                    isCurrent
                      ? "bg-[#0F2340] text-white shadow-2xs"
                      : "bg-transparent text-[#0F2340] hover:bg-[#f5f7fa]"
                  )}
                >
                  {p}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                dispatch(setPage(next));
                dispatch(fetchCatalogProducts({ page: next }));
              }}
              disabled={page >= totalPages || isLoading}
              className="h-8 w-8 rounded-[12px] border border-[#dce2ea] bg-white flex items-center justify-center text-[#55647A] hover:bg-[#f5f7fa] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
