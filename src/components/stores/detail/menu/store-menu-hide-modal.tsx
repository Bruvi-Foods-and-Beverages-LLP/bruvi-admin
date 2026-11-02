"use client";

import * as React from "react";
import { X } from "lucide-react";

interface StoreMenuHideModalProps {
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onApply: (channel: "counter" | "app" | "kiosk" | "qr" | "all") => void;
  isSubmitting?: boolean;
}

export function StoreMenuHideModal({
  isOpen,
  itemCount,
  onClose,
  onApply,
  isSubmitting = false,
}: StoreMenuHideModalProps) {
  const [selectedChannel, setSelectedChannel] = React.useState<
    "counter" | "app" | "kiosk" | "qr" | "all"
  >("all");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(selectedChannel);
  };

  const channelOptions: { id: "all" | "counter" | "app" | "kiosk" | "qr"; label: string; desc: string }[] = [
    { id: "all", label: "All Ordering Channels", desc: "Instantly hide item from Counter, App, Kiosks, and QR codes" },
    { id: "app", label: "Customer App & Web Only", desc: "Prevent remote digital pickup and delivery orders" },
    { id: "counter", label: "Counter POS Only", desc: "Hide on cashier terminal menu grid" },
    { id: "kiosk", label: "Self-Order Kiosks Only", desc: "Hide from in-store touchscreen stations" },
    { id: "qr", label: "Dine-In Table QR Only", desc: "Hide from customer table ordering menu" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[20px] bg-surface p-6 shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-heading-s text-text">Hide on Channel</h3>
            <p className="text-body-s text-text-muted mt-0.5">
              Select channels to hide for {itemCount} selected item{itemCount !== 1 ? "s" : ""}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-text-muted hover:text-text hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <form onSubmit={handleSubmit} className="pt-4 flex flex-col gap-3">
          {channelOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-start gap-3 p-3 rounded-[12px] border border-border hover:bg-bg-subtle cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="hide-channel"
                value={opt.id}
                checked={selectedChannel === opt.id}
                onChange={() => setSelectedChannel(opt.id)}
                className="mt-0.5 h-4 w-4 text-primary focus:ring-sky-300"
              />
              <div className="flex flex-col">
                <span className="text-label text-text">{opt.label}</span>
                <span className="text-caption text-text-muted">{opt.desc}</span>
              </div>
            </label>
          ))}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-border text-label text-text hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] bg-primary text-label text-white hover:bg-navy-900 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Hide on Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
