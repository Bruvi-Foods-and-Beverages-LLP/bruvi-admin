"use client";

import * as React from "react";
import { StoreOverviewMetrics } from "@/store/slices/stores-slice";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RecentIssuesCardProps {
  issues: StoreOverviewMetrics["recentIssues"];
}

export function RecentIssuesCard({ issues }: RecentIssuesCardProps) {
  return (
    <div className="flex flex-col rounded-[16px] bg-surface border border-border shadow-sm overflow-hidden">
      {/* Header (Figma Node 225:86694) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-title text-text">
          Recent issues
        </h3>
        <button
          type="button"
          className="text-label text-text-brand hover:underline cursor-pointer"
        >
          All issues →
        </button>
      </div>

      {/* Issues List or Empty State */}
      {issues.length === 0 ? (
        <div className="flex items-center gap-3 px-5 py-6 text-caption text-text-muted">
          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
          <span>All store equipment and inventory operations are normal. No open issues.</span>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {issues.map((issue) => {
            const isError = issue.severity === "error";

            return (
              <div
                key={issue.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
              >
                {/* Icon box (36x36 rounded-8px) */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]",
                    isError ? "bg-error-surface text-error" : "bg-warning-surface text-warning"
                  )}
                >
                  {isError ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-label text-text truncate">
                    {issue.title}
                  </h4>
                  <p className="text-caption text-text-muted truncate">
                    {issue.subtitle}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-caption-bold shrink-0",
                    issue.status === "Open"
                      ? "bg-error-surface text-error"
                      : "bg-warning-surface text-warning"
                  )}
                >
                  {issue.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
