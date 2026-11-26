"use client";

import * as React from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Cell,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AnalyticsModuleHeader,
  AnalyticsTabBar,
} from "@/components/analytics/analytics-header-and-tabs";
import { BruviChartTooltipCard } from "@/components/charts/bruvi-chart-primitives";
import { PRODUCT_CONTRIBUTION_ROWS } from "@/lib/analytics/mock-analytics-data";
import { MenuEngineeringClass } from "@/types/analytics";
import { cn } from "@/lib/utils/cn";

function ClassBadge({ cls }: { cls: MenuEngineeringClass }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        cls === "Star" && "bg-success-surface text-success",
        cls === "Plowhorse" && "bg-info-surface text-info",
        cls === "Puzzle" && "bg-warning-surface text-warning",
        cls === "Dog" && "bg-error-surface text-error",
      )}
    >
      {cls}
    </span>
  );
}

const DOT_COLOR: Record<MenuEngineeringClass, string> = {
  Star: "#1f7a4d",
  Plowhorse: "#22629e",
  Puzzle: "#9a5b00",
  Dog: "#c0352b",
};

export function ProductContributionView() {
  const [notice, setNotice] = React.useState<string | null>(null);

  const scatterPoints = React.useMemo(
    () => [
      ...PRODUCT_CONTRIBUTION_ROWS.map((p) => ({
        name: p.shortName,
        mix: p.mixSharePct,
        margin: p.cmPct,
        classification: p.classification,
      })),
      {
        name: "Yuzu Tonic · LAB",
        mix: 6.1,
        margin: 71.0,
        classification: "Dog" as MenuEngineeringClass,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 1–30, 2026 VS AUG"
        title="Product contribution"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported Product Contribution CSV")}
            >
              Export CSV
            </Button>
            <Button asChild size="compact">
              <Link href="/recipes">Open menu engineering</Link>
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="contribution" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Contribution Table */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Contribution margin by product
              </h2>
              <p className="text-[12px] text-text-muted">
                September · base price, regular size · food cost from current
                recipes
              </p>
            </div>
            <span className="text-[12px] font-bold text-primary">
              Top 8 of 22 ▾
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3 pl-5 pr-2">Product</th>
                  <th className="py-3 px-2 text-right">Price</th>
                  <th className="py-3 px-2 text-right">Food cost</th>
                  <th className="py-3 px-2 text-right">CM %</th>
                  <th className="py-3 px-2 text-right">Units</th>
                  <th className="py-3 px-2 text-right">Total CM</th>
                  <th className="py-3 pl-2 pr-5 text-right">Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PRODUCT_CONTRIBUTION_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-background-subtle/60 transition-colors"
                  >
                    <td className="py-3 pl-5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                            row.tone === "coffee" &&
                              "bg-surface-warm text-category-coffee",
                            row.tone === "matcha" &&
                              "bg-category-matcha-surface text-category-matcha",
                            row.tone === "food" &&
                              "bg-warning-surface text-warning",
                          )}
                        >
                          <BruviIcon
                            name={
                              row.tone === "matcha"
                                ? "leaf"
                                : row.tone === "food"
                                  ? "pastry"
                                  : "coffee"
                            }
                            size={15}
                          />
                        </div>
                        <span className="text-[13px] font-bold text-text">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-[13px] font-semibold text-text tnum">
                      ₹{row.priceInr}
                    </td>
                    <td className="py-3 px-2 text-right text-[12px] text-text-secondary tnum">
                      ₹{row.foodCostInr.toFixed(2)}
                    </td>
                    <td
                      className={cn(
                        "py-3 px-2 text-right text-[13px] font-extrabold tnum",
                        row.cmPct >= 79
                          ? "text-success"
                          : row.cmPct >= 70
                            ? "text-text"
                            : "text-error",
                      )}
                    >
                      {row.cmPct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-right text-[12px] text-text-secondary tnum">
                      {row.units.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-2 text-right text-[13px] font-extrabold text-text tnum">
                      ₹{row.totalCmLakh.toFixed(1)} L
                    </td>
                    <td className="py-3 pl-2 pr-5 text-right">
                      <ClassBadge cls={row.classification} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[12px] bg-background-subtle/30">
            <span className="text-text-muted">
              Avg margin (revenue-weighted) · drinks 78.9% · bites 66.0%
            </span>
            <span className="tnum">
              <span className="text-text-muted mr-3">Top 8 total</span>
              <strong className="text-[14px] font-extrabold text-text">
                ₹2.11 Cr
              </strong>
            </span>
          </div>
        </Card>

        {/* Right: 4-Quadrant Menu Engineering Scatter */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Menu engineering
            </h2>
            <p className="text-[12px] text-text-muted">
              Popularity (mix share) × contribution margin
            </p>
          </div>

          <div className="relative h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 12, bottom: 16, left: -16 }}>
                <CartesianGrid stroke="#dce2ea" strokeDasharray="3 3" />
                {/* 4 Quadrants */}
                <ReferenceArea
                  x1={0}
                  x2={8.75}
                  y1={78.9}
                  y2={86}
                  fill="#fdf0d8"
                  fillOpacity={0.45}
                />
                <ReferenceArea
                  x1={8.75}
                  x2={20}
                  y1={78.9}
                  y2={86}
                  fill="#e3f4ea"
                  fillOpacity={0.55}
                />
                <ReferenceArea
                  x1={0}
                  x2={8.75}
                  y1={55}
                  y2={78.9}
                  fill="#fce8e6"
                  fillOpacity={0.45}
                />
                <ReferenceArea
                  x1={8.75}
                  x2={20}
                  y1={55}
                  y2={78.9}
                  fill="#e4f0fa"
                  fillOpacity={0.45}
                />
                <ReferenceLine x={8.75} stroke="#7f8ca0" strokeDasharray="4 4" />
                <ReferenceLine y={78.9} stroke="#7f8ca0" strokeDasharray="4 4" />
                <XAxis
                  type="number"
                  dataKey="mix"
                  domain={[0, 20]}
                  ticks={[0, 10, 20]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fill: "#55647a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="margin"
                  domain={[55, 86]}
                  ticks={[60, 70, 80]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fill: "#55647a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <ZAxis range={[64, 64]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <BruviChartTooltipCard
                        title={`${d.name} (${d.classification})`}
                        items={[
                          { label: "Mix share", value: `${d.mix}%` },
                          { label: "CM %", value: `${d.margin}%` },
                        ]}
                      />
                    );
                  }}
                />
                <Scatter data={scatterPoints}>
                  {scatterPoints.map((pt) => (
                    <Cell
                      key={pt.name}
                      fill={DOT_COLOR[pt.classification]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            Y: margin 55–85% · X: mix share 0–20% · dashed lines at 8.75% mix
            (70% of 1/N) and 78.9% margin (drinks avg, revenue weighted)
          </p>

          <div className="rounded-xl bg-warning-surface p-3.5 flex flex-col gap-1">
            <p className="text-[13px] font-extrabold text-text">
              Phin Đen is a Puzzle
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              83% margin but 7.2% mix. Feature it on the app home and kiosk hero
              to push it into Stars.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
