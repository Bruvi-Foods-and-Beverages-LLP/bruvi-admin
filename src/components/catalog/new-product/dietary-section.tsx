"use client";

import { FormCard } from "@/components/ui/form-card";
import { ToggleTile } from "@/components/ui/switch";
import type { ProductFormState } from "@/lib/catalog/product-form";
import type { SetField } from "./types";

export function DietarySection({ form, setField }: { form: ProductFormState; setField: SetField }) {
  return (
    <FormCard title="Dietary & allergens" description="Required by FSSAI labelling. Printed on receipts and shown in app.">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <ToggleTile
            label="Vegetarian"
            hint="No meat, fish or egg"
            checked={form.isVegetarian}
            onCheckedChange={(v) => {
              setField("isVegetarian", v);
              if (!v) setField("isVegan", false);
            }}
          />
          <ToggleTile
            label="Vegan"
            hint="No animal products"
            checked={form.isVegan}
            onCheckedChange={(v) => {
              setField("isVegan", v);
              if (v) {
                setField("isVegetarian", true);
                setField("containsDairy", false);
              }
            }}
          />
          <ToggleTile
            label="Contains dairy"
            hint="Milk, cream or cheese"
            checked={form.containsDairy}
            onCheckedChange={(v) => {
              setField("containsDairy", v);
              if (v) setField("isVegan", false);
            }}
          />
          <ToggleTile label="Contains nuts" hint="Tree nuts or peanuts" checked={form.containsNuts} onCheckedChange={(v) => setField("containsNuts", v)} />
          <ToggleTile label="Contains gluten" hint="Wheat, barley or rye" checked={form.containsGluten} onCheckedChange={(v) => setField("containsGluten", v)} />
          <ToggleTile label="Caffeinated" hint="Coffee, tea or matcha base" checked={form.isCaffeinated} onCheckedChange={(v) => setField("isCaffeinated", v)} />
        </div>
        <p className="text-caption text-text-muted">Vegan automatically turns on Vegetarian and clears dairy.</p>
      </div>
    </FormCard>
  );
}
