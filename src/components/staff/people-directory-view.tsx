"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BruviIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffAvatar } from "@/components/staff/staff-avatar";
import {
  StaffModuleHeader,
  StaffTabBar,
} from "@/components/staff/staff-header-and-tabs";
import { StaffKpiStrip } from "@/components/staff/staff-kpi-strip";
import { StaffApi, StaffRoleApiRow } from "@/lib/api/staff";
import { StaffMember, StaffStatus } from "@/types/staff";
import { cn } from "@/lib/utils/cn";

const STATUS_BADGE: Record<StaffStatus, { label: string; className: string }> = {
  ON_SHIFT: { label: "On shift", className: "bg-success-surface text-success" },
  OFF: { label: "Off", className: "bg-gray-100 text-text-secondary" },
  LEAVE: { label: "Leave", className: "bg-warning-surface text-warning" },
  INVITED: { label: "Invited", className: "bg-info-surface text-info" },
};

export function PeopleDirectoryView() {
  const router = useRouter();
  const [members, setMembers] = React.useState<StaffMember[]>([]);
  const [rolesList, setRolesList] = React.useState<StaffRoleApiRow[]>([]);
  const [kpis, setKpis] = React.useState({
    onShiftNow: 0,
    totalStaff: 0,
    openShifts: 0,
    certificationsExpiring: 0,
    onLeave: 0,
    invited: 0,
  });
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [storeFilter, setStoreFilter] = React.useState("ALL");
  const [roleFilter, setRoleFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [certExpiringOnly, setCertExpiringOnly] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(1);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const [inviteName, setInviteName] = React.useState("");
  const [invitePhone, setInvitePhone] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteStore, setInviteStore] = React.useState("BLR-IND");
  const [inviteRole, setInviteRole] = React.useState("barista");
  const [invitePin, setInvitePin] = React.useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  React.useEffect(() => {
    StaffApi.listRoles()
      .then((res) => {
        if (res?.roles) setRolesList(res.roles);
      })
      .catch(() => {});
  }, []);

  const loadDirectory = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await StaffApi.listStaff({
        search: search || undefined,
        store: storeFilter !== "ALL" ? storeFilter : undefined,
        roleId: roleFilter !== "ALL" ? roleFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        certExpiring: certExpiringOnly || undefined,
        page,
        limit: 25,
      });

      setMembers(
        (res.staff ?? []).map((s) => ({
          id: s.id,
          empCode: s.empCode,
          name: s.name,
          initials:
            s.name
              .split(/\s+/)
              .map((p) => p[0]?.toUpperCase() ?? "")
              .join("")
              .slice(0, 2) || "ST",
          avatarTone: "sky",
          roleId: s.roleId,
          roleName: s.roleName,
          storeId: s.storeId ?? "unassigned",
          storeName: s.storeName,
          status: s.status,
          statusMeta: s.empCode,
          phoneMasked: s.phoneMasked,
          certifications: (s.certifications ?? []).map((c) => ({
            id: c.id,
            label: c.label,
            status: c.status,
          })),
          joinedLabel: s.joinedAt
            ? new Date(s.joinedAt).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })
            : "—",
          isPendingOnboarding: s.status === "INVITED",
        })),
      );
      setKpis(res.kpis);
      setTotalCount(res.total);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to load staff directory",
      );
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, storeFilter, roleFilter, statusFilter, certExpiringOnly, page]);

  React.useEffect(() => {
    void loadDirectory();
  }, [loadDirectory]);

  const stores = React.useMemo(
    () => Array.from(new Set(members.map((m) => m.storeName).filter((s) => s !== "Unassigned"))),
    [members],
  );

  const allSelected =
    members.length > 0 && members.every((m) => selectedIds.includes(m.id));

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : members.map((m) => m.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setStoreFilter("ALL");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setCertExpiringOnly(false);
    setPage(1);
  };

  const handleExportCsv = () => {
    window.open(StaffApi.getExportUrl(), "_blank");
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const created = await StaffApi.inviteStaff({
        fullName: inviteName.trim(),
        phoneNumber: invitePhone.trim() || undefined,
        email: inviteEmail.trim() || undefined,
        storeIdOrCode: inviteStore,
        roleId: inviteRole,
        pin: invitePin.trim() || undefined,
      });
      setInviteName("");
      setInvitePhone("");
      setInviteEmail("");
      setInvitePin("");
      setInviteOpen(false);
      showToast(`Invite sent to ${created.fullName} (${created.empCode})`);
      await loadDirectory();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;
    try {
      await StaffApi.bulkAction({ userIds: selectedIds, action: "DEACTIVATE" });
      showToast(`Deactivated ${selectedIds.length} staff member(s)`);
      setSelectedIds([]);
      await loadDirectory();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Bulk update failed");
    }
  };

  const pageStart = totalCount === 0 ? 0 : (page - 1) * 25 + 1;
  const pageEnd = Math.min(page * 25, totalCount);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-10">
      <StaffModuleHeader
        overline="Staff / People"
        title="Staff"
        actions={
          <>
            <Button
              type="button"
              variant="workspace"
              size="compact"
              onClick={handleExportCsv}
              className="gap-1.5"
            >
              <BruviIcon name="download" size="inline" className="text-text-muted" />
              <span>Export</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="compact"
              onClick={() => setInviteOpen(true)}
              className="gap-1.5"
            >
              <span>Invite staff</span>
            </Button>
          </>
        }
      />

      <StaffTabBar active="people" />

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
        <div className="rounded-[12px] border border-error/30 bg-error-surface px-4 py-3 text-[13px] text-error flex items-center justify-between gap-3">
          <span>{errorMsg}</span>
          <Button
            type="button"
            variant="workspace"
            size="sm"
            onClick={() => void loadDirectory()}
          >
            Retry
          </Button>
        </div>
      )}

      <StaffKpiStrip
        onShiftCount={kpis.onShiftNow}
        totalStaff={kpis.totalStaff}
        storesCount={Math.max(stores.length, 1)}
        openShiftsCount={kpis.openShifts}
        openShiftsStores="Live across network"
        expiringCertsCount={kpis.certificationsExpiring}
        expiringCertsDetail="Within 30 days"
        onLeaveCount={kpis.onLeave}
        invitedCount={kpis.invited}
      />

      <Card className="rounded-[16px] border border-border bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Filter Toolbar */}
        <div className="px-4 py-3.5 border-b border-border flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[220px]">
            <BruviIcon
              name="search"
              size="inline"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, phone or staff ID"
              className="w-full h-9 pl-9 pr-3 rounded-[10px] bg-background-subtle border border-transparent focus:border-focus focus:bg-white text-[13px] text-text placeholder:text-gray-400 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative inline-flex items-center">
              <select
                aria-label="Filter by store"
                value={storeFilter}
                onChange={(e) => {
                  setStoreFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 appearance-none pl-3 pr-7 rounded-[10px] border border-primary bg-surface-brand/40 text-[12px] font-bold text-text cursor-pointer outline-none"
              >
                <option value="ALL">Store: All</option>
                {stores.map((s) => (
                  <option key={s} value={s}>
                    Store: {s}
                  </option>
                ))}
              </select>
              <BruviIcon
                name="chevron-down"
                size={14}
                className="pointer-events-none absolute right-2 text-text-secondary"
              />
            </div>

            <div className="relative inline-flex items-center">
              <select
                aria-label="Filter by role"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 appearance-none pl-3 pr-7 rounded-[10px] border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer outline-none hover:bg-background-subtle"
              >
                <option value="ALL">Role: All</option>
                {rolesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <BruviIcon
                name="chevron-down"
                size={14}
                className="pointer-events-none absolute right-2 text-text-secondary"
              />
            </div>

            <div className="relative inline-flex items-center">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-9 appearance-none pl-3 pr-7 rounded-[10px] border border-border-input bg-white text-[12px] font-bold text-text cursor-pointer outline-none hover:bg-background-subtle"
              >
                <option value="ALL">Status: Any</option>
                <option value="ON_SHIFT">On shift</option>
                <option value="OFF">Off</option>
                <option value="LEAVE">Leave</option>
                <option value="INVITED">Invited</option>
              </select>
              <BruviIcon
                name="chevron-down"
                size={14}
                className="pointer-events-none absolute right-2 text-text-secondary"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setCertExpiringOnly((v) => !v);
                setPage(1);
              }}
              className={cn(
                "h-9 px-3 rounded-[10px] border text-[12px] font-bold cursor-pointer transition-colors",
                certExpiringOnly
                  ? "border-warning bg-warning-surface text-warning"
                  : "border-border-input bg-white text-text hover:bg-background-subtle",
              )}
            >
              Cert expiring
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="px-2 py-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
            >
              Clear
            </button>

            <span className="text-[12px] font-medium text-text-muted pl-1 tnum">
              {totalCount} people
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-white text-[11px] font-bold uppercase tracking-[0.06em] text-text-muted">
                <th className="w-12 py-3 pl-4 pr-2">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Store</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Certifications</th>
                <th className="py-3 px-3">Joined</th>
                <th className="w-10 py-3 pr-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={9} className="py-3.5 px-4">
                      <Skeleton className="h-9 w-full rounded-[8px]" />
                    </td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[14px] font-semibold text-text">
                        No staff members found
                      </span>
                      <span className="text-[12px] text-text-muted">
                        Invite staff members or adjust your filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isSelected = selectedIds.includes(member.id);
                  const badge = STATUS_BADGE[member.status];
                  return (
                    <tr
                      key={member.id}
                      onClick={() => router.push(`/staff/${member.id}`)}
                      className={cn(
                        "transition-colors cursor-pointer",
                        isSelected
                          ? "bg-surface-brand/70 hover:bg-surface-brand"
                          : "bg-white hover:bg-background-subtle",
                      )}
                    >
                      <td
                        className="py-3.5 pl-4 pr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(member.id)}
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <StaffAvatar initials={member.initials} tone={member.avatarTone} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-sans text-[13px] leading-5 font-bold text-text truncate">
                              {member.name}
                            </span>
                            <span className="font-sans text-[11px] leading-4 text-text-muted truncate tnum">
                              {member.statusMeta}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[13px] font-medium text-text">
                        {member.roleName}
                      </td>
                      <td className="py-3.5 px-3 text-[13px] text-text-secondary">
                        {member.storeName}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-bold border-0",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-[13px] text-text-secondary tnum whitespace-nowrap">
                        {member.phoneMasked}
                      </td>
                      <td className="py-3.5 px-3">
                        {member.isPendingOnboarding ? (
                          <span className="text-[12px] text-text-muted">
                            Pending onboarding
                          </span>
                        ) : member.certifications.length === 0 ? (
                          <span className="text-[12px] text-text-muted">—</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {member.certifications.map((cert) => (
                              <span
                                key={cert.id}
                                className={cn(
                                  "inline-flex items-center rounded-[6px] px-2 py-0.5 text-[11px] font-semibold",
                                  cert.status === "expiring"
                                    ? "bg-warning-surface text-warning"
                                    : "bg-gray-100 text-text-secondary",
                                )}
                              >
                                {cert.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[13px] text-text-muted tnum whitespace-nowrap">
                        {member.joinedLabel}
                      </td>
                      <td
                        className="py-3.5 pr-4 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label={`Actions for ${member.name}`}
                          onClick={() =>
                            setOpenMenuId((cur) =>
                              cur === member.id ? null : member.id,
                            )
                          }
                          className="h-8 w-8 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-gray-100 hover:text-text cursor-pointer"
                        >
                          <BruviIcon name="more-vertical" size="inline" />
                        </button>
                        {openMenuId === member.id && (
                          <div className="absolute right-4 top-11 z-20 w-44 rounded-[12px] border border-border bg-white shadow-floating py-1.5 text-[13px]">
                            <Link
                              href={`/staff/${member.id}`}
                              className="block px-3.5 py-2 font-semibold text-text hover:bg-background-subtle"
                            >
                              View profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push("/staff/shifts");
                              }}
                              className="w-full text-left px-3.5 py-2 font-medium text-text-secondary hover:bg-background-subtle cursor-pointer"
                            >
                              Assign shift
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[12px]">
            {selectedIds.length > 0 ? (
              <>
                <span className="font-bold text-text tnum">
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/staff/shifts")}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  Assign shift
                </button>
                <button
                  type="button"
                  onClick={() => void handleBulkDeactivate()}
                  className="font-bold text-error hover:underline cursor-pointer"
                >
                  Deactivate
                </button>
              </>
            ) : (
              <span className="text-text-muted">
                Select rows for bulk shift or status actions
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[12px] text-text-muted tnum">
            <span>
              {pageStart}–{pageEnd} of {totalCount}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:bg-background-subtle disabled:opacity-40 cursor-pointer"
              >
                <BruviIcon name="chevron-left" size={14} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={pageEnd >= totalCount}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 rounded-full border border-border bg-white flex items-center justify-center text-text-secondary hover:bg-background-subtle disabled:opacity-40 cursor-pointer"
              >
                <BruviIcon name="chevron" size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Invite Staff Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-[2px] p-4">
          <Card variant="modal" className="p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-heading-s font-sans font-bold text-text">
                  Invite staff member
                </h2>
                <p className="text-[13px] text-text-muted mt-0.5">
                  Creates staff profile, store assignment, and KDS PIN in Supabase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="h-8 w-8 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-background-subtle cursor-pointer"
              >
                <BruviIcon name="close" size="inline" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-text">Full name</label>
                <Input
                  inputSize="sm"
                  placeholder="e.g. Ananya Sharma"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-text">Phone number</label>
                  <Input
                    inputSize="sm"
                    placeholder="+919876543210"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-text">Email (optional)</label>
                  <Input
                    inputSize="sm"
                    type="email"
                    placeholder="name@bruvi.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-text">Home store</label>
                  <select
                    value={inviteStore}
                    onChange={(e) => setInviteStore(e.target.value)}
                    className="h-10 px-3 rounded-[10px] border-[1.5px] border-border-strong bg-white text-[13px] text-text outline-none focus:border-focus"
                  >
                    <option value="BLR-IND">Indiranagar (BLR-IND)</option>
                    <option value="BOM-BAN">Bandra (BOM-BAN)</option>
                    <option value="DEL-HKV">Hauz Khas (DEL-HKV)</option>
                    <option value="BLR-WHF">Whitefield (BLR-WHF)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-text">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
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
                  <label className="text-[12px] font-bold text-text">4-digit KDS PIN</label>
                  <Input
                    inputSize="sm"
                    maxLength={4}
                    placeholder="1234"
                    value={invitePin}
                    onChange={(e) => setInvitePin(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="workspace"
                  size="compact"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="compact" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send invite"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
