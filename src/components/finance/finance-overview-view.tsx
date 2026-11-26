"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FinanceModuleHeader,
  FinanceTabBar,
} from "@/components/finance/finance-header-and-tabs";
import {
  FINANCE_ATTENTION_ITEMS,
  PAYMENT_MIX_TODAY,
} from "@/lib/finance/mock-finance-data";
import { cn } from "@/lib/utils/cn";

export function FinanceOverviewView() {
  const [exported, setExported] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · TODAY, FRI 2 OCT · UPDATED 9:41 AM"
        title="Finance overview"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setExported(true);
                setTimeout(() => setExported(false), 2400);
              }}
            >
              {exported ? "Exported CSV" : "Export CSV"}
            </Button>
            <Button asChild size="compact">
              <Link href="/finance/settlements">Open daily close</Link>
            </Button>
          </>
        }
      />

      <FinanceTabBar active="overview" />

      {/* 4-Card Sales Bridge KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Gross sales
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            ₹4,42,800
          </span>
          <span className="text-[12px] text-text-muted">
            1,284 orders · before discounts
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Discounts
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            −₹19,600
          </span>
          <span className="text-[12px] text-text-muted">
            4.4% of gross · coupons, Club, loyalty
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-muted">
            Refunds
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-text">
            −₹4,600
          </span>
          <span className="text-[12px] font-semibold text-warning">
            14 refunds · 1 failed, retry due
          </span>
        </Card>

        <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-5 flex flex-col justify-between gap-2">
          <span className="text-[13px] font-medium text-text-inverse-secondary">
            Net sales today
          </span>
          <span className="text-price-l font-display font-extrabold tracking-[-0.96px] tnum text-white">
            ₹4,18,600
          </span>
          <span className="text-[12px] text-text-inverse-muted tnum">
            ₹4,42,800 − ₹19,600 − ₹4,600
          </span>
        </Card>
      </div>

      {/* 3-Card Analytical Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Payment Mix */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Payment mix
            </h2>
            <span className="text-[12px] text-text-muted">
              Share of net · today
            </span>
          </div>

          <div className="h-3 w-full rounded-full overflow-hidden flex gap-0.5">
            {PAYMENT_MIX_TODAY.map((m) => (
              <div
                key={m.label}
                className={m.colorClass}
                style={{ width: `${m.percent}%` }}
                title={`${m.label}: ${m.percent}%`}
              />
            ))}
          </div>

          <div className="flex flex-col divide-y divide-border/70">
            {PAYMENT_MIX_TODAY.map((m) => (
              <div
                key={m.label}
                className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-2 text-[13px]"
              >
                <span className="inline-flex items-center gap-2 font-semibold text-text">
                  <span className={cn("h-2.5 w-2.5 rounded-full", m.colorClass)} />
                  {m.label}
                </span>
                <div className="flex items-center gap-4 tnum">
                  <span className="text-text-muted font-medium">
                    {m.percent}%
                  </span>
                  <span className="font-extrabold text-text w-20 text-right">
                    ₹{m.amountInr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Settlements */}
        <Card className="p-5 flex flex-col gap-4">
          <h2 className="font-sans text-[16px] font-extrabold text-text">
            Settlements
          </h2>

          <div className="rounded-xl bg-surface-brand p-4 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-bold text-text">Razorpay · T+1</span>
              <span className="font-bold text-info">
                Due tomorrow, Sat 3 Oct
              </span>
            </div>
            <span className="text-price-m font-display font-extrabold text-text tnum mt-0.5">
              ≈ ₹2,90,150
            </span>
            <span className="text-[11px] text-text-muted">
              Today’s UPI + app/kiosk cards so far, net of fees
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border">
            <div className="py-3 pt-1 flex items-center justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-text">
                  Pine Labs · T+1
                </p>
                <p className="text-[11px] text-text-muted">
                  Counter cards · Sat 3 Oct
                </p>
              </div>
              <span className="text-[14px] font-extrabold text-text tnum">
                ≈ ₹53,050
              </span>
            </div>

            <div className="py-3 pb-0 flex items-center justify-between gap-2">
              <div>
                <p className="text-[13px] font-bold text-text">
                  Received today
                </p>
                <p className="text-[11px] text-text-muted">
                  For Thu 1 Oct · Razorpay + Pine Labs
                </p>
              </div>
              <span className="text-[14px] font-extrabold text-success tnum">
                ₹8,88,466
              </span>
            </div>
          </div>
        </Card>

        {/* October MTD */}
        <Card className="p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                October MTD
              </h2>
              <span className="text-[12px] text-text-muted">vs September</span>
            </div>
            <span className="text-price-l font-display font-extrabold text-text tnum mt-2">
              ₹15,02,800
            </span>
            <span className="text-[12px] text-text-muted">
              Net · 1–2 Oct (today in progress)
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[12px] tnum">
                <span className="text-text-secondary font-medium">
                  Thu 1 Oct
                </span>
                <span className="font-extrabold text-text">₹10,84,200</span>
              </div>
              <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
                <div className="h-full bg-primary rounded-full w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[12px] tnum">
                <span className="text-text-secondary font-medium">
                  Sep daily average
                </span>
                <span className="font-extrabold text-text">₹10,06,667</span>
              </div>
              <div className="h-2 w-full rounded-full bg-background-subtle overflow-hidden">
                <div className="h-full bg-accent rounded-full w-[92%]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[12px]">
            <span className="text-text-muted">September net ₹3.02 Cr</span>
            <span className="font-bold text-success tnum">
              ▲ 7.7% daily run-rate
            </span>
          </div>
        </Card>
      </div>

      {/* Needs Attention */}
      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-[16px] font-extrabold text-text">
            Needs attention
          </h2>
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error text-white px-1.5 text-[11px] font-extrabold tnum">
            {FINANCE_ATTENTION_ITEMS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 divide-y md:divide-y-0 divide-border">
          {FINANCE_ATTENTION_ITEMS.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-3 border-b border-border/70 last:border-b-0"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 rounded-full shrink-0",
                    item.dotTone === "error" && "bg-error",
                    item.dotTone === "warning" && "bg-warning",
                    item.dotTone === "primary" && "bg-primary",
                  )}
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <Link
                href={item.actionHref}
                className="text-[12px] font-bold text-primary hover:text-primary-pressed shrink-0"
              >
                {item.actionLabel}
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
