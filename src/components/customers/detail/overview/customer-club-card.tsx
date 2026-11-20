"use client";

import * as React from "react";
import { CustomerSubscription } from "@/types/customers";

interface CustomerClubCardProps {
  subscription: CustomerSubscription | null;
}

export function CustomerClubCard({ subscription }: CustomerClubCardProps) {
  if (!subscription || subscription.status === "None") {
    return (
      <div className="w-full rounded-[16px] bg-[#0f2340] text-white p-5 flex flex-col gap-3 shadow-2xs">
        <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[1.54px] text-[#9fb6d6]">
          BRUVI Club
        </span>
        <h4 className="font-sans font-extrabold text-[18px] leading-[26px] text-white [font-variation-settings:'wght'_800]">
          No Active Subscription
        </h4>
        <p className="font-sans text-[12px] leading-4 text-[#9fb6d6]">
          Guest has not enrolled in BRUVI Club Daily or Club Pro yet.
        </p>
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((subscription.usedDrinks / Math.max(1, subscription.totalDrinks)) * 100)
  );

  return (
    <div className="w-full rounded-[16px] bg-[#0f2340] text-white p-5 flex flex-col gap-3 shadow-2xs select-none">
      {/* Top Header Row (Figma 474:239891) */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[1.54px] text-[#9fb6d6]">
            BRUVI Club
          </span>
          <h4 className="font-sans font-extrabold text-[18px] leading-[26px] text-white tracking-tight [font-variation-settings:'wght'_800]">
            {subscription.planName}
          </h4>
        </div>

        {/* Active Badge (Figma 474:239895) */}
        <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#15803d]/30 text-[#7fd3a2] font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700]">
          {subscription.status}
        </span>
      </div>

      {/* Free Drinks Progress Section (Figma 474:239897) */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between text-[14px] leading-5">
          <span className="font-sans font-normal text-[#cde9f9] [font-variation-settings:'wght'_400]">
            Free drinks this cycle
          </span>
          <span className="font-sans font-bold text-white [font-variation-settings:'wght'_700]">
            {subscription.usedDrinks} of {subscription.totalDrinks}
          </span>
        </div>

        {/* Progress Bar (8px height) */}
        <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#a9d8f3] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cycle & Renewal Footer Meta (Figma 474:239903) */}
      <p className="font-sans font-medium text-[12px] leading-4 text-[#9fb6d6] pt-1 [font-variation-settings:'wght'_500]">
        {subscription.cycleText}
      </p>
    </div>
  );
}

