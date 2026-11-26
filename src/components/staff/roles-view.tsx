"use client";

import * as React from "react";
import Link from "next/link";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { StaffAvatar } from "@/components/staff/staff-avatar";
import {
  StaffModuleHeader,
  StaffTabBar,
} from "@/components/staff/staff-header-and-tabs";
import { StaffApi, StaffRoleApiRow } from "@/lib/api/staff";
import { StaffAppKey, StaffRole, StaffScope } from "@/types/staff";
import { cn } from "@/lib/utils/cn";

const ALL_APPS: StaffAppKey[] = [
  "Staff app",
  "POS",
  "KDS",
  "Warehouse app",
  "HQ Admin",
];

export function RolesView() {
  const [roles, setRoles] = React.useState<StaffRole[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [newRoleOpen, setNewRoleOpen] = React.useState(false);
  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRoleDesc, setNewRoleDesc] = React.useState("");
  const [newRoleScope, setNewRoleScope] = React.useState<StaffScope>("Store");
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const mapRow = (r: StaffRoleApiRow): StaffRole => ({
    id: r.id,
    name: r.name,
    description: r.description,
    scope: r.scope,
    defaultApps: (r.default_apps as StaffAppKey[]) ?? ["Staff app"],
    memberCount: 0,
    totalPermissionsCount: 12,
    keyPermissions: [],
    memberPreviews: [],
    membersSummary: `Scope: ${r.scope}`,
  });

  const loadRoles = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await StaffApi.listRoles();
      const mapped = (res.roles ?? []).map(mapRow);
      setRoles(mapped);
      if (mapped.length > 0 && !selectedId) {
        setSelectedId(mapped[0].id);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }, [selectedId]);

  React.useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const selectedRole =
    roles.find((r) => r.id === selectedId) ?? roles[0] ?? null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const toggleDefaultApp = async (role: StaffRole, app: StaffAppKey) => {
    const exists = role.defaultApps.includes(app);
    const nextApps = exists
      ? role.defaultApps.filter((a) => a !== app)
      : [...role.defaultApps, app];
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, defaultApps: nextApps } : r)),
    );
    try {
      await StaffApi.updateRole(role.id, { defaultApps: nextApps });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDuplicate = async (role: StaffRole) => {
    try {
      const created = await StaffApi.duplicateRole(role.id);
      setRoles((prev) => [...prev, mapRow(created)]);
      setSelectedId(created.id);
      showToast(`Duplicated role "${role.name}"`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to duplicate role");
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      const created = await StaffApi.createRole({
        name: newRoleName.trim(),
        description: newRoleDesc.trim() || "Custom operational role",
        scope: newRoleScope,
        defaultApps: newRoleScope === "HQ" ? ["HQ Admin"] : ["Staff app"],
      });
      setRoles((prev) => [...prev, mapRow(created)]);
      setSelectedId(created.id);
      setNewRoleName("");
      setNewRoleDesc("");
      setNewRoleOpen(false);
      showToast(`Created role "${created.name}"`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create role");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <StaffModuleHeader
        overline="Staff / Roles"
        title="Roles"
        actions={
          <>
            <Link href="/staff/permissions">
              <Button type="button" variant="workspace" size="compact">
                Compare roles
              </Button>
            </Link>
            <Button
              type="button"
              variant="default"
              size="compact"
              onClick={() => setNewRoleOpen(true)}
            >
              New role
            </Button>
          </>
        }
      />

      <StaffTabBar active="roles" />

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
          <Button type="button" variant="workspace" size="sm" onClick={() => void loadRoles()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <Card className="rounded-[16px] overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
                  <th className="py-3.5 pl-5 pr-3">Role · {roles.length}</th>
                  <th className="py-3.5 px-3">Scope</th>
                  <th className="py-3.5 px-3">Default apps</th>
                  <th className="py-3.5 px-3 text-right pr-5">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="p-4">
                        <Skeleton className="h-9 w-full rounded-[8px]" />
                      </td>
                    </tr>
                  ))
                ) : (
                  roles.map((role) => {
                    const isActive = selectedRole?.id === role.id;
                    return (
                      <tr
                        key={role.id}
                        onClick={() => setSelectedId(role.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isActive
                            ? "bg-surface-brand/70 border-l-2 border-l-primary"
                            : "bg-white hover:bg-background-subtle",
                        )}
                      >
                        <td className="py-3.5 pl-5 pr-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-bold text-text">
                              {role.name}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {role.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[12px] font-medium text-text-secondary">
                          {role.scope}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {role.defaultApps.map((app) => (
                              <span
                                key={app}
                                className="inline-flex items-center rounded-[6px] border border-border bg-background-subtle px-2 py-0.5 text-[11px] font-semibold text-text-secondary"
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pl-3 pr-5 text-right text-[12px] text-text-muted">
                          <BruviIcon name="chevron" size={14} className="inline text-text-muted" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedRole && (
          <Card className="rounded-[16px] p-5 flex flex-col gap-5 sticky top-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-overline text-text-muted uppercase">
                  {selectedRole.scope} ROLE
                </span>
                <h2 className="text-heading-m font-sans font-extrabold text-text mt-0.5">
                  {selectedRole.name}
                </h2>
                <p className="text-[12px] leading-5 text-text-muted mt-1">
                  {selectedRole.description}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close inspector"
                onClick={() => setSelectedId("")}
                className="h-7 w-7 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-background-subtle cursor-pointer"
              >
                <BruviIcon name="close" size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
                Default apps
              </span>
              <div className="flex flex-wrap gap-2">
                {ALL_APPS.map((app) => {
                  const enabled = selectedRole.defaultApps.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => void toggleDefaultApp(selectedRole, app)}
                      className={cn(
                        "h-8 px-3 rounded-[10px] border text-[12px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors",
                        enabled
                          ? "border-primary bg-surface-brand text-primary"
                          : "border-border bg-white text-text-muted hover:text-text",
                      )}
                    >
                      {enabled && <BruviIcon name="check" size={12} />}
                      <span>{app}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                type="button"
                variant="workspace"
                size="compact"
                onClick={() => void handleDuplicate(selectedRole)}
              >
                Duplicate
              </Button>
              <Link href="/staff/permissions" className="w-full">
                <Button type="button" variant="default" size="compact" className="w-full">
                  Edit permissions
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {newRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-[2px] p-4">
          <Card variant="modal" className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-s font-sans font-bold text-text">
                Create new role
              </h2>
              <button
                type="button"
                onClick={() => setNewRoleOpen(false)}
                className="h-8 w-8 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-background-subtle cursor-pointer"
              >
                <BruviIcon name="close" size="inline" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Role name</label>
                <Input
                  inputSize="sm"
                  placeholder="e.g. Roastery Lead"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Scope</label>
                <select
                  value={newRoleScope}
                  onChange={(e) => setNewRoleScope(e.target.value as StaffScope)}
                  className="h-10 px-3 rounded-[10px] border-[1.5px] border-border-strong bg-white text-[13px] text-text outline-none focus:border-focus"
                >
                  <option value="Store">Store</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="HQ">HQ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Description</label>
                <Input
                  inputSize="sm"
                  placeholder="Short summary of responsibilities"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="workspace"
                  size="compact"
                  onClick={() => setNewRoleOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="compact">
                  Create role
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
