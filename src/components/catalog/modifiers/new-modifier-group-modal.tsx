"use client";

import * as React from "react";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { FormField, FormInput, FormSelect } from "@/components/ui/form-field";
import { STYLES_BY_TYPE, STYLE_LABEL } from "@/lib/catalog/modifier-editor";
import type { ModifierDisplayStyle, ModifierGroupType } from "@/types/catalog";

const TYPES: { value: ModifierGroupType; label: string; hint: string }[] = [
  { value: "CHOICE", label: "Choice", hint: "Swaps an ingredient: size, temperature, milk" },
  { value: "LEVEL", label: "Level", hint: "Scales the recipe: ice, sweetness, cream cap" },
  { value: "COUNT", label: "Count", hint: "Adds portions with a stepper: shots, pumps" },
  { value: "TEXT", label: "Text", hint: "A note for the barista" },
];

interface Props {
  onClose: () => void;
  onCreate: (input: { name: string; groupType: ModifierGroupType; displayStyle: ModifierDisplayStyle }) => Promise<string | null>;
}

/** Name, type and how the app shows it; options are added on the group page after. */
export function NewModifierGroupModal({ onClose, onCreate }: Props) {
  const [name, setName] = React.useState("");
  const [groupType, setGroupType] = React.useState<ModifierGroupType>("CHOICE");
  const [displayStyle, setDisplayStyle] = React.useState<ModifierDisplayStyle>("RADIO");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    const failure = await onCreate({ name: name.trim(), groupType, displayStyle });
    if (failure) {
      setError(failure);
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-group-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-[480px] flex-col gap-5 overflow-y-auto rounded-[20px] border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-brand text-primary">
              <SlidersHorizontal className="size-5" />
            </div>
            <div>
              <h3 id="new-group-title" className="text-[18px] leading-[26px] font-extrabold text-text">
                New modifier group
              </h3>
              <p className="text-[14px] leading-5 text-text-muted">Add its options on the next page.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="cursor-pointer rounded-full p-1 text-text-muted hover:bg-background-subtle hover:text-text"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <p className="rounded-[12px] border border-error/20 bg-error-surface p-3 text-[13px] font-medium text-error">
            {error}
          </p>
        )}

        <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
          <FormField label="Name" htmlFor="mg-name" required>
            <FormInput
              id="mg-name"
              value={name}
              maxLength={64}
              autoFocus
              placeholder="e.g. Cold foam"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormField>

          <FormField label="Type" htmlFor="mg-type" hint={TYPES.find((t) => t.value === groupType)?.hint}>
            <FormSelect
              id="mg-type"
              value={groupType}
              onChange={(e) => {
                const next = e.target.value as ModifierGroupType;
                setGroupType(next);
                setDisplayStyle(STYLES_BY_TYPE[next][0]);
              }}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Shown in the app as" htmlFor="mg-style">
            <FormSelect
              id="mg-style"
              value={displayStyle}
              disabled={STYLES_BY_TYPE[groupType].length === 1}
              onChange={(e) => setDisplayStyle(e.target.value as ModifierDisplayStyle)}
            >
              {STYLES_BY_TYPE[groupType].map((s) => (
                <option key={s} value={s}>
                  {STYLE_LABEL[s]}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-9 cursor-pointer rounded-[12px] border-[1.5px] border-border-input bg-surface px-[17.5px] text-[14px] font-bold text-text hover:bg-background-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex h-9 cursor-pointer items-center gap-2 rounded-[12px] bg-primary px-4 text-[14px] font-bold text-text-inverse hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Create group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
