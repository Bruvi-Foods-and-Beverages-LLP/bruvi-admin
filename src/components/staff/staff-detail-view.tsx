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
import { StaffApi, StaffRoleApiRow } from "@/lib/api/staff";
import { cn } from "@/lib/utils/cn";

type DetailTab = "overview" | "schedule" | "access";

interface LiveStaffDetail {
  id: string;
  empCode: string;
  name: string;
  initials: string;
  roleId: string | null;
  roleName: string;
  homeStore: { id: string; code: string; name: string } | null;
  employmentStatus: string;
  phoneMasked: string;
  joinedAt: string;
  access: Array<{
    id?: string;
    app_key: "STAFF_APP" | "POS" | "KDS" | "WAREHOUSE_APP" | "HQ_ADMIN";
    scope_label: string;
    is_granted: boolean;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    expires_at?: string | null;
    status: string;
  }>;
  documents: Array<{
    id: string;
    title: string;
    file_count: number;
    verified_by?: string | null;
  }>;
  notes: Array<{
    id: string;
    author_name: string;
    author_role: string;
    body: string;
    created_at: string;
  }>;
  upcomingShifts: Array<{
    id: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    station_kind: string;
    status: string;
  }>;
}

const DEFAULT_APPS: Array<{
  app_key: "STAFF_APP" | "KDS" | "POS";
  label: string;
  defaultScope: string;
  icon: "phone" | "monitor" | "card";
}> = [
  { app_key: "STAFF_APP", label: "Staff app", defaultScope: "clock-in, rota, checklists", icon: "phone" },
  { app_key: "KDS", label: "KDS", defaultScope: "store kitchen display", icon: "monitor" },
  { app_key: "POS", label: "POS", defaultScope: "cash drawer", icon: "card" },
];

