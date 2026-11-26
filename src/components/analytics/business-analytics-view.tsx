"use client";

import * as React from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AnalyticsModuleHeader,
  AnalyticsTabBar,
} from "@/components/analytics/analytics-header-and-tabs";
import {
  BruviChartTooltipCard,
  StackedPercentageBar,
} from "@/components/charts/bruvi-chart-primitives";
import {
  CHANNEL_MIX_MONTHS,
  DAILY_NET_SALES_SEP,
} from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

export function BusinessAnalyticsView() {
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 1–30, 2026 VS AUG"
        title="Business analytics"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setNotice("Exported September 2026 Business Analytics CSV");
                setTimeout(() => setNotice(null), 2400);
              }}
            >
              Export CSV
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setNotice("Weekly executive report scheduled for Mondays 8:00 am")
              }
            >
              Schedule report
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="business" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-inverse-secondary">
            Net sales · September
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-white">
              ₹3.02 Cr
            </span>
            <span className="inline-flex items-center rounded-full bg-white/10 text-success-on-dark px-2 py-0.5 text-[11px] font-extrabold tnum">
              ▲ 6.3%
            </span>
          </div>
          <span className="text-[12px] text-text-inverse-muted tnum">
            Aug ₹2.84 Cr · 103% of monthly target
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">Orders</span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            95,000
          </span>
          <span className="text-[12px] font-semibold text-success tnum">
            ▲ 4.7% ·{" "}
            <span className="text-text-muted font-medium">Aug 90,700</span>
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Avg order value
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹318
          </span>
          <span className="text-[12px] font-semibold text-success tnum">
            ▲ 1.6% ·{" "}
            <span className="text-text-muted font-medium">Aug ₹313</span>
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            App share of orders
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            37%
          </span>
          <span className="text-[12px] font-semibold text-success tnum">
            ▲ 3 pts ·{" "}
            <span className="text-text-muted font-medium">Aug 34%</span>
          </span>
        </Card>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Daily Net Sales Dual Line Chart */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Daily net sales
              </h2>
              <p className="text-[12px] text-text-muted">
                ₹ lakh per day · all 12 stores · weekends shaded
              </p>
            </div>
            <div className="flex items-center gap-4 text-[12px] font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3.5 bg-surface-inverse inline-block" />
                September
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <span className="h-0.5 w-3.5 border-t-2 border-dashed border-text-muted inline-block" />
                August
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={DAILY_NET_SALES_SEP}
                margin={{ top: 14, right: 12, left: -12, bottom: 4 }}
              >
                <CartesianGrid
                  stroke="#dce2ea"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                {/* Weekend shading bands */}
                <ReferenceArea x1={5} x2={6} fill="#f5f7fa" fillOpacity={0.95} />
                <ReferenceArea x1={12} x2={13} fill="#f5f7fa" fillOpacity={0.95} />
                <ReferenceArea x1={19} x2={20} fill="#f5f7fa" fillOpacity={0.95} />
                <ReferenceArea x1={26} x2={27} fill="#f5f7fa" fillOpacity={0.95} />
                <XAxis
                  dataKey="day"
                  ticks={[1, 8, 15, 22, 30]}
                  tickFormatter={(v) =>
                    v === 1 ? "1 Sep" : v === 30 ? "30 Sep" : String(v)
                  }
                  tick={{ fontSize: 11, fill: "#55647a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[6, 13]}
                  ticks={[6, 8, 10, 12]}
                  tickFormatter={(v) => `₹${v} L`}
                  tick={{ fontSize: 11, fill: "#55647a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload;
                    return (
                      <BruviChartTooltipCard
                        title={`${row.label} · ${row.isWeekend ? "Weekend" : "Weekday"}`}
                        items={[
                          {
                            label: "Sep",
                            value: `₹${row.sepLakh.toFixed(1)} L`,
                            dotColor: "#0f2340",
                          },
                          {
                            label: "Aug",
                            value: `₹${row.augLakh.toFixed(1)} L`,
                            dotColor: "#7f8ca0",
                          },
                        ]}
                      />
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="augLakh"
                  stroke="#7f8ca0"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sepLakh"
                  stroke="#0f2340"
                  strokeWidth={2.25}
                  dot={false}
                  activeDot={{ r: 5, fill: "#ffffff", stroke: "#0f2340", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
            <div>
              <span className="block text-text-muted">Weekday avg</span>
              <span className="text-[15px] font-extrabold text-text tnum">
                ₹9.55 L
              </span>
            </div>
            <div>
              <span className="block text-text-muted">Weekend avg</span>
              <span className="text-[15px] font-extrabold text-text tnum">
                ₹11.48 L
              </span>
            </div>
            <div>
              <span className="block text-text-muted">Best day</span>
              <span className="text-[15px] font-extrabold text-text tnum">
                Sun 27 Sep
              </span>
            </div>
            <div>
              <span className="block text-text-muted">Days above Aug</span>
              <span className="text-[15px] font-extrabold text-success tnum">
                20 of 30
              </span>
            </div>
          </div>
        </Card>

        {/* Right: Channel Mix + Insights */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Channel mix
              </h2>
              <p className="text-[12px] text-text-muted">
                Share of orders by month
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                App
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Counter
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-category-coffee" />
                Kiosk
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-category-matcha" />
                QR + delivery
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {CHANNEL_MIX_MONTHS.map((m) => (
                <div
                  key={m.month}
                  className="grid grid-cols-[36px_1fr_36px] items-center gap-2.5 text-[12px]"
                >
                  <span
                    className={cn(
                      "font-semibold",
                      m.month === "Sep" ? "font-extrabold text-text" : "text-text-muted",
                    )}
                  >
                    {m.month}
                  </span>
                  <StackedPercentageBar
                    heightClass="h-4"
                    segments={[
                      { label: "", pct: m.appPct, colorClass: "bg-primary" },
                      { label: "", pct: m.counterPct, colorClass: "bg-accent" },
                      { label: "", pct: m.kioskPct, colorClass: "bg-category-coffee" },
                      { label: "", pct: m.qrDeliveryPct, colorClass: "bg-category-matcha" },
                    ]}
                  />
                  <span
                    className={cn(
                      "text-right tnum",
                      m.month === "Sep"
                        ? "font-extrabold text-text"
                        : "font-semibold text-text-muted",
                    )}
                  >
                    {m.appPct}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Insights
              </h2>
              <Link
                href="/analytics/stores"
                className="text-[12px] font-bold text-primary hover:underline"
              >
                All 6 →
              </Link>
            </div>

            <div className="rounded-xl bg-success-surface p-3.5 flex items-start gap-3">
              <span className="text-[16px] font-display font-extrabold text-success tnum shrink-0">
                +22%
              </span>
              <div>
                <p className="text-[13px] font-extrabold text-text">
                  Weekend mornings
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                  Sat–Sun 8–11 am sales vs weekdays. Add a 3rd barista at
                  Indiranagar &amp; Bandra.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-category-matcha-surface p-3.5 flex items-start gap-3">
              <span className="text-[16px] font-display font-extrabold text-category-matcha tnum shrink-0">
                +31%
              </span>
              <div>
                <p className="text-[13px] font-extrabold text-text">
                  Matcha up 31% after LAB Batch 07 (Yuzu Matcha Tonic) launched
                  26 Sep
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
                  Iced Matcha Latte orders vs Aug; Monsoon Matcha (1–15 Oct)
                  should extend it.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
