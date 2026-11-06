"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearModifierSaveError,
  deleteModifierGroup,
  duplicateModifierGroup,
  fetchModifierGroupDetail,
  fetchModifierGroups,
  saveModifierGroup,
} from "@/store/slices/modifier-groups-slice";
import { CatalogPageHeader } from "@/components/catalog/catalog-page-header";
import { RbacGuard } from "@/components/auth/rbac-guard";
import { useAuthStore } from "@/stores/use-auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { ModifierOptionsCard } from "@/components/catalog/modifiers/modifier-options-card";
import { ModifierSelectionRulesCard } from "@/components/catalog/modifiers/modifier-selection-rules-card";
import {
  ModifierLinkedProductsCard,
  ModifierLivePreviewCard,
  ModifierStoreStockCard,
} from "@/components/catalog/modifiers/modifier-side-cards";
import { MODIFIER_TYPE_LABEL, STOCK_NOTE, detailSummary } from "@/lib/catalog/modifier-groups";
import {
  draftFromGroup,
  planIsEmpty,
  planSave,
  previewGroup,
  validateDraft,
} from "@/lib/catalog/modifier-editor";
import type { ModifierGroupDetail } from "@/types/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

const OUTLINE_BUTTON =
  "flex h-9 cursor-pointer items-center rounded-[12px] border-[1.5px] border-border-input bg-surface px-[17.5px] text-[14px] leading-5 font-bold text-text shadow-2xs hover:bg-background-subtle disabled:cursor-not-allowed disabled:opacity-60";

