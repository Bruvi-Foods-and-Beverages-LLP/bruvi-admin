"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createModifierGroup,
  fetchModifierGroups,
  reorderModifierGroups,
} from "@/store/slices/modifier-groups-slice";
import { CatalogPageHeader } from "@/components/catalog/catalog-page-header";
import { ModifierGroupTable } from "@/components/catalog/modifiers/modifier-group-table";
import { ModifierPreviewCard } from "@/components/catalog/modifiers/modifier-preview-card";
import { NewModifierGroupModal } from "@/components/catalog/modifiers/new-modifier-group-modal";
import { RbacGuard } from "@/components/auth/rbac-guard";

const OUTLINE_BUTTON =
  "h-9 cursor-pointer rounded-[12px] border-[1.5px] border-border-input bg-surface px-[17.5px] text-[14px] leading-5 font-bold text-text shadow-2xs hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-60";
const PRIMARY_BUTTON =
  "flex h-9 cursor-pointer items-center gap-2 rounded-[12px] bg-primary px-4 text-[14px] leading-5 font-bold text-text-inverse shadow-2xs hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Catalog · Customisation (modifier groups) — Figma 225:91960
 */
export default function CatalogCustomisationPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const groups = useAppSelector((s) => s.modifierGroups.groups);
  const [creating, setCreating] = React.useState(false);
  const [order, setOrder] = React.useState<string[] | null>(null);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);

  React.useEffect(() => {
    void dispatch(fetchModifierGroups());
  }, [dispatch]);

  const move = (index: number, by: -1 | 1) =>
    setOrder((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      const [id] = next.splice(index, 1);
      next.splice(index + by, 0, id);
      return next;
    });

  const saveOrder = async () => {
    if (!order) return;
    setSavingOrder(true);
    setOrderError(null);
    const res = await dispatch(reorderModifierGroups(order));
    setSavingOrder(false);
    if (reorderModifierGroups.fulfilled.match(res)) setOrder(null);
    else setOrderError((res.payload as string) ?? "Could not save the new order");
  };

  const create = async (input: Parameters<typeof createModifierGroup>[0]) => {
    const res = await dispatch(createModifierGroup(input));
    if (createModifierGroup.fulfilled.match(res)) {
      router.push(`/catalog/customisation/${res.payload.id}`);
      return null;
    }
    return (res.payload as string) ?? "Could not create the group";
  };

  return (
    <div className="@container mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-12">
      <CatalogPageHeader
        activeNavTab="Customisation"
        breadcrumb="Catalog / Modifiers"
        title="Modifier groups"
        actions={
          <RbacGuard roles={["SUPER_ADMIN", "ADMIN", "HQ_OPS"]}>
            {order ? (
              <>
                <button type="button" className={OUTLINE_BUTTON} onClick={() => setOrder(null)} disabled={savingOrder}>
                  Cancel
                </button>
                <button type="button" className={PRIMARY_BUTTON} onClick={() => void saveOrder()} disabled={savingOrder}>
                  {savingOrder ? "Saving…" : "Save order"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={OUTLINE_BUTTON}
                  disabled={groups.length < 2}
                  onClick={() => setOrder(groups.map((g) => g.id))}
                >
                  Reorder
                </button>
                <button type="button" className={PRIMARY_BUTTON} onClick={() => setCreating(true)}>
                  <Plus className="size-4 stroke-[2.5]" />
                  <span>New group</span>
                </button>
              </>
            )}
          </RbacGuard>
        }
      />

      {orderError && (
        <p role="alert" className="rounded-[12px] bg-error-surface px-4 py-3 text-[14px] leading-5 text-error">
          {orderError}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-6 @5xl:flex-row @5xl:items-start">
        <div className="w-full min-w-0 @5xl:flex-1">
          <ModifierGroupTable reorder={order ? { ids: order, onMove: move } : null} />
        </div>
        <ModifierPreviewCard />
      </div>

      {creating && <NewModifierGroupModal onClose={() => setCreating(false)} onCreate={create} />}
    </div>
  );
}
