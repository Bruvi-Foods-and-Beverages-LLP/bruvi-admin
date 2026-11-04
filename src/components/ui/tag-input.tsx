"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  /** Normalise each tag before it is added (e.g. lower-case for filter tags). */
  normalize?: (tag: string) => string;
}

/** Chips input: Enter or comma adds a tag, Backspace on an empty field removes the last one. */
export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Type and press Enter",
  maxTags = 12,
  maxLength = 32,
  normalize = (t) => t,
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const tag = normalize(raw.trim()).slice(0, maxLength);
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
  };

  const commitDraft = () => {
    if (!draft.trim()) return;
    draft.split(",").forEach(add);
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-[12px] border border-border-input bg-white px-2 py-1.5",
        "focus-within:border-2 focus-within:border-primary"
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-background-subtle px-2.5 py-1 text-caption-bold text-text"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="cursor-pointer text-text-muted hover:text-text"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        disabled={value.length >= maxTags}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitDraft();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commitDraft}
        placeholder={value.length >= maxTags ? "" : placeholder}
        className="min-w-[120px] flex-1 bg-transparent px-1 text-body-s text-text outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
