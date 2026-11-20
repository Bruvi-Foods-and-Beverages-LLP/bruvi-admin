import { cn } from "@/lib/utils/cn";
import type { CouponStatus } from "@/lib/api/coupons";

const STYLE: Record<CouponStatus, string> = {
  ACTIVE: "bg-[#e3f4ea] text-[#1f7a4d]",
  SCHEDULED: "bg-[#e4f0fa] text-[#22629e]",
  PAUSED: "bg-[#fdf0d8] text-[#9a5b00]",
  EXPIRED: "bg-[#f5f7fa] text-[#55647a]",
  EXHAUSTED: "bg-[#fce8e6] text-[#c0352b]",
  ARCHIVED: "bg-[#f5f7fa] text-[#55647a]",
};

const LABEL: Record<CouponStatus, string> = {
  ACTIVE: "Active",
  SCHEDULED: "Scheduled",
  PAUSED: "Paused",
  EXPIRED: "Expired",
  EXHAUSTED: "Cap reached",
  ARCHIVED: "Archived",
};

/** Status chip; with `text` it shows the long form ("Active · next window Mon 5 Oct, 2 pm") and a dot. */
export function CouponStatusPill({ status, text }: { status: CouponStatus; text?: string }) {
  return (
    <span
      className={cn(
        "w-fit inline-flex items-center gap-1 h-6 px-2 rounded-[12px] text-[12px] leading-4 font-bold font-manrope whitespace-nowrap",
        STYLE[status],
      )}
    >
      {text && <span className="h-2 w-2 rounded-full bg-current" />}
      {text ?? LABEL[status]}
    </span>
  );
}
