"use client";

import * as React from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { BruviIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface NoPermissionViewProps {
  overline?: string;
  pageTitle?: string;
  resourceName?: string;
  description?: string;
  primaryReturnHref?: string;
  primaryReturnLabel?: string;
  errorCode?: string;
  roleSlug?: string;
  pathname?: string;
  showPageHeader?: boolean;
}

/**
 * Global 403 / No Permission State (Figma 474:268052)
 * Reusable across RouteRbacGuard, /forbidden, and inline restricted sections.
 */
export function NoPermissionView({
  overline = "ACCESS CONTROL · RESTRICTED",
  pageTitle = "Access restricted",
  resourceName = "this page",
  description,
  primaryReturnHref = "/",
  primaryReturnLabel = "Go to Dashboard",
  errorCode = "ACCESS-DENIED",
  roleSlug = "staff",
  pathname = "/",
  showPageHeader = true,
}: NoPermissionViewProps) {
  const [requestOpen, setRequestOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setRequestOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12">
      {showPageHeader && (
        <div className="flex flex-col gap-1">
          <span className="text-overline font-serif uppercase tracking-[1.54px] text-text-muted">
            {overline}
          </span>
          <h1 className="text-display-s font-display font-black text-text tracking-[-0.96px]">
            {pageTitle}
          </h1>
        </div>
      )}

      <Card className="px-6 py-14 sm:py-20 flex flex-col items-center text-center">
        {/* 64x64 Brand Ice Lock Circle */}
        <div className="h-16 w-16 rounded-full bg-surface-brand text-primary flex items-center justify-center mb-6">
          <BruviIcon name="lock" size={28} />
        </div>

        {/* 403 · RESTRICTED Badge */}
        <span className="inline-flex items-center rounded-full bg-warning-surface text-warning px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
          403 · Restricted
        </span>

        {/* Title */}
        <h2 className="font-sans text-[24px] leading-8 font-extrabold text-text mb-2">
          You don’t have access to {resourceName}
        </h2>

        {/* Contextual Description */}
        <p className="max-w-[480px] font-sans text-[15px] leading-6 text-text-secondary mb-7">
          {description ||
            `Your current role (${roleSlug}) does not include permission to open ${resourceName}. Switch to an authorized workspace or request temporary access below.`}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-7">
          <Button asChild variant="workspace" size="default">
            <Link href={primaryReturnHref}>{primaryReturnLabel}</Link>
          </Button>
          <Button
            size="default"
            disabled={submitted}
            onClick={() => setRequestOpen((v) => !v)}
          >
            {submitted ? "Access requested" : "Request access"}
          </Button>
        </div>

        {/* Inline Request Reason Form */}
        {requestOpen && !submitted && (
          <form
            onSubmit={handleRequestSubmit}
            className="w-full max-w-[464px] rounded-xl border border-border bg-background-subtle p-4 mb-5 flex flex-col gap-3 text-left"
          >
            <label
              htmlFor="access-request-reason"
              className="text-[12px] font-bold text-text"
            >
              Reason for requesting access to {resourceName}
            </label>
            <textarea
              id="access-request-reason"
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Need to verify store settlement variance for Thu 1 Oct"
              className="w-full rounded-lg border border-border-input bg-white p-2.5 text-[13px] text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus"
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRequestOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send request
              </Button>
            </div>
          </form>
        )}

        {submitted && (
          <div className="w-full max-w-[464px] rounded-xl border border-success/30 bg-success-surface px-4 py-3 text-[13px] font-bold text-success mb-5">
            Request sent to Kavya R. (Ops Director) and logged in Settings → Audit logs.
          </div>
        )}

        {/* Audit / Escalation Info Box */}
        <div className="w-full max-w-[464px] rounded-xl bg-info-surface px-4 py-3.5 text-left flex items-start gap-3 mb-6">
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <p className="text-[13px] leading-5 text-text">
            Requests go to Kavya R. (Ops Director) with your reason and the page
            you tried to open. Every request is recorded in Settings → Audit
            logs.
          </p>
        </div>

        {/* Diagnostic Footer */}
        <p className="text-[12px] font-medium text-text-muted tnum">
          Error 403 · {errorCode} · role {roleSlug} · {pathname}
        </p>
      </Card>
    </div>
  );
}
