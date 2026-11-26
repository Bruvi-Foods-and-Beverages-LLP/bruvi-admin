"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FinanceModuleHeader,
  FinanceTabBar,
} from "@/components/finance/finance-header-and-tabs";
import { STORE_SETTLEMENTS } from "@/lib/finance/mock-finance-data";
import { cn } from "@/lib/utils/cn";

export function StoreSettlementView() {
  const [cityFilter, setCityFilter] = React.useState("ALL");
  const [varianceOnly, setVarianceOnly] = React.useState(false);
  const [expandedIds, setExpandedIds] = React.useState<string[]>(["ind"]);
  const [approved, setApproved] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filtered = React.useMemo(() => {
    return STORE_SETTLEMENTS.filter((s) => {
      if (cityFilter !== "ALL" && s.city !== cityFilter) return false;
      if (varianceOnly && s.varianceInr === 0) return false;
      return true;
    });
  }, [cityFilter, varianceOnly]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · 12 STORES · DAY CLOSED 11:30 PM"
        title="Store settlement · Thu 1 Oct"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported Thu 1 Oct store settlements")}
            >
              Export
            </Button>
            <Button
              size="compact"
              disabled={approved}
              onClick={() => {
                setApproved(true);
                setNotice(
                  "Approved Thu 1 Oct day close across 12 stores (net ₹10,84,200)",
                );
              }}
            >
              {approved ? "Day close approved" : "Approve day close"}
            </Button>
          </>
        }
      />

      <FinanceTabBar active="settlements" />

      {notice && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-2.5 text-[13px] font-bold text-success flex items-center gap-2">
          <BruviIcon name="check" size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Live Shift Variance Banner */}
      <div className="rounded-2xl bg-surface-brand border border-info/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <BruviIcon
            name="time"
            size={18}
            className="text-info shrink-0 mt-0.5"
          />
          <div>
            <p className="text-[13px] font-extrabold text-text">
              Today (in progress) · Indiranagar · Rohan M. morning shift −₹50
            </p>
            <p className="text-[12px] text-text-secondary">
              Drawer count: expected ₹6,650 · counted ₹6,600 · “Change given
              incorrectly”. Posts with Fri 2 Oct shift close at 3 pm — not part
              of Thu 1 Oct totals below.
            </p>
          </div>
        </div>
        <Link
          href="/staff/shifts"
          className="text-[13px] font-bold text-primary hover:underline shrink-0"
        >
          View shift
        </Link>
      </div>

      {/* Per-Store Settlement Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Per-store settlement · Thu 1 Oct
            </h2>
            <p className="text-[12px] text-text-muted">
              Card/UPI settled = Razorpay + Pine Labs, net of fees · wallet
              &amp; meal cards (₹85,976) settle to the central ledger
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              aria-label="Filter by city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer"
            >
              <option value="ALL">City: All</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="NCR">NCR</option>
            </select>

            <button
              type="button"
              onClick={() => setVarianceOnly((v) => !v)}
              className={cn(
                "h-9 px-3.5 rounded-lg text-[12px] font-bold transition-colors cursor-pointer",
                varianceOnly
                  ? "bg-primary text-white"
                  : "bg-white border border-border-input text-text hover:bg-background-subtle",
              )}
            >
              Variance only
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 pl-5 pr-2">Store</th>
                <th className="py-3 px-2 text-right">Gross</th>
                <th className="py-3 px-2 text-right">Discounts</th>
                <th className="py-3 px-2 text-right">Refunds</th>
                <th className="py-3 px-2 text-right">Net</th>
                <th className="py-3 px-2 text-right">Cash exp.</th>
                <th className="py-3 px-2 text-right">Counted</th>
                <th className="py-3 px-2 text-right">Card/UPI</th>
                <th className="py-3 px-2 text-right">Variance</th>
                <th className="py-3 pl-2 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => {
                const isExpanded =
                  expandedIds.includes(s.id) && Boolean(s.shifts?.length);
                return (
                  <React.Fragment key={s.id}>
                    <tr
                      onClick={() => s.shifts?.length && toggleExpand(s.id)}
                      className={cn(
                        "transition-colors",
                        s.shifts?.length && "cursor-pointer",
                        isExpanded
                          ? "bg-surface-brand/40"
                          : "hover:bg-background-subtle/60",
                      )}
                    >
                      <td className="py-3.5 pl-5 pr-2">
                        <div className="flex items-center gap-2.5">
                          <BruviIcon
                            name={isExpanded ? "chevron-down" : "chevron"}
                            size={14}
                            className="text-text-muted shrink-0"
                          />
                          <div>
                            <p className="text-[13px] font-bold text-text">
                              {s.storeName}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {s.storeCode}
                              {s.shiftsLabel ? ` · ${s.shiftsLabel}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{s.grossInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[12px] text-text-muted tnum">
                        −₹{s.discountsInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[12px] text-text-muted tnum">
                        −₹{s.refundsInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{s.netInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        ₹{s.cashExpectedInr.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={cn(
                          "py-3.5 px-2 text-right text-[12px] font-bold tnum",
                          s.cashCountedInr < s.cashExpectedInr
                            ? "text-error"
                            : "text-text",
                        )}
                      >
                        ₹{s.cashCountedInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{s.cardUpiInr.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={cn(
                          "py-3.5 px-2 text-right text-[13px] font-extrabold tnum",
                          s.varianceInr < 0 ? "text-error" : "text-text-muted",
                        )}
                      >
                        {s.varianceInr === 0
                          ? "₹0"
                          : `−₹${Math.abs(s.varianceInr)}`}
                      </td>
                      <td className="py-3.5 pl-2 pr-5 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
                            s.statusLabel === "Balanced" &&
                              "bg-success-surface text-success",
                            s.statusLabel === "UPI refund" &&
                              "bg-warning-surface text-warning",
                            s.statusLabel === "Cash short" &&
                              "bg-error-surface text-error",
                          )}
                        >
                          {s.statusLabel}
                        </span>
                      </td>
                    </tr>

                    {isExpanded && s.shifts && (
                      <tr className="bg-surface-brand/25">
                        <td colSpan={10} className="px-6 py-3">
                          <div className="rounded-xl border border-border bg-white overflow-hidden">
                            <table className="w-full text-[12px]">
                              <thead>
                                <tr className="border-b border-border bg-background-subtle/50 text-left text-[10px] font-bold uppercase tracking-wider text-text-muted">
                                  <th className="py-2 pl-4 pr-2">
                                    Shift · Thu 1 Oct
                                  </th>
                                  <th className="py-2 px-2">Closed by</th>
                                  <th className="py-2 px-2">Device</th>
                                  <th className="py-2 px-2 text-right">
                                    Expected
                                  </th>
                                  <th className="py-2 px-2 text-right">
                                    Counted
                                  </th>
                                  <th className="py-2 px-2 text-right">
                                    Variance
                                  </th>
                                  <th className="py-2 pl-2 pr-4">Note</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/70">
                                {s.shifts.map((sh) => (
                                  <tr key={sh.device}>
                                    <td className="py-2.5 pl-4 pr-2 font-bold text-text">
                                      {sh.shiftName}
                                    </td>
                                    <td className="py-2.5 px-2 text-text-secondary">
                                      {sh.closedBy}
                                    </td>
                                    <td className="py-2.5 px-2 font-mono text-[11px] text-text-muted">
                                      {sh.device}
                                    </td>
                                    <td className="py-2.5 px-2 text-right font-semibold text-text tnum">
                                      ₹{sh.expectedInr.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-2.5 px-2 text-right font-semibold text-text tnum">
                                      ₹{sh.countedInr.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-2.5 px-2 text-right text-text-muted tnum">
                                      ₹{sh.varianceInr}
                                    </td>
                                    <td className="py-2.5 pl-2 pr-4 text-text-muted">
                                      {sh.note}
                                    </td>
                                  </tr>
                                ))}
                                {filtered.length === 0 && (
                <TableEmptyRow
                  colSpan={10}
                  title="No store settlements match these filters"
                  description="No stores match the selected city and variance filter."
                  filterChips={[
                    ...(cityFilter !== "ALL"
                      ? [
                          {
                            id: "city",
                            label: `City: ${cityFilter}`,
                            onRemove: () => setCityFilter("ALL"),
                          },
                        ]
                      : []),
                    ...(varianceOnly
                      ? [
                          {
                            id: "variance",
                            label: "Variance only",
                            onRemove: () => setVarianceOnly(false),
                          },
                        ]
                      : []),
                  ]}
                  actionLabel="Clear all filters"
                  onAction={() => {
                    setCityFilter("ALL");
                    setVarianceOnly(false);
                  }}
                />
              )}
            </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <TableEmptyRow
                  colSpan={10}
                  title="No store settlements match these filters"
                  description="No stores match the selected city and variance filter."
                  filterChips={[
                    ...(cityFilter !== "ALL"
                      ? [
                          {
                            id: "city",
                            label: `City: ${cityFilter}`,
                            onRemove: () => setCityFilter("ALL"),
                          },
                        ]
                      : []),
                    ...(varianceOnly
                      ? [
                          {
                            id: "variance",
                            label: "Variance only",
                            onRemove: () => setVarianceOnly(false),
                          },
                        ]
                      : []),
                  ]}
                  actionLabel="Clear all filters"
                  onAction={() => {
                    setCityFilter("ALL");
                    setVarianceOnly(false);
                  }}
                />
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-background-subtle/50 text-[13px] font-extrabold text-text tnum">
                <td className="py-3.5 pl-5 pr-2">
                  <p>Network · 12 stores</p>
                  <p className="text-[11px] font-medium text-text-muted">
                    UPI −₹450 · cash −₹120
                  </p>
                </td>
                <td className="py-3.5 px-2 text-right">₹11,46,740</td>
                <td className="py-3.5 px-2 text-right font-semibold text-text-muted">
                  −₹50,600
                </td>
                <td className="py-3.5 px-2 text-right font-semibold text-text-muted">
                  −₹11,940
                </td>
                <td className="py-3.5 px-2 text-right">₹10,84,200</td>
                <td className="py-3.5 px-2 text-right">₹97,578</td>
                <td className="py-3.5 px-2 text-right">₹97,458</td>
                <td className="py-3.5 px-2 text-right">₹8,88,466</td>
                <td className="py-3.5 px-2 text-right text-error">−₹570</td>
                <td className="py-3.5 pl-2 pr-5" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
