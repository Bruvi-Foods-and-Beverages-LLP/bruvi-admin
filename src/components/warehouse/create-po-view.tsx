"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  WarehouseModuleHeader,
  WarehouseTabBar,
} from "@/components/warehouse/warehouse-header-and-tabs";
import { INITIAL_PO_LINES } from "@/lib/warehouse/mock-warehouse-data";
import { CreatePoLineItem } from "@/types/warehouse";

export function CreatePoView() {
  const router = useRouter();
  const [supplier, setSupplier] = React.useState("Monin India");
  const [warehouse, setWarehouse] = React.useState("WH-BLR-01 · Hosur Road");
  const [expectedDate, setExpectedDate] = React.useState("Tue, 6 Oct 2026");
  const [lines, setLines] = React.useState<CreatePoLineItem[]>(INITIAL_PO_LINES);
  const [notes, setNotes] = React.useState(
    "Please deliver before 11 am — Indiranagar is out of vanilla. Cases of 12, batch expiry ≥ 9 months.",
  );
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);

  const subtotal = React.useMemo(
    () => lines.reduce((sum, l) => sum + l.qty * l.unitCostInr, 0),
    [lines],
  );
  const totalUnits = React.useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  );
  const gstAmount = Math.round(subtotal * 0.18);
  const exactTotal = subtotal * 1.18;
  const roundedTotal = Math.round(exactTotal);
  const requiresApproval = roundedTotal > 25000;

  const updateLineQty = (id: string, val: string) => {
    const qty = Math.max(0, parseInt(val || "0", 10) || 0);
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb="WAREHOUSE / PURCHASE ORDERS / NEW"
        title="New purchase order"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => {
                setLines(INITIAL_PO_LINES);
                setStatusBanner("Applied reorder rule suggestions");
              }}
            >
              Use reorder suggestions
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setStatusBanner(
                  `PO-2026-0422 preview ready · ₹${roundedTotal.toLocaleString("en-IN")}`,
                )
              }
            >
              Preview PO
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="purchase-orders" />

      {statusBanner && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-3 text-[13px] font-bold text-info flex items-center justify-between">
          <span>{statusBanner}</span>
          <Link
            href="/warehouse/purchase-orders"
            className="underline underline-offset-2"
          >
            All POs
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Form */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Supplier &amp; delivery
              </h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                Terms and lead time come from the supplier record.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">
                  Supplier
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-11 rounded-xl border border-border-input bg-white px-3.5 text-[14px] font-bold text-text"
                >
                  <option>Monin India</option>
                  <option>Oatside India</option>
                  <option>Dak Lak Coffee Traders</option>
                  <option>Amul</option>
                  <option>Fresh Farms</option>
                </select>
                <span className="text-[11px] text-text-muted tnum">
                  Net 30 · lead time 3 days · GSTIN 27AACCM4417K1Z2
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">
                  Deliver to
                </label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="h-11 rounded-xl border border-border-input bg-white px-3.5 text-[14px] font-bold text-text"
                >
                  <option>WH-BLR-01 · Hosur Road</option>
                  <option>WH-BOM-01 · Andheri</option>
                  <option>WH-DEL-01 · Okhla</option>
                </select>
                <span className="text-[11px] text-text-muted">
                  Ambient zone · Dock 1 · receiving 7 am – 4 pm
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">
                  Expected delivery
                </label>
                <div className="h-11 rounded-xl border border-border-input bg-white px-3.5 flex items-center justify-between">
                  <input
                    type="text"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full text-[13px] font-bold text-text focus:outline-none"
                  />
                  <BruviIcon name="calendar" size={16} className="text-text-muted" />
                </div>
                <span className="text-[11px] text-text-muted">
                  Earliest possible: Mon 5 Oct
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-text">
                  Payment terms
                </span>
                <div className="h-11 rounded-xl bg-background-subtle border border-border px-3.5 flex items-center text-[13px] font-semibold text-text-secondary">
                  Net 30 · due 5 Nov
                </div>
                <span className="text-[11px] text-text-muted">
                  From supplier contract
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  Lines
                </h2>
                <p className="text-[12px] text-text-muted">
                  Suggested qty from reorder rules · max stock − available − on
                  order
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLines((prev) => [
                    ...prev,
                    {
                      id: `pol-${Date.now()}`,
                      sku: "SY-HAZ-750",
                      name: "Hazelnut syrup 750 ml",
                      onHand: 18,
                      reorderAt: 24,
                      suggestedQty: 12,
                      packHint: "1 case × 12",
                      qty: 12,
                      unitCostInr: 420,
                    },
                  ])
                }
                className="text-[13px] font-bold text-primary hover:text-primary-pressed cursor-pointer self-start sm:self-auto"
              >
                + Add line
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2.5 pr-3">Item</th>
                    <th className="py-2.5 px-2">Suggested</th>
                    <th className="py-2.5 px-2">Qty</th>
                    <th className="py-2.5 px-2 text-right">Unit</th>
                    <th className="py-2.5 pl-2 text-right">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-3.5 pr-3">
                        <p className="text-[13px] font-bold text-text">
                          {line.name}
                        </p>
                        <p className="text-[11px] text-text-muted tnum">
                          {line.sku} · on hand {line.onHand} · reorder at{" "}
                          {line.reorderAt}
                        </p>
                      </td>
                      <td className="py-3.5 px-2">
                        <p className="text-[13px] font-extrabold text-text tnum">
                          {line.suggestedQty}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {line.packHint}
                        </p>
                      </td>
                      <td className="py-3.5 px-2">
                        <input
                          type="number"
                          min={0}
                          value={line.qty}
                          onChange={(e) =>
                            updateLineQty(line.id, e.target.value)
                          }
                          aria-label={`Quantity for ${line.name}`}
                          className="h-9 w-24 rounded-lg border-2 border-primary/80 bg-white px-2.5 text-[13px] font-extrabold text-text tnum focus:outline-none focus:ring-2 focus:ring-focus"
                        />
                      </td>
                      <td className="py-3.5 px-2 text-right text-[12px] text-text-secondary tnum">
                        ₹{line.unitCostInr}
                      </td>
                      <td className="py-3.5 pl-2 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{(line.qty * line.unitCostInr).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label
                htmlFor="po-notes"
                className="text-[12px] font-bold text-text"
              >
                Notes to supplier
              </label>
              <textarea
                id="po-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-border-input bg-white p-3 text-[13px] text-text focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </div>
          </Card>
        </div>

        {/* Right: Summary + Approval + Why Now */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Summary
              </h2>
              <span className="text-[12px] text-text-muted tnum">
                PO-2026-0422 · draft
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">
                Subtotal · {totalUnits} units
              </span>
              <span className="font-bold text-text tnum">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">GST 18% on syrups (IGST)</span>
              <span className="font-bold text-text tnum">
                ₹{gstAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex items-baseline justify-between">
              <span className="text-[14px] font-extrabold text-text">
                PO total
              </span>
              <span className="text-price-m font-display font-extrabold text-text tnum">
                ₹{roundedTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-[11px] text-text-muted text-right tnum">
              Rounded from ₹{exactTotal.toFixed(2)} · INR
            </span>
          </Card>

          {requiresApproval && (
            <Card className="p-4 bg-surface-brand border-info/25 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[13px] font-extrabold text-primary">
                <BruviIcon name="shield-check" size={16} />
                <span>Approval required</span>
              </div>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                POs above ₹25,000 need sign-off. This goes to Kavya R. (Ops
                Director) — usually within 2 hours.
              </p>
            </Card>
          )}

          <Card className="p-5 flex flex-col gap-2">
            <h2 className="font-sans text-[14px] font-extrabold text-text">
              Why now
            </h2>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Vanilla syrup ran out at Indiranagar at 9:12. Warehouse has 36
              left, 4 already on TR-0882. At 6 bottles/day network use, cover is
              5 days.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[12px] font-medium text-text-muted">
          <span className="h-2 w-2 rounded-full bg-warning" />
          Unsaved changes · last saved 9:38 am
        </span>

        <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="compact"
            onClick={() => router.push("/warehouse/purchase-orders")}
          >
            Cancel
          </Button>
          <Button
            variant="workspace"
            size="compact"
            onClick={() => setStatusBanner("PO-2026-0422 saved as draft")}
          >
            Save draft
          </Button>
          <Button
            size="compact"
            onClick={() =>
              setStatusBanner(
                `PO-2026-0422 sent to Kavya R. for approval (₹${roundedTotal.toLocaleString("en-IN")})`,
              )
            }
          >
            Send for approval · ₹{roundedTotal.toLocaleString("en-IN")}
          </Button>
        </div>
      </div>
    </div>
  );
}
