"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AnalyticsModuleHeader,
  AnalyticsTabBar,
} from "@/components/analytics/analytics-header-and-tabs";
import { BruviChartTooltipCard } from "@/components/charts/bruvi-chart-primitives";
import {
  LTV_CHANNELS,
  ORDER_FREQUENCY_BINS,
  RFM_SEGMENTS,
  WEEKLY_CUSTOMER_ORDERS,
} from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

export function CustomerAnalyticsView() {
  const [selectedRfmId, setSelectedRfmId] = React.useState("at-risk");
  const [notice, setNotice] = React.useState<string | null>(null);

  const selectedRfm =
    RFM_SEGMENTS.find((r) => r.id === selectedRfmId) ?? RFM_SEGMENTS[2];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 1–30, 2026 VS AUG"
        title="Customer analytics"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported Customer Analytics CSV")}
            >
              Export CSV
            </Button>
            <Button asChild size="compact">
              <Link href="/marketing">Create audience</Link>
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="customers" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-baseline justify-between gap-2">
          <div>
            <span className="block text-[13px] font-medium text-text-muted">
              Monthly active
            </span>
            <span className="text-price-l font-display font-extrabold text-text tnum">
              62,400
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-success tnum">
            ▲ 5.2%
          </span>
        </Card>

        <Card className="p-5 flex items-baseline justify-between gap-2">
          <div>
            <span className="block text-[13px] font-medium text-text-muted">
              New customers
            </span>
            <span className="text-price-l font-display font-extrabold text-text tnum">
              14,820
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-success tnum">
            ▲ 8.4%
          </span>
        </Card>

        <Card className="p-5 flex items-baseline justify-between gap-2">
          <div>
            <span className="block text-[13px] font-medium text-text-muted">
              Repeat rate · 30-day
            </span>
            <span className="text-price-l font-display font-extrabold text-text tnum">
              46%
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-success tnum">
            ▲ 2 pts
          </span>
        </Card>

        <Card className="p-5 flex items-baseline justify-between gap-2">
          <div>
            <span className="block text-[13px] font-medium text-text-muted">
              Orders per active
            </span>
            <span className="text-price-l font-display font-extrabold text-text tnum">
              1.5
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-success tnum">
            ▲ 0.1
          </span>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-5 items-start">
        {/* Left: 2 Charts + LTV Table */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* New vs Returning Stacked Column Chart */}
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-sans text-[15px] font-extrabold text-text">
                    New vs returning
                  </h2>
                  <p className="text-[11px] text-text-muted">
                    Orders by week · 63% from returning
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-[10px] font-semibold text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-surface-inverse" />
                    Returning
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    New
                  </span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={WEEKLY_CUSTOMER_ORDERS}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "#55647a" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <BruviChartTooltipCard
                            title={`Week ${d.week} Sep (${d.totalK}k)`}
                            items={[
                              { label: "Returning", value: `${d.returningK}k`, dotColor: "#0f2340" },
                              { label: "New", value: `${d.newK}k`, dotColor: "#a9d8f3" },
                            ]}
                          />
                        );
                      }}
                    />
                    <Bar dataKey="newK" stackId="a" fill="#a9d8f3" />
                    <Bar dataKey="returningK" stackId="a" fill="#0f2340" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Order Frequency Histogram */}
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-sans text-[15px] font-extrabold text-text">
                    Order frequency
                  </h2>
                  <p className="text-[11px] text-text-muted">
                    Orders per active · 25% are regulars
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-[10px] font-semibold text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-surface-inverse" />
                    Regulars 4+
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Occasional
                  </span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ORDER_FREQUENCY_BINS}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#55647a" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <BruviChartTooltipCard
                            items={[{ label: `${d.label} orders`, value: `${d.pct}%` }]}
                          />
                        );
                      }}
                    />
                    <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                      {ORDER_FREQUENCY_BINS.map((bin) => (
                        <Cell
                          key={bin.label}
                          fill={bin.isRegular ? "#0f2340" : "#a9d8f3"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* LTV by Acquisition Channel */}
          <Card className="p-5 flex flex-col gap-3.5">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                LTV by acquisition channel
              </h2>
              <p className="text-[12px] text-text-muted">
                12-month net revenue per customer · cohorts Oct 2025 – Mar 2026
              </p>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2 pr-2">Channel</th>
                    <th className="py-2 px-2">12-mo LTV</th>
                    <th className="py-2 px-2 text-right">CAC</th>
                    <th className="py-2 pl-2 text-right">LTV:CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {LTV_CHANNELS.map((ch) => (
                    <tr key={ch.channel}>
                      <td className="py-3 pr-2 text-[13px] font-bold text-text whitespace-nowrap">
                        {ch.channel}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 rounded-full bg-background-subtle overflow-hidden hidden sm:block">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                ch.tone === "primary"
                                  ? "bg-primary"
                                  : "bg-category-coffee",
                              )}
                              style={{ width: `${ch.barPct}%` }}
                            />
                          </div>
                          <span className="text-[13px] font-extrabold text-text tnum">
                            ₹{ch.ltvInr.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right text-[12px] text-text-secondary tnum">
                        {ch.cacInr === null ? "—" : `₹${ch.cacInr}`}
                      </td>
                      <td className="py-3 pl-2 text-right text-[13px] font-extrabold text-success tnum">
                        {ch.ratioLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: 3x3 RFM Segments Matrix */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              RFM segments
            </h2>
            <p className="text-[12px] text-text-muted">
              1,84,200 registered customers · frequency × recency
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {RFM_SEGMENTS.map((cell) => {
              const selected = cell.id === selectedRfm.id;
              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => setSelectedRfmId(cell.id)}
                  className={cn(
                    "rounded-xl p-3 text-left transition-all cursor-pointer flex flex-col gap-1",
                    cell.tone === "success" && "bg-success-surface",
                    cell.tone === "warning" && "bg-warning-surface",
                    cell.tone === "info" && "bg-info-surface",
                    cell.tone === "muted" && "bg-background-subtle",
                    cell.tone === "error" && "bg-error-surface",
                    selected && "ring-2 ring-warning shadow-sm",
                  )}
                >
                  <span className="text-[11px] font-bold text-text truncate">
                    {cell.title}
                  </span>
                  <span
                    className={cn(
                      "text-[18px] font-display font-extrabold tnum",
                      cell.tone === "success" && "text-success",
                      cell.tone === "warning" && "text-warning",
                      cell.tone === "info" && "text-info",
                      cell.tone === "muted" && "text-text",
                      cell.tone === "error" && "text-error",
                    )}
                  >
                    {cell.pct}%
                  </span>
                  <span className="text-[10px] text-text-muted tnum">
                    {cell.customers.toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-warning-surface border border-warning/25 p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <span className="font-extrabold text-text">
                {selectedRfm.detailHeadline}
              </span>
              <span className="text-[12px] text-text-muted tnum">
                {selectedRfm.detailSpendLabel}
              </span>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {selectedRfm.detailDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="compact"
                onClick={() =>
                  setNotice(
                    `Win-back campaign queued for ${selectedRfm.title} (${selectedRfm.customers.toLocaleString("en-IN")} customers)`,
                  )
                }
              >
                Send win-back offer
              </Button>
              <Button asChild variant="workspace" size="compact">
                <Link href="/customers">View list</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
