"use client";

import * as React from "react";
import Link from "next/link";
import { OrdersApi } from "@/lib/api/orders";
import { PaymentDetail } from "@/types/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, ExternalLink, ArrowLeft, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPaise, formatRate } from "@/lib/utils/money";
import { GstInfoTooltip } from "@/components/orders/gst-info-tooltip";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderPaymentPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams.id;

  const [payment, setPayment] = React.useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    OrdersApi.getPaymentDetail(orderId)
      .then((data) => {
        if (isMounted) {
          setPayment(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load payment details");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleCopyJson = () => {
    if (!payment) return;
    const jsonStr = JSON.stringify(payment, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-96 rounded" />
            <Skeleton className="h-9 w-64 rounded-[12px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Skeleton className="h-[206px] rounded-[16px]" />
            <Skeleton className="h-[480px] rounded-[16px]" />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Skeleton className="h-[196px] rounded-[16px]" />
            <Skeleton className="h-[490px] rounded-[16px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 max-w-[1136px] mx-auto text-center">
        <h2 className="text-heading-m text-[#0f2340]">Payment Record Not Found</h2>
        <p className="text-body-s text-[#3f4b5e] max-w-md">
          {error || `Could not find transaction telemetry for order “${orderId}”.`}
        </p>
        <Link
          href={`/orders/${orderId}`}
          className="h-9 px-4 rounded-[12px] bg-[#1c3a66] text-white text-label flex items-center gap-2 hover:bg-[#0f2340] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Order {orderId}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-16">
      {/* 1. Header Frame (Figma 225:102613, 1136x62) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
        {/* Left: Breadcrumbs + Title + Status + Subtitle */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Breadcrumb (Figma 225:102615) */}
          <div className="flex items-center gap-1.5 text-body-s text-[#3f4b5e]">
            <Link href="/orders" className="hover:text-[#0f2340] hover:underline transition-colors">
              Orders
            </Link>
            <span className="text-[#7f8ca0]">/</span>
            <Link
              href={`/orders/${payment.orderNumber}`}
              className="hover:text-[#0f2340] hover:underline transition-colors"
            >
              {payment.orderNumber}
            </Link>
            <span className="text-[#7f8ca0]">/</span>
            <span className="text-[#0f2340] font-medium">Payment</span>
          </div>

          {/* Title Row (Figma 225:102616) */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="font-display font-black text-[32px] leading-[38px] text-[#0f2340] tracking-tight">
              ₹{payment.amount.toFixed(2)}
            </span>

            {/* Status Badge (Figma 225:102618) */}
            <div
              className={cn(
                "h-6 px-2 rounded-[12px] text-[12px] font-bold flex items-center justify-center shrink-0",
                payment.status === "Captured"
                  ? "bg-[#e3f4ea] text-[#1f7a4d]"
                  : payment.status === "Failed"
                    ? "bg-[#fdecea] text-[#b42318]"
                    : "bg-[#fff4e0] text-[#8a5a00]",
              )}
            >
              {payment.status}
            </div>

            {/* Subtitle (Figma 225:102620) */}
            <span className="text-[14px] font-normal text-[#3f4b5e]">
              {payment.methodLabel} · {payment.storeName} · {payment.timestamp}
            </span>
          </div>
        </div>

        {/* Right: Actions Bar (Figma 225:102621) */}
        <div className="flex items-center gap-2 shrink-0">
          {payment.razorpayDashboardUrl ? (
            <a
              href={payment.razorpayDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>Open in Razorpay</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#3f4b5e]" />
            </a>
          ) : null}

          <Link
            href={`/orders/${payment.orderNumber}`}
            className="h-9 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] active:scale-[0.99] text-label text-white transition-all shadow-2xs flex items-center justify-center"
          >
            View order {payment.orderNumber}
          </Link>
        </div>
      </div>

      {/* 2. Main Two-Column Grid (Figma 225:102626) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Left Column (720px / 8 cols): Metadata Grid + Gateway Event Log */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          {/* Card 1: 3x3 Metadata Grid (Figma 225:102628, 720x206) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-xs px-5 py-2 flex flex-col">
            {/* Row 1: Amount, Gateway fees, Net to settle (Figma 225:102629) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3 border-b border-[#dce2ea]">
              <MetaField label="Amount" value={rupee(payment.amount)} />
              <MetaField
                label="Gateway fees (incl. GST)"
                value={
                  payment.gatewayFee == null
                    ? "Not reported yet"
                    : payment.gatewayTax == null
                      ? rupee(payment.gatewayFee)
                      : `${rupee(payment.gatewayFee)} (GST ${rupee(payment.gatewayTax)})`
                }
              />
              <MetaField label="Net to settle" value={rupee(payment.netToSettle)} />
            </div>

            {/* Row 2: payment id + method details (Figma 225:102639) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3 border-b border-[#dce2ea]">
              {payment.isZeroPayment ? (
                <MetaField label="Payment ID" value={payment.paymentId} mono />
              ) : (
                <MetaField label="Razorpay payment ID" value={payment.razorpayPaymentId} mono />
              )}
              {payment.isZeroPayment ? (
                <>
                  <MetaField label="Gateway" value="None · ₹0 order" />
                  <MetaField label="Covered by discounts" value={payment.benefits ? rupee(payment.benefits.discount) : null} />
                </>
              ) : payment.method === "Card" ? (
                <>
                  <MetaField label="Card network" value={payment.cardNetwork} />
                  <MetaField label="Card" value={payment.cardLast4 ? `•••• ${payment.cardLast4}` : null} />
                </>
              ) : payment.method === "Netbanking" ? (
                <>
                  <MetaField label="Bank" value={payment.bank} />
                  <MetaField label="Razorpay order ID" value={payment.razorpayOrderId} mono />
                </>
              ) : (
                <>
                  <MetaField label="UPI reference (RRN)" value={payment.upiRrn} />
                  <MetaField label="Payer VPA" value={payment.payerVpa} />
                </>
              )}
            </div>

            {/* ₹0 order: what covered the bill (frozen on the payment at checkout) */}
            {payment.isZeroPayment && payment.benefits && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3 border-b border-[#dce2ea]">
                <MetaField label="Item total" value={rupee(payment.benefits.itemTotal)} />
                <MetaField
                  label="BRUVI Club benefit"
                  value={
                    payment.benefits.membership
                      ? `${payment.benefits.membership.planName ?? "BRUVI Club"} · −${rupee(payment.benefits.membership.discount)}${
                          payment.benefits.membership.freeDrinks.length
                            ? ` · free ${payment.benefits.membership.freeDrinks.join(", ")}`
                            : ""
                        }`
                      : null
                  }
                />
                <MetaField
                  label="Coupon"
                  value={
                    payment.benefits.coupon
                      ? `${payment.benefits.coupon.code} · −${rupee(payment.benefits.coupon.discount)}`
                      : null
                  }
                />
              </div>
            )}

            {/* Row 3: order and refunds */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Order</span>
                <Link
                  href={`/orders/${payment.orderNumber}`}
                  className="text-[14px] font-bold text-[#1c3a66] hover:underline truncate"
                >
                  {payment.orderNumber}
                </Link>
              </div>
              <MetaField label="Refunded to source" value={rupee(payment.refundedToSource)} />
              <MetaField label="Refunded to wallet" value={rupee(payment.refundedToWallet)} />
            </div>

            {/* Row 4: GST on the order, exactly as persisted by the backend GST engine */}
            {payment.gst && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3 border-t border-[#dce2ea] relative">
                <span className="absolute right-0 top-3">
                  <GstInfoTooltip gst={payment.gst} className="[&_[role=tooltip]]:left-auto [&_[role=tooltip]]:right-0" />
                </span>
                <MetaField label="Tax invoice" value={payment.invoiceNumber ?? payment.gst.invoiceNumber ?? "—"} mono />
                <MetaField
                  label="Supplier GSTIN"
                  value={payment.gst.supplierGstin ?? "Not configured (not a GST invoice)"}
                  mono={!!payment.gst.supplierGstin}
                />
                <MetaField
                  label={`GST ${payment.gst.rates.filter((r) => r.taxPaise > 0).map((r) => formatRate(r.ratePercent)).join(" + ")}${payment.gst.pricesIncludeGst ? " (included)" : ""} · SAC ${payment.gst.sacCode}`}
                  value={
                    payment.gst.igstPaise > 0
                      ? `IGST ${formatPaise(payment.gst.igstPaise)} on ${formatPaise(payment.gst.taxablePaise)}`
                      : `CGST ${formatPaise(payment.gst.cgstPaise)} + SGST ${formatPaise(payment.gst.sgstPaise)} on ${formatPaise(payment.gst.taxablePaise)}`
                  }
                />
              </div>
            )}
          </div>

          {/* Card 2: Gateway Event Log (Figma 225:102659, 720x480) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-xs overflow-hidden flex flex-col">
            {/* Header Frame (Figma 225:102660) */}
            <div className="px-5 py-4 border-b border-[#dce2ea] flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-extrabold text-[#0f2340] leading-snug">
                  Gateway event log
                </h2>
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Payment attempts and refunds · times in IST
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyJson}
                className="text-[14px] font-bold text-[#1c3a66] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-[#1f7a4d]" />
                    <span className="text-[#1f7a4d]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Table Column Headers (Figma 225:102665, bg-subtle, 36px) */}
            <div className="bg-[#f5f7fa] border-b border-[#dce2ea] px-5 py-2 flex items-center text-[12px] font-bold text-[#3f4b5e] uppercase tracking-wider">
              <span className="w-20 shrink-0">Time</span>
              <span className="w-44 shrink-0">Event</span>
              <span className="flex-1 min-w-0 pr-4">Detail</span>
              <span className="w-20 shrink-0 text-right">Result</span>
            </div>

            {/* Event Rows */}
            <div className="flex flex-col">
              {payment.gatewayEvents.length === 0 && (
                <div className="px-5 py-6 text-[14px] text-[#3f4b5e]">No payment attempts yet.</div>
              )}
              {payment.gatewayEvents.map((evt, idx) => (
                <div
                  key={`${evt.time}-${idx}`}
                  className="px-5 py-3 border-b border-[#dce2ea] flex items-center text-[14px] hover:bg-[#f8fafc] transition-colors"
                >
                  <span className="w-20 font-semibold text-[#0f2340] shrink-0 text-[14px]">
                    {evt.time}
                  </span>
                  <span className="w-44 font-bold text-[#0f2340] font-mono text-[13px] shrink-0">
                    {evt.event}
                  </span>
                  <span className="flex-1 text-[#3f4b5e] truncate pr-4 text-[14px]">
                    {evt.detail}
                  </span>
                  <span
                    className={cn(
                      "w-20 text-right font-bold shrink-0 text-[13px]",
                      evt.status === "success"
                        ? "text-[#1f7a4d]"
                        : evt.status === "failed"
                          ? "text-[#b42318]"
                          : "text-[#8a5a00]",
                    )}
                  >
                    {evt.result}
                  </span>
                </div>
              ))}
            </div>

            {/* Last Payload Box (Figma 225:102690) */}
            <div className="p-5 flex flex-col gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#3f4b5e]">
                Paying attempt
              </span>
              <div className="bg-[#f5f7fa] rounded-[16px] p-3 text-[12px] font-mono text-[#3f4b5e] leading-relaxed overflow-x-auto whitespace-pre">
                {payment.rawPayload}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (400px / 4 cols): Refunds + Money summary */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-xs p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-[#0f2340] leading-snug">Refunds</h2>
              <span className="text-[12px] font-bold text-[#3f4b5e]">{payment.refunds.length}</span>
            </div>
            {payment.refunds.length === 0 ? (
              <span className="text-[14px] text-[#3f4b5e]">No refunds on this order.</span>
            ) : (
              <div className="flex flex-col gap-3 pt-1">
                {payment.refunds.map((r) => (
                  <div key={r.id} className="flex flex-col gap-0.5 border-b border-[#dce2ea] last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-bold text-[#0f2340]">{rupee(r.amount)}</span>
                      <span
                        className={cn(
                          "h-6 px-2 rounded-[12px] text-[12px] font-bold flex items-center",
                          r.status === "SUCCEEDED"
                            ? "bg-[#e3f4ea] text-[#1f7a4d]"
                            : r.status === "FAILED"
                              ? "bg-[#fdecea] text-[#b42318]"
                              : "bg-[#fff4e0] text-[#8a5a00]",
                        )}
                      >
                        {REFUND_STATUS[r.status]}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#3f4b5e]">
                      {r.refundNumber} · {r.destination === "WALLET" ? "BRUVI Wallet" : "Original method"} ·{" "}
                      {new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    {r.providerRefundId && (
                      <span className="text-[12px] font-mono text-[#3f4b5e]">{r.providerRefundId}</span>
                    )}
                    {r.gstReversal && r.gstReversal.taxPaise > 0 && (
                      <span className="text-[12px] text-[#3f4b5e]">
                        {r.creditNoteNumber ? `Credit note ${r.creditNoteNumber} · ` : ""}GST reversed{" "}
                        {formatPaise(r.gstReversal.taxPaise)}
                        {r.gstReversal.cgstPaise != null
                          ? ` (CGST ${formatPaise(r.gstReversal.cgstPaise)} + SGST ${formatPaise(r.gstReversal.sgstPaise ?? 0)}${(r.gstReversal.igstPaise ?? 0) > 0 ? ` + IGST ${formatPaise(r.gstReversal.igstPaise ?? 0)}` : ""})`
                          : ""}
                      </span>
                    )}
                    {r.status === "FAILED" && r.lastError && (
                      <span className="text-[12px] text-[#b42318]">{r.lastError}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full rounded-[16px] bg-[#0f2340] p-5 flex flex-col text-white shadow-sm">
            <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#a9d8f3]/80">
              Money summary
            </span>
            <span className="font-display font-black text-[20px] leading-[28px] text-white tracking-tight">
              {payment.provider === "RAZORPAY" ? "Razorpay" : payment.provider === "WALLET" ? "BRUVI Wallet" : payment.provider ?? "—"}
            </span>
            <div className="border-t border-[#a9d8f3]/25 pt-4 mt-3 flex flex-col gap-3">
              <SummaryRow label="Captured" value={rupee(payment.amount)} />
              <SummaryRow
                label="Gateway fee (incl. GST)"
                value={payment.gatewayFee == null ? "—" : `− ${rupee(payment.gatewayFee)}`}
              />
              <SummaryRow label="Refunded to source" value={`− ${rupee(payment.refundedToSource)}`} />
              <SummaryRow label="Net to settle" value={rupee(payment.netToSettle)} strong />
              <SummaryRow label="Refunded to wallet" value={rupee(payment.refundedToWallet)} />
            </div>
            <span className="text-[12px] text-[#a9d8f3]/80 pt-4 mt-4 border-t border-white/10">
              Settlement batches and bank credits are in the Razorpay dashboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


const REFUND_STATUS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SUCCEEDED: "Refunded",
  FAILED: "Failed",
};

function rupee(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function MetaField({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[12px] font-medium text-[#3f4b5e]">{label}</span>
      <span className={cn("text-[14px] font-bold text-[#0f2340] truncate", mono && "font-mono")}>
        {value || "—"}
      </span>
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between items-center text-[14px]">
      <span className="text-[#a9d8f3]/80">{label}</span>
      <span className={cn("text-white", strong ? "font-black" : "font-bold")}>{value}</span>
    </div>
  );
}
