"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

/** 40x24 toggle (Figma: color/primary on, color/control-off off). */
export function Switch({ checked, onCheckedChange, disabled, id, className, ...rest }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={rest["aria-label"]}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary justify-end" : "bg-control-off justify-start",
        className
      )}
    >
      <span className="block h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,35,64,0.25)]" />
    </button>
  );
}

export interface ToggleTileProps extends Omit<SwitchProps, "className"> {
  label: string;
  /** One-line explanation shown under the label. */
  hint?: string;
  className?: string;
}

/** Bordered tile: bold label + hint on the left, switch on the right. */
export function ToggleTile({ label, hint, checked, onCheckedChange, disabled, className }: ToggleTileProps) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-12 min-w-0 items-center gap-3 rounded-[12px] border border-border bg-white px-4 py-2 cursor-pointer transition-colors hover:bg-background-subtle/60",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-label text-text">{label}</span>
        {hint && <span className="truncate text-caption text-text-muted">{hint}</span>}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} aria-label={label} />
    </label>
  );
}
