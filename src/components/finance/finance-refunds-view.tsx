"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FinanceModuleHeader,
  FinanceTabBar,
} from "@/components/finance/finance-header-and-tabs";
import {
  INITIAL_REFUND_APPROVALS,
  REFUNDS_TODAY,
} from "@/lib/finance/mock-finance-data";
import { RefundApprovalItem, RefundStatus } from "@/types/finance";
import { cn } from "@/lib/utils/cn";

function RefundStatusPill({ status }: { status: RefundStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        status === "Initiated" && "bg-info-surface text-info",
        status === "Processed" && "bg-success-surface text-success",
        status === "Failed" && "bg-error-surface text-error",
      )}
    >
      {status}
    </span>
  );
}

export function FinanceRefundsView() {
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [approvals, setApprovals] = React.useState<RefundApprovalItem[]>(
    INITIAL_REFUND_APPROVALS,
  );
  const [notice, setNotice] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (statusFilter === "ALL") return REFUNDS_TODAY;
    return REFUNDS_TODAY.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  const handleDecision = (id: string, approved: boolean, amount: number) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    setNotice(
      approved
        ? `Approved ${id} (₹${amount.toLocaleString("en-IN")}) — queued for payout.`
        : `Rejected ${id} — requester notified.`,
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · TODAY, FRI 2 OCT · 14 REFUNDS"
        title="Refunds"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("Exported today's refunds to CSV")}
            >
              Export CSV
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setNotice("New refund drawer ready — select order ID to initiate")
              }
            >
              New refund
            </Button>
          </>
        }
      />

      <FinanceTabBar active="refunds" />

      {notice && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-2.5 text-[13px] font-bold text-success flex items-center justify-between">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Refunds Today Table */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Refunds today
              </h2>
              <p className="text-[12px] text-text-muted">
                14 refunds · ₹4,600 · refunds under ₹2,000 approved by store
                managers
              </p>
            </div>
            <select
              aria-label="Filter refunds by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="Processed">Processed</option>
              <option value="Initiated">Initiated</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3 pl-5 pr-2">Refund · order</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                  <th className="py-3 px-2">To</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Approver</th>
                  <th className="py-3 pl-2 pr-5 text-right">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((rf) => (
                  <tr
                    key={rf.id}
                    className="hover:bg-background-subtle/60 transition-colors"
                  >
                    <td className="py-3 pl-5 pr-2">
                      <p className="text-[13px] font-extrabold text-text tnum">
                        {rf.id}
                      </p>
                      <p
                        className={cn(
                          "text-[11px]",
                          rf.status === "Failed"
                            ? "text-error font-semibold"
                            : "text-text-muted",
                        )}
                      >
                        {rf.orderNumber} · {rf.store} · {rf.reason}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                      ₹{rf.amountInr.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-[12px] font-semibold text-text-secondary">
                      {rf.destination}
                    </td>
                    <td className="py-3 px-2">
                      <RefundStatusPill status={rf.status} />
                    </td>
                    <td className="py-3 px-2 text-[12px] font-medium text-text-secondary whitespace-nowrap">
                      {rf.approver}
                    </td>
                    <td className="py-3 pl-2 pr-5 text-right whitespace-nowrap">
                      <p
                        className={cn(
                          "text-[12px] font-bold",
                          rf.slaTone === "error" ? "text-error" : "text-text",
                        )}
                      >
                        {rf.slaTop}
                      </p>
                      <p
                        className={cn(
                          "text-[11px]",
                          rf.slaTone === "success" && "text-success font-semibold",
                          rf.slaTone === "normal" && "text-text-muted",
                          rf.slaTone === "error" && "text-text-muted",
                        )}
                      >
                        {rf.slaBottom}
                      </p>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <TableEmptyRow
                    colSpan={6}
                    title="No refunds match this status"
                    description={`There are no ${statusFilter.toLowerCase()} refunds for today.`}
                    filterChips={
                      statusFilter !== "ALL"
                        ? [
                            {
                              id: "status",
                              label: `Status: ${statusFilter}`,
                              onRemove: () => setStatusFilter("ALL"),
                            },
                          ]
                        : undefined
                    }
                    actionLabel="Clear all filters"
                    onAction={() => setStatusFilter("ALL")}
                  />
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-[12px] text-text-muted">
            <span className="tnum">
              1–{filtered.length} of 14 · ₹2,404.50 of ₹4,600 shown
            </span>
            <div className="flex items-center gap-3 font-bold">
              <button type="button" disabled className="text-text-muted/50">
                ← Prev
              </button>
              <button type="button" className="text-text hover:text-primary cursor-pointer">
                Next →
              </button>
            </div>
          </div>
        </Card>

        {/* Right: Status Summary + Approval Queue */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Status today
              </h2>
              <span className="text-[15px] font-display font-extrabold text-text tnum">
                ₹4,600
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5">
              <div className="bg-success" style={{ width: "75%" }} />
              <div className="bg-info" style={{ width: "21%" }} />
              <div className="bg-error" style={{ width: "4%" }} />
            </div>

            <div className="flex flex-col gap-2 text-[13px] tnum">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-text font-medium">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Processed · 10
                </span>
                <span className="font-extrabold text-text">₹3,445.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-text font-medium">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  Initiated · 3
                </span>
                <span className="font-extrabold text-text">₹955.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-text font-medium">
                  <span className="h-2 w-2 rounded-full bg-error" />
                  Failed · 1
                </span>
                <span className="font-extrabold text-text">₹199.50</span>
              </div>
            </div>

            <p className="pt-2 border-t border-border text-[11px] text-text-muted">
              SLA: UPI &amp; wallet instant · cards 5–7 working days · 13 of 14
              on track
            </p>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  Approval queue
                </h2>
                <p className="text-[11px] text-text-muted">
                  Over ₹2,000 · Finance approves
                </p>
              </div>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-warning-surface text-warning px-1.5 text-[11px] font-extrabold tnum">
                {approvals.length}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {approvals.map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold text-text">
                        {item.id} · {item.store}
                      </p>
                      <p className="text-[12px] text-text-secondary">
                        {item.subtitle}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {item.requesterMeta}
                      </p>
                    </div>
                    <span className="text-[15px] font-display font-extrabold text-text tnum shrink-0">
                      ₹{item.amountInr.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      variant="workspace"
                      size="compact"
                      onClick={() =>
                        handleDecision(item.id, false, item.amountInr)
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      size="compact"
                      onClick={() =>
                        handleDecision(item.id, true, item.amountInr)
                      }
                    >
                      Approve ₹{item.amountInr.toLocaleString("en-IN")}
                    </Button>
                  </div>
                </div>
              ))}

              {approvals.length === 0 && (
                <div className="py-6 text-center text-[12px] text-text-muted flex flex-col items-center gap-1.5">
                  <BruviIcon name="check" size={18} className="text-success" />
                  <span>All high-value refunds reviewed.</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
