"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, BarChart3, ArrowLeft } from "lucide-react";

interface LabHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  backHref?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function LabHeader({
  overline = "BRUVI LAB · limited batches",
  title,
  description,
  backHref,
  badge,
  actions,
}: LabHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-[#dce2ea] pb-6">
      <div className="flex flex-col gap-1.5">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-caption font-semibold text-[#55647A] hover:text-[#0F2340] transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Lab Products</span>
          </Link>
        )}

        <div className="flex items-center gap-3">
          <span className="text-overline-l text-[#55647A] tracking-[1.68px] uppercase">
            {overline}
          </span>
          {badge}
        </div>

        <h1 className="text-display-s text-[#0F2340] tracking-[-0.96px] leading-[38px]">
          {title}
        </h1>

        {description && (
          <p className="text-body-s text-[#55647A] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3 self-start md:self-auto">{actions}</div>}
    </div>
  );
}

export function LabOverviewHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] leading-[16px] tracking-[1.68px] font-normal font-serif uppercase text-[#566F2C]">
          BRUVI LAB · limited batches
        </span>
        <h1 className="text-display-s text-[#0F2340] tracking-[-0.0343em]">
          Lab Products
        </h1>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link
          href="/lab/performance"
          className="h-9 px-[17.5px] rounded-[12px] border-[1.5px] border-[#BCC6D3] bg-white hover:bg-[#F5F7FA] text-label text-[#0F2340] flex items-center justify-center transition-colors cursor-pointer"
        >
          Compare batches
        </Link>
        <Link
          href="/lab/new"
          className="h-9 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
        >
          New batch
        </Link>
      </div>
    </div>
  );
}

