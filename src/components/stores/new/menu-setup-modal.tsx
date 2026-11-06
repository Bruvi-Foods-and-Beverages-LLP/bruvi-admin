"use client";

import * as React from "react";
import { X, Loader2 } from "lucide-react";
import type { CategoryItem } from "@/types/catalog";
import { cn } from "@/lib/utils/cn";

interface Props {
  isOpen: boolean;
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  /** Category ids hidden at this store; empty means every category is on the menu. */
  hiddenIds: string[];
  onRetry: () => void;
  onClose: () => void;
  onSave: (hiddenIds: string[]) => void;
}

export function MenuSetupModal({ isOpen, categories, isLoading, error, hiddenIds, onRetry, onClose, onSave }: Props) {
  const [hidden, setHidden] = React.useState<string[]>([]);
  const [prevOpen, setPrevOpen] = React.useState(false);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) setHidden([...hiddenIds]);
  }

  if (!isOpen) return null;

  const toggle = (id: string) =>
    setHidden((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const liveCount = categories.length - hidden.filter((id) => categories.some((c) => c.id === id)).length;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface rounded-[20px] shadow-2xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-title text-text font-bold">Menu</h3>
            <p className="text-body-s text-text-muted">
              Choose which catalogue categories this store sells. Time windows and individual items can be set from the store&apos;s Menu tab.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 py-8 justify-center text-body-s text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
          </div>
        ) : error ? (
          <div className="flex flex-col gap-2 py-4 items-start">
            <p className="text-body-s text-error">{error}</p>
            <button type="button" onClick={onRetry} className="text-label text-primary font-bold hover:underline cursor-pointer">Try again</button>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-body-s text-text-muted py-4">The catalogue has no active categories yet.</p>
        ) : (
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border border border-border rounded-[12px]">
            {categories.map((c) => {
              const on = !hidden.includes(c.id);
              return (
                <div key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-body-s font-bold text-text truncate">{c.name}</p>
                    {c.itemCount != null && <p className="text-caption text-text-muted">{c.itemCount} items</p>}
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${c.name} on menu`}
                    onClick={() => toggle(c.id)}
                    className={cn("w-10 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer shrink-0", on ? "bg-primary" : "bg-border-strong")}
                  >
                    <span className={cn("block w-5 h-5 rounded-full bg-white transition-transform", on ? "translate-x-4" : "translate-x-0")} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <span className="text-caption text-text-muted">
            {!isLoading && !error && categories.length > 0 ? `${liveCount} of ${categories.length} categories on the menu` : ""}
          </span>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="h-10 px-4 rounded-[12px] border border-border bg-surface text-label text-text hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading || !!error}
              onClick={() => { onSave(hidden); onClose(); }}
              className="h-10 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white font-bold cursor-pointer disabled:opacity-50"
            >
              Save menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
