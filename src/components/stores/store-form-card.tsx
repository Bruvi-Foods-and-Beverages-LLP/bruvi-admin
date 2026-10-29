import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface StoreFormCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function StoreFormCard({
  title,
  description,
  children,
  className,
}: StoreFormCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-[16px] border border-[#dce2ea] bg-white p-6 shadow-2xs flex flex-col gap-5",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-title text-[#0F2340]">{title}</h2>
        <p className="text-body-s text-[#55647A]">{description}</p>
      </div>

      <div>{children}</div>
    </div>
  );
}

