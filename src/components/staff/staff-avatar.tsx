"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface StaffAvatarProps {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg";
  tone?: "sky" | "cream" | "coffee" | "matcha";
  className?: string;
}

const SIZE_MAP = {
  xs: "h-7 w-7 text-[11px]",
  sm: "h-8 w-8 text-[12px]",
  md: "h-9 w-9 text-[12px]",
  lg: "h-11 w-11 text-[14px]",
};

const TONE_MAP = {
  sky: "bg-surface-brand text-primary",
  cream: "bg-surface-warm text-text",
  coffee: "bg-category-coffee-surface text-category-coffee",
  matcha: "bg-category-matcha-surface text-category-matcha",
};

export function StaffAvatar({
  initials,
  size = "md",
  tone = "sky",
  className,
}: StaffAvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-sans font-bold select-none",
        SIZE_MAP[size],
        TONE_MAP[tone],
        className,
      )}
    >
      {initials}
    </div>
  );
}
