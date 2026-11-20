"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CouponEditor } from "@/components/marketing/coupons/coupon-editor";
import { CouponPageShell, primaryBtn, secondaryBtn } from "@/components/marketing/coupons/coupon-page-shell";
import { CouponSummaryCard } from "@/components/marketing/coupons/coupon-summary-card";
import { CouponsApi, EMPTY_COUPON, type CouponInput, type CouponOptions } from "@/lib/api/coupons";

export default function NewCouponPage() {
  const router = useRouter();
  const [value, setValue] = React.useState<CouponInput>(EMPTY_COUPON);
  const [options, setOptions] = React.useState<CouponOptions | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    CouponsApi.options().then(setOptions).catch(() => setOptions(null));
  }, []);

  const valid = value.code.length >= 3 && value.title.trim().length > 0;

  const save = async (isActive: boolean) => {
    setSaving(true);
    setError(null);
    try {
      const created = await CouponsApi.create({ ...value, isActive });
      router.replace(`/marketing/coupons/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the coupon");
      setSaving(false);
    }
  };

  return (
    <CouponPageShell
      crumb="New"
      title={value.code || "New coupon"}
      actions={
        <>
          <button type="button" disabled={!valid || saving} onClick={() => save(false)} className={secondaryBtn}>
            Save paused
          </button>
          <button type="button" disabled={!valid || saving} onClick={() => save(true)} className={primaryBtn}>
            {saving ? "Saving…" : "Create coupon"}
          </button>
        </>
      }
    >
      {error && <div className="rounded-[12px] bg-[#fce8e6] px-4 py-3 text-[14px] font-manrope text-[#c0352b]">{error}</div>}
      <div className="w-full flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-[712px] shrink-0">
          <CouponEditor value={value} onChange={setValue} options={options} />
        </div>
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
          <CouponSummaryCard value={value} />
        </div>
      </div>
    </CouponPageShell>
  );
}
