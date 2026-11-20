import type { CouponInput } from "@/lib/api/coupons";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CH: Record<string, string> = { APP: "App", KIOSK: "Kiosk", COUNTER: "Counter", QR: "Dine-in QR" };

/** Plain-language read-back of the rules on the create page, so the admin sees exactly what goes live. */
export function CouponSummaryCard({ value }: { value: CouponInput }) {
  const offer =
    value.offerType === "PERCENT" ? `${value.percentOff ?? 0}% off${value.maxDiscount ? ` up to ₹${value.maxDiscount}` : ""}` :
    value.offerType === "FLAT" ? `₹${value.amountOff ?? 0} off` :
    value.offerType === "BOGO" ? "Buy one, get the cheaper one free" : "Cheapest item free";
  const scope = value.scope.type === "ALL" ? "the whole order" : value.scope.type === "CATEGORY" ? `${value.scope.categoryIds.length} categor${value.scope.categoryIds.length === 1 ? "y" : "ies"}` : `${value.scope.productIds.length} item${value.scope.productIds.length === 1 ? "" : "s"}`;
  const days = value.validDays.length === 0 ? "every day" : [...value.validDays].sort().map((d) => DAY[d]).join(", ");
  const lines = [
    `${offer} on ${scope}${value.minOrder ? `, orders from ₹${value.minOrder}` : ""}.`,
    `Works ${days}${value.window ? ` from ${value.window.start} to ${value.window.end} IST` : ", all day"}.`,
    `On ${value.channels.map((c) => CH[c]).join(", ")}.`,
    value.redemptionMode === "AUTO" ? "Applied automatically to eligible carts." : `Customers type ${value.code || "the code"}.`,
    value.perCustomerLimit ? `${value.perCustomerLimit} use${value.perCustomerLimit === 1 ? "" : "s"} per customer${value.perCustomerPeriod === "DAY" ? " per day" : ""}.` : "No per-customer limit.",
    value.budget ? `Stops at ₹${value.budget.toLocaleString("en-IN")} total discount.` : "No budget cap.",
    value.stackWithLoyalty ? "Customers still earn loyalty points." : "No loyalty points on these orders.",
  ];
  return (
    <div className="w-full rounded-[16px] bg-white border border-[#dce2ea] p-[21px] flex flex-col gap-3">
      <h3 className="text-[18px] leading-[26px] font-extrabold text-[#0f2340] font-manrope">What goes live</h3>
      <ul className="flex flex-col gap-2">
        {lines.map((l) => (
          <li key={l} className="text-[14px] leading-5 text-[#3f4b5e] font-manrope flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#1c3a66] shrink-0" />
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
