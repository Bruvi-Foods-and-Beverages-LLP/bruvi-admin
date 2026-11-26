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
import { SUPPLIER_DAK_LAK } from "@/lib/warehouse/mock-warehouse-data";
import { cn } from "@/lib/utils/cn";

export function SupplierDetailView({ supplierId }: { supplierId: string }) {
  const s = SUPPLIER_DAK_LAK;
  const [messaged, setMessaged] = React.useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb={`WAREHOUSE / SUPPLIERS / ${supplierId.toUpperCase()}`}
        title={s.name}
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setMessaged(true);
                setTimeout(() => setMessaged(false), 2600);
              }}
            >
              {messaged ? "Message composer opened" : "Message supplier"}
            </Button>
            <Button asChild size="compact">
              <Link href="/warehouse/purchase-orders/new">
                New PO to supplier
              </Link>
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="suppliers" />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: 4 Scorecard KPIs + Items Supplied + Recent Deliveries */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4 flex flex-col gap-2">
              <span className="text-[12px] font-medium text-text-muted">
                On-time delivery
              </span>
              <span className="text-price-l font-display font-extrabold text-text tnum">
                {s.onTimePercent}%
              </span>
              <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${s.onTimePercent}%` }}
                />
              </div>
              <span className="text-[11px] text-text-muted tnum">
                {s.onTimeMeta}
              </span>
            </Card>

            <Card className="p-4 flex flex-col gap-2">
              <span className="text-[12px] font-medium text-text-muted">
                Fill rate
              </span>
              <span className="text-price-l font-display font-extrabold text-text tnum">
                {s.fillRatePercent}%
              </span>
              <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
                <div
                  className="h-full bg-success rounded-full"
                  style={{ width: `${s.fillRatePercent}%` }}
                />
              </div>
              <span className="text-[11px] text-text-muted tnum">
                {s.fillRateMeta}
              </span>
            </Card>

            <Card className="p-4 flex flex-col gap-2">
              <span className="text-[12px] font-medium text-text-muted">
                Quality rejects
              </span>
              <span className="text-price-l font-display font-extrabold text-text tnum">
                {s.rejectsPercent}%
              </span>
              <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
                <div className="h-full bg-success rounded-full w-[8%]" />
              </div>
              <span className="text-[11px] text-text-muted tnum">
                {s.rejectsMeta}
              </span>
            </Card>

            <Card className="p-4 flex flex-col gap-2">
              <span className="text-[12px] font-medium text-text-muted">
                Avg lead time
              </span>
              <span className="text-price-l font-display font-extrabold text-text tnum">
                {s.avgLeadTimeLabel}
              </span>
              <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[78%]" />
              </div>
              <span className="text-[11px] text-text-muted">
                {s.avgLeadTimeMeta}
              </span>
            </Card>
          </div>

          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Items supplied
              </h2>
              <span className="text-[12px] text-text-muted">
                {s.itemsSupplied.length} SKUs · contract prices
              </span>
            </div>

            <div className="divide-y divide-border">
              {s.itemsSupplied.map((item) => (
                <div
                  key={item.id}
                  className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3 text-[13px]"
                >
                  <span className="font-bold text-text">{item.name}</span>
                  <div className="flex items-center gap-6 shrink-0 tnum">
                    <span className="text-text-muted text-[12px]">
                      {item.moqLabel}
                    </span>
                    <span className="font-extrabold text-text w-16 text-right">
                      ₹{item.unitPriceInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Recent deliveries
              </h2>
              <Link
                href="/warehouse/receiving"
                className="text-[12px] font-bold text-primary hover:text-primary-pressed"
              >
                All 12 →
              </Link>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2 pr-2">GRN</th>
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">PO · qty</th>
                    <th className="py-2 px-2 text-right">Rejects</th>
                    <th className="py-2 pl-2 text-right">Timing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {s.recentDeliveries.map((del) => (
                    <tr key={del.grn}>
                      <td className="py-3 pr-2 text-[13px] font-extrabold text-text tnum">
                        <Link
                          href="/warehouse/receiving"
                          className="hover:text-primary"
                        >
                          {del.grn}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-[12px] text-text-secondary">
                        {del.date}
                      </td>
                      <td className="py-3 px-2 text-[13px] font-medium text-text">
                        {del.poQty}
                      </td>
                      <td
                        className={cn(
                          "py-3 px-2 text-right text-[12px] font-bold tnum",
                          del.rejectsTone === "warning"
                            ? "text-warning"
                            : "text-text-secondary",
                        )}
                      >
                        {del.rejects}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                            del.timingTone === "success"
                              ? "bg-success-surface text-success"
                              : "bg-warning-surface text-warning",
                          )}
                        >
                          {del.timing}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Supplier Profile + Open POs + Documents */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-surface-warm text-category-coffee font-extrabold text-[14px] flex items-center justify-center shrink-0">
                  {s.initials}
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-text">
                    {s.roleLabel}
                  </p>
                  <p className="text-[12px] text-text-muted flex items-center gap-1">
                    <BruviIcon
                      name="star-filled"
                      size={13}
                      className="text-warning"
                    />
                    <span>{s.ratingLabel}</span>
                  </p>
                </div>
              </div>
              <Badge variant="success">{s.status}</Badge>
            </div>

            <div className="flex flex-col gap-2.5 pt-2 border-t border-border text-[12px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Contact</span>
                <span className="font-bold text-text text-right">
                  {s.contact}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">India agent</span>
                <span className="font-bold text-text text-right">
                  {s.indiaAgent}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Email</span>
                <span className="font-bold text-primary text-right truncate">
                  {s.email}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">GSTIN (agent)</span>
                <span className="font-bold text-text text-right tnum">
                  {s.gstin}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Payment terms</span>
                <span className="font-bold text-text text-right">
                  {s.paymentTerms}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-text-muted">Origin</span>
                <span className="font-bold text-text text-right">
                  {s.origin}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[15px] font-extrabold text-text">
                Open POs
              </h2>
              <span className="text-[12px] text-text-muted tnum">
                1 · ₹3,90,000
              </span>
            </div>
            {s.openPos.map((po) => (
              <Link
                key={po.poNumber}
                href="/warehouse/purchase-orders"
                className="flex items-center justify-between gap-2 p-2.5 -mx-2.5 rounded-xl hover:bg-background-subtle transition-colors"
              >
                <div>
                  <p className="text-[13px] font-extrabold text-text">
                    {po.poNumber}
                  </p>
                  <p className="text-[11px] text-text-muted">{po.summary}</p>
                </div>
                <Badge variant="brand">{po.status}</Badge>
              </Link>
            ))}
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <h2 className="font-sans text-[15px] font-extrabold text-text">
              Documents
            </h2>
            <div className="flex flex-col gap-2.5">
              {s.documents.map((doc) => (
                <div
                  key={doc.title}
                  className="flex items-center justify-between gap-2 text-[12px]"
                >
                  <span className="inline-flex items-center gap-2 font-semibold text-text">
                    <BruviIcon
                      name="file"
                      size={14}
                      className="text-text-muted"
                    />
                    {doc.title}
                  </span>
                  <span
                    className={cn(
                      "font-bold shrink-0",
                      doc.tone === "success" && "text-success",
                      doc.tone === "warning" && "text-warning",
                      doc.tone === "muted" && "text-text-muted",
                    )}
                  >
                    {doc.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
