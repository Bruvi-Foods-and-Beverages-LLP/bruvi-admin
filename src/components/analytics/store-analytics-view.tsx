"use client";

import * as React from "react";
import Link from "next/link";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AnalyticsModuleHeader,
  AnalyticsTabBar,
} from "@/components/analytics/analytics-header-and-tabs";
import { BruviChartTooltipCard } from "@/components/charts/bruvi-chart-primitives";
import { STORE_ANALYTICS_RANKING } from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

const HOURS_LABELS = [
  "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p",
  "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p",
];

export function StoreAnalyticsView() {
  const [selectedId, setSelectedId] = React.useState("ind");
  const [sortBy, setSortBy] = React.useState<"netSales" | "rating" | "delta">(
    "netSales",
  );
  const [notice, setNotice] = React.useState<string | null>(null);

  const sortedStores = React.useMemo(() => {
    const copy = [...STORE_ANALYTICS_RANKING];
    if (sortBy === "rating") copy.sort((a, b) => b.rating - a.rating);
    if (sortBy === "delta") copy.sort((a, b) => b.deltaAugPct - a.deltaAugPct);
    return copy;
  }, [sortBy]);

  const selected =
    STORE_ANALYTICS_RANKING.find((s) => s.id === selectedId) ??
    STORE_ANALYTICS_RANKING[0];
  const maxSales = Math.max(...STORE_ANALYTICS_RANKING.map((s) => s.netSalesLakh));
  const peakIdx = selected.hourlySales.indexOf(Math.max(...selected.hourlySales));
  const hourlyData = selected.hourlySales.map((val, idx) => ({
    hour: HOURS_LABELS[idx],
    val,
    isPeak: idx >= 1 && idx <= 3,
    isExactPeak: idx === peakIdx,
  }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 1–30, 2026 VS AUG"
        title="Store analytics"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported 12-store ranking CSV")}
            >
              Export CSV
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setNotice(`Comparing ${selected.name} against network median`)
              }
            >
              Compare stores
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="stores" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 items-start">
        {/* Left: Ranked Leaderboard */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                All stores ranked by net sales
              </h2>
              <p className="text-[12px] text-text-muted">
                September · bar = net sales vs best store · Δ vs August
              </p>
            </div>
            <select
              aria-label="Sort stores"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "netSales" | "rating" | "delta")
              }
              className="h-8 px-2.5 rounded-lg border border-border-input bg-white text-[12px] font-bold text-primary cursor-pointer"
            >
              <option value="netSales">Sort: Net sales</option>
              <option value="rating">Sort: Rating</option>
              <option value="delta">Sort: Δ Aug</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[660px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2.5 pl-5 pr-2">#</th>
                  <th className="py-2.5 px-2">Store</th>
                  <th className="py-2.5 px-2">Net sales</th>
                  <th className="py-2.5 px-2 text-right">Orders</th>
                  <th className="py-2.5 px-2 text-right">AOV</th>
                  <th className="py-2.5 px-2 text-right">Make</th>
                  <th className="py-2.5 px-2 text-right">Rating</th>
                  <th className="py-2.5 pl-2 pr-5 text-right">Δ Aug</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedStores.map((st) => {
                  const active = st.id === selected.id;
                  const barPct = Math.round((st.netSalesLakh / maxSales) * 100);
                  return (
                    <tr
                      key={st.id}
                      onClick={() => setSelectedId(st.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        active ? "bg-surface-brand/70" : "hover:bg-background-subtle/60",
                      )}
                    >
                      <td className="py-2.5 pl-5 pr-2 text-[12px] font-bold text-text-muted tnum">
                        {st.rank}
                      </td>
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-text">
                          {st.name}
                        </span>
                        <span className="ml-1.5 text-[11px] text-text-muted">
                          {st.city}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-2 w-24 rounded-full bg-background-subtle overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                          <span className="text-[13px] font-extrabold text-text tnum">
                            ₹{st.netSalesLakh.toFixed(1)} L
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        {st.orders.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        ₹{st.aovInr}
                      </td>
                      <td
                        className={cn(
                          "py-2.5 px-2 text-right text-[12px] font-bold tnum",
                          st.makeTimeAlert ? "text-error" : "text-text-secondary",
                        )}
                      >
                        {st.makeTime}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[12px] font-bold tnum whitespace-nowrap">
                        <span
                          className={
                            st.rating < 4.3 ? "text-warning" : "text-text"
                          }
                        >
                          ★ {st.rating.toFixed(1)}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "py-2.5 pl-2 pr-5 text-right text-[12px] font-extrabold tnum whitespace-nowrap",
                          st.deltaAugPct >= 0 ? "text-success" : "text-error",
                        )}
                      >
                        {st.deltaAugPct >= 0 ? "▲" : "▼"}{" "}
                        {Math.abs(st.deltaAugPct).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Selected Store Inspector */}
        <Card className="p-5 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-text-muted">
                {selected.code} · {selected.tierLabel} · {selected.manager}
              </p>
              <h2 className="text-price-m font-display font-extrabold text-text mt-0.5">
                {selected.name}
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-success-surface text-success px-2.5 py-0.5 text-[11px] font-bold tnum">
              #{selected.rank} of 12
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-background-subtle p-3">
              <span className="block text-[11px] text-text-muted">Net sales</span>
              <span className="block text-[18px] font-display font-extrabold text-text tnum">
                ₹{selected.netSalesLakh.toFixed(1)} L
              </span>
              <span
                className={cn(
                  "text-[11px] font-bold tnum",
                  selected.deltaAugPct >= 0 ? "text-success" : "text-error",
                )}
              >
                {selected.deltaAugPct >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(selected.deltaAugPct).toFixed(1)}% vs Aug
              </span>
            </div>

            <div className="rounded-xl bg-background-subtle p-3">
              <span className="block text-[11px] text-text-muted">Orders</span>
              <span className="block text-[18px] font-display font-extrabold text-text tnum">
                {selected.orders.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-bold text-success tnum">
                ▲ {selected.ordersDeltaPct}%
              </span>
            </div>

            <div className="rounded-xl bg-background-subtle p-3">
              <span className="block text-[11px] text-text-muted">AOV</span>
              <span className="block text-[18px] font-display font-extrabold text-text tnum">
                ₹{selected.aovInr}
              </span>
              <span className="text-[11px] font-bold text-success tnum">
                ▲ {selected.aovDeltaPct}%
              </span>
            </div>

            <div className="rounded-xl bg-background-subtle p-3">
              <span className="block text-[11px] text-text-muted">Make time</span>
              <span className="block text-[18px] font-display font-extrabold text-text tnum">
                {selected.makeTime}
              </span>
              <span className="text-[11px] font-bold text-warning tnum">
                ▲ {selected.makeTimeTarget}
              </span>
            </div>
          </div>

          {/* Hourly Sales Bar Chart */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-extrabold text-text">
                Sales by hour · avg day
              </span>
              <span className="text-text-muted">Peak 9–10 am</span>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="hour"
                    ticks={["7a", "10a", "1p", "4p", "7p", "10p"]}
                    tick={{ fontSize: 10, fill: "#55647a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <BruviChartTooltipCard
                          items={[{ label: d.hour, value: `${d.val} orders/hr` }]}
                        />
                      );
                    }}
                  />
                  <Bar dataKey="val" radius={[3, 3, 0, 0]}>
                    {hourlyData.map((entry) => (
                      <Cell
                        key={entry.hour}
                        fill={entry.isPeak ? "#0f2340" : "#a9d8f3"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-extrabold text-text">Top products</span>
              <span className="text-text-muted">Share of drinks</span>
            </div>
            {selected.topProducts.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between gap-2 text-[12px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      p.tone === "coffee"
                        ? "bg-category-coffee-surface text-category-coffee"
                        : "bg-category-matcha-surface text-category-matcha",
                    )}
                  >
                    <BruviIcon
                      name={p.tone === "coffee" ? "coffee" : "leaf"}
                      size={15}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-text truncate">{p.name}</p>
                    <p className="text-[11px] text-text-muted tnum">
                      {p.sold.toLocaleString("en-IN")} sold
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-text tnum">
                  {p.sharePct}%
                </span>
              </div>
            ))}
          </div>

          <Button asChild variant="workspace" size="compact">
            <Link href="/stores">Open {selected.name} report</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
