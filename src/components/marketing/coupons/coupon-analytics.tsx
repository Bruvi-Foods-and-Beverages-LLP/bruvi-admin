"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Pagination, DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { CouponsApi, type CouponAnalytics, type CouponRedemption } from "@/lib/api/coupons";
import type { Paged } from "@/lib/api/wallet";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const card = "w-full rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col gap-3";
const big = "text-[32px] leading-[38px] font-black font-archivo text-[#0f2340] tracking-[-0.96px] tnum";

function when(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })} ${d
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase()}`;
}

/** "Redemption so far" card (Figma 474:243786). */
export function CouponRedemptionCard({ data }: { data: CouponAnalytics | null }) {
  if (!data) {
    return <div className={cn(card, "h-[250px] animate-pulse")}><div className="h-5 w-40 bg-[#ebeff4] rounded" /></div>;
  }
  const max = Math.max(1, ...data.last7Days.map((d) => d.redemptions));
  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">Redemption so far</h3>
        <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">{data.sinceText}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className={big}>{data.redemptions.toLocaleString("en-IN")}</span>
          <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">
            redemptions · {data.uniqueCustomers.toLocaleString("en-IN")} customers
          </span>
        </div>
        <div className="flex flex-col">
          <span className={big}>{inr(data.orderRevenue)}</span>
          <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">order revenue</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[12px] leading-4 font-manrope">
          <span className="text-[#3f4b5e]">Discount given</span>
          <span className="font-bold text-[#0f2340] tnum">
            {data.budget != null
              ? `${inr(data.discountGiven)} of ${inr(data.budget)} · ${data.budgetUsedPercent ?? 0}%`
              : `${inr(data.discountGiven)} · no budget cap`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#ebeff4] overflow-hidden">
          <div
            className={cn("h-full rounded-full", data.budgetAlertReached ? "bg-[#c0352b]" : "bg-[#566f2c]")}
            style={{ width: `${data.budget != null ? data.budgetUsedPercent ?? 0 : 0}%` }}
          />
        </div>
      </div>
      <div className="flex items-end gap-2 h-[60px]">
        {data.last7Days.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <div
              className={cn("w-full rounded-t-[4px]", d.off ? "bg-[#ebeff4]" : "bg-[#566f2c]")}
              style={{ height: d.off ? 2 : `${Math.max(4, (d.redemptions / max) * 40)}px` }}
              title={`${d.redemptions} redemptions`}
            />
            <span className={cn("text-[11px] leading-[14px] font-manrope whitespace-nowrap", d.off ? "font-bold text-[#0f2340]" : "text-[#3f4b5e]")}>
              {d.off ? `${d.label.split(" ")[0]} · off` : `${d.label.split(" ")[0]} ${d.redemptions}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Fraud guard" card (Figma 474:243819), driven by the coupon's limits and real rejected attempts. */
