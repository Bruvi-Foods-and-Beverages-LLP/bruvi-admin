import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface FormCardProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** Standard admin form section card (shared by Stores and Catalog forms). */
export function FormCard({ title, description, action, children, className }: FormCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[16px] border border-border bg-white p-6 shadow-2xs flex flex-col gap-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-title text-text">{title}</h2>
          <p className="text-body-s text-text-muted">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
