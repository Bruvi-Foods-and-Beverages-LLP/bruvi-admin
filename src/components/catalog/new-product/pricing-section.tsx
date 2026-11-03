"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormField, FormInput, FormSelect } from "@/components/ui/form-field";
import { cn } from "@/lib/utils/cn";
import { TAX_CLASSES, type ProductFormState } from "@/lib/catalog/product-form";
import type { CategoryItem, ModifierGroup, PrepStation } from "@/types/catalog";
import type { SetField } from "./types";

interface PricingSectionProps {
  form: ProductFormState;
  setField: SetField;
  categories: CategoryItem[];
  modifierGroups: ModifierGroup[];
  errors: Partial<Record<"categoryId" | "basePriceRupees", string>>;
  isLoadingModifiers?: boolean;
}

const STATIONS: { value: PrepStation; label: string }[] = [
  { value: "BAR", label: "Bar" },
  { value: "KITCHEN", label: "Kitchen" },
];

export function PricingSection({
  form,
  setField,
  categories,
  modifierGroups,
  errors,
  isLoadingModifiers = false,
}: PricingSectionProps) {
  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const stationLabel = form.prepStation === "BAR" ? "Bar" : "Kitchen";

  const toggleGroup = (id: string) =>
    setField(
      "modifierGroupIds",
      form.modifierGroupIds.includes(id)
        ? form.modifierGroupIds.filter((g) => g !== id)
        : [...form.modifierGroupIds, id]
    );

  const chipLabel = (g: ModifierGroup) => {
    const isCount = g.groupType === "COUNT";
    const max = g.maxSelect ?? 1;
    return isCount && max > 1 ? `${g.name} · max ${max}` : g.name;
  };

  return (
    <FormCard
      title="Category, price & prep"
      description="Base price applies to every store unless a price list or override says otherwise."
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="Category"
            htmlFor="product-category"
            required
            error={errors.categoryId}
            hint="Sets the menu section and card colour."
          >
            <FormSelect
              id="product-category"
              value={form.categoryId}
              invalid={!!errors.categoryId}
              dotColor={selectedCategory ? selectedCategory.colorHex || "var(--color-category-lab)" : undefined}
              onChange={(e) => setField("categoryId", e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FormSelect>
          </FormField>

          <FormField
            label="Base price"
            htmlFor="product-price"
            required
            error={errors.basePriceRupees}
            hint="In ₹, tax included. Est. cost shows once a recipe is linked."
          >
            <FormInput
              id="product-price"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              prefix="₹"
              placeholder="0"
              value={form.basePriceRupees}
              invalid={!!errors.basePriceRupees}
              className="tnum font-bold"
              onChange={(e) => setField("basePriceRupees", e.target.value)}
            />
          </FormField>

          <FormField label="Tax class" htmlFor="product-tax" hint="GST slab and HSN code printed on invoices.">
            <FormSelect id="product-tax" value={form.taxClass} onChange={(e) => setField("taxClass", e.target.value)}>
              {TAX_CLASSES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <FormField label="Prep station" hint={`Tickets route to ${stationLabel} KDS at every store.`}>
            <div role="radiogroup" aria-label="Prep station" className="flex h-10 items-center gap-1 rounded-[12px] border border-border-input bg-background-subtle p-1">
              {STATIONS.map((s) => {
                const active = form.prepStation === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setField("prepStation", s.value)}
                    className={cn(
                      "h-full flex-1 rounded-[8px] text-label transition-colors cursor-pointer",
                      active ? "bg-white text-text shadow-raised" : "text-text-muted hover:text-text"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField
            label="Customisation groups"
            hint="Choose the option sets customers see when adding this item (size, ice, shots…)."
          >
            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-[12px] border border-border-input bg-white px-3 py-1.5">
              {isLoadingModifiers ? (
                <span className="text-body-s text-gray-400">Loading modifiers…</span>
              ) : modifierGroups.length === 0 ? (
                <span className="text-body-s text-gray-400">No customisation groups created yet</span>
              ) : (
                modifierGroups.map((g) => {
                  const on = form.modifierGroupIds.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleGroup(g.id)}
                      className={cn(
                        "h-7 rounded-full px-3 text-label transition-colors cursor-pointer",
                        on ? "bg-surface-brand text-text" : "border border-border text-text-muted hover:bg-background-subtle"
                      )}
                    >
                      {chipLabel(g)}
                    </button>
                  );
                })
              )}
            </div>
          </FormField>
        </div>
      </div>
    </FormCard>
  );
}
