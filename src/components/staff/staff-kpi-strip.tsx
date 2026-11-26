"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

export interface StaffKpiStripProps {
  onShiftCount: number;
  totalStaff: number;
  storesCount: number;
  openShiftsCount: number;
  openShiftsStores: string;
  expiringCertsCount: number;
  expiringCertsDetail: string;
  onLeaveCount: number;
  invitedCount: number;
}

export function StaffKpiStrip({
  onShiftCount,
  totalStaff,
  storesCount,
  openShiftsCount,
  openShiftsStores,
  expiringCertsCount,
  expiringCertsDetail,
  onLeaveCount,
  invitedCount,
}: StaffKpiStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Navy Hero Card */}
      <div className="rounded-[16px] bg-surface-inverse text-white p-5 flex flex-col justify-between gap-2 shadow-raised">
        <span className="font-sans text-[12px] leading-4 font-semibold text-text-inverse-secondary">
          On shift now
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-price-l font-display font-extrabold text-white tnum">
            {onShiftCount}
          </span>
          <span className="font-sans text-[12px] leading-4 text-text-inverse-muted tnum">
            of {totalStaff} staff · {storesCount} stores
          </span>
        </div>
        <span className="font-sans text-[12px] leading-4 font-semibold text-success-on-dark">
          All stores staffed to forecast
        </span>
      </div>

      {/* 2. Open shifts */}
      <Card className="rounded-[16px] p-5 flex flex-col justify-between gap-2">
        <span className="font-sans text-[12px] leading-4 font-semibold text-text-muted">
          Open shifts
        </span>
        <span className="text-price-l font-display font-extrabold text-warning tnum">
          {openShiftsCount}
        </span>
        <span className="font-sans text-[12px] leading-4 text-text-muted truncate">
          {openShiftsStores}
        </span>
      </Card>

      {/* 3. Certifications expiring */}
      <Card className="rounded-[16px] p-5 flex flex-col justify-between gap-2">
        <span className="font-sans text-[12px] leading-4 font-semibold text-text-muted">
          Certifications expiring
        </span>
        <span className="text-price-l font-display font-extrabold text-error tnum">
          {expiringCertsCount}
        </span>
        <span className="font-sans text-[12px] leading-4 text-text-muted truncate">
          {expiringCertsDetail}
        </span>
      </Card>

      {/* 4. On leave · Invited */}
      <Card className="rounded-[16px] p-5 flex flex-col justify-between gap-2">
        <span className="font-sans text-[12px] leading-4 font-semibold text-text-muted">
          On leave · Invited
        </span>
        <span className="text-price-l font-display font-extrabold text-text tnum">
          {onLeaveCount} · {invitedCount}
        </span>
        <span className="font-sans text-[12px] leading-4 text-text-muted truncate">
          {invitedCount} invites awaiting sign-up
        </span>
      </Card>
    </div>
  );
}
