"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Ticket } from "lucide-react";
import {
  SupportAdminApi,
  type SupportTicketDetail,
  type SupportTicketRow,
  type TicketStatus,
} from "@/lib/api/support";
import { cn } from "@/lib/utils/cn";
import { useSupportLiveStore } from "@/stores/use-support-live-store";

type Filter = "ALL" | "NEEDS_REPLY" | "AWAITING_CUSTOMER" | "CHAT" | "RESOLVED";

const FILTERS: { key: Filter; label: string; match: (t: SupportTicketRow) => boolean }[] = [
  { key: "ALL", label: "All", match: () => true },
  { key: "NEEDS_REPLY", label: "Needs reply", match: (t) => t.status === "OPEN" || t.status === "IN_REVIEW" },
  { key: "AWAITING_CUSTOMER", label: "Awaiting customer", match: (t) => t.status === "AWAITING_CUSTOMER" },
  { key: "CHAT", label: "Live chats", match: (t) => t.kind === "CHAT" && !isDone(t.status) },
  { key: "RESOLVED", label: "Resolved", match: (t) => isDone(t.status) },
];

const STATUSES: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "AWAITING_CUSTOMER", label: "Awaiting customer" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const STATUS_STYLE: Record<TicketStatus, string> = {
  OPEN: "bg-[#fdf0d8] text-[#9a5b00]",
  IN_REVIEW: "bg-[#e4f0fa] text-[#22629e]",
  AWAITING_CUSTOMER: "bg-[#e4f0fa] text-[#22629e]",
  RESOLVED: "bg-[#e3f4ea] text-[#1f7a4d]",
  CLOSED: "bg-[#f5f7fa] text-[#3f4b5e]",
};

const card = "rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden";
const kpiValue = "font-display font-extrabold tnum [font-variation-settings:'wdth'_112,'wght'_800]";
const outlineButton =
  "h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer font-sans [font-variation-settings:'wght'_700] shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed";
const primaryButton =
  "h-9 px-4 rounded-[12px] bg-[#1c3a66] text-label text-white hover:bg-[#152c4f] active:bg-[#0f2340] transition-colors cursor-pointer font-sans [font-variation-settings:'wght'_700] shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed";

function isDone(status: TicketStatus) {
  return status === "RESOLVED" || status === "CLOSED";
}

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

/**
 * Customers › Support: tickets and live chats with reply, assign, status and
 * refund proposals. Live updates come from the global SupportLiveWatcher, so
 * this view opens no stream of its own.
 */
