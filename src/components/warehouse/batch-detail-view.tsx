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
import { BATCH_OAT_DETAIL } from "@/lib/warehouse/mock-warehouse-data";
import { cn } from "@/lib/utils/cn";

export function BatchDetailView({ batchId }: { batchId: string }) {
  const b = BATCH_OAT_DETAIL;
  const [recallStarted, setRecallStarted] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      <WarehouseModuleHeader
        breadcrumb={`WAREHOUSE / BATCHES / ${batchId.toUpperCase()}`}
        title={`Batch ${batchId}`}
        actions={
          <>
            <Button
              variant="workspace"
              size="compact"
              onClick={() => setNotice(`Downloaded ${b.coaFile}`)}
            >
              Download QC cert
            </Button>
            <Button
              size="compact"
              onClick={() =>
                setNotice("Opened bin transfer dialog for Chiller C-02-14")
              }
            >
              Move batch
            </Button>
          </>
        }
      />

      <WarehouseTabBar active="batches" />

      {notice && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-[13px] font-bold flex items-center justify-between",
            recallStarted
              ? "border-error/30 bg-error-surface text-error"
              : "border-info/30 bg-info-surface text-info",
          )}
        >
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

      {/* Top Metadata Strip */}
      <Card className="p-4 sm:px-5 flex flex-wrap items-center gap-6 sm:gap-12">
        <div>
          <span className="block text-[11px] font-medium text-text-muted">
            Item
          </span>
          <span className="text-[14px] font-extrabold text-text">
            {b.itemName}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-text-muted">
            Manufactured
          </span>
          <span className="text-[14px] font-extrabold text-text tnum">
            {b.manufactured}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-text-muted">
            Expires
          </span>
          <span className="text-[14px] font-extrabold text-text tnum">
            {b.expires}
          </span>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-text-muted">
            Received
          </span>
          <Link
            href="/warehouse/receiving"
            className="text-[14px] font-extrabold text-text hover:text-primary tnum"
          >
            {b.receivedLabel}
          </Link>
        </div>
        <div>
          <span className="block text-[11px] font-medium text-text-muted">
            Location
          </span>
          <span className="text-[14px] font-extrabold text-text">
            {b.location}
          </span>
        </div>
      </Card>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Left: Where it went + Temperature log */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Where it went
              </h2>
              <span className="text-[12px] text-text-muted tnum">
                {b.traceableTotal} of {b.traceableTotal} cartons traceable
              </span>
            </div>

            {/* Traceability Stacked Bar */}
            <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5">
              <div className="bg-category-coffee" style={{ width: "3%" }} />
              <div className="bg-accent" style={{ width: "2.5%" }} />
              <div className="bg-primary" style={{ width: "94.5%" }} />
            </div>

            <div className="flex flex-col divide-y divide-border">
              {b.allocations.map((al) => (
                <div
                  key={al.id}
                  className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "mt-1.5 h-2.5 w-2.5 rounded-xs shrink-0",
                        al.dotTone === "coffee" && "bg-category-coffee",
                        al.dotTone === "accent" && "bg-accent",
                        al.dotTone === "primary" && "bg-primary",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-text truncate">
                        {al.title}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {al.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                        al.statusTone === "info" && "bg-info-surface text-info",
                        al.statusTone === "warning" &&
                          "bg-warning-surface text-warning",
                        al.statusTone === "success" &&
                          "bg-success-surface text-success",
                      )}
                    >
                      {al.statusLabel}
                    </span>
                    <span className="text-[14px] font-extrabold text-text tnum w-9 text-right">
                      {al.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-sans text-[16px] font-extrabold text-text">
                  Temperature log
                </h2>
                <p className="text-[12px] text-text-muted">
                  Supplier truck → Dock 2 → chiller C-02 · limit 2–5 °C
                </p>
              </div>
              <div className="text-right tnum">
                <span className="text-[18px] font-display font-extrabold text-success">
                  {b.currentTempC} °C
                </span>
                <span className="ml-1.5 text-[11px] text-text-muted">
                  now · max {b.maxTempC}
                </span>
              </div>
            </div>

            {/* Cold-Chain SVG Chart (2–5 °C band highlighted) */}
            <div className="w-full">
              <div className="grid grid-cols-[24px_1fr] gap-2 items-center">
                <div className="flex flex-col justify-between h-28 text-[10px] text-text-muted tnum text-right">
                  <span>8°</span>
                  <span>4°</span>
                  <span>0°</span>
                </div>
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-border/60 bg-white">
                  {/* Safe 2-5 °C band */}
                  <div
                    className="absolute inset-x-0 bg-success-surface/70 border-y border-dashed border-success/40"
                    style={{ top: "37.5%", height: "37.5%" }}
                  />
                  <svg
                    viewBox="0 0 520 112"
                    preserveAspectRatio="none"
                    className="relative z-10 h-full w-full"
                  >
                    <polyline
                      fill="none"
                      stroke="#0f2340"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={b.tempPoints
                        .map((t, idx) => {
                          const x = (idx / (b.tempPoints.length - 1)) * 520;
                          const y = 112 - (t / 8) * 112;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 pl-8 flex items-center justify-between text-[11px] text-text-muted tnum">
                <span>1 Oct 6 pm · loaded at Oatside</span>
                <span className="font-bold text-text">In transit 13 h</span>
                <span>7:10 arrival 4.2 °C · 9:40</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Quality + Recall Readiness */}
        <div className="flex flex-col gap-5">
          <Card className="p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Quality
              </h2>
              <Badge variant="success">{b.qcStatus}</Badge>
            </div>

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Batch size</span>
                <span className="font-bold text-text tnum">
                  {b.batchSizeLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Inspected by</span>
                <span className="font-bold text-text">{b.inspectedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Supplier CoA</span>
                <span className="font-bold text-text">{b.coaLabel}</span>
              </div>
            </div>

            <div className="rounded-xl bg-background-subtle border border-border p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <BruviIcon name="file" size={16} className="text-text-muted shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-text truncate">
                    {b.coaFile}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {b.coaMeta}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotice(`Previewing ${b.coaFile}`)}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer shrink-0"
              >
                View
              </button>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <div>
              <h2 className="font-sans text-[16px] font-extrabold text-text">
                Recall readiness
              </h2>
              <p className="text-[12px] text-text-muted mt-0.5">
                If Oatside or FSSAI flags this batch, this is the blast radius.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-price-m font-display font-extrabold text-text tnum">
                  {b.recallTraceablePct}%
                </span>
                <span className="text-[11px] text-text-muted">
                  units traceable
                </span>
              </div>
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-price-m font-display font-extrabold text-text tnum">
                  {b.recallStoresAffected}
                </span>
                <span className="text-[11px] text-text-muted">
                  stores affected
                </span>
              </div>
              <div className="rounded-xl bg-background-subtle p-3">
                <span className="block text-price-m font-display font-extrabold text-text tnum">
                  {b.recallCupsServed}
                </span>
                <span className="text-[11px] text-text-muted">
                  cups served
                </span>
              </div>
            </div>

            <p className="text-[12px] text-text-muted leading-relaxed">
              Starting a recall blocks the batch at the warehouse, recalls
              TR-0882 and TR-0883, alerts Meera K. and the HSR Layout manager,
              and notifies Oatside India.
            </p>

            <Button
              variant="outline"
              size="compact"
              disabled={recallStarted}
              onClick={() => {
                setRecallStarted(true);
                setNotice(
                  `Batch ${batchId} quarantined · TR-0882 & TR-0883 recall initiated`,
                );
              }}
              className="border-error/60 text-error hover:bg-error-surface hover:text-error"
            >
              <BruviIcon name="alert" size={16} className="mr-1.5" />
              <span>{recallStarted ? "Recall active" : "Start recall"}</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
