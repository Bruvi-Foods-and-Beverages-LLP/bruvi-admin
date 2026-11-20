"use client";

import * as React from "react";
import { CustomerEntity } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { issueCustomerCouponAction } from "@/store/slices/customers-slice";
import { X, Ticket } from "lucide-react";

interface IssueCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerEntity;
}

export function IssueCouponModal({
  isOpen,
  onClose,
  customer,
}: IssueCouponModalProps) {
  const dispatch = useAppDispatch();
  const [couponType, setCouponType] = React.useState("FREE_DRINK");
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        issueCustomerCouponAction({
          id: customer.id,
          couponType,
          note: note.trim() || undefined,
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setNote("");
        onClose();
      }, 1500);
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[20px] bg-white border border-[#dce2ea] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#dce2ea]">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] text-[#0f2340]">
              Issue coupon for {customer.name}
            </h3>
            <span className="font-sans text-[12px] text-[#55647a]">
              Direct voucher addition to customer mobile wallet
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#7f8ca0] hover:text-[#0f2340] hover:bg-[#f5f7fa] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Coupon Type */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Voucher Type
            </label>
            <select
              value={couponType}
              onChange={(e) => setCouponType(e.target.value)}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] bg-white cursor-pointer"
            >
              <option value="FREE_DRINK">Complimentary Drink (Any size)</option>
              <option value="FLAT_50_OFF">₹50 Off Any Order (Min spend ₹200)</option>
              <option value="FREE_BAKERY">Free Bánh Mì / Bakery Item</option>
              <option value="CLUB_TRIAL">7-Day BRUVI Club Free Trial</option>
            </select>
          </div>

          {/* Internal Reason / Note */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Staff Audit Note
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Service recovery for delayed takeaway order on Friday morning."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] resize-none"
            />
          </div>

          {success && (
            <div className="p-3 rounded-[10px] bg-[#e3f4ea] text-[#1f7a4d] font-sans font-bold text-[13px] text-center">
              Voucher coupon credited to guest account!
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] font-sans font-bold text-[14px] text-[#3f4b5e] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Ticket className="h-4 w-4" />
              <span>{isSubmitting ? "Issuing..." : "Issue coupon"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

