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
import { STORE_PROFITABILITY_ROWS } from "@/lib/analytics/mock-analytics-data";
import { cn } from "@/lib/utils/cn";

export function StoreProfitabilityView() {
  const [selectedStoreId, setSelectedStoreId] = React.useState("ind");
  const [displayMode, setDisplayMode] = React.useState<"pct" | "inr">("pct");
  const [notice, setNotice] = React.useState<string | null>(null);

  const selectedStore =
    STORE_PROFITABILITY_ROWS.find((s) => s.id === selectedStoreId) ??
    STORE_PROFITABILITY_ROWS[0];

  // Build waterfall data: [base, delta] for stacked bar rendering
  const waterfallData = React.useMemo(() => {
    const rev = selectedStore.revenueLakh;
    const cogs = Number(((rev * selectedStore.cogsPct) / 100).toFixed(2));
    const labour = Number(((rev * selectedStore.labourPct) / 100).toFixed(2));
    const rent = Number(((rev * selectedStore.rentPct) / 100).toFixed(2));
    const other = Number(((rev * selectedStore.otherPct) / 100).toFixed(2));
    const ebitda = selectedStore.ebitdaLakh;

    const afterCogs = Math.max(0, rev - cogs);
    const afterLabour = Math.max(0, afterCogs - labour);
    const afterRent = Math.max(0, afterLabour - rent);

    return [
      { step: "Sales", base: 0, value: rev, label: `₹${rev.toFixed(1)} L`, color: "#0f2340" },
      { step: "COGS", base: afterCogs, value: cogs, label: `−₹${cogs.toFixed(2)} L`, color: "#6b4430" },
      { step: "Labour", base: afterLabour, value: labour, label: `−₹${labour.toFixed(2)} L`, color: "#6b4430" },
      { step: "Rent", base: afterRent, value: rent, label: `−₹${rent.toFixed(2)} L`, color: "#6b4430" },
      { step: "Other", base: ebitda, value: other, label: `−₹${other.toFixed(2)} L`, color: "#6b4430" },
      { step: "EBITDA", base: 0, value: ebitda, label: `₹${ebitda.toFixed(2)} L`, color: "#1f7a4d" },
    ];
  }, [selectedStore]);

  const fmtCell = (pct: number, revLakh: number) =>
    displayMode === "pct"
      ? `${pct}%`
      : `₹${((revLakh * pct) / 100).toFixed(1)} L`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <AnalyticsModuleHeader
        overline="ANALYTICS · SEP 2026 P&L-LITE · PROVISIONAL"
        title="Store profitability"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported Store Profitability CSV")}
            >
              Export CSV
            </Button>
            <Button asChild size="compact">
              <Link href="/finance/settlements">Share with finance</Link>
            </Button>
          </>
        }
      />

      <AnalyticsTabBar active="profitability" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: P&L-Lite by Store */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                P&amp;L-lite by store
              </h2>
              <p className="text-[12px] text-text-muted">
                September · costs as % of store net revenue · sorted by EBITDA %
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDisplayMode((m) => (m === "pct" ? "inr" : "pct"))
              }
              className="text-[12px] font-bold text-primary hover:underline cursor-pointer self-start sm:self-auto"
            >
              Show {displayMode === "pct" ? "₹" : "%"}
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[660px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2.5 pl-5 pr-2">Store</th>
                  <th className="py-2.5 px-2 text-right">Revenue</th>
                  <th className="py-2.5 px-2 text-right">COGS</th>
                  <th className="py-2.5 px-2 text-right">Labour</th>
                  <th className="py-2.5 px-2 text-right">Rent</th>
                  <th className="py-2.5 px-2 text-right">Other</th>
                  <th className="py-2.5 px-2 text-right">EBITDA</th>
                  <th className="py-2.5 pl-2 pr-5 text-right">EBITDA %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STORE_PROFITABILITY_ROWS.map((row) => {
                  const active = row.id === selectedStore.id;
                  const barColor =
                    row.ebitdaPct >= 12
                      ? "bg-primary"
                      : row.ebitdaPct >= 10
                        ? "bg-warning"
                        : "bg-error";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedStoreId(row.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        active ? "bg-surface-brand/70" : "hover:bg-background-subtle/60",
                      )}
                    >
                      <td className="py-2.5 pl-5 pr-2 text-[13px] font-bold text-text whitespace-nowrap">
                        {row.storeName}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[13px] font-bold text-text tnum">
                        ₹{row.revenueLakh.toFixed(1)} L
                      </td>
                      <td className="py-2.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        {fmtCell(row.cogsPct, row.revenueLakh)}
                      </td>
                      <td
                        className={cn(
                          "py-2.5 px-2 text-right text-[12px] font-semibold tnum",
                          row.labourPct >= 28 ? "text-warning" : "text-text-secondary",
                        )}
                      >
                        {fmtCell(row.labourPct, row.revenueLakh)}
                      </td>
                      <td
                        className={cn(
                          "py-2.5 px-2 text-right text-[12px] font-semibold tnum",
                          row.rentPct >= 24 ? "text-warning" : "text-text-secondary",
                        )}
                      >
                        {fmtCell(row.rentPct, row.revenueLakh)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        {fmtCell(row.otherPct, row.revenueLakh)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{row.ebitdaLakh.toFixed(2)} L
                      </td>
                      <td className="py-2.5 pl-2 pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-16 rounded-full bg-background-subtle overflow-hidden hidden sm:block">
                            <div
                              className={cn("h-full rounded-full", barColor)}
                              style={{ width: `${Math.min(100, row.ebitdaPct * 4)}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-[12px] font-extrabold tnum w-9 text-right",
                              row.ebitdaPct >= 14
                                ? "text-success"
                                : row.ebitdaPct >= 12
                                  ? "text-text"
                                  : row.ebitdaPct >= 10
                                    ? "text-warning"
                                    : "text-error",
                            )}
                          >
                            {row.ebitdaPct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-background-subtle/50 font-extrabold text-[13px] text-text tnum">
                  <td className="py-3 pl-5 pr-2">Network</td>
                  <td className="py-3 px-2 text-right">₹302 L</td>
                  <td className="py-3 px-2 text-right">29%</td>
                  <td className="py-3 px-2 text-right">25%</td>
                  <td className="py-3 px-2 text-right">21%</td>
                  <td className="py-3 px-2 text-right">11%</td>
                  <td className="py-3 px-2 text-right">₹44.3 L</td>
                  <td className="py-3 pl-2 pr-5 text-right">14.7%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Right: Waterfall Chart + Underperformers */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  {selectedStore.storeName} · Sep
                </h2>
                <p className="text-[12px] text-text-muted">
                  Revenue to EBITDA, ₹ lakh
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-success-surface text-success px-2.5 py-0.5 text-[11px] font-bold tnum">
                EBITDA {selectedStore.ebitdaPct}%
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={waterfallData}
                  margin={{ top: 12, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="step"
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
                          items={[{ label: d.step, value: d.label }]}
                        />
                      );
                    }}
                  />
                  <Bar dataKey="base" stackId="wf" fill="transparent" />
                  <Bar dataKey="value" stackId="wf" radius={[4, 4, 4, 4]}>
                    {waterfallData.map((entry) => (
                      <Cell key={entry.step} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Underperformers
              </h2>
              <p className="text-[12px] text-text-muted">
                Below 12% EBITDA target · suggested actions
              </p>
            </div>

            <div className="flex flex-col divide-y divide-border">
              <div className="py-3 first:pt-0 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-text">
                    Hauz Khas
                  </span>
                  <span className="inline-flex rounded-full bg-error-surface text-error px-2 py-0.5 text-[11px] font-bold tnum">
                    6% EBITDA
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  Rent 24% and labour 28%; sales ▼4.6% vs Aug; make time 5:34.
                </p>
                <p className="text-[12px] font-bold text-primary">
                  → Renegotiate rent at Jan renewal; trim 10–11 pm hours
                </p>
              </div>

              <div className="py-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-text">
                    Connaught Place
                  </span>
                  <span className="inline-flex rounded-full bg-error-surface text-error px-2 py-0.5 text-[11px] font-bold tnum">
                    9% EBITDA
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  Labour 26% on ₹20.1 L revenue; weekday afternoons idle.
                </p>
                <p className="text-[12px] font-bold text-primary">
                  → Cut 1 afternoon shift; move a barista to Cyber Hub peak
                </p>
              </div>

              <div className="py-3 last:pb-0 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-extrabold text-text">
                    Cyber Hub
                  </span>
                  <span className="inline-flex rounded-full bg-warning-surface text-warning px-2 py-0.5 text-[11px] font-bold tnum">
                    11% EBITDA
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  KDS outages and 6:12 make time; Egg Coffee off-menu.
                </p>
                <p className="text-[12px] font-bold text-primary">
                  → Fix KDS; add a 2nd bar station 8–10 am
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
