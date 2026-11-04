"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { CatalogApi } from "@/lib/api/catalog";
import { FormCard } from "@/components/ui/form-card";
import { FormField, FormInput, FormSelect, FormTextarea } from "@/components/ui/form-field";
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toFriendlyErrorMessage } from "@/components/feedback/action-status-modal";
import { AddCategoryModal } from "@/components/catalog/categories/add-category-modal";
import { DeleteCategoryModal } from "@/components/catalog/categories/delete-category-modal";

/** Icons the customer app can draw for a category (mobile `MenuCategory.icon`). */
const CATEGORY_ICONS = [
  { value: "phin", label: "Phin filter" },
  { value: "leaf", label: "Leaf" },
  { value: "cup", label: "Cup" },
  { value: "bean", label: "Bean" },
  { value: "croissant", label: "Croissant" },
  { value: "bowl", label: "Bowl" },
] as const;

interface CategoryRow {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  icon: string;
  kicker: string;
  filterChips: string[];
}

/** The admin categories endpoint returns raw rows (snake_case, metadata included). */
function toRow(raw: Record<string, unknown>): CategoryRow {
  const metadata = (raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {}) as Record<string, unknown>;
  return {
    id: String(raw.id),
    name: String(raw.name ?? ""),
    description: typeof raw.description === "string" ? raw.description : "",
    metadata,
    icon: typeof metadata.icon === "string" ? metadata.icon : "",
    kicker: typeof metadata.kicker === "string" ? metadata.kicker : "",
    filterChips: Array.isArray(metadata.filterChips)
      ? metadata.filterChips.filter((c): c is string => typeof c === "string")
      : [],
  };
}

function CategoryEditor({
  initial,
  onDelete,
}: {
  initial: CategoryRow;
  onDelete: (category: { id: string; name: string }) => void;
}) {
  const [row, setRow] = React.useState(initial);
  const [saved, setSaved] = React.useState(initial);
  const [status, setStatus] = React.useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({
    kind: "idle",
  });
  const dirty = JSON.stringify(row) !== JSON.stringify(saved);

  const save = async () => {
    setStatus({ kind: "saving" });
    // metadata is replaced on update, so send the stored keys plus the edited display fields
    const metadata: Record<string, unknown> = { ...row.metadata };
    if (row.icon) metadata.icon = row.icon;
    else delete metadata.icon;
    if (row.kicker.trim()) metadata.kicker = row.kicker.trim().toUpperCase();
    else delete metadata.kicker;
    if (row.filterChips.length) metadata.filterChips = row.filterChips;
    else delete metadata.filterChips;

    try {
      await CatalogApi.updateCategory(row.id, {
        description: row.description.trim() || null,
        metadata,
      });
      const next = { ...row, metadata };
      setRow(next);
      setSaved(next);
      setStatus({ kind: "saved" });
    } catch (err) {
      setStatus({ kind: "error", message: toFriendlyErrorMessage(err) });
    }
  };

  return (
    <FormCard
      title={row.name}
      description="Shown as the menu section header and category page in the customer app."
      action={
        <button
          type="button"
          onClick={() => onDelete({ id: row.id, name: row.name })}
          title="Delete category"
          className="flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-error hover:text-red-700 hover:bg-error-surface/60 rounded-[10px] transition-colors cursor-pointer border border-transparent hover:border-error/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Icon" htmlFor={`icon-${row.id}`} hint="Used for the category chip and items without a photo.">
            <FormSelect
              id={`icon-${row.id}`}
              value={row.icon}
              onChange={(e) => setRow({ ...row, icon: e.target.value })}
            >
              <option value="">Default (cup)</option>
              {CATEGORY_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </FormSelect>
          </FormField>
          <FormField label="Kicker" htmlFor={`kicker-${row.id}`} hint="Small line above the section title.">
            <FormInput
              id={`kicker-${row.id}`}
              value={row.kicker}
              maxLength={40}
              placeholder="e.g. SLOW-DRIPPED · PHIN"
              onChange={(e) => setRow({ ...row, kicker: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor={`desc-${row.id}`} hint="Leave empty to show the item count.">
          <FormTextarea
            id={`desc-${row.id}`}
            rows={2}
            maxLength={255}
            value={row.description}
            onChange={(e) => setRow({ ...row, description: e.target.value })}
          />
        </FormField>

        <FormField
          label="Filter chips"
          htmlFor={`chips-${row.id}`}
          hint={`Shown on the category page. "All" is added automatically; match the products’ filter tags.`}
        >
          <TagInput
            id={`chips-${row.id}`}
            value={row.filterChips}
            onChange={(chips) => setRow({ ...row, filterChips: chips })}
            maxTags={8}
            maxLength={20}
            placeholder="Iced, Hot, Sweet…"
          />
        </FormField>

        <div className="flex items-center justify-end gap-3">
          {status.kind === "saved" && !dirty && <span className="text-caption text-success">Saved</span>}
          {status.kind === "error" && <span className="text-caption text-error">{status.message}</span>}
          <Button type="button" size="compact" disabled={!dirty || status.kind === "saving"} onClick={save}>
            {status.kind === "saving" && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>
    </FormCard>
  );
}

export default function CategoriesPage() {
  const [rows, setRows] = React.useState<CategoryRow[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const fetchCategories = React.useCallback(() => {
    CatalogApi.getCategories()
      .then((list) => {
        setRows((list as unknown as Record<string, unknown>[]).map(toRow));
      })
      .catch((err) => {
        setError(toFriendlyErrorMessage(err));
      });
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryCreated = (createdRaw: Record<string, unknown>) => {
    const newRow = toRow(createdRaw);
    setRows((prev) => (prev ? [...prev, newRow] : [newRow]));
  };

  const handleCategoryDeleted = (deletedId: string) => {
    setRows((prev) => (prev ? prev.filter((r) => r.id !== deletedId) : null));
  };

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 pb-12">
      {/* Header with Navigation and Add Category Action */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[14px] font-medium text-text-muted">
            <Link href="/catalog" className="hover:text-text hover:underline">Catalog</Link>
            <span>/</span>
            <span className="text-text">Categories</span>
          </div>
          <h1 className="text-display-s text-text">Categories</h1>
          <p className="text-body-s text-text-muted">How each menu section appears in the customer app.</p>
        </div>

        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {error && <p className="rounded-[12px] bg-error-surface px-4 py-3 text-body-s text-error">{error}</p>}
      {!rows && !error && [220, 220, 220].map((h, i) => <Skeleton key={i} className="w-full rounded-[16px]" style={{ height: h }} />)}
      {rows?.map((row) => (
        <CategoryEditor
          key={row.id}
          initial={row}
          onDelete={(cat) => setCategoryToDelete(cat)}
        />
      ))}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCategoryCreated}
        nextDisplayOrder={rows?.length ?? 0}
      />

      {/* Delete Category Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={categoryToDelete !== null}
        category={categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onSuccess={handleCategoryDeleted}
      />
    </div>
  );
}
