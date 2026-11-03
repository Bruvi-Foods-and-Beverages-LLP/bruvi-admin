"use client";

import * as React from "react";
import { CatalogProduct } from "@/types/catalog";

interface ProductAvailabilityCardProps {
  product: CatalogProduct;
}

/**
 * Product Availability Bottom Right Card (Figma 225:91043)
 * Multi-store network status & regional price overrides
 */
export function ProductAvailabilityCard({ product }: ProductAvailabilityCardProps) {
  const hiddenStores = product.hiddenStoresCount || 0;
  const totalStores = 12;
  const activeStores = Math.max(0, totalStores - hiddenStores);

  const statusText =
    hiddenStores > 0
      ? `${activeStores} of ${totalStores} stores (${hiddenStores} hidden)`
      : `${totalStores} of ${totalStores} stores`;

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col gap-3 shadow-2xs font-sans">
      {/* 1. Top Header Row (Figma 225:91044) */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0F2340]">
          Availability
        </h2>
        <span className="text-[14px] leading-5 font-bold text-[#1F7A4D]">
          {statusText}
        </span>
      </div>

      {/* 2. Price Override Tag & Detail (Figma 225:91047) */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        <span className="h-6 px-2 rounded-[12px] inline-flex items-center text-[12px] leading-4 font-bold bg-[#E4F0FA] text-[#22629E]">
          Price override
        </span>
        <span className="text-[14px] leading-5 text-[#0F2340] font-normal">
          Mumbai · 3 stores · ₹{product.basePriceRupees + 10} (+₹10)
        </span>
      </div>
    </div>
  );
}
