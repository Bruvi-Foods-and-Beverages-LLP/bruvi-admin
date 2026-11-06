"use client";

import * as React from "react";
import Link from "next/link";
import { ProductImage } from "@/components/catalog/product-image";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchStores } from "@/store/slices/stores-slice";
import { CatalogApi } from "@/lib/api/catalog";
import { cn } from "@/lib/utils/cn";
import { Switch } from "@/components/ui/switch";
import type { ModifierGroup, ModifierGroupDetail } from "@/types/catalog";
import { ModifierAppPreview } from "./modifier-app-preview";

const LINKED_PREVIEW = 5;

/** Live app preview of the group as it is being edited. */
export function ModifierLivePreviewCard({ group }: { group: ModifierGroup }) {
  // Remount on structural changes so defaults re-apply in the preview
  const key = `${group.displayStyle}:${group.modifiers.map((m) => `${m.id}${m.isDefault ? "*" : ""}`).join(",")}`;
  return (
    <section className="flex flex-col items-center gap-4 rounded-[16px] border border-border bg-surface-warm p-[21px]">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="min-w-0 truncate font-serif text-[11px] leading-[14px] tracking-[0.14em] text-text-secondary uppercase">
          Preview · {group.name} in app
        </span>
        <span className="shrink-0 text-[12px] leading-4 font-bold text-text-brand">Kiosk · POS</span>
      </div>
      <div className="w-full max-w-[358px] rounded-[24px] bg-surface p-4 shadow-floating">
        <ModifierAppPreview key={key} group={group} />
      </div>
    </section>
  );
}

/** Products using the group, with the default each one sets (Figma 225:92356 → Linked products). */
export function ModifierLinkedProductsCard({ group }: { group: ModifierGroupDetail }) {
  const products = group.linkedProducts ?? [];
  const shown = products.slice(0, LINKED_PREVIEW);
  const more = products.length - shown.length;
  const optionName = new Map(group.modifiers.map((m) => [m.id, m.name]));
  const groupDefault = group.modifiers.find((m) => m.isDefault)?.name ?? null;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-[17px]">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-text">Linked products · {products.length}</h2>
      </div>
      {shown.length === 0 ? (
        <p className="px-5 py-8 text-center text-[14px] leading-5 text-text-muted">
          No products use this group yet. Attach it from a product’s Customisation card.
        </p>
      ) : (
        <ul>
          {shown.map((p) => {
            const own = p.defaultModifierId ? optionName.get(p.defaultModifierId) : null;
            const hidden = p.hiddenModifierIds.length;
            return (
              <li key={p.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/catalog/${p.id}`}
                  className="flex h-14 items-center gap-3 px-5 hover:bg-background-subtle"
                >
                  <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-background-subtle">
                    <ProductImage src={p.imageUrl} alt={p.name} sizes="40px" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-5 font-bold text-text">{p.name}</span>
                  {own ? (
                    <span className="inline-flex h-6 shrink-0 items-center rounded-[12px] bg-background-subtle px-2 text-[12px] leading-4 font-bold text-text-secondary">
                      {own}
                      {hidden > 0 ? ` · ${hidden} hidden` : ""}
                    </span>
                  ) : (
                    <span className="shrink-0 text-[12px] leading-4 font-medium text-text-secondary">
                      {groupDefault ? `Default: ${groupDefault}` : "No default"}
                      {hidden > 0 ? ` · ${hidden} hidden` : ""}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {more > 0 && (
        <p className="border-t border-border px-5 py-3 text-[14px] leading-5 font-bold text-text-brand">
          + {more} more {more === 1 ? "product" : "products"}
        </p>
      )}
    </section>
  );
}

/** One store’s stock for this group’s options: switching one off hides it in the app at that store only. */
export function ModifierStoreStockCard({ group, canEdit }: { group: ModifierGroupDetail; canEdit: boolean }) {
  const dispatch = useAppDispatch();
  const { stores, isLoading: storesLoading } = useAppSelector((s) => s.stores);
  const [picked, setPicked] = React.useState<string>("");
  const outletId = picked || stores[0]?.id || "";
  // Stock is kept per store so switching stores never shows another store's state
  const [stock, setStock] = React.useState<{ outletId: string; out: Map<string, string | null> } | null>(null);
  const out = stock && stock.outletId === outletId ? stock.out : null;
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<{ outletId: string; message: string } | null>(null);

  React.useEffect(() => {
    if (stores.length === 0) void dispatch(fetchStores());
  }, [dispatch, stores.length]);

  React.useEffect(() => {
    if (!outletId) return;
    let alive = true;
    CatalogApi.getModifierStock(outletId)
      .then((rows) => {
        if (alive)
          setStock({ outletId, out: new Map(rows.filter((r) => !r.isAvailable).map((r) => [r.modifierId, r.reason])) });
      })
      .catch((e: unknown) => {
        if (alive) setError({ outletId, message: e instanceof Error ? e.message : "Could not load stock" });
      });
    return () => {
      alive = false;
    };
  }, [outletId]);

  const toggle = async (modifierId: string, isAvailable: boolean) => {
    setBusy(modifierId);
    setError(null);
    try {
      const rows = await CatalogApi.setModifierStock(outletId, [{ modifierId, isAvailable }]);
      setStock({ outletId, out: new Map(rows.filter((r) => !r.isAvailable).map((r) => [r.modifierId, r.reason])) });
    } catch (e: unknown) {
      setError({ outletId, message: e instanceof Error ? e.message : "Could not update stock" });
    } finally {
      setBusy(null);
    }
  };

  if (group.groupType === "TEXT" || group.modifiers.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-[18px] leading-[26px] font-extrabold text-text">Store stock</h2>
          <p className="text-[12px] leading-4 font-medium text-text-secondary">
            Out options show as “Out today” in the app at that store only
          </p>
        </div>
        <select
          value={outletId}
          onChange={(e) => {
            setPicked(e.target.value);
            setError(null);
          }}
          disabled={storesLoading && stores.length === 0}
          aria-label="Store"
          className="h-9 w-full cursor-pointer rounded-[10px] border border-border-input bg-surface px-3 text-[14px] text-text"
        >
          {stores.length === 0 && <option value="">{storesLoading ? "Loading stores…" : "No stores"}</option>}
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.code}
            </option>
          ))}
        </select>
      </div>
      {error && error.outletId === outletId && (
        <p className="px-5 pt-3 text-[13px] leading-5 text-error">{error.message}</p>
      )}
      <ul>
        {group.modifiers.map((m) => {
          const isOut = out?.has(m.id) ?? false;
          return (
            <li key={m.id} className="flex h-12 items-center gap-3 border-b border-border px-5 last:border-b-0">
              <span className={cn("min-w-0 flex-1 truncate text-[14px] leading-5 font-semibold", isOut ? "text-text-muted line-through" : "text-text")}>
                {m.name}
              </span>
              {!m.isAvailable ? (
                <span className="text-[12px] leading-4 font-medium text-text-muted">Out everywhere</span>
              ) : (
                <Switch
                  checked={!isOut}
                  aria-label={`${m.name} in stock`}
                  disabled={!canEdit || out === null || busy !== null || !outletId}
                  onCheckedChange={(on) => void toggle(m.id, on)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
