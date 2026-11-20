"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  toggleSelectAll,
  toggleSelectCustomer,
} from "@/store/slices/customers-slice";
import { CustomerListItem, CustomerTier } from "@/types/customers";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

/**
 * Customers High-Density Master Data Table (Figma 225:103396 & 225:103408)
 */
export function CustomersTable() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { customers, isLoading, selectedCustomerIds } = useAppSelector(
    (state) => state.customers
  );

  const isAllSelected =
    customers.length > 0 && selectedCustomerIds.length === customers.length;
  const isIndeterminate =
    selectedCustomerIds.length > 0 &&
    selectedCustomerIds.length < customers.length;

  const getTierBadgeClass = (tier: CustomerTier) => {
    switch (tier) {
      case "Platinum":
        return "bg-[#e4f0fa] text-[#22629e]";
      case "Gold":
        return "bg-[#fdf0d8] text-[#9a5b00]";
      case "Silver":
        return "bg-[#f5f7fa] text-[#3f4b5e]";
      case "Bronze":
      default:
        return "bg-[#fef3eb] text-[#b45309]";
    }
  };

  const getAvatarBg = (initials: string) => {
    const charCode = (initials.charCodeAt(0) || 0) % 5;
    switch (charCode) {
      case 0:
        return "bg-[#e8f5fd] text-[#1c3a66]"; // brand sky
      case 1:
        return "bg-[#f7f2e8] text-[#6b4430]"; // warm cream/coffee
      case 2:
        return "bg-[#ebf1de] text-[#566f2c]"; // matcha green
      case 3:
        return "bg-[#fdf0d8] text-[#9a5b00]"; // gold warm
      default:
        return "bg-[#e8f5fd] text-[#1c3a66]";
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="min-w-[1020px] flex flex-col">
        {/* Table Header (Figma 225:103396) */}
        <div className="h-9 px-5 flex items-center gap-3 bg-[#f5f7fa] border-b border-[#dce2ea] select-none">
          {/* Checkbox column (24px) */}
          <div className="w-6 flex items-center justify-center shrink-0">
            <button
              type="button"
              onClick={() => dispatch(toggleSelectAll())}
              className={cn(
                "h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer",
                isAllSelected || isIndeterminate
                  ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                  : "border-[#bcc6d3] bg-white hover:border-[#7f8ca0]"
              )}
            >
              {isAllSelected && <Check className="h-3 w-3 stroke-[3]" />}
              {isIndeterminate && <span className="h-0.5 w-2 bg-white rounded-full" />}
            </button>
          </div>

          {/* Customer (218px) */}
          <div className="w-[218px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Customer
          </div>

          {/* Phone (120px) */}
          <div className="w-[120px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Phone
          </div>

          {/* Home store (96px) */}
          <div className="w-[96px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Home store
          </div>

          {/* Tier (80px) */}
          <div className="w-[80px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Tier
          </div>

          {/* Visits (56px) - right aligned */}
          <div className="w-[56px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700] shrink-0">
            Visits
          </div>

          {/* Lifetime (96px) - right aligned */}
          <div className="w-[96px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700] shrink-0">
            Lifetime
          </div>

          {/* Wallet (80px) - right aligned */}
          <div className="w-[80px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-right [font-variation-settings:'wght'_700] shrink-0">
            Wallet
          </div>

          {/* Last order (96px) */}
          <div className="w-[96px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Last order
          </div>

          {/* Tags (120px) */}
          <div className="w-[120px] font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] text-left [font-variation-settings:'wght'_700] shrink-0">
            Tags
          </div>
        </div>

        {/* Table Rows (Figma 225:103408) */}
        <div className="flex flex-col divide-y divide-[#dce2ea]">
          {customers.length === 0 && !isLoading && (
            <div className="h-32 flex flex-col items-center justify-center text-center p-6 text-[#55647a]">
              <span className="font-sans font-semibold text-[14px]">No customers found</span>
              <span className="font-sans text-[12px] mt-1 text-[#7f8ca0]">
                Try adjusting your search query or filters.
              </span>
            </div>
          )}

          {customers.map((customer) => {
            const isSelected = selectedCustomerIds.includes(customer.id);

            return (
              <div
                key={customer.id}
                onClick={() => router.push(`/customers/${customer.id}`)}
                className={cn(
                  "h-14 px-5 flex items-center gap-3 transition-colors select-none cursor-pointer group",
                  isSelected ? "bg-[#f5f7fa]" : "bg-white hover:bg-[#f5f7fa]/70"
                )}
              >
                {/* 1. Checkbox (24px) */}
                <div
                  className="w-6 flex items-center justify-center shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => dispatch(toggleSelectCustomer(customer.id))}
                    className={cn(
                      "h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#1c3a66] border-[#1c3a66] text-white"
                        : "border-[#bcc6d3] bg-white hover:border-[#7f8ca0]"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>

                {/* 2. Customer: Avatar, Name & Code/Date (218px) */}
                <div className="w-[218px] flex items-center gap-3 shrink-0 overflow-hidden">
                  {/* 32x32 Avatar */}
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center font-display font-extrabold text-[12px] shrink-0 [font-variation-settings:'wdth'_112,'wght'_800]",
                      getAvatarBg(customer.initials)
                    )}
                  >
                    {customer.initials}
                  </div>
                  {/* Name and CUST info */}
                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] group-hover:text-[#1c3a66] transition-colors truncate [font-variation-settings:'wght'_700]"
                      title={customer.name}
                    >
                      {customer.name}
                    </span>
                    <span className="font-sans font-medium text-[12px] leading-4 text-[#55647a] truncate [font-variation-settings:'wght'_500]">
                      {customer.code} · {customer.memberSince}
                    </span>
                  </div>
                </div>

                {/* 3. Phone (120px) */}
                <div className="w-[120px] font-sans font-normal text-[14px] leading-5 text-[#3f4b5e] shrink-0 truncate [font-variation-settings:'wght'_400]">
                  {customer.phone}
                </div>

                {/* 4. Home Store (96px) */}
                <div
                  className="w-[96px] font-sans font-normal text-[14px] leading-5 text-[#0f2340] shrink-0 truncate [font-variation-settings:'wght'_400]"
                  title={customer.homeStore}
                >
                  {customer.homeStore}
                </div>

                {/* 5. Tier (80px) */}
                <div className="w-[80px] shrink-0 flex items-center">
                  <span
                    className={cn(
                      "h-6 px-2 rounded-full inline-flex items-center text-[12px] font-sans font-bold [font-variation-settings:'wght'_700]",
                      getTierBadgeClass(customer.tier)
                    )}
                  >
                    {customer.tier}
                  </span>
                </div>

                {/* 6. Visits (56px) - right aligned */}
                <div className="w-[56px] font-sans font-semibold text-[14px] leading-5 text-[#0f2340] text-right shrink-0 [font-variation-settings:'wght'_600]">
                  {customer.visits}
                </div>

                {/* 7. Lifetime (96px) - right aligned */}
                <div className="w-[96px] font-display font-extrabold text-[14px] leading-5 text-[#0f2340] text-right shrink-0 tnum [font-variation-settings:'wdth'_112,'wght'_800] [font-feature-settings:'tnum'_1]">
                  ₹{customer.lifetime.toLocaleString("en-IN")}
                </div>

                {/* 8. Wallet (80px) - right aligned */}
                <div className="w-[80px] font-display font-extrabold text-[14px] leading-5 text-[#0f2340] text-right shrink-0 tnum [font-variation-settings:'wdth'_112,'wght'_800] [font-feature-settings:'tnum'_1]">
                  ₹{customer.wallet.toLocaleString("en-IN")}
                </div>

                {/* 9. Last order (96px) */}
                <div className="w-[96px] flex flex-col justify-center shrink-0 overflow-hidden">
                  {customer.lastOrder ? (
                    <>
                      <span className="font-sans font-normal text-[12px] leading-4 text-[#0f2340] truncate [font-variation-settings:'wght'_400]">
                        {customer.lastOrder.timeText}
                      </span>
                      <span className="font-sans font-medium text-[11px] leading-3.5 text-[#55647a] truncate [font-variation-settings:'wght'_500]">
                        {customer.lastOrder.subtext}
                      </span>
                    </>
                  ) : (
                    <span className="font-sans font-normal text-[12px] leading-4 text-[#55647a]">
                      —
                    </span>
                  )}
                </div>

                {/* 10. Tags (120px) */}
                <div className="w-[120px] flex items-center gap-1 shrink-0 overflow-hidden flex-wrap">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="h-6 px-2 rounded-[4px] bg-[#e8f5fd] text-[#1c3a66] font-sans font-bold text-[11px] tracking-[0.44px] inline-flex items-center uppercase select-none [font-variation-settings:'wght'_700]"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="font-sans font-normal text-[12px] leading-4 text-[#bcc6d3]">
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

