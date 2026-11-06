"use client";

import * as React from "react";
import Link from "next/link";
import { StoreEntity } from "@/store/slices/stores-slice";
import { StoreDetailTab } from "./store-detail-tabs";
import { Pause, Play } from "lucide-react";
import { RbacGuard } from "@/components/auth/rbac-guard";
import { cn } from "@/lib/utils/cn";

interface StoreDetailHeaderProps {
  store: StoreEntity;
  activeTab?: StoreDetailTab;
  onToggleAppOrders?: () => void;
  isAppOrdersPaused?: boolean;
  onPushToDevices?: () => void;
  onExportMenu?: () => void;
  isPushing?: boolean;
  onSaveHours?: () => void;
  onCopyHours?: () => void;
  isSavingHours?: boolean;
}

export function StoreDetailHeader({
  store,
  activeTab = "overview",
  onToggleAppOrders,
  isAppOrdersPaused = false,
  onPushToDevices,
  onExportMenu,
  isPushing = false,
  onSaveHours,
  onCopyHours,
  isSavingHours = false,
}: StoreDetailHeaderProps) {
  const isBusy = store.status === "Busy mode" || isAppOrdersPaused;

  const tabLabelMap: Record<StoreDetailTab, string> = {
    overview: "Overview",
    hours: "Hours",
    menu: "Menu",
    devices: "Devices",
    staff: "Staff",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb Navigation (Figma Node I225:169460;225:169450) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-body-s text-text-muted">
        <Link
          href="/stores"
          className="hover:text-text transition-colors cursor-pointer"
        >
          Stores
        </Link>
        <span className="text-border-strong select-none">/</span>
        <span className="text-text font-medium truncate max-w-[280px]">
          {store.city || store.name}
        </span>
        {activeTab !== "overview" && (
          <>
            <span className="text-border-strong select-none">/</span>
            <span className="text-text font-bold">
              {tabLabelMap[activeTab]}
            </span>
          </>
        )}
      </nav>

      {/* Main Header Content (Figma Node 225:86591) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Left: Title + Status Badge + Meta */}
        <div className="flex flex-col gap-1">
          {/* Title Row (Figma Node I225:169460;225:169451) */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-display-s text-text tracking-tight font-display">
              {store.name}
            </h1>

            {/* Status Pill: Open */}
            <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-[#ebf1de] text-[#566f2c] text-caption-bold">
              <span className="h-2 w-2 rounded-full bg-[#566f2c] shrink-0" />
              <span>Open</span>
            </span>

            {/* Optional Busy Mode Pill (Figma Node I225:169460;225:169451;225:168110) */}
            {isBusy && (
              <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-warning-surface text-warning text-caption-bold">
                Busy mode · +10 min app prep
              </span>
            )}
          </div>

          {/* Meta Line (Figma Node I225:169460;225:169452) */}
          <p className="text-body-s text-text-muted">
            {store.code} · {store.type} · {store.city} · Manager {store.manager || "not assigned"} · Open {store.hours}
          </p>
        </div>

        {/* Right: Action Buttons (Figma Node 225:86602 / 225:88151 / 225:87727) */}
        {activeTab === "hours" ? (
          /* Hours Tab Actions (Figma Node 225:87727: Copy to other stores + Save hours) */
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onCopyHours}
              className="flex h-9 items-center justify-center rounded-[12px] border-[1.5px] border-[#bcc6d3] bg-surface px-4 font-sans text-[14px] leading-[20px] text-[#0f2340] hover:bg-gray-50 hover:border-[#7f8ca0] transition-all cursor-pointer shadow-2xs font-bold"
            >
              Copy to other stores
            </button>

            <button
              type="button"
              disabled={isSavingHours}
              onClick={onSaveHours}
              className="flex h-9 items-center justify-center rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] px-4 font-sans text-[14px] leading-[20px] text-white transition-all cursor-pointer shadow-2xs font-bold disabled:opacity-50"
            >
              <span>{isSavingHours ? "Saving..." : "Save hours"}</span>
            </button>
          </div>
        ) : activeTab === "menu" ? (
          /* Menu Tab Actions (Figma Node 225:88151: Export + Push to devices) */
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onExportMenu}
              className="flex h-9 items-center justify-center rounded-[12px] border-[1.5px] border-border-input bg-surface px-4 text-label text-text hover:bg-gray-50 hover:border-text transition-all cursor-pointer shadow-2xs font-bold"
            >
              Export
            </button>

            <button
              type="button"
              disabled={isPushing}
              onClick={onPushToDevices}
              className="flex h-9 items-center gap-2 rounded-[12px] bg-primary hover:bg-navy-900 px-4 text-label text-white transition-all cursor-pointer shadow-2xs font-bold disabled:opacity-50"
            >
              <span>{isPushing ? "Pushing..." : "Push to devices"}</span>
            </button>
          </div>
        ) : (
          /* Overview Tab Actions */
          <div className="flex items-center gap-2 shrink-0">
            <RbacGuard roles={["SUPER_ADMIN", "ADMIN", "STORE_MANAGER"]}>
              <Link
                href={`/stores/${store.id}/edit`}
                className="flex h-9 items-center justify-center rounded-[12px] border-[1.5px] border-border-input bg-surface px-4 text-label text-text hover:bg-gray-50 hover:border-text transition-all cursor-pointer shadow-2xs font-bold"
              >
                Edit
              </Link>
            </RbacGuard>

            <button
              type="button"
              onClick={onToggleAppOrders}
              className={cn(
                "flex h-9 items-center gap-2 rounded-[12px] px-4 text-label text-white transition-all cursor-pointer shadow-2xs font-bold",
                isAppOrdersPaused
                  ? "bg-[#566f2c] hover:bg-[#435722]"
                  : "bg-primary hover:bg-navy-900"
              )}
            >
              {isAppOrdersPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 fill-white text-white" />
                  <span>Resume app orders</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 fill-white text-white" />
                  <span>Pause app orders</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
