"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMembershipEconomics, fetchMembershipPlans, fetchMembershipSummary } from "@/store/slices/membership-slice";
import { inr, inrCompact, periodWord, type AdminEconomicsDto, type AdminPlanCardDto, type AdminSummaryDto } from "@/lib/api/membership";
import { cn } from "@/lib/utils/cn";
import { LoadErrorNotice, Panel, PlanStatusPill, Shimmer, Stat, StateNotice, primaryButtonClass } from "./primitives";

const fmtPct = (n: number | null | undefined) => (n == null ? "—" : `${Number(n.toFixed(1))}%`);

/** A110: KPIs, plan cards, revenue vs redemption cost and plan economics. */
export function PlansOverview() {
  const dispatch = useAppDispatch();
  const { plans, summary, economics, options } = useAppSelector((s) => s.membership);
  const load = React.useCallback(() => {
    dispatch(fetchMembershipSummary());
    dispatch(fetchMembershipPlans());
    dispatch(fetchMembershipEconomics(6));
  }, [dispatch]);
  React.useEffect(() => load(), [load]);

  const blocking = summary.error ?? plans.error;
  if (blocking && !summary.data && plans.items.length === 0) {
    return <LoadErrorNotice error={blocking} onRetry={load} what="BRUVI Club plans" />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <KpiRow summary={summary.data} loading={summary.status === "loading" && !summary.data} />
      <PlanCards plans={plans.items} loading={plans.status === "loading" && plans.items.length === 0} canWrite={options?.canWrite ?? false} />
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[720fr_400fr]">
        <RevenueChart data={economics.data} loading={economics.status === "loading" && !economics.data} />
        <EconomicsTable data={economics.data} loading={economics.status === "loading" && !economics.data} />
      </div>
    </div>
  );
}

function Delta({ value, unit, goodWhenDown = false }: { value: number | null; unit: string; goodWhenDown?: boolean }) {
  if (value == null) return null;
  const up = value > 0;
  const good = goodWhenDown ? !up : up;
  return (
    <span className={cn("text-caption-bold", value === 0 ? "text-text-secondary" : good ? "text-success" : "text-error")}>
      {up ? "▲" : value < 0 ? "▼" : "•"} {Math.abs(value)}
      {unit}
    </span>
  );
}

