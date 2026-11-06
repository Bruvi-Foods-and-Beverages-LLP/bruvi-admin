"use client";

import * as React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { CategoryWindow, StoreMenuCategory } from "@/types/store-menu";
import { cn } from "@/lib/utils/cn";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Every half hour as "HH:MM" (storage) with a 12h label. */
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const value = `${String(h).padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { value, label: `${h12}:${i % 2 ? "30" : "00"} ${h >= 12 ? "pm" : "am"}` };
});

interface Props {
  category: StoreMenuCategory | null;
  isSubmitting: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (windows: CategoryWindow[]) => void;
}

export function StoreMenuCategoryHoursModal({ category, isSubmitting, error, onClose, onSave }: Props) {
  const [windows, setWindows] = React.useState<CategoryWindow[]>([]);
  const [openedFor, setOpenedFor] = React.useState<string | null>(null);

  // Reset the draft whenever a different category is opened
  if ((category?.categoryId ?? null) !== openedFor) {
    setOpenedFor(category?.categoryId ?? null);
    setWindows(category ? category.windows.map((w) => ({ ...w, days: [...w.days] })) : []);
  }

  if (!category) return null;

  const update = (i: number, patch: Partial<CategoryWindow>) =>
    setWindows((prev) => prev.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));

  const toggleDay = (i: number, day: string) =>
    setWindows((prev) =>
      prev.map((w, idx) =>
        idx === i
          ? { ...w, days: w.days.includes(day) ? w.days.filter((d) => d !== day) : [...w.days, day] }
          : w
      )
    );

  const invalid = windows.some((w) => w.from === w.to);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-[20px] bg-surface p-6 shadow-xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-heading-s text-text">{category.name} hours</h3>
            <p className="text-body-s text-text-muted mt-0.5">
              {windows.length === 0
                ? "Available all day, following the store's opening hours."
                : "Orderable only inside these windows. Days left unselected mean every day."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-text-muted hover:text-text hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          {windows.map((w, i) => (
            <div key={i} className="rounded-[12px] border border-border p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {[
                  ["From", "from"],
                  ["To", "to"],
                ].map(([label, key]) => (
                  <label key={key} className="flex-1 flex flex-col gap-1">
                    <span className="text-caption text-text-muted">{label}</span>
                    <select
                      value={w[key as "from" | "to"]}
                      onChange={(e) => update(i, { [key]: e.target.value } as Partial<CategoryWindow>)}
                      className="h-9 rounded-[10px] border border-border bg-surface px-2 text-body-s text-text cursor-pointer"
                    >
                      {TIMES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <button
                  type="button"
                  aria-label="Remove window"
                  onClick={() => setWindows((prev) => prev.filter((_, idx) => idx !== i))}
                  className="mt-5 p-2 rounded-full text-text-muted hover:text-error hover:bg-gray-100 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={w.days.includes(d)}
                    onClick={() => toggleDay(i, d)}
                    className={cn(
                      "h-7 px-2.5 rounded-[14px] text-caption cursor-pointer transition-colors",
                      w.days.includes(d)
                        ? "bg-primary text-white font-bold"
                        : "bg-surface border border-border text-text hover:bg-gray-50"
                    )}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
              {w.from === w.to && (
                <p className="text-caption text-error">Start and end cannot be the same time.</p>
              )}
            </div>
          ))}

          {windows.length < 6 && (
            <button
              type="button"
              onClick={() => setWindows((prev) => [...prev, { days: [], from: "06:00", to: "11:00" }])}
              className="h-9 rounded-[12px] border border-dashed border-border text-label text-text hover:bg-gray-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add window
            </button>
          )}

          {error && <p className="text-body-s text-error">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-border text-label text-text hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting || invalid}
              onClick={() => onSave(windows)}
              className="h-9 px-4 rounded-[12px] bg-primary text-label text-white hover:bg-navy-900 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save hours"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
