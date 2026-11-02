"use client";

import * as React from "react";
import { X } from "lucide-react";

interface StoreMenuOverrideModalProps {
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onApply: (overridePricePaise: number | null) => void;
  isSubmitting?: boolean;
}

export function StoreMenuOverrideModal({
  isOpen,
  itemCount,
  onClose,
  onApply,
  isSubmitting = false,
}: StoreMenuOverrideModalProps) {
  const [priceInput, setPriceInput] = React.useState("");
  const [isClearing, setIsClearing] = React.useState(false);
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setPriceInput("");
      setIsClearing(false);
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isClearing) {
      onApply(null);
    } else {
      const parsed = parseFloat(priceInput);
      if (!isNaN(parsed) && parsed >= 0) {
        onApply(Math.round(parsed * 100));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[20px] bg-surface p-6 shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-heading-s text-text">Set Price Override</h3>
            <p className="text-body-s text-text-muted mt-0.5">
              Apply a custom outlet price for {itemCount} selected item{itemCount !== 1 ? "s" : ""}.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="pt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="override-price-input" className="text-label text-text">
              Override Price (₹)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-body-s text-text-muted font-bold">
                ₹
              </span>
              <input
                id="override-price-input"
                type="number"
                min="0"
                step="1"
                disabled={isClearing}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="e.g. 250"
                className="w-full h-10 pl-7 pr-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:bg-gray-50 disabled:opacity-50"
              />
            </div>
            <p className="text-caption text-text-muted">
              Overrides the global catalog price for this outlet only.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="clear-override-checkbox"
              type="checkbox"
              checked={isClearing}
              onChange={(e) => setIsClearing(e.target.checked)}
              className="h-4 w-4 rounded-[4px] border-border-input text-primary focus:ring-sky-300"
            />
            <label
              htmlFor="clear-override-checkbox"
              className="text-body-s text-text select-none cursor-pointer"
            >
              Remove override and reset to base catalog price
            </label>
          </div>

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
              disabled={isSubmitting || (!isClearing && (!priceInput || isNaN(parseFloat(priceInput))))}
              className="h-9 px-4 rounded-[12px] bg-primary text-label text-white hover:bg-navy-900 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Applying..." : "Save Override"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
