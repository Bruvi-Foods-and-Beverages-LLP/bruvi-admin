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
import { WAREHOUSE_OUTBOUND_TRANSFERS } from "@/lib/warehouse/mock-warehouse-data";
import { KanbanTransferStage } from "@/types/warehouse";
import { cn } from "@/lib/utils/cn";

const STAGES: Array<{
  stage: KanbanTransferStage;
  dotColor: string;
}> = [
  { stage: "To pick", dotColor: "bg-text-muted" },
  { stage: "Picking", dotColor: "bg-warning" },
  { stage: "Packed", dotColor: "bg-primary" },
  { stage: "Dispatched", dotColor: "bg-success" },
];

export function WarehouseTransfersView() {
  const [selectedId, setSelectedId] = React.useState("TR-0882");
  const [notice, setNotice] = React.useState<string | null>(null);

  const selected =
    WAREHOUSE_OUTBOUND_TRANSFERS.find((t) => t.id === selectedId) ??
    WAREHOUSE_OUTBOUND_TRANSFERS[WAREHOUSE_OUTBOUND_TRANSFERS.length - 1];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb="WAREHOUSE / TRANSFERS · FRI 2 OCT"
        title="Outbound transfers"
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() =>
                setNotice("Generated printable pick lists for 4 To-pick transfers")
              }
            >
              Print pick lists
            </Button>
            <Button asChild size="compact">
              <Link href="/inventory/transfers?new=1">New transfer</Link>
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="transfers" />

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

      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Summary + 4-Column Kanban */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-6 text-[13px] text-text-muted">
            <span>
              <strong className="text-[20px] font-display font-extrabold text-text tnum mr-1.5">
                7
              </strong>
              transfers today
            </span>
            <span>
              <strong className="text-[20px] font-display font-extrabold text-text tnum mr-1.5">
                3
              </strong>
              vans · 2 routes
            </span>
            <span>
              <strong className="text-[20px] font-display font-extrabold text-text tnum mr-1.5">
                32
              </strong>
              lines left to pick
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <div className="grid grid-cols-4 gap-3 min-w-[640px] items-start">
              {STAGES.map(({ stage, dotColor }) => {
                const items = WAREHOUSE_OUTBOUND_TRANSFERS.filter(
                  (t) => t.stage === stage,
                );
                return (
                  <div
                    key={stage}
                    className="rounded-2xl bg-background-subtle border border-border p-2.5 flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-text">
                        <span className={cn("h-2 w-2 rounded-full", dotColor)} />
                        {stage}
                      </span>
                      <span className="text-[11px] font-bold text-text-muted tnum">
                        {items.length}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {items.map((tr) => {
                        const active = tr.id === selected.id;
                        return (
                          <button
                            key={tr.id}
                            type="button"
                            onClick={() => setSelectedId(tr.id)}
                            className={cn(
                              "w-full rounded-xl bg-white p-3 text-left transition-all cursor-pointer",
                              active
                                ? "border-2 border-primary shadow-raised"
                                : "border border-border hover:border-border-input",
                            )}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[12px] font-extrabold text-text tnum">
                                {tr.id}
                              </span>
                              <span className="text-[11px] text-text-muted tnum">
                                {tr.time}
                              </span>
                            </div>
                            <p className="text-[12px] font-bold text-text mt-1">
                              → {tr.toStore}
                            </p>
                            {typeof tr.progressPct === "number" && (
                              <div className="h-1.5 w-full rounded-full bg-background-subtle overflow-hidden my-1.5">
                                <div
                                  className="h-full bg-warning rounded-full"
                                  style={{ width: `${tr.progressPct}%` }}
                                />
                              </div>
                            )}
                            <p className="text-[11px] text-text-muted mt-0.5">
                              {tr.summaryLine}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Transfer Inspector */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-price-m font-display font-extrabold text-text tnum">
                {selected.id}
              </h2>
              <p className="text-[12px] text-text-muted">
                WH-BLR-01 → BRUVI {selected.toStore} · {selected.toAddress}
              </p>
            </div>
            <Badge variant="brand">
              {selected.stage === "Dispatched" ? "In transit" : selected.stage}
            </Badge>
          </div>

          <div className="rounded-xl bg-background-subtle p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-white border border-border flex items-center justify-center shrink-0 text-primary">
                  <BruviIcon name="parcel" size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold text-text truncate">
                    {selected.vehicleLabel}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {selected.driverLabel}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-extrabold text-text tnum">
                  {selected.etaLabel}
                </p>
                <p className="text-[10px] font-bold uppercase text-text-muted">
                  ETA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-[11px]">
              {[
                { label: "Picked", val: selected.pickedTime, done: Boolean(selected.pickedTime) },
                { label: "Packed", val: selected.packedTime, done: Boolean(selected.packedTime) },
                { label: "Dispatched", val: selected.dispatchedTime, done: Boolean(selected.dispatchedTime) },
                { label: "Received", val: "", done: false },
              ].map((step) => (
                <div key={step.label} className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "h-1 rounded-full",
                      step.done ? "bg-success" : "bg-border",
                    )}
                  />
                  <span
                    className={cn(
                      "truncate",
                      step.done ? "font-bold text-text" : "text-text-muted",
                    )}
                  >
                    {step.label} {step.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lines */}
          <div className="flex flex-col divide-y divide-border">
            {selected.lines.map((line) => (
              <div
                key={line.name}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-text">
                    {line.name}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {line.batchBin}
                  </p>
                </div>
                <span className="text-[14px] font-extrabold text-text tnum shrink-0">
                  {line.qty}
                </span>
              </div>
            ))}
          </div>

          {/* Hand-off Signatures */}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Hand-off signatures
            </span>
            <div className="grid grid-cols-3 gap-2">
              {selected.signatures.map((sig) => (
                <div
                  key={sig.role}
                  className={cn(
                    "rounded-xl p-2.5 flex flex-col justify-between min-h-[76px]",
                    sig.signed
                      ? "bg-background-subtle border border-border"
                      : "border border-dashed border-border-input",
                  )}
                >
                  <div className="h-5 flex items-center">
                    {sig.signed ? (
                      <svg
                        viewBox="0 0 60 18"
                        className="h-4 w-12 stroke-text fill-none"
                        strokeWidth={2}
                        strokeLinecap="round"
                      >
                        <path d="M2 14 Q 10 2, 18 12 T 34 8 T 56 11" />
                      </svg>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text truncate">
                      {sig.name}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">
                      {sig.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
