"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { FormCard } from "@/components/ui/form-card";
import { ToggleTile } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GstApi, type GstRuleSet, type GstSettingsUpdate, type GstChargeTreatment } from "@/lib/api/gst";
import { cn } from "@/lib/utils/cn";

/**
 * Global GST configuration. The backend GST engine reads these rules for every new order;
 * placed orders keep the breakdown they were charged with, so a change never rewrites history.
 */
export default function GstSettingsPage() {
  const [rules, setRules] = React.useState<GstRuleSet | null>(null);
  const [draft, setDraft] = React.useState<Omit<GstSettingsUpdate, "reason">>({});
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    GstApi.getGlobal()
      .then((r) => setRules(r.effective))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load GST settings"));
  }, []);

  if (!rules) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[880px] mx-auto pb-12">
        {error ? <p className="text-body-s text-[#b42318]">{error}</p> : <Skeleton className="h-[480px] rounded-[16px]" />}
      </div>
    );
  }

  const rate = draft.restaurantRatePercent ?? rules.restaurantRatePercent;
  const inclusive = draft.pricesIncludeGst ?? rules.pricesIncludeGst;
  const feeTreatment = draft.deliveryFeeTreatment ?? rules.deliveryFee.treatment;
  const feeRate = draft.deliveryFeeRatePercent ?? rules.deliveryFee.ratePercent;
  const feeInclusive = draft.chargesIncludeGst ?? rules.deliveryFee.inclusive;
  const mode = draft.supplierMode ?? rules.supplier.mode;
  const requireGstin = draft.requireGstin ?? rules.requireGstin;
  const dirty = Object.keys(draft).length > 0;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await GstApi.updateGlobal({ ...draft, reason: reason.trim() });
      setRules(res.effective);
      setDraft({});
      setReason("");
      setSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const option = (active: boolean) =>
    cn(
      "h-9 px-3 rounded-[10px] border text-label transition-colors",
      active ? "bg-[#1c3a66] border-[#1c3a66] text-white" : "bg-white border-[#dce2ea] text-[#0f2340] hover:bg-[#f5f7fa]",
    );

  return (
    <div className="flex flex-col gap-6 w-full max-w-[880px] mx-auto pb-16">
      <div className="flex flex-col gap-1">
        <Link href="/settings" className="flex items-center gap-1 text-body-s text-[#3f4b5e] hover:text-[#0f2340]">
          <ArrowLeft className="h-4 w-4" /> Settings
        </Link>
        <h1 className="text-heading-m text-[#0f2340]">GST</h1>
        <p className="text-body-s text-[#3f4b5e]">
          Applies to new orders only. Orders already placed keep the GST they were charged.
        </p>
      </div>

      {rules.warnings.length > 0 && (
        <div className="flex gap-2 rounded-[12px] border border-[#f5c46b] bg-[#fff8e6] p-3 text-body-s text-[#8a5a00]">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            {rules.warnings.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </div>
      )}

      <FormCard
        title="Restaurant service rate"
        description="5% without input tax credit for cafes and standalone restaurants. 18% with ITC only for restaurants in hotels with a room tariff above ₹7,500 (specified premises). SAC 996331."
      >
        <div className="flex gap-2">
          {([5, 18] as const).map((r) => (
            <button key={r} type="button" className={option(rate === r)} onClick={() => setDraft((d) => ({ ...d, restaurantRatePercent: r }))}>
              {r}%{r === 5 ? " · no ITC" : " · with ITC"}
            </button>
          ))}
        </div>
        <ToggleTile
          label="Menu prices include GST"
          hint={inclusive ? "Customers pay the menu price; GST is carved out of it" : "Recommended: 5% GST is added on top, so every total includes it"}
          checked={inclusive}
          onCheckedChange={(v) => setDraft((d) => ({ ...d, pricesIncludeGst: v }))}
        />
      </FormCard>

      <FormCard
        title="Delivery fee"
        description="Delivery by the outlet itself is part of the restaurant supply (taxed at the restaurant rate). Use a separate rate only if delivery is a separate supply."
      >
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["COMPOSITE", "Part of the meal"],
              ["SEPARATE", "Separate supply"],
              ["OUTSIDE_SCOPE", "No GST (collected for a third party)"],
            ] as Array<[GstChargeTreatment, string]>
          ).map(([value, label]) => (
            <button key={value} type="button" className={option(feeTreatment === value)} onClick={() => setDraft((d) => ({ ...d, deliveryFeeTreatment: value }))}>
              {label}
            </button>
          ))}
        </div>
        {feeTreatment === "SEPARATE" && (
          <div className="flex gap-2">
            {([5, 18] as const).map((r) => (
              <button key={r} type="button" className={option(feeRate === r)} onClick={() => setDraft((d) => ({ ...d, deliveryFeeRatePercent: r }))}>
                {r}% · SAC 996813
              </button>
            ))}
          </div>
        )}
        <ToggleTile
          label="Fees include GST"
          hint="Off (default): GST on the delivery fee is added to the total like the food"
          checked={feeInclusive}
          onCheckedChange={(v) => setDraft((d) => ({ ...d, chargesIncludeGst: v }))}
        />
      </FormCard>

      <FormCard
        title="Who invoices"
        description="Each store invoices under its own GSTIN by default. Use the operator mode only if BRUVI runs the app for outlets owned by other businesses (CGST Act s.9(5))."
      >
        <div className="flex gap-2">
          {(
            [
              ["OUTLET", "Store GSTIN"],
              ["ECO_9_5", "Operator GSTIN · s.9(5)"],
            ] as const
          ).map(([value, label]) => (
            <button key={value} type="button" className={option(mode === value)} onClick={() => setDraft((d) => ({ ...d, supplierMode: value }))}>
              {label}
            </button>
          ))}
        </div>
        {mode === "ECO_9_5" && (
          <input
            className="h-10 rounded-[10px] border border-[#dce2ea] px-3 text-body-s font-mono uppercase"
            placeholder="Operator GSTIN"
            defaultValue={rules.supplier.mode === "ECO_9_5" ? rules.supplier.gstin ?? "" : ""}
            onChange={(e) => setDraft((d) => ({ ...d, operatorGstin: e.target.value.trim().toUpperCase() || null }))}
          />
        )}
        <ToggleTile
          label="Block orders at stores without a GSTIN"
          hint="Checkout is refused until the store's GSTIN is set"
          checked={requireGstin}
          onCheckedChange={(v) => setDraft((d) => ({ ...d, requireGstin: v }))}
        />
      </FormCard>

      <div className="flex flex-col gap-2">
        <input
          className="h-10 rounded-[10px] border border-[#dce2ea] px-3 text-body-s"
          placeholder="Why are you changing GST settings? (recorded in the history)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        {error && <span className="text-body-s text-[#b42318]">{error}</span>}
        {saved && !dirty && <span className="text-body-s text-[#1f7a4d]">Saved. New orders use these rules.</span>}
        <div>
          <Button disabled={!dirty || reason.trim().length < 3 || saving} onClick={save}>
            {saving ? "Saving…" : "Save GST settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