function Editor({ group }: { group: ModifierGroupDetail }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const saving = useAppSelector((s) => s.modifierGroups.saving);
  const saveError = useAppSelector((s) => s.modifierGroups.saveError);
  const allGroups = useAppSelector((s) => s.modifierGroups.groups);
  const canEdit = useAuthStore((s) => s.hasRole(["SUPER_ADMIN", "ADMIN", "HQ_OPS"]));
  const canEditStock = useAuthStore((s) =>
    s.hasRole(["SUPER_ADMIN", "ADMIN", "HQ_OPS", "STORE_MANAGER", "SHIFT_LEAD"]),
  );

  const [draft, setDraft] = React.useState(() => draftFromGroup(group));
  const [busy, setBusy] = React.useState<"duplicate" | "delete" | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (allGroups.length === 0) void dispatch(fetchModifierGroups());
  }, [allGroups.length, dispatch]);

  const plan = React.useMemo(() => planSave(group, draft), [group, draft]);
  const dirty = !planIsEmpty(plan);
  const problems = validateDraft(draft);

  // Warn before leaving with unsaved edits
  React.useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const nestable = allGroups
    .filter((g) => g.id !== group.id && g.groupType === "LEVEL")
    .map((g) => ({ id: g.id, name: g.name }));

  const handleSave = () => {
    dispatch(clearModifierSaveError());
    void dispatch(saveModifierGroup({ id: group.id, plan }));
  };

  const handleDuplicate = async () => {
    setBusy("duplicate");
    setActionError(null);
    const res = await dispatch(duplicateModifierGroup(group.id));
    setBusy(null);
    if (duplicateModifierGroup.fulfilled.match(res)) router.push(`/catalog/customisation/${res.payload.id}`);
    else setActionError((res.payload as string) ?? "Could not duplicate the group");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${group.name}” and its options? This cannot be undone.`)) return;
    setBusy("delete");
    setActionError(null);
    const res = await dispatch(deleteModifierGroup(group.id));
    setBusy(null);
    if (deleteModifierGroup.fulfilled.match(res)) router.push("/catalog/customisation");
    else setActionError((res.payload as string) ?? "Could not delete the group");
  };

  const error = saveError ?? actionError;

  return (
    <div className="@container mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-12">
      <CatalogPageHeader
        activeNavTab="Customisation"
        breadcrumb={`Catalog / Modifiers / ${group.name}`}
        title={group.name}
        meta={
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex h-6 items-center rounded-[12px] bg-info-surface px-2 text-[12px] leading-4 font-bold text-info">
              {MODIFIER_TYPE_LABEL[group.groupType]}
            </span>
            <span className="text-[14px] leading-5 text-text-secondary">{detailSummary(group)}</span>
            {!group.isActive && (
              <span className="inline-flex h-6 items-center rounded-[12px] bg-warning-surface px-2 text-[12px] leading-4 font-bold text-warning">
                Hidden
              </span>
            )}
          </div>
        }
        actions={
          <>
            <Link href="/catalog/customisation" className={OUTLINE_BUTTON}>
              Back
            </Link>
            <RbacGuard roles={["SUPER_ADMIN", "ADMIN", "HQ_OPS"]}>
              <button
                type="button"
                className={OUTLINE_BUTTON}
                onClick={() => void handleDuplicate()}
                disabled={busy !== null || saving}
              >
                {busy === "duplicate" ? "Duplicating…" : "Duplicate"}
              </button>
              <button
                type="button"
                className={`${OUTLINE_BUTTON} text-error`}
                onClick={() => void handleDelete()}
                disabled={busy !== null || saving || group.productCount > 0 || group.parentOptionIds.length > 0}
                title={
                  group.productCount > 0
                    ? "Remove it from its products first"
                    : group.parentOptionIds.length > 0
                      ? "Other options open this group"
                      : undefined
                }
              >
                {busy === "delete" ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving || problems.length > 0}
                className="flex h-9 cursor-pointer items-center rounded-[12px] bg-primary px-4 text-[14px] leading-5 font-bold text-text-inverse shadow-2xs hover:bg-primary-pressed disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </RbacGuard>
          </>
        }
      />

      {error && (
        <p role="alert" className="rounded-[12px] bg-error-surface px-4 py-3 text-[14px] leading-5 text-error">
          {error}
        </p>
      )}
      {dirty && problems.length > 0 && (
        <p role="status" className="rounded-[12px] bg-warning-surface px-4 py-3 text-[14px] leading-5 text-warning">
          {problems.join(" ")}
        </p>
      )}

      <div className="flex flex-col gap-6 @5xl:flex-row @5xl:items-start">
        <div className="flex w-full min-w-0 flex-col gap-5 @5xl:flex-1">
          <ModifierOptionsCard
            draft={draft}
            original={group}
            nestable={nestable}
            canEdit={canEdit}
            onChange={setDraft}
          />
          <ModifierSelectionRulesCard draft={draft} canEdit={canEdit} onChange={setDraft} />
          <p className="flex items-start gap-2 px-1 text-[12px] leading-4 font-medium text-text-secondary">
            <Info className="size-4 shrink-0" aria-hidden />
            {STOCK_NOTE[group.groupType]}
          </p>
        </div>
        <div className="flex w-full flex-col gap-5 @5xl:w-[400px] @5xl:shrink-0">
          <ModifierLivePreviewCard group={previewGroup(group.id, draft)} />
          <ModifierLinkedProductsCard group={group} />
          <ModifierStoreStockCard group={group} canEdit={canEditStock} />
        </div>
      </div>
    </div>
  );
}

/**
 * Modifier group editor — Figma 225:92356
 */
export default function ModifierGroupDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const dispatch = useAppDispatch();
  const { detail, detailLoading, detailError } = useAppSelector((s) => s.modifierGroups);

  React.useEffect(() => {
    void dispatch(fetchModifierGroupDetail(id));
  }, [dispatch, id]);

  const group = detail && detail.id === id ? detail : null;

  if (!group) {
    return (
      <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-6 pb-12">
        <CatalogPageHeader
          activeNavTab="Customisation"
          breadcrumb="Catalog / Modifiers"
          title="Modifier group"
          actions={<span />}
        />
        {detailError && !detailLoading ? (
          <div className="flex flex-col items-center gap-3 rounded-[16px] border border-border bg-surface px-5 py-12 text-center">
            <p className="text-[14px] leading-5 text-error">{detailError}</p>
            <button type="button" onClick={() => void dispatch(fetchModifierGroupDetail(id))} className={OUTLINE_BUTTON}>
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <Skeleton className="h-[336px] rounded-[16px]" />
            <Skeleton className="h-40 rounded-[16px]" />
          </div>
        )}
      </div>
    );
  }

  // A saved (or reloaded) group resets the editor to the server state
  return <Editor key={`${group.id}:${group.updatedAt}:${group.modifiers.map((m) => m.id).join(",")}`} group={group} />;
}
