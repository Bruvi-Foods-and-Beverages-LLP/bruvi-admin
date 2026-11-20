"use client";

import * as React from "react";
import { CustomerKpiMetrics } from "@/types/customers";

interface CustomerKpiCardsProps {
  metrics: CustomerKpiMetrics;
}

export function CustomerKpiCards({ metrics }: CustomerKpiCardsProps) {
  const cards = [
    {
      label: "Lifetime spend",
      value: `₹${metrics.lifetimeSpend.toLocaleString("en-IN")}`,
      subtitle: metrics.lifetimeSpendSubtitle,
    },
    {
      label: "Visits",
      value: metrics.visits.toString(),
      subtitle: metrics.visitsSubtitle,
    },
    {
      label: "Avg order value",
      value: `₹${metrics.avgOrderValue.toLocaleString("en-IN")}`,
      subtitle: metrics.avgOrderValueSubtitle,
    },
    {
      label: "Wallet",
      value: `₹${metrics.walletBalance.toLocaleString("en-IN")}`,
      subtitle: metrics.walletBalanceSubtitle,
    },
  ];

  return (
    <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#dce2ea]">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 md:py-4 md:px-5 h-[104px]"
          >
            {/* Top Label */}
            <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_700]">
              {card.label}
            </span>

            {/* Central Metric Value */}
            <span className="font-display font-extrabold text-[20px] leading-7 text-[#0f2340] tracking-tight tnum [font-variation-settings:'wdth'_112,'wght'_800] [font-feature-settings:'tnum'_1]">
              {card.value}
            </span>

            {/* Bottom Subtitle / Context */}
            <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] truncate [font-variation-settings:'wght'_500]">
              {card.subtitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

