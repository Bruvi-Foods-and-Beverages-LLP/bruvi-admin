"use client";

import * as React from "react";
import { Info } from "lucide-react";
import type { GstView } from "@/types/orders";
import { formatPaise, formatRate } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";

/**
 * Info button for a GST row: hover, focus or click shows how the server calculated the GST
 * (taxable value, CGST / SGST or IGST per rate, delivery fee share, GSTIN and SAC).
 * All numbers are the persisted breakdown; nothing is recomputed in the browser.
 */
export function GstInfoTooltip({ gst, className }: { gst: GstView; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const rates = gst.rates.filter((r) => r.taxPaise > 0);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="How GST is calculated"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="h-6 w-6 inline-flex items-center justify-center rounded-full text-[#55647a] hover:bg-[#e8edf3] hover:text-[#0f2340] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1c3a66]"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-7 z-40 w-[320px] max-w-[85vw] rounded-[12px] border border-[#dce2ea] bg-white p-3 text-left shadow-[0_8px_24px_rgba(15,35,64,0.12)] flex flex-col gap-1.5"
        >
          <span className="text-[13px] font-extrabold text-[#0f2340]">How this GST was calculated</span>
          <span className="text-[12px] text-[#3f4b5e]">
            {gst.pricesIncludeGst
              ? "Menu prices include GST; the tax is carved out of them."
              : "GST is added on top of menu prices and is part of the total paid."}
          </span>
          <Row label="Food & drinks after discounts" value={formatPaise(gst.itemsTaxablePaise)} />
          {gst.deliveryFeeTaxablePaise > 0 && <Row label="Delivery fee (same supply)" value={formatPaise(gst.deliveryFeeTaxablePaise)} />}
          <Row label="Taxable value" value={formatPaise(gst.taxablePaise)} strong />
          {rates.map((r) =>
            r.igstPaise > 0 ? (
              <Row key={r.ratePercent} label={`IGST ${formatRate(r.igstRatePercent)}`} value={formatPaise(r.igstPaise)} />
            ) : (
              <React.Fragment key={r.ratePercent}>
                <Row label={`CGST ${formatRate(r.cgstRatePercent)}`} value={formatPaise(r.cgstPaise)} />
                <Row label={`SGST ${formatRate(r.sgstRatePercent)}`} value={formatPaise(r.sgstPaise)} />
              </React.Fragment>
            ),
          )}
          <Row label="Total GST" value={formatPaise(gst.taxPaise)} strong />
          <span className="border-t border-[#dce2ea] pt-1.5 text-[11px] leading-4 text-[#55647a]">
            {rates.length === 1 && rates[0].ratePercent === 5
              ? "Restaurant service at 5% without input tax credit (2.5% CGST + 2.5% SGST). "
              : rates.length === 1 && rates[0].ratePercent === 18
                ? "Restaurant service in specified premises at 18% with input tax credit. "
                : ""}
            Worked out once on the whole bill after coupons and Club benefits, rounded to the paisa.
            Wallet or payment method does not change it. SAC {gst.sacCode}
            {gst.supplierGstin ? ` · GSTIN ${gst.supplierGstin}` : " · no GSTIN configured"}
            {gst.legacy ? " · order placed before the GST engine (split shown for reference)" : ""}.
          </span>
        </span>
      )}
    </span>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <span className={cn("flex items-center justify-between gap-3 text-[12px]", strong ? "font-bold text-[#0f2340]" : "text-[#3f4b5e]")}>
      <span>{label}</span>
      <span className="tnum">{value}</span>
    </span>
  );
}
