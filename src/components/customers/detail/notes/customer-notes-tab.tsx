"use client";

import * as React from "react";
import { CustomerNote } from "@/types/customers";
import { useAppDispatch } from "@/store";
import { addCustomerNoteAction } from "@/store/slices/customers-slice";
import { MessageSquare, Plus } from "lucide-react";
import { Pagination, usePagination } from "@/components/ui/pagination";

interface CustomerNotesTabProps {
  customerId: string;
  notes: CustomerNote[];
  onAdded?: () => void;
}

export function CustomerNotesTab({ customerId, notes, onAdded }: CustomerNotesTabProps) {
  const dispatch = useAppDispatch();
  const [newNoteContent, setNewNoteContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState<CustomerNote[]>(notes);

  const pager = usePagination(localNotes, 10, "notes");

  React.useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        addCustomerNoteAction({
          id: customerId,
          content: newNoteContent.trim(),
        })
      ).unwrap();

      onAdded?.();
      setNewNoteContent("");
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      {/* Left: Notes Timeline (8 cols) */}
      <div className="lg:col-span-8 rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden flex flex-col">
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#dce2ea] bg-[#f5f7fa]">
          <h3 className="font-sans font-extrabold text-[16px] text-[#0f2340] [font-variation-settings:'wght'_800]">
            Staff Notes ({localNotes.length})
          </h3>
          <span className="font-sans text-[12px] text-[#55647a]">
            Visible to baristas, store managers, and HQ support
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[#dce2ea]">
          {localNotes.length === 0 ? (
            <div className="p-8 text-center text-[#55647a] text-[14px]">
              No notes recorded yet. Add the first observation or preference note on the right.
            </div>
          ) : (
            pager.pageItems.map((note) => (
              <div key={note.id} className="p-5 flex items-start gap-4 hover:bg-[#f5f7fa]/50 transition-colors">
                <div className="h-9 w-9 rounded-full bg-[#e8f5fd] flex items-center justify-center text-[#1c3a66] shrink-0 mt-0.5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-[14px] text-[#0f2340]">
                      {note.author}
                    </span>
                    <span className="font-sans text-[12px] text-[#55647a]">
                      {note.date}
                    </span>
                  </div>
                  <p className="font-sans text-[14px] leading-5 text-[#3f4b5e]">
                    &ldquo;{note.content}&rdquo;
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {localNotes.length > 0 && <Pagination {...pager.paginationProps} />}
      </div>

      {/* Right: Add Note Form (4 cols) */}
      <form
        onSubmit={handleAddNote}
        className="lg:col-span-4 rounded-[16px] border border-[#dce2ea] bg-white p-5 flex flex-col gap-4 shadow-2xs"
      >
        <h3 className="font-sans font-extrabold text-[16px] text-[#0f2340] [font-variation-settings:'wght'_800]">
          Add staff note
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-bold text-[12px] text-[#3f4b5e] uppercase tracking-[0.48px]">
            Observation or preference
          </label>
          <textarea
            rows={4}
            placeholder="e.g. Regular around 8:30 am. Prefers extra napkin, loves light ice on iced lattes."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full p-3 rounded-[12px] border border-[#bcc6d3] font-sans text-[14px] text-[#0f2340] focus:outline-none focus:border-[#1c3a66] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !newNoteContent.trim()}
          className="h-9 w-full rounded-[12px] bg-[#1c3a66] hover:bg-[#0f2340] font-sans font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>{isSubmitting ? "Saving note..." : "Save note"}</span>
        </button>
      </form>
    </div>
  );
}

