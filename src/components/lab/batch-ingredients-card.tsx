"use client";

import * as React from "react";
import { Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { IngredientMetric } from "@/types/lab";

interface BatchIngredientsCardProps {
  ingredients?: IngredientMetric[];
}

const DEFAULT_INGREDIENTS: IngredientMetric[] = [
  {
    name: "Yuzu syrup · 25 ml",
    status: "SHORT",
    note: "≈ 1,140 cups at 25 ml · short 520 → reorder 18 btl from Monin India",
  },
  {
    name: "Matcha powder · Uji 500 g",
    status: "OK",
    note: "9.4 kg available across central depot · ok",
  },
  {
    name: "Tonic water · 200 ml can",
    status: "OK",
    note: "1,920 cans stocked at store fridges · ok",
  },
];

export function BatchIngredientsCard({ ingredients = DEFAULT_INGREDIENTS }: BatchIngredientsCardProps) {
  return (
    <div className="rounded-[16px] border border-[#dce2ea] bg-white p-5 shadow-2xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#dce2ea]">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-[#55647A]" />
          <h3 className="text-title text-[#0F2340]">Batch ingredients</h3>
        </div>
        <span className="text-caption text-[#55647A]">Bill of Materials (BOM)</span>
      </div>

      <div className="flex flex-col gap-3">
        {ingredients.map((ing, idx) => {
          const isShort = ing.status === "SHORT" || ing.status === "CRITICAL";
          return (
            <div
              key={idx}
              className={`p-3 rounded-[12px] border flex flex-col gap-1.5 ${
                isShort
                  ? "bg-[#FEF3E2]/50 border-[#FDE68A]"
                  : "bg-[#F5F7FA] border-[#EBEFF4]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-caption-bold text-[#0F2340]">{ing.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isShort
                      ? "bg-[#FEF3E2] text-[#B45309]"
                      : "bg-[#DCFCE7] text-[#15803D]"
                  }`}
                >
                  {isShort ? (
                    <AlertCircle className="h-3 w-3 stroke-[2.5]" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {ing.status}
                </span>
              </div>
              <p className="text-[12px] text-[#55647A] leading-relaxed">
                {ing.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

