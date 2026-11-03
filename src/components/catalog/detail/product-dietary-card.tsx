"use client";

import * as React from "react";
import { CatalogProduct } from "@/types/catalog";

interface ProductDietaryCardProps {
  product: CatalogProduct;
}

function VegIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="0.75"
        y="0.75"
        width="18.5"
        height="18.5"
        rx="4"
        stroke="#1F8A3B"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="10" r="4" fill="#1F8A3B" />
    </svg>
  );
}

function NonVegIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="0.75"
        y="0.75"
        width="18.5"
        height="18.5"
        rx="4"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />
      <polygon points="10,5 15,15 5,15" fill="#B91C1C" />
    </svg>
  );
}

/**
 * Dietary & Allergens Card (Figma 225:90941)
 * Displays Vegetarian/Vegan status, Allergen chips (Milk, Nuts, Caffeine), and customer notice
 */
export function ProductDietaryCard({ product }: ProductDietaryCardProps) {
  const isVeg = product.isVegetarian ?? true;
  const isVegan = product.isVegan ?? false;
  const containsDairy = product.containsDairy ?? true;
  const containsNuts = product.containsNuts ?? false;
  const caffeineMg = product.caffeineMg || 180;

  // Subtitle under Veg/NonVeg
  let vegSubtitle = "Vegetarian drink";
  if (isVegan) {
    vegSubtitle = "100% Plant-based · vegan";
  } else if (containsDairy) {
    vegSubtitle = "Contains dairy · not vegan";
  } else if (!isVeg) {
    vegSubtitle = "Non-vegetarian recipe";
  }

  return (
    <div className="w-full sm:w-[320px] rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col justify-between shadow-2xs font-sans min-h-[348px]">
      <div className="flex flex-col gap-4">
        {/* Title (Figma 225:90942) */}
        <h2 className="text-[18px] leading-[26px] font-extrabold text-[#0F2340]">
          Dietary & allergens
        </h2>

        {/* Vegetarian / Vegan Status (Figma 225:90943) */}
        <div className="flex items-center gap-3">
          {isVeg ? (
            <VegIcon className="h-5 w-5 shrink-0" />
          ) : (
            <NonVegIcon className="h-5 w-5 shrink-0" />
          )}
          <div className="flex flex-col">
            <span className="text-[14px] leading-5 font-bold text-[#0F2340]">
              {isVeg ? (isVegan ? "Vegan" : "Vegetarian") : "Non-vegetarian"}
            </span>
            <span className="text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {vegSubtitle}
            </span>
          </div>
        </div>

        {/* Allergens Section (Figma 225:90949) */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-[12px] leading-4 font-bold tracking-[0.48px] uppercase text-[#3F4B5E]">
            Allergens
          </span>

          <div className="flex flex-wrap gap-2">
            {/* Milk Badge (Figma 225:90952) */}
            {containsDairy && (
              <span className="h-6 px-2 rounded-[12px] inline-flex items-center text-[12px] leading-4 font-bold bg-[#FDF0D8] text-[#9A5B00]">
                Milk
              </span>
            )}

            {/* Tree nuts Chip (Figma 225:90954) */}
            <span className="h-6 px-[9px] rounded-[12px] border border-[#DCE2EA] inline-flex items-center text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {containsNuts ? "Tree nuts" : "Tree nuts · via Almond milk"}
            </span>

            {/* Caffeine Chip (Figma 225:90956) */}
            {product.isCaffeinated !== false && (
              <span className="h-6 px-[9px] rounded-[12px] border border-[#DCE2EA] inline-flex items-center text-[12px] leading-4 font-medium text-[#3F4B5E]">
                Caffeine {caffeineMg} mg
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Helper Text (Figma 225:90958) */}
      <p className="text-[12px] leading-4 font-medium text-[#55647A] pt-4 mt-auto">
        Shown on app, kiosk and printed receipts.
      </p>
    </div>
  );
}
