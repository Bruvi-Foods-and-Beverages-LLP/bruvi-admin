"use client";

import * as React from "react";
import { useAppSelector } from "@/store";

/**
 * Customers 4 KPI Stat Cards (Figma 225:103347)
 * Registered, Monthly active, Repeat rate · 30 day, Avg lifetime value
 */
export function CustomersStatCards() {
  const { stats, isLoading } = useAppSelector((state) => state.customers);

  const cards = [
    {
      id: "registered",
      label: "Registered",
      value: stats?.registeredText ?? "—",
      subtitle: stats?.registeredDelta ?? "",
      subtitleColor: "text-[#00875a]", // green success
    },
    {
      id: "monthly_active",
      label: "Monthly active",
      value: stats?.monthlyActive ?? "—",
      subtitle: stats?.monthlyActiveSubtitle ?? "",
      subtitleColor: "text-[#3f4b5e]", // secondary
    },
    {
      id: "repeat_rate",
      label: "Repeat rate · 30 day",
      value: stats?.repeatRate ?? "—",
      subtitle: stats?.repeatRateSubtitle ?? "",
      subtitleColor: "text-[#00875a]", // green success
    },
    {
      id: "avg_ltv",
      label: "Avg lifetime value",
      value: stats?.avgLtv ?? "—",
      subtitle: stats?.avgLtvSubtitle ?? "",
      subtitleColor: "text-[#3f4b5e]", // secondary
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => (
        <div
          key={card.id}
          className="w-full min-h-[116px] rounded-[16px] border border-[#dce2ea] bg-white p-[17px_21px] flex flex-col justify-between shadow-2xs hover:border-[#bcc6d3] transition-colors select-none"
        >
          <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_700]">
            {card.label}
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-display font-extrabold text-[32px] leading-[38px] text-[#0f2340] tracking-[-0.64px] [font-variation-settings:'wdth'_112,'wght'_800]">
              {card.value}
            </span>
            <span
              className={`font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700] ${card.subtitleColor}`}
            >
              {card.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

