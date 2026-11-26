"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FinanceModuleHeader,
  FinanceTabBar,
} from "@/components/finance/finance-header-and-tabs";
import {
  RECONCILIATION_PROVIDERS,
  VARIANCE_TRACES,
} from "@/lib/finance/mock-finance-data";
import { cn } from "@/lib/utils/cn";

export function FinanceReconciliationView() {
  const [resolved, setResolved] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleResolve = () => {
    setResolved(true);
    setNotice(
      "Matched 2 UPI refunds (RF-30392 & RF-30397) — Thu 1 Oct reconciliation marked resolved.",
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · SETTLEMENT DATE FRI 2 OCT · RUN 9:05 AM"
        title="Reconciliation · Thu 1 Oct"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() =>
                setNotice("Exported Thu 1 Oct reconciliation report")
              }
            >
              Export
            </Button>
            <Button size="compact" disabled={resolved} onClick={handleResolve}>
              {resolved ? "Resolved" : "Mark resolved"}
            </Button>
          </>
        }
      />

      <FinanceTabBar active="reconciliation" />

      {notice && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-2.5 text-[13px] font-bold text-success flex items-center gap-2">
          <BruviIcon name="check" size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Expected settlement
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹10,72,350
          </span>
          <span className="text-[12px] text-text-muted tnum">
            Net ₹10,84,200 − fees &amp; adj. ₹11,850
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Settled
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹10,71,900
          </span>
          <span className="text-[12px] text-text-muted">
            6 providers · credited by 9:05 am
          </span>
        </Card>

        <Card
          className={cn(
            "p-5 flex flex-col justify-between gap-2",
            resolved
              ? "bg-success-surface border-success/30"
              : "bg-error-surface/70 border-error/30",
          )}
        >
          <span
            className={cn(
              "text-[13px] font-bold",
              resolved ? "text-success" : "text-error",
            )}
          >
            Variance
          </span>
          <span
            className={cn(
              "text-price-l font-display font-extrabold tracking-[-0.96px] tnum",
              resolved ? "text-success" : "text-error",
            )}
          >
            {resolved ? "₹0" : "−₹450"}
          </span>
          <span
            className={cn(
              "text-[12px] font-medium",
              resolved ? "text-success" : "text-error",
            )}
          >
            {resolved
              ? "2 UPI refunds matched & settled"
              : "Traced: 2 UPI refunds pending"}
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Transactions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
              {resolved ? "3,320" : "3,318"}
            </span>
            <span className="text-[13px] font-medium text-text-muted">
              matched
            </span>
          </div>
          <span
            className={cn(
              "text-[12px] font-semibold tnum",
              resolved ? "text-success" : "text-error",
            )}
          >
            {resolved
              ? "0 unmatched · 100% auto-matched"
              : "2 unmatched · 99.94% auto-matched"}
          </span>
        </Card>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Expected vs settled by provider
            </h2>
            <span className="text-[12px] text-text-muted">
              Sales date Thu 1 Oct · all 12 stores
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3 pl-5 pr-2">Provider</th>
                  <th className="py-3 px-2 text-right">Net sales</th>
                  <th className="py-3 px-2 text-right">Fees/adj.</th>
                  <th className="py-3 px-2 text-right">Expected</th>
                  <th className="py-3 px-2 text-right">Settled</th>
                  <th className="py-3 px-2 text-right">Var.</th>
                  <th className="py-3 pl-2 pr-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RECONCILIATION_PROVIDERS.map((row) => {
                  const isUnmatched = row.isUnmatched && !resolved;
                  const displayVar = isUnmatched ? row.varianceInr : 0;
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "transition-colors",
                        isUnmatched
                          ? "bg-error-surface/60"
                          : "hover:bg-background-subtle/60",
                      )}
                    >
                      <td className="py-3.5 pl-5 pr-2">
                        <p className="text-[13px] font-bold text-text">
                          {row.provider}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {row.subtitle}
                        </p>
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{row.netSalesInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[12px] text-text-muted tnum">
                        ₹{row.feesAdjInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{row.expectedInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹
                        {(isUnmatched
                          ? row.settledInr
                          : row.expectedInr
                        ).toLocaleString("en-IN")}
                      </td>
                      <td
                        className={cn(
                          "py-3.5 px-2 text-right text-[13px] font-extrabold tnum",
                          isUnmatched ? "text-error" : "text-text-muted",
                        )}
                      >
                        {displayVar === 0
                          ? "₹0"
                          : `−₹${Math.abs(displayVar)}`}
                      </td>
                      <td className="py-3.5 pl-2 pr-5 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
                            isUnmatched
                              ? "bg-error-surface text-error"
                              : "bg-success-surface text-success",
                          )}
                        >
                          {isUnmatched ? row.statusLabel : "Matched"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-background-subtle/40 font-extrabold text-[13px] text-text tnum">
                  <td className="py-3.5 pl-5 pr-2">Total · Thu 1 Oct</td>
                  <td className="py-3.5 px-2 text-right">₹10,84,200</td>
                  <td className="py-3.5 px-2 text-right font-semibold text-text-muted">
                    ₹11,850
                  </td>
                  <td className="py-3.5 px-2 text-right">₹10,72,350</td>
                  <td className="py-3.5 px-2 text-right">
                    {resolved ? "₹10,72,350" : "₹10,71,900"}
                  </td>
                  <td
                    className={cn(
                      "py-3.5 px-2 text-right",
                      resolved ? "text-success" : "text-error",
                    )}
                  >
                    {resolved ? "₹0" : "−₹450"}
                  </td>
                  <td className="py-3.5 pl-2 pr-5" />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Right: Variance Trace */}
        <Card className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Variance trace
            </h2>
            <p className="text-[12px] text-text-muted mt-1 leading-relaxed">
              Razorpay netted 2 UPI refunds from the 1 Oct payout; BRUVI ledger
              still shows them as Initiated.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {VARIANCE_TRACES.map((tr) => (
              <div
                key={tr.id}
                className="rounded-xl bg-background-subtle border border-border p-3.5 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-extrabold text-text">
                    {tr.id} · {tr.store}
                  </span>
                  <span className="font-extrabold text-text tnum">
                    ₹{tr.amountInr}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">{tr.orderRef}</p>
                <span
                  className={cn(
                    "self-start inline-flex items-center rounded-md px-2 py-1 text-[11px] font-bold",
                    resolved
                      ? "bg-success-surface text-success"
                      : "bg-warning-surface text-warning",
                  )}
                >
                  {resolved
                    ? "Ledger: Processed · gateway: Processed"
                    : tr.ledgerStatusLabel}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-[13px]">
            <span className="text-text-muted font-medium">Explained</span>
            <span className="font-extrabold text-success tnum">
              ₹450 of ₹450 · 100%
            </span>
          </div>

          <Button size="compact" disabled={resolved} onClick={handleResolve}>
            {resolved ? "2 refunds matched" : "Match 2 refunds & resolve"}
          </Button>

          <p className="text-[11px] text-text-muted text-center">
            Cyber Hub cash short ₹120 booked to store P&amp;L
          </p>
        </Card>
      </div>
    </div>
  );
}
