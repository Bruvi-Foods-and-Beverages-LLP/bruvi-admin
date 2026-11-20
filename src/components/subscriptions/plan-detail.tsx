"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ApiClientError } from "@/lib/api/client";
import {
  inr,
  inrCompact,
  MembershipApi,
  periodWord,
  type AdminOptionsDto,
  type AdminPlanCardDto,
  type AdminPlanDto,
  type PlanActivityDto,
  type PlanOverviewDto,
} from "@/lib/api/membership";
import { useAppDispatch } from "@/store";
import { setSubscriberFilters, clearSubscriberFilters, fetchMembershipOptions, fetchSubscribers, type LoadError } from "@/store/slices/membership-slice";
import { cn } from "@/lib/utils/cn";
import { unitEconomics, planToInput } from "./plan-editor";
import { LoadErrorNotice, PageHeading, Panel, PlanStatusPill, Shimmer, StateNotice, Toast, UnderlineTabs, primaryButtonClass, secondaryButtonClass } from "./primitives";
import { SubscribersTable } from "./subscribers-view";

type Tab = "overview" | "members" | "benefits" | "activity";

function toError(e: unknown): LoadError {
  return {
    message: e instanceof Error ? e.message : "Could not load",
    forbidden: e instanceof ApiClientError && e.statusCode === 403,
    offline: typeof navigator !== "undefined" && !navigator.onLine,
  };
}

/** A112 Plan detail. */
export function PlanDetail({ planId }: { planId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = React.useState<Tab>("overview");
  const [plan, setPlan] = React.useState<AdminPlanDto | null>(null);
  const [card, setCard] = React.useState<AdminPlanCardDto | null>(null);
  const [overview, setOverview] = React.useState<PlanOverviewDto | null>(null);
  const [options, setOptions] = React.useState<AdminOptionsDto | null>(null);
  const [error, setError] = React.useState<LoadError | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<{ m: string; tone: "success" | "error" } | null>(null);

  const load = React.useCallback(() => {
    Promise.all([MembershipApi.plan(planId), MembershipApi.planOverview(planId), MembershipApi.plans(), MembershipApi.options()])
      .then(([p, o, cards, opts]) => {
        setError(null);
        setPlan(p);
        setOverview(o);
        setCard(cards.find((c) => c.id === planId) ?? null);
        setOptions(opts);
      })
      .catch((e) => setError(toError(e)));
  }, [planId]);
  React.useEffect(() => load(), [load]);
  React.useEffect(() => {
    if (tab !== "members") return;
    dispatch(clearSubscriberFilters());
    dispatch(setSubscriberFilters({ planId }));
    dispatch(fetchMembershipOptions());
    dispatch(fetchSubscribers());
  }, [tab, planId, dispatch]);

  if (error) return <LoadErrorNotice error={error} onRetry={load} what="this plan" />;
  if (!plan || !overview) {
    return (
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6">
        <Shimmer className="h-24 w-96" />
        <Shimmer className="h-9" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
          <Shimmer className="h-[380px] rounded-lg" />
          <Shimmer className="h-[305px] rounded-lg" />
        </div>
      </div>
    );
  }

  const canWrite = options?.canWrite ?? false;
  const act = async (fn: () => Promise<AdminPlanDto>, ok: string) => {
    setBusy(true);
    try {
      setPlan(await fn());
      setToast({ m: ok, tone: "success" });
    } catch (e) {
      setToast({ m: e instanceof Error ? e.message : "That didn't work", tone: "error" });
    } finally {
      setBusy(false);
    }
  };
  const live = plan.status === "LIVE";

  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4">
        <PageHeading
          breadcrumb={[{ label: "Subscriptions", href: "/subscriptions" }, { label: "Plans", href: "/subscriptions" }]}
          title={plan.name}
          meta={
            <>
              <PlanStatusPill status={plan.status} label={live && plan.liveSinceFormatted && !plan.signupsPaused ? `Live · since ${plan.liveSinceFormatted}` : plan.statusLabel} />
              <span>
                {inr(plan.pricePaise)} / {periodWord(plan.period)}
                {plan.benefitSummary && ` · ${plan.benefitSummary}`}
              </span>
            </>
          }
          actions={
            <>
              {live ? (
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={!canWrite || busy}
                  onClick={() =>
                    plan.signupsPaused
                      ? act(() => MembershipApi.resumeSignups(plan.id), "Sign-ups are open again")
                      : act(() => MembershipApi.pauseSignups(plan.id), "New sign-ups paused · members keep their plan")
                  }
                >
                  {plan.signupsPaused ? "Resume sign-ups" : "Pause new sign-ups"}
                </button>
              ) : (
                <button type="button" className={secondaryButtonClass} disabled={!canWrite || busy || plan.status === "ARCHIVED"} onClick={() => act(() => MembershipApi.publishPlan(plan.id), "Plan is live")}>
                  Publish now
                </button>
              )}
              <button type="button" className={primaryButtonClass} disabled={!canWrite || plan.status === "ARCHIVED"} onClick={() => router.push(`/subscriptions/plans/${plan.id}/edit`)}>
                Edit plan
              </button>
            </>
          }
        />
        <UnderlineTabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "members", label: "Members", count: (card?.activeCount ?? 0) + (card?.trialingCount ?? 0) },
            { value: "benefits", label: "Benefits & pricing" },
            { value: "activity", label: "Activity log" },
          ]}
        />
      </div>

      {tab === "overview" && <Overview plan={plan} overview={overview} onEditBenefits={canWrite ? () => router.push(`/subscriptions/plans/${plan.id}/edit`) : undefined} />}
      {tab === "members" && <SubscribersTable />}
      {tab === "benefits" && <BenefitsPricing plan={plan} overview={overview} options={options} />}
      {tab === "activity" && <Activity planId={plan.id} />}
      {toast && <Toast message={toast.m} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}

