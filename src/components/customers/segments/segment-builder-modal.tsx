"use client";

import * as React from "react";
import { X } from "lucide-react";
import { SegmentsApi, type SegmentRules } from "@/lib/api/segments";
import { cn } from "@/lib/utils/cn";

const TIERS = ["SILVER", "GOLD", "PLATINUM"] as const;

const numOrUndef = (v: string) => (v.trim() === "" ? undefined : Math.max(0, Number(v)));

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-sans font-bold text-[12px] uppercase tracking-[0.48px] text-[#3f4b5e]">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        placeholder={placeholder ?? "Any"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] outline-none focus:border-[#1c3a66]"
      />
    </label>
  );
}

function Tri({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  const opts: [string, boolean | undefined][] = [["Any", undefined], ["Yes", true], ["No", false]];
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans font-bold text-[12px] uppercase tracking-[0.48px] text-[#3f4b5e]">{label}</span>
      <div className="grid grid-cols-3 gap-1 bg-[#f5f7fa] p-1 rounded-[12px]">
        {opts.map(([t, v]) => (
          <button key={t} type="button" onClick={() => onChange(v)} className={cn("h-8 rounded-[8px] font-sans font-bold text-[13px]", value === v ? "bg-white text-[#0f2340] shadow-2xs" : "text-[#3f4b5e]")}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SegmentBuilderModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tiers, setTiers] = React.useState<SegmentRules["tiers"]>([]);
  const [f, setF] = React.useState({ minSpend: "", maxSpend: "", minVisits: "", maxVisits: "", orderedWithin: "", notOrderedFor: "", joinedWithin: "" });
  const [club, setClub] = React.useState<boolean | undefined>();
  const [wallet, setWallet] = React.useState<boolean | undefined>();
  const [preview, setPreview] = React.useState<{ memberCount: number; totalCustomers: number; sample: { id: string; name: string; code: string }[] } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const rules = React.useMemo<SegmentRules>(() => {
    const r: SegmentRules = {
      tiers: tiers && tiers.length ? tiers : undefined,
      minLifetimeSpend: numOrUndef(f.minSpend),
      maxLifetimeSpend: numOrUndef(f.maxSpend),
      minVisits: numOrUndef(f.minVisits),
      maxVisits: numOrUndef(f.maxVisits),
      orderedWithinDays: numOrUndef(f.orderedWithin),
      notOrderedForDays: numOrUndef(f.notOrderedFor),
      joinedWithinDays: numOrUndef(f.joinedWithin),
      clubMember: club,
      hasWalletBalance: wallet,
    };
    return Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)) as SegmentRules;
  }, [f, tiers, club, wallet]);

  const hasRules = Object.keys(rules).length > 0;

  React.useEffect(() => {
    if (!open || !hasRules) return;
    const t = setTimeout(() => {
      SegmentsApi.preview(rules).then(setPreview).catch(() => setPreview(null));
    }, 400);
    return () => clearTimeout(t);
  }, [open, rules, hasRules]);

  if (!open) return null;

  const toggleTier = (t: (typeof TIERS)[number]) =>
    setTiers((cur) => (cur?.includes(t) ? cur.filter((x) => x !== t) : [...(cur ?? []), t]));
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hasRules) return;
    setBusy(true);
    setError(null);
    try {
      await SegmentsApi.create({ name: name.trim(), description: description.trim() || undefined, rules });
      onCreated();
      onClose();
      setName(""); setDescription(""); setTiers([]); setF({ minSpend: "", maxSpend: "", minVisits: "", maxVisits: "", orderedWithin: "", notOrderedFor: "", joinedWithin: "" }); setClub(undefined); setWallet(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create segment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <form onSubmit={submit} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[16px] bg-white border border-[#dce2ea] shadow-xl">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#dce2ea]">
          <h3 className="font-sans font-extrabold text-[18px] text-[#0f2340]">Create segment</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full flex items-center justify-center text-[#7f8ca0] hover:bg-[#f5f7fa]"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] text-[#0f2340]">Name</span>
            <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekend regulars" className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] outline-none focus:border-[#1c3a66]" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] text-[#0f2340]">Description <span className="font-normal text-[#55647a]">(optional)</span></span>
            <input value={description} maxLength={200} onChange={(e) => setDescription(e.target.value)} className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] outline-none focus:border-[#1c3a66]" />
          </label>

          <div className="flex flex-col gap-1">
            <span className="font-sans font-bold text-[12px] uppercase tracking-[0.48px] text-[#3f4b5e]">Loyalty tier</span>
            <div className="flex gap-2">
              {TIERS.map((t) => (
                <button key={t} type="button" onClick={() => toggleTier(t)} className={cn("h-9 px-4 rounded-full border-[1.5px] font-sans font-bold text-[14px]", tiers?.includes(t) ? "bg-[#1c3a66] border-[#1c3a66] text-white" : "bg-white border-[#bcc6d3] text-[#0f2340]")}>
                  {t[0] + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Min lifetime spend (₹)" value={f.minSpend} onChange={set("minSpend")} />
            <Field label="Max lifetime spend (₹)" value={f.maxSpend} onChange={set("maxSpend")} />
            <Field label="Min orders" value={f.minVisits} onChange={set("minVisits")} />
            <Field label="Max orders" value={f.maxVisits} onChange={set("maxVisits")} />
            <Field label="Ordered in last (days)" value={f.orderedWithin} onChange={set("orderedWithin")} />
            <Field label="No order for (days)" value={f.notOrderedFor} onChange={set("notOrderedFor")} />
            <Field label="Joined in last (days)" value={f.joinedWithin} onChange={set("joinedWithin")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tri label="BRUVI Club member" value={club} onChange={setClub} />
            <Tri label="Has wallet balance" value={wallet} onChange={setWallet} />
          </div>

          <div className="rounded-[12px] bg-[#f5f7fa] px-4 py-3 font-sans text-[14px] text-[#0f2340]">
            {!hasRules ? (
              <span className="text-[#55647a]">Add at least one rule to preview matching customers.</span>
            ) : preview ? (
              <>
                <b>{preview.memberCount}</b> of {preview.totalCustomers} customers match
                {preview.sample.length > 0 && <span className="text-[#55647a]"> · {preview.sample.map((s) => s.name).join(", ")}</span>}
              </>
            ) : (
              <span className="text-[#55647a]">Calculating…</span>
            )}
          </div>
          {error && <p className="font-sans text-[12px] font-bold text-[#c0352b]">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-[#dce2ea] flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-[12px] border-[1.5px] border-[#bcc6d3] font-sans font-bold text-[14px] text-[#0f2340]">Cancel</button>
          <button type="submit" disabled={busy || !name.trim() || !hasRules} className="h-10 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white disabled:opacity-50">{busy ? "Saving..." : "Create segment"}</button>
        </div>
      </form>
    </div>
  );
}
