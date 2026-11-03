"use client";

import * as React from "react";
import { FormCard } from "@/components/ui/form-card";
import { Switch, ToggleTile } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import type { ProductFormState } from "@/lib/catalog/product-form";
import type { StoreEntity } from "@/store/slices/stores-slice";
import type { SetField } from "./types";

export interface CityGroup {
  city: string;
  stores: StoreEntity[];
}

export function groupStoresByCity(stores: StoreEntity[]): CityGroup[] {
  const map = new Map<string, StoreEntity[]>();
  for (const s of stores) {
    const city = s.cityName || s.city || "Other";
    map.set(city, [...(map.get(city) ?? []), s]);
  }
  return Array.from(map, ([city, list]) => ({ city, stores: list }));
}

interface ChannelsSectionProps {
  form: ProductFormState;
  setField: SetField;
  cities: CityGroup[];
  isLoadingStores: boolean;
}

export function ChannelsSection({ form, setField, cities, isLoadingStores }: ChannelsSectionProps) {
  const toggleCity = (group: CityGroup, on: boolean) => {
    const ids = new Set(form.storeIds);
    group.stores.forEach((s) => (on ? ids.add(s.id) : ids.delete(s.id)));
    setField("storeIds", Array.from(ids));
  };

  return (
    <FormCard title="Channels & availability" description="LAB pilots usually launch in one city first.">
      <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToggleTile label="Counter" hint="In-store POS orders" checked={form.channelCounter} onCheckedChange={(v) => setField("channelCounter", v)} />
        <ToggleTile label="Kiosk" hint="Self-order kiosk" checked={form.channelKiosk} onCheckedChange={(v) => setField("channelKiosk", v)} />
        <ToggleTile label="App" hint="Bruvi mobile app" checked={form.channelApp} onCheckedChange={(v) => setField("channelApp", v)} />
        <ToggleTile label="QR" hint="Scan-to-order at table" checked={form.channelQr} onCheckedChange={(v) => setField("channelQr", v)} />
      </div>

      <div className="flex flex-col overflow-hidden rounded-[12px] border border-border">
        {isLoadingStores && cities.length === 0 && (
          <div className="px-4 py-4 text-body-s text-text-muted">Loading stores…</div>
        )}
        {!isLoadingStores && cities.length === 0 && (
          <div className="px-4 py-4 text-body-s text-text-muted">No stores available to publish to.</div>
        )}
        {cities.map((group, i) => {
          const selected = group.stores.filter((s) => form.storeIds.includes(s.id)).length;
          const on = selected > 0;
          const names = group.stores.slice(0, 3).map((s) => s.name).join(", ");
          const extra = group.stores.length - 3;
          return (
            <div
              key={group.city}
              className={cn("flex min-h-14 items-center gap-3 px-4 py-2", i > 0 && "border-t border-border")}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label text-text">{group.city}</span>
                <span className="truncate text-caption text-text-muted">
                  {group.stores.length} store{group.stores.length === 1 ? "" : "s"} · {names}
                  {extra > 0 ? ` +${extra}` : ""}
                </span>
              </div>
              <span className={cn("shrink-0 text-right text-body-s tnum", on ? "text-text" : "text-text-muted")}>
                {on ? `${selected} of ${group.stores.length}` : "Off"}
              </span>
              <Switch
                checked={on}
                onCheckedChange={(v) => toggleCity(group, v)}
                aria-label={`Publish to ${group.city}`}
              />
            </div>
          );
        })}
      </div>
      <p className="text-caption text-text-muted">
        Turn a city on to publish to all its stores. Items only appear on the channels enabled above.
      </p>
      </div>
    </FormCard>
  );
}
