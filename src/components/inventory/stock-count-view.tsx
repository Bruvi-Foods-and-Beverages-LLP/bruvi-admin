"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import { INITIAL_STOCK_COUNT_LINES } from "@/lib/inventory/mock-inventory-data";
import { StockCountLine } from "@/types/inventory";
import { cn } from "@/lib/utils/cn";

export function StockCountView() {
  const [lines, setLines] = React.useState<StockCountLine[]>(
    INITIAL_STOCK_COUNT_LINES,
  );
  const [comment, setComment] = React.useState(
    "Matcha likely over-scooped on oat-swap orders. 12 cups 16 oz crushed in delivery box.",
  );
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const handleCountChange = (id: string, val: string) => {
    const parsed = val === "" ? 0 : parseFloat(val);
    if (Number.isNaN(parsed)) return;
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, counted: Math.max(0, parsed) } : line,
      ),
    );
    setStatusMessage(null);
  };

  const stats = React.useMemo(() => {
    let varianceCount = 0;
    let lossInr = 0;
    let gainInr = 0;
    let totalExpectedValue = 0;
    let absVarianceValue = 0;

    lines.forEach((line) => {
      const diff = Number((line.counted - line.expected).toFixed(2));
      const val = Math.round(diff * line.unitCostInr);
      totalExpectedValue += line.expected * line.unitCostInr;
      absVarianceValue += Math.abs(val);
      if (diff !== 0) varianceCount += 1;
      if (val < 0) lossInr += Math.abs(val);
      if (val > 0) gainInr += val;
    });

    const netInr = gainInr - lossInr;
    const accuracy =
      totalExpectedValue > 0
        ? Math.max(
            0,
            Math.min(
              100,
              Number(
                ((1 - absVarianceValue / totalExpectedValue) * 100).toFixed(1),
              ),
            ),
          )
        : 100;

    const toleranceBreaches = lines.filter((line) => {
      if (line.expected <= 0) return false;
      const pct = Math.abs(line.counted - line.expected) / line.expected;
      return pct > 0.05;
    });

    return {
      varianceCount,
      lossInr,
      gainInr,
      netInr,
      accuracy,
      toleranceBreaches,
    };
  }, [lines]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb="Inventory / Counts / CC-2041"
        title="Daily key items count"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setStatusMessage("Draft saved at 9:18 am")}
            >
              Save draft
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setStatusMessage("Submitted CC-2041 to Meera K. for approval")
              }
            >
              Submit for approval
            </Button>
          </>
        }
      />

      <InventoryTabBar active="counts" />

      {statusMessage && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-3 text-[13px] font-bold text-success flex items-center gap-2">
          <BruviIcon name="check" size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Summary Banner */}
      <Card className="p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-full bg-surface-brand text-primary text-[13px] font-extrabold flex items-center justify-center shrink-0">
            AS
          </div>
          <div>
            <p className="text-[14px] font-extrabold text-text">
              Indiranagar · Daily key items
            </p>
            <p className="text-[12px] text-text-muted">
              Started 9:00 am by Arjun S. · blind count · 18 min
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-text-muted">Progress</span>
              <span className="font-extrabold text-text tnum">
                {lines.length} / {lines.length} counted
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
              <div className="h-full w-full rounded-full bg-success" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-text-muted">
              Items with variance
            </span>
            <span className="text-[18px] font-display font-extrabold text-text tnum">
              {stats.varianceCount}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-text-muted">
              Net variance
            </span>
            <span
              className={cn(
                "text-[18px] font-display font-extrabold tnum",
                stats.netInr < 0 ? "text-error" : "text-success",
              )}
            >
              {stats.netInr < 0 ? "−" : "+"}₹
              {Math.abs(stats.netInr).toLocaleString("en-IN")}
            </span>
          </div>

          <Badge variant="success" className="px-3 py-1">
            Ready to submit
          </Badge>
        </div>
      </Card>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Count Table */}
        <Card className="overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3 pl-5 pr-3">Item</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3 text-right">Expected</th>
                  <th className="py-3 px-3 text-center">Counted</th>
                  <th className="py-3 px-3 text-right">Variance</th>
                  <th className="py-3 pl-3 pr-5 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines.map((line) => {
                  const diff = Number((line.counted - line.expected).toFixed(2));
                  const val = Math.round(diff * line.unitCostInr);
                  const isNegative = diff < 0;
                  const isPositive = diff > 0;
                  const pct =
                    line.expected > 0
                      ? Math.abs(diff) / line.expected
                      : 0;
                  const isHighlightedNegative = isNegative && pct > 0.03;

                  return (
                    <tr
                      key={line.id}
                      className={cn(
                        "transition-colors",
                        isHighlightedNegative
                          ? "bg-error-surface/60"
                          : "hover:bg-background-subtle/60",
                      )}
                    >
                      <td className="py-3 pl-5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-5 w-5 rounded-full bg-success-surface text-success inline-flex items-center justify-center shrink-0">
                            <BruviIcon name="check" size={12} />
                          </span>
                          <span className="text-[14px] font-bold text-text">
                            {line.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[13px] text-text-muted">
                        {line.unit}
                      </td>
                      <td className="py-3 px-3 text-right text-[13px] font-semibold text-text-secondary tnum">
                        {line.expected}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          step={line.step}
                          aria-label={`Counted quantity for ${line.name}`}
                          value={line.counted}
                          onChange={(e) =>
                            handleCountChange(line.id, e.target.value)
                          }
                          className={cn(
                            "h-9 w-20 rounded-lg border bg-white px-2.5 text-center text-[14px] font-extrabold text-text tnum focus:outline-none focus:ring-2 focus:ring-focus",
                            isHighlightedNegative
                              ? "border-error/60"
                              : "border-border-input",
                          )}
                        />
                      </td>
                      <td
                        className={cn(
                          "py-3 px-3 text-right text-[13px] font-bold tnum",
                          isNegative
                            ? "text-error"
                            : isPositive
                              ? "text-success"
                              : "text-text-muted",
                        )}
                      >
                        {diff === 0
                          ? "0"
                          : `${diff > 0 ? "+" : "−"}${Math.abs(diff)}${line.unit === "g" ? " g" : ""}`}
                      </td>
                      <td
                        className={cn(
                          "py-3 pl-3 pr-5 text-right text-[13px] font-extrabold tnum",
                          val < 0
                            ? "text-error"
                            : val > 0
                              ? "text-success"
                              : "text-text-muted",
                        )}
                      >
                        {val === 0
                          ? "₹0"
                          : `${val > 0 ? "+" : "−"}₹${Math.abs(val)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="px-5 py-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2 bg-background-subtle/40">
            <span className="text-[13px] font-bold text-text">
              Net variance · {lines.length} items
            </span>
            <div className="flex items-center gap-4 text-[13px] tnum">
              <span className="text-text-muted">
                Loss −₹{stats.lossInr} · gain +₹{stats.gainInr}
              </span>
              <span
                className={cn(
                  "text-[15px] font-extrabold",
                  stats.netInr < 0 ? "text-error" : "text-success",
                )}
              >
                {stats.netInr < 0 ? "−" : "+"}₹{Math.abs(stats.netInr)}
              </span>
            </div>
          </div>
        </Card>

        {/* Right: Approval Panel */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Submit for approval
            </h2>
            <p className="text-[13px] text-text-muted mt-1">
              Approved counts overwrite on-hand stock and post variance to the
              P&amp;L.
            </p>
          </div>

          {stats.toleranceBreaches.length > 0 && (
            <div className="rounded-xl border border-warning/30 bg-warning-surface p-3.5 text-[12px] font-semibold text-warning flex items-start gap-2.5">
              <BruviIcon name="alert" size={16} className="shrink-0 mt-0.5" />
              <span>
                Matcha is 20% under expected — above the 5% item tolerance, so a
                manager must approve.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Approver</span>
              <span className="font-bold text-text">
                Meera K. · Store manager
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Accuracy this count</span>
              <span className="font-bold text-text tnum">
                {stats.accuracy}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="approver-comment"
              className="text-[12px] font-bold text-text"
            >
              Comment for approver
            </label>
            <textarea
              id="approver-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-white p-3 text-[13px] text-text focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          <div className="grid grid-cols-[110px_1fr] gap-2.5 pt-1">
            <Button
              type="button"
              variant="workspace"
              size="compact"
              onClick={() =>
                setStatusMessage("Marked 2 variance items for recount")
              }
            >
              Recount {stats.toleranceBreaches.length}
            </Button>
            <Button
              type="button"
              size="compact"
              onClick={() =>
                setStatusMessage("Submitted CC-2041 to Meera K. for approval")
              }
            >
              Submit to Meera K.
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
