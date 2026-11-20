"use client";

import * as React from "react";
import { X, AlertTriangle, Calendar, Award, Loader2, Check } from "lucide-react";
import { useAppDispatch } from "@/store";
import { endBatchEarly, extendBatchWindow, promoteBatchToMenu } from "@/store/slices/lab-slice";
import { LabBatchItem } from "@/types/lab";

interface ActionDialogProps {
  batch: LabBatchItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EndEarlyDialog({ batch, isOpen, onClose, onSuccess }: ActionDialogProps) {
  const dispatch = useAppDispatch();
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleEndEarly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(endBatchEarly({ id: batch.id, reason: reason.trim() })).unwrap();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to end batch early");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] bg-white border border-[#dce2ea] shadow-xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEE2E2] text-[#B91C1C]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-title text-[#0F2340]">End Batch Early?</h2>
              <p className="text-caption text-[#55647A]">{batch.name} ({batch.batchCode})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f7fa] text-[#55647A] hover:text-[#0F2340]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleEndEarly} className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="p-3 rounded-[12px] bg-[#FEE2E2] text-caption text-[#B91C1C]">
              {error}
            </div>
          )}

          <p className="text-body-s text-[#55647A]">
            Ending this batch will immediately 86 it across all 6 pilot stores and mark the experiment as ended.
          </p>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Reason for Ending Early
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Syrup stock depleted, low rating, or pilot completed"
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] text-body-s text-[#0F2340] focus:ring-2 focus:ring-[#cde9f9] focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dce2ea]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-[#dce2ea] text-label text-[#55647A] hover:bg-[#f5f7fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#C0352B] hover:bg-[#A82A21] text-label text-white flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : null}
              <span>Confirm End Early</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ExtendWindowDialog({ batch, isOpen, onClose, onSuccess }: ActionDialogProps) {
  const dispatch = useAppDispatch();
  const [daysToAdd, setDaysToAdd] = React.useState(7);
  const [additionalCups, setAdditionalCups] = React.useState(1000);
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(
        extendBatchWindow({
          id: batch.id,
          payload: {
            daysToAdd,
            additionalCups: additionalCups > 0 ? additionalCups : undefined,
            reason: reason.trim() || undefined,
          },
        })
      ).unwrap();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to extend batch window");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] bg-white border border-[#dce2ea] shadow-xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5FD] text-[#1C3A66]">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-title text-[#0F2340]">Extend Pilot Window</h2>
              <p className="text-caption text-[#55647A]">{batch.name} ({batch.batchCode})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f7fa] text-[#55647A] hover:text-[#0F2340]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleExtend} className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="p-3 rounded-[12px] bg-[#FEE2E2] text-caption text-[#B91C1C]">
              {error}
            </div>
          )}

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">Days to Extend</label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 14, 21].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDaysToAdd(d)}
                  className={`h-9 rounded-[10px] border text-caption-bold transition-all ${
                    daysToAdd === d
                      ? "border-[#1C3A66] bg-[#1C3A66] text-white"
                      : "border-[#dce2ea] bg-white text-[#55647A] hover:bg-[#f5f7fa]"
                  }`}
                >
                  +{d} Days
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Additional Cup Cap
            </label>
            <input
              type="number"
              value={additionalCups}
              onChange={(e) => setAdditionalCups(Number(e.target.value))}
              placeholder="1000"
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] text-body-s text-[#0F2340] focus:ring-2 focus:ring-[#cde9f9] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Reason for Extension
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. High customer demand, testing second recipe tweak"
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] text-body-s text-[#0F2340] focus:ring-2 focus:ring-[#cde9f9] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dce2ea]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-[#dce2ea] text-label text-[#55647A] hover:bg-[#f5f7fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : null}
              <span>Extend Window</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PromoteToMenuModal({ batch, isOpen, onClose, onSuccess }: ActionDialogProps) {
  const dispatch = useAppDispatch();
  const [menuName, setMenuName] = React.useState(batch.name);
  const [priceRupees, setPriceRupees] = React.useState(batch.pricePaise / 100);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(
        promoteBatchToMenu({
          id: batch.id,
          payload: {
            menuName: menuName.trim(),
            pricePaise: Math.round(priceRupees * 100),
          },
        })
      ).unwrap();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to promote batch to core catalog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[20px] bg-white border border-[#dce2ea] shadow-xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-title text-[#0F2340]">Promote to Core Menu</h2>
              <p className="text-caption text-[#55647A]">Graduate {batch.batchCode} to permanent catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f7fa] text-[#55647A] hover:text-[#0F2340]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePromote} className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="p-3 rounded-[12px] bg-[#FEE2E2] text-caption text-[#B91C1C]">
              {error}
            </div>
          )}

          <div className="p-3.5 rounded-[12px] bg-[#EBF1DE] border border-[#C6D8A8] text-[#566F2C] flex items-center gap-2.5">
            <Check className="h-5 w-5 shrink-0" />
            <div className="text-caption-bold">
              Meets graduation thresholds: ★ {batch.rating ?? 4.5} rating, {batch.wouldBuyAgainPct ?? 61}% repeat intent (&gt;60% bar).
            </div>
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Permanent Menu Item Name
            </label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] text-body-s text-[#0F2340] focus:ring-2 focus:ring-[#cde9f9] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Standard Retail Price (₹)
            </label>
            <input
              type="number"
              value={priceRupees}
              onChange={(e) => setPriceRupees(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] text-body-s text-[#0F2340] focus:ring-2 focus:ring-[#cde9f9] focus:outline-none"
              required
            />
          </div>

          <p className="text-caption text-[#55647A]">
            This creates an active product in the master catalog under Beverages, links the BOM recipe, and marks this batch status as PROMOTED.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dce2ea]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-[#dce2ea] text-label text-[#55647A] hover:bg-[#f5f7fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : null}
              <span>Promote to Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