function KpiRow({ summary, loading }: { summary: AdminSummaryDto | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[333fr_252fr_252fr_252fr]">
        {Array.from({ length: 4 }, (_, i) => (
          <Shimmer key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }
  const s = summary;
  const prevMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][(new Date().getMonth() + 11) % 12];
  const breakEvenGap = s?.drinksPerDay != null && s.breakEvenDrinksPerDay != null ? s.drinksPerDay - s.breakEvenDrinksPerDay : null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[333fr_252fr_252fr_252fr]">
      <div className="flex h-32 flex-col gap-1 rounded-lg bg-surface-inverse p-5">
        <span className="text-label text-text-inverse-secondary">Monthly recurring revenue</span>
        <span className="text-price-xl text-text-inverse">{inrCompact(s?.mrrPaise ?? 0)}</span>
        <span className="text-caption text-text-inverse-muted">
          {(s?.activeMembers ?? 0).toLocaleString("en-IN")} active members
          {s?.mrrDeltaPercent != null && ` · ${s.mrrDeltaPercent >= 0 ? "▲" : "▼"} ${Math.abs(s.mrrDeltaPercent)}% vs ${prevMonth}`}
        </span>
      </div>
      <KpiCard
        label="Monthly churn"
        value={fmtPct(s?.churnPercent)}
        foot={s?.churnDeltaPts != null ? <Delta value={s.churnDeltaPts} unit={` pts vs ${prevMonth}`} goodWhenDown /> : <Muted>Last 30 days</Muted>}
      />
      <KpiCard
        label="Trial → paid"
        value={fmtPct(s?.trialToPaidPercent)}
        foot={
          <Muted>
            {s?.trialDays ? `${s.trialDays}-day trial · ` : ""}
            {(s?.trialingMembers ?? 0).toLocaleString("en-IN")} in trial now
          </Muted>
        }
      />
      <KpiCard
        label={`Drinks/day used${s?.drinkPlanName ? ` · ${s.drinkPlanName.replace(/^Club\s+/i, "")}` : ""}`}
        value={s?.drinksPerDay != null ? s.drinksPerDay.toFixed(2) : "—"}
        foot={
          s?.breakEvenDrinksPerDay != null ? (
            <span className={cn("text-caption-bold", breakEvenGap != null && breakEvenGap > 0 ? "text-error" : "text-warning")}>
              {s.drinksPerDayDelta != null && `${s.drinksPerDayDelta >= 0 ? "▲" : "▼"} ${Math.abs(s.drinksPerDayDelta).toFixed(2)} · `}
              break-even {s.breakEvenDrinksPerDay.toFixed(2)}
            </span>
          ) : (
            <Muted>No drink plan yet</Muted>
          )
        }
      />
    </div>
  );
}

const Muted = ({ children }: { children: React.ReactNode }) => <span className="text-caption-bold text-text-secondary">{children}</span>;

function KpiCard({ label, value, foot }: { label: string; value: string; foot: React.ReactNode }) {
  return (
    <Panel as="div" className="flex h-32 flex-col gap-1 p-5">
      <span className="truncate text-label text-text-secondary">{label}</span>
      <span className="text-price-l text-text">{value}</span>
      {foot}
    </Panel>
  );
}

function PlanCards({ plans, loading, canWrite }: { plans: AdminPlanCardDto[]; loading: boolean; canWrite: boolean }) {
  const router = useRouter();
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Shimmer key={i} className="h-[213px] rounded-lg" />
        ))}
      </div>
    );
  }
  if (plans.length === 0) {
    return (
      <StateNotice
        kind="empty"
        title="No plans yet"
        description="Create the first BRUVI Club plan: price, trial and the benefits members get."
        action={
          <button type="button" className={primaryButtonClass} disabled={!canWrite} onClick={() => router.push("/subscriptions/plans/new")}>
            New plan
          </button>
        }
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((p) => {
        const draft = p.status !== "LIVE";
        return (
          <Link
            key={p.id}
            href={`/subscriptions/plans/${p.id}`}
            className={cn(
              "flex min-h-[213px] flex-col gap-4 rounded-lg border p-5 transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-focus",
              draft ? "border-dashed border-border-input bg-surface-warm" : "border-border bg-surface",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-title font-extrabold text-text">{p.name}</span>
                <span className="line-clamp-1 text-caption text-text-secondary">{p.benefitSummary || "No benefits yet"}</span>
              </div>
              <PlanStatusPill status={p.status} label={p.statusLabel} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-price-l text-text">{inr(p.pricePaise)}</span>
              <span className="text-body-s text-text-secondary">/ {periodWord(p.period)}</span>
            </div>
            <div className="mt-auto grid grid-cols-3 gap-4 border-t border-border pt-4">
              {draft ? (
                <>
                  <Stat label={p.status === "SCHEDULED" ? "Launch" : "Status"} value={p.status === "SCHEDULED" ? p.statusLabel.replace(/^Scheduled · /, "") : p.statusLabel} />
                  <Stat label="Cost/member" value={inr(p.economics.expectedCostPaise)} />
                  <Stat label="Margin" value={`${p.economics.marginPercent}%`} />
                </>
              ) : (
                <>
                  <Stat label="Active" value={p.activeCount.toLocaleString("en-IN")} />
                  <Stat label="MRR" value={inrCompact(p.mrrPaise)} />
                  <Stat label="Churn" value={fmtPct(p.churnPercent)} />
                </>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function RevenueChart({ data, loading }: { data: AdminEconomicsDto | null; loading: boolean }) {
  const months = data?.months ?? [];
  const max = Math.max(1, ...months.flatMap((m) => [m.revenuePaise, m.costPaise]));
  const last = months[months.length - 1];
  const range = months.length ? `${months[0].label} – ${last.label} ${last.month.slice(0, 4)}` : "";
  return (
    <Panel className="flex min-h-[264px] flex-col gap-4 p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-heading-s text-text">Revenue vs redemption cost</h2>
          <p className="text-caption text-text-secondary">
            All Club plans · ₹ lakh{range && ` · ${range}`}
            {last && ` · ${last.label} ${inrCompact(last.revenuePaise)} revenue vs ${inrCompact(last.costPaise)} cost`}
          </p>
        </div>
        <div className="flex shrink-0 gap-6 text-caption text-text-secondary">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-pill bg-primary" aria-hidden />
            Subscription revenue
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-pill bg-sky-500" aria-hidden />
            Redemption cost (COGS + ops)
          </span>
        </div>
      </div>
      {loading ? (
        <Shimmer className="h-[148px]" />
      ) : months.every((m) => m.revenuePaise === 0 && m.costPaise === 0) ? (
        <div className="flex h-[148px] items-center justify-center text-body-s text-text-muted">No billing yet · revenue appears after the first charge</div>
      ) : (
        <div className="flex h-[148px] items-end gap-6 px-2" role="img" aria-label="Monthly revenue and redemption cost">
          {months.map((m, i) => (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <div className="flex h-full w-full items-end justify-center gap-1 border-b border-border">
                <div className="w-6 rounded-t-sm bg-primary" style={{ height: `${(m.revenuePaise / max) * 100}%` }} title={`Revenue ${inr(m.revenuePaise)}`} />
                <div className="w-6 rounded-t-sm bg-sky-500" style={{ height: `${(m.costPaise / max) * 100}%` }} title={`Cost ${inr(m.costPaise)}`} />
              </div>
              <span className={cn("text-caption", i === months.length - 1 ? "font-bold text-text" : "text-text-secondary")}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function EconomicsTable({ data, loading }: { data: AdminEconomicsDto | null; loading: boolean }) {
  const rows = data ? [...data.plans, data.total] : [];
  const margin = (m: number | null) => (m == null ? "—" : `${m}%`);
  return (
    <Panel className="flex min-h-[264px] flex-col overflow-hidden">
      <div className="flex flex-col gap-0.5 border-b border-border px-5 pb-4 pt-4">
        <h2 className="text-heading-s text-text">Plan economics{data ? ` · ${data.monthLabel}` : ""}</h2>
        <p className="text-caption text-text-secondary">Revenue, redemption cost and gross margin</p>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2 p-5">
          <Shimmer className="h-6" />
          <Shimmer className="h-6" />
          <Shimmer className="h-6" />
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="h-9 border-b border-border bg-background-subtle text-left">
              <th className="px-5 text-caption-bold uppercase tracking-wide text-text-secondary">Plan</th>
              <th className="px-2 text-right text-caption-bold uppercase tracking-wide text-text-secondary">Revenue</th>
              <th className="px-2 text-right text-caption-bold uppercase tracking-wide text-text-secondary">Cost</th>
              <th className="px-5 text-right text-caption-bold uppercase tracking-wide text-text-secondary">Margin</th>
            </tr>
          </thead>
          <tbody>
            {rows.length <= 1 && (data?.total.revenuePaise ?? 0) === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-body-s text-text-muted">
                  No revenue this month yet
                </td>
              </tr>
            ) : (
              rows.map((r, i) => {
                const total = i === rows.length - 1;
                return (
                  <tr key={r.planId ?? "total"} className={cn("h-[29px] border-b border-border last:border-0", total && "bg-background-subtle")}>
                    <td className="px-5 text-label-semi text-text">{r.planName}</td>
                    <td className="px-2 text-right text-price-xs text-text">{inrCompact(r.revenuePaise)}</td>
                    <td className="px-2 text-right text-price-xs text-text">{inrCompact(r.costPaise)}</td>
                    <td
                      className={cn(
                        "px-5 text-right text-price-xs",
                        r.marginPercent == null ? "text-text-muted" : r.marginPercent < 35 ? "text-warning" : "text-success",
                      )}
                    >
                      {margin(r.marginPercent)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
      {data?.note && (
        <p className="mt-auto flex gap-2 px-5 py-4 text-caption text-text-secondary">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-pill bg-warning" aria-hidden />
          {data.note}
        </p>
      )}
    </Panel>
  );
}
