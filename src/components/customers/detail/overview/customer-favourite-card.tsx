"use client";

import * as React from "react";
import { CustomerFavouriteDrink } from "@/types/customers";
import { ProductImage } from "@/components/catalog/product-image";

interface CustomerFavouriteCardProps {
  favourite: CustomerFavouriteDrink | null;
}

export function CustomerFavouriteCard({ favourite }: CustomerFavouriteCardProps) {
  if (!favourite) {
    return (
      <div className="w-full rounded-[16px] bg-[#f7f2e8] border border-[#ece3d2] p-5 flex flex-col gap-1">
        <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[1.54px] text-[#3f4b5e]">
          Favourite
        </span>
        <p className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">No orders yet</p>
        <p className="font-sans text-[14px] leading-5 text-[#3f4b5e]">
          A favourite drink appears here once this customer has placed an order.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[16px] bg-[#f7f2e8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-[#ece3d2] shadow-2xs">
      <div className="flex items-center gap-5 min-w-0">
        <div className="relative h-16 w-16 rounded-[12px] bg-white border border-[#dce2ea] overflow-hidden shrink-0 flex items-center justify-center">
          <ProductImage src={favourite.imageUrl} alt={favourite.title} sizes="64px" iconSize={24} />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[1.54px] text-[#3f4b5e]">
            {favourite.overline}
          </span>
          <h3 className="font-sans font-extrabold text-[20px] leading-7 text-[#0f2340] truncate">{favourite.title}</h3>
          {favourite.customization && (
            <p className="font-sans text-[14px] leading-5 text-[#3f4b5e] line-clamp-2">{favourite.customization}</p>
          )}
        </div>
      </div>

      {favourite.price > 0 && (
        <div className="flex flex-col sm:items-end justify-center shrink-0">
          <span className="font-display font-extrabold text-[20px] leading-7 text-[#0f2340] tnum [font-variation-settings:'wdth'_112,'wght'_800]">
            ₹{favourite.price.toLocaleString("en-IN")}
          </span>
          {favourite.priceBreakdown && (
            <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] whitespace-nowrap">
              {favourite.priceBreakdown}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
