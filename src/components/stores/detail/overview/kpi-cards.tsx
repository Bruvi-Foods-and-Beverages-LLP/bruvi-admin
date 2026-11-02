"use client";

import * as React from "react";
import { StoreOverviewMetrics } from "@/store/slices/stores-slice";

interface KpiCardsProps {
  kpi: StoreOverviewMetrics["kpi"];
}

export function KpiCards({ kpi }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {/* Card 1: Net Sales Today (Figma Node 225:86625) */}
      <div className="flex flex-col justify-between h-[126px] p-5 rounded-[16px] bg-navy-900 text-white shadow-sm transition-all hover:shadow-md">
        <span className="text-body-s text-text-inverse-secondary">Net sales today</span>
        <span className="text-price-m text-white">
          ₹{kpi.netSalesToday.toLocaleString("en-IN")}
        </span>
        <span className="text-caption font-medium text-success-on-dark flex items-center gap-1">
          {kpi.netSalesChangePercent > 0 ? (
            <>▲ {kpi.netSalesChangePercent}% · {kpi.netSalesRank}</>
          ) : (
            <>{kpi.netSalesRank}</>
          )}
        </span>
      </div>

      {/* Card 2: Orders (Figma Node 225:86629) */}
      <div className="flex flex-col justify-between h-[126px] p-5 rounded-[16px] bg-surface border border-border text-text shadow-sm transition-all hover:shadow-md">
        <span className="text-body-s text-text-muted">Orders</span>
        <span className="text-price-m text-text">
          {kpi.ordersCount}
        </span>
        <span className="text-caption font-medium text-text-muted">
          AOV ₹{kpi.aov} · {kpi.queueCount} in queue
        </span>
      </div>

      {/* Card 3: Avg make time (Figma Node 225:86633) */}
      <div className="flex flex-col justify-between h-[126px] p-5 rounded-[16px] bg-surface border border-border text-text shadow-sm transition-all hover:shadow-md">
        <span className="text-body-s text-text-muted">Avg make time</span>
        <span className="text-price-m text-text">
          {kpi.makeTimeFormatted}
        </span>
        <span className="text-caption font-medium text-warning">
          {kpi.makeTimeDiffFormatted}
        </span>
      </div>

      {/* Card 4: Rating · 30 days (Figma Node 225:86637) */}
      <div className="flex flex-col justify-between h-[126px] p-5 rounded-[16px] bg-surface border border-border text-text shadow-sm transition-all hover:shadow-md">
        <span className="text-body-s text-text-muted">Rating · 30 days</span>
        <span className="text-price-m text-text">
          {kpi.rating.toFixed(1)}
        </span>
        <span className="text-caption font-medium text-text-muted">
          {kpi.reviewCount.toLocaleString("en-IN")} reviews
        </span>
      </div>
    </div>
  );
}
