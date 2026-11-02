"use client";

import * as React from "react";
import { X, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAddSpecialDateModalOpen,
  addSpecialDate,
} from "@/store/slices/store-hours-slice";

interface AddSpecialDateModalProps {
  currentStoreCode: string;
}

export function AddSpecialDateModal({
  currentStoreCode,
}: AddSpecialDateModalProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.storeHours.addSpecialDateModalOpen
  );

  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("2026-11-14");
  const [type, setType] = React.useState<"short" | "normal">("short");
  const [hours, setHours] = React.useState("8:00 am – 6:00 pm");
  const [subtitle, setSubtitle] = React.useState("Special holiday hours");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setAddSpecialDateModalOpen(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const parsedDate = new Date(date);
    const month = parsedDate.toLocaleString("en-US", { month: "short" });
    const day = parsedDate.getDate();

    setIsSubmitting(true);
    try {
      await dispatch(
        addSpecialDate({
          storeIdOrCode: currentStoreCode,
          payload: {
            month,
            day,
            date,
            title,
            subtitle,
            hours: type === "normal" ? "Normal hours" : hours,
            isShortDay: type === "short",
            isNormalHours: type === "normal",
          },
        })
      ).unwrap();
    } catch {
      // Handled by redux
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-[20px] bg-surface p-6 shadow-xl border border-[#dce2ea]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans text-[18px] font-extrabold text-[#0f2340]">Add Special Date</h3>
              <p className="font-sans text-[12px] font-medium text-[#3f4b5e]">
                Override weekly hours for a holiday or one-off event.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-text-muted hover:text-text hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0f2340] mb-1.5">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Year's Eve, Diwali, Republic Day"
              className="w-full h-10 rounded-[10px] border border-[#bcc6d3] bg-surface px-3 font-sans text-[14px] font-medium text-[#0f2340] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0f2340] mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 rounded-[10px] border border-[#bcc6d3] bg-surface px-3 font-sans text-[14px] font-medium text-[#0f2340] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0f2340] mb-1.5">
              Operating Schedule
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("short")}
                className={`h-9 rounded-[10px] border font-sans text-[13px] font-bold transition-all cursor-pointer ${
                  type === "short"
                    ? "bg-[#1c3a66] text-white border-[#1c3a66]"
                    : "bg-surface border-[#dce2ea] text-[#0f2340] hover:bg-gray-50"
                }`}
              >
                Custom / Short day
              </button>
              <button
                type="button"
                onClick={() => setType("normal")}
                className={`h-9 rounded-[10px] border font-sans text-[13px] font-bold transition-all cursor-pointer ${
                  type === "normal"
                    ? "bg-[#1c3a66] text-white border-[#1c3a66]"
                    : "bg-surface border-[#dce2ea] text-[#0f2340] hover:bg-gray-50"
                }`}
              >
                Normal hours
              </button>
            </div>
          </div>

          {type === "short" && (
            <div>
              <label className="block font-sans text-[13px] font-bold text-[#0f2340] mb-1.5">
                Special Hours
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 8:00 am – 6:00 pm"
                className="w-full h-10 rounded-[10px] border border-[#bcc6d3] bg-surface px-3 font-sans text-[14px] font-medium text-[#0f2340] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 shadow-2xs"
              />
            </div>
          )}

          <div>
            <label className="block font-sans text-[13px] font-bold text-[#0f2340] mb-1.5">
              Subtitle / Channel Note
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Tue · short day · app & delivery follow"
              className="w-full h-10 rounded-[10px] border border-[#bcc6d3] bg-surface px-3 font-sans text-[14px] font-medium text-[#0f2340] focus:outline-none focus:ring-2 focus:ring-[#1c3a66]/20 shadow-2xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dce2ea] mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] font-bold text-[#0f2340] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title || !date}
              className="h-9 px-4 rounded-[12px] bg-[#1c3a66] font-sans text-[14px] font-bold text-white hover:bg-[#0f2340] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {isSubmitting ? "Adding..." : "Add Special Date"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

