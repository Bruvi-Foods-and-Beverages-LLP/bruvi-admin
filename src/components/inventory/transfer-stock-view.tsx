"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InventoryModuleHeader,
  InventoryTabBar,
} from "@/components/inventory/inventory-header-and-tabs";
import { STOCK_TRANSFERS } from "@/lib/inventory/mock-inventory-data";
import { StockTransferRecord, TransferStatus } from "@/types/inventory";
import { cn } from "@/lib/utils/cn";

function TransferStatusPill({ status }: { status: TransferStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0",
        status === "Dispatched" && "bg-info-surface text-info",
        status === "Picking" && "bg-warning-surface text-warning",
        status === "Scheduled" && "bg-background-subtle text-text-secondary border border-border",
        status === "Draft" && "bg-background-subtle text-text-muted border border-border",
        status === "Received" && "bg-success-surface text-success",
      )}
    >
      {status}
    </span>
  );
}

export function TransferStockView({
  initialTransferId = "TR-0882",
}: {
  initialTransferId?: string;
}) {
  const [transfers, setTransfers] =
    React.useState<StockTransferRecord[]>(STOCK_TRANSFERS);
  const [activeId, setActiveId] = React.useState(initialTransferId);
  const [notice, setNotice] = React.useState<string | null>(null);

  const activeTransfer =
    transfers.find((t) => t.id === activeId) ?? transfers[0];

  const todayTotalInr = React.useMemo(
    () => transfers.reduce((sum, t) => sum + t.totalValueInr, 0),
    [transfers],
  );

  const stepState = (stepIndex: number) => {
    const order: Record<TransferStatus, number> = {
      Draft: 1,
      Scheduled: 1,
      Picking: 2,
      Dispatched: 3,
      Received: 4,
    };
    const current = order[activeTransfer.status];
    if (stepIndex < current) return "done";
    if (stepIndex === current) return "active";
    return "pending";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <InventoryModuleHeader
        breadcrumb={`Inventory / Transfers / ${activeTransfer.id}`}
        title={`Transfer ${activeTransfer.id}`}
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() =>
                setNotice(`Prepared printable challan for ${activeTransfer.id}`)
              }
            >
              Print challan
            </Button>
            <Button
              size="compact"
              onClick={() => {
                const newId = `TR-088${transfers.length + 1}`;
                const created: StockTransferRecord = {
                  ...STOCK_TRANSFERS[3],
                  id: newId,
                  status: "Draft",
                  summarySubtitle: "WH-BLR-01 · 1 line · Draft",
                };
                setTransfers((prev) => [created, ...prev]);
                setActiveId(newId);
                setNotice(`Created draft transfer ${newId}`);
              }}
            >
              New transfer
            </Button>
          </>
        }
      />

      <InventoryTabBar active="transfers" />

      {notice && (
        <div className="rounded-xl border border-info/30 bg-info-surface px-4 py-2.5 text-[13px] font-bold text-info flex items-center justify-between">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* Left: Active Transfer Detail */}
        <div className="flex flex-col gap-5">
          {/* Route + 4-Step Progress Card */}
          <Card className="p-5 flex flex-col gap-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-text-muted">
                  From
                </span>
                <p className="text-[16px] font-display font-extrabold text-text">
                  {activeTransfer.fromCode}
                </p>
                <p className="text-[12px] text-text-muted">
                  {activeTransfer.fromSubtitle}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-brand px-3.5 py-1.5 text-[12px] font-bold text-primary">
                  <BruviIcon name="parcel" size={14} />
                  <span>
                    {activeTransfer.vehicleLabel} · {activeTransfer.distanceLabel}
                  </span>
                </span>
              </div>

              <div className="md:text-right">
                <span className="text-[11px] font-bold text-text-muted">To</span>
                <p className="text-[16px] font-display font-extrabold text-text">
                  {activeTransfer.toName} · {activeTransfer.toCode}
                </p>
                <p className="text-[12px] text-text-muted">
                  Receiver {activeTransfer.receiverName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Created", meta: activeTransfer.createdMeta, idx: 1 },
                { label: "Picked & packed", meta: activeTransfer.pickedMeta, idx: 2 },
                { label: "Dispatched", meta: activeTransfer.dispatchedMeta, idx: 3 },
                { label: "Received", meta: activeTransfer.receivedMeta, idx: 4 },
              ].map((st) => {
                const state = stepState(st.idx);
                return (
                  <div key={st.label} className="flex flex-col gap-1.5">
                    <div
                      className={cn(
                        "h-1 w-full rounded-full",
                        state === "done" && "bg-success",
                        state === "active" && "bg-primary",
                        state === "pending" && "bg-border",
                      )}
                    />
                    <span className="text-[12px] font-extrabold text-text">
                      {st.label}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {st.meta}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Line Items + Cold-Chain Metadata */}
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Lines · {activeTransfer.lines.length} items
              </h2>
              <span className="text-[12px] text-text-muted">
                Chilled · FEFO batches picked
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="py-2.5 pr-3">Item · batch</th>
                    <th className="py-2.5 px-3 text-right">Qty sent</th>
                    <th className="py-2.5 px-3 text-right">At source</th>
                    <th className="py-2.5 px-3 text-right">Store after</th>
                    <th className="py-2.5 pl-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeTransfer.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-3 pr-3">
                        <p className="text-[13px] font-bold text-text">
                          {line.ingredientName}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {line.batchLabel}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-right text-[13px] font-extrabold text-text tnum">
                        {line.qtySentLabel}
                      </td>
                      <td className="py-3 px-3 text-right text-[12px] text-text-muted tnum">
                        {line.sourceChange}
                      </td>
                      <td className="py-3 px-3 text-right text-[13px] font-bold text-success tnum">
                        {line.storeAfter}
                      </td>
                      <td className="py-3 pl-3 text-right text-[13px] font-extrabold text-text tnum">
                        ₹{line.valueInr.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-[13px]">
              <span className="text-text-muted">
                Transfer value at cost · no charge to store P&amp;L until
                received
              </span>
              <span className="text-[15px] font-extrabold text-text tnum">
                ₹{activeTransfer.totalValueInr.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-[11px] text-text-muted">
                  Vehicle
                </span>
                <span className="text-[13px] font-extrabold text-text tnum">
                  {activeTransfer.vehicleLabel.replace("Van ", "")}
                </span>
              </div>
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-[11px] text-text-muted">
                  Dispatch slot
                </span>
                <span className="text-[13px] font-extrabold text-text tnum">
                  {activeTransfer.dispatchSlot}
                </span>
              </div>
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-[11px] text-text-muted">
                  Seal · temp
                </span>
                <span className="text-[13px] font-extrabold text-text tnum">
                  {activeTransfer.sealTemp}
                </span>
              </div>
              <div className="rounded-xl bg-surface-brand p-3">
                <span className="block text-[11px] text-info">
                  ETA at store
                </span>
                <span className="text-[13px] font-extrabold text-info tnum">
                  {activeTransfer.etaLabel}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Today's Transfers List + Driver Card */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Today’s transfers
              </h2>
              <span className="text-[12px] font-medium text-text-muted tnum">
                {transfers.length} · ₹{todayTotalInr.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border">
              {transfers.map((tr) => {
                const selected = tr.id === activeTransfer.id;
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setActiveId(tr.id)}
                    className={cn(
                      "py-3 px-3 -mx-3 rounded-xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer",
                      selected
                        ? "bg-surface-brand"
                        : "hover:bg-background-subtle",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text truncate">
                        {tr.id} → {tr.toName}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {tr.summarySubtitle}
                      </p>
                    </div>
                    <TransferStatusPill status={tr.status} />
                  </button>
                );
              })}
            </div>
          </Card>

          {activeTransfer.driverName && (
            <Card className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-surface-brand text-primary text-[12px] font-extrabold flex items-center justify-center shrink-0">
                  {activeTransfer.driverInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text truncate">
                    {activeTransfer.driverName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {activeTransfer.driverPing}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setNotice(
                    `Live GPS: ${activeTransfer.driverPing} (${activeTransfer.vehicleLabel})`,
                  )
                }
              >
                Track
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
