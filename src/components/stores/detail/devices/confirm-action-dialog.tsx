"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmActionDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2340]/56 p-4"
    >
      <div className="w-full max-w-[420px] rounded-[24px] bg-surface shadow-overlay border border-border overflow-hidden animate-alert-in">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-[12px] flex items-center justify-center shrink-0",
                  destructive
                    ? "bg-error-surface text-error"
                    : "bg-warning-surface text-warning"
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3
                id="confirm-action-dialog-title"
                className="text-heading-s text-text"
              >
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close dialog"
              className="h-8 w-8 rounded-[8px] flex items-center justify-center text-text-muted hover:bg-gray-50 hover:text-text cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-body-s text-text-muted">{description}</p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-4 rounded-[12px] border border-border-input bg-surface text-label text-text hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                "h-10 px-5 rounded-[12px] text-label font-bold text-white transition-colors cursor-pointer",
                destructive
                  ? "bg-error hover:bg-error/90"
                  : "bg-primary hover:bg-navy-900"
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
