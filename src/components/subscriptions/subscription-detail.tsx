"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftRight, ChevronRight, Download, Pause, Play, RotateCcw, XCircle, X } from "lucide-react";
import { ApiClientError } from "@/lib/api/client";
import {
  inr,
  MembershipApi,
  type AdminEventDto,
  type AdminInvoiceDto,
  type AdminNoteDto,
  type AdminOptionsDto,
  type AdminRedemptionDto,
  type AdminSubscriptionDetailDto,
  type CancelReason,
} from "@/lib/api/membership";
import type { LoadError } from "@/store/slices/membership-slice";
import { cn } from "@/lib/utils/cn";
import {
  LoadErrorNotice,
  PageHeading,
  Panel,
  Pill,
  Shimmer,
  StateNotice,
  SubscriptionStatusPill,
  Toast,
  UnderlineTabs,
  primaryButtonClass,
  secondaryButtonClass,
} from "./primitives";

type Tab = "overview" | "redemptions" | "invoices" | "notes";
type Action = "pause" | "change" | "refund" | "cancel";

function toError(e: unknown): LoadError {
  return {
    message: e instanceof Error ? e.message : "Could not load",
    forbidden: e instanceof ApiClientError && e.statusCode === 403,
    offline: typeof navigator !== "undefined" && !navigator.onLine,
  };
}

