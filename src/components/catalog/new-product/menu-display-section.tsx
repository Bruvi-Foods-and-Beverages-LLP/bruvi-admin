"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormField, FormInput, FormSelect } from "@/components/ui/form-field";
import { TagInput } from "@/components/ui/tag-input";
import { MENU_GLYPHS, type ProductFormState } from "@/lib/catalog/product-form";
import type { SetField } from "./types";

const GLYPH_LABELS: Record<(typeof MENU_GLYPHS)[number], string> = {
  phin: "Phin filter",
  leaf: "Leaf",
  matcha: "Matcha",
  cup: "Cup",
  cold_brew: "Cold brew",
  bean: "Bean",
  coffee: "Coffee",
  croissant: "Croissant",
};

/** Optional fields the customer app shows on menu cards (stored in products.metadata). */
export function MenuDisplaySection({ form, setField }: { form: ProductFormState; setField: SetField }) {
  return (
    <FormCard
      title="Menu display"
      description="Optional. How this item looks on menu cards in the customer app."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Kicker"
          htmlFor="product-kicker"
          hint="Small line above the name, e.g. ICED · SWEET. Leave empty to use dietary info."
        >
          <FormInput
            id="product-kicker"
            value={form.menuKicker}
            maxLength={40}
            placeholder="e.g. ICED · SWEET"
            onChange={(e) => setField("menuKicker", e.target.value)}
          />
        </FormField>

        <FormField label="Icon" htmlFor="product-glyph" hint="Shown when there is no photo. Defaults to the category icon.">
          <FormSelect
            id="product-glyph"
            value={form.menuGlyph}
            onChange={(e) => setField("menuGlyph", e.target.value)}
          >
            <option value="">Use category icon</option>
            {MENU_GLYPHS.map((glyph) => (
              <option key={glyph} value={glyph}>
                {GLYPH_LABELS[glyph]}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField
          label="Filter tags"
          htmlFor="product-tags"
          hint="Match the category's filter chips, e.g. iced, hot, sweet."
          className="sm:col-span-2"
        >
          <TagInput
            id="product-tags"
            value={form.menuTags}
            onChange={(tags) => setField("menuTags", tags)}
            normalize={(t) => t.toLowerCase()}
            placeholder="iced, sweet…"
          />
        </FormField>
      </div>
    </FormCard>
  );
}
