"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createProduct,
  updateProduct,
  archiveProduct,
  restoreProduct,
  fetchProductById,
  fetchCatalogCategories,
} from "@/store/slices/catalog-slice";
import { fetchStores } from "@/store/slices/stores-slice";
import { CatalogApi } from "@/lib/api/catalog";
import {
  DEFAULT_PRODUCT_FORM,
  DRAFT_STORAGE_KEY,
  FIELD_LABELS,
  buildCreatePayload,
  buildUpdatePayload,
  productDetailToForm,
  buildInitialForm,
  generateSku,
  getFieldErrors,
  getReadiness,
  isFormDirty,
  type FieldKey,
  type ProductFormState,
} from "@/lib/catalog/product-form";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ActionStatusModal, useActionStatusModal } from "@/components/feedback";
import { NAV_TABS } from "@/components/catalog/catalog-page-header";
import { BasicsSection } from "@/components/catalog/new-product/basics-section";
import { PricingSection } from "@/components/catalog/new-product/pricing-section";
import { DietarySection } from "@/components/catalog/new-product/dietary-section";
import { MenuDisplaySection } from "@/components/catalog/new-product/menu-display-section";
import { ChannelsSection, groupStoresByCity } from "@/components/catalog/new-product/channels-section";
import { PreviewCard } from "@/components/catalog/new-product/preview-card";
import { ReadinessCard } from "@/components/catalog/new-product/readiness-card";
import { ActionBar } from "@/components/catalog/new-product/action-bar";
import type { SetField } from "@/components/catalog/new-product/types";
import type { ModifierGroup, ProductStatus } from "@/types/catalog";

interface ProductEditorProps {
  mode: "create" | "edit";
  productId?: string;
  /** Create mode only: prefill the form from this product (the Duplicate action). */
  duplicateFromId?: string;
}

const formatTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();

