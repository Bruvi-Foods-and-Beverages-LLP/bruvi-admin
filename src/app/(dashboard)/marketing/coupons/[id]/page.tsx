"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CouponEditor } from "@/components/marketing/coupons/coupon-editor";
import { CouponPageShell, primaryBtn, secondaryBtn } from "@/components/marketing/coupons/coupon-page-shell";
import { CouponStatusPill } from "@/components/marketing/coupons/coupon-status-pill";
import {
  CouponGuardCard,
  CouponRedemptionCard,
  CouponRedemptionsTable,
} from "@/components/marketing/coupons/coupon-analytics";
import {
  CouponsApi,
  type AdminCoupon,
  type CouponAnalytics,
  type CouponInput,
  type CouponOptions,
} from "@/lib/api/coupons";

const EDITABLE: (keyof CouponInput)[] = [
  "code", "title", "description", "offerType", "percentOff", "amountOff", "maxDiscount", "minOrder", "scope",
  "validDays", "window", "startsAt", "endsAt", "channels", "serviceTypes", "redemptionMode", "perCustomerLimit",
  "perCustomerPeriod", "maxRedemptions", "budget", "budgetAlertPct", "outletIds", "stackWithLoyalty", "stackWithClub",
];

function pick(c: AdminCoupon): CouponInput {
  return { ...(Object.fromEntries(EDITABLE.map((k) => [k, c[k]])) as unknown as CouponInput), isActive: c.isActive };
}

/** Only the fields that changed, so a save never rewrites untouched settings. */
function diff(before: CouponInput, after: CouponInput): Partial<CouponInput> {
  const out: Partial<CouponInput> = {};
  for (const k of EDITABLE) {
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) (out as Record<string, unknown>)[k] = after[k];
  }
  if (out.offerType || out.percentOff !== undefined || out.amountOff !== undefined) {
    out.offerType = after.offerType;
    out.percentOff = after.percentOff;
    out.amountOff = after.amountOff;
  }
  return out;
}

export default function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [coupon, setCoupon] = React.useState<AdminCoupon | null>(null);
  const [draft, setDraft] = React.useState<CouponInput | null>(null);
  const [options, setOptions] = React.useState<CouponOptions | null>(null);
  const [analytics, setAnalytics] = React.useState<CouponAnalytics | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    CouponsApi.get(id)
      .then((c) => { setCoupon(c); setDraft(pick(c)); setNotFound(false); })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Could not load the coupon";
        if (/not found/i.test(msg)) setNotFound(true);
        else setError(msg);
      });
    CouponsApi.analytics(id).then(setAnalytics).catch(() => setAnalytics(null));
  }, [id, reloadKey]);

  React.useEffect(() => {
    CouponsApi.options().then(setOptions).catch(() => setOptions(null));
  }, []);

  const changes = coupon && draft ? diff(pick(coupon), draft) : {};
  const dirty = Object.keys(changes).length > 0;

  const run = async (fn: () => Promise<AdminCoupon | { success: boolean }>, done: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fn();
      if ("id" in res) { setCoupon(res); setDraft(pick(res)); }
      setNotice(done);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-[1136px] mx-auto py-20 flex flex-col items-center gap-3 text-center font-manrope">
        <h2 className="text-[20px] font-extrabold text-[#0f2340]">Coupon not found</h2>
        <p className="text-[14px] text-[#55647a]">It may have been archived or the link is wrong.</p>
        <Link href="/marketing" className={primaryBtn + " inline-flex items-center"}>Back to marketing</Link>
      </div>
    );
  }

  if (!coupon || !draft) {
    return (
      <div className="max-w-[1136px] mx-auto w-full flex flex-col gap-6 animate-pulse">
        <div className="h-[115px] rounded-[16px] bg-[#ebeff4]" />
        <div className="flex gap-6">
          <div className="h-[649px] w-[712px] rounded-[16px] bg-[#ebeff4]" />
          <div className="h-[649px] flex-1 rounded-[16px] bg-[#ebeff4]" />
        </div>
        {error && <p className="text-[14px] text-[#c0352b] font-manrope">{error}</p>}
      </div>
    );
  }

  const archived = coupon.status === "ARCHIVED";
  return (
    <CouponPageShell
      crumb={coupon.code}
      title={coupon.code}
      badge={<CouponStatusPill status={coupon.status} text={coupon.statusText} />}
      actions={
        archived ? null : (
          <>
            {coupon.isActive ? (
              <button type="button" disabled={busy} className={secondaryBtn} onClick={() => run(() => CouponsApi.pause(coupon.id), "Coupon paused")}>
                Pause coupon
              </button>
            ) : (
              <button type="button" disabled={busy} className={secondaryBtn} onClick={() => run(() => CouponsApi.resume(coupon.id), "Coupon resumed")}>
                Resume coupon
              </button>
            )}
            <button type="button" disabled={busy || !dirty} className={primaryBtn} onClick={() => run(() => CouponsApi.update(coupon.id, changes), "Changes saved")}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </>
        )
      }
    >
      {error && <div className="rounded-[12px] bg-[#fce8e6] px-4 py-3 text-[14px] font-manrope text-[#c0352b]">{error}</div>}
      {notice && !error && (
        <div className="rounded-[12px] bg-[#e3f4ea] px-4 py-3 text-[14px] font-bold font-manrope text-[#1f7a4d] flex justify-between">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="font-normal underline cursor-pointer">Dismiss</button>
        </div>
      )}
      <div className="w-full flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-[712px] shrink-0 flex flex-col gap-3">
          <fieldset disabled={archived} className="contents">
            <CouponEditor
              value={draft}
              onChange={setDraft}
              options={options}
              currentId={coupon.id}
              codeLocked={coupon.redemptionCount > 0}
            />
          </fieldset>
          {!archived && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (window.confirm(`Archive ${coupon.code}? Customers can no longer use it. Order history keeps it.`)) {
                  void run(() => CouponsApi.archive(coupon.id), "Coupon archived").then(() => router.refresh());
                }
              }}
              className="self-start text-[14px] font-bold text-[#c0352b] hover:underline font-manrope cursor-pointer"
            >
              Archive coupon
            </button>
          )}
        </div>
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <CouponRedemptionCard data={analytics} />
          <CouponGuardCard data={analytics} />
        </div>
      </div>
      <CouponRedemptionsTable couponId={coupon.id} reloadKey={reloadKey} />
    </CouponPageShell>
  );
}
