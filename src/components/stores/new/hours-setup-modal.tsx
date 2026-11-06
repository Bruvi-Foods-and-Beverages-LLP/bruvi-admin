"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SetupDayHours {
  day: string;
  isOpen: boolean;
  opens: string;
  closes: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Every half hour of the day, "12:00 am" … "11:30 pm". */
const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h24 = Math.floor(i / 2);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${i % 2 === 0 ? "00" : "30"} ${h24 >= 12 ? "pm" : "am"}`;
});

/** A week that opens 7:00 am – 11:00 pm every day: the starting point the admin then adjusts. */
export function defaultSetupWeek(): SetupDayHours[] {
  return DAYS.map((day) => ({ day, isOpen: true, opens: "7:00 am", closes: "11:00 pm" }));
}

/** "Mon–Sun · 7:00 am – 11:00 pm" style summary for the checklist. */
export function summariseWeek(week: SetupDayHours[]): string {
  const open = week.filter((d) => d.isOpen);
  if (open.length === 0) return "Closed every day";
  const same = open.every((d) => d.opens === open[0].opens && d.closes === open[0].closes);
  const days = open.length === 7 ? "Every day" : `${open.length} days a week`;
  return same ? `${days} · ${open[0].opens} – ${open[0].closes}` : `${days} · hours vary`;
}

interface Props {
  isOpen: boolean;
  value: SetupDayHours[] | null;
  onClose: () => void;
  onSave: (week: SetupDayHours[]) => void;
}

export function HoursSetupModal({ isOpen, value, onClose, onSave }: Props) {
  const [draft, setDraft] = React.useState<SetupDayHours[]>(defaultSetupWeek);
  const [prevOpen, setPrevOpen] = React.useState(false);

  // Start from the saved choice (or the suggestion) each time the modal opens
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) setDraft(value ? value.map((d) => ({ ...d })) : defaultSetupWeek());
  }

  if (!isOpen) return null;

  const update = (day: string, patch: Partial<SetupDayHours>) =>
    setDraft((prev) => prev.map((d) => (d.day === day ? { ...d, ...patch } : d)));
  const invalid = draft.find((d) => d.isOpen && d.opens === d.closes);
  const monday = draft[0];

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-surface rounded-[20px] shadow-2xl border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-title text-text font-bold">Opening hours</h3>
            <p className="text-body-s text-text-muted">
              Saved with the store when you create it. Channels and special dates can be refined later.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            setDraft((prev) =>
              prev.map((d) => ({ ...d, isOpen: monday.isOpen, opens: monday.opens, closes: monday.closes }))
            )
          }
          className="self-start text-label text-primary font-bold hover:underline cursor-pointer"
        >
          Apply Monday to all days
        </button>

        <div className="divide-y divide-border border border-border rounded-[12px]">
          {draft.map((d) => (
            <div key={d.day} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-[96px] text-body-s font-bold text-text">{d.day}</span>
              <button
                type="button"
                role="switch"
                aria-checked={d.isOpen}
                aria-label={`${d.day} open`}
                onClick={() => update(d.day, { isOpen: !d.isOpen })}
                className={cn("w-10 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer", d.isOpen ? "bg-primary" : "bg-border-strong")}
              >
                <span className={cn("block w-5 h-5 rounded-full bg-white transition-transform", d.isOpen ? "translate-x-4" : "translate-x-0")} />
              </button>
              <select
                value={d.opens}
                disabled={!d.isOpen}
                onChange={(e) => update(d.day, { opens: e.target.value })}
                className="h-9 flex-1 rounded-[10px] border border-border-input bg-white px-2 text-body-s disabled:opacity-40"
              >
                {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <span className="text-text-muted">–</span>
              <select
                value={d.closes}
                disabled={!d.isOpen}
                onChange={(e) => update(d.day, { closes: e.target.value })}
                className="h-9 flex-1 rounded-[10px] border border-border-input bg-white px-2 text-body-s disabled:opacity-40"
              >
                {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>

        {invalid && (
          <p className="text-[12px] font-medium text-error">
            {invalid.day}: opening and closing time can&apos;t be the same.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-[12px] border border-border bg-surface text-label text-text hover:bg-gray-50 cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            disabled={!!invalid}
            onClick={() => { onSave(draft); onClose(); }}
            className="h-10 px-5 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white font-bold cursor-pointer disabled:opacity-50"
          >
            Save hours
          </button>
        </div>
      </div>
    </div>
  );
}
