"use client";

import * as React from "react";
import { StoreEntity } from "@/store/slices/stores-slice";

interface StoreAtAGlanceCardProps {
  store: StoreEntity;
}

export function StoreAtAGlanceCard({ store }: StoreAtAGlanceCardProps) {
  const isBusy = store.status === "Busy mode";
  const isOpen = store.status === "Open" || store.isOpen;

  const statusLabel = isBusy
    ? "Open · Busy mode"
    : isOpen
    ? "Open"
    : "Closed";

  const statusColor = isOpen ? "text-success font-bold" : "text-text-muted font-bold";

  // Formatted launch date e.g. "12 Mar 2023"
  const formattedOpenDate = React.useMemo(() => {
    if (!store.openDate) return "Not set";
    try {
      const d = new Date(store.openDate);
      if (isNaN(d.getTime())) return store.openDate;
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return store.openDate || "Not set";
    }
  }, [store.openDate]);

  return (
    <div className="flex flex-col rounded-[16px] bg-surface border border-border p-5 gap-4 shadow-sm">
      {/* Title (Figma Node 225:87481) */}
      <h3 className="text-title text-text">
        Store at a glance
      </h3>

      {/* Rows List (Figma Nodes 225:87482 - 225:87494) */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Status */}
        <div className="flex items-center justify-between text-body-s">
          <span className="text-text-muted">Status</span>
          <span className={statusColor}>{statusLabel}</span>
        </div>

        {/* Row 2: Launched */}
        <div className="flex items-center justify-between text-body-s">
          <span className="text-text-muted">Launched</span>
          <span className="text-text">{formattedOpenDate}</span>
        </div>

        {/* Row 3: Devices */}
        <div className="flex items-center justify-between text-body-s">
          <span className="text-text-muted">Devices</span>
          <span className="text-text-muted">Not set up yet</span>
        </div>

        {/* Row 4: Staff */}
        <div className="flex items-center justify-between text-body-s">
          <span className="text-text-muted">Staff</span>
          <span className={store.manager ? "text-text" : "text-text-muted"}>
            {store.manager ? `${store.manager} (manager)` : "No manager assigned"}
          </span>
        </div>
      </div>
    </div>
  );
}

