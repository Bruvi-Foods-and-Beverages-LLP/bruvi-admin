"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffAvatar } from "@/components/staff/staff-avatar";
import {
  StaffModuleHeader,
  StaffTabBar,
} from "@/components/staff/staff-header-and-tabs";
import { StaffApi } from "@/lib/api/staff";
import { cn } from "@/lib/utils/cn";

export function ShiftsManagementView() {
  const [selectedStore, setSelectedStore] = React.useState("BLR-IND");
  const [storeName, setStoreName] = React.useState("Indiranagar");
  const [weekStart, setWeekStart] = React.useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [shifts, setShifts] = React.useState<any[]>([]);
  const [openShifts, setOpenShifts] = React.useState<any[]>([]);
  const [swaps, setSwaps] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const loadShifts = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await StaffApi.getShiftManagement(selectedStore, weekStart);
      if (res.store?.name) setStoreName(res.store.name);
      setShifts(res.shifts ?? []);
      setOpenShifts(res.openShifts ?? []);
      setSwaps(res.swapRequests ?? []);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load shift management",
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedStore, weekStart]);

  React.useEffect(() => {
    void loadShifts();
  }, [loadShifts]);

  const handlePublishRota = async () => {
    try {
      const res = await StaffApi.publishRota(selectedStore, weekStart);
      showToast(`Published ${res.publishedCount} draft shift(s) for ${storeName}`);
      await loadShifts();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to publish rota");
    }
  };

  const handleSwapAction = async (id: string, status: "APPROVED" | "DECLINED") => {
    try {
      await StaffApi.decideSwap(id, status);
      showToast(
        status === "APPROVED"
          ? "Shift swap approved & rota updated"
          : "Shift swap declined",
      );
      await loadShifts();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update swap");
    }
  };

  // Group shifts by staff member
  const staffRows = React.useMemo(() => {
    const map = new Map<string, { name: string; role: string; shifts: any[] }>();
    for (const s of shifts) {
      if (!s.user_id) continue;
      const cur = map.get(s.user_id) ?? {
        name: s.users?.full_name || "Staff Member",
        role: s.role_label || "Barista",
        shifts: [] as any[],
      };
      cur.shifts.push(s);
      map.set(s.user_id, cur);
    }
    return Array.from(map.entries()).map(([id, val]) => ({ id, ...val }));
  }, [shifts]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <StaffModuleHeader
        overline={`Staff / Shifts / ${storeName}`}
        title="Shift management"
        actions={
          <Button
            type="button"
            variant="default"
            size="compact"
            onClick={() => void handlePublishRota()}
          >
            Publish rota
          </Button>
        }
      />

      <StaffTabBar active="shifts" />

      {toastMsg && (
        <div className="rounded-[12px] bg-gray-900 text-white px-4 py-2.5 text-[13px] font-medium flex items-center justify-between shadow-floating">
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="text-text-inverse-muted hover:text-white cursor-pointer"
          >
            <BruviIcon name="close" size="inline" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-[12px] border border-error/30 bg-error-surface px-4 py-3 text-[13px] text-error flex items-center justify-between">
          <span>{errorMsg}</span>
          <Button type="button" variant="workspace" size="sm" onClick={() => void loadShifts()}>
            Retry
          </Button>
        </div>
      )}

      <Card className="rounded-[16px] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-title font-sans font-bold text-text tnum">
              Week starting {weekStart}
            </h2>
            <p className="text-[12px] text-text-muted tnum">
              {storeName} · {staffRows.length} scheduled staff · {shifts.length} shifts
            </p>
          </div>

          <div className="relative inline-flex items-center">
            <select
              aria-label="Select store rota"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="h-9 appearance-none pl-3.5 pr-8 rounded-[10px] border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer outline-none hover:bg-background-subtle"
            >
              <option value="BLR-IND">Indiranagar (BLR-IND)</option>
              <option value="BOM-BAN">Bandra (BOM-BAN)</option>
              <option value="DEL-HKV">Hauz Khas (DEL-HKV)</option>
              <option value="BLR-WHF">Whitefield (BLR-WHF)</option>
            </select>
            <BruviIcon
              name="chevron-down"
              size={14}
              className="pointer-events-none absolute right-2.5 text-text-secondary"
            />
          </div>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-[8px]" />
              ))}
            </div>
          ) : staffRows.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-text-muted">
              No shifts scheduled for {storeName} from {weekStart}.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {staffRows.map((row) => (
                <div
                  key={row.id}
                  className="py-3 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2.5">
                    <StaffAvatar
                      initials={row.name
                        .split(/\s+/)
                        .map((p) => p[0]?.toUpperCase() ?? "")
                        .join("")
                        .slice(0, 2)}
                      size="sm"
                    />
                    <div>
                      <div className="text-[13px] font-bold text-text">{row.name}</div>
                      <div className="text-[11px] text-text-muted">{row.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.shifts.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-[8px] bg-surface-brand px-2.5 py-1 text-[11px] font-bold text-primary tnum"
                      >
                        {s.shift_date} · {String(s.start_time).slice(0, 5)}–
                        {String(s.end_time).slice(0, 5)} ({s.station_kind})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="rounded-[16px] p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-title font-sans font-bold text-text">
              Open shifts · network
            </h2>
            <Badge className="rounded-full bg-warning-surface text-warning border-0 px-2.5 py-0.5 text-[11px] font-bold tnum">
              {openShifts.length} unfilled
            </Badge>
          </div>
          {openShifts.length === 0 ? (
            <span className="text-[12px] text-text-muted">No open shifts right now.</span>
          ) : (
            <div className="divide-y divide-border">
              {openShifts.map((shift) => (
                <div key={shift.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-text">
                      {shift.outlets?.name ?? "Store"} · {shift.role_label}
                    </div>
                    <div className="text-[11px] text-text-muted tnum">
                      {shift.shift_date} · {String(shift.start_time).slice(0, 5)}–
                      {String(shift.end_time).slice(0, 5)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-[16px] p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-title font-sans font-bold text-text">Swap requests</h2>
            <span className="text-[12px] text-text-muted tnum">
              {swaps.length} pending
            </span>
          </div>
          {swaps.length === 0 ? (
            <span className="text-[12px] text-text-muted">No pending swap requests.</span>
          ) : (
            swaps.map((swap) => (
              <div
                key={swap.id}
                className="rounded-[12px] bg-background-subtle p-3.5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2 text-[13px] font-bold text-text">
                  <span>{swap.from_user?.full_name ?? "Staff"}</span>
                  <span className="text-warning">⇄</span>
                  <span>{swap.to_user?.full_name ?? "Replacement"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="workspace"
                    size="sm"
                    onClick={() => void handleSwapAction(swap.id, "DECLINED")}
                  >
                    Decline
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => void handleSwapAction(swap.id, "APPROVED")}
                  >
                    Approve swap
                  </Button>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
