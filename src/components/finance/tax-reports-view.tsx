"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FinanceModuleHeader,
  FinanceTabBar,
} from "@/components/finance/finance-header-and-tabs";
import {
  SAC_SUMMARY_ROWS,
  STATE_GST_ROWS,
} from "@/lib/finance/mock-finance-data";

export function TaxReportsView() {
  const [notice, setNotice] = React.useState<string | null>(null);

  const triggerDownload = (label: string) => {
    setNotice(`Generated ${label} for September 2026`);
    setTimeout(() => setNotice(null), 2600);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <FinanceModuleHeader
        overline="FINANCE · GST · BRUVI COFFEE PVT LTD"
        title="Tax reports · September 2026"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => triggerDownload("GSTR-1 JSON")}
            >
              Download GSTR-1 JSON
            </Button>
            <Button
              size="compact"
              onClick={() => triggerDownload("GST summary PDF")}
            >
              Download GST summary
            </Button>
          </>
        }
      />

      <FinanceTabBar active="tax" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info">
          {notice}
        </div>
      )}

      {/* 5-Card Tax KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            Taxable value · Sep
          </span>
          <span className="text-price-m font-display font-extrabold tracking-[-0.72px] tnum text-text">
            ₹3,02,00,000
          </span>
          <span className="text-[11px] text-text-muted">
            95,000 orders · F&amp;B at 5%
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            CGST 2.5%
          </span>
          <span className="text-price-m font-display font-extrabold tracking-[-0.72px] tnum text-text">
            ₹7,55,000
          </span>
          <span className="text-[11px] text-text-muted">
            No ITC (restaurant)
          </span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">
            SGST 2.5%
          </span>
          <span className="text-price-m font-display font-extrabold tracking-[-0.72px] tnum text-text">
            ₹7,55,000
          </span>
          <span className="text-[11px] text-text-muted">Across 4 states</span>
        </Card>

        <Card className="p-5 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-muted">IGST</span>
          <span className="text-price-m font-display font-extrabold tracking-[-0.72px] text-text">
            Nil
          </span>
          <span className="text-[11px] text-text-muted">All intra-state</span>
        </Card>

        <Card className="bg-surface-inverse border-surface-inverse text-text-inverse p-5 flex flex-col justify-between gap-2">
          <span className="text-[12px] font-medium text-text-inverse-secondary">
            Total GST collected
          </span>
          <span className="text-price-m font-display font-extrabold tracking-[-0.72px] tnum text-white">
            ₹15,10,000
          </span>
          <span className="text-[11px] text-text-inverse-muted tnum">
            ₹15.1 L · payable by 20 Oct
          </span>
        </Card>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: By state GSTIN + HSN/SAC Summary */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                By state GSTIN
              </h2>
              <button
                type="button"
                onClick={() => triggerDownload("State GSTIN CSV")}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                Download CSV
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2.5 pr-2">State · GSTIN</th>
                    <th className="py-2.5 px-2 text-right">Taxable value</th>
                    <th className="py-2.5 px-2 text-right">CGST</th>
                    <th className="py-2.5 px-2 text-right">SGST</th>
                    <th className="py-2.5 pl-2 text-right">Total GST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {STATE_GST_ROWS.map((row) => (
                    <tr key={row.gstin}>
                      <td className="py-3 pr-2 text-[13px]">
                        <span className="font-bold text-text">
                          {row.state} · {row.storesCountLabel}
                        </span>
                        <span className="ml-2 font-mono text-[11px] text-text-muted">
                          {row.gstin}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{row.taxableValueInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 text-right text-[12px] text-text-secondary tnum">
                        ₹{row.cgstInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 text-right text-[12px] text-text-secondary tnum">
                        ₹{row.sgstInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pl-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{row.totalGstInr.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  HSN/SAC summary
                </h2>
                <span className="text-[12px] text-text-muted">
                  GSTR-1 Table 12 · B2B and B2C
                </span>
              </div>
              <button
                type="button"
                onClick={() => triggerDownload("HSN/SAC Table 12 CSV")}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                Download CSV
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2.5 pr-2">SAC · description</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2 text-right">Qty (NOS)</th>
                    <th className="py-2.5 px-2 text-right">Taxable value</th>
                    <th className="py-2.5 pl-2 text-right">GST 5%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SAC_SUMMARY_ROWS.map((row) => (
                    <tr key={row.type}>
                      <td className="py-3 pr-2 text-[13px]">
                        <span className="font-extrabold text-text tnum mr-2">
                          {row.sac}
                        </span>
                        <span className="text-text-secondary">
                          {row.description}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[12px] font-semibold text-text-muted">
                        {row.type}
                      </td>
                      <td className="py-3 px-2 text-right text-[13px] font-semibold text-text tnum">
                        {row.qty.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2 text-right text-[13px] font-semibold text-text tnum">
                        ₹{row.taxableValueInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 pl-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{row.gst5Inr.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border font-extrabold text-[13px] text-text tnum">
                    <td className="py-3 pr-2">Total</td>
                    <td className="py-3 px-2" />
                    <td className="py-3 px-2 text-right">1,21,000</td>
                    <td className="py-3 px-2 text-right">₹3,02,00,000</td>
                    <td className="py-3 pl-2 text-right">₹15,10,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Filing Tracker + E-invoicing */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3.5">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              Filing tracker
            </h2>

            <div className="flex flex-col divide-y divide-border">
              <div className="py-3 first:pt-0 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-text">
                    GSTR-1 · September
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Due Sun 11 Oct · 9 days left
                  </p>
                </div>
                <Badge variant="warning">Draft</Badge>
              </div>

              <div className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-text">
                    GSTR-3B · September
                  </p>
                  <p className="text-[11px] text-text-muted tnum">
                    Due Tue 20 Oct · pay ₹15,10,000
                  </p>
                </div>
                <Badge variant="outline">Not started</Badge>
              </div>

              <div className="py-3 last:pb-0 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-bold text-text">
                    August returns
                  </p>
                  <p className="text-[11px] text-text-muted">
                    GSTR-1 filed 10 Sep · 3B filed 18 Sep
                  </p>
                </div>
                <Badge variant="success">Filed</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                E-invoicing
              </h2>
              <p className="text-[12px] text-text-muted">
                B2B catering invoices · IRN via NIC IRP
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background-subtle p-3.5">
                <span className="block text-[11px] text-text-muted">
                  September
                </span>
                <span className="block text-price-m font-display font-extrabold text-text tnum mt-0.5">
                  38 / 38
                </span>
                <span className="text-[11px] font-bold text-success">
                  IRN generated
                </span>
              </div>

              <div className="rounded-xl bg-background-subtle p-3.5">
                <span className="block text-[11px] text-text-muted">
                  October so far
                </span>
                <span className="block text-price-m font-display font-extrabold text-text tnum mt-0.5">
                  1 / 2
                </span>
                <span className="text-[11px] font-bold text-warning">
                  1 IRN pending
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
