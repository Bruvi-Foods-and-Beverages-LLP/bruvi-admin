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
import { PAYMENT_ATTEMPTS } from "@/lib/finance/mock-finance-data";
import { PaymentAttemptStatus } from "@/types/finance";
import { cn } from "@/lib/utils/cn";

function PaymentStatusPill({ status }: { status: PaymentAttemptStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap",
        status === "Captured" && "bg-success-surface text-success",
        status === "Failed" && "bg-error-surface text-error",
        status === "Refunded" && "bg-info-surface text-info",
      )}
    >
      {status}
    </span>
  );
}

export function FinancePaymentsView() {
  const [search, setSearch] = React.useState("");
  const [method, setMethod] = React.useState("ALL");
  const [status, setStatus] = React.useState("ALL");
  const [gateway, setGateway] = React.useState("ALL");
  const [notice, setNotice] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return PAYMENT_ATTEMPTS.filter((p) => {
      if (method !== "ALL" && p.methodType !== method) return false;
      if (status !== "ALL" && p.status !== status) return false;
      if (gateway !== "ALL" && p.gateway !== gateway) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.paymentId.toLowerCase().includes(q) ||
          p.orderNumber.toLowerCase().includes(q) ||
          p.methodDetail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [gateway, method, search, status]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · TODAY, FRI 2 OCT · 1,323 ATTEMPTS"
        title="Payments"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setNotice("Exported today's payment attempts to CSV");
                setTimeout(() => setNotice(null), 2400);
              }}
            >
              Export CSV
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setNotice("Razorpay Merchant Dashboard link ready")
              }
            >
              Open Razorpay dashboard
            </Button>
          </>
        }
      />

      <FinanceTabBar active="payments" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Collected today
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹4,23,200
          </span>
          <span className="text-[12px] text-text-muted">
            1,284 payments · all methods
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Refunded
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹4,600
          </span>
          <span className="text-[12px] text-text-muted tnum">
            14 refunds · net ₹4,18,600
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Gateway fees
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ≈ ₹4,530
          </span>
          <span className="text-[12px] text-text-muted tnum">
            Razorpay ₹3,315 · Pine Labs ₹923 · other ₹293
          </span>
        </Card>

        <Card className="p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col justify-between gap-2">
            <span className="text-[13px] font-medium text-text-muted">
              Failed-payment rate
            </span>
            <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
              2.9%
            </span>
            <span className="text-[12px] font-semibold text-success tnum">
              39 of 1,323 · ▼ 0.4 pt
            </span>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[115px] text-[11px] tnum">
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-muted">UPI</span>
              <span className="font-bold text-text">3.4%</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-muted">Card</span>
              <span className="font-bold text-text">1.8%</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-muted">Wallet</span>
              <span className="font-bold text-text">0.2%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter + Transactions Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center flex-1 min-w-[230px]">
            <BruviIcon
              name="search"
              size={15}
              className="pointer-events-none absolute left-3 text-text-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Payment ID, order, UPI ref or last 4"
              className="h-9 w-full pl-9 pr-3 rounded-lg border border-border-input bg-white text-[13px] text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          <select
            aria-label="Filter by method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer"
          >
            <option value="ALL">Method: All</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Wallet">Wallet</option>
          </select>

          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border-2 border-primary bg-white text-[12px] font-bold text-text cursor-pointer"
          >
            <option value="ALL">Status: Captured, Failed, Refunded</option>
            <option value="Captured">Captured</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            aria-label="Filter by gateway"
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer"
          >
            <option value="ALL">Gateway: All</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Pine Labs">Pine Labs</option>
            <option value="BRUVI Wallet">BRUVI Wallet</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setMethod("ALL");
              setStatus("ALL");
              setGateway("ALL");
            }}
            className="h-9 px-2 text-[12px] font-bold text-primary hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-background-subtle/50 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                <th className="py-3 pl-5 pr-2">Time</th>
                <th className="py-3 px-2">Payment ID</th>
                <th className="py-3 px-2">Order</th>
                <th className="py-3 px-2">Store</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-right">Fee</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 pl-2 pr-5">Gateway</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row) => (
                <tr
                  key={row.paymentId}
                  className="hover:bg-background-subtle/60 transition-colors"
                >
                  <td className="py-3.5 pl-5 pr-2 text-[12px] text-text-muted tnum whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="py-3.5 px-2 text-[13px] font-bold text-text tnum whitespace-nowrap">
                    {row.paymentId}
                  </td>
                  <td className="py-3.5 px-2 text-[13px] font-extrabold text-primary whitespace-nowrap">
                    <Link href="/orders" className="hover:underline">
                      {row.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-2 text-[13px] font-medium text-text-secondary whitespace-nowrap">
                    {row.store}
                  </td>
                  <td className="py-3.5 px-2">
                    <p className="text-[13px] font-bold text-text">
                      {row.methodTitle}
                    </p>
                    <p
                      className={cn(
                        "text-[11px]",
                        row.status === "Failed"
                          ? "text-error font-semibold"
                          : "text-text-muted",
                      )}
                    >
                      {row.methodDetail}
                    </p>
                  </td>
                  <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-text tnum whitespace-nowrap">
                    ₹{row.amountInr.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-2 text-right text-[12px] text-text-muted tnum whitespace-nowrap">
                    {row.feeInr === null ? "—" : `₹${row.feeInr.toFixed(2)}`}
                  </td>
                  <td className="py-3.5 px-2">
                    <PaymentStatusPill status={row.status} />
                  </td>
                  <td className="py-3.5 pl-2 pr-5 text-[12px] font-medium text-text-secondary whitespace-nowrap">
                    {row.gateway}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <TableEmptyRow
                  colSpan={9}
                  title="No payment attempts match these filters"
                  description="No transactions today match your selected method, status, gateway, or search query."
                  filterChips={[
                    ...(method !== "ALL"
                      ? [
                          {
                            id: "method",
                            label: `Method: ${method}`,
                            onRemove: () => setMethod("ALL"),
                          },
                        ]
                      : []),
                    ...(status !== "ALL"
                      ? [
                          {
                            id: "status",
                            label: `Status: ${status}`,
                            onRemove: () => setStatus("ALL"),
                          },
                        ]
                      : []),
                    ...(gateway !== "ALL"
                      ? [
                          {
                            id: "gateway",
                            label: `Gateway: ${gateway}`,
                            onRemove: () => setGateway("ALL"),
                          },
                        ]
                      : []),
                    ...(search.trim()
                      ? [
                          {
                            id: "search",
                            label: `Search: “${search.trim()}”`,
                            onRemove: () => setSearch(""),
                          },
                        ]
                      : []),
                  ]}
                  actionLabel="Clear all filters"
                  onAction={() => {
                    setSearch("");
                    setMethod("ALL");
                    setStatus("ALL");
                    setGateway("ALL");
                  }}
                  secondaryActionLabel={
                    gateway !== "ALL" ? "Show all gateways" : undefined
                  }
                  onSecondaryAction={
                    gateway !== "ALL" ? () => setGateway("ALL") : undefined
                  }
                />
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-[12px] text-text-muted">
          <span>1–{filtered.length} of 1,323 attempts · newest first</span>
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
    </div>
  );
}
