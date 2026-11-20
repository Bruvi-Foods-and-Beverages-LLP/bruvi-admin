"use client";

import * as React from "react";
import Image from "next/image";
import { Coffee, Sparkles } from "lucide-react";

interface MobilePreviewProps {
  batchNumber?: string;
  name?: string;
  price?: number | string;
  description?: string;
  imagePath?: string;
  startDateText?: string;
}

/**
 * MobilePreviewCard - A091 App Teaser Preview
 * Exact match to Figma Node #474:244854
 */
export function MobilePreviewCard({
  batchNumber = "08",
  name,
  price,
  description,
  imagePath,
  startDateText = "Mon 12 Oct",
}: MobilePreviewProps) {
  const displayTitle = name?.trim() || "Pandan Coconut Cold Brew";
  const displayPrice = price ? `₹${price}` : "₹280";
  const displayDesc =
    description?.trim() ||
    "Grassy, vanilla-sweet and nutty. Only at Indiranagar & Bandra, only 900 cups.";

  return (
    <div className="rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col gap-4">
      {/* Card Header Row (#474:244855) */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold tracking-[0.04em] uppercase text-[#3F4B5E] font-sans">
          App teaser preview
        </span>
        <span className="text-[12px] font-medium text-[#3F4B5E] font-sans">
          Shows from 9 Oct
        </span>
      </div>

      {/* Simulated Mobile Card (#474:244858) */}
      <div className="w-full rounded-[24px] bg-[#1C3A66] overflow-hidden shadow-[0px_4px_12px_rgba(15,35,64,0.08),0px_12px_32px_rgba(15,35,64,0.08)] flex flex-col">
        {/* Top Image Container with Batch Pill (#474:244859) */}
        <div className="relative w-full h-[250px] bg-[#0F2340] overflow-hidden flex items-center justify-center">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={displayTitle}
              fill
              className="object-cover"
              priority
              unoptimized={imagePath.startsWith("blob:") || imagePath.startsWith("data:")}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#A9D8F3] mb-2">
                <Coffee className="w-7 h-7 stroke-[1.5]" />
              </div>
              <span className="text-[12px] font-medium text-[#A9D8F3]/80 font-sans">
                Upload hero image from system
              </span>
            </div>
          )}

          {/* Batch Pill Badge (#474:244860) */}
          <div className="absolute top-4 left-4 h-6 px-2 rounded-[12px] bg-[#566F2C] text-white flex items-center justify-center shadow-xs z-10">
            <span className="text-[12px] font-bold font-sans">
              BRUVI LAB · Batch {batchNumber || "08"}
            </span>
          </div>
        </div>

        {/* Content Body (#474:244862) */}
        <div className="p-5 flex flex-col gap-2">
          {/* Overline (#474:244863) */}
          <div className="text-[11px] leading-[14px] tracking-[0.14em] uppercase text-[#A9D8F3] font-serif">
            Coming {startDateText}
          </div>

          {/* Product Title (#474:244864) */}
          <h3 className="text-[24px] leading-[32px] tracking-[-0.03em] font-black text-white font-display truncate">
            {displayTitle}
          </h3>

          {/* Product Description (#474:244865) */}
          <p className="text-[14px] leading-[20px] text-[#CDE9F9] font-sans line-clamp-3">
            {displayDesc}
          </p>

          {/* Bottom Price & Action Row (#474:244866) */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[20px] leading-[28px] tracking-[-0.03em] font-extrabold text-white font-display">
              {displayPrice}
            </span>
            <button
              type="button"
              className="h-9 px-4 rounded-[12px] bg-[#A9D8F3] hover:bg-[#92ccf0] text-[14px] font-bold text-[#0F2340] font-sans transition-colors cursor-pointer"
            >
              Notify me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
