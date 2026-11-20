"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Pagination, DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { cn } from "@/lib/utils/cn";
import {
  CouponsApi,
  type CouponListItem,
  type CouponStatusFilter,
  type CouponSummary,
} from "@/lib/api/coupons";
import type { Paged } from "@/lib/api/wallet";
import { CouponStatusPill } from "./coupon-status-pill";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const card = "rounded-[16px] bg-white border border-[#dce2ea] shadow-2xs";
const kpiValue = "text-[32px] leading-[38px] font-extrabold font-archivo text-[#0f2340] tracking-[-0.96px] tnum";
const FILTERS: { id: CouponStatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "scheduled", label: "Scheduled" },
  { id: "paused", label: "Paused" },
  { id: "expired", label: "Ended" },
  { id: "archived", label: "Archived" },
];
const GRID = "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)_112px_88px_104px_104px_120px] gap-4";

function delta(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? { text: "New this month", good: true } : { text: "No redemptions yet", good: true };
  const pct = Math.round(((curr - prev) / prev) * 100);
  return { text: `${pct >= 0 ? "+" : ""}${pct}% vs previous 30 days`, good: pct >= 0 };
}

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Marketing → Coupons: KPI cards and the coupon table (Figma A086, built on the A080/A081 patterns). */
export function CouponsOverview() {
  const [summary, setSummary] = React.useState<CouponSummary | null>(null);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<Paged<CouponListItem> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<CouponStatusFilter>("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(DEFAULT_PAGE_SIZE);
  const q = useDebounced(search);

  React.useEffect(() => {
    CouponsApi.summary()
      .then((s) => { setSummary(s); setSummaryError(null); })
      .catch((e) => setSummaryError(e instanceof Error ? e.message : "Could not load coupon stats"));
  }, []);

  React.useEffect(() => {
    CouponsApi.list({ q, status, page, limit: size })
      .then((r) => { setRows(r); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load coupons"));
  }, [q, status, page, size]);

  const l = summary?.last30Days;
  const d = l ? delta(l.redemptions, l.previousRedemptions) : null;

  return (
    <div className="w-full flex flex-col gap-6">
      {summaryError && (
        <div className={cn(card, "p-4 text-[14px] font-manrope text-[#c0352b]")}>{summaryError}</div>
      )}

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {!summary
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className={cn(card, "h-[124px] p-[21px] flex flex-col justify-between animate-pulse")}>
                <div className="w-28 h-4 bg-[#ebeff4] rounded" />
                <div className="w-20 h-8 bg-[#dce2ea] rounded" />
                <div className="w-36 h-4 bg-[#ebeff4] rounded" />
              </div>
            ))
          : [
              {
                label: "Live coupons",
                value: String(summary.activeCount),
                sub: `${summary.scheduledCount} scheduled · ${summary.pausedCount} paused · ${summary.autoApplyCount} auto-apply`,
                tone: "text-[#3f4b5e] font-medium",
              },
              {
                label: "Redemptions · 30 days",
                value: l!.redemptions.toLocaleString("en-IN"),
                sub: d!.text,
                tone: d!.good ? "text-[#1f7a4d] font-bold" : "text-[#c0352b] font-bold",
              },
              {
                label: "Discount given · 30 days",
                value: inr(l!.discountGiven),
                sub: `Avg ${inr(l!.averageDiscount)} per order · ${l!.discountShareOfRevenue}% of revenue`,
                tone: "text-[#3f4b5e] font-medium",
              },
              {
                label: "Revenue with coupons · 30 days",
                value: inr(l!.orderRevenue),
                sub: `${l!.uniqueCustomers.toLocaleString("en-IN")} customers${summary.topCoupon ? ` · top ${summary.topCoupon.code}` : ""}`,
                tone: "text-[#3f4b5e] font-medium",
              },
            ].map((k) => (
              <div key={k.label} className={cn(card, "h-[124px] p-[21px] flex flex-col justify-between hover:border-[#bcc6d3] transition-colors")}>
                <span className="text-[14px] font-bold text-[#3f4b5e] font-manrope">{k.label}</span>
                <div className={kpiValue}>{k.value}</div>
                <span className={cn("text-[12px] font-manrope truncate", k.tone)}>{k.sub}</span>
              </div>
            ))}
      </div>

      <div className="w-full flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-[320px] h-9">
          <Search className="w-4 h-4 text-[#7f8ca0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search code or title"
            className="w-full h-9 pl-9 pr-3 rounded-[12px] border border-[#7f8ca0] bg-white text-[14px] font-manrope text-[#0f2340] placeholder:text-[#7f8ca0] outline-none focus:border-[#1c3a66]"
          />
        </div>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => { setStatus(f.id); setPage(1); }}
            className={cn(
              "h-9 px-4 rounded-full border-[1.5px] text-[14px] font-bold font-manrope cursor-pointer transition-colors",
              status === f.id ? "bg-[#1c3a66] border-[#1c3a66] text-white" : "bg-white border-[#bcc6d3] text-[#0f2340] hover:border-[#7f8ca0]",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-[14px] font-manrope text-[#3f4b5e]">
          {rows ? `${rows.total.toLocaleString("en-IN")} coupon${rows.total === 1 ? "" : "s"}` : ""}
        </span>
      </div>

      <div className={cn(card, "w-full overflow-hidden")}>
        <div className="overflow-x-auto">
          <div className="min-w-[960px]">
            <div className={cn(GRID, "h-9 px-5 items-center bg-[#f5f7fa] border-b border-[#dce2ea] text-[12px] leading-4 font-bold uppercase tracking-[0.48px] text-[#3f4b5e] font-manrope")}>
              <div>Coupon</div>
              <div>Offer · when</div>
              <div>Status</div>
              <div className="text-right">Used</div>
              <div className="text-right">Discount</div>
              <div className="text-right">Revenue</div>
              <div>Budget</div>
            </div>

            {error ? (
              <div className="px-5 py-10 text-center text-[14px] font-manrope text-[#c0352b]">{error}</div>
            ) : !rows ? (
              <div className="flex flex-col divide-y divide-[#dce2ea]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 px-5 flex items-center animate-pulse">
                    <div className="h-4 w-1/3 bg-[#ebeff4] rounded" />
                  </div>
                ))}
              </div>
            ) : rows.items.length === 0 ? (
              <div className="px-5 py-12 flex flex-col items-center gap-2 text-center font-manrope">
                <span className="text-[16px] font-bold text-[#0f2340]">
                  {q || status !== "all" ? "No coupons match these filters" : "No coupons yet"}
                </span>
                <span className="text-[14px] text-[#55647a]">
                  {q || status !== "all" ? "Try another search or status." : "Create the first code customers can use in the app."}
                </span>
                {!q && status === "all" && (
                  <Link href="/marketing/coupons/new" className="mt-2 h-9 px-4 inline-flex items-center rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white text-[14px] font-bold">
                    New coupon
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#dce2ea]">
                {rows.items.map((c) => (
                  <Link
                    key={c.id}
                    href={`/marketing/coupons/${c.id}`}
                    className={cn(GRID, "min-h-14 px-5 py-2.5 items-center hover:bg-[#f5f7fa] transition-colors font-manrope")}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] leading-5 font-extrabold font-archivo tracking-[0.2px] text-[#0f2340] truncate">{c.code}</span>
                      <span className="text-[12px] leading-4 text-[#3f4b5e] truncate">
                        {c.title}{c.redemptionMode === "AUTO" ? " · auto-apply" : ""}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] leading-5 text-[#0f2340] truncate">{c.offerText}</span>
                      <span className="text-[12px] leading-4 text-[#3f4b5e] truncate">{c.scheduleText}</span>
                    </div>
                    <div><CouponStatusPill status={c.status} /></div>
                    <div className="text-right text-[14px] text-[#0f2340] tnum">
                      {c.redemptions.toLocaleString("en-IN")}
                      {c.maxRedemptions != null && <span className="text-[#7f8ca0]"> / {c.maxRedemptions.toLocaleString("en-IN")}</span>}
                    </div>
                    <div className="text-right text-[14px] font-extrabold font-archivo text-[#0f2340] tnum">{inr(c.discountGiven)}</div>
                    <div className="text-right text-[14px] text-[#0f2340] tnum">{inr(c.orderRevenue)}</div>
                    <div className="flex flex-col gap-1">
                      {c.budget != null ? (
                        <>
                          <div className="h-1.5 rounded-full bg-[#ebeff4] overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", (c.budgetUsedPercent ?? 0) >= 80 ? "bg-[#c0352b]" : "bg-[#566f2c]")}
                              style={{ width: `${c.budgetUsedPercent ?? 0}%` }}
                            />
                          </div>
                          <span className="text-[12px] leading-4 text-[#3f4b5e] tnum">{c.budgetUsedPercent ?? 0}% of {inr(c.budget)}</span>
                        </>
                      ) : (
                        <span className="text-[12px] text-[#7f8ca0]">No cap</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {rows && rows.total > 0 && (
          <Pagination
            page={page}
            pageSize={size}
            total={rows.total}
            label="coupons"
            onPageChange={setPage}
            onPageSizeChange={(n) => { setSize(n); setPage(1); }}
          />
        )}
      </div>
    </div>
  );
}
