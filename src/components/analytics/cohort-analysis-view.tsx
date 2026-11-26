"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { BruviChartTooltipCard } from "@/components/charts/bruvi-chart-primitives";
import {
  COHORT_RETENTION_ROWS,
  RETENTION_CURVE_POINTS,
} from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

function cohortCellClass(val: number | null, isHighlighted: boolean): string {
  if (val === null) return "bg-background-subtle/50 text-transparent";
  const ring = isHighlighted ? "ring-2 ring-accent" : "";
  if (val === 100) return `bg-surface-inverse text-white ${ring}`;
  if (val >= 50) return `bg-primary text-white ${ring}`;
  if (val >= 45) return `bg-navy-600 text-white ${ring}`;
  if (val >= 38) return `bg-navy-400 text-white ${ring}`;
  if (val >= 33) return `bg-sky-300 text-text ${ring}`;
  return `bg-gray-200 text-text ${ring}`;
}

export function CohortAnalysisView() {
  const [mode, setMode] = React.useState<"customers" | "revenue">("customers");
  const [notes, setNotes] = React.useState([
    {
      id: "n-1",
      tone: "success" as const,
      title: "Aug cohort M1 at 52% — best yet",
      body: "App-first onboarding (free extra shot on 2nd order) launched 4 Aug.",
    },
    {
      id: "n-2",
      tone: "primary" as const,
      title: "Curves flatten after M3 (~30%)",
      body: "Customers who stay past M3 become regulars; focus win-back on the M1–M2 drop.",
    },
    {
      id: "n-3",
      tone: "warning" as const,
      title: "Jun cohort weakest (46% M1)",
      body: "Monsoon dip; retarget with BREW50 via “Come back to Phin”.",
    },
  ]);
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · COHORTS APR–SEP 2026"
        title="Cohort analysis"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported Cohort Retention CSV")}
            >
              Export CSV
            </Button>
            <Button
              size="compact"
              onClick={() => setNotice("Saved Cohort Retention view")}
            >
              Save view
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="cohorts" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Cohort Heatmap */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Monthly cohort retention
              </h2>
              <p className="text-[12px] text-text-muted">
                % of each month’s new customers who ordered again in month n
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-background-subtle p-1 border border-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setMode("customers")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer",
                  mode === "customers"
                    ? "bg-white text-text shadow-xs"
                    : "text-text-muted hover:text-text",
                )}
              >
                Customers ordering
              </button>
              <button
                type="button"
                onClick={() => setMode("revenue")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer",
                  mode === "revenue"
                    ? "bg-white text-text shadow-xs"
                    : "text-text-muted hover:text-text",
                )}
              >
                Revenue retained
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-separate border-spacing-1.5">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="text-left pb-1">Cohort</th>
                  <th className="text-right pb-1 pr-2">Customers</th>
                  {["M0", "M1", "M2", "M3", "M4", "M5", "M6"].map((m) => (
                    <th key={m} className="text-center pb-1">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_RETENTION_ROWS.map((row) => (
                  <tr key={row.cohort}>
                    <td className="text-[13px] font-bold text-text whitespace-nowrap pr-2">
                      {row.cohort}
                    </td>
                    <td className="text-right text-[12px] text-text-secondary tnum pr-2">
                      {row.customers.toLocaleString("en-IN")}
                    </td>
                    {row.months.map((val, idx) => {
                      const displayVal =
                        val === null
                          ? null
                          : mode === "revenue" && idx > 0
                            ? Math.min(100, val + 2)
                            : val;
                      const isMarM3 = row.cohort === "Mar 2026" && idx === 3;
                      return (
                        <td key={idx} className="p-0">
                          <div
                            className={cn(
                              "h-10 rounded-lg flex items-center justify-center text-[12px] font-extrabold tnum",
                              cohortCellClass(displayVal, isMarM3),
                            )}
                          >
                            {displayVal === null ? "—" : `${displayVal}%`}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Weighted avg */}
                <tr>
                  <td className="pt-2 text-[13px] font-extrabold text-text">
                    Weighted avg
                  </td>
                  <td className="pt-2 text-right text-[12px] font-bold text-text tnum pr-2">
                    95,950
                  </td>
                  {[100, 49, 39, 34, 31, 29, 28].map((val, idx) => (
                    <td
                      key={idx}
                      className="pt-2 text-center text-[12px] font-extrabold text-text tnum"
                    >
                      {mode === "revenue" && idx > 0 ? `${val + 2}%` : `${val}%`}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <span>≤26%</span>
              <span className="h-3 w-4 rounded-xs bg-gray-200" />
              <span className="h-3 w-4 rounded-xs bg-sky-300" />
              <span className="h-3 w-4 rounded-xs bg-navy-400" />
              <span className="h-3 w-4 rounded-xs bg-navy-600" />
              <span className="h-3 w-4 rounded-xs bg-surface-inverse" />
              <span>52%+</span>
            </div>
            <span>M0 = month of first order · Sep cohort still in progress</span>
          </div>
        </Card>

        {/* Right: Retention Curves + Notes */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Retention curves
              </h2>
              <p className="text-[12px] text-text-muted">
                % ordering in months 1–6 after first order
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-surface-inverse inline-block" />
                Mar cohort
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-category-coffee inline-block" />
                Jun cohort
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-category-matcha inline-block" />
                Aug cohort
              </span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={RETENTION_CURVE_POINTS}
                  margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#dce2ea"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#55647a" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[25, 55]}
                    ticks={[30, 40, 50]}
                    tickFormatter={(v) => `${v}%`}
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
                          title={d.month}
                          items={[
                            { label: "Mar", value: `${d.mar}%`, dotColor: "#0f2340" },
                            ...(d.jun !== null
                              ? [{ label: "Jun", value: `${d.jun}%`, dotColor: "#6b4430" }]
                              : []),
                            ...(d.aug !== null
                              ? [{ label: "Aug", value: `${d.aug}%`, dotColor: "#566f2c" }]
                              : []),
                          ]}
                        />
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mar"
                    stroke="#0f2340"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#0f2340" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="jun"
                    stroke="#6b4430"
                    strokeWidth={1.75}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="aug"
                    stroke="#566f2c"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#566f2c" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  Notes
                </h2>
                <p className="text-[11px] text-text-muted">Kavya R. · 1 Oct</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotes((prev) => [
                    {
                      id: `n-${Date.now()}`,
                      tone: "primary",
                      title: "Sep cohort tracking 53% M1 early",
                      body: "Added via Cohort Analysis view.",
                    },
                    ...prev,
                  ])
                }
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                + Add note
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {notes.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0",
                      n.tone === "success" && "bg-success",
                      n.tone === "primary" && "bg-primary",
                      n.tone === "warning" && "bg-warning",
                    )}
                  />
                  <div>
                    <p className="text-[13px] font-bold text-text">{n.title}</p>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
