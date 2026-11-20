"use client";

import * as React from "react";
import { Star, Store } from "lucide-react";
import { StoreMetric } from "@/types/lab";

interface StoreBreakdownCardProps {
  stores?: StoreMetric[];
}

const DEFAULT_STORES: StoreMetric[] = [
  { storeName: "Indiranagar", cupsSold: 520, rating: 4.6, repeatIntentPct: 68 },
  { storeName: "Koramangala", cupsSold: 470, rating: 4.5, repeatIntentPct: 64 },
  { storeName: "Bandra", cupsSold: 430, rating: 4.3, repeatIntentPct: 56 },
  { storeName: "Lower Parel", cupsSold: 360, rating: 4.4, repeatIntentPct: 58 },
  { storeName: "HSR Layout", cupsSold: 300, rating: 4.5, repeatIntentPct: 62 },
  { storeName: "Cyber Hub", cupsSold: 260, rating: 4.7, repeatIntentPct: 70 },
];

export function StoreBreakdownCard({ stores = DEFAULT_STORES }: StoreBreakdownCardProps) {
  const maxSold = Math.max(...stores.map((s) => s.cupsSold), 550);

  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#dce2ea]">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-[#55647A]" />
          <h3 className="text-title text-[#0F2340]">Stores · {stores.length}</h3>
        </div>
        <span className="text-caption text-[#55647A]">Ranked by volume</span>
      </div>

      <div className="flex flex-col gap-3">
        {stores.map((s, idx) => {
          const widthPct = Math.round((s.cupsSold / maxSold) * 100);
          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-caption-bold">
                <span className="text-[#0F2340]">{s.storeName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-price-xs text-[#0F2340]">
                    {s.cupsSold} cups
                  </span>
                  <span className="text-caption font-semibold text-[#55647A] flex items-center gap-0.5">
                    ★ {s.rating}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      s.repeatIntentPct >= 60 ? "text-[#15803D]" : "text-[#B45309]"
                    }`}
                  >
                    {s.repeatIntentPct}% rep
                  </span>
                </div>
              </div>

              <div className="w-full bg-[#EBEFF4] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1C3A66] h-full rounded-full transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

