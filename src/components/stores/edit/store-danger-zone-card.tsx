"use client";

import * as React from "react";
import { StoreEntity } from "@/store/slices/stores-slice";
import { Loader2, AlertTriangle } from "lucide-react";
import { RbacGuard } from "@/components/auth/rbac-guard";
import { cn } from "@/lib/utils/cn";

interface StoreDangerZoneCardProps {
  store: StoreEntity;
  onToggleStatus: () => Promise<void> | void;
  onArchiveStore: () => Promise<void> | void;
  isTogglingStatus?: boolean;
  isArchiving?: boolean;
}

export function StoreDangerZoneCard({
  store,
  onToggleStatus,
  onArchiveStore,
  isTogglingStatus = false,
  isArchiving = false,
}: StoreDangerZoneCardProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = React.useState(false);
  const isOpen = store.status === "Open" || store.status === "Busy mode" || store.isOpen;

  return (
    <>
      <div className="flex flex-col rounded-[16px] bg-surface border border-error overflow-hidden shadow-sm">
        {/* Header (Figma Node 225:87496) */}
        <div className="flex flex-col gap-1 p-5 pb-4">
          <h3 className="text-title text-error">
            Danger zone
          </h3>
          <p className="text-caption text-text-muted">
            These actions affect customers immediately.
          </p>
        </div>

        {/* Actions List (Figma Nodes 225:87499 - 225:87510) */}
        <div className="divide-y divide-border border-t border-border">
          {/* Action 1: Temporarily close store / Reopen */}
          <div className="flex items-center justify-between gap-4 p-5 py-4">
            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
              <span className="text-body-s font-bold text-text">
                {isOpen ? "Temporarily close store" : "Reopen store"}
              </span>
              <p className="text-caption text-text-muted leading-tight">
                {isOpen
                  ? "Hides it in the app and stops all channels until you reopen."
                  : "Makes store active on customer apps and resumes dispatch."}
              </p>
            </div>

            <button
              type="button"
              disabled={isTogglingStatus}
              onClick={onToggleStatus}
              className={cn(
                "flex h-9 px-4 shrink-0 items-center justify-center rounded-[12px] border-[1.5px] text-label transition-all cursor-pointer shadow-2xs",
                isOpen
                  ? "border-error text-error hover:bg-error-surface"
                  : "border-success text-success hover:bg-success-surface",
                isTogglingStatus && "opacity-60 cursor-not-allowed"
              )}
            >
              {isTogglingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isOpen ? (
                "Close"
              ) : (
                "Reopen"
              )}
            </button>
          </div>

          {/* Action 2: Archive store (Super Admin Only) */}
          <RbacGuard roles={["SUPER_ADMIN"]}>
            <div className="flex items-center justify-between gap-4 p-5 py-4">
              <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                <span className="text-body-s font-bold text-text">
                  Archive store
                </span>
                <p className="text-caption text-text-muted leading-tight">
                  Unpairs devices and removes staff access. Sales history is kept.
                </p>
              </div>

              <button
                type="button"
                disabled={isArchiving}
                onClick={() => setShowArchiveConfirm(true)}
                className="flex h-9 px-4 shrink-0 items-center justify-center rounded-[12px] bg-error hover:bg-[#a5281f] text-label text-white transition-all cursor-pointer shadow-2xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isArchiving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Archive"
                )}
              </button>
            </div>
          </RbacGuard>
        </div>
      </div>

      {/* Confirmation Modal for Archiving Store */}
      {showArchiveConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-md bg-surface rounded-[20px] shadow-2xl border border-border p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-error-surface text-error">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-title text-text font-bold">
                  Archive {store.name}?
                </h4>
                <p className="text-body-s text-text-muted">
                  Are you sure you want to archive this store? All dispatch channels will be disabled, POS terminals will be unpaired, and the store will be removed from customer apps.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(false)}
                className="h-10 px-4 rounded-[12px] border border-border bg-surface text-label text-text hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowArchiveConfirm(false);
                  await onArchiveStore();
                }}
                className="h-10 px-5 rounded-[12px] bg-error hover:bg-[#a5281f] text-label text-white transition-colors cursor-pointer shadow-2xs"
              >
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

