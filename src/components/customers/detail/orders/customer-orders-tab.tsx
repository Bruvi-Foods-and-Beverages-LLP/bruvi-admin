"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { CustomerOrdersDetail } from "@/types/customers";
import { cn } from "@/lib/utils/cn";
import { Pagination, usePagination } from "@/components/ui/pagination";

interface CustomerOrdersTabProps {
  ordersDetail: CustomerOrdersDetail | null;
}

type ChannelFilter = "all" | "app" | "counter" | "kiosk";
type RangeFilter = "30" | "90" | "365" | "all";

const COLS = "grid-cols-[96px_136px_176px_minmax(0,1fr)_96px_104px_96px_88px]";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <label className="relative inline-flex h-9 items-center rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-white pl-3.5 pr-9 font-sans font-bold text-[14px] leading-5 text-[#0f2340] cursor-pointer">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none bg-transparent outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#0f2340]" />
    </label>
  );
}

const STATUS_STYLE: Record<string, string> = {
  Paid: "bg-[#e3f4ea] text-[#1f7a4d]",
  Preparing: "bg-[#e4f0fa] text-[#22629e]",
  Cancelled: "bg-[#fce8e6] text-[#c0352b]",
};

export function CustomerOrdersTab({ ordersDetail }: CustomerOrdersTabProps) {
  const [channel, setChannel] = React.useState<ChannelFilter>("all");
  const [range, setRange] = React.useState<RangeFilter>("90");
  const cutoffMs = range === "all" ? 0 : Number(range) * 86_400_000;
  const allOrders = ordersDetail?.orders;
  const filtered = React.useMemo(() => {
    const cutoff = cutoffMs ? Date.now() - cutoffMs : 0;
    return (allOrders ?? []).filter(
      (o) => (channel === "all" || o.channelKey === channel) && new Date(o.createdAt).getTime() >= cutoff,
    );
  }, [allOrders, channel, cutoffMs]);
  const pager = usePagination(filtered, 10, "orders");
  React.useEffect(() => {
    pager.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, range]);

  if (!ordersDetail) {
    return (
      <div className="w-full min-h-[300px] rounded-[16px] border border-[#dce2ea] bg-white p-8 flex items-center justify-center text-center">
        <span className="font-sans text-[14px] text-[#55647a]">Loading orders...</span>
      </div>
    );
  }

  const { spendByMonth, spendSummaryText, currentMonthSpend, currentMonthLabel, totalOrders, channelSplit, orders } =
    ordersDetail;
  const maxMonth = Math.max(...spendByMonth.map((m) => m.amount), 1);

  const visible = pager.pageItems;

  const legend = [
    { key: "app", label: "App · pickup", dot: "bg-[#1c3a66]", ...channelSplit.app },
    { key: "counter", label: "Counter · linked by phone", dot: "bg-[#a9d8f3]", ...channelSplit.counter },
    { key: "kiosk", label: "Kiosk", dot: "bg-[#6b4430]", ...channelSplit.kiosk },
  ];
  const hasSplit = legend.some((l) => l.count > 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Spend by month */}
        <div className="lg:col-span-8 rounded-[16px] border border-[#dce2ea] bg-white p-5 flex flex-col gap-4 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Spend by month</h3>
              <p className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e]">{spendSummaryText}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-display font-extrabold text-[20px] leading-7 text-[#0f2340] tnum [font-variation-settings:'wdth'_112,'wght'_800]">
                {inr(currentMonthSpend)}
              </span>
              <span className="font-sans font-bold text-[12px] leading-4 text-[#1f7a4d]">{currentMonthLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-[24px]">
            {spendByMonth.map((m) => (
              <div key={m.month} className="flex flex-col gap-2">
                <div className="h-20 flex items-end">
                  <div
                    className={cn("w-full rounded-t-[4px]", m.isCurrent ? "bg-[#1c3a66]" : "bg-[#7f8ca0]/70")}
                    style={{ height: m.amount > 0 ? `${Math.max(4, Math.round((m.amount / maxMonth) * 80))}px` : "2px" }}
                  />
                </div>
                <div className="flex items-center justify-between font-sans text-[12px] leading-4">
                  <span className={cn(m.isCurrent ? "font-bold text-[#0f2340]" : "font-medium text-[#3f4b5e]")}>
                    {m.month}
                  </span>
                  <span className="font-bold text-[#0f2340] tnum">{inr(m.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel split */}
        <div className="lg:col-span-4 rounded-[16px] border border-[#dce2ea] bg-white p-5 flex flex-col gap-4 shadow-2xs">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Channel split</h3>
            <p className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e]">
              {totalOrders} order{totalOrders === 1 ? "" : "s"}
            </p>
          </div>

          {hasSplit ? (
            <>
              <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-[#ebeff4]">
                {legend
                  .filter((l) => l.count > 0)
                  .map((l) => (
                    <div key={l.key} className={l.dot} style={{ flexGrow: l.count, flexBasis: 0 }} />
                  ))}
              </div>
              <div className="flex flex-col gap-1">
                {legend.map((l) => (
                  <div key={l.key} className="flex items-center gap-2 h-7 font-sans text-[14px] leading-5">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", l.dot)} />
                    <span className="flex-1 font-medium text-[#0f2340] truncate">{l.label}</span>
                    <span className="text-[#3f4b5e] tnum">
                      {l.count} order{l.count === 1 ? "" : "s"}
                    </span>
                    <span className="w-10 text-right font-bold text-[#0f2340] tnum">{l.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="font-sans text-[14px] leading-5 text-[#55647a]">No orders yet.</p>
          )}
        </div>
      </div>

      {/* Orders table */}
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        <div className="px-5 py-4 flex items-center justify-between">
          <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Orders</h3>
          <div className="flex items-center gap-2">
            <FilterSelect
              label="Channel"
              value={channel}
              onChange={setChannel}
              options={[
                { value: "all", label: "All channels" },
                { value: "app", label: "App" },
                { value: "counter", label: "Counter" },
                { value: "kiosk", label: "Kiosk" },
              ]}
            />
            <FilterSelect
              label="Date range"
              value={range}
              onChange={setRange}
              options={[
                { value: "30", label: "Last 30 days" },
                { value: "90", label: "Last 90 days" },
                { value: "365", label: "Last year" },
                { value: "all", label: "All time" },
              ]}
            />
          </div>
        </div>

        <div
          className={cn(
            "grid gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]",
            COLS,
          )}
        >
          <div>Order</div>
          <div>Placed</div>
          <div>Channel · store</div>
          <div>Items</div>
          <div>Payment</div>
          <div>Status</div>
          <div className="text-right">Points</div>
          <div className="text-right">Total</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center font-sans text-[14px] leading-5 text-[#55647a]">
            {orders.length === 0 ? "No orders yet." : "No orders match these filters."}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#dce2ea]">
            {visible.map((o) => {
              const [chan, ...rest] = o.channel.split(" · ");
              return (
                <div key={o.id} className={cn("grid gap-3 px-5 py-3 items-center min-h-14", COLS)}>
                  <div className="font-display font-extrabold text-[14px] leading-5 text-[#1c3a66] [font-variation-settings:'wdth'_112,'wght'_800]">
                    {o.displayCode}
                  </div>
                  <div className="font-sans text-[14px] leading-5 text-[#0f2340]">{o.placedTime}</div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">
                      {chan}
                      {rest.length > 0 ? ` · ${rest.join(" · ")}` : ""}
                    </span>
                    {o.channelSubtext && (
                      <span className="font-sans text-[12px] leading-4 text-[#3f4b5e] truncate">{o.channelSubtext}</span>
                    )}
                  </div>
                  <div className="font-sans text-[14px] leading-5 text-[#3f4b5e] line-clamp-2">{o.itemsDescription}</div>
                  <div className="font-sans text-[14px] leading-5 text-[#0f2340]">{o.paymentMethod}</div>
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4",
                        STATUS_STYLE[o.status] ?? "bg-[#f5f7fa] text-[#3f4b5e]",
                      )}
                    >
                      {o.status}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "text-right font-sans font-bold text-[14px] leading-5 tnum",
                      o.pointsText.startsWith("+") ? "text-[#1f7a4d]" : "text-[#3f4b5e]",
                    )}
                  >
                    {o.pointsText}
                  </div>
                  <div className="text-right font-display font-extrabold text-[14px] leading-5 text-[#0f2340] tnum [font-variation-settings:'wdth'_112,'wght'_800]">
                    {inr(o.total)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {filtered.length > 0 && <Pagination {...pager.paginationProps} />}
      </div>
    </div>
  );
}
