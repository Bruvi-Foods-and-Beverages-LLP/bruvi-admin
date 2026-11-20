"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { ApiClientError } from "@/lib/api/client";
import {
  inr,
  MembershipApi,
  periodWord,
  type AdminOptionsDto,
  type AdminPlanDto,
  type BenefitInput,
  type BenefitKind,
  type PlanInput,
} from "@/lib/api/membership";
import { cn } from "@/lib/utils/cn";
import { PageHeading, Panel, Shimmer, StateNotice, Toast, primaryButtonClass, secondaryButtonClass } from "./primitives";

const KIND_LABEL: Record<BenefitKind, string> = {
  DAILY_DRINK: "Free drink every day",
  PERCENT_OFF: "% off",
  LAB_TASTING: "LAB tasting",
  BIRTHDAY_DRINK: "Birthday drink",
  PRIORITY_PICKUP: "Priority pickup",
  FREE_SIZE_UPGRADE: "Free size upgrade",
};

const DEFAULT_BENEFIT: Record<BenefitKind, BenefitInput> = {
  DAILY_DRINK: { kind: "DAILY_DRINK", title: "1 drink / day", detail: "Regular size · resets 4 am", perDay: 1, maxValuePaise: 32000, categoryIds: null },
  PERCENT_OFF: { kind: "PERCENT_OFF", title: "10% off food", detail: "No cap", percent: 10, capPaise: null, categoryIds: null },
  LAB_TASTING: { kind: "LAB_TASTING", title: "LAB tasting", detail: "1 flight / month · live batch", perMonth: 1 },
  BIRTHDAY_DRINK: { kind: "BIRTHDAY_DRINK", title: "Birthday drink", detail: "One free drink in your birthday week" },
  PRIORITY_PICKUP: { kind: "PRIORITY_PICKUP", title: "Priority pickup", detail: "When the store is busy" },
  FREE_SIZE_UPGRADE: { kind: "FREE_SIZE_UPGRADE", title: "Free size upgrade", detail: "On every drink" },
};

export const EMPTY_PLAN: PlanInput = {
  name: "",
  badge: null,
  subtitle: "",
  description: null,
  valueNote: null,
  period: "MONTH",
  pricePaise: 0,
  taxRatePercent: 5,
  taxInclusive: true,
  trialDays: 0,
  allStores: true,
  storeIds: [],
  cancellationPolicy: "",
  displayOrder: 0,
  expectedDrinksPerDay: 0,
  drinkCostPaise: 0,
  otherCostPaise: 0,
  benefits: [],
};

export function planToInput(p: AdminPlanDto): PlanInput {
  return {
    name: p.name,
    badge: p.badge,
    subtitle: p.subtitle,
    description: p.description,
    valueNote: p.valueNote,
    period: p.period,
    pricePaise: p.pricePaise,
    taxRatePercent: p.taxRatePercent,
    taxInclusive: p.taxInclusive,
    trialDays: (p.trialDays as 0 | 7 | 14) ?? 0,
    allStores: p.allStores,
    storeIds: p.storeIds,
    cancellationPolicy: p.cancellationPolicy,
    displayOrder: p.displayOrder,
    expectedDrinksPerDay: p.expectedDrinksPerDay,
    drinkCostPaise: p.drinkCostPaise,
    otherCostPaise: p.otherCostPaise,
    benefits: p.benefits.map((b) => ({
      kind: b.kind,
      title: b.title,
      detail: b.detail,
      perDay: b.perDay,
      maxValuePaise: b.maxValuePaise,
      percent: b.percent,
      capPaise: b.capPaise,
      perMonth: b.perMonth,
      categoryIds: b.categoryIds,
    })),
  };
}

/** GST inside an inclusive price, half up (same as the backend). */
function inclusiveTax(price: number, rate: number) {
  const bp = Math.round(rate * 100);
  if (price <= 0 || bp <= 0) return 0;
  return Math.floor((2 * price * bp + (10_000 + bp)) / (2 * (10_000 + bp)));
}

