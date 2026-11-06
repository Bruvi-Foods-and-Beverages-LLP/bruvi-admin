"use client";

import * as React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchModifierGroups } from "@/store/slices/modifier-groups-slice";
import { CatalogApi } from "@/lib/api/catalog";
import { formatRupees } from "@/lib/catalog/modifier-groups";
import { RbacGuard } from "@/components/auth/rbac-guard";
import { Skeleton } from "@/components/ui/skeleton";
import type { CatalogProduct, ModifierGroupDetail, ProductModifierBinding } from "@/types/catalog";
import { ProductCustomisationModal } from "./product-customisation-modal";

interface ProductCustomisationCardProps {
  product: CatalogProduct;
}

/** "Default Large · 3 options from +₹40 · Hot hidden" built from the group and this product's settings. */
function bindingSummary(binding: ProductModifierBinding, group: ModifierGroupDetail | undefined): string {
  const optionName = new Map(binding.options.map((o) => [o.id, o.name]));
  const visible = binding.options.filter((o) => !binding.hiddenModifierIds.includes(o.id));
  const parts: string[] = [];

  if (binding.groupType === "TEXT") {
    parts.push(group?.maxLength ? `Note · ${group.maxLength} chars` : "Note");
    if (group?.hint) parts.push(group.hint);
    return parts.join(" · ");
  }

  const def = binding.defaultModifierId
    ? optionName.get(binding.defaultModifierId)
    : visible.find((o) => o.isDefault)?.name;
  if (visible.length === 1) parts.push(`${visible[0].name} only`);
  else if (def) parts.push(`Default ${def}`);

  const prices = (group?.modifiers ?? [])
    .filter((m) => visible.some((v) => v.id === m.id) && m.pricePaise > 0)
    .map((m) => m.pricePaise);
  if (binding.groupType === "COUNT" && group) {
    const max = Math.max(...group.modifiers.map((m) => m.maxQuantity ?? 1));
    const unit = group.unitLabel ? ` ${group.unitLabel}s` : "";
    parts.push(`max ${max}${unit}`);
    if (prices.length) parts.push(`+${formatRupees(Math.min(...prices))} each`);
  } else if (visible.length > 1) {
    parts.push(`${visible.length} options`);
    if (prices.length) parts.push(`from +${formatRupees(Math.min(...prices))}`);
  }
  if (binding.hiddenModifierIds.length > 0 && visible.length > 1) {
    parts.push(`${binding.hiddenModifierIds.length} hidden`);
  }
  return parts.join(" · ");
}

/**
 * Customisation card (Figma 225:90959): the groups this product offers, with its own defaults.
 */
export function ProductCustomisationCard({ product }: ProductCustomisationCardProps) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((s) => s.modifierGroups.groups);
  const [bindings, setBindings] = React.useState<ProductModifierBinding[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [managing, setManaging] = React.useState(false);
  const [reload, setReload] = React.useState(0);

  React.useEffect(() => {
    if (groups.length === 0) void dispatch(fetchModifierGroups());
  }, [dispatch, groups.length]);

  React.useEffect(() => {
    let alive = true;
    CatalogApi.getProductModifierBindings(product.id)
      .then((rows) => {
        if (alive) {
          setBindings(rows);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (alive) setError(e instanceof Error ? e.message : "Could not load customisation");
      });
    return () => {
      alive = false;
    };
  }, [product.id, reload]);

  const groupById = new Map(groups.map((g) => [g.id, g]));

  return (
    <div
      id="customisation"
      className="flex min-h-[348px] flex-1 flex-col overflow-hidden rounded-[16px] border border-border bg-surface font-sans shadow-2xs"
    >
      <div className="flex h-[50px] items-center justify-between border-b border-background-subtle px-5">
        <h2 className="text-[18px] leading-[26px] font-extrabold text-text">
          Customisation · {bindings?.length ?? 0}
        </h2>
        <RbacGuard roles={["SUPER_ADMIN", "ADMIN", "HQ_OPS"]}>
          <button
            type="button"
            onClick={() => setManaging(true)}
            disabled={bindings === null}
            className="cursor-pointer text-[14px] leading-5 font-bold text-text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Manage
          </button>
        </RbacGuard>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <p className="text-[14px] leading-5 text-error">{error}</p>
          <button
            type="button"
            onClick={() => setReload((n) => n + 1)}
            className="cursor-pointer text-[14px] font-bold text-text-brand hover:underline"
          >
            Retry
          </button>
        </div>
      ) : bindings === null ? (
        <div className="flex flex-col gap-3 px-5 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : bindings.length === 0 ? (
        <p className="px-5 py-10 text-center text-[14px] leading-5 text-text-muted">
          Customers can’t customise this product yet. Use Manage to attach modifier groups.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border pb-2">
          {bindings.map((b) => (
            <Link
              key={b.modifierGroupId}
              href={`/catalog/customisation/${b.modifierGroupId}`}
              className="flex min-h-8 items-center gap-3 px-5 py-1.5 transition-colors hover:bg-background-subtle"
            >
              <span className="w-[120px] shrink-0 truncate text-[14px] leading-5 font-bold text-text">{b.name}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] leading-4 font-medium text-text-secondary">
                {bindingSummary(b, groupById.get(b.modifierGroupId))}
              </span>
            </Link>
          ))}
        </div>
      )}

      {managing && bindings && (
        <ProductCustomisationModal
          productId={product.id}
          productName={product.name}
          bindings={bindings}
          groups={groups}
          onClose={() => setManaging(false)}
          onSaved={(next) => {
            setBindings(next);
            setManaging(false);
          }}
        />
      )}
    </div>
  );
}
