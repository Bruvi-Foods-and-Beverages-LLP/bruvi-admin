"use client";

import * as React from "react";
import { CustomerLoyaltyDetail } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { addCustomerPointsAction } from "@/store/slices/customers-slice";
import { cn } from "@/lib/utils/cn";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { ChevronDown, Gift } from "lucide-react";
import { ProductImage } from "@/components/catalog/product-image";

interface CustomerLoyaltyTabProps {
  customerId: string;
  loyaltyDetail: CustomerLoyaltyDetail | null;
}

export function CustomerLoyaltyTab({
  customerId,
  loyaltyDetail,
}: CustomerLoyaltyTabProps) {
  const dispatch = useAppDispatch();

  // Manual Adjustment form state
  const [pointsAdjustment, setPointsAdjustment] = React.useState<number>(100);
  const [adjustReason, setAdjustReason] = React.useState<string>("Missed points · counter");
  const [auditNote, setAuditNote] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const pager = usePagination(loyaltyDetail?.ledger ?? [], 10, "entries");

  if (!loyaltyDetail) {
    return (
      <div className="w-full min-h-[300px] rounded-[16px] border border-[#dce2ea] bg-white p-8 flex items-center justify-center text-center">
        <span className="font-sans text-[14px] text-[#55647a]">Loading loyalty details...</span>
      </div>
    );
  }

  const {
    pointsBalance,
    pointsValueInr,
    currentTier,
    nextTier,
    currentTierFloor,
    expiryMonths,
    earnMultiplierText,
    targetPoints,
    progressPercent,
    progressSubtitle,
    expiringPtsText,
    ledger,
    availableRewards,
  } = loyaltyDetail;

  const handleManualPointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointsAdjustment) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await dispatch(
        addCustomerPointsAction({
          id: customerId,
          points: pointsAdjustment,
          reason: adjustReason,
          note: auditNote || undefined,
        })
      ).unwrap();
      setSuccessMessage(`Successfully added ${pointsAdjustment} points`);
      setAuditNote("");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewNewBalance = pointsBalance + (Number.isFinite(pointsAdjustment) ? pointsAdjustment : 0);
  const unlockedCount = availableRewards.filter((r) => r.unlocked).length;
  const money = "font-display font-extrabold tnum [font-variation-settings:'wdth'_112,'wght'_800]";
  const card = "rounded-[16px] border border-[#dce2ea] bg-white";
  const TYPE_STYLE: Record<string, string> = {
    Earned: "bg-[#e3f4ea] text-[#1f7a4d]",
    Pending: "bg-[#fdf0d8] text-[#9a5b00]",
    Expiring: "bg-[#fdf0d8] text-[#9a5b00]",
    Redeemed: "bg-[#e4f0fa] text-[#22629e]",
  };

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ["Date", "Time", "Type", "Detail", "Points", "Balance"],
      ...ledger.map((r) => [r.dateText, r.timeText, r.type, `${r.title} - ${r.subtitle}`, r.pointsText, r.balanceText]),
    ];
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "points-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
      {/* Left: hero + ledger */}
      <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
        <div className="rounded-[16px] bg-[#1c3a66] p-8 flex flex-col md:flex-row gap-8 text-white">
          <div className="flex flex-col gap-1 shrink-0 md:w-[170px]">
            <span className="font-serif text-[11px] leading-[14px] uppercase tracking-[1.54px] text-[#a9d8f3]">
              Points balance
            </span>
            <span className={cn(money, "text-[40px] leading-[44px] text-white")}>
              {pointsBalance.toLocaleString("en-IN")}
            </span>
            <span className="font-sans text-[12px] leading-4 text-[#cde9f9]">
              ≈ ₹{pointsValueInr.toLocaleString("en-IN")} value · 1 pt ≈ ₹0.10
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-white">
              {currentTier} → {nextTier}
            </h3>
            <div className="flex items-center justify-between font-sans text-[14px] leading-5 text-[#cde9f9]">
              <span>{progressSubtitle}</span>
              <span className="font-bold text-white tnum">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden my-1">
              <div className="h-full rounded-full bg-[#a9d8f3] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex items-center justify-between font-sans text-[12px] leading-4 text-[#cde9f9]">
              <span>{currentTier} {currentTierFloor.toLocaleString("en-IN")}</span>
              <span>{nextTier} {targetPoints.toLocaleString("en-IN")}</span>
            </div>
            {(earnMultiplierText || expiringPtsText) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {earnMultiplierText && (
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/10 text-[#cde9f9] font-sans font-bold text-[12px] leading-4">
                    {earnMultiplierText}
                  </span>
                )}
                {expiringPtsText && <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-[#c0352b]/30 text-[#f4978e] font-sans font-bold text-[12px] leading-4">
                  {expiringPtsText}
                </span>}
              </div>
            )}
          </div>
        </div>

        <div className={cn(card, "overflow-hidden flex flex-col")}>
          <div className="px-5 py-4 flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Points ledger</h3>
              <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">Points expire {expiryMonths} months after they&rsquo;re earned</span>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              disabled={ledger.length === 0}
              className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] hover:underline cursor-pointer disabled:opacity-40"
            >
              Export
            </button>
          </div>

          <div className="grid grid-cols-[96px_104px_minmax(0,1fr)_88px_88px] gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]">
            <div>Date</div>
            <div>Type</div>
            <div>Detail</div>
            <div className="text-right">Points</div>
            <div className="text-right">Balance</div>
          </div>

          {ledger.length === 0 ? (
            <div className="px-5 py-10 text-center font-sans text-[14px] leading-5 text-[#55647a]">No points activity yet.</div>
          ) : (
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {pager.pageItems.map((row) => (
                <div key={row.id} className="grid grid-cols-[96px_104px_minmax(0,1fr)_88px_88px] gap-3 px-5 py-3 items-center min-h-14">
                  <div className="flex flex-col font-sans text-[14px] leading-5 text-[#0f2340]">
                    <span>{row.dateText}</span>
                    <span className="text-[#3f4b5e]">{row.timeText}</span>
                  </div>
                  <div>
                    <span className={cn("inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4", TYPE_STYLE[row.type] ?? "bg-[#f5f7fa] text-[#3f4b5e]")}>
                      {row.type}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{row.title}</span>
                    <span className="font-sans text-[12px] leading-4 text-[#3f4b5e] truncate">{row.subtitle}</span>
                  </div>
                  <div className={cn("text-right text-[14px] leading-5", money, row.isPositive ? "text-[#1f7a4d]" : "text-[#0f2340]")}>
                    {row.pointsText}
                  </div>
                  <div className="text-right font-sans text-[14px] leading-5 text-[#0f2340] tnum">{row.balanceText}</div>
                </div>
              ))}
            </div>
          )}
          {ledger.length > 0 && <Pagination {...pager.paginationProps} />}
        </div>
      </div>

      {/* Right: rewards + adjustment */}
      <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
        <div className={cn(card, "p-5 flex flex-col gap-4")}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Rewards available</h3>
            {availableRewards.length > 0 && (
              <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
                {unlockedCount} of {availableRewards.length} unlocked
              </span>
            )}
          </div>

          {availableRewards.length === 0 ? (
            <p className="font-sans text-[14px] leading-5 text-[#55647a]">No rewards in the catalogue yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {availableRewards.map((reward) => (
                <div key={reward.id} className={cn("flex items-center gap-3", !reward.unlocked && "opacity-60")}>
                  <div className="relative h-10 w-10 shrink-0 rounded-[8px] bg-[#e8f5fd] overflow-hidden flex items-center justify-center text-[#1c3a66]">
                    {reward.imageUrl ? (
                      <ProductImage src={reward.imageUrl} alt={reward.title} sizes="40px" iconSize={18} />
                    ) : (
                      <Gift className="h-4 w-4" />
                    )}
                  </div>
                  <span className="flex-1 font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{reward.title}</span>
                  <span className="font-sans text-[14px] leading-5 text-[#0f2340] tnum">
                    {reward.pointsCost.toLocaleString("en-IN")} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleManualPointsSubmit} className={cn(card, "p-5 flex flex-col gap-3")}>
          <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Manual adjustment</h3>

          <div className="grid grid-cols-[120px_1fr] gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">Points</span>
              <input
                type="number"
                value={pointsAdjustment}
                onChange={(e) => setPointsAdjustment(Number(e.target.value))}
                className={cn(money, "h-10 px-3 rounded-[12px] border-[1.5px] border-[#1c3a66] text-[14px] text-[#0f2340] outline-none")}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">Reason</span>
              <span className="relative flex items-center">
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="h-10 w-full appearance-none pl-3 pr-9 rounded-[12px] border border-[#bcc6d3] bg-white font-sans text-[14px] text-[#0f2340] outline-none focus:border-[#1c3a66] cursor-pointer"
                >
                  <option value="Missed points · counter">Missed points · counter</option>
                  <option value="Promotion bonus">Promotion bonus</option>
                  <option value="Service recovery">Service recovery</option>
                  <option value="Birthday credit">Birthday credit</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#0f2340]" />
              </span>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340]">Note for audit log</span>
            <textarea
              rows={3}
              placeholder="e.g. 14 Sep counter order not linked to phone"
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
              className="px-3 py-2 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] leading-5 text-[#0f2340] placeholder:text-[#7f8ca0] outline-none focus:border-[#1c3a66] resize-none"
            />
          </label>

          {successMessage && <span className="text-[12px] font-sans font-bold text-[#1f7a4d]">{successMessage}</span>}

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
              New balance {previewNewBalance.toLocaleString("en-IN")} · {currentTier}
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !pointsAdjustment}
              className="h-10 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? "Updating..." : `${pointsAdjustment < 0 ? "Deduct" : "Add"} ${Math.abs(pointsAdjustment || 0)} pts`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