function Overview({ plan, overview, onEditBenefits }: { plan: AdminPlanDto; overview: PlanOverviewDto; onEditBenefits?: () => void }) {
  const max = Math.max(1, ...overview.growth.map((g) => g.active));
  const range = overview.growth.length ? `${overview.growth[0].label} – ${overview.growth[overview.growth.length - 1].label} ${overview.growth[overview.growth.length - 1].month.slice(0, 4)}` : "";
  const reasonColor = ["bg-error", "bg-warning", "bg-coffee-500", "bg-coffee-700", "bg-coffee-700"];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
      <div className="flex min-w-0 flex-col gap-4">
        <Panel className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-heading-s text-text">Subscriber growth</h2>
              <p className="text-caption text-text-secondary">Active members at month end · {range}</p>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-end">
                <span className="text-price-m text-text">{overview.activeNow.toLocaleString("en-IN")}</span>
                <span className={cn("text-caption-bold", overview.netNewThisMonth >= 0 ? "text-success" : "text-error")}>
                  {overview.netNewThisMonth >= 0 ? "▲" : "▼"} {Math.abs(overview.netNewThisMonth)} net this month
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-price-m text-text">{inrCompact(overview.mrrPaise)}</span>
                <span className="text-caption text-text-secondary">MRR{overview.mrrSharePercent != null && ` · ${overview.mrrSharePercent}% of Club`}</span>
              </div>
            </div>
          </div>
          <div className="flex h-[260px] items-end gap-3" role="img" aria-label="Active members by month">
            {overview.growth.map((g, i) => {
              const last = i === overview.growth.length - 1;
              return (
                <div key={g.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className={cn("text-caption tnum", last ? "font-bold text-text" : "text-text-secondary")}>{g.active.toLocaleString("en-IN")}</span>
                  <div className={cn("w-full rounded-t-sm", last ? "bg-primary" : "bg-sky-500")} style={{ height: `${Math.max(2, (g.active / max) * 200)}px` }} />
                  <span className={cn("text-caption", last ? "font-bold text-text" : "text-text-secondary")}>{g.label}</span>
                </div>
              );
            })}
          </div>
        </Panel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Panel className="flex flex-col gap-3 p-5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-heading-s text-text">Usage per member</h2>
              <p className="text-caption text-text-secondary">Avg drinks/day this cycle{overview.usageMean != null && ` · mean ${overview.usageMean.toFixed(2)}`}</p>
            </div>
            {overview.usage.length === 0 ? (
              <p className="py-4 text-body-s text-text-muted">No drink benefit, or no members yet</p>
            ) : (
              overview.usage.map((u, i) => <BarRow key={u.label} label={u.label} percent={u.percent} color={i < 2 ? "bg-sky-500" : "bg-primary"} />)
            )}
          </Panel>
          <Panel className="flex flex-col gap-3 p-5">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-heading-s text-text">Why members cancel</h2>
              <p className="text-caption text-text-secondary">Exit survey · {overview.cancellationsThisMonth} cancellations in the last 30 days</p>
            </div>
            {overview.cancellationsThisMonth === 0 ? (
              <p className="py-4 text-body-s text-text-muted">No cancellations in the last 30 days</p>
            ) : (
              overview.cancelReasons.map((r, i) => <BarRow key={r.reason} label={r.label} percent={r.percent} color={reasonColor[i]} />)
            )}
          </Panel>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <BenefitsCard plan={plan} overview={overview} onEdit={onEditBenefits} />
        <Panel className="flex flex-col gap-3 p-5">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-heading-s text-text">Cohort retention</h2>
            <p className="text-caption text-text-secondary">Paid members still active · {new Date().getFullYear()} cohorts avg</p>
          </div>
          <div className="flex h-[190px] items-end gap-3">
            {overview.retention.map((r) => (
              <div key={r.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                <span className="text-price-s text-text">{r.percent == null ? "—" : `${r.percent}%`}</span>
                <div className="w-full rounded-t-sm bg-primary" style={{ height: `${r.percent == null ? 2 : Math.max(2, r.percent * 1.6)}px` }} />
                <span className="text-caption text-text-secondary">{r.label}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BarRow({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr_40px] items-center gap-3">
      <span className="text-caption text-text">{label}</span>
      <div className="h-1.5 overflow-hidden rounded-pill bg-gray-100" aria-hidden>
        <div className={cn("h-full rounded-pill", color)} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <span className="text-right text-caption-bold text-text tnum">{percent}%</span>
    </div>
  );
}

function benefitRows(plan: AdminPlanDto) {
  return plan.benefits.map((b) => {
    switch (b.kind) {
      case "DAILY_DRINK":
        return { k: "Free drink", v: `${b.perDay ?? 1}/day · Regular · resets 4 am` };
      case "PERCENT_OFF":
        return { k: "Discount", v: `${b.percent}% · ${b.title.replace(/^\d+% off\s*/i, "") || "everything"}${b.capPaise ? ` · cap ${inr(b.capPaise)}` : ""}` };
      case "LAB_TASTING":
        return { k: "LAB tasting", v: `${b.perMonth ?? 1} / month` };
      default:
        return { k: b.title, v: b.detail || "Included" };
    }
  });
}

function BenefitsCard({ plan, overview, onEdit }: { plan: AdminPlanDto; overview: PlanOverviewDto; onEdit?: () => void }) {
  return (
    <Panel className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-heading-s text-text">Benefits</h2>
        {onEdit && (
          <button type="button" className="text-label text-primary hover:underline" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      {[...benefitRows(plan), { k: "Stores · trial", v: `${plan.allStores ? "All" : plan.storeCount} stores · ${plan.trialDays ? `${plan.trialDays}-day trial` : "no trial"}` }].map((r) => (
        <div key={r.k} className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <span className="text-body-s text-text-secondary">{r.k}</span>
          <span className="text-right text-label text-text">{r.v}</span>
        </div>
      ))}
      <div className="flex flex-col gap-3 px-5 py-4">
        <span className="text-caption-bold uppercase tracking-wide text-text-secondary">Pricing history</span>
        {overview.pricingHistory.map((p) => (
          <div key={p.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-body-s text-text">
              <span className={cn("h-2 w-2 rounded-pill", p.current ? "bg-primary" : "bg-gray-300")} aria-hidden />
              {p.label}
            </span>
            <span className="text-price-xs text-text">{inr(p.pricePaise)}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BenefitsPricing({ plan, overview, options }: { plan: AdminPlanDto; overview: PlanOverviewDto; options: AdminOptionsDto | null }) {
  const econ = unitEconomics(planToInput(plan));
  const cats = new Map((options?.categories ?? []).map((c) => [c.id, c.name]));
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
      <Panel className="flex flex-col gap-3 p-5">
        <h2 className="text-heading-s text-text">What members get</h2>
        {plan.benefits.length === 0 && <StateNotice kind="empty" title="No benefits" description="Edit the plan to add benefits." className="py-6" />}
        {plan.benefits.map((b) => (
          <div key={b.id ?? b.title} className="flex flex-col gap-1 rounded-md border border-border p-4">
            <span className="text-label text-text">{b.title}</span>
            <span className="text-body-s text-text-secondary">{b.detail}</span>
            {b.categoryIds && b.categoryIds.length > 0 && (
              <span className="text-caption text-text-secondary">Applies to: {b.categoryIds.map((id) => cats.get(id) ?? "Unknown category").join(", ")}</span>
            )}
          </div>
        ))}
        <div className="mt-2 flex flex-col gap-1">
          <span className="text-label text-text">Cancellation policy</span>
          <span className="text-body-s text-text-secondary">{plan.cancellationPolicy || "Not set"}</span>
        </div>
      </Panel>
      <div className="flex flex-col gap-4">
        <Panel className="flex flex-col gap-3 p-5">
          <h2 className="text-heading-s text-text">Unit economics</h2>
          {[
            ["Net revenue (ex-GST)", inr(econ.net)],
            ["GST inside the price", inr(econ.tax)],
            ["Drinks", econ.drinks ? `−${inr(econ.drinks)}` : "₹0"],
            ["Other costs", plan.otherCostPaise ? `−${inr(plan.otherCostPaise)}` : "₹0"],
            ["Contribution margin", `${inr(econ.margin)} · ${econ.marginPct}%`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <span className="text-body-s text-text-secondary">{k}</span>
              <span className="text-price-xs text-text">{v}</span>
            </div>
          ))}
        </Panel>
        <BenefitsCard plan={plan} overview={overview} />
      </div>
    </div>
  );
}

function Activity({ planId }: { planId: string }) {
  const [items, setItems] = React.useState<PlanActivityDto[] | null>(null);
  const [error, setError] = React.useState<LoadError | null>(null);
  const load = React.useCallback(() => {
    MembershipApi.planActivity(planId).then((r) => { setError(null); setItems(r); }).catch((e) => setError(toError(e)));
  }, [planId]);
  React.useEffect(() => load(), [load]);
  if (error) return <LoadErrorNotice error={error} onRetry={load} what="the activity log" />;
  if (!items) return <Shimmer className="h-48 rounded-lg" />;
  if (items.length === 0) return <StateNotice kind="empty" title="No activity yet" description="Edits, launches and sign-up changes appear here." />;
  return (
    <Panel className="flex flex-col">
      {items.map((a) => (
        <div key={a.id} className="flex items-start justify-between gap-4 border-b border-border px-5 py-3 last:border-0">
          <div className="flex flex-col">
            <span className="text-label text-text">{a.summary}</span>
            <span className="text-caption text-text-secondary">{a.actorName ?? "System"}</span>
          </div>
          <span className="shrink-0 text-caption text-text-secondary">{a.atFormatted}</span>
        </div>
      ))}
    </Panel>
  );
}
