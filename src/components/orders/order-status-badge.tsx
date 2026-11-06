"use client";

import * as React from "react";
import { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

/**
 * Normalizes backend status values into exact Figma-conforming display labels
 */
function formatStatusLabel(rawStatus: string): string {
  if (!rawStatus) return "—";
  const s = rawStatus.trim();
  const lower = s.toLowerCase();
  
  if (lower === "pending_payment" || lower === "pending payment") return "Pending payment";
  if (lower === "new" || lower === "placed") return "New";
  if (lower === "accepted") return "Accepted";
  if (lower === "confirmed") return "Preparing";
  if (lower === "preparing") return "Preparing";
  if (lower === "ready") return "Ready";
  if (lower === "completed") return "Completed";
  if (lower === "cancelled" || lower === "canceled") return "Cancelled";
  if (lower === "part_refund" || lower === "part refund" || lower === "partially_refunded") return "Part refund";
  if (lower === "refunded") return "Refunded";
  if (lower === "delayed") return "Delayed";
  if (lower.startsWith("delayed")) return s;
  
  // Format snake_case to Title case fallback
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const displayLabel = formatStatusLabel(status);

  // Exact Figma Foundations & Node 225:153858 Token Colors
  let styleClasses = "bg-[#f5f7fa] text-[#3f4b5e]"; // Default neutral

  switch (displayLabel) {
    case "New":
    case "Accepted":
      // VariableID:1:16 (info-surface #e4f0fa) / VariableID:1:15 (info #22629e) - Blue
      styleClasses = "bg-[#e4f0fa] text-[#22629e]";
      break;

    case "Preparing":
      // VariableID:1:12 (warning-surface #fdf0d8) / VariableID:1:11 (warning #9a5b00)
      styleClasses = "bg-[#fdf0d8] text-[#9a5b00]";
      break;

    case "Ready":
    case "Completed":
      // VariableID:1:10 (success-surface #e3f4ea) / VariableID:1:9 (success #1f7a4d)
      styleClasses = "bg-[#e3f4ea] text-[#1f7a4d]";
      break;

    case "Delayed":
    case "Delayed 14m":
      // VariableID:1:14 (error-surface #fce8e6) / VariableID:1:13 (error #c0352b)
      styleClasses = "bg-[#fce8e6] text-[#c0352b]";
      break;

    case "Cancelled":
    case "Part refund":
    case "Refunded":
      // VariableID:1:43 (bg-subtle #f5f7fa) / VariableID:1:49 (text-secondary #3f4b5e)
      styleClasses = "bg-[#f5f7fa] text-[#3f4b5e]";
      break;

    case "Pending payment":
      // VariableID:1:12 (warning-surface #fdf0d8) / VariableID:1:11 (warning #9a5b00)
      styleClasses = "bg-[#fdf0d8] text-[#9a5b00]";
      break;
  }

  return (
    <div
      className={cn(
        "inline-flex h-6 items-center rounded-[12px] px-2 font-sans font-bold text-[12px] leading-4 select-none whitespace-nowrap [font-variation-settings:'wght'_700]",
        styleClasses,
        className
      )}
    >
      <span>{displayLabel}</span>
    </div>
  );
}

