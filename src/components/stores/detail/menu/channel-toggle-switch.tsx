"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ChannelToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Pixel-perfect Channel Toggle Switch
 * Figma specs:
 * Container: 36px x 20px, rounded-full (cornerRadius: 10px), padding: 2px
 * Checked: bg-[#1C3A66] (bg-primary)
 * Unchecked: bg-[#BCC6D3] (border-input / neutral gray-300)
 * Thumb: 16px x 16px, rounded-full (cornerRadius: 8px), fill: #FFFFFF
 */
export function ChannelToggleSwitch({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: ChannelToggleSwitchProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-1 select-none",
        checked ? "bg-primary" : "bg-[#BCC6D3]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-xs transform transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
