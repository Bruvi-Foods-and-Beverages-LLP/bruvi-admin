"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { CatalogApi } from "@/lib/api/catalog";
import { MODIFIER_TYPE_LABEL } from "@/lib/catalog/modifier-groups";
import { cn } from "@/lib/utils/cn";
import type { ModifierGroupDetail, ProductModifierBinding } from "@/types/catalog";

interface Props {
  productId: string;
  productName: string;
  bindings: ProductModifierBinding[];
  groups: ModifierGroupDetail[];
  onClose: () => void;
  onSaved: (next: ProductModifierBinding[]) => void;
}

type Row = Pick<
  ProductModifierBinding,
  | "modifierGroupId"
  | "name"
  | "groupType"
  | "defaultModifierId"
  | "hiddenModifierIds"
  | "isRequiredOverride"
  | "maxSelectOverride"
  | "includedQuantityOverride"
  | "options"
>;

const SELECT =
  "h-9 min-w-0 cursor-pointer rounded-[10px] border border-border-input bg-surface px-3 text-[14px] text-text outline-none focus-visible:border-focus";

function rowFromGroup(g: ModifierGroupDetail): Row {
  return {
    modifierGroupId: g.id,
    name: g.name,
    groupType: g.groupType,
    defaultModifierId: null,
    hiddenModifierIds: [],
    isRequiredOverride: null,
    maxSelectOverride: null,
    includedQuantityOverride: null,
    options: g.modifiers.map((m) => ({ id: m.id, name: m.name, isDefault: m.isDefault })),
  };
}

/** Which groups this product offers, in order, and its own default / hidden options per group. */
export function ProductCustomisationModal({ productId, productName, bindings, groups, onClose, onSaved }: Props) {
  const [rows, setRows] = React.useState<Row[]>(bindings);
  const [adding, setAdding] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const attached = new Set(rows.map((r) => r.modifierGroupId));
  // Nested groups (milk amount) come with their parent option, never attached on their own
  const addable = groups.filter((g) => !attached.has(g.id) && g.parentOptionIds.length === 0);

  const update = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.modifierGroupId === id ? { ...r, ...patch } : r)));

  const move = (index: number, by: -1 | 1) =>
    setRows((prev) => {
      const next = [...prev];
      const [r] = next.splice(index, 1);
      next.splice(index + by, 0, r);
      return next;
    });

  const toggleHidden = (row: Row, optionId: string) => {
    const hidden = row.hiddenModifierIds.includes(optionId)
      ? row.hiddenModifierIds.filter((x) => x !== optionId)
      : [...row.hiddenModifierIds, optionId];
    update(row.modifierGroupId, {
      hiddenModifierIds: hidden,
      defaultModifierId: hidden.includes(row.defaultModifierId ?? "") ? null : row.defaultModifierId,
    });
  };

  const save = async () => {
    const empty = rows.find((r) => r.groupType !== "TEXT" && r.options.every((o) => r.hiddenModifierIds.includes(o.id)));
    if (empty) {
      setError(`${empty.name}: keep at least one option visible.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const next = await CatalogApi.setProductModifierBindings(
        productId,
        rows.map((r) => ({
          modifierGroupId: r.modifierGroupId,
          defaultModifierId: r.defaultModifierId,
          hiddenModifierIds: r.hiddenModifierIds,
          isRequiredOverride: r.isRequiredOverride,
          maxSelectOverride: r.maxSelectOverride,
          includedQuantityOverride: r.includedQuantityOverride,
        })),
      );
      onSaved(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save customisation");
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-custom-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-brand text-primary">
              <SlidersHorizontal className="size-5" />
            </div>
            <div>
              <h3 id="product-custom-title" className="text-[18px] leading-[26px] font-extrabold text-text">
                Customisation · {productName}
              </h3>
              <p className="text-[14px] leading-5 text-text-muted">
                Order, default and hidden options apply to this product only.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="cursor-pointer rounded-full p-1 text-text-muted hover:bg-background-subtle hover:text-text"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto px-6 py-4">
          {error && (
            <p className="rounded-[12px] border border-error/20 bg-error-surface p-3 text-[13px] font-medium text-error">
              {error}
            </p>
          )}
          {rows.length === 0 && (
            <p className="py-6 text-center text-[14px] text-text-muted">No groups attached yet.</p>
          )}

          {rows.map((r, i) => {
            const groupDefault = r.options.find((o) => o.isDefault)?.name;
            return (
              <div key={r.modifierGroupId} className="flex flex-col gap-3 rounded-[12px] border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-5 font-bold text-text">
                    {r.name}
                    <span className="ml-2 text-[12px] font-medium text-text-secondary">{MODIFIER_TYPE_LABEL[r.groupType]}</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Move ${r.name} up`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="cursor-pointer rounded p-1 text-text-secondary hover:text-text disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${r.name} down`}
                    disabled={i === rows.length - 1}
                    onClick={() => move(i, 1)}
                    className="cursor-pointer rounded p-1 text-text-secondary hover:text-text disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${r.name}`}
                    onClick={() => setRows((prev) => prev.filter((x) => x.modifierGroupId !== r.modifierGroupId))}
                    className="cursor-pointer rounded p-1 text-text-secondary hover:text-error"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {r.groupType !== "TEXT" && r.options.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr] sm:items-start">
                    <label className="flex flex-col gap-1">
                      <span className="text-[12px] leading-4 font-bold text-text-secondary">Default here</span>
                      <select
                        className={SELECT}
                        value={r.defaultModifierId ?? ""}
                        onChange={(e) => update(r.modifierGroupId, { defaultModifierId: e.target.value || null })}
                      >
                        <option value="">{groupDefault ? `Group default (${groupDefault})` : "No default"}</option>
                        {r.options
                          .filter((o) => !r.hiddenModifierIds.includes(o.id))
                          .map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                      </select>
                    </label>
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] leading-4 font-bold text-text-secondary">
                        Offered here · tap to hide
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {r.options.map((o) => {
                          const hidden = r.hiddenModifierIds.includes(o.id);
                          return (
                            <button
                              key={o.id}
                              type="button"
                              aria-pressed={!hidden}
                              onClick={() => toggleHidden(r, o.id)}
                              className={cn(
                                "h-7 cursor-pointer rounded-full border px-3 text-[12px] font-bold",
                                hidden
                                  ? "border-border bg-background-subtle text-text-muted line-through"
                                  : "border-primary bg-surface-brand text-text",
                              )}
                            >
                              {o.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center gap-2 pt-1">
            <select
              className={cn(SELECT, "flex-1")}
              value={adding}
              onChange={(e) => setAdding(e.target.value)}
              aria-label="Group to attach"
              disabled={addable.length === 0}
            >
              <option value="">{addable.length === 0 ? "Every group is attached" : "Attach a group…"}</option>
              {addable.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} · {MODIFIER_TYPE_LABEL[g.groupType]}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!adding}
              onClick={() => {
                const g = groups.find((x) => x.id === adding);
                if (g) setRows((prev) => [...prev, rowFromGroup(g)]);
                setAdding("");
              }}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-border-input bg-surface px-3 text-[14px] font-bold text-text hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" /> Attach
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 cursor-pointer rounded-[12px] border-[1.5px] border-border-input bg-surface px-[17.5px] text-[14px] font-bold text-text hover:bg-background-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-[12px] bg-primary px-4 text-[14px] font-bold text-text-inverse hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save customisation
          </button>
        </div>
      </div>
    </div>
  );
}
