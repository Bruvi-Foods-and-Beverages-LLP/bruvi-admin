"use client";

import { Loader2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { ProductStatus } from "@/types/catalog";

interface ActionBarProps {
  mode?: "create" | "edit";
  status?: ProductStatus;
  attention: string[];
  dirty: boolean;
  autosavedAt: string | null;
  isSubmitting: boolean;
  publishCount: number;
  primaryLabel?: string;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onPublish: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
}

/** Bottom action card — static at the end of the page, same pattern as Create store. */
export function ActionBar({
  mode = "create",
  status = "DRAFT",
  attention,
  dirty,
  autosavedAt,
  isSubmitting,
  publishCount,
  primaryLabel,
  onCancel,
  onSaveDraft,
  onPublish,
  onArchive,
  onRestore,
}: ActionBarProps) {
  const needsAttention = attention.length > 0;
  const isArchived = status === "ARCHIVED";

  return (
    <div className="mt-8 flex w-full flex-col items-stretch justify-between gap-4 rounded-[16px] border border-border bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-col gap-0.5" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full transition-colors",
              isArchived ? "bg-[#7F8CA0]" : needsAttention ? "bg-error" : "bg-success"
            )}
          />
          <span
            className={cn(
              "text-body-s font-medium",
              isArchived ? "text-[#55647A]" : needsAttention ? "text-error" : "text-success"
            )}
          >
            {isArchived
              ? "This product is archived and hidden from all stores."
              : needsAttention
                ? `${attention.length} item${attention.length > 1 ? "s" : ""} need${attention.length === 1 ? "s" : ""} attention · ${attention[0]}`
                : "All required details are filled in."}
          </span>
        </div>
        <span className="pl-[18px] text-caption text-text-muted">
          {dirty ? "Unsaved changes" : "No changes yet"}
          {mode === "create" && autosavedAt && ` · Draft autosaved ${autosavedAt}`}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {mode === "edit" && onArchive && !isArchived && (
          <Button
            type="button"
            variant="outline"
            size="compact"
            onClick={onArchive}
            disabled={isSubmitting}
            className="gap-1.5 border-[#fce8e6] text-[#c0352b] hover:bg-[#fce8e6] hover:text-[#a02a20]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Archive</span>
          </Button>
        )}

        {isArchived && onRestore && (
          <Button
            type="button"
            variant="workspace"
            size="compact"
            onClick={onRestore}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restore product</span>
          </Button>
        )}

        <Button type="button" variant="outline" size="compact" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        {!isArchived && onSaveDraft && (
          <Button type="button" variant="workspace" size="compact" onClick={onSaveDraft} disabled={isSubmitting}>
            {status === "ACTIVE" ? "Unpublish" : "Save draft"}
          </Button>
        )}

        {!isArchived && (
          <Button type="button" size="compact" onClick={onPublish} disabled={isSubmitting} className="gap-2 px-5">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <span>
                {primaryLabel ?? (mode === "edit" ? "Save changes" : `Publish to ${publishCount} store${publishCount === 1 ? "" : "s"}`)}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