/** A114 Subscription detail. Staff outside the member's home store get a 404 from the API. */
export function SubscriptionDetail({ id }: { id: string }) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const [detail, setDetail] = React.useState<AdminSubscriptionDetailDto | null>(null);
  const [invoices, setInvoices] = React.useState<AdminInvoiceDto[] | null>(null);
  const [events, setEvents] = React.useState<AdminEventDto[] | null>(null);
  const [options, setOptions] = React.useState<AdminOptionsDto | null>(null);
  const [error, setError] = React.useState<LoadError & { notFound?: boolean } | null>(null);
  const [action, setAction] = React.useState<Action | null>(null);
  const [toast, setToast] = React.useState<{ m: string; tone: "success" | "error" } | null>(null);

  const load = React.useCallback(() => {
    Promise.all([MembershipApi.subscription(id), MembershipApi.invoices(id), MembershipApi.events(id), MembershipApi.options()])
      .then(([d, inv, ev, opts]) => {
        setError(null);
        setDetail(d);
        setInvoices(inv);
        setEvents(ev);
        setOptions(opts);
      })
      .catch((e) => setError({ ...toError(e), notFound: e instanceof ApiClientError && e.statusCode === 404 }));
  }, [id]);
  React.useEffect(() => load(), [load]);

  if (error?.notFound) {
    return (
      <StateNotice
        kind="forbidden"
        title="Subscription not found"
        description="It doesn't exist, or the member's home store isn't one of yours."
        action={
          <Link href="/subscriptions?tab=subscribers" className={`${secondaryButtonClass} inline-flex items-center`}>
            Back to subscribers
          </Link>
        }
      />
    );
  }
  if (error) return <LoadErrorNotice error={error} onRetry={load} what="this subscription" />;
  if (!detail) {
    return (
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <Shimmer className="h-24 w-96" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
          <Shimmer className="h-[232px] rounded-lg" />
          <Shimmer className="h-[304px] rounded-lg" />
        </div>
      </div>
    );
  }

  const canWrite = options?.canWrite ?? false;
  const d = detail;
  const done = (next: AdminSubscriptionDetailDto, message: string) => {
    setDetail(next);
    setAction(null);
    setToast({ m: message, tone: "success" });
    MembershipApi.events(id).then(setEvents).catch(() => undefined);
    MembershipApi.invoices(id).then(setInvoices).catch(() => undefined);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4">
        <PageHeading
          breadcrumb={[
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Subscribers", href: "/subscriptions?tab=subscribers" },
            { label: d.subscriptionNumber },
          ]}
          title={d.customer.name}
          meta={
            <>
              <SubscriptionStatusPill status={d.status} label={d.statusLabel} />
              <span>
                {[d.plan.name, d.memberSinceFormatted && `member since ${d.memberSinceFormatted}`, d.customer.customerCode, d.customer.tier, d.customer.homeStoreName]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </>
          }
          actions={
            <>
              <Link href={`/customers/${d.customer.id}`} className={`${secondaryButtonClass} inline-flex items-center`}>
                View customer profile
              </Link>
              <button type="button" className={secondaryButtonClass} disabled title="Customer messaging isn't connected yet">
                Send message
              </button>
            </>
          }
        />
        <UnderlineTabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "redemptions", label: "Redemptions" },
            { value: "invoices", label: "Invoices" },
            { value: "notes", label: "Notes" },
          ]}
        />
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
          <div className="flex min-w-0 flex-col gap-4">
            <Panel className="flex flex-col overflow-hidden">
              <div className="grid grid-cols-2 border-b border-border md:grid-cols-4">
                <InfoCell label="Next renewal" value={d.nextRenewal.dateFormatted ? `${inr(d.nextRenewal.pricePaise)} · ${d.nextRenewal.dateFormatted}` : "—"} sub={d.nextRenewal.inDays != null ? `in ${d.nextRenewal.inDays} days · ${d.nextRenewal.note}` : d.nextRenewal.note} />
                <InfoCell label="Payment method" value={d.paymentMethod.title} sub={d.paymentMethod.detail ?? "—"} />
                <InfoCell label="Mandate ID" value={d.mandate.maskedId ?? "—"} sub={d.mandate.label || "—"} subTone={d.mandate.status === "ACTIVE" ? "success" : undefined} />
                <InfoCell label="Razorpay subscription" value={d.provider.maskedSubscriptionId ?? "—"} sub={d.provider.label} last />
              </div>
              <CycleGrid cycle={d.cycle} planPrice={d.plan.pricePaise} />
            </Panel>
            <InvoicesCard subscriptionId={d.id} invoices={invoices} summary={d.invoicesSummary} limit={4} />
          </div>
          <div className="flex flex-col gap-4">
            <Panel className="flex flex-col overflow-hidden">
              <h2 className="border-b border-border px-5 py-4 text-heading-s text-text">Manage subscription</h2>
              {d.actions.canResume ? (
                <ManageRow icon={<Play className="h-5 w-5" />} title="Resume" sub="End the pause now" disabled={!canWrite} onClick={async () => {
                  try { done(await MembershipApi.resume(d.id), "Membership resumed"); } catch (e) { setToast({ m: e instanceof Error ? e.message : "Could not resume", tone: "error" }); }
                }} />
              ) : (
                <ManageRow icon={<Pause className="h-5 w-5" />} title="Pause" sub="1–4 weeks · renewal date shifts" disabled={!canWrite || !d.actions.canPause} onClick={() => setAction("pause")} />
              )}
              <ManageRow icon={<ArrowLeftRight className="h-5 w-5" />} title="Change plan" sub={d.actions.changePlanLabel} disabled={!canWrite || !d.actions.canChangePlan} onClick={() => setAction("change")} />
              <ManageRow icon={<RotateCcw className="h-5 w-5" />} title="Refund pro-rata" sub={d.actions.refundLabel} disabled={!canWrite || !d.actions.canRefund} onClick={() => setAction("refund")} />
              <ManageRow icon={<XCircle className="h-5 w-5" />} title="Cancel subscription" sub={d.actions.cancelLabel} danger disabled={!canWrite || !d.actions.canCancel} onClick={() => setAction("cancel")} last />
            </Panel>
            <EventHistory events={events} />
          </div>
        </div>
      )}
      {tab === "redemptions" && <Redemptions id={d.id} />}
      {tab === "invoices" && <InvoicesCard subscriptionId={d.id} invoices={invoices} summary={d.invoicesSummary} />}
      {tab === "notes" && <Notes id={d.id} canWrite={canWrite} />}

      {action && <ActionDialog action={action} detail={d} options={options} onClose={() => setAction(null)} onDone={done} />}
      {toast && <Toast message={toast.m} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

function InfoCell({ label, value, sub, subTone, last }: { label: string; value: string; sub: string; subTone?: "success"; last?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5 p-5", !last && "md:border-r md:border-border")}>
      <span className="text-caption text-text-secondary">{label}</span>
      <span className="truncate text-label text-text tnum">{value}</span>
      <span className={cn("truncate text-caption", subTone === "success" ? "text-success" : "text-text-secondary")}>{sub}</span>
    </div>
  );
}

function CycleGrid({ cycle, planPrice }: { cycle: AdminSubscriptionDetailDto["cycle"]; planPrice: number }) {
  if (cycle.kind !== "DRINKS") {
    return (
      <div className="flex flex-col gap-1 p-5">
        <span className="text-label text-text">This cycle</span>
        <span className="text-body-s text-text-secondary">
          {cycle.kind === "DISCOUNT" ? `${cycle.used} discounted orders · ${inr(cycle.valueUsedPaise)} saved` : "No usage-based benefits"} · day {cycle.dayOfCycle} of {cycle.daysInCycle}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 p-5 md:flex-row">
      <div className="flex shrink-0 flex-col gap-1 md:w-[160px]">
        <span className="text-label text-text">This cycle</span>
        <span className="flex items-baseline gap-1">
          <span className="text-price-l text-text">{cycle.used}</span>
          <span className="text-body text-text-secondary">of {cycle.total} drinks</span>
        </span>
        <span className="text-caption text-text-secondary">
          Day {cycle.dayOfCycle} of {cycle.daysInCycle} · {inr(cycle.valueUsedPaise)} value used
          {planPrice > 0 && cycle.valueUsedPaise > planPrice ? " · above plan price" : ""}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1" role="img" aria-label={`${cycle.used} of ${cycle.total} drinks redeemed`}>
          {cycle.days.map((d, i) => (
            <span
              key={i}
              className={cn(
                "h-6 w-[29px] rounded-xs",
                d === "REDEEMED" ? "bg-primary" : d === "TODAY" ? "border border-dashed border-focus bg-surface-brand" : "bg-gray-100",
              )}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-caption text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-primary" aria-hidden /> Redeemed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-gray-100" aria-hidden /> Remaining
          </span>
          <Pill tone="brand">{cycle.todayLabel}</Pill>
        </div>
      </div>
    </div>
  );
}

function InvoicesCard({
  subscriptionId,
  invoices,
  summary,
  limit,
}: {
  subscriptionId: string;
  invoices: AdminInvoiceDto[] | null;
  summary: AdminSubscriptionDetailDto["invoicesSummary"];
  limit?: number;
}) {
  const rows = limit ? (invoices ?? []).slice(0, limit) : (invoices ?? []);
  const downloadAll = () => {
    (invoices ?? []).forEach((inv, i) => setTimeout(() => window.open(MembershipApi.invoiceUrl(subscriptionId, inv.id), "_blank"), i * 300));
  };
  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-heading-s text-text">Invoices</h2>
          <p className="text-caption text-text-secondary">
            {summary.paidCount} paid · {inr(summary.lifetimePaise)} lifetime · GST incl.
          </p>
        </div>
        {(invoices?.length ?? 0) > 0 && (
          <button type="button" className="text-label text-primary hover:underline" onClick={downloadAll}>
            Download all
          </button>
        )}
      </div>
      {invoices == null ? (
        <Shimmer className="mx-5 mb-5 h-24" />
      ) : rows.length === 0 ? (
        <p className="px-5 pb-5 text-body-s text-text-muted">No invoices yet · the first appears after the first charge</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="h-9 border-y border-border bg-background-subtle text-left">
                {["Invoice", "Period", "Method"].map((h) => (
                  <th key={h} className="px-5 text-caption-bold uppercase tracking-wide text-text-secondary">
                    {h}
                  </th>
                ))}
                <th className="px-2 text-right text-caption-bold uppercase tracking-wide text-text-secondary">Amount</th>
                <th className="px-5 text-caption-bold uppercase tracking-wide text-text-secondary">Status</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr key={inv.id} className="h-12 border-b border-border last:border-0">
                  <td className="whitespace-nowrap px-5 text-label text-text tnum">{inv.invoiceNumber}</td>
                  <td className="whitespace-nowrap px-5 text-body-s text-text">{inv.periodLabel}</td>
                  <td className="px-5 text-body-s text-text">{inv.method}</td>
                  <td className="px-2 text-right text-price-xs text-text">{inr(inv.amountPaise)}</td>
                  <td className="px-5">
                    <Pill tone={inv.status === "PAID" ? "success" : inv.status === "FAILED" ? "error" : inv.status === "REFUNDED" ? "muted" : "warning"}>{inv.statusLabel}</Pill>
                  </td>
                  <td className="pr-5">
                    <a href={MembershipApi.invoiceUrl(subscriptionId, inv.id)} aria-label={`Download ${inv.invoiceNumber}`} className="inline-flex rounded-sm p-1 text-text-secondary hover:bg-background-subtle hover:text-text" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function ManageRow({ icon, title, sub, onClick, disabled, danger, last }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void; disabled?: boolean; danger?: boolean; last?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn("flex items-center gap-3 px-5 py-4 text-left hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent", !last && "border-b border-border")}
    >
      <span className={cn("shrink-0", danger ? "text-error" : "text-text")} aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("text-label", danger ? "text-error" : "text-text")}>{title}</span>
        <span className="truncate text-caption text-text-secondary">{sub}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden />
    </button>
  );
}

const TONE_DOT: Record<AdminEventDto["tone"], string> = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-error",
  muted: "bg-gray-300",
};

function EventHistory({ events }: { events: AdminEventDto[] | null }) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <h2 className="text-heading-s text-text">Event history</h2>
      {events == null ? (
        <Shimmer className="h-32" />
      ) : events.length === 0 ? (
        <p className="text-body-s text-text-muted">Nothing yet</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {events.slice(0, 8).map((e) => (
            <li key={e.id} className="flex gap-3">
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-pill", TONE_DOT[e.tone])} aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-label text-text">{e.title}</span>
                {e.detail && <span className="break-words text-caption text-text-secondary">{e.detail}</span>}
              </div>
              <span className="shrink-0 text-caption text-text-secondary">{e.atFormatted}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function Redemptions({ id }: { id: string }) {
  const [data, setData] = React.useState<{ items: AdminRedemptionDto[]; total: number } | null>(null);
  const [page, setPage] = React.useState(1);
  const [error, setError] = React.useState<LoadError | null>(null);
  const load = React.useCallback(() => {
    MembershipApi.redemptions(id, page, 25).then((r) => { setError(null); setData(r); }).catch((e) => setError(toError(e)));
  }, [id, page]);
  React.useEffect(() => load(), [load]);
  if (error) return <LoadErrorNotice error={error} onRetry={load} what="redemptions" />;
  if (!data) return <Shimmer className="h-48 rounded-lg" />;
  if (data.total === 0) return <StateNotice kind="empty" title="No redemptions yet" description="Free drinks and member discounts show up here after an order." />;
  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="h-9 border-b border-border bg-background-subtle text-left">
              {["Benefit", "Item", "Order", "Store", "When"].map((h) => (
                <th key={h} className="px-5 text-caption-bold uppercase tracking-wide text-text-secondary">
                  {h}
                </th>
              ))}
              <th className="px-5 text-right text-caption-bold uppercase tracking-wide text-text-secondary">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((r) => (
              <tr key={r.id} className={cn("h-14 border-b border-border last:border-0", r.reversed && "opacity-60")}>
                <td className="px-5 text-label text-text">
                  {r.title}
                  {r.reversed && <span className="ml-2 text-caption text-text-secondary">· order cancelled, returned</span>}
                </td>
                <td className="px-5 text-body-s text-text">{r.itemName ?? "—"}</td>
                <td className="px-5 text-body-s text-text">
                  <Link href={`/orders/${r.orderId}`} className="text-primary hover:underline">
                    {r.orderCode ?? "Order"}
                  </Link>
                </td>
                <td className="px-5 text-body-s text-text">{r.storeName ?? "—"}</td>
                <td className="px-5 text-body-s text-text-secondary">{r.atFormatted}</td>
                <td className="px-5 text-right text-price-xs text-text">{inr(r.valuePaise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="text-body-s text-text-secondary">{data.total} redemptions</span>
        <div className="flex gap-2">
          <button type="button" className={secondaryButtonClass} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <button type="button" className={secondaryButtonClass} disabled={page * 25 >= data.total} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Notes({ id, canWrite }: { id: string; canWrite: boolean }) {
  const [notes, setNotes] = React.useState<AdminNoteDto[] | null>(null);
  const [body, setBody] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    MembershipApi.notes(id).then(setNotes).catch((e) => setError(e instanceof Error ? e.message : "Could not load notes"));
  }, [id]);
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setNotes(await MembershipApi.addNote(id, body.trim()));
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the note");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <form onSubmit={add} className="flex flex-col gap-2">
        <label htmlFor="note" className="text-label text-text">
          Add a note
        </label>
        <textarea
          id="note"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!canWrite}
          maxLength={1000}
          rows={3}
          placeholder={canWrite ? "Only staff see notes" : "Your role can't add notes"}
          className="rounded-md border-[1.5px] border-border-input bg-surface px-4 py-3 text-body text-text outline-none focus:border-focus focus:ring-4 focus:ring-focus-halo disabled:bg-background-subtle"
        />
        {error && <p className="text-caption text-error">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" className={primaryButtonClass} disabled={!canWrite || busy || !body.trim()}>
            {busy ? "Saving…" : "Save note"}
          </button>
        </div>
      </form>
      {notes == null ? (
        <Shimmer className="h-20" />
      ) : notes.length === 0 ? (
        <p className="text-body-s text-text-muted">No notes yet</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {notes.map((n) => (
            <li key={n.id} className="flex flex-col gap-1 py-3">
              <span className="whitespace-pre-wrap text-body-s text-text">{n.body}</span>
              <span className="text-caption text-text-secondary">
                {n.authorName ?? "Staff"} · {n.atFormatted}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

const CANCEL_REASONS: { value: CancelReason | "ADMIN"; label: string }[] = [
  { value: "ADMIN", label: "Staff decision" },
  { value: "PRICE_TOO_HIGH", label: "Price too high" },
  { value: "NOT_USING_ENOUGH", label: "Not using enough" },
  { value: "MOVED_AWAY", label: "Moved away" },
  { value: "MENU_CHOICE", label: "Menu / drink choice" },
  { value: "OTHER", label: "Other" },
];

function ActionDialog({
  action,
  detail,
  options,
  onClose,
  onDone,
}: {
  action: Action;
  detail: AdminSubscriptionDetailDto;
  options: AdminOptionsDto | null;
  onClose: () => void;
  onDone: (d: AdminSubscriptionDetailDto, message: string) => void;
}) {
  const [weeks, setWeeks] = React.useState(1);
  const [planId, setPlanId] = React.useState(options?.plans.find((p) => p.id !== detail.plan.id && p.status === "LIVE")?.id ?? "");
  const [reason, setReason] = React.useState("");
  const [cancelReason, setCancelReason] = React.useState<CancelReason | "ADMIN">("ADMIN");
  const [immediate, setImmediate] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const titles: Record<Action, string> = { pause: "Pause membership", change: "Change plan", refund: "Refund pro-rata", cancel: "Cancel subscription" };
  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      if (action === "pause") onDone(await MembershipApi.pause(detail.id, weeks), `Paused for ${weeks} week${weeks > 1 ? "s" : ""}`);
      if (action === "change") onDone(await MembershipApi.changePlan(detail.id, planId), "Plan change scheduled for the next renewal");
      if (action === "refund") onDone(await MembershipApi.refund(detail.id, reason.trim()), `Refunded ${inr(detail.actions.refundPreviewPaise)} and cancelled`);
      if (action === "cancel") onDone(await MembershipApi.cancel(detail.id, { reason: cancelReason, immediate }), immediate ? "Membership cancelled" : "Cancels at the end of this cycle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't work");
    } finally {
      setBusy(false);
    }
  };
  const field = "h-11 w-full rounded-md border-[1.5px] border-border-input bg-surface px-3 text-body text-text outline-none focus:border-focus focus:ring-4 focus:ring-focus-halo";
  const disabled = busy || (action === "change" && !planId) || (action === "refund" && reason.trim().length < 3);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-surface-inverse/40 p-4" role="dialog" aria-modal="true" aria-labelledby="action-title">
      <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-xl bg-surface p-6 shadow-overlay">
        <div className="flex items-start justify-between">
          <h2 id="action-title" className="text-heading-m text-text">
            {titles[action]}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-background-subtle">
            <X className="h-5 w-5" />
          </button>
        </div>
        {action === "pause" && (
          <>
            <p className="text-body-s text-text-secondary">Benefits stop while paused, and the renewal date moves by the same time.</p>
            <div role="radiogroup" aria-label="Weeks" className="flex gap-2">
              {[1, 2, 3, 4].map((w) => (
                <button key={w} type="button" role="radio" aria-checked={weeks === w} onClick={() => setWeeks(w)} className={cn("h-11 flex-1 rounded-md border-[1.5px] text-label", weeks === w ? "border-primary bg-primary text-on-primary" : "border-border-input text-text")}>
                  {w} wk
                </button>
              ))}
            </div>
          </>
        )}
        {action === "change" && (
          <>
            <p className="text-body-s text-text-secondary">The new plan starts at the next renewal. UPI mandates can&apos;t change amount: the customer switches in the app instead.</p>
            <select className={field} value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {(options?.plans ?? [])
                .filter((p) => p.id !== detail.plan.id && p.status === "LIVE")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </>
        )}
        {action === "refund" && (
          <>
            <p className="text-body-s text-text-secondary">{detail.actions.refundLabel}. The membership ends now.</p>
            <label className="flex flex-col gap-2">
              <span className="text-label text-text">Reason</span>
              <input className={field} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={280} placeholder="Moved to another city" />
            </label>
          </>
        )}
        {action === "cancel" && (
          <>
            <p className="text-body-s text-text-secondary">Offer a retention discount first if the member is unsure.</p>
            <select className={field} value={cancelReason} onChange={(e) => setCancelReason(e.target.value as CancelReason | "ADMIN")}>
              {CANCEL_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-body-s text-text">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={immediate} onChange={(e) => setImmediate(e.target.checked)} />
              End now instead of at the end of the cycle
            </label>
          </>
        )}
        {error && (
          <p role="alert" className="rounded-md bg-error-surface px-3 py-2 text-body-s text-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className={secondaryButtonClass} onClick={onClose}>
            Back
          </button>
          <button type="button" className={cn(primaryButtonClass, action === "cancel" && "bg-error hover:bg-error")} disabled={disabled} onClick={run}>
            {busy ? "Working…" : titles[action]}
          </button>
        </div>
      </div>
    </div>
  );
}
