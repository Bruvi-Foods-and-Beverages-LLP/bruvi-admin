"use client";

import * as React from "react";
import Link from "next/link";
import { CatalogProduct } from "@/types/catalog";
import { useProductPerformance } from "@/hooks/use-product-performance";

interface ProductPerformanceCardProps {
  product: CatalogProduct;
}

const CHART_HEIGHT_PX = 96;
const MIN_BAR_PX = 4;

const rupees = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function formatUpdated(iso: string | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
}

/**
 * Performance Analytics Card (Figma 225:90992)
 * Real KPIs from paid orders: units sold today, 7-day volume, realised margin, top store and
 * most-picked modifier. Numbers refresh every 30 s; nothing here is hardcoded.
 */
export function ProductPerformanceCard({ product }: ProductPerformanceCardProps) {
  const { data, loading, error } = useProductPerformance(product.id);

  const maxUnits = Math.max(1, ...(data?.series.map((p) => p.units) ?? [0]));
  const hasAnySales = (data?.series.some((p) => p.units > 0) ?? false);
  const change = data?.changePercent ?? null;

  return (
    <div className="w-full rounded-[16px] border border-[#DCE2EA] bg-white p-[21px] flex flex-col gap-5 shadow-2xs font-sans">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[18px] leading-[26px] font-extrabold text-[#0F2340]">
          Performance
        </h2>
        <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
          {data
            ? `${data.scope.label} · updated ${formatUpdated(data.updatedAt)}`
            : loading
              ? "Loading…"
              : "Unavailable"}
        </span>
      </div>

      {error && !data ? (
        <p role="alert" className="font-sans text-[13px] leading-5 text-[#B42318]">
          Couldn&apos;t load performance data. {error}
        </p>
      ) : null}

      {/* 2. Top Metric Banner */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[14px] leading-5 font-normal text-[#3F4B5E]">
            Sold today
          </span>
          <span
            className={`font-metric text-[40px] leading-[44px] tracking-tight text-[#0F2340] ${loading ? "animate-pulse" : ""}`}
          >
            {data ? data.soldToday.toLocaleString("en-IN") : "–"}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          {data && change !== null ? (
            <span
              className={`font-sans text-[12px] leading-4 font-bold tracking-[-0.13px] ${change >= 0 ? "text-[#1F7A4D]" : "text-[#B42318]"}`}
            >
              {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% {data.comparisonLabel}
            </span>
          ) : data ? (
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              No sales {data.comparisonLabel.replace("vs ", "")}
            </span>
          ) : null}
          {data && data.categorySharePercent !== null ? (
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {data.categorySharePercent}% of its category
            </span>
          ) : null}
        </div>
      </div>

      {/* 3. Volume chart */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="h-24 flex items-end gap-2 w-full">
          {(data?.series ?? []).map((bar) => (
            <div
              key={bar.date}
              className="flex-1 flex flex-col justify-end items-center h-full"
              title={`${bar.label}: ${bar.units} sold · ₹${rupees(bar.revenueRupees)}`}
            >
              <div
                className={`w-full rounded-[4px] transition-all ${bar.isToday ? "bg-[#1C3A66]" : "bg-[#A9D8F3]"}`}
                style={{
                  height: `${bar.units > 0 ? Math.max(MIN_BAR_PX, Math.round((bar.units / maxUnits) * CHART_HEIGHT_PX)) : MIN_BAR_PX}px`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full text-center">
          {(data?.series ?? []).map((bar) => (
            <span
              key={bar.date}
              className={`flex-1 font-sans text-[12px] leading-4 ${bar.isToday ? "font-bold text-[#0F2340]" : "font-medium text-[#55647A]"}`}
            >
              {bar.label}
            </span>
          ))}
        </div>

        {data && !hasAnySales ? (
          <p className="font-sans text-[12px] leading-4 font-medium text-[#55647A] text-center">
            No paid orders for this product in the last {data.series.length} days.
          </p>
        ) : null}
      </div>

      {/* 4. Breakdown rows */}
      <div className="flex flex-col divide-y divide-[#DCE2EA] pt-1">
        {/* Gross margin */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Gross margin
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {data?.margin.unitCostRupees != null
                ? `Cost ₹${rupees(data.margin.unitCostRupees)} · ${
                    data.margin.basis === "REALISED_30D"
                      ? `${data.margin.unitsSampled} sold, 30 days`
                      : "recipe estimate"
                  }`
                : "No recipe cost set"}
            </span>
          </div>
          <span className="font-metric text-[16px] leading-6 tracking-[-0.48px] text-[#0F2340]">
            {data?.margin.percent != null ? `${data.margin.percent}%` : "–"}
          </span>
        </div>

        {/* Top store */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Top store
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {data?.topStore
                ? `${data.topStore.name} · ${data.topStore.unitsToday} sold today`
                : "No sales today"}
            </span>
          </div>
          {data?.topStore ? (
            <Link
              href={`/stores/${data.topStore.outletId}`}
              className="font-sans text-[14px] leading-5 font-bold tracking-[-0.24px] text-[#1C3A66] hover:underline cursor-pointer"
            >
              View →
            </Link>
          ) : null}
        </div>

        {/* Most-picked modifier */}
        <div className="h-12 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans text-[14px] leading-5 font-normal text-[#0F2340]">
              Most-picked modifier
            </span>
            <span className="font-sans text-[12px] leading-4 font-medium text-[#3F4B5E]">
              {data?.topModifier
                ? `${data.topModifier.group} · ${data.topModifier.option}`
                : "No modifier data yet"}
            </span>
          </div>
          <span className="font-metric text-[16px] leading-6 tracking-[-0.48px] text-[#0F2340]">
            {data?.topModifier ? `${data.topModifier.sharePercent}%` : "–"}
          </span>
        </div>
      </div>
    </div>
  );
}
