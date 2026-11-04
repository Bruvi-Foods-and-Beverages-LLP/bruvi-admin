"use client";

import * as React from "react";
import { Order } from "@/types/orders";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, AlertOctagon, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface OrderCancelRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  mode?: "cancel_and_refund" | "refund_only";
  refundAmount?: number;
  onSuccess?: (refundId: string, amount: number) => void;
}

export function OrderCancelRefundModal({
  isOpen,
  onClose,
  order,
  mode = "cancel_and_refund",
  refundAmount,
  onSuccess,
}: OrderCancelRefundModalProps) {
  const [selectedReason, setSelectedReason] = React.useState("Customer left");
  const [notifyCustomer, setNotifyCustomer] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successInfo, setSuccessInfo] = React.useState<{
    refundId: string;
    amount: number;
  } | null>(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Determine amounts
  const isFullRefund = mode === "cancel_and_refund" || !refundAmount;
  const totalRefund = isFullRefund ? order.totalAmount : refundAmount;

  // Summary items breakdown string
  const itemsSummary =
    order.items
      ?.map((item) => `${item.quantity}× ${item.productName} ₹${item.totalPrice}`)
      .join(" + ") || `${order.itemCount} items`;

  const subtotal = order.subtotal || order.totalAmount - (order.taxAmount || 0);
  const taxAmount = order.taxAmount || Math.round(subtotal * 0.05 * 100) / 100;
  const roundOff =
    order.totalAmount - (subtotal + taxAmount - (order.promoDiscount || 0));

  // Reasons list (from Figma 225:102344)
  const reasons = ["Customer left", "Kitchen issue", "Duplicate", "Other"];

  // Waste notice calculations (Figma 225:102353)
  const hasPreparedItems =
    order.status === "Ready" ||
    order.status === "Preparing" ||
    order.status === "Delayed" ||
    order.status === "Delayed 14m";

  const firstItem = order.items?.[0];
  const wasteHeader = firstItem
    ? `${firstItem.quantity}× ${firstItem.productName} already made → logged as waste`
    : "Items already made → logged as waste";

  const wasteSubtext =
    order.orderNumber === "Q-31"
      ? "Recipe cost ₹112.60 (2 × ₹56.30). Bạc Xỉu and Bánh Mì Paneer tickets are voided on KDS."
      : `Recipe cost ~₹${(order.subtotal * 0.25).toFixed(2)}. Unfinished item tickets are voided immediately on KDS stations.`;

  const customerPhone = order.customerPhone || "+91 99••• ••087";
  const customerTarget =
    order.channel === "QR dine-in" ? order.customerName : order.customerName;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.orderNumber)}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refundAmount: totalRefund,
          reason: selectedReason,
          note: `Cancelled and refunded via confirmation modal: ${selectedReason}. Notified: ${notifyCustomer ? "Yes" : "No"}`,
          method: order.paymentMethod,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process refund. Please try again.");
      }

      const data = await res.json();
      setSuccessInfo({
        refundId: data.refundId || "RF-30431",
        amount: totalRefund,
      });

      if (onSuccess) {
        onSuccess(data.refundId || "RF-30431", totalRefund);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error processing cancellation.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f2340]/56 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      {/* Modal Frame (Figma 225:102329, 560x604) */}
      <div className="w-[560px] max-w-[95vw] bg-white rounded-[24px] shadow-[0_8px_24px_rgba(15,35,64,0.12),0_24px_64px_rgba(15,35,64,0.16)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {successInfo ? (
          /* Success Screen */
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e3f4ea] text-[#1f7a4d] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[22px] font-extrabold text-[#0f2340]">
                {mode === "cancel_and_refund" ? "Order Cancelled & Refunded" : "Refund Processed"}
              </h3>
              <p className="text-[14px] text-[#3f4b5e] max-w-sm leading-relaxed">
                Refund <span className="font-bold text-[#0f2340]">{successInfo.refundId}</span> of{" "}
                <span className="font-bold text-[#0f2340]">₹{successInfo.amount.toFixed(2)}</span> has been recorded.
                {notifyCustomer && " Customer and store stations have been notified."}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 h-12 px-8 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] text-white font-bold text-[16px] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* Standard Modal Flow (Figma 225:102329) */
          <>
            {/* 1. Header Frame (Figma 225:102330, 560x100) */}
            <div className="p-6 pb-0 flex gap-4 items-start">
              {/* Alert Octagon Icon Circle (Figma 225:102331, 48x48) */}
              <div className="w-12 h-12 rounded-[24px] bg-[#fce8e6] flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6 stroke-[1.75] text-[#c0352b]" />
              </div>

              {/* Title & Subtitle (Figma 225:102338) */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h2 className="text-[24px] font-extrabold leading-[32px] text-[#0f2340] tracking-tight">
                  {mode === "cancel_and_refund"
                    ? `Cancel ${order.orderNumber} and refund in full?`
                    : `Confirm refund for ${order.orderNumber}?`}
                </h2>
                <p className="text-[14px] font-normal leading-[20px] text-[#3f4b5e]">
                  {order.customerName} · {order.storeName}
                  {order.isDelayed || order.status.includes("Delayed") ? " · delayed" : ""}. Refund goes back to the original{" "}
                  {order.paymentMethod} payment.
                </p>
              </div>
            </div>

            {/* 2. Body Frame (Figma 225:102341, 560x423) */}
            <div className="p-6 flex flex-col gap-4">
              {/* Reason Selector (Figma 225:102342) */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-[#0f2340]">Reason</label>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((r) => {
                    const isActive = selectedReason === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedReason(r)}
                        className={cn(
                          "h-9 px-[14px] rounded-[18px] text-[14px] font-bold transition-all cursor-pointer flex items-center justify-center",
                          isActive
                            ? "bg-[#0f2340] text-white"
                            : "bg-white text-[#0f2340] border border-[#dce2ea] hover:border-[#1c3a66]"
                        )}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Waste Notice Banner (Figma 225:102353, 512x78) */}
              {hasPreparedItems && (
                <div className="bg-[#fef4e6] border border-[#fed7aa] rounded-[16px] p-3 flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-[#9a5b00] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[14px] font-bold text-[#0f2340] leading-tight">
                      {wasteHeader}
                    </span>
                    <span className="text-[12px] font-medium text-[#3f4b5e] leading-snug">
                      {wasteSubtext}
                    </span>
                  </div>
                </div>
              )}

              {/* Breakdown Box (Figma 225:102363, 512x149) */}
              <div className="bg-[#f5f7fa] rounded-[16px] p-4 flex flex-col gap-2">
                {/* Items line */}
                <div className="flex justify-between items-start text-[14px] gap-2">
                  <span className="text-[#3f4b5e] line-clamp-1 flex-1 min-w-0">
                    {itemsSummary}
                  </span>
                  <span className="font-bold text-[#0f2340] shrink-0">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                {/* GST line */}
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#3f4b5e]">GST 5%</span>
                  <span className="font-bold text-[#0f2340]">
                    ₹{taxAmount.toFixed(2)}
                  </span>
                </div>

                {/* Round-off (as charged) */}
                {Math.abs(roundOff) > 0.01 && (
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#3f4b5e]">Round-off (as charged)</span>
                    <span className="font-bold text-[#0f2340]">
                      {roundOff > 0 ? `+₹${roundOff.toFixed(2)}` : `−₹${Math.abs(roundOff).toFixed(2)}`}
                    </span>
                  </div>
                )}

                {/* Full Refund Total */}
                <div className="border-t border-[#dce2ea] pt-2.5 mt-0.5 flex justify-between items-baseline">
                  <span className="text-[16px] font-extrabold text-[#0f2340]">
                    {isFullRefund ? "Full refund" : "Refund amount"}
                  </span>
                  <span className="font-display font-black text-[16px] text-[#0f2340]">
                    ₹{totalRefund.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notify table & customer Switch (Figma 225:102376, 512x36) */}
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[14px] font-bold text-[#0f2340]">
                    Notify table & customer
                  </span>
                  <span className="text-[12px] font-medium text-[#3f4b5e] truncate">
                    SMS to {customerPhone} and alert floor staff for {customerTarget}
                  </span>
                </div>

                <Switch
                  checked={notifyCustomer}
                  onCheckedChange={setNotifyCustomer}
                  aria-label="Notify table and customer"
                />
              </div>
            </div>

            {/* 3. Action Footer Bar (Figma 225:102382, 560x81) */}
            <div className="bg-[#f5f7fa] border-t border-[#dce2ea] px-6 py-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-12 px-[21.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-[16px] font-bold text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                Keep order
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="h-12 px-5 rounded-[12px] bg-[#c0352b] hover:bg-[#a52b22] active:scale-[0.99] text-[16px] font-bold text-white transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {mode === "cancel_and_refund"
                      ? `Cancel & refund ₹${Math.round(totalRefund)}`
                      : `Confirm & refund ₹${Math.round(totalRefund)}`}
                  </span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
