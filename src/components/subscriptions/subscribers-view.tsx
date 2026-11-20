"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearSubscriberFilters,
  fetchPastDue,
  fetchSubscribers,
  setSubscriberFilters,
  setSubscriberPage,
} from "@/store/slices/membership-slice";
import { inr, MembershipApi, type AdminSubscriptionRowDto, type PastDueDto } from "@/lib/api/membership";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";
import {
  LoadErrorNotice,
  Panel,
  Shimmer,
  StateNotice,
  SubscriptionStatusPill,
  Toast,
  primaryButtonClass,
  secondaryButtonClass,
} from "./primitives";

/** A113: past-due pipeline, filters and the subscriber table. */
export function SubscribersView({ giftOpen, onGiftClose }: { giftOpen: boolean; onGiftClose: () => void }) {
  const dispatch = useAppDispatch();
  const { subscribers, pastDue, options } = useAppSelector((s) => s.membership);
  const [toast, setToast] = React.useState<{ message: string; tone: "success" | "error" } | null>(null);
  const { filters, page } = subscribers;

  React.useEffect(() => {
    dispatch(fetchPastDue());
  }, [dispatch]);
  React.useEffect(() => {
    dispatch(fetchSubscribers());
  }, [dispatch, filters, page]);

  const reload = () => {
    dispatch(fetchSubscribers());
    dispatch(fetchPastDue());
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <PastDuePipeline
        data={pastDue.data}
        loading={pastDue.status === "loading" && !pastDue.data}
        canWrite={options?.canWrite ?? false}
        onSent={(n) => {
          setToast({ message: n ? `Pay links sent to ${n} member${n > 1 ? "s" : ""}` : "No past-due members to message", tone: "success" });
          reload();
        }}
        onError={(m) => setToast({ message: m, tone: "error" })}
      />
      <Filters />
      {subscribers.error && !subscribers.data ? (
        <LoadErrorNotice error={subscribers.error} onRetry={reload} what="subscribers" />
      ) : (
        <SubscribersTable />
      )}
      {giftOpen && (
        <GiftModal
          onClose={onGiftClose}
          onDone={(name) => {
            onGiftClose();
            setToast({ message: `Membership gifted to ${name}`, tone: "success" });
            reload();
          }}
        />
      )}
      {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

function PastDuePipeline({
  data,
  loading,
  canWrite,
  onSent,
  onError,
}: {
  data: PastDueDto | null;
  loading: boolean;
  canWrite: boolean;
  onSent: (n: number) => void;
  onError: (m: string) => void;
}) {
  const [sending, setSending] = React.useState(false);
  if (loading) return <Shimmer className="h-[102px] rounded-lg" />;
  if (!data) return null;
  const send = async () => {
    setSending(true);
    try {
      onSent((await MembershipApi.sendPayLinks()).sent);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Could not send pay links");
    } finally {
      setSending(false);
    }
  };
  return (
    <Panel className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
      <div className="flex shrink-0 flex-col gap-1 lg:w-[180px]">
        <span className="flex items-center gap-2 text-label-semi text-text">
          <span className="h-2 w-2 rounded-pill bg-error" aria-hidden />
          Past due
        </span>
        <span className="flex items-baseline gap-2">
          <span className="text-price-l text-text">{data.count.toLocaleString("en-IN")}</span>
          <span className="text-caption text-text-secondary">{data.atRiskFormatted} at risk</span>
        </span>
      </div>
      <ol className="grid flex-1 grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-5">
        {data.steps.map((s) => (
          <li key={s.step} className={cn("flex min-h-[68px] flex-col gap-0.5 rounded-md p-3", s.danger ? "bg-error-surface" : "bg-background-subtle")}>
            <span className={cn("text-caption-bold", s.danger ? "text-error" : "text-text")}>{s.title}</span>
            <span className="text-caption text-text-secondary">{s.detail}</span>
          </li>
        ))}
      </ol>
      <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
        <span className="text-caption-bold text-success">
          {data.recoveredPercent == null ? "No failed renewals" : `${data.recoveredPercent}% recovered`} in {data.recoveredMonthLabel}
        </span>
        <button type="button" className={secondaryButtonClass} onClick={send} disabled={!canWrite || sending || data.count === 0} title={!canWrite ? "Your role can't message members" : undefined}>
          {sending ? "Sending…" : "Send pay links"}
        </button>
      </div>
    </Panel>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
}) {
  const current = options.find((o) => o.value === value);
  return (
    <label className="relative inline-flex h-9 shrink-0 items-center rounded-md border-[1.5px] border-border-input bg-surface pl-3 pr-8 text-label text-text focus-within:border-focus focus-within:ring-4 focus-within:ring-focus-halo">
      <span className="pointer-events-none whitespace-nowrap">
        {label}
        {current ? `: ${current.label}` : label === "Plan" || label === "Status" ? ": All" : ""}
      </span>
      <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-text-secondary" aria-hidden />
      <select
        aria-label={label}
        className="absolute inset-0 cursor-pointer opacity-0"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">{label === "Status" ? "Any" : "All"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Filters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((s) => s.membership.subscribers);
  const options = useAppSelector((s) => s.membership.options);
  const [q, setQ] = React.useState(filters.q ?? "");
  React.useEffect(() => {
    const t = setTimeout(() => {
      if ((filters.q ?? "") !== q.trim()) dispatch(setSubscriberFilters({ q: q.trim() || undefined }));
    }, 350);
    return () => clearTimeout(t);
  }, [q, filters.q, dispatch]);
  const set = (patch: Parameters<typeof setSubscriberFilters>[0]) => dispatch(setSubscriberFilters(patch));
  const any = Object.values(filters).some(Boolean);
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <label className="flex h-9 min-w-[240px] flex-1 items-center gap-2 rounded-md border-[1.5px] border-border-input bg-surface px-3 focus-within:border-focus focus-within:ring-4 focus-within:ring-focus-halo lg:max-w-[400px]">
        <Search className="h-4 w-4 text-text-secondary" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone or subscription ID"
          aria-label="Search subscribers"
          className="w-full bg-transparent text-body-s text-text outline-none placeholder:text-text-muted"
        />
      </label>
      <Select label="Plan" value={filters.planId} onChange={(v) => set({ planId: v })} options={(options?.plans ?? []).map((p) => ({ value: p.id, label: p.name }))} />
      <Select
        label="Status"
        value={filters.status}
        onChange={(v) => set({ status: v as never })}
        options={[
          { value: "ACTIVE", label: "Active" },
          { value: "TRIALING", label: "Trial" },
          { value: "PAST_DUE", label: "Past due" },
          { value: "PAUSED", label: "Paused" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
      />
      <Select label="Home store" value={filters.outletId} onChange={(v) => set({ outletId: v })} options={(options?.stores ?? []).map((s) => ({ value: s.id, label: s.name }))} />
      <Select
        label="Payment method"
        value={filters.paymentMethod}
        onChange={(v) => set({ paymentMethod: v as never })}
        options={[
          { value: "UPI_AUTOPAY", label: "UPI Autopay" },
          { value: "CARD", label: "Card" },
          { value: "EMANDATE", label: "eMandate" },
          { value: "GIFT", label: "Gift" },
        ]}
      />
      {any && (
        <button
          type="button"
          className="h-9 px-2 text-label text-primary hover:underline"
          onClick={() => {
            setQ("");
            dispatch(clearSubscriberFilters());
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

function UsageCell({ usage }: { usage: AdminSubscriptionRowDto["usage"] }) {
  return (
    <div className="flex w-[120px] flex-col gap-1">
      <span className="truncate text-caption-bold text-text">{usage.label}</span>
      {usage.progress != null && (
        <div className="h-1 w-full overflow-hidden rounded-pill bg-gray-100" aria-hidden>
          <div className="h-full rounded-pill bg-primary" style={{ width: `${Math.min(100, Math.round(usage.progress * 100))}%` }} />
        </div>
      )}
    </div>
  );
}

export function SubscribersTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, status, page, pageSize, filters } = useAppSelector((s) => s.membership.subscribers);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const items = data?.items ?? [];
  const loading = status === "loading" && !data;
  const filtered = Object.values(filters).some(Boolean);
  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allChecked = items.length > 0 && items.every((i) => selected.has(i.id));

  return (
    <Panel className="flex w-full flex-col overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="h-9 border-b border-border bg-background-subtle text-left">
              <th className="w-[52px] pl-5">
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  checked={allChecked}
                  onChange={() => setSelected(allChecked ? new Set() : new Set(items.map((i) => i.id)))}
                  className="h-5 w-5 accent-primary"
                />
              </th>
              {["Customer", "Plan", "Status", "Started", "Renews", "Cycle usage", "Payment"].map((h) => (
                <th key={h} className="px-2 text-caption-bold uppercase tracking-wide text-text-secondary">
                  {h}
                </th>
              ))}
              <th className="pr-5 text-right text-caption-bold uppercase tracking-wide text-text-secondary">LTV</th>
            </tr>
          </thead>
          <tbody className={cn(status === "loading" && data && "opacity-60")}>
            {loading &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={i} className="h-14 border-b border-border">
                  <td colSpan={9} className="px-5">
                    <Shimmer className="h-6" />
                  </td>
                </tr>
              ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={9} className="p-0">
                  <StateNotice
                    kind="empty"
                    className="rounded-none border-0"
                    title={filtered ? "No subscribers match these filters" : "No subscribers yet"}
                    description={filtered ? "Try another plan, status or store, or clear the filters." : "Members appear here as soon as they subscribe in the app or you gift a membership."}
                  />
                </td>
              </tr>
            )}
            {items.map((r) => (
              <tr
                key={r.id}
                tabIndex={0}
                onClick={() => router.push(`/subscriptions/subscribers/${r.id}`)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/subscriptions/subscribers/${r.id}`)}
                className={cn("h-14 cursor-pointer border-b border-border last:border-0 hover:bg-background-subtle focus-visible:bg-surface-brand focus-visible:outline-none", selected.has(r.id) && "bg-surface-brand")}
              >
                <td className="pl-5" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" aria-label={`Select ${r.customerName}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="h-5 w-5 accent-primary" />
                </td>
                <td className="px-2">
                  <div className="flex flex-col">
                    <span className="text-label text-text">{r.customerName}</span>
                    <span className="text-caption text-text-secondary">{[r.phoneMasked, r.homeStoreName].filter(Boolean).join(" · ")}</span>
                  </div>
                </td>
                <td className="px-2 text-body-s text-text">{r.planName}</td>
                <td className="px-2">
                  <SubscriptionStatusPill status={r.status} label={r.statusLabel} />
                </td>
                <td className="px-2 text-body-s text-text tnum">{r.startedFormatted ?? "—"}</td>
                <td className="px-2">
                  <div className="flex flex-col">
                    <span className={cn("text-body-s tnum", r.status === "PAST_DUE" ? "text-error" : "text-text")}>{r.renewsFormatted ?? "—"}</span>
                    {r.renewsNote && <span className="text-caption text-text-secondary">{r.renewsNote}</span>}
                  </div>
                </td>
                <td className="px-2">
                  <UsageCell usage={r.usage} />
                </td>
                <td className="px-2">
                  <div className="flex flex-col">
                    <span className="text-body-s text-text">{r.paymentLabel}</span>
                    {r.paymentIssue && <span className="text-caption text-error">{r.paymentIssue}</span>}
                  </div>
                </td>
                <td className="pr-5 text-right text-price-xs text-text">{inr(r.ltvPaise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
        <span className="text-body-s text-text-secondary">
          {from}–{to} of {total.toLocaleString("en-IN")}
          {data && ` · ${data.counts.active.toLocaleString("en-IN")} active · ${data.counts.trialing} trial · ${data.counts.pastDue} past due`}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </span>
        <div className="flex gap-2">
          <button type="button" className={secondaryButtonClass} disabled={page <= 1 || status === "loading"} onClick={() => dispatch(setSubscriberPage(page - 1))}>
            Previous
          </button>
          <button type="button" className={secondaryButtonClass} disabled={to >= total || status === "loading"} onClick={() => dispatch(setSubscriberPage(page + 1))}>
            Next
          </button>
        </div>
      </div>
    </Panel>
  );
}

function GiftModal({ onClose, onDone }: { onClose: () => void; onDone: (name: string) => void }) {
  const options = useAppSelector((s) => s.membership.options);
  const plans = (options?.plans ?? []).filter((p) => p.status !== "ARCHIVED");
  const [customer, setCustomer] = React.useState("");
  const [planId, setPlanId] = React.useState(plans[0]?.id ?? "");
  const [months, setMonths] = React.useState(1);
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await MembershipApi.gift({ customer: customer.trim(), planId, months, message: message.trim() || undefined });
      onDone(res.customer.name);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not gift the membership");
    } finally {
      setBusy(false);
    }
  };
  const field = "h-11 w-full rounded-md border-[1.5px] border-border-input bg-surface px-3 text-body text-text outline-none focus:border-focus focus:ring-4 focus:ring-focus-halo";
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-surface-inverse/40 p-4" role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <form onSubmit={submit} className="flex w-full max-w-[440px] flex-col gap-4 rounded-xl bg-surface p-6 shadow-overlay">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="gift-title" className="text-heading-m text-text">
              Gift a membership
            </h2>
            <p className="text-body-s text-text-secondary">No payment is taken. It ends after the months you pick.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-background-subtle">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-label text-text">Customer phone</span>
          <input className={field} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="+91 98765 43210" inputMode="tel" required />
        </label>
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-label text-text">Plan</span>
            <select className={field} value={planId} onChange={(e) => setPlanId(e.target.value)} required>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-label text-text">Months</span>
            <input className={field} type="number" min={1} max={12} value={months} onChange={(e) => setMonths(Math.max(1, Math.min(12, Number(e.target.value) || 1)))} />
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-label text-text">Message (optional)</span>
          <input className={field} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={280} placeholder="Thanks for being a regular!" />
        </label>
        {error && (
          <p role="alert" className="rounded-md bg-error-surface px-3 py-2 text-body-s text-error">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className={secondaryButtonClass} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={primaryButtonClass} disabled={busy || !customer.trim() || !planId}>
            {busy ? "Gifting…" : "Gift membership"}
          </button>
        </div>
      </form>
    </div>
  );
}