export function ProductEditor({ mode, productId, duplicateFromId }: ProductEditorProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const actionStatus = useActionStatusModal();

  const { allCategories, isSubmitting } = useAppSelector((s) => s.catalog);
  const { stores, isLoading: isLoadingStores } = useAppSelector((s) => s.stores);

  const [form, setForm] = React.useState<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const [initialForm, setInitialForm] = React.useState<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const [modifierGroups, setModifierGroups] = React.useState<ModifierGroup[]>([]);
  const [currentStatus, setCurrentStatus] = React.useState<ProductStatus>("DRAFT");
  const [ready, setReady] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [autosavedAt, setAutosavedAt] = React.useState<string | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = React.useState(false);

  const initialRef = React.useRef<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const leavingRef = React.useRef(false);
  const duplicatingRef = React.useRef(false);

  const cities = React.useMemo(() => groupStoresByCity(stores), [stores]);

  // Bootstrap data
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (mode === "create") {
          const [catResult, storeResult, groups, source] = await Promise.all([
            dispatch(fetchCatalogCategories()).unwrap().catch(() => null),
            dispatch(fetchStores()).unwrap().catch(() => null),
            CatalogApi.getModifierGroups().catch(() => []),
            duplicateFromId ? CatalogApi.getProductById(duplicateFromId).catch(() => null) : null,
          ]);
          if (cancelled) return;

          const firstCategoryId = catResult?.masterCategories?.[0]?.id ?? "";
          const firstCity = storeResult ? groupStoresByCity(storeResult)[0] : undefined;
          const seeded = buildInitialForm(firstCategoryId, firstCity?.stores.map((s) => s.id) ?? []);
          initialRef.current = seeded;
          setInitialForm(seeded);

          let next = seeded;
          if (source) {
            // Duplicating: copy everything but the photo. The image URL is not shared, because
            // replacing it on either product would delete the other's image from storage.
            const copied = productDetailToForm(source);
            next = { ...copied, name: `${copied.name} (copy)`, imageUrl: null };
            duplicatingRef.current = true;
          } else {
            try {
              const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
              if (raw) {
                const saved = JSON.parse(raw) as { form: ProductFormState; savedAt: string };
                next = { ...seeded, ...saved.form, categoryId: saved.form.categoryId || seeded.categoryId };
                setAutosavedAt(formatTime(new Date(saved.savedAt)));
              }
            } catch {
              /* ignore corrupt draft */
            }
          }
          setModifierGroups(groups);
          setForm(next);
          setCurrentStatus("DRAFT");
          setReady(true);
        } else {
          // Edit mode
          if (!productId) {
            setLoadError("No product ID specified");
            return;
          }

          const [, , groups, productDetail] = await Promise.all([
            dispatch(fetchCatalogCategories()).unwrap().catch(() => null),
            dispatch(fetchStores()).unwrap().catch(() => null),
            CatalogApi.getModifierGroups().catch(() => []),
            dispatch(fetchProductById(productId)).unwrap(),
          ]);

          if (cancelled) return;

          if (!productDetail) {
            setLoadError("Product not found");
            return;
          }

          const parsed = productDetailToForm(productDetail);
          initialRef.current = parsed;
          setInitialForm(parsed);
          setModifierGroups(groups);
          setForm(parsed);
          setCurrentStatus(productDetail.status || "DRAFT");
          setReady(true);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load product details");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, mode, productId, duplicateFromId]);

  // Debounced autosave (create mode only; a duplicate never overwrites the saved new-product draft)
  React.useEffect(() => {
    if (mode !== "create" || !ready || leavingRef.current || duplicatingRef.current || !isFormDirty(form)) return;

    const t = setTimeout(() => {
      try {
        const now = new Date();
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ form, savedAt: now.toISOString() }));
        setAutosavedAt(formatTime(now));
      } catch {
        /* storage unavailable */
      }
    }, 800);

    return () => clearTimeout(t);
  }, [form, ready, mode]);

  const setField: SetField = React.useCallback((key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const category = allCategories.find((c) => c.id === form.categoryId);
  const fieldErrors = getFieldErrors(form);
  const visibleErrors = submitAttempted ? fieldErrors : {};
  const readiness = React.useMemo(() => getReadiness(form), [form]);

  const selectedCities = cities.filter((c) => c.stores.some((s) => form.storeIds.includes(s.id)));
  const menuLabel = selectedCities[0] ? `${selectedCities[0].city} menu` : "All menus";

  const dirty =
    mode === "create"
      ? isFormDirty(form)
      : JSON.stringify(form) !== JSON.stringify(initialForm);

  const attention = [
    ...(Object.keys(fieldErrors) as FieldKey[]).map((k) => FIELD_LABELS[k]),
    ...(form.storeIds.length === 0 ? ["Store rollout"] : []),
  ];

  const clearDraft = () => {
    leavingRef.current = true;
    if (mode === "create") {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
  };

  const handleCancel = () => {
    clearDraft();
    router.push("/catalog");
  };

  const handleSubmit = async (targetStatus?: ProductStatus) => {
    setSubmitAttempted(true);
    if (Object.keys(fieldErrors).length > 0) return;

    const finalStatus = targetStatus || currentStatus;

    if (finalStatus === "ACTIVE" && form.storeIds.length === 0) {
      actionStatus.showError("Select at least one store to publish to.", {
        title: "Choose where to publish",
        description: "Turn on at least one city under Channels & availability, or save this product as a draft.",
        primaryActionLabel: "Review stores",
        onPrimaryAction: actionStatus.closeModal,
        secondaryActionLabel: "Close",
        onSecondaryAction: actionStatus.closeModal,
      });
      return;
    }

    const name = form.name.trim();

    if (mode === "create") {
      actionStatus.showLoading(
        finalStatus === "ACTIVE" ? "Publishing product..." : "Saving draft...",
        finalStatus === "ACTIVE"
          ? `Publishing ${name} to ${form.storeIds.length} store${form.storeIds.length === 1 ? "" : "s"}...`
          : `Saving ${name} as a draft...`
      );

      try {
        await dispatch(
          createProduct(
            buildCreatePayload(form, {
              status: finalStatus,
              sku: generateSku(category?.name ?? "", name),
              includeStores: finalStatus === "ACTIVE",
            })
          )
        ).unwrap();

        clearDraft();
        actionStatus.showSuccess({
          title: finalStatus === "ACTIVE" ? "Product Published" : "Draft Saved",
          description:
            finalStatus === "ACTIVE"
              ? `${name} is now live on the selected stores.`
              : `${name} was saved as a draft. Finish it any time from Products.`,
          primaryActionLabel: "View products",
          onPrimaryAction: () => {
            actionStatus.closeModal();
            router.push("/catalog");
          },
          secondaryActionLabel: "Add another",
          onSecondaryAction: () => {
            actionStatus.closeModal();
            leavingRef.current = false;
            duplicatingRef.current = false;
            setForm(initialRef.current);
            setSubmitAttempted(false);
            setAutosavedAt(null);
          },
        });
      } catch (err) {
        actionStatus.showError(err, {
          title: "Unable to Save Product",
          primaryActionLabel: "Review details & retry",
          onPrimaryAction: actionStatus.closeModal,
          secondaryActionLabel: "Close",
          onSecondaryAction: actionStatus.closeModal,
        });
      }
    } else {
      // Edit mode: compute minimal diff payload
      actionStatus.showLoading(
        "Updating product...",
        `Saving changes to ${name}...`
      );

      try {
        const diffPayload = buildUpdatePayload(initialRef.current, form);
        if (targetStatus && targetStatus !== currentStatus) {
          diffPayload.status = targetStatus;
        }

        const updated = await dispatch(
          updateProduct({
            id: productId!,
            payload: diffPayload,
          })
        ).unwrap();

        initialRef.current = form;
        setInitialForm(form);
        if (updated?.status) {
          setCurrentStatus(updated.status);
        }

        actionStatus.showSuccess({
          title: "Changes Saved",
          description: `${name} has been updated successfully.`,
          primaryActionLabel: "Back to products",
          onPrimaryAction: () => {
            actionStatus.closeModal();
            router.push("/catalog");
          },
          secondaryActionLabel: "Keep editing",
          onSecondaryAction: actionStatus.closeModal,
        });
      } catch (err) {
        actionStatus.showError(err, {
          title: "Unable to Update Product",
          primaryActionLabel: "Review details & retry",
          onPrimaryAction: actionStatus.closeModal,
          secondaryActionLabel: "Close",
          onSecondaryAction: actionStatus.closeModal,
        });
      }
    }
  };

  const handleArchive = async () => {
    if (!productId) return;
    setShowArchiveConfirm(false);
    actionStatus.showLoading("Archiving product...", `Archiving ${form.name.trim()}...`);

    try {
      await dispatch(archiveProduct(productId)).unwrap();
      setCurrentStatus("ARCHIVED");
      actionStatus.showSuccess({
        title: "Product Archived",
        description: `${form.name.trim()} has been moved to archive and hidden from all channels.`,
        primaryActionLabel: "Back to products",
        onPrimaryAction: () => {
          actionStatus.closeModal();
          router.push("/catalog");
        },
      });
    } catch (err) {
      actionStatus.showError(err, {
        title: "Unable to Archive Product",
        primaryActionLabel: "Retry",
        onPrimaryAction: actionStatus.closeModal,
        secondaryActionLabel: "Close",
        onSecondaryAction: actionStatus.closeModal,
      });
    }
  };

  const handleRestore = async () => {
    if (!productId) return;
    actionStatus.showLoading("Restoring product...", `Restoring ${form.name.trim()}...`);

    try {
      await dispatch(restoreProduct(productId)).unwrap();
      setCurrentStatus("DRAFT");
      actionStatus.showSuccess({
        title: "Product Restored",
        description: `${form.name.trim()} has been restored as a draft.`,
        primaryActionLabel: "Back to products",
        onPrimaryAction: () => {
          actionStatus.closeModal();
          router.push("/catalog");
        },
      });
    } catch (err) {
      actionStatus.showError(err, {
        title: "Unable to Restore Product",
        primaryActionLabel: "Retry",
        onPrimaryAction: actionStatus.closeModal,
        secondaryActionLabel: "Close",
        onSecondaryAction: actionStatus.closeModal,
      });
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-[16px] border border-border bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fce8e6] text-[#c0352b]">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-bold text-[#0F2340]">Product Not Found</h2>
          <p className="text-[14px] text-text-muted">{loadError}</p>
        </div>
        <Link href="/catalog">
          <Button variant="outline" size="compact" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to products</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full w-full flex-col">
      <div className="mx-auto w-full max-w-[1136px] pb-12">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[14px] font-medium text-text-muted">
              <Link href="/catalog" className="hover:text-text hover:underline">Catalog</Link>
              <span>/</span>
              <Link href="/catalog" className="hover:text-text hover:underline">Products</Link>
              <span>/</span>
              <span className="text-text">
                {mode === "create" ? "New product" : form.name || "Edit product"}
              </span>
            </div>
            <h1 className="text-display-s text-text">
              {mode === "create" ? "New product" : "Edit product"}
            </h1>
            <p className="text-body-s text-text-muted">
              {mode === "create"
                ? "Add a menu item, set its price and choose where it is sold."
                : "Update product details, pricing, modifier groups and store availability."}
            </p>
          </div>

          <nav
            aria-label="Catalog sections"
            className="no-scrollbar flex w-full items-center gap-6 overflow-x-auto border-b border-border"
          >
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                aria-current={tab.label === "Products" ? "page" : undefined}
                className={cn(
                  "relative shrink-0 pb-2.5 text-label transition-colors",
                  tab.label === "Products" ? "text-text" : "text-text-muted hover:text-text"
                )}
              >
                {tab.label}
                {tab.label === "Products" && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Two-column layout: 712 form + 400 preview */}
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[712px]">
            {ready ? (
              <>
                <BasicsSection form={form} setField={setField} nameError={visibleErrors.name} />
                <PricingSection
                  form={form}
                  setField={setField}
                  categories={allCategories}
                  modifierGroups={modifierGroups}
                  errors={visibleErrors}
                />
                <DietarySection form={form} setField={setField} />
                <MenuDisplaySection form={form} setField={setField} />
                <ChannelsSection form={form} setField={setField} cities={cities} isLoadingStores={isLoadingStores} />
              </>
            ) : (
              [464, 380, 260, 340].map((h) => (
                <Skeleton key={h} className="w-full rounded-[16px]" style={{ height: h }} />
              ))
            )}
          </div>

          <aside className="flex w-full min-w-0 flex-col gap-6 lg:sticky lg:top-0 lg:flex-1">
            <PreviewCard form={form} category={category} menuLabel={menuLabel} />
            <ReadinessCard items={readiness} />
          </aside>
        </div>

        {/* Bottom Action Bar */}
        <ActionBar
          mode={mode}
          status={currentStatus}
          attention={attention}
          dirty={dirty}
          autosavedAt={autosavedAt}
          isSubmitting={isSubmitting}
          publishCount={form.storeIds.length}
          primaryLabel={mode === "edit" ? "Save changes" : undefined}
          onCancel={handleCancel}
          onSaveDraft={
            mode === "create"
              ? () => handleSubmit("DRAFT")
              : currentStatus === "ACTIVE"
                ? () => handleSubmit("DRAFT")
                : () => handleSubmit("DRAFT")
          }
          onPublish={
            mode === "create"
              ? () => handleSubmit("ACTIVE")
              : () => handleSubmit(currentStatus === "ARCHIVED" ? "DRAFT" : currentStatus)
          }
          onArchive={mode === "edit" ? () => setShowArchiveConfirm(true) : undefined}
          onRestore={mode === "edit" && currentStatus === "ARCHIVED" ? handleRestore : undefined}
        />
      </div>

      {/* Archive Confirmation Dialog */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[16px] border border-border bg-white p-6 shadow-floating">
            <h3 className="text-[18px] font-bold text-[#0F2340]">Archive {form.name.trim()}?</h3>
            <p className="mt-2 text-[14px] text-text-muted">
              Archiving this product will hide it from all stores and channels immediately. You can restore it later from the catalog table.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="compact"
                onClick={() => setShowArchiveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="compact"
                onClick={handleArchive}
                className="bg-[#c0352b] hover:bg-[#a02a20] text-white"
              >
                Yes, archive product
              </Button>
            </div>
          </div>
        </div>
      )}

      <ActionStatusModal
        isOpen={actionStatus.state.isOpen}
        status={actionStatus.state.status}
        title={actionStatus.state.title}
        description={actionStatus.state.description}
        primaryActionLabel={actionStatus.state.primaryActionLabel}
        onPrimaryAction={actionStatus.state.onPrimaryAction}
        secondaryActionLabel={actionStatus.state.secondaryActionLabel}
        onSecondaryAction={actionStatus.state.onSecondaryAction}
        onClose={actionStatus.closeModal}
        autoDismissMs={actionStatus.state.autoDismissMs}
      />
    </div>
  );
}