export function CustomersSupportView({
  orderId,
  initialTicketId,
  onClearOrder,
}: {
  orderId?: string;
  initialTicketId?: string;
  onClearOrder?: () => void;
}) {
  const [filter, setFilter] = React.useState<Filter>("ALL");
  const [rows, setRows] = React.useState<SupportTicketRow[] | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(initialTicketId ?? null);
  const [detail, setDetail] = React.useState<SupportTicketDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reply, setReply] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [refund, setRefund] = React.useState("");
  const listRequest = React.useRef(0);
  const selectedRef = React.useRef<string | null>(selectedId);
  React.useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const connected = useSupportLiveStore((s) => s.connected);
  const eventSeq = useSupportLiveStore((s) => s.eventSeq);
  const unresolved = useSupportLiveStore((s) => s.unresolved);
  const waiting = useSupportLiveStore((s) => s.waiting.length);
  const setActiveTicket = useSupportLiveStore((s) => s.setActiveTicket);

  // An alert's "Open chat" while this tab is already showing.
  const [prevInitialTicketId, setPrevInitialTicketId] = React.useState(initialTicketId);
  if (initialTicketId !== prevInitialTicketId) {
    setPrevInitialTicketId(initialTicketId);
    if (initialTicketId && initialTicketId !== selectedId) {
      setSelectedId(initialTicketId);
      setDetail(null);
    }
  }

  // The open conversation never raises the full-screen alert.
  React.useEffect(() => {
    setActiveTicket(selectedId);
    return () => setActiveTicket(null);
  }, [selectedId, setActiveTicket]);

  const loadList = React.useCallback(async () => {
    const request = ++listRequest.current;
    try {
      const res = await SupportAdminApi.list({ orderId });
      if (request === listRequest.current) {
        setRows(res.items);
        setError(null);
      }
    } catch {
      if (request === listRequest.current) setError("Could not load the support inbox.");
    }
  }, [orderId]);

  const loadDetail = React.useCallback(async (id: string) => {
    try {
      const conversation = await SupportAdminApi.detail(id);
      if (selectedRef.current === id) setDetail(conversation);
    } catch {
      if (selectedRef.current === id) setError("Could not load this conversation.");
    }
  }, []);

  React.useEffect(() => {
    void loadList();
  }, [loadList]);

  React.useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  // Refresh on every live support event (any ticket can move between filters).
  React.useEffect(() => {
    if (eventSeq === 0) return;
    void loadList();
    const { lastEventTicketId } = useSupportLiveStore.getState();
    if (lastEventTicketId && lastEventTicketId === selectedRef.current) void loadDetail(lastEventTicketId);
  }, [eventSeq, loadList, loadDetail]);

  // Fallback polling: 5 s without the live stream, 60 s with it.
  React.useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      void loadList();
      if (selectedRef.current) void loadDetail(selectedRef.current);
    };
    const t = setInterval(tick, connected ? 60_000 : 5_000);
    return () => clearInterval(t);
  }, [connected, loadList, loadDetail]);

  const run = async (action: () => Promise<SupportTicketDetail>) => {
    setBusy(true);
    setError(null);
    try {
      setDetail(await action());
      await loadList();
      return true;
    } catch {
      setError("That did not go through. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async () => {
    const body = reply.trim();
    if (!body || !selectedId || busy) return;
    const sent = await run(() => SupportAdminApi.reply(selectedId, body));
    if (sent) setReply((current) => (current.trim() === body ? "" : current));
  };

  const select = (id: string) => {
    if (selectedId === id) return;
    selectedRef.current = id;
    setDetail(null);
    setReply("");
    setRefund("");
    setSelectedId(id);
  };

  const all = rows ?? [];
  const counts = Object.fromEntries(FILTERS.map((f) => [f.key, all.filter(f.match).length])) as Record<Filter, number>;
  const visible = all.filter(FILTERS.find((f) => f.key === filter)!.match);

  const kpis = [
    { label: "Live chats open", value: unresolved, sub: unresolved === 1 ? "1 chat not resolved" : `${unresolved} chats not resolved` },
    { label: "Customers waiting", value: waiting, sub: waiting === 0 ? "Everyone has a reply" : "Last message is theirs", alert: waiting > 0 },
    { label: "Needs reply", value: counts.NEEDS_REPLY, sub: "Open and in review" },
    { label: "Awaiting customer", value: counts.AWAITING_CUSTOMER, sub: "Ball is in their court" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* KPI strip (same pattern as the Wallet tab) */}
      <div className={cn(card, "grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#dce2ea]")}>
        {kpis.map((k) => (
          <div key={k.label} className="p-5 flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e] [font-variation-settings:'wght'_700]">{k.label}</span>
            <span className={cn(kpiValue, "text-[32px] leading-[38px] tracking-[-0.64px] text-[#0f2340]")}>{k.value}</span>
            <span className={cn("font-sans font-bold text-[12px] leading-4 [font-variation-settings:'wght'_700]", k.alert ? "text-[#22629e]" : "text-[#3f4b5e]")}>{k.sub}</span>
          </div>
        ))}
      </div>

      <div className={cn(card, "flex flex-col")}>
        {/* Toolbar: filter pills (Customers filter style) and live status */}
        <div className="w-full h-auto sm:min-h-[60px] px-5 py-3 border-b border-[#dce2ea] flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={cn(
                    "h-9 px-3 rounded-[18px] text-[14px] leading-5 font-sans font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer select-none [font-variation-settings:'wght'_700]",
                    active ? "bg-[#0f2340] text-white shadow-2xs" : "bg-white border border-[#dce2ea] text-[#0f2340] hover:bg-[#f5f7fa]",
                  )}
                >
                  <span>{f.label}</span>
                  {rows && (
                    <span className={cn("font-sans font-normal text-[13px] [font-variation-settings:'wght'_400]", active ? "text-white/80" : "text-[#55647a]")}>
                      {counts[f.key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            {orderId && (
              <span className="font-sans text-[14px] text-[#3f4b5e]">
                This order only ·{" "}
                <button type="button" onClick={onClearOrder} className="font-bold text-[#1c3a66] hover:underline cursor-pointer">
                  View all
                </button>
              </span>
            )}
            <span
              className={cn(
                "h-7 px-2.5 rounded-full flex items-center gap-1.5 font-sans font-bold text-[12px] [font-variation-settings:'wght'_700]",
                connected ? "bg-[#e3f4ea] text-[#1f7a4d]" : "bg-[#f5f7fa] text-[#3f4b5e]",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-[#1f7a4d]" : "bg-[#7f8ca0]")} />
              {connected ? "Live" : "Polling"}
            </span>
          </div>
        </div>

        {error && <div className="px-5 py-3 border-b border-[#dce2ea] bg-[#fdecea] font-sans text-[14px] text-[#c0352b]">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] min-h-[560px]">
          {/* Conversation list */}
          <ul className="flex max-h-[68vh] flex-col divide-y divide-[#dce2ea] overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#dce2ea]">
            {!rows ? (
              <li className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">Loading conversations…</li>
            ) : visible.length === 0 ? (
              <li className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">No conversations here.</li>
            ) : (
              visible.map((t) => {
                const active = selectedId === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => select(t.id)}
                      disabled={busy}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "w-full px-5 py-3.5 text-left flex flex-col gap-1.5 transition-colors cursor-pointer border-l-[3px]",
                        active ? "bg-[#f5f9fd] border-[#1c3a66]" : "border-transparent hover:bg-[#f5f7fa]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 min-w-0">
                          {t.kind === "CHAT" ? (
                            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#1c3a66]" aria-label="Live chat" />
                          ) : (
                            <Ticket className="h-3.5 w-3.5 shrink-0 text-[#55647a]" aria-label="Ticket" />
                          )}
                          <span className={cn("rounded-[4px] px-1.5 py-0.5 font-sans font-extrabold text-[11px] leading-4 uppercase tracking-[0.44px]", STATUS_STYLE[t.status])}>
                            {t.statusLabel}
                          </span>
                        </span>
                        <span className="font-sans text-[12px] text-[#55647a] shrink-0">{timeAgo(t.lastMessageAt)}</span>
                      </div>
                      <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{t.subject}</span>
                      <span className="font-sans text-[12px] leading-4 text-[#3f4b5e] truncate">
                        {t.customerName} · {t.ticketNumber}
                        {t.assigneeName ? ` · ${t.assigneeName}` : ""}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {/* Conversation */}
          <section className="flex min-h-[420px] flex-col">
            {!selectedId ? (
              <p className="m-auto font-sans text-[14px] text-[#55647a]">Select a conversation.</p>
            ) : !detail ? (
              <p className="m-auto font-sans text-[14px] text-[#55647a]" role="status">Loading conversation…</p>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#dce2ea] px-5 py-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340] truncate">
                      {detail.customerName} · {detail.ticketNumber}
                    </h3>
                    <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
                      {detail.subject}
                      {detail.order ? ` · Order ${detail.order.orderNumber} (${detail.order.amountFormatted})` : ""}
                      {detail.customerPhone ? ` · ${detail.customerPhone}` : ""}
                    </span>
                    {detail.orderId && (
                      <Link href={`/orders/${detail.orderId}`} className="font-sans font-bold text-[12px] text-[#1c3a66] hover:underline w-fit">
                        View order
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!detail.assigneeName && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => run(() => SupportAdminApi.update(detail.id, { assignToMe: true }))}
                        className={outlineButton}
                      >
                        Assign to me
                      </button>
                    )}
                    <select
                      value={detail.status}
                      disabled={busy}
                      aria-label="Status"
                      onChange={(e) => run(() => SupportAdminApi.update(detail.id, { status: e.target.value as TicketStatus }))}
                      className="h-9 pl-3 pr-8 rounded-[12px] border border-[#7f8ca0] bg-white text-[14px] font-sans font-bold text-[#0f2340] cursor-pointer outline-none hover:border-[#0f2340] transition-colors [font-variation-settings:'wght'_700]"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {detail.proposedResolution && (
                  <div className="mx-5 mt-4 rounded-[12px] bg-[#fdf0d8] px-4 py-3 font-sans font-bold text-[14px] text-[#9a5b00]">
                    Proposed:{" "}
                    {detail.proposedResolution.type === "WALLET_REFUND"
                      ? `Refund ${detail.proposedResolution.amountFormatted} to wallet`
                      : "Replacement"}{" "}
                    · {detail.proposedResolution.state.toLowerCase()}
                  </div>
                )}

                <div className="flex max-h-[52vh] flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
                  {detail.messages.map((m) => (
                    <div key={m.id} className={cn("flex flex-col", m.role === "AGENT" ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-[16px] px-3.5 py-2.5 font-sans text-[14px] leading-5 whitespace-pre-wrap break-words",
                          m.role === "AGENT"
                            ? "bg-[#1c3a66] text-white"
                            : m.role === "SYSTEM"
                              ? "bg-[#f5f7fa] text-[#3f4b5e]"
                              : "bg-[#e4f0fa] text-[#0f2340]",
                        )}
                      >
                        {m.body}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.attachments.map((url) => (
                              <a key={url} href={url} target="_blank" rel="noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt="Attachment" className="h-20 w-20 rounded-[8px] object-cover" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="mt-1 font-sans text-[11px] text-[#55647a]">
                        {m.role === "CUSTOMER" ? detail.customerName : (m.senderName ?? "BRUVI Support")} · {timeAgo(m.at)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-[#dce2ea] px-5 py-4">
                  {detail.kind === "TICKET" && detail.proposedResolution?.state !== "ACCEPTED" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-9 w-32 px-3 bg-[#f5f7fa] rounded-[12px] flex items-center gap-1 focus-within:ring-2 focus-within:ring-[#1c3a66]/20">
                        <span className="font-sans text-[14px] text-[#55647a]">₹</span>
                        <input
                          value={refund}
                          inputMode="decimal"
                          aria-label="Refund amount in rupees"
                          onChange={(e) => setRefund(e.target.value.replace(/[^0-9.]/g, ""))}
                          placeholder="Refund"
                          className="w-full bg-transparent outline-none font-sans text-[14px] text-[#0f2340] placeholder:text-[#55647a]"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={busy || !refund}
                        onClick={() =>
                          run(() =>
                            SupportAdminApi.propose(detail.id, {
                              type: "WALLET_REFUND",
                              amountPaise: Math.round(Number(refund) * 100),
                              note: "",
                            }),
                          )
                        }
                        className={outlineButton}
                      >
                        Propose wallet refund
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => run(() => SupportAdminApi.propose(detail.id, { type: "REPLACEMENT", amountPaise: 0, note: "" }))}
                        className={outlineButton}
                      >
                        Propose replacement
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void sendReply();
                        }
                      }}
                      rows={2}
                      aria-label="Reply"
                      placeholder="Write a reply…"
                      className="flex-1 resize-none rounded-[12px] bg-[#f5f7fa] px-3 py-2 font-sans text-[14px] leading-5 text-[#0f2340] placeholder:text-[#55647a] outline-none focus:ring-2 focus:ring-[#1c3a66]/20"
                    />
                    <button type="button" disabled={busy || !reply.trim()} onClick={() => void sendReply()} className={primaryButton}>
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
