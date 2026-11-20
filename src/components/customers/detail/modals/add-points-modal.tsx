"use client";

import * as React from "react";
import { CustomerEntity } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { addCustomerPointsAction } from "@/store/slices/customers-slice";
import { X, Star } from "lucide-react";

interface AddPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerEntity;
}

export function AddPointsModal({
  isOpen,
  onClose,
  customer,
}: AddPointsModalProps) {
  const dispatch = useAppDispatch();
  const [points, setPoints] = React.useState<number>(100);
  const [reason, setReason] = React.useState("Missed points · counter");
  const [auditNote, setAuditNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!points || points <= 0) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        addCustomerPointsAction({
          id: customer.id,
          points,
          reason,
          note: auditNote.trim() || undefined,
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAuditNote("");
        onClose();
      }, 1500);
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectedBalance = (customer.points || 0) + points;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[20px] bg-white border border-[#dce2ea] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#dce2ea]">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] text-[#0f2340]">
              Add Points · {customer.name}
            </h3>
            <span className="font-sans text-[12px] text-[#55647a]">
              Current balance: {customer.points.toLocaleString("en-IN")} pts ({customer.tier})
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
          {/* Points */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Points to Add
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] font-display font-extrabold text-[16px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66]"
            />
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] bg-white cursor-pointer"
            >
              <option value="Missed points · counter">Missed points · counter</option>
              <option value="Promotion bonus">Promotion bonus</option>
              <option value="Service recovery">Service recovery</option>
              <option value="Birthday credit">Birthday credit</option>
              <option value="Manual goodwill">Manual goodwill adjustment</option>
            </select>
          </div>

          {/* Audit Note */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
              Audit Log Note
            </label>
            <input
              type="text"
              placeholder="e.g. Counter bill #1245 not linked by phone"
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[13px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66]"
            />
          </div>

          <div className="p-3 rounded-[10px] bg-[#f5f7fa] flex items-center justify-between text-[13px]">
            <span className="font-sans text-[#55647a]">Projected Points:</span>
            <span className="font-sans font-bold text-[#0f2340]">
              {projectedBalance.toLocaleString("en-IN")} pts
            </span>
          </div>

          {success && (
            <div className="p-3 rounded-[10px] bg-[#e3f4ea] text-[#1f7a4d] font-sans font-bold text-[13px] text-center">
              Points added successfully!
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
              <Star className="h-4 w-4 fill-white" />
              <span>{isSubmitting ? "Adding..." : `Add ${points} points`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