export function unitEconomics(p: PlanInput) {
  const tax = p.taxInclusive ? inclusiveTax(p.pricePaise, p.taxRatePercent) : 0;
  const net = p.pricePaise - tax;
  const days = p.period === "YEAR" ? 365 : 30;
  const hasDrink = p.benefits.some((b) => b.kind === "DAILY_DRINK");
  const drinks = hasDrink ? Math.round(p.expectedDrinksPerDay * days * p.drinkCostPaise) : 0;
  const cost = drinks + p.otherCostPaise;
  return { tax, net, drinks, cost, margin: net - cost, marginPct: net > 0 ? Math.round(((net - cost) / net) * 100) : 0, hasDrink };
}

const field =
  "h-[52px] w-full rounded-md border-[1.5px] border-border-input bg-surface px-[18px] text-body text-text outline-none placeholder:text-gray-400 focus:border-2 focus:border-focus focus:ring-4 focus:ring-focus-halo disabled:bg-background-subtle disabled:text-text-muted";

function Field({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="text-label text-text">{label}</span>
      {children}
      {hint && <span className="text-caption text-text-secondary">{hint}</span>}
    </label>
  );
}

function RupeeInput({ value, onChange, suffix, disabled, label }: { value: number; onChange: (paise: number) => void; suffix?: React.ReactNode; disabled?: boolean; label: string }) {
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-[18px] text-body text-text-secondary">₹</span>
      <input
        aria-label={label}
        className={cn(field, "pl-9 text-price-s", suffix ? "pr-24" : "")}
        inputMode="numeric"
        disabled={disabled}
        value={value ? (value / 100).toLocaleString("en-IN") : ""}
        placeholder="0"
        onChange={(e) => onChange(Math.round((Number(e.target.value.replace(/[^\d.]/g, "")) || 0) * 100))}
      />
      {suffix && <span className="absolute right-3">{suffix}</span>}
    </div>
  );
}

