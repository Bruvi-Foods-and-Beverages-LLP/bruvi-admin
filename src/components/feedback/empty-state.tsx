"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { BruviIcon, type BruviIconName } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface ActiveFilterChip {
  id: string;
  label: string;
  onRemove?: () => void;
}

export interface EmptyStateProps {
  iconName?: BruviIconName;
  title: string;
  description: string;
  filterChips?: ActiveFilterChip[];
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  embedded?: boolean;
}

/**
 * Global Empty State (Figma 474:267411)
 * Reusable across standalone cards and inside table bodies (via TableEmptyRow).
 */
export function EmptyState({
  iconName,
  title,
  description,
  filterChips,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  embedded = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        embedded
          ? "py-14 px-6 bg-white"
          : "rounded-xl border border-border bg-white py-14 px-6",
        className,
      )}
    >
      {/* 64x64 Brand Ice Circle Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-brand text-primary mb-5">
        {iconName ? (
          <BruviIcon name={iconName} size={28} />
        ) : (
          <SearchX className="h-7 w-7 stroke-[1.75]" />
        )}
      </div>

      {/* Title & Contextual Description */}
      <h4 className="font-sans text-[20px] leading-7 font-extrabold text-text mb-1.5">
        {title}
      </h4>
      <p className="max-w-[640px] font-sans text-[14px] leading-5 text-text-secondary mb-5">
        {description}
      </p>

      {/* Dismissible Active Filter Chips */}
      {filterChips && filterChips.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {filterChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-2 rounded-full bg-background-subtle border border-border px-3 py-1.5 text-[12px] font-bold text-text"
            >
              <span>{chip.label}</span>
              {chip.onRemove && (
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove ${chip.label} filter`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-text-muted hover:bg-border/60 hover:text-text transition-colors cursor-pointer"
                >
                  <BruviIcon name="close" size={11} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Primary + Secondary CTAs */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {actionLabel && onAction && (
            <Button size="compact" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="workspace"
              size="compact"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface TableEmptyRowProps extends Omit<EmptyStateProps, "embedded"> {
  colSpan: number;
}

/**
 * Table-scoped Empty State Row (Figma 474:267411)
 * Preserves table headers and table footer while rendering the centered empty state.
 */
export function TableEmptyRow({ colSpan, ...props }: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <EmptyState {...props} embedded />
      </td>
    </tr>
  );
}
