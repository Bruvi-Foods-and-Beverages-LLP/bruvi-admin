"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Inbox, Lock, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LoadError } from "@/store/slices/membership-slice";

/** White 16px card with the standard 1px border (Figma cards on A110–A114). */
export function Panel({
  className,
  children,
  as: Tag = "section",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div" | "article";
}) {
  return <Tag className={cn("rounded-lg border border-border bg-surface", className)}>{children}</Tag>;
}

export type PillTone = "success" | "warning" | "error" | "info" | "muted" | "brand";

const PILL: Record<PillTone, string> = {
  success: "bg-success-surface text-success",
  warning: "bg-warning-surface text-warning",
  error: "bg-error-surface text-error",
  info: "bg-info-surface text-info",
  muted: "bg-gray-100 text-text-secondary",
  brand: "bg-surface-brand text-primary",
};

export function Pill({ tone, children, className }: { tone: PillTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-md px-2 text-caption-bold", PILL[tone], className)}>
      {children}
    </span>
  );
}

const SUB_TONE: Record<string, PillTone> = {
  ACTIVE: "success",
  TRIALING: "info",
  PAST_DUE: "error",
  PAUSED: "warning",
  CANCELLED: "muted",
  EXPIRED: "muted",
  PENDING_AUTH: "muted",
};

export function SubscriptionStatusPill({ status, label }: { status: string; label: string }) {
  return <Pill tone={label === "Cancelling" ? "warning" : (SUB_TONE[status] ?? "muted")}>{label}</Pill>;
}

export function PlanStatusPill({ status, label }: { status: string; label: string }) {
  const tone: PillTone =
    status === "LIVE" ? (/paused/i.test(label) ? "warning" : "success") : status === "SCHEDULED" ? "info" : status === "DRAFT" ? "warning" : "muted";
  return <Pill tone={tone}>{label}</Pill>;
}

/** Underline tabs (Figma: 24px gap, 2px primary underline, label/Manrope Bold). */
export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number | string | null; href?: string }[];
  value: T;
  onChange?: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex w-full gap-6 overflow-x-auto border-b border-border">
      {tabs.map((t) => {
        const active = t.value === value;
        const inner = (
          <>
            <span className={cn("text-label", active ? "text-text" : "text-text-secondary")}>{t.label}</span>
            {t.count != null && (
              <span
                className={cn(
                  "rounded-sm px-2 text-caption-bold tnum",
                  active ? "bg-primary text-on-primary" : "bg-gray-100 text-text-secondary",
                )}
              >
                {t.count}
              </span>
            )}
          </>
        );
        const cls = cn(
          "-mb-px flex h-9 shrink-0 items-center gap-2 border-b-2 pb-0.5 transition-colors",
          active ? "border-primary" : "border-transparent hover:border-border-strong",
        );
        return t.href ? (
          <Link key={t.value} href={t.href} role="tab" aria-selected={active} className={cls}>
            {inner}
          </Link>
        ) : (
          <button key={t.value} type="button" role="tab" aria-selected={active} className={cls} onClick={() => onChange?.(t.value)}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

/** Caption over an Archivo figure (plan card footers, detail strips). */
export function Stat({ label, value, sub, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <span className="text-caption text-text-secondary">{label}</span>
      <span className="truncate text-price-s text-text">{value}</span>
      {sub}
    </div>
  );
}

export function PageHeading({
  overline,
  breadcrumb,
  title,
  meta,
  actions,
}: {
  overline?: string;
  breadcrumb?: { label: string; href?: string }[];
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        {overline && <span className="text-overline-l text-text-secondary">{overline}</span>}
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-body-s text-text-secondary">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={b.label}>
                {i > 0 && <span aria-hidden>/</span>}
                {b.href ? (
                  <Link href={b.href} className="hover:text-text hover:underline">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="truncate text-display-s text-text">{title}</h1>
        {meta && <div className="flex flex-wrap items-center gap-2 text-body-s text-text-secondary">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-100", className)} aria-hidden />;
}

/** Error, offline, no-permission and empty states in one place. */
export function StateNotice({
  kind,
  title,
  description,
  onRetry,
  action,
  className,
}: {
  kind: "error" | "offline" | "forbidden" | "empty";
  title: string;
  description: string;
  onRetry?: () => void;
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = kind === "offline" ? WifiOff : kind === "forbidden" ? Lock : kind === "empty" ? Inbox : AlertTriangle;
  return (
    <div
      role={kind === "error" || kind === "offline" ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border px-6 py-12 text-center",
        kind === "error" ? "border-error/30 bg-error-surface/40" : "border-border bg-surface",
        className,
      )}
    >
      <div
        className={cn(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-pill",
          kind === "error" ? "bg-error-surface text-error" : "bg-background-subtle text-text-muted",
        )}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-heading-s text-text">{title}</h3>
      <p className="max-w-md text-body-s text-text-muted">{description}</p>
      <div className="mt-4 flex gap-2">
        {onRetry && (
          <Button variant="workspace" size="compact" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}

/** Maps a load error to the right state. */
export function LoadErrorNotice({ error, onRetry, what }: { error: LoadError; onRetry: () => void; what: string }) {
  if (error.forbidden) {
    return (
      <StateNotice
        kind="forbidden"
        title="You don't have access"
        description={`Your role can't view ${what}. Ask an HQ admin if you need it.`}
      />
    );
  }
  if (error.offline) {
    return <StateNotice kind="offline" title="You're offline" description={`We couldn't reach the server to load ${what}.`} onRetry={onRetry} />;
  }
  return <StateNotice kind="error" title={`Couldn't load ${what}`} description={error.message} onRetry={onRetry} />;
}

/** Small dismissible feedback line used after actions. */
export function Toast({ message, tone = "success", onClose }: { message: string; tone?: "success" | "error"; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md px-4 py-3 text-label shadow-floating",
        tone === "success" ? "bg-surface-inverse text-text-inverse" : "bg-error text-on-primary",
      )}
    >
      {message}
    </div>
  );
}

export const secondaryButtonClass = "h-9 rounded-md border-[1.5px] border-border-input bg-surface px-4 text-label text-text hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50";
export const primaryButtonClass = "h-9 rounded-md bg-primary px-4 text-label text-on-primary hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-50";