/** A111 Create / edit plan. */
export function PlanEditor({ plan, options }: { plan: AdminPlanDto | null; options: AdminOptionsDto }) {
  const router = useRouter();
  const [form, setForm] = React.useState<PlanInput>(plan ? planToInput(plan) : EMPTY_PLAN);
  const [launchAt, setLaunchAt] = React.useState<string>(plan?.launchAt ? plan.launchAt.slice(0, 10) : "");
  const [saving, setSaving] = React.useState<null | "draft" | "publish">(null);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [editing, setEditing] = React.useState<number | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const readOnly = !options.canWrite;
  const isLive = plan?.status === "LIVE";

  const set = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };
  const setBenefit = (i: number, patch: Partial<BenefitInput>) => {
    setForm((f) => ({ ...f, benefits: f.benefits.map((b, j) => (j === i ? { ...b, ...patch } : b)) }));
    setDirty(true);
  };

  // Warn before leaving with unsaved changes
  React.useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const econ = unitEconomics(form);
  const perMonth = form.period === "YEAR" ? Math.round(form.pricePaise / 12) : form.pricePaise;
  const daily = options.plans.find((p) => /club daily/i.test(p.name));
  const comparison = form.period === "YEAR" && daily ? daily : null;
  const [dailyPrice, setDailyPrice] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (comparison) MembershipApi.plan(comparison.id).then((p) => setDailyPrice(p.period === "MONTH" ? p.pricePaise : null)).catch(() => setDailyPrice(null));
  }, [comparison]);
  const saveVsMonthly = dailyPrice && form.period === "YEAR" && form.pricePaise > 0 ? Math.round((1 - form.pricePaise / (dailyPrice * 12)) * 100) : null;

  const validation =
    !form.name.trim() ? "Add a plan name" : form.pricePaise < 100 ? "Set a price of at least ₹1" : form.benefits.length === 0 ? "Add at least one benefit" : !form.allStores && form.storeIds.length === 0 ? "Pick at least one store" : null;

  const save = async (mode: "draft" | "publish") => {
    if (validation) {
      setError(validation);
      return;
    }
    setSaving(mode);
    setError(null);
    try {
      const scheduled = mode === "publish" && launchAt && new Date(`${launchAt}T00:00:00+05:30`) > new Date();
      const launchIso = scheduled ? new Date(`${launchAt}T00:00:00+05:30`).toISOString() : null;
      let saved: AdminPlanDto;
      if (plan) {
        saved = await MembershipApi.updatePlan(plan.id, form);
        if (mode === "publish" && saved.status !== "LIVE") saved = await MembershipApi.publishPlan(plan.id, launchIso);
      } else {
        saved = await MembershipApi.createPlan({ ...form, status: mode === "draft" ? "DRAFT" : scheduled ? "SCHEDULED" : "LIVE", launchAt: launchIso });
      }
      setDirty(false);
      setSavedAt(new Date());
      if (mode === "publish" || !plan) router.push(`/subscriptions/plans/${saved.id}`);
      else setToast("Draft saved");
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : "Could not save the plan");
    } finally {
      setSaving(null);
    }
  };

  const duplicateFrom = async () => {
    if (!daily) return;
    try {
      const src = await MembershipApi.plan(daily.id);
      const copy = planToInput(src);
      setForm({ ...copy, name: form.name || `${src.name} copy` });
      setDirty(true);
      setToast(`Copied price, benefits and rules from ${src.name}`);
    } catch {
      setError("Could not load Club Daily");
    }
  };

  const publishLabel = isLive ? "Save changes" : launchAt && new Date(`${launchAt}T00:00:00+05:30`) > new Date() ? `Schedule launch · ${new Date(launchAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : "Publish now";
  const timeLabel = savedAt?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();

  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-28">
      <PageHeading
        breadcrumb={[
          { label: "Subscriptions", href: "/subscriptions" },
          { label: "Plans", href: "/subscriptions" },
          { label: plan ? plan.name : "New plan" },
        ]}
        title={plan ? "Edit plan" : "Create plan"}
        actions={
          <>
            <button type="button" className={secondaryButtonClass} onClick={() => setPreviewOpen(true)}>
              Preview in app
            </button>
            {daily && !plan && (
              <button type="button" className={secondaryButtonClass} onClick={duplicateFrom} disabled={readOnly}>
                Duplicate from {daily.name}
              </button>
            )}
          </>
        }
      />

      {readOnly && (
        <StateNotice kind="forbidden" title="View only" description="Your role can view plans but not change them." className="py-6" />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[712fr_400fr]">
        <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-4">
          <Panel className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-heading-s text-text">Plan basics</h2>
              <p className="text-caption text-text-secondary">
                {form.pricePaise > 0
                  ? `${inr(perMonth)}/month${saveVsMonthly != null && dailyPrice ? ` — ${saveVsMonthly}% cheaper than 12 × ${daily?.name} (${inr(dailyPrice * 12)})` : ""}`
                  : "Name, price including GST and trial"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Plan name">
                <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Club Annual" maxLength={64} />
              </Field>
              <Field label="Price (incl. GST)">
                <RupeeInput
                  label="Price including GST"
                  value={form.pricePaise}
                  onChange={(v) => set("pricePaise", v)}
                  suffix={
                    <span className="relative inline-flex items-center">
                      <select
                        aria-label="Billing period"
                        className="appearance-none bg-transparent pr-5 text-body text-text-secondary outline-none"
                        value={form.period}
                        onChange={(e) => set("period", e.target.value as PlanInput["period"])}
                      >
                        <option value="MONTH">per month</option>
                        <option value="YEAR">per year</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-text-secondary" aria-hidden />
                    </span>
                  }
                />
              </Field>
              <Field label="Free trial">
                <div role="radiogroup" aria-label="Free trial" className="flex h-[52px] items-center gap-1 rounded-md bg-background-subtle p-1">
                  {([0, 7, 14] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={form.trialDays === d}
                      onClick={() => set("trialDays", d)}
                      className={cn("h-full flex-1 rounded-sm text-label-semi", form.trialDays === d ? "bg-surface text-text shadow-raised" : "text-text-secondary hover:text-text")}
                    >
                      {d === 0 ? "None" : `${d} days`}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tagline in the app" hint="Shown under the plan name">
                <input className={field} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="1 drink a day + 15% off food" maxLength={140} />
              </Field>
              <Field label="Badge (optional)" hint="e.g. BEST VALUE">
                <input className={field} value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value || null)} maxLength={24} />
              </Field>
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-s text-text">Benefits</h2>
              <div className="relative">
                <button type="button" className="flex items-center gap-1 text-label text-primary hover:underline" onClick={() => setAddOpen((o) => !o)} aria-expanded={addOpen}>
                  <Plus className="h-4 w-4" aria-hidden /> Add benefit
                </button>
                {addOpen && (
                  <ul className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-border bg-surface p-1 shadow-floating" role="menu">
                    {(Object.keys(KIND_LABEL) as BenefitKind[]).map((k) => (
                      <li key={k}>
                        <button
                          type="button"
                          role="menuitem"
                          className="w-full rounded-sm px-3 py-2 text-left text-body-s text-text hover:bg-background-subtle"
                          onClick={() => {
                            setForm((f) => ({ ...f, benefits: [...f.benefits, { ...DEFAULT_BENEFIT[k] }] }));
                            setEditing(form.benefits.length);
                            setAddOpen(false);
                            setDirty(true);
                          }}
                        >
                          {KIND_LABEL[k]}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {form.benefits.length === 0 ? (
              <p className="rounded-md border border-dashed border-border-input p-6 text-center text-body-s text-text-muted">No benefits yet · add what members get</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {form.benefits.map((b, i) => (
                  <button
                    key={`${b.kind}-${i}`}
                    type="button"
                    onClick={() => setEditing(editing === i ? null : i)}
                    aria-expanded={editing === i}
                    className={cn(
                      "flex min-h-[64px] items-start gap-3 rounded-md border-[1.5px] px-3 py-3 text-left",
                      editing === i ? "border-focus bg-surface-brand" : "border-border-input bg-surface hover:bg-background-subtle",
                    )}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary text-on-primary" aria-hidden>
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-label text-text">{b.title}</span>
                      <span className="truncate text-caption text-text-secondary">{b.detail || KIND_LABEL[b.kind]}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {editing != null && form.benefits[editing] && (
              <BenefitForm
                benefit={form.benefits[editing]}
                options={options}
                onChange={(patch) => setBenefit(editing, patch)}
                onRemove={() => {
                  setForm((f) => ({ ...f, benefits: f.benefits.filter((_, j) => j !== editing) }));
                  setEditing(null);
                  setDirty(true);
                }}
                onClose={() => setEditing(null)}
              />
            )}
          </Panel>

          <Panel className="flex flex-col gap-4 p-5">
            <h2 className="text-heading-s text-text">Billing &amp; rules</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Billing" hint={`UPI Autopay or card · renews ${form.period === "YEAR" ? "yearly" : "monthly"}`}>
                <select className={field} value="RAZORPAY" disabled aria-readonly>
                  <option value="RAZORPAY">Razorpay Subscriptions</option>
                </select>
              </Field>
              <Field label="Eligible stores" hint={form.allStores ? "Includes future stores" : `${form.storeIds.length} selected`}>
                <StorePicker options={options} allStores={form.allStores} storeIds={form.storeIds} onChange={(all, ids) => { set("allStores", all); set("storeIds", ids); }} />
              </Field>
              <Field label="Tax" hint={`CGST ${form.taxRatePercent / 2}% + SGST ${form.taxRatePercent / 2}% · ${inr(econ.tax)} tax`}>
                <select className={field} value={`${form.taxRatePercent}:${form.taxInclusive}`} onChange={(e) => { const [r, inc] = e.target.value.split(":"); set("taxRatePercent", Number(r)); set("taxInclusive", inc === "true"); }}>
                  <option value="5:true">GST 5% inclusive</option>
                  <option value="18:true">GST 18% inclusive</option>
                  <option value="0:true">No GST</option>
                </select>
              </Field>
            </div>
            <Field label="Cancellation policy">
              <input className={field} value={form.cancellationPolicy} onChange={(e) => set("cancellationPolicy", e.target.value)} maxLength={400} placeholder="Cancel any time; benefits run to the end of the paid period." />
            </Field>
            {!isLive && (
              <Field label="Launch date (optional)" hint="Leave empty to go live as soon as you publish" className="md:max-w-[240px]">
                <input type="date" className={field} value={launchAt} min={new Date().toISOString().slice(0, 10)} onChange={(e) => { setLaunchAt(e.target.value); setDirty(true); }} />
              </Field>
            )}
          </Panel>
        </fieldset>

        <div className="flex flex-col gap-4">
          <PlanPreview form={form} saveVsMonthly={saveVsMonthly} />
          <Panel className="flex flex-col gap-3 p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-heading-s text-text">Unit economics</h2>
              <span className="text-caption text-text-secondary">per member · {periodWord(form.period)}</span>
            </div>
            <Row label="Net revenue (ex-GST)" value={inr(econ.net)} />
            <Row
              label={
                econ.hasDrink ? (
                  <span className="flex flex-wrap items-center gap-1">
                    Drinks ·
                    <input aria-label="Expected drinks per day" disabled={readOnly} className="h-7 w-14 rounded-sm border border-border-input px-1 text-right text-body-s" value={form.expectedDrinksPerDay} inputMode="decimal" onChange={(e) => set("expectedDrinksPerDay", Math.min(5, Number(e.target.value) || 0))} />
                    /day × ₹
                    <input aria-label="Cost of one drink" disabled={readOnly} className="h-7 w-14 rounded-sm border border-border-input px-1 text-right text-body-s" value={form.drinkCostPaise / 100 || ""} inputMode="numeric" onChange={(e) => set("drinkCostPaise", Math.round((Number(e.target.value) || 0) * 100))} />
                  </span>
                ) : (
                  "Drinks · none in this plan"
                )
              }
              value={econ.drinks ? `−${inr(econ.drinks)}` : "₹0"}
            />
            <Row
              label={
                <span className="flex flex-wrap items-center gap-1">
                  Other benefits · fees · ₹
                  <input aria-label="Other cost per member" disabled={readOnly} className="h-7 w-20 rounded-sm border border-border-input px-1 text-right text-body-s" value={form.otherCostPaise / 100 || ""} inputMode="numeric" onChange={(e) => set("otherCostPaise", Math.round((Number(e.target.value) || 0) * 100))} />
                </span>
              }
              value={form.otherCostPaise ? `−${inr(form.otherCostPaise)}` : "₹0"}
            />
            <div className="border-t border-border" />
            <Row strong label="Expected cost / member" value={inr(econ.cost)} />
            <Row strong label="Contribution margin" value={`${inr(econ.margin)} · ${econ.marginPct}%`} tone={econ.margin >= 0 ? "success" : "error"} />
          </Panel>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface lg:left-[240px]">
        <div className="mx-auto flex max-w-[1136px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <span className="flex items-center gap-2 text-body-s text-text-secondary">
            {(dirty || savedAt) && <span className={cn("h-2 w-2 rounded-pill", dirty ? "bg-warning" : "bg-success")} aria-hidden />}
            {error ? <span className="text-error">{error}</span> : dirty ? `Unsaved changes${timeLabel ? ` · draft saved ${timeLabel}` : ""}` : timeLabel ? `Saved ${timeLabel}` : ""}
          </span>
          <div className="flex gap-2">
            <button type="button" className="h-9 px-4 text-label text-text hover:underline" onClick={() => router.push(plan ? `/subscriptions/plans/${plan.id}` : "/subscriptions")}>
              Cancel
            </button>
            {!isLive && (
              <button type="button" className={secondaryButtonClass} disabled={readOnly || saving != null} onClick={() => save("draft")}>
                {saving === "draft" ? "Saving…" : "Save draft"}
              </button>
            )}
            <button type="button" className={primaryButtonClass} disabled={readOnly || saving != null} onClick={() => save("publish")}>
              {saving === "publish" ? "Saving…" : publishLabel}
            </button>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-surface-inverse/40 p-4" role="dialog" aria-modal="true" aria-label="Preview in app" onClick={() => setPreviewOpen(false)}>
          <div className="flex w-[375px] max-w-full flex-col gap-3 rounded-xl bg-background-subtle p-4 shadow-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-overline-l text-text-secondary">Preview · BRUVI app</span>
              <button type="button" aria-label="Close preview" onClick={() => setPreviewOpen(false)} className="rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            <PlanPreview form={form} saveVsMonthly={saveVsMonthly} bare />
          </div>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function Row({ label, value, strong, tone }: { label: React.ReactNode; value: string; strong?: boolean; tone?: "success" | "error" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-body-s", strong ? "font-bold text-text" : "text-text-secondary")}>{label}</span>
      <span className={cn("shrink-0 text-price-xs", tone === "success" ? "text-success" : tone === "error" ? "text-error" : "text-text")}>{value}</span>
    </div>
  );
}

function PlanPreview({ form, saveVsMonthly, bare }: { form: PlanInput; saveVsMonthly: number | null; bare?: boolean }) {
  const perMonth = form.period === "YEAR" ? Math.round(form.pricePaise / 12) : null;
  const card = (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-inverse p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-heading-s font-extrabold text-text-inverse">{form.name || "Plan name"}</span>
        {(form.badge || saveVsMonthly) && (
          <span className="rounded-pill bg-brand-sky px-2 py-0.5 text-caption-bold text-on-accent">{form.badge || `Save ${saveVsMonthly}%`}</span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-price-l text-text-inverse">{inr(form.pricePaise)}</span>
        <span className="text-body-s text-text-inverse-secondary">
          / {periodWord(form.period)}
          {perMonth ? ` · ${inr(perMonth)}/mo` : ""}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {form.benefits.length === 0 && <li className="text-body-s text-text-inverse-muted">Benefits appear here</li>}
        {form.benefits.map((b, i) => (
          <li key={i} className="text-body-s text-text-inverse">
            ✓ {b.title}
          </li>
        ))}
        {form.trialDays > 0 && <li className="text-body-s text-text-inverse">✓ {form.trialDays}-day free trial</li>}
      </ul>
      <span className="mt-1 flex h-12 items-center justify-center rounded-md bg-brand-sky text-label text-on-accent">Join {form.name || "plan"}</span>
    </div>
  );
  if (bare) return card;
  return (
    <Panel className="flex flex-col gap-3 p-5">
      <span className="text-overline-l text-text-secondary">Preview · BRUVI app</span>
      {card}
    </Panel>
  );
}

function StorePicker({ options, allStores, storeIds, onChange }: { options: AdminOptionsDto; allStores: boolean; storeIds: string[]; onChange: (all: boolean, ids: string[]) => void }) {
  const [open, setOpen] = React.useState(false);
  const label = allStores ? `All stores · ${options.stores.length}` : `${storeIds.length} of ${options.stores.length} stores`;
  return (
    <div className="relative">
      <button type="button" className={cn(field, "flex items-center justify-between text-left")} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="truncate">{label}</span>
        <ChevronDown className="h-4 w-4 text-text-secondary" aria-hidden />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-md border border-border bg-surface p-2 shadow-floating">
          <label className="flex items-center gap-2 rounded-sm px-2 py-2 text-body-s text-text hover:bg-background-subtle">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={allStores} onChange={(e) => onChange(e.target.checked, e.target.checked ? [] : storeIds)} />
            All stores (includes future stores)
          </label>
          {options.stores.map((s) => (
            <label key={s.id} className={cn("flex items-center gap-2 rounded-sm px-2 py-2 text-body-s hover:bg-background-subtle", allStores ? "text-text-muted" : "text-text")}>
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                disabled={allStores}
                checked={allStores || storeIds.includes(s.id)}
                onChange={(e) => onChange(false, e.target.checked ? [...storeIds, s.id] : storeIds.filter((x) => x !== s.id))}
              />
              {s.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function BenefitForm({
  benefit,
  options,
  onChange,
  onRemove,
  onClose,
}: {
  benefit: BenefitInput;
  options: AdminOptionsDto;
  onChange: (p: Partial<BenefitInput>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const small = "h-11 w-full rounded-md border-[1.5px] border-border-input bg-surface px-3 text-body-s text-text outline-none focus:border-focus focus:ring-4 focus:ring-focus-halo";
  const cats = benefit.categoryIds ?? null;
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background-subtle p-4">
      <div className="flex items-center justify-between">
        <span className="text-label text-text">{KIND_LABEL[benefit.kind]}</span>
        <div className="flex gap-2">
          <button type="button" onClick={onRemove} className="flex items-center gap-1 text-label text-error hover:underline">
            <Trash2 className="h-4 w-4" aria-hidden /> Remove
          </button>
          <button type="button" onClick={onClose} className="text-label text-primary hover:underline">
            Done
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-caption-bold text-text">Title</span>
          <input className={small} value={benefit.title} maxLength={80} onChange={(e) => onChange({ title: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-caption-bold text-text">Detail</span>
          <input className={small} value={benefit.detail} maxLength={140} onChange={(e) => onChange({ detail: e.target.value })} />
        </label>
        {benefit.kind === "DAILY_DRINK" && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">Drinks per day (resets 4 am)</span>
              <input className={small} type="number" min={1} max={5} value={benefit.perDay ?? 1} onChange={(e) => onChange({ perDay: Math.max(1, Math.min(5, Number(e.target.value) || 1)) })} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">Free up to (Regular price, ₹)</span>
              <input className={small} inputMode="numeric" value={(benefit.maxValuePaise ?? 0) / 100 || ""} onChange={(e) => onChange({ maxValuePaise: Math.round((Number(e.target.value) || 0) * 100) || null })} />
            </label>
          </>
        )}
        {benefit.kind === "PERCENT_OFF" && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">Percent off</span>
              <input className={small} type="number" min={1} max={100} value={benefit.percent ?? 10} onChange={(e) => onChange({ percent: Math.max(1, Math.min(100, Number(e.target.value) || 1)) })} />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-caption-bold text-text">Cap per order (₹, empty = no cap)</span>
              <input className={small} inputMode="numeric" value={(benefit.capPaise ?? 0) / 100 || ""} onChange={(e) => onChange({ capPaise: Math.round((Number(e.target.value) || 0) * 100) || null })} />
            </label>
          </>
        )}
        {benefit.kind === "LAB_TASTING" && (
          <label className="flex flex-col gap-1">
            <span className="text-caption-bold text-text">Flights per month</span>
            <input className={small} type="number" min={1} max={10} value={benefit.perMonth ?? 1} onChange={(e) => onChange({ perMonth: Math.max(1, Number(e.target.value) || 1) })} />
          </label>
        )}
      </div>
      {(benefit.kind === "DAILY_DRINK" || benefit.kind === "PERCENT_OFF") && (
        <div className="flex flex-col gap-2">
          <span className="text-caption-bold text-text">Applies to</span>
          <div className="flex flex-wrap gap-2">
            <Chip active={!cats || cats.length === 0} onClick={() => onChange({ categoryIds: null })}>
              Everything
            </Chip>
            {options.categories.map((c) => {
              const on = !!cats?.includes(c.id);
              return (
                <Chip key={c.id} active={on} onClick={() => onChange({ categoryIds: on ? (cats ?? []).filter((x) => x !== c.id) : [...(cats ?? []), c.id] })}>
                  {c.name}
                </Chip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn("h-8 rounded-pill border px-3 text-label-semi", active ? "border-primary bg-primary text-on-primary" : "border-border-input bg-surface text-text hover:bg-background-subtle")}
    >
      {children}
    </button>
  );
}

export function PlanEditorSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
      <Shimmer className="h-16 w-80" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[712fr_400fr]">
        <div className="flex flex-col gap-4">
          <Shimmer className="h-40 rounded-lg" />
          <Shimmer className="h-32 rounded-lg" />
          <Shimmer className="h-56 rounded-lg" />
        </div>
        <Shimmer className="h-80 rounded-lg" />
      </div>
    </div>
  );
}
