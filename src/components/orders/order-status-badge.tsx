"use client";

import * as React from "react";
import { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  let styleClasses = "bg-[#f5f7fa] text-[#3f4b5e]"; // Default neutral

  switch (status) {
    case "Preparing":
      // VariableID:1:16 (info-surface #e4f0fa) / VariableID:1:15 (info #22629e)
      styleClasses = "bg-[#e4f0fa] text-[#22629e]";
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
      // VariableID:1:43 (bg-subtle #f5f7fa) / VariableID:1:49 (text-secondary #3f4b5e)
      styleClasses = "bg-[#f5f7fa] text-[#3f4b5e]";
      break;
  }

  return (
    <div
      className={cn(
        "inline-flex h-6 items-center rounded-[12px] px-2 text-caption-bold leading-4 select-none whitespace-nowrap",
        styleClasses,
        className
      )}
    >
      <span>{status}</span>
    </div>
  );
}