export function CouponGuardCard({ data }: { data: CouponAnalytics | null }) {
  if (!data) {
    return <div className={cn(card, "h-[383px] animate-pulse")}><div className="h-5 w-32 bg-[#ebeff4] rounded" /></div>;
  }
  const g = data.guard;
  const top = g.recent[0];
  return (
    <div className={card}>
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope inline-flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" /> Fraud guard
        </h3>
        <span className="text-[12px] leading-4 font-bold text-[#1f7a4d] font-manrope">On</span>
      </div>
      <p className="text-[14px] leading-5 text-[#3f4b5e] font-manrope">{g.rules.join(" · ")}</p>
      {top ? (
        <div className="rounded-[12px] bg-[#fce8e6] p-3 pl-4 relative overflow-hidden">
          <span className="absolute left-3 top-3 bottom-3 w-1 rounded-full bg-[#c0352b]" />
          <div className="pl-4 flex flex-col gap-0.5 font-manrope">
            <span className="text-[14px] leading-5 font-bold text-[#0f2340]">
              {g.blockedThisWeek} attempt{g.blockedThisWeek === 1 ? "" : "s"} blocked
            </span>
            <span className="text-[12px] leading-4 text-[#3f4b5e]">
              Latest: {top.customerName} · {top.reason} · {when(top.at)}
              {top.attempts > 1 ? ` · ${top.attempts} tries` : ""}
            </span>
            <Link href={`/customers/${top.customerId}`} className="text-[12px] leading-4 font-bold text-[#1c3a66] hover:underline w-fit">
              Review customer
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-[12px] bg-[#f5f7fa] p-3 text-[14px] leading-5 text-[#3f4b5e] font-manrope">
          No blocked attempts this week.
        </div>
      )}
      {g.byReason.length > 0 && (
        <div className="flex flex-col gap-1">
          {g.byReason.slice(0, 3).map((r) => (
            <div key={r.code} className="flex items-center justify-between text-[12px] leading-4 font-manrope">
              <span className="text-[#3f4b5e]">{r.label}</span>
              <span className="font-bold text-[#0f2340] tnum">{r.count}</span>
            </div>
          ))}
        </div>
      )}
      <div className="border-t border-[#dce2ea] pt-3 grid grid-cols-3 gap-2">
        {[
          [g.blockedThisWeek, "blocked this week"],
          [g.customersBlocked, "customers blocked"],
          [g.repeatAttempters, "3+ tries"],
        ].map(([n, l]) => (
          <div key={l as string} className="flex flex-col">
            <span className="text-[20px] leading-7 font-extrabold font-archivo text-[#0f2340] tnum">{n as number}</span>
            <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Orders that used the coupon. */
export function CouponRedemptionsTable({ couponId, reloadKey }: { couponId: string; reloadKey: number }) {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = React.useState<Paged<CouponRedemption> | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    CouponsApi.redemptions(couponId, { page, limit: size })
      .then((r) => { setData(r); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load redemptions"));
  }, [couponId, page, size, reloadKey]);

  const grid = "grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_120px_160px] gap-4";
  return (
    <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] overflow-hidden">
      <div className="px-5 py-4">
        <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">Redemptions</h3>
        <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">Every order that used this coupon, newest first</span>
      </div>
      <div className={cn(grid, "h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] text-[12px] leading-4 font-bold uppercase tracking-[0.48px] text-[#3f4b5e] font-manrope")}>
        <div>Customer</div><div>Order</div><div className="text-right">Order total</div><div className="text-right">Discount</div><div className="text-right">When</div>
      </div>
      {error ? (
        <div className="px-5 py-8 text-center text-[14px] text-[#c0352b] font-manrope">{error}</div>
      ) : !data ? (
        <div className="px-5 py-8 text-center text-[14px] text-[#55647a] font-manrope">Loading redemptions…</div>
      ) : data.items.length === 0 ? (
        <div className="px-5 py-10 text-center text-[14px] text-[#55647a] font-manrope">No orders have used this coupon yet.</div>
      ) : (
        <div className="flex flex-col divide-y divide-[#dce2ea] font-manrope">
          {data.items.map((r, i) => (
            <div key={`${r.orderId}-${i}`} className={cn(grid, "min-h-14 px-5 py-2.5 items-center")}>
              <Link href={`/customers/${r.customerId}`} className="text-[14px] font-bold text-[#0f2340] truncate hover:underline">{r.customerName}</Link>
              <div className="text-[14px] text-[#3f4b5e] truncate">
                {r.orderId && r.orderNumber ? (
                  <Link href={`/orders/${r.orderId}`} className="hover:underline">{r.orderNumber}</Link>
                ) : "—"}
              </div>
              <div className="text-right text-[14px] text-[#0f2340] tnum">{inr(r.orderTotal)}</div>
              <div className="text-right text-[14px] font-extrabold font-archivo text-[#1f7a4d] tnum">−{inr(r.discount)}</div>
              <div className="text-right text-[12px] text-[#3f4b5e]">{when(r.redeemedAt)}</div>
            </div>
          ))}
        </div>
      )}
      {data && data.total > 0 && (
        <Pagination page={page} pageSize={size} total={data.total} label="redemptions" onPageChange={setPage} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
      )}
    </div>
  );
}
