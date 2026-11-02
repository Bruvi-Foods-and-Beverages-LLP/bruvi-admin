"use client";

import * as React from "react";
import Image from "next/image";
import { CustomerPreview } from "@/types/store-hours";

interface CustomerPreviewCardProps {
  preview: CustomerPreview;
}

export function CustomerPreviewCard({ preview }: CustomerPreviewCardProps) {
  return (
    <div className="w-full rounded-[16px] bg-surface border border-[#dce2ea] p-[21px] flex flex-col gap-4 shadow-2xs">
      {/* Header (Figma Node 225:159804) */}
      <div>
        <h2 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">
          Customer preview
        </h2>
        <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5">
          How the store card reads in the BRUVI app right now
        </p>
      </div>

      {/* App Preview Card (Figma Node 225:87945: 358x100, bg: #f5f7fa, rounded-[16px], padding: 16px, gap: 16px) */}
      <div className="w-full h-[100px] rounded-[16px] bg-[#f5f7fa] p-4 flex items-center gap-4">
        {/* Thumbnail (Figma Node 225:87946: 64x64, rounded-[12px]) */}
        <div className="relative w-16 h-16 rounded-[12px] overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={preview.imageUrl || "/images/hours/customer_preview_thumb.png"}
            alt={preview.storeName}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        {/* Info (Figma Node 225:87947: gap: 4px) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Store Name: Manrope Bold 16px / 24px */}
          <h4 className="font-sans font-bold text-[16px] leading-[24px] text-[#0f2340] truncate">
            {preview.storeName}
          </h4>

          {/* Status Row: green dot (8x8) + Manrope Bold 14px / 20px (#1f7a4d) */}
          <div className="flex items-center gap-2 text-[#1f7a4d] mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#1f7a4d] shrink-0" />
            <span className="font-sans font-bold text-[14px] leading-[20px] truncate">
              {preview.statusText}
            </span>
          </div>

          {/* Cut-off & Pickup Time: Manrope Medium 12px / 16px (#3f4b5e) */}
          <p className="font-sans font-medium text-[12px] leading-[16px] text-[#3f4b5e] mt-0.5 truncate">
            {preview.detailText}
          </p>
        </div>
      </div>

      {/* Footnote Note (Figma Node 225:87953: Manrope Medium 12px / 16px (#55647a)) */}
      <p className="font-sans font-medium text-[12px] leading-[16px] text-[#55647a]">
        {preview.footnote}
      </p>
    </div>
  );
}
