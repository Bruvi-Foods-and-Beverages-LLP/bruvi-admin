"use client";

import * as React from "react";
import { CatalogProduct } from "@/types/catalog";
import { ProductImage } from "@/components/catalog/product-image";

interface ProductSummaryCardProps {
  product: CatalogProduct;
}

/**
 * Product Summary Top Left Card (Figma 225:90917)
 * 160x160 Hero Image + Description + 4 Financial/Operational Metric Columns
 */
export function ProductSummaryCard({ product }: ProductSummaryCardProps) {
  // Format channels string
  const activeChannels: string[] = [];
  if (product.channelCounter) activeChannels.push("Counter");
  if (product.channelKiosk) activeChannels.push("Kiosk");
  if (product.channelApp) activeChannels.push("App");
  if (product.channelQr) activeChannels.push("QR");

  const channelsDisplay =
    activeChannels.length > 0 ? activeChannels.join(" · ") : "All channels";

  const prepStationDisplay =
    product.prepStation === "BAR" ? "Bar" : "Kitchen";

  const description =
    product.longDescription ||
    product.shortDescription ||
    "Slow-steeped Đắk Lắk robusta cold brew over condensed milk and ice, crowned with a lightly salted cream foam. Bold, silky, a little savoury — our most-ordered drink.";

  // High quality hero asset with local fallback

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col sm:flex-row gap-6 shadow-2xs font-sans">
      {/* 1. Hero Image 160x160 (Figma 225:90918) */}
      <div className="relative w-[160px] h-[160px] rounded-[12px] bg-[#F5F7FA] border border-[#DCE2EA] overflow-hidden shrink-0 flex items-center justify-center">
        <ProductImage src={product.imageUrl} alt={product.name} sizes="160px" iconSize={48} />
      </div>

      {/* 2. Details Column (Figma 225:90919) */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-4">
        {/* Description Section (Figma 225:90920) */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] leading-4 font-bold tracking-[0.48px] uppercase text-[#3F4B5E]">
            Description
          </span>
          <p className="text-[14px] leading-5 text-[#0F2340] font-normal line-clamp-3">
            {description}
          </p>
        </div>

        {/* 4 Metrics Row (Figma 225:90923 - gap: 32px) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-1 border-t border-[#F5F7FA]">
          {/* Col 1: Base price */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Base price
            </span>
            <span className="text-[20px] leading-7 font-extrabold tracking-[-0.6px] text-[#0F2340] font-archivo tnum">
              ₹{product.basePriceRupees}
            </span>
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {product.isTaxInclusive ? "Tax inclusive" : "Tax exclusive"}
            </span>
          </div>

          {/* Col 2: Tax class */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Tax class
            </span>
            <span className="text-[14px] leading-5 font-bold text-[#0F2340]">
              GST {product.taxRatePercent}%
            </span>
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              HSN {product.hsnCode || "2101"}
            </span>
          </div>

          {/* Col 3: Prep station */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Prep station
            </span>
            <span className="text-[14px] leading-5 font-bold text-[#0F2340]">
              {prepStationDisplay}
            </span>
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Recipe v4 · Large
            </span>
          </div>

          {/* Col 4: Channels */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              Channels
            </span>
            <span className="text-[14px] leading-5 font-bold text-[#0F2340] truncate" title={channelsDisplay}>
              {channelsDisplay}
            </span>
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              All 12 stores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
