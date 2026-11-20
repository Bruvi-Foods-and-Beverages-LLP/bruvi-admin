"use client";

import * as React from "react";
import { CustomerNote } from "@/types/customers";

interface CustomerLatestNoteCardProps {
  note: CustomerNote | null;
  onViewAllNotes?: () => void;
}

export function CustomerLatestNoteCard({
  note,
  onViewAllNotes,
}: CustomerLatestNoteCardProps) {
  if (!note) {
    return (
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white p-5 flex flex-col gap-2 shadow-2xs">
        <span className="font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] [font-variation-settings:'wght'_700]">
          Latest note
        </span>
        <p className="font-sans font-normal text-[14px] leading-5 text-[#7f8ca0] [font-variation-settings:'wght'_400]">
          No barista or staff notes recorded for this customer yet.
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onViewAllNotes}
      className="w-full rounded-[16px] border border-[#dce2ea] bg-white p-5 flex flex-col gap-2 shadow-2xs cursor-pointer hover:border-[#bcc6d3] transition-colors select-none"
    >
      {/* Header Row (Figma 474:239945) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-sans font-bold text-[12px] leading-4 text-[#3f4b5e] uppercase tracking-[0.48px] [font-variation-settings:'wght'_700]">
          Latest note
        </span>
        <span className="font-sans font-medium text-[12px] leading-4 text-[#3f4b5e] [font-variation-settings:'wght'_500]">
          {note.author} · {note.date}
        </span>
      </div>

      {/* Note Content (Figma 474:239948) */}
      <p className="font-sans font-normal text-[14px] leading-5 text-[#0f2340] [font-variation-settings:'wght'_400]">
        &ldquo;{note.content}&rdquo;
      </p>
    </div>
  );
}

