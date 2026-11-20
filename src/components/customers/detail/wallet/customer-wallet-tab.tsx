"use client";

import * as React from "react";
import { CustomerWalletDetail } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { adjustCustomerWalletAction } from "@/store/slices/customers-slice";
import { cn } from "@/lib/utils/cn";
import { Pagination, usePagination } from "@/components/ui/pagination";

interface CustomerWalletTabProps {
  customerId: string;
  walletDetail: CustomerWalletDetail | null;
}

export function CustomerWalletTab({
  customerId,
  walletDetail,
}: CustomerWalletTabProps) {
  const dispatch = useAppDispatch();
  const [activeLedgerFilter, setActiveLedgerFilter] = React.useState<"All" | "Top-ups" | "Spends" | "Refunds">("All");

  // Adjust balance form state
  const [adjustType, setAdjustType] = React.useState<"credit" | "debit">("credit");
  const [adjustAmount, setAdjustAmount] = React.useState<number>(150);
  const [adjustReason, setAdjustReason] = React.useState<string>("Service recovery");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const allLedger = walletDetail?.ledger;
  const filteredLedger = React.useMemo(
    () =>
      (allLedger ?? []).filter((item) => {
        if (activeLedgerFilter === "Top-ups") return item.type === "Top-up";
        if (activeLedgerFilter === "Spends") return item.type === "Spend";
        if (activeLedgerFilter === "Refunds") return item.type === "Refund" || item.type === "Goodwill";
        return true;
      }),
    [allLedger, activeLedgerFilter],
  );
  const pager = usePagination(filteredLedger, 10, "entries");
  const resetPager = pager.reset;
  React.useEffect(() => {
    resetPager();
  }, [activeLedgerFilter, resetPager]);

  if (!walletDetail) {
    return (
      <div className="w-full min-h-[300px] rounded-[16px] border border-[#dce2ea] bg-white p-8 flex items-center justify-center text-center">
        <span className="font-sans text-[14px] text-[#55647a]">Loading wallet details...</span>
      </div>
    );
  }

  const {
    balance,
    walletCode,
    loadedLifetime,
    bonusEarned,
    spentLifetime,
    spentOrdersCount,
    refundsLifetime,
    refundsCountText,
    ledger,
    kycStatus,
    ppiLimit,
    auditTrail,
  } = walletDetail;

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustAmount || adjustAmount <= 0) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await dispatch(
        adjustCustomerWalletAction({
          id: customerId,
          amount: adjustAmount,
          type: adjustType,
          reason: adjustReason,
        })
      ).unwrap();
      setSuccessMessage(`Successfully ${adjustType === "credit" ? "credited" : "debited"} ₹${adjustAmount}`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const ppiPercent = Math.min(100, Math.round((balance / Math.max(1, ppiLimit)) * 100));
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const money = "font-display font-extrabold text-[#0f2340] tnum [font-variation-settings:'wdth'_112,'wght'_800]";
  const TYPE_STYLE: Record<string, string> = {
    Spend: "bg-[#f5f7fa] text-[#3f4b5e]",
    "Top-up": "bg-[#e3f4ea] text-[#1f7a4d]",
    Refund: "bg-[#e4f0fa] text-[#22629e]",
    Goodwill: "bg-[#fdf0d8] text-[#9a5b00]",
    Adjustment: "bg-[#f5f7fa] text-[#3f4b5e]",
  };
  const card = "rounded-[16px] border border-[#dce2ea] bg-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
      {/* Left column: KPIs + ledger */}
      <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
        <div className={cn(card, "overflow-hidden grid grid-cols-2 md:grid-cols-[218px_1fr_1fr_1fr] divide-x divide-[#dce2ea]")}>
          <div className="p-5 flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e]">Wallet balance</span>
            <span className={cn(money, "text-[32px] leading-[38px]")}>{inr(balance)}</span>
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
              {walletCode} · {walletDetail.status}
            </span>
          </div>
          {[
            { label: "Loaded lifetime", value: loadedLifetime, sub: bonusEarned > 0 ? `+${inr(bonusEarned)} bonus earned` : "No bonus earned", green: bonusEarned > 0 },
            { label: "Spent from wallet", value: spentLifetime, sub: `${spentOrdersCount} order${spentOrdersCount === 1 ? "" : "s"} paid by wallet` },
            { label: "Refunds & credits", value: refundsLifetime, sub: refundsCountText },
          ].map((k) => (
            <div key={k.label} className="p-5 flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e]">{k.label}</span>
              <span className={cn(money, "text-[20px] leading-7")}>{inr(k.value)}</span>
              <span className={cn("font-sans text-[12px] leading-4", k.green ? "text-[#1f7a4d]" : "text-[#3f4b5e]")}>
                {k.sub}
              </span>
            </div>
          ))}
        </div>

        <div className={cn(card, "overflow-hidden flex flex-col")}>
          <div className="px-5 py-4 flex items-center justify-between">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Ledger</h3>
            <div className="flex items-center gap-2">
              {(["All", "Top-ups", "Spends", "Refunds"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveLedgerFilter(tab)}
                  className={cn(
                    "h-9 px-4 rounded-full border-[1.5px] font-sans font-bold text-[14px] leading-5 transition-colors cursor-pointer",
                    activeLedgerFilter === tab
                      ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                      : "bg-white border-[#bcc6d3] text-[#0f2340] hover:border-[#7f8ca0]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[96px_104px_minmax(0,1fr)_96px_96px] gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]">
            <div>Date</div>
            <div>Type</div>
            <div>Description</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Balance</div>
          </div>

          {filteredLedger.length === 0 ? (
            <div className="px-5 py-10 text-center font-sans text-[14px] leading-5 text-[#55647a]">
              {ledger.length === 0 ? "No wallet activity yet." : "No entries for this filter."}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {pager.pageItems.map((row) => (
                <div key={row.id} className="grid grid-cols-[96px_104px_minmax(0,1fr)_96px_96px] gap-3 px-5 py-3 items-center min-h-14">
                  <div className="flex flex-col font-sans text-[14px] leading-5 text-[#0f2340]">
                    <span>{row.dateText}</span>
                    <span className="text-[#3f4b5e]">{row.timeText}</span>
                  </div>
                  <div>
                    <span className={cn("inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4", TYPE_STYLE[row.type] ?? TYPE_STYLE.Spend)}>
                      {row.type}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{row.title}</span>
                    <span className="font-sans text-[12px] leading-4 text-[#3f4b5e] truncate">{row.subtitle}</span>
                  </div>
                  <div className={cn("text-right text-[14px] leading-5", money, row.isCredit && "text-[#1f7a4d]")}>
                    {row.amountText}
                  </div>
                  <div className="text-right font-sans text-[14px] leading-5 text-[#0f2340] tnum">{row.balanceText}</div>
                </div>
              ))}
            </div>
          )}
          {filteredLedger.length > 0 && <Pagination {...pager.paginationProps} />}
        </div>
      </div>

      {/* Right column */}
      <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
        <form onSubmit={handleAdjustSubmit} className={cn(card, "p-5 flex flex-col gap-4")}>
          <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Adjust balance</h3>

          <div className="grid grid-cols-2 gap-1 bg-[#f5f7fa] p-1 rounded-[12px]">
            {([["credit", "Credit goodwill"], ["debit", "Debit"]] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setAdjustType(k)}
                className={cn(
                  "h-9 rounded-[8px] font-sans font-bold text-[14px] leading-5 transition-all cursor-pointer",
                  adjustType === k ? "bg-white text-[#0f2340] shadow-2xs" : "text-[#3f4b5e] hover:text-[#0f2340]",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">Amount</span>
              <div className="flex items-center h-10 rounded-[12px] border border-[#bcc6d3] px-3 gap-1 focus-within:border-[#1c3a66]">
                <span className={cn(money, "text-[14px]")}>₹</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className={cn(money, "w-full bg-transparent outline-none text-[14px]")}
                />
              </div>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">Reason</span>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] bg-white font-sans text-[14px] text-[#0f2340] outline-none focus:border-[#1c3a66] cursor-pointer"
              >
                <option value="Service recovery">Service recovery</option>
                <option value="Late order delivery">Late order delivery</option>
                <option value="Item out of stock">Item out of stock</option>
                <option value="Administrative correction">Administrative correction</option>
              </select>
            </label>
          </div>

          <p className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
            Credits up to ₹500 post instantly. Debits always need a reason and Finance approval before they post.
          </p>

          {successMessage && <span className="text-[12px] font-sans font-bold text-[#1f7a4d]">{successMessage}</span>}

          <button
            type="submit"
            disabled={isSubmitting || !adjustAmount || adjustAmount <= 0}
            className="h-10 w-full rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : `${adjustType === "credit" ? "Credit" : "Debit"} ₹${adjustAmount || 0} ${adjustType === "credit" ? "to" : "from"} wallet`}
          </button>
        </form>

        <div className={cn(card, "p-5 flex flex-col gap-3")}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Limits &amp; KYC</h3>
            {kycStatus && (
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#e3f4ea] text-[#1f7a4d] font-sans font-bold text-[12px] leading-4">
                {kycStatus}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between font-sans text-[14px] leading-5">
            <span className="text-[#3f4b5e]">Balance vs PPI limit</span>
            <span className={cn(money, "text-[14px]")}>{inr(balance)} / {inr(ppiLimit)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#ebeff4] overflow-hidden">
            <div className="h-full rounded-full bg-[#1c3a66]" style={{ width: `${ppiPercent}%` }} />
          </div>
          <p className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
            Wallet balance is capped at {inr(ppiLimit)} per customer (PPI). Top-ups that would exceed it are blocked at checkout. No cash-out.
          </p>
        </div>

        <div className={cn(card, "p-5 flex flex-col gap-3")}>
          <span className="font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]">Audit trail</span>
          {auditTrail.length === 0 ? (
            <p className="font-sans text-[14px] leading-5 text-[#55647a]">No activity yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {auditTrail.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 font-sans text-[14px] leading-5 text-[#0f2340]">
                  <span className="truncate">{item.action}</span>
                  <span className="shrink-0 text-[12px] leading-4 text-[#3f4b5e]">{item.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
