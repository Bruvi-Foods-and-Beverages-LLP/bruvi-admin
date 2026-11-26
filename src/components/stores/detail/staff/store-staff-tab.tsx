"use client";

import * as React from "react";
import { CheckCircle2, KeyRound, Plus, ShieldCheck, Trash2, Unlock, Users, X } from "lucide-react";
import { StoreEntity } from "@/store/slices/stores-slice";
import { ConfirmActionDialog } from "../devices/confirm-action-dialog";
import { cn } from "@/lib/utils/cn";

export interface StoreStaffMember {
  id: string;
  userId: string;
  displayName: string;
  roleLabel: string;
  role: string;
  email: string | null;
  phoneNumber: string | null;
  hasPin: boolean;
  canUnlockStations: boolean;
  isOnShift: boolean;
  isPinLocked: boolean;
  failedAttempts: number;
}

interface StoreStaffTabProps {
  store: StoreEntity;
}

async function staffRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (json && typeof json.message === "string" && json.message) ||
        `Request failed (${res.status})`
    );
  }
  return (json && "data" in json ? json.data : json) as T;
}

export function StoreStaffTab({ store }: StoreStaffTabProps) {
  const storeKey = store.code || store.id;
  const [staff, setStaff] = React.useState<StoreStaffMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [banner, setBanner] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState(false);

  // Add staff form
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"BARISTA" | "CASHIER" | "SHIFT_LEAD" | "STORE_MANAGER">("BARISTA");
  const [roleLabel, setRoleLabel] = React.useState("Barista · Bar 1");
  const [pin, setPin] = React.useState("");
  const [canUnlockStations, setCanUnlockStations] = React.useState(false);

  // Inline PIN reset
  const [resettingId, setResettingId] = React.useState<string | null>(null);
  const [newPin, setNewPin] = React.useState("");
  const [pendingConfirm, setPendingConfirm] = React.useState<{
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const loadStaff = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await staffRequest<{ staff: StoreStaffMember[] }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff`
      );
      setStaff(res.staff ?? []);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to load store staff");
    } finally {
      setIsLoading(false);
    }
  }, [storeKey]);

  React.useEffect(() => {
    if (storeKey) void loadStaff();
  }, [storeKey, loadStaff]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await staffRequest<{ member: StoreStaffMember; message: string }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff`,
        {
          method: "POST",
          body: JSON.stringify({
            fullName,
            email: email || undefined,
            role,
            roleLabel,
            pin,
            canUnlockStations,
          }),
        }
      );
      setStaff((prev) => [...prev.filter((m) => m.id !== res.member.id), res.member]);
      setBanner(res.message);
      setFullName("");
      setEmail("");
      setPin("");
      setIsAdding(false);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to add staff member");
    }
  };

  const handleResetPin = async (staffId: string) => {
    if (!/^\d{4}$/.test(newPin)) {
      setBanner("PIN must be exactly 4 digits.");
      return;
    }
    try {
      const res = await staffRequest<{ member: StoreStaffMember; message: string }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff/${encodeURIComponent(staffId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ pin: newPin }),
        }
      );
      setStaff((prev) => prev.map((m) => (m.id === staffId ? res.member : m)));
      setBanner(`Updated KDS PIN for ${res.member.displayName}.`);
      setResettingId(null);
      setNewPin("");
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to update PIN");
    }
  };

  const handleToggleShift = async (member: StoreStaffMember) => {
    try {
      const res = await staffRequest<{ member: StoreStaffMember; message: string }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff/${encodeURIComponent(member.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isOnShift: !member.isOnShift }),
        }
      );
      setStaff((prev) => prev.map((m) => (m.id === member.id ? res.member : m)));
      setBanner(res.message);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to update shift");
    }
  };

  const handleUnlock = async (staffId: string) => {
    try {
      const res = await staffRequest<{ member: StoreStaffMember; message: string }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff/${encodeURIComponent(staffId)}/unlock`,
        { method: "POST" }
      );
      setStaff((prev) => prev.map((m) => (m.id === staffId ? res.member : m)));
      setBanner(res.message);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to unlock PIN");
    }
  };

  const handleRemove = async (staffId: string) => {
    try {
      const res = await staffRequest<{ removedId: string; message: string }>(
        `/api/proxy/v1/admin/outlets/${encodeURIComponent(storeKey)}/staff/${encodeURIComponent(staffId)}`,
        { method: "DELETE" }
      );
      setStaff((prev) => prev.filter((m) => m.id !== res.removedId));
      setBanner(res.message);
    } catch (err) {
      setBanner(err instanceof Error ? err.message : "Failed to remove staff");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-8 text-body-s text-text-muted">
        Loading store staff…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {banner && (
        <div className="rounded-[12px] border border-success/30 bg-success-surface px-4 py-3 flex items-center justify-between gap-3 text-body-s font-semibold text-success animate-alert-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{banner}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner(null)}
            className="text-success hover:text-text cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-[16px] border border-border bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h3 className="text-heading-s text-text">Store staff & KDS PINs</h3>
            <p className="text-caption text-text-muted mt-0.5">
              {staff.filter((s) => s.isOnShift).length} on shift · {staff.length} assigned to{" "}
              {store.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding((v) => !v)}
            className="h-9 px-4 rounded-[10px] bg-primary hover:bg-navy-900 text-label font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add staff member</span>
          </button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleAddStaff}
            className="p-6 border-b border-border bg-gray-50/60 grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
          >
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-bold text-text">Full name</span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Arjun S."
                className="h-10 rounded-[10px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">Role</span>
              <select
                value={role}
                onChange={(e) => {
                  const next = e.target.value as typeof role;
                  setRole(next);
                  setCanUnlockStations(next === "SHIFT_LEAD" || next === "STORE_MANAGER");
                }}
                className="h-10 rounded-[10px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
              >
                <option value="BARISTA">Barista</option>
                <option value="CASHIER">Cashier</option>
                <option value="SHIFT_LEAD">Shift lead</option>
                <option value="STORE_MANAGER">Store manager</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-bold text-text">Station / Role label</span>
              <input
                type="text"
                required
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
                placeholder="Barista · Bar 1"
                className="h-10 rounded-[10px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">4-digit PIN</span>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234"
                className="h-10 rounded-[10px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-caption-bold text-text">Email (optional)</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@bruvi.coffee"
                className="h-10 rounded-[10px] border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-2 h-10 md:col-span-2 text-body-s text-text cursor-pointer">
              <input
                type="checkbox"
                checked={canUnlockStations}
                onChange={(e) => setCanUnlockStations(e.target.checked)}
                className="h-4 w-4 rounded border-border-input"
              />
              <span>Can unlock locked KDS PINs</span>
            </label>
            <div className="flex items-center justify-end gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="h-10 px-4 rounded-[10px] border border-border-input bg-surface text-label text-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-5 rounded-[10px] bg-primary hover:bg-navy-900 text-label font-bold text-white cursor-pointer"
              >
                Save staff
              </button>
            </div>
          </form>
        )}

        {staff.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-12 w-12 rounded-[14px] bg-gray-50 border border-border flex items-center justify-center text-text-muted">
              <Users className="h-6 w-6" />
            </div>
            <div className="max-w-[380px]">
              <h4 className="text-heading-s text-text">Assign your first team member</h4>
              <p className="text-body-s text-text-muted mt-1">
                Add baristas, kitchen staff, and shift leads with 4-digit PINs so they can sign in on paired KDS displays.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="h-10 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label font-bold text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add first staff member</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-caption-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-4">Role / Station</th>
                  <th className="py-3 px-4">KDS PIN</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-body-s font-bold text-text">
                          {member.displayName}
                        </span>
                        {member.canUnlockStations && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-brand text-primary text-caption-bold">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Lead</span>
                          </span>
                        )}
                      </div>
                      {member.email && (
                        <div className="text-caption text-text-muted">{member.email}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-body-s text-text">
                      {member.roleLabel}
                    </td>
                    <td className="py-3.5 px-4">
                      {member.isPinLocked ? (
                        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-error-surface text-error text-caption-bold">
                          Locked ({member.failedAttempts} tries)
                        </span>
                      ) : member.hasPin ? (
                        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-success-surface text-success text-caption-bold">
                          4-digit PIN set
                        </span>
                      ) : (
                        <span className="text-caption text-warning">No PIN set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleShift(member)}
                        className={cn(
                          "h-6 px-2.5 rounded-full text-caption-bold cursor-pointer",
                          member.isOnShift
                            ? "bg-success-surface text-success"
                            : "bg-gray-100 text-text-muted"
                        )}
                      >
                        {member.isOnShift ? "On shift" : "Off shift"}
                      </button>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {resettingId === member.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="password"
                              inputMode="numeric"
                              maxLength={4}
                              value={newPin}
                              onChange={(e) =>
                                setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                              }
                              placeholder="4 digits"
                              autoFocus
                              className="h-8 w-24 rounded-[8px] border border-primary bg-surface px-2 text-caption text-text focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleResetPin(member.id)}
                              className="h-8 px-3 rounded-[8px] bg-primary text-caption-bold text-white cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setResettingId(null);
                                setNewPin("");
                              }}
                              className="h-8 px-2.5 rounded-[8px] border border-border-input text-caption text-text-muted cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setResettingId(member.id);
                              setNewPin("");
                            }}
                            className="h-8 px-3 rounded-[8px] border border-border-input bg-surface text-caption-bold text-text hover:bg-gray-50 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <KeyRound className="h-3 w-3" />
                            <span>Set PIN</span>
                          </button>
                        )}
                        {member.isPinLocked && (
                          <button
                            type="button"
                            onClick={() => handleUnlock(member.id)}
                            className="h-8 px-3 rounded-[8px] border border-border-input bg-surface text-caption-bold text-primary hover:bg-gray-50 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Unlock className="h-3 w-3" />
                            <span>Unlock</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirm({
                              title: `Remove ${member.displayName}?`,
                              description:
                                "They will no longer appear on paired KDS displays for this store.",
                              confirmLabel: "Remove staff",
                              destructive: true,
                              onConfirm: () => {
                                void handleRemove(member.id);
                                setPendingConfirm(null);
                              },
                            })
                          }
                          className="h-8 px-2.5 rounded-[8px] border border-border-input bg-surface text-caption-bold text-error hover:bg-error-surface inline-flex items-center gap-1 cursor-pointer"
                          aria-label={`Remove ${member.displayName}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmActionDialog
        open={pendingConfirm !== null}
        title={pendingConfirm?.title ?? ""}
        description={pendingConfirm?.description ?? ""}
        confirmLabel={pendingConfirm?.confirmLabel ?? "Confirm"}
        destructive={pendingConfirm?.destructive}
        onConfirm={() => pendingConfirm?.onConfirm()}
        onCancel={() => setPendingConfirm(null)}
      />
    </div>
  );
}
