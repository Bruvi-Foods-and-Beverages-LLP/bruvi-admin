"use client";

import * as React from "react";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StaffModuleHeader,
  StaffTabBar,
} from "@/components/staff/staff-header-and-tabs";
import { StaffApi } from "@/lib/api/staff";
import {
  PermissionAccessLevel,
  PermissionCapability,
  PermissionChangeLogEntry,
} from "@/types/staff";
import { cn } from "@/lib/utils/cn";

const NEXT_LEVEL: Record<PermissionAccessLevel, PermissionAccessLevel> = {
  allowed: "partial",
  partial: "none",
  none: "allowed",
};

function PermissionCellIcon({
  level,
  isChanged,
}: {
  level: PermissionAccessLevel;
  isChanged?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full transition-all",
        level === "allowed" && "bg-success-surface text-success",
        level === "partial" && "bg-warning-surface text-warning",
        level === "none" && "border border-border-input bg-white text-transparent",
        isChanged && "ring-2 ring-primary ring-offset-1",
      )}
    >
      {level === "allowed" && <BruviIcon name="check" size={13} />}
      {level === "partial" && (
        <span className="text-[12px] font-extrabold leading-none">–</span>
      )}
    </span>
  );
}

export function PermissionsMatrixView() {
  const [roleColumns, setRoleColumns] = React.useState<
    Array<{ id: string; label: string }>
  >([]);
  const [capabilities, setCapabilities] = React.useState<PermissionCapability[]>([]);
  const [changeLog, setChangeLog] = React.useState<PermissionChangeLogEntry[]>([]);
  const [changedKeys, setChangedKeys] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const loadMatrix = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await StaffApi.getPermissionsMatrix();
      setRoleColumns(
        (res.roles ?? []).map((r) => ({ id: r.id, label: r.name })),
      );
      const mapByCap: Record<string, Record<string, PermissionAccessLevel>> = {};
      for (const a of res.assignments ?? []) {
        mapByCap[a.capability_id] = mapByCap[a.capability_id] ?? {};
        mapByCap[a.capability_id][a.role_id] = a.access_level;
      }
      setCapabilities(
        (res.capabilities ?? []).map((c) => ({
          id: c.id,
          area: c.area,
          label: c.label,
          subtitle: c.subtitle ?? undefined,
          sensitive: c.is_sensitive,
          levelsByRole: mapByCap[c.id] ?? {},
        })),
      );
      setChangeLog(
        (res.changeLog ?? []).map((l) => ({
          id: l.id,
          timestamp: new Date(l.created_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          }),
          actor: l.actor_name,
          summary: l.summary,
        })),
      );
      setChangedKeys([]);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load permissions matrix",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMatrix();
  }, [loadMatrix]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const handleCycleCell = (capId: string, roleId: string) => {
    setCapabilities((prev) =>
      prev.map((cap) => {
        if (cap.id !== capId) return cap;
        const current = cap.levelsByRole[roleId] ?? "none";
        return {
          ...cap,
          levelsByRole: {
            ...cap.levelsByRole,
            [roleId]: NEXT_LEVEL[current],
          },
        };
      }),
    );
    const key = `${capId}:${roleId}`;
    setChangedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const handleSaveChanges = async () => {
    if (changedKeys.length === 0) {
      showToast("No pending permission changes");
      return;
    }
    const updates = changedKeys
      .map((key) => {
        const [capabilityId, roleId] = key.split(":");
        const cap = capabilities.find((c) => c.id === capabilityId);
        const accessLevel = cap?.levelsByRole[roleId] ?? "none";
        return { roleId, capabilityId, accessLevel };
      })
      .filter((u) => Boolean(u.roleId && u.capabilityId));

    try {
      await StaffApi.savePermissionsMatrix(updates);
      showToast(`Saved ${updates.length} permission changes`);
      await loadMatrix();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save permissions");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <StaffModuleHeader
        overline="Staff / Permissions"
        title="Permissions"
        actions={
          <Button
            type="button"
            variant="default"
            size="compact"
            onClick={() => void handleSaveChanges()}
          >
            Save changes
          </Button>
        }
      />

      <StaffTabBar active="permissions" />

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
          <Button type="button" variant="workspace" size="sm" onClick={() => void loadMatrix()}>
            Retry
          </Button>
        </div>
      )}

      <Card className="rounded-[16px] overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5 text-[12px] text-text-secondary">
            <div className="flex items-center gap-2">
              <PermissionCellIcon level="allowed" />
              <span>Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <PermissionCellIcon level="partial" />
              <span>Partial / needs approval</span>
            </div>
            <div className="flex items-center gap-2">
              <PermissionCellIcon level="none" />
              <span>Not allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-warning" />
              <span>Sensitive · logged, needs PIN</span>
            </div>
          </div>

          {changedKeys.length > 0 && (
            <Badge className="rounded-full bg-surface-brand text-primary border-0 px-3 py-1 text-[11px] font-bold tnum">
              {changedKeys.length} unsaved{" "}
              {changedKeys.length === 1 ? "change" : "changes"}
            </Badge>
          )}
        </div>

        <div className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="p-5 flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-[8px]" />
              ))}
            </div>
          ) : (
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
                  <th className="py-3 pl-5 pr-3 w-24">Area</th>
                  <th className="py-3 px-3 min-w-[260px]">Capability</th>
                  {roleColumns.map((col) => (
                    <th
                      key={col.id}
                      className="py-3 px-2 text-center font-bold text-text normal-case text-[12px] tracking-normal"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {capabilities.map((cap, idx) => {
                  const showArea =
                    idx === 0 || capabilities[idx - 1].area !== cap.area;
                  return (
                    <tr
                      key={cap.id}
                      className="bg-white hover:bg-background-subtle/70 transition-colors"
                    >
                      <td className="py-3 pl-5 pr-3 text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted align-middle">
                        {showArea ? cap.area : ""}
                      </td>
                      <td className="py-3 px-3 align-middle">
                        <div className="flex items-center gap-2">
                          {cap.sensitive && (
                            <span
                              title="Sensitive · logged, needs PIN"
                              className="h-4 w-1 rounded-full bg-warning shrink-0"
                            />
                          )}
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span
                              className={cn(
                                "text-[13px] text-text",
                                cap.sensitive ? "font-bold" : "font-medium",
                              )}
                            >
                              {cap.label}
                            </span>
                            {cap.subtitle && (
                              <span className="text-[11px] text-text-muted">
                                {cap.subtitle}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {roleColumns.map((col) => {
                        const level = cap.levelsByRole[col.id] ?? "none";
                        const isChanged = changedKeys.includes(
                          `${cap.id}:${col.id}`,
                        );
                        return (
                          <td key={col.id} className="py-3 px-2 text-center">
                            <button
                              type="button"
                              aria-label={`${cap.label} for ${col.label}: ${level}`}
                              onClick={() => handleCycleCell(cap.id, col.id)}
                              className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                              <PermissionCellIcon
                                level={level}
                                isChanged={isChanged}
                              />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border bg-white flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
            <BruviIcon name="time" size={14} />
            <span>Change log</span>
          </div>
          {changeLog.length === 0 ? (
            <span className="text-[12px] text-text-muted">
              No permission changes recorded yet.
            </span>
          ) : (
            <div className="flex flex-col gap-1.5 text-[12px]">
              {changeLog.map((entry) => (
                <div key={entry.id} className="flex flex-wrap items-center gap-4">
                  <span className="w-32 text-text-muted tnum shrink-0">
                    {entry.timestamp}
                  </span>
                  <span className="text-text-secondary">
                    {entry.actor} · {entry.summary}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
