"use client";

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CouponChannel, CouponInput, CouponOptions, CouponServiceType } from "@/lib/api/coupons";

/** Figma 474:243683 rows: label column 120px, 16px gap, 106px rows split by a hairline. */
function Row({ label, hint, children, last }: { label: string; hint: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn("flex items-center gap-4 min-h-[106px] py-4", !last && "border-b border-[#dce2ea]")}>
      <div className="w-[120px] shrink-0 flex flex-col">
        <span className="text-[14px] leading-5 font-bold text-[#0f2340] font-manrope">{label}</span>
        <span className="text-[12px] leading-4 font-medium text-[#3f4b5e] font-manrope">{hint}</span>
      </div>
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/** Segmented control (Figma 474:243689): subtle track, white raised selection. */
function Segmented<T extends string>({ value, options, onChange, disabled }: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex gap-[2px] p-[3px] rounded-[12px] bg-[#f5f7fa] border border-[#dce2ea]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(o.id)}
          className={cn(
            "h-8 px-3 rounded-[12px] text-[14px] leading-5 font-bold font-manrope transition-colors cursor-pointer disabled:cursor-not-allowed",
            value === o.id
              ? "bg-white text-[#0f2340] shadow-[0_1px_2px_rgba(15,35,64,0.06),0_2px_8px_rgba(15,35,64,0.06)]"
              : "text-[#3f4b5e] hover:text-[#0f2340]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const pill = "h-9 px-[13px] rounded-[12px] border border-[#bcc6d3] bg-white inline-flex items-center gap-2 text-[14px] font-manrope text-[#0f2340]";
const numberInput = "bg-transparent outline-none font-bold tnum text-[#0f2340] text-[14px] placeholder:text-[#7f8ca0] placeholder:font-normal";
const textInput = "h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-[14px] font-manrope text-[#0f2340] placeholder:text-[#7f8ca0] outline-none focus:border-[#1c3a66]";

const DAYS: { id: number; label: string }[] = [
  { id: 1, label: "Mon" }, { id: 2, label: "Tue" }, { id: 3, label: "Wed" }, { id: 4, label: "Thu" },
  { id: 5, label: "Fri" }, { id: 6, label: "Sat" }, { id: 0, label: "Sun" },
];
const CHANNELS: { id: CouponChannel; label: string }[] = [
  { id: "APP", label: "App" }, { id: "KIOSK", label: "Kiosk" }, { id: "COUNTER", label: "Counter" }, { id: "QR", label: "Dine-in QR" },
];
const SERVICES: { id: CouponServiceType; label: string }[] = [
  { id: "PICKUP", label: "Pickup" }, { id: "DINE_IN", label: "Dine-in" }, { id: "DELIVERY", label: "Delivery" },
];

function toNum(v: string): number | null {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return v.trim() === "" || Number.isNaN(n) ? null : n;
}

function clock(t: string) {
  const [h, m] = t.split(":").map(Number);
  const s = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${s}`;
}

/** Toggle-able check row item (Figma Channels row). */
function CheckItem({ checked, label, onToggle }: { checked: boolean; label: string; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="inline-flex items-center gap-2 h-9 pr-3 cursor-pointer font-manrope">
      <span
        className={cn(
          "h-5 w-5 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors",
          checked ? "bg-[#1c3a66] border-[#1c3a66]" : "bg-white border-[#7f8ca0]",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
      </span>
      <span className={cn("text-[14px] leading-5", checked ? "font-bold text-[#0f2340]" : "text-[#3f4b5e]")}>{label}</span>
    </button>
  );
}

function ScopePicker({ value, options, onChange }: {
  value: CouponInput["scope"];
  options: CouponOptions | null;
  onChange: (s: CouponInput["scope"]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const cats = options?.categories ?? [];
  const prods = options?.products ?? [];
  let label = "All items";
  if (value.type === "CATEGORY") {
    const picked = cats.filter((c) => value.categoryIds.includes(c.id));
    const items = picked.reduce((a, c) => a + c.productCount, 0);
    label = picked.length === 1 ? `${picked[0].name} category · ${items} items` : `${picked.length} categories · ${items} items`;
  } else if (value.type === "PRODUCTS") {
    const picked = prods.filter((p) => value.productIds.includes(p.id));
    label = picked.length === 1 ? picked[0].name : `${picked.length} items`;
  }
  const scoped = value.type !== "ALL";
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const filteredProducts = prods.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-9 px-[13px] rounded-[12px] border inline-flex items-center gap-2 text-[14px] leading-5 font-bold font-manrope cursor-pointer",
          scoped ? "bg-[#ebf1de] border-[#566f2c] text-[#566f2c]" : "bg-white border-[#bcc6d3] text-[#0f2340]",
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-[340px] max-h-[380px] overflow-hidden flex flex-col rounded-[16px] bg-white border border-[#dce2ea] shadow-[0_8px_24px_rgba(15,35,64,0.12)]">
          <div className="p-3 border-b border-[#dce2ea]">
            <Segmented
              value={value.type}
              options={[{ id: "ALL", label: "All items" }, { id: "CATEGORY", label: "Categories" }, { id: "PRODUCTS", label: "Items" }]}
              onChange={(type) => onChange({ ...value, type })}
            />
          </div>
          <div className="overflow-y-auto p-2">
            {value.type === "ALL" && (
              <p className="p-2 text-[14px] text-[#3f4b5e] font-manrope">The offer applies to the whole order.</p>
            )}
            {value.type === "CATEGORY" &&
              (cats.length === 0 ? (
                <p className="p-2 text-[14px] text-[#55647a] font-manrope">No active categories.</p>
              ) : (
                cats.map((c) => (
                  <CheckItem
                    key={c.id}
                    checked={value.categoryIds.includes(c.id)}
                    label={`${c.name} · ${c.productCount}`}
                    onToggle={() => onChange({ ...value, categoryIds: toggle(value.categoryIds, c.id) })}
                  />
                ))
              ))}
            {value.type === "PRODUCTS" && (
              <>
                <div className="relative m-1 mb-2">
                  <Search className="h-4 w-4 text-[#7f8ca0] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items" className={cn(textInput, "w-full pl-9")} />
                </div>
                {filteredProducts.map((p) => (
                  <div key={p.id} className="block">
                    <CheckItem
                      checked={value.productIds.includes(p.id)}
                      label={p.name}
                      onToggle={() => onChange({ ...value, productIds: toggle(value.productIds, p.id) })}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  value: CouponInput;
  onChange: (next: CouponInput) => void;
  options: CouponOptions | null;
  /** Code is fixed once customers have used it. */
  codeLocked?: boolean;
  currentId?: string;
  showBasics?: boolean;
}

/** The coupon configuration card (Figma 474:243683), shared by create and detail pages. */
export function CouponEditor({ value, onChange, options, codeLocked, currentId, showBasics = true }: Props) {
  const set = <K extends keyof CouponInput>(k: K, v: CouponInput[K]) => onChange({ ...value, [k]: v });
  const otherCodes = (options?.coupons ?? []).filter((c) => c.id !== currentId).map((c) => c.code);
  const offerHint =
    value.offerType === "BOGO" ? "Cheaper item free" :
    value.offerType === "FREE_ITEM" ? "Cheapest item free" :
    value.offerType === "PERCENT" ? "Percent off" : "Amount off";

  return (
    <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] px-[25px] py-[9px]">
      {showBasics && (
        <Row label="Code" hint="What customers type">
          <input
            value={value.code}
            disabled={codeLocked}
            onChange={(e) => set("code", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32))}
            placeholder="MATCHA2X"
            className={cn(textInput, "w-[160px] font-archivo font-extrabold tracking-[0.4px] disabled:bg-[#f5f7fa] disabled:text-[#55647a]")}
          />
          <input
            value={value.title}
            onChange={(e) => set("title", e.target.value.slice(0, 64))}
            placeholder="Title customers see, e.g. Matcha BOGO"
            className={cn(textInput, "flex-1 min-w-[200px]")}
          />
          <input
            value={value.description}
            onChange={(e) => set("description", e.target.value.slice(0, 160))}
            placeholder="Subtitle, e.g. Buy one matcha, get the cheaper one free"
            className={cn(textInput, "w-full")}
          />
          {codeLocked && <span className="text-[12px] text-[#3f4b5e] font-manrope">Code is locked after the first redemption.</span>}
        </Row>
      )}

      <Row label="Offer" hint={offerHint}>
        <Segmented
          value={value.offerType}
          options={[{ id: "PERCENT", label: "% off" }, { id: "FLAT", label: "₹ off" }, { id: "BOGO", label: "BOGO" }, { id: "FREE_ITEM", label: "Free item" }]}
          onChange={(offerType) =>
            onChange({
              ...value,
              offerType,
              percentOff: offerType === "PERCENT" ? value.percentOff ?? 10 : value.percentOff,
              amountOff: offerType === "FLAT" ? value.amountOff ?? 50 : value.amountOff,
            })
          }
        />
        {value.offerType === "PERCENT" && (
          <label className={pill}>
            <input className={cn(numberInput, "w-10 text-right")} value={value.percentOff ?? ""} onChange={(e) => set("percentOff", toNum(e.target.value))} />
            <span className="text-[#3f4b5e]">% off</span>
          </label>
        )}
        {value.offerType === "FLAT" && (
          <label className={pill}>
            <span className="text-[#3f4b5e]">₹</span>
            <input className={cn(numberInput, "w-14")} value={value.amountOff ?? ""} onChange={(e) => set("amountOff", toNum(e.target.value))} />
            <span className="text-[#3f4b5e]">off</span>
          </label>
        )}
        <span className="text-[14px] text-[#3f4b5e] font-manrope">on</span>
        <ScopePicker value={value.scope} options={options} onChange={(scope) => set("scope", scope)} />
        <label className={pill}>
          <span className="text-[#3f4b5e]">Min order ₹</span>
          <input className={cn(numberInput, "w-14")} value={value.minOrder || ""} placeholder="0" onChange={(e) => set("minOrder", toNum(e.target.value) ?? 0)} />
        </label>
        {value.offerType !== "FLAT" && (
          <label className={pill}>
            <span className="text-[#3f4b5e]">Max discount ₹</span>
            <input className={cn(numberInput, "w-14")} value={value.maxDiscount ?? ""} placeholder="none" onChange={(e) => set("maxDiscount", toNum(e.target.value))} />
          </label>
        )}
      </Row>

      <Row label="Valid" hint="Store local time">
        {DAYS.map((d) => {
          const all = value.validDays.length === 0;
          const on = all || value.validDays.includes(d.id);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                const current = all ? DAYS.map((x) => x.id) : value.validDays;
                const next = current.includes(d.id) ? current.filter((x) => x !== d.id) : [...current, d.id];
                set("validDays", next.length === 7 ? [] : next);
              }}
              className={cn(
                "h-9 min-w-[40px] px-2 rounded-[12px] border text-[14px] font-bold font-manrope cursor-pointer transition-colors",
                on ? "bg-[#1c3a66] border-[#1c3a66] text-white" : "bg-white border-[#bcc6d3] text-[#3f4b5e] font-medium",
              )}
            >
              {d.label}
            </button>
          );
        })}
        {value.window ? (
          <span className={cn(pill, "h-9 border-[1.5px] border-[#7f8ca0] font-bold ml-2")}>
            <input type="time" value={value.window.start} onChange={(e) => set("window", { ...value.window!, start: e.target.value })} className="bg-transparent outline-none font-bold tnum" aria-label="Window start" />
            <span>–</span>
            <input type="time" value={value.window.end} onChange={(e) => set("window", { ...value.window!, end: e.target.value })} className="bg-transparent outline-none font-bold tnum" aria-label="Window end" />
            <button type="button" aria-label="All day" onClick={() => set("window", null)} className="text-[#7f8ca0] hover:text-[#0f2340]"><X className="h-4 w-4" /></button>
          </span>
        ) : (
          <button type="button" onClick={() => set("window", { start: "14:00", end: "17:00" })} className={cn(pill, "ml-2 font-bold cursor-pointer hover:border-[#7f8ca0]")}>
            All day · add time window
          </button>
        )}
        <div className="w-full flex flex-wrap items-center gap-2 pt-1">
          <label className={pill}>
            <span className="text-[#3f4b5e]">From</span>
            <input type="date" value={value.startsAt ? value.startsAt.slice(0, 10) : ""} onChange={(e) => set("startsAt", e.target.value ? new Date(`${e.target.value}T00:00:00+05:30`).toISOString() : null)} className="bg-transparent outline-none font-bold" />
          </label>
          <label className={pill}>
            <span className="text-[#3f4b5e]">Until</span>
            <input type="date" value={value.endsAt ? value.endsAt.slice(0, 10) : ""} onChange={(e) => set("endsAt", e.target.value ? new Date(`${e.target.value}T23:59:59+05:30`).toISOString() : null)} className="bg-transparent outline-none font-bold" />
          </label>
          {value.window && (
            <span className="text-[12px] text-[#3f4b5e] font-manrope">{clock(value.window.start)} – {clock(value.window.end)} IST</span>
          )}
        </div>
      </Row>

      <Row label="Channels" hint="Where it works">
        {CHANNELS.map((c) => (
          <CheckItem
            key={c.id}
            checked={value.channels.includes(c.id)}
            label={c.label}
            onToggle={() => {
              const next = value.channels.includes(c.id) ? value.channels.filter((x) => x !== c.id) : [...value.channels, c.id];
              if (next.length) set("channels", next);
            }}
          />
        ))}
        <div className="w-full flex flex-wrap items-center gap-1">
          {SERVICES.map((s) => (
            <CheckItem
              key={s.id}
              checked={value.serviceTypes.includes(s.id)}
              label={s.label}
              onToggle={() => {
                const next = value.serviceTypes.includes(s.id) ? value.serviceTypes.filter((x) => x !== s.id) : [...value.serviceTypes, s.id];
                if (next.length) set("serviceTypes", next);
              }}
            />
          ))}
        </div>
      </Row>

      <Row label="Redemption" hint="How it's applied">
        <Segmented
          value={value.redemptionMode}
          options={[{ id: "CODE", label: "Code entry" }, { id: "AUTO", label: "Auto-apply" }]}
          onChange={(m) => set("redemptionMode", m)}
        />
        <span className="text-[12px] leading-4 text-[#3f4b5e] font-manrope">
          {value.redemptionMode === "CODE"
            ? `Customer enters ${value.code || "the code"} in app or at kiosk`
            : "Added to every eligible cart automatically; the customer can remove it"}
        </span>
      </Row>

      <Row label="Limits" hint="Auto-stops at cap">
        <span className={pill}>
          <input
            className={cn(numberInput, "w-8 text-center")}
            value={value.perCustomerLimit ?? ""}
            placeholder="∞"
            onChange={(e) => set("perCustomerLimit", toNum(e.target.value))}
          />
          <select
            value={value.perCustomerPeriod}
            onChange={(e) => set("perCustomerPeriod", e.target.value as CouponInput["perCustomerPeriod"])}
            className="bg-transparent outline-none text-[14px] cursor-pointer"
          >
            <option value="DAY">per customer per day</option>
            <option value="LIFETIME">per customer, ever</option>
          </select>
        </span>
        <label className={pill}>
          <span>Budget cap</span>
          <span className="font-bold">₹</span>
          <input className={cn(numberInput, "w-20 font-extrabold font-archivo")} value={value.budget ?? ""} placeholder="none" onChange={(e) => set("budget", toNum(e.target.value))} />
        </label>
        <label className={pill}>
          <span>Total uses</span>
          <input className={cn(numberInput, "w-16")} value={value.maxRedemptions ?? ""} placeholder="∞" onChange={(e) => set("maxRedemptions", toNum(e.target.value))} />
        </label>
        {value.budget != null && (
          <span className="text-[12px] text-[#3f4b5e] font-manrope inline-flex items-center gap-1">
            Alert at
            <input className="w-8 bg-transparent outline-none font-bold text-center border-b border-[#bcc6d3]" value={value.budgetAlertPct} onChange={(e) => set("budgetAlertPct", Math.min(100, Math.max(1, toNum(e.target.value) ?? 80)))} />
            % of budget
          </span>
        )}
      </Row>

      <Row label="Stacking" hint="With other offers" last>
        <span className="text-[14px] text-[#3f4b5e] font-manrope">Not with</span>
        {otherCodes.length === 0 ? (
          <span className="text-[12px] text-[#7f8ca0] font-manrope">other coupons</span>
        ) : (
          <>
            {otherCodes.slice(0, 2).map((c) => (
              <span key={c} className="h-6 px-2 inline-flex items-center rounded-[4px] bg-[#fce8e6] text-[12px] font-bold text-[#c0352b] font-manrope">{c}</span>
            ))}
            {otherCodes.length > 2 && (
              <span className="text-[12px] text-[#3f4b5e] font-manrope">+{otherCodes.length - 2} more</span>
            )}
          </>
        )}
        <span className="text-[14px] text-[#3f4b5e] font-manrope">· Allowed with</span>
        {([
          ["stackWithLoyalty", "Loyalty points earn"],
          ["stackWithClub", "BRUVI Club"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => set(k, !value[k])}
            title={value[k] ? "Click to disallow" : "Click to allow"}
            className={cn(
              "h-6 px-2 inline-flex items-center rounded-[4px] text-[12px] font-bold font-manrope cursor-pointer",
              value[k] ? "bg-[#e3f4ea] text-[#1f7a4d]" : "bg-[#f5f7fa] text-[#7f8ca0] line-through",
            )}
          >
            {label}
          </button>
        ))}
      </Row>
    </div>
  );
}
