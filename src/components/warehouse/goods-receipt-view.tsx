"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  WarehouseModuleHeader,
  WarehouseTabBar,
} from "@/components/warehouse/warehouse-header-and-tabs";

const QC_CHECKS = [
  "Seal intact on all 20 cases",
  "Temperature ≤ 5 °C (4.2 °C)",
  "Labels, batch & FSSAI mark legible",
  "Shelf life ≥ 60 days (85 days left)",
  "Damaged units: 0",
];

export function GoodsReceiptView() {
  const [posted, setPosted] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb="WAREHOUSE / RECEIVING / GRN-1093"
        title="GRN-1093 · Oatside India"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice("GRN-1093 draft saved")}
            >
              Save draft
            </Button>
            <Button
              size="compact"
              disabled={posted}
              onClick={() => {
                setPosted(true);
                setNotice(
                  "GRN-1093 posted · 480 cartons put away to Chiller C-02-14",
                );
              }}
            >
              {posted ? "GRN Posted" : "Post GRN"}
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="receiving" />

      {notice && (
        <div className="rounded-xl border border-success/30 bg-success-surface px-4 py-3 text-[13px] font-bold text-success flex items-center gap-2">
          <BruviIcon name="check" size={16} />
          <span>{notice}</span>
        </div>
      )}

      {/* Metadata Header Card */}
      <Card className="p-4 sm:px-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <span className="block text-[11px] font-medium text-text-muted">
              Purchase order
            </span>
            <Link
              href="/warehouse/purchase-orders"
              className="text-[14px] font-extrabold text-text hover:text-primary"
            >
              PO-2026-0421
            </Link>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-muted">
              Supplier
            </span>
            <Link
              href="/warehouse/suppliers/SUP-004"
              className="text-[14px] font-extrabold text-text hover:text-primary"
            >
              Oatside India
            </Link>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-muted">
              Dock
            </span>
            <span className="text-[14px] font-extrabold text-text">Dock 2</span>
          </div>
          <div>
            <span className="block text-[11px] font-medium text-text-muted">
              Received by
            </span>
            <span className="text-[14px] font-extrabold text-text">
              Suresh P. · 7:10 am
            </span>
          </div>
        </div>

        <Badge variant={posted ? "success" : "warning"} className="px-3 py-1">
          {posted ? "Posted · put away" : "Put away · not posted"}
        </Badge>
      </Card>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Received Lines + Quality Check */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Received lines
              </h2>
              <span className="text-[12px] text-text-muted">
                1 line · chilled
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2.5 pr-3">Item · batch</th>
                    <th className="py-2.5 px-2 text-right">Ordered</th>
                    <th className="py-2.5 px-2 text-right">Received</th>
                    <th className="py-2.5 px-2 text-right">Short</th>
                    <th className="py-2.5 px-2 text-right">Damaged</th>
                    <th className="py-2.5 pl-2 text-right">Mfg · Exp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3.5 pr-3">
                      <Link
                        href="/warehouse/batches/OAT-2609-17"
                        className="text-[13px] font-bold text-text hover:text-primary"
                      >
                        Oat milk 1 L · carton
                      </Link>
                      <p className="text-[11px] text-text-muted tnum">
                        OAT-2609-17 · ₹185 / carton
                      </p>
                    </td>
                    <td className="py-3.5 px-2 text-right text-[13px] font-bold text-text tnum">
                      600
                    </td>
                    <td className="py-3.5 px-2 text-right text-[14px] font-extrabold text-text tnum">
                      480
                    </td>
                    <td className="py-3.5 px-2 text-right text-[13px] font-extrabold text-warning tnum">
                      120
                    </td>
                    <td className="py-3.5 px-2 text-right text-[13px] font-bold text-text tnum">
                      0
                    </td>
                    <td className="py-3.5 pl-2 text-right">
                      <p className="text-[12px] font-bold text-text tnum">
                        26 Sep 2026
                      </p>
                      <p className="text-[11px] text-text-muted tnum">
                        exp 26 Dec · 85 d
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-warning-surface border border-warning/25 px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
              <span className="font-semibold text-warning inline-flex items-center gap-2">
                <BruviIcon name="alert" size={15} className="shrink-0" />
                120 cartons short — backordered on PO-2026-0421, supplier ETA Tue
                6 Oct
              </span>
              <button
                type="button"
                onClick={() =>
                  setNotice("Backorder ETA Tue 6 Oct opened for editing")
                }
                className="font-bold text-primary hover:underline cursor-pointer shrink-0"
              >
                Edit backorder
              </button>
            </div>
          </Card>

          {/* Quality Check */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Quality check
              </h2>
              <Badge variant="success">5 of 5 passed</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-5 items-center">
              <div className="rounded-xl bg-success-surface p-4 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-success">
                  Temp on arrival
                </span>
                <span className="text-price-l font-display font-extrabold text-text tnum">
                  4.2 °C
                </span>
                <span className="text-[11px] text-text-muted">
                  Limit ≤ 5.0 °C
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {QC_CHECKS.map((check) => (
                  <div
                    key={check}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-text"
                  >
                    <span className="h-4 w-4 rounded-full bg-success-surface text-success inline-flex items-center justify-center shrink-0">
                      <BruviIcon name="check" size={11} />
                    </span>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex flex-wrap items-center gap-3">
              <span className="text-[12px] font-semibold text-text-muted">
                Photos · 3
              </span>
              {["Pallet", "Probe 4.2 °C", "Batch label"].map((label) => (
                <div
                  key={label}
                  className="h-14 w-24 rounded-xl bg-background-subtle border border-border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-text-muted"
                >
                  <BruviIcon name="eye" size={14} />
                  <span>{label}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNotice("Photo upload dialog opened")}
                className="h-14 w-14 rounded-xl border border-dashed border-border-input flex items-center justify-center text-[18px] text-text-muted hover:bg-background-subtle cursor-pointer"
              >
                +
              </button>
            </div>
          </Card>
        </div>

        {/* Right: 3-Way Match + On Posting */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  3-way match
                </h2>
                <p className="text-[12px] text-text-muted">
                  Invoice INV-OS-88213 · 2 Oct
                </p>
              </div>
              <Badge variant="destructive">Mismatch</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-background-subtle p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-success-surface text-success inline-flex items-center justify-center">
                    <BruviIcon name="check" size={12} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-text">
                      Purchase order
                    </p>
                    <p className="text-[11px] text-text-muted tnum">
                      600 × ₹185 · PO-2026-0421
                    </p>
                  </div>
                </div>
                <span className="text-[13px] font-extrabold text-text tnum">
                  ₹1,11,000
                </span>
              </div>

              <div className="rounded-xl bg-background-subtle p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-success-surface text-success inline-flex items-center justify-center">
                    <BruviIcon name="check" size={12} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-text">
                      Goods receipt
                    </p>
                    <p className="text-[11px] text-text-muted tnum">
                      480 received · GRN-1093
                    </p>
                  </div>
                </div>
                <span className="text-[13px] font-extrabold text-text tnum">
                  ₹88,800
                </span>
              </div>

              <div className="rounded-xl bg-error-surface p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-error text-white inline-flex items-center justify-center">
                    <BruviIcon name="close" size={11} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-error">
                      Invoice qty 600
                    </p>
                    <p className="text-[11px] text-error/80">
                      Billed 120 more than received
                    </p>
                  </div>
                </div>
                <span className="text-[13px] font-extrabold text-error tnum">
                  ₹1,11,000
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[13px] font-semibold text-text-muted">
                Variance to hold
              </span>
              <span className="text-[18px] font-display font-extrabold text-error tnum">
                ₹22,200
              </span>
            </div>

            <p className="text-[12px] text-text-muted leading-relaxed">
              Payment for this invoice is held until Oatside issues a credit
              note or ships the 120-carton backorder.
            </p>

            <Button
              variant="workspace"
              size="compact"
              onClick={() =>
                setNotice("Credit note request sent to Oatside India")
              }
            >
              Request credit note
            </Button>
          </Card>

          <Card className="p-5 flex flex-col gap-3.5">
            <h2 className="font-sans text-[16px] font-extrabold text-text">
              On posting
            </h2>
            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Put-away</span>
                <span className="font-bold text-text">Chiller · C-02-14</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Ledger on hand</span>
                <span className="font-bold text-text tnum">
                  12 → 492 cartons
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Chiller after put-away</span>
                <span className="font-bold text-warning tnum">
                  81% · near capacity
                </span>
              </div>
            </div>
            <Button
              size="compact"
              disabled={posted}
              onClick={() => {
                setPosted(true);
                setNotice(
                  "GRN-1093 posted · 480 cartons put away to Chiller C-02-14",
                );
              }}
            >
              {posted ? "Posted · 480 cartons" : "Post GRN · 480 cartons"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
