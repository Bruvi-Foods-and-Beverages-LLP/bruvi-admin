"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Pagination, DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { cn } from "@/lib/utils/cn";
import { SegmentsApi, type SegmentMember, type SegmentsResponse } from "@/lib/api/segments";
import type { Paged } from "@/lib/api/wallet";
import { SegmentBuilderModal } from "./segment-builder-modal";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const money = "font-display font-extrabold tnum [font-variation-settings:'wdth'_112,'wght'_800]";
const card = "rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden";
const TIER_STYLE: Record<string, string> = {
  Silver: "bg-[#f5f7fa] text-[#3f4b5e]",
  Gold: "bg-[#fdf0d8] text-[#9a5b00]",
  Platinum: "bg-[#e4f0fa] text-[#22629e]",
};

function relative(iso: string | null) {
  if (!iso) return "Never";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
}

export function CustomersSegmentsView({ createOpen, onCreateOpen, onCreateClose }: { createOpen: boolean; onCreateOpen: () => void; onCreateClose: () => void }) {
  const [data, setData] = React.useState<SegmentsResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [members, setMembers] = React.useState<(Paged<SegmentMember> & { segmentName: string }) | null>(null);
  const [membersError, setMembersError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    SegmentsApi.list()
      .then((r) => {
        setData(r);
        setError(null);
        setSelected((cur) => (cur && r.segments.some((s) => s.id === cur) ? cur : r.segments[0]?.id ?? null));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load segments"));
  }, [reload]);

  React.useEffect(() => {
    if (!selected) return;
    SegmentsApi.members(selected, { page, limit: size })
      .then((r) => { setMembers(r); setMembersError(null); })
      .catch((e) => setMembersError(e instanceof Error ? e.message : "Could not load members"));
  }, [selected, page, size, reload]);

  const current = data?.segments.find((s) => s.id === selected) ?? null;

  const remove = async (id: string) => {
    if (!window.confirm("Delete this segment? Customers are not affected.")) return;
    try {
      await SegmentsApi.remove(id);
      setReload((k) => k + 1);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not delete segment");
    }
  };

  if (error) return <div className={cn(card, "p-8 text-center font-sans text-[14px] text-[#c0352b]")}>{error}</div>;
  if (!data) return <div className={cn(card, "p-8 text-center font-sans text-[14px] text-[#55647a]")}>Loading segments…</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      {!data.customSegmentsAvailable && (
        <div className="rounded-[12px] bg-[#fdf0d8] px-4 py-3 font-sans text-[14px] text-[#9a5b00]">
          Custom segments are not enabled yet — the segments database migration has not been applied. Built-in segments below still work.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.segments.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => { setSelected(s.id); setPage(1); }}
            className={cn(
              "text-left rounded-[16px] border bg-white p-5 flex flex-col gap-3 shadow-2xs cursor-pointer transition-colors",
              selected === s.id ? "border-[#1c3a66] ring-1 ring-[#1c3a66]" : "border-[#dce2ea] hover:border-[#7f8ca0]",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-extrabold text-[16px] leading-6 text-[#0f2340] truncate">{s.name}</span>
                <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">{s.description || s.ruleSummary.join(" · ")}</span>
              </div>
              {!s.builtIn && (
                <span role="button" aria-label="Delete segment" onClick={(e) => { e.stopPropagation(); void remove(s.id); }} className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[#7f8ca0] hover:bg-[#f5f7fa] hover:text-[#c0352b]">
                  <Trash2 className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <span className={cn(money, "text-[28px] leading-8 text-[#0f2340]")}>{s.memberCount}</span>
              <span className="font-sans text-[12px] text-[#3f4b5e]">{s.percentOfCustomers}% of customers</span>
            </div>
            <div className="flex gap-4 font-sans text-[12px] text-[#3f4b5e]">
              <span>Avg spend <b className="text-[#0f2340]">{inr(s.averageLifetime)}</b></span>
              <span>Wallet <b className="text-[#0f2340]">{inr(s.walletTotal)}</b></span>
            </div>
          </button>
        ))}
        {data.customSegmentsAvailable && (
          <button type="button" onClick={onCreateOpen} className="rounded-[16px] border-[1.5px] border-dashed border-[#bcc6d3] p-5 flex flex-col items-center justify-center gap-2 text-[#1c3a66] hover:bg-[#f5f7fa] min-h-[140px] cursor-pointer">
            <Plus className="h-5 w-5" />
            <span className="font-sans font-bold text-[14px]">Create segment</span>
          </button>
        )}
      </div>

      {current && (
        <div className={card}>
          <div className="px-5 py-4 flex flex-col gap-1">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">{current.name} · members</h3>
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">{current.ruleSummary.join(" · ")}</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_72px_110px_100px_90px] gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] uppercase tracking-[0.48px] text-[#3f4b5e]">
            <div>Customer</div><div>Phone</div><div>Tier</div><div className="text-right">Orders</div><div className="text-right">Lifetime</div><div className="text-right">Wallet</div><div className="text-right">Last order</div>
          </div>
          {membersError ? (
            <div className="px-5 py-8 text-center font-sans text-[14px] text-[#c0352b]">{membersError}</div>
          ) : !members ? (
            <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">Loading members…</div>
          ) : members.items.length === 0 ? (
            <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">No customers match this segment.</div>
          ) : (
            <div className="flex flex-col divide-y divide-[#dce2ea]">
              {members.items.map((m) => (
                <div key={m.id} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_72px_110px_100px_90px] gap-3 px-5 py-3 items-center min-h-14">
                  <Link href={`/customers/${m.id}`} className="flex flex-col min-w-0 hover:underline">
                    <span className="font-sans font-bold text-[14px] text-[#0f2340] truncate">{m.name}</span>
                    <span className="font-sans text-[12px] text-[#3f4b5e]">{m.code}{m.club ? " · Club" : ""}</span>
                  </Link>
                  <div className="font-sans text-[14px] text-[#3f4b5e] truncate">{m.phone || "—"}</div>
                  <div><span className={cn("inline-flex h-6 px-2.5 items-center rounded-full font-sans font-bold text-[12px]", TIER_STYLE[m.tier] ?? TIER_STYLE.Silver)}>{m.tier}</span></div>
                  <div className="text-right font-sans text-[14px] tnum text-[#0f2340]">{m.visits}</div>
                  <div className={cn("text-right text-[14px] text-[#0f2340]", money)}>{inr(m.lifetime)}</div>
                  <div className="text-right font-sans text-[14px] tnum text-[#0f2340]">{inr(m.wallet)}</div>
                  <div className="text-right font-sans text-[12px] text-[#3f4b5e]">{relative(m.lastOrderAt)}</div>
                </div>
              ))}
            </div>
          )}
          {members && members.total > 0 && (
            <Pagination page={page} pageSize={size} total={members.total} label="members" onPageChange={setPage} onPageSizeChange={(n) => { setSize(n); setPage(1); }} />
          )}
        </div>
      )}

      <SegmentBuilderModal open={createOpen} onClose={onCreateClose} onCreated={() => setReload((k) => k + 1)} />
    </div>
  );
}