export function StaffDetailView({ staffId }: { staffId: string }) {
  const [detail, setDetail] = React.useState<LiveStaffDetail | null>(null);
  const [rolesList, setRolesList] = React.useState<StaffRoleApiRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<DetailTab>("overview");
  const [editingAccess, setEditingAccess] = React.useState(false);
  const [addingNote, setAddingNote] = React.useState(false);
  const [noteInput, setNoteInput] = React.useState("");
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRoleId, setEditRoleId] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<"ACTIVE" | "ON_LEAVE" | "INVITED" | "DEACTIVATED">("ACTIVE");
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const loadDetail = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [res, rolesRes] = await Promise.all([
        StaffApi.getStaffDetail(staffId),
        StaffApi.listRoles().catch(() => ({ roles: [] })),
      ]);
      const name = res.name || "Staff Member";
      const initials =
        String(name)
          .split(/\s+/)
          .map((p: string) => p[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || "ST";

      setDetail({ ...res, initials });
      setRolesList(rolesRes.roles ?? []);
      setEditRoleId(res.roleId ?? "");
      setEditStatus((res.employmentStatus as any) ?? "ACTIVE");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load staff member",
      );
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [staffId]);

  React.useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleToggleAccess = async (
    appKey: "STAFF_APP" | "KDS" | "POS",
    nextVal: boolean,
  ) => {
    if (!detail) return;
    setDetail((prev) => {
      if (!prev) return prev;
      const exists = prev.access.some((a) => a.app_key === appKey);
      const nextAccess = exists
        ? prev.access.map((a) =>
            a.app_key === appKey ? { ...a, is_granted: nextVal } : a,
          )
        : [
            ...prev.access,
            { app_key: appKey, scope_label: "", is_granted: nextVal },
          ];
      return { ...prev, access: nextAccess };
    });

    try {
      await StaffApi.updateStaffAccess(detail.id, { appKey, isGranted: nextVal });
      showToast(`Updated ${appKey} access`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update access");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !noteInput.trim()) return;
    try {
      const saved = await StaffApi.addStaffNote(detail.id, noteInput.trim());
      setDetail((prev) =>
        prev ? { ...prev, notes: [saved, ...prev.notes] } : prev,
      );
      setNoteInput("");
      setAddingNote(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to save note");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    try {
      await StaffApi.updateStaffProfile(detail.id, {
        roleId: editRoleId || undefined,
        employmentStatus: editStatus,
      });
      setEditOpen(false);
      showToast(`Updated profile for ${detail.name}`);
      await loadDetail();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
        <Skeleton className="h-12 w-72 rounded-[12px]" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <Skeleton className="h-64 w-full rounded-[16px]" />
          <Skeleton className="h-64 w-full rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (errorMsg || !detail) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[1136px] mx-auto pb-10">
        <Link href="/staff" className="text-[13px] font-bold text-primary hover:underline">
          ← Back to Staff
        </Link>
        <Card className="rounded-[16px] p-6 text-center flex flex-col items-center gap-3">
          <p className="text-[14px] font-semibold text-error">
            {errorMsg ?? "Staff member not found"}
          </p>
          <Button type="button" variant="workspace" size="sm" onClick={() => void loadDetail()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-muted">
          <Link href="/staff" className="hover:text-text">Staff</Link>
          <span>/</span>
          <Link href="/staff" className="hover:text-text">People</Link>
          <span>/</span>
          <span className="text-text-secondary">{detail.homeStore?.name ?? "Unassigned"}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-wrap">
            <StaffAvatar initials={detail.initials} size="lg" />
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px]">
                {detail.name}
              </h1>
              <Badge className="rounded-full bg-info-surface text-info border-0 px-2.5 py-0.5 text-[11px] font-bold">
                {detail.employmentStatus}
              </Badge>
              <span className="text-[13px] text-text-muted font-medium tnum">
                {detail.roleName} · {detail.homeStore?.name ?? "Unassigned"} · {detail.empCode}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            size="compact"
            onClick={() => setEditOpen(true)}
          >
            Edit profile
          </Button>
        </div>
      </div>

      <nav className="w-full flex items-end gap-6 border-b border-border">
        {[
          { id: "overview" as const, label: "Overview" },
          { id: "schedule" as const, label: "Schedule" },
          { id: "access" as const, label: "Access & documents" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "h-9 flex items-center pb-2 text-label whitespace-nowrap border-b-2 -mb-px cursor-pointer",
              activeTab === tab.id
                ? "border-primary text-text font-bold"
                : "border-transparent text-text-muted font-semibold hover:text-text",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="flex flex-col gap-5 min-w-0">
          {(activeTab === "overview" || activeTab === "schedule") && (
            <Card className="rounded-[16px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-title font-sans font-bold text-text">
                  Upcoming shifts
                </h2>
                <Link href="/staff/shifts" className="text-[12px] font-bold text-primary hover:underline">
                  Open rota →
                </Link>
              </div>
              {detail.upcomingShifts.length === 0 ? (
                <p className="text-[13px] text-text-muted">No upcoming shifts scheduled.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {detail.upcomingShifts.map((s) => (
                    <div key={s.id} className="rounded-[10px] p-2.5 border border-sky-300/60 bg-surface-brand/70 text-[11px]">
                      <div className="font-bold text-text tnum">{s.shift_date}</div>
                      <div className="text-text-secondary tnum">
                        {String(s.start_time).slice(0, 5)}–{String(s.end_time).slice(0, 5)}
                      </div>
                      <div className="font-medium text-primary mt-1">{s.station_kind}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card className="rounded-[16px] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-title font-sans font-bold text-text">Notes</h2>
              <button
                type="button"
                onClick={() => setAddingNote((v) => !v)}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                + Add note
              </button>
            </div>

            {addingNote && (
              <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                <textarea
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Write a manager note..."
                  className="w-full rounded-[10px] border border-border-input p-3 text-[13px] text-text outline-none focus:border-focus"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="workspace" size="sm" onClick={() => setAddingNote(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm">
                    Save note
                  </Button>
                </div>
              </form>
            )}

            {detail.notes.length === 0 ? (
              <p className="text-[13px] text-text-muted">No manager notes recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {detail.notes.map((note) => (
                  <div key={note.id} className="flex items-start gap-3">
                    <StaffAvatar initials={note.author_name.slice(0, 2).toUpperCase()} size="sm" />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] leading-5 text-text">{note.body}</p>
                      <span className="text-[11px] text-text-muted">
                        {note.author_name} · {note.author_role} ·{" "}
                        {new Date(note.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="rounded-[16px] p-5 flex flex-col gap-3.5">
            <h2 className="text-title font-sans font-bold text-text">Profile</h2>
            <dl className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-muted">Role</dt>
                <dd className="font-bold text-text">{detail.roleName}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-muted">Home store</dt>
                <dd className="font-bold text-text">
                  {detail.homeStore ? `${detail.homeStore.name} · ${detail.homeStore.code}` : "Unassigned"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-muted">Joined</dt>
                <dd className="font-bold text-text tnum">
                  {new Date(detail.joinedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-muted">Phone</dt>
                <dd className="font-bold text-text tnum">{detail.phoneMasked}</dd>
              </div>
            </dl>
          </Card>

          <Card className="rounded-[16px] p-5 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-title font-sans font-bold text-text">Access</h2>
              <button
                type="button"
                onClick={() => setEditingAccess((v) => !v)}
                className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                {editingAccess ? "Done" : "Edit"}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {DEFAULT_APPS.map((app) => {
                const found = detail.access.find((a) => a.app_key === app.app_key);
                const granted = Boolean(found?.is_granted);
                return (
                  <div key={app.app_key} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BruviIcon name={app.icon} size="inline" className="text-text-muted shrink-0" />
                      <span className="text-[13px] font-bold text-text truncate">
                        {app.label} ·{" "}
                        <span className="font-normal text-text-muted">
                          {found?.scope_label || app.defaultScope}
                        </span>
                      </span>
                    </div>
                    {editingAccess ? (
                      <Switch
                        checked={granted}
                        onCheckedChange={(checked) =>
                          void handleToggleAccess(app.app_key, checked)
                        }
                      />
                    ) : (
                      <Badge
                        className={cn(
                          "rounded-full border-0 px-2.5 py-0.5 text-[11px] font-bold shrink-0",
                          granted ? "bg-success-surface text-success" : "bg-error-surface text-error",
                        )}
                      >
                        {granted ? "Granted" : "No access"}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-[16px] p-5 flex flex-col gap-3.5">
            <h2 className="text-title font-sans font-bold text-text">
              Certifications &amp; documents
            </h2>
            {detail.certifications.length === 0 && detail.documents.length === 0 ? (
              <p className="text-[12px] text-text-muted">No certifications or documents uploaded.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {detail.certifications.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <BruviIcon name="rewards" size="inline" className="text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-text">{c.title}</span>
                      <span className="text-[11px] text-text-muted">
                        Status: {c.status} {c.expires_at ? `· exp ${c.expires_at}` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-[2px] p-4">
          <Card variant="modal" className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-s font-sans font-bold text-text">
                Edit profile · {detail.name}
              </h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="h-8 w-8 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-background-subtle cursor-pointer"
              >
                <BruviIcon name="close" size="inline" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Role</label>
                <select
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(e.target.value)}
                  className="h-10 px-3 rounded-[10px] border-[1.5px] border-border-strong bg-white text-[13px] text-text outline-none focus:border-focus"
                >
                  {rolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Employment status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="h-10 px-3 rounded-[10px] border-[1.5px] border-border-strong bg-white text-[13px] text-text outline-none focus:border-focus"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On leave</option>
                  <option value="INVITED">Invited</option>
                  <option value="DEACTIVATED">Deactivated</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="workspace" size="compact" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="compact">
                  Save changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
