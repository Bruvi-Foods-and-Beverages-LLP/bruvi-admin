"use client";

import * as React from "react";
import { X } from "lucide-react";
import { CustomersApi } from "@/lib/api/customers";
import { cn } from "@/lib/utils/cn";

const REASONS = ["Service recovery", "Late order delivery", "Item out of stock", "Administrative correction"];

interface Props {
  account: { userId: string; name: string; code: string; balance: number } | null;
  onClose: () => void;
  onDone: () => void;
}

export function WalletAdjustModal({ account, onClose, onDone }: Props) {
  const [type, setType] = React.useState<"credit" | "debit">("credit");
  const [amount, setAmount] = React.useState(100);
  const [reason, setReason] = React.useState(REASONS[0]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!account) return null;
  const projected = account.balance + (type === "credit" ? amount : -amount);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setBusy(true);
    setError(null);
    try {
      await CustomersApi.adjustWallet(account.userId, { amount, type, reason });
      onDone();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not adjust wallet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <form onSubmit={submit} className="w-full max-w-md rounded-[16px] bg-white border border-[#dce2ea] shadow-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#dce2ea]">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Adjust wallet · {account.name}</h3>
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
              {account.code} · balance ₹{account.balance.toLocaleString("en-IN")}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full flex items-center justify-center text-[#7f8ca0] hover:bg-[#f5f7fa]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-1 bg-[#f5f7fa] p-1 rounded-[12px]">
            {([["credit", "Credit goodwill"], ["debit", "Debit"]] as const).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setType(k)}
                className={cn("h-9 rounded-[8px] font-sans font-bold text-[14px]", type === k ? "bg-white text-[#0f2340] shadow-2xs" : "text-[#3f4b5e]")}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] text-[#0f2340]">Amount</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] font-display font-extrabold text-[14px] text-[#0f2340] outline-none focus:border-[#1c3a66]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[14px] text-[#0f2340]">Reason</span>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="h-10 px-3 rounded-[12px] border border-[#bcc6d3] bg-white font-sans text-[14px] text-[#0f2340] outline-none focus:border-[#1c3a66]">
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <p className={cn("font-sans text-[12px] leading-4", projected < 0 ? "text-[#c0352b]" : "text-[#3f4b5e]")}>
            New balance ₹{projected.toLocaleString("en-IN")}
            {projected < 0 ? " — a debit cannot exceed the balance." : ""}
          </p>
          {error && <p className="font-sans text-[12px] font-bold text-[#c0352b]">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-[#dce2ea] flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-[12px] border-[1.5px] border-[#bcc6d3] font-sans font-bold text-[14px] text-[#0f2340]">
            Cancel
          </button>
          <button type="submit" disabled={busy || projected < 0 || !amount} className="h-10 px-4 rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white disabled:opacity-50">
            {busy ? "Processing..." : `${type === "credit" ? "Credit" : "Debit"} ₹${amount || 0}`}
          </button>
        </div>
      </form>
    </div>
  );
}
