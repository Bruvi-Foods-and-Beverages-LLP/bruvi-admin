"use client";

import * as React from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store";
import { proposeLabIdea } from "@/store/slices/lab-slice";

interface ProposeIdeaDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProposeIdeaDialog({ isOpen, onClose }: ProposeIdeaDialogProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState("");
  const [proposedBy, setProposedBy] = React.useState("");
  const [stage, setStage] = React.useState<"IDEA" | "RND">("IDEA");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a beverage concept title");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(
        proposeLabIdea({
          title: title.trim(),
          proposedBy: proposedBy.trim() || "HQ Barista",
          stage,
        })
      ).unwrap();
      onClose();
      setTitle("");
      setProposedBy("");
    } catch (err: any) {
      setError(err?.message || "Failed to submit idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[20px] bg-white border border-[#dce2ea] shadow-xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dce2ea]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBF1DE] text-[#566F2C]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-title text-[#0F2340]">Propose Lab Drink Idea</h2>
              <p className="text-caption text-[#55647A]">
                Submit a new limited-batch recipe concept to the R&D pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f7fa] text-[#55647A] hover:text-[#0F2340] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          {error && (
            <div className="p-3 rounded-[12px] bg-[#FEE2E2] border border-[#FCA5A5] text-caption text-[#B91C1C]">
              {error}
            </div>
          )}

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Drink Concept Name <span className="text-[#C0352B]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cardamom Rose Cold Foam Phin"
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-body-s text-[#0F2340] placeholder:text-[#7f8ca0] focus:outline-none focus:ring-2 focus:ring-[#cde9f9] focus:border-[#2f5690]"
              required
            />
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Proposed By
            </label>
            <input
              type="text"
              value={proposedBy}
              onChange={(e) => setProposedBy(e.target.value)}
              placeholder="e.g. Priya M. · Indiranagar Store"
              className="w-full h-9 px-3 rounded-[12px] border border-[#bcc6d3] bg-white text-body-s text-[#0F2340] placeholder:text-[#7f8ca0] focus:outline-none focus:ring-2 focus:ring-[#cde9f9] focus:border-[#2f5690]"
            />
          </div>

          <div>
            <label className="text-label text-[#0F2340] block mb-1.5">
              Initial Pipeline Stage
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStage("IDEA")}
                className={`h-9 px-3 rounded-[12px] border text-label text-center transition-all ${
                  stage === "IDEA"
                    ? "border-[#1C3A66] bg-[#E8F5FD] text-[#1C3A66] font-bold"
                    : "border-[#dce2ea] bg-white text-[#55647A] hover:bg-[#f5f7fa]"
                }`}
              >
                1 · Idea
              </button>
              <button
                type="button"
                onClick={() => setStage("RND")}
                className={`h-9 px-3 rounded-[12px] border text-label text-center transition-all ${
                  stage === "RND"
                    ? "border-[#1C3A66] bg-[#E8F5FD] text-[#1C3A66] font-bold"
                    : "border-[#dce2ea] bg-white text-[#55647A] hover:bg-[#f5f7fa]"
                }`}
              >
                2 · R&D
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#dce2ea] mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-[#dce2ea] bg-white hover:bg-[#f5f7fa] text-label text-[#55647A] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white flex items-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Idea</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

