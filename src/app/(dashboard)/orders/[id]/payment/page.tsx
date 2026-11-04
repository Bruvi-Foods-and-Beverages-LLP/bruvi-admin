"use client";

import * as React from "react";
import Link from "next/link";
import { OrdersApi } from "@/lib/api/orders";
import { PaymentDetail } from "@/types/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, ExternalLink, ArrowLeft, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
            <div className="h-6 px-2 rounded-[12px] bg-[#e3f4ea] text-[#1f7a4d] text-[12px] font-bold flex items-center justify-center shrink-0">
              {payment.status}
            </div>

            {/* Subtitle (Figma 225:102620) */}
            <span className="text-[14px] font-normal text-[#3f4b5e]">
              {payment.method} · {payment.storeName} · {payment.timestamp}
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
          ) : (
            <button
              type="button"
              onClick={() => alert("Opening gateway portal...")}
              className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Open in Razorpay</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#3f4b5e]" />
            </button>
          )}

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
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Amount</span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  ₹{payment.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Gateway fees</span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  {payment.gatewayFeeText}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Net to settle</span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  ₹{payment.netToSettle.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Row 2: Razorpay payment ID, UPI reference (RRN), Payer VPA (Figma 225:102639) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3 border-b border-[#dce2ea]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Razorpay payment ID
                </span>
                <span className="text-[14px] font-bold text-[#0f2340] font-mono">
                  {payment.razorpayPaymentId}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  UPI reference (RRN)
                </span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  {payment.upiRrn}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Payer VPA</span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  {payment.payerVpa}
                </span>
              </div>
            </div>

            {/* Row 3: Order, Settlement batch, Expected credit (Figma 225:102649) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">Order</span>
                <Link
                  href={`/orders/${payment.orderNumber}`}
                  className="text-[14px] font-bold text-[#1c3a66] hover:underline truncate"
                >
                  {payment.orderNumber} · Counter · {payment.posTerminalId}
                </Link>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Settlement batch
                </span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  {payment.settlementBatch}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-medium text-[#3f4b5e]">
                  Expected credit
                </span>
                <span className="text-[14px] font-bold text-[#0f2340]">
                  {payment.expectedCreditDate}
                </span>
              </div>
            </div>
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
                  Raw events from Razorpay · times in IST
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
              <span className="w-16 shrink-0 text-right">Result</span>
            </div>

            {/* Event Rows */}
            <div className="flex flex-col">
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
                  <span className="w-16 text-right font-bold text-[#1f7a4d] shrink-0 text-[14px]">
                    {evt.result}
                  </span>
                </div>
              ))}
            </div>

            {/* Last Payload Box (Figma 225:102690) */}
            <div className="p-5 flex flex-col gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#3f4b5e]">
                Last payload · payment.captured
              </span>
              <div className="bg-[#f5f7fa] rounded-[16px] p-3 text-[12px] font-mono text-[#3f4b5e] leading-relaxed overflow-x-auto whitespace-pre">
                {payment.rawPayload}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (400px / 4 cols): Risk Checks + Settlement Card */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full">
          {/* Card 1: Risk Checks (Figma 225:102695, 400x196) */}
          <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white shadow-xs p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-[#0f2340] leading-snug">
                Risk checks
              </h2>
              <div className="h-6 px-2 rounded-[12px] bg-[#e3f4ea] text-[#1f7a4d] text-[12px] font-bold flex items-center justify-center shrink-0">
                {payment.riskChecks.filter((c) => c.passed).length} of{" "}
                {payment.riskChecks.length} passed
              </div>
            </div>

            {/* Check Items */}
            <div className="flex flex-col gap-3 pt-1">
              {payment.riskChecks.map((chk) => (
                <div key={chk.id} className="flex items-center gap-3 text-[14px]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[#1f7a4d]">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-[14px] font-normal text-[#0f2340]">
                    {chk.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Settlement Card (Figma 225:102718, 400x490, dark navy bg-[#0f2340]) */}
          <div className="w-full rounded-[16px] bg-[#0f2340] p-5 flex flex-col text-white shadow-sm min-h-[440px]">
            {/* Header: Overline + Batch ID */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#a9d8f3]/80">
                Settlement
              </span>
              <span className="font-display font-black text-[20px] leading-[28px] text-white tracking-tight">
                {payment.settlement.batchId}
              </span>
            </div>

            {/* Settlement Metadata Rows */}
            <div className="border-t border-[#a9d8f3]/25 pt-4 mt-3 flex flex-col gap-3">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#a9d8f3]/80">Cycle</span>
                <span className="font-bold text-white">{payment.settlement.cycle}</span>
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#a9d8f3]/80">Batch closes</span>
                <span className="font-bold text-white">
                  {payment.settlement.batchCloses}
                </span>
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#a9d8f3]/80">Expected credit</span>
                <span className="font-bold text-white">
                  {payment.settlement.expectedCredit}
                </span>
              </div>

              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#a9d8f3]/80">Account</span>
                <span className="font-bold text-white">
                  {payment.settlement.account}
                </span>
              </div>
            </div>

            {/* Flexible spacer */}
            <div className="flex-1 min-h-[140px]" />

            {/* Reconciliation Footer */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <div className="w-2 h-2 rounded-full bg-[#34d399] shrink-0" />
              <span className="text-[12px] font-medium text-[#34d399]">
                {payment.settlement.reconciledText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

