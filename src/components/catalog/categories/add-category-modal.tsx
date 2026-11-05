"use client";

import * as React from "react";
import { FolderPlus, Loader2, X } from "lucide-react";
import { CatalogApi } from "@/lib/api/catalog";
import { FormField, FormInput, FormSelect, FormTextarea } from "@/components/ui/form-field";
import { TagInput } from "@/components/ui/tag-input";
import { toFriendlyErrorMessage } from "@/components/feedback/action-status-modal";

const CATEGORY_ICONS = [
  { value: "phin", label: "Phin filter" },
  { value: "leaf", label: "Leaf" },
  { value: "cup", label: "Cup" },
  { value: "bean", label: "Bean" },
  { value: "croissant", label: "Croissant" },
  { value: "bowl", label: "Bowl" },
] as const;

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCategory: Record<string, unknown>) => void;
  nextDisplayOrder?: number;
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  nextDisplayOrder = 0,
}: AddCategoryModalProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [kicker, setKicker] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [filterChips, setFilterChips] = React.useState<string[]>([]);
  const [colorTheme, setColorTheme] = React.useState("#1c3a66");
  const [bgColorTheme, setBgColorTheme] = React.useState("#f7f2e8");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-slug when name changes unless user modified slug manually
  const [isSlugTouched, setIsSlugTouched] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setSlug("");
      setIcon("");
      setKicker("");
      setDescription("");
      setFilterChips([]);
      setColorTheme("#1c3a66");
      setBgColorTheme("#f7f2e8");
      setError(null);
      setIsSubmitting(false);
      setIsSlugTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugTouched) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const metadata: Record<string, unknown> = {};
    if (icon) metadata.icon = icon;
    if (kicker.trim()) metadata.kicker = kicker.trim().toUpperCase();
    if (filterChips.length) metadata.filterChips = filterChips;
    metadata.dotColor = colorTheme;
    metadata.surfaceColor = bgColorTheme;

    try {
      const created = await CatalogApi.createCategory({
        name: cleanName,
        slug: slug.trim() || undefined,
        description: description.trim() || null,
        displayOrder: nextDisplayOrder,
        colorTheme,
        bgColorTheme,
        isActive: true,
        metadata,
      });

      onSuccess(created as unknown as Record<string, unknown>);
      onClose();
    } catch (err) {
      setError(toFriendlyErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white p-6 shadow-xl border border-border flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-primary">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-heading-s text-text font-semibold">New Category</h3>
              <p className="text-body-s text-text-muted">
                Add a new section to the customer app and counter menu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1 text-text-muted hover:bg-gray-100 hover:text-text transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-[12px] bg-error-surface border border-error/20 p-3 text-caption text-error font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Category Name" htmlFor="cat-name" required>
              <FormInput
                id="cat-name"
                value={name}
                maxLength={64}
                placeholder="e.g. Vietnamese, Specials"
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </FormField>

            <FormField label="URL Slug" htmlFor="cat-slug" hint="Auto-generated if empty">
              <FormInput
                id="cat-slug"
                value={slug}
                maxLength={64}
                placeholder="e.g. vietnamese"
                onChange={(e) => {
                  setIsSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Icon" htmlFor="cat-icon" hint="Category chip and placeholder icon">
              <FormSelect
                id="cat-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              >
                <option value="">Default (cup)</option>
                {CATEGORY_ICONS.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Kicker" htmlFor="cat-kicker" hint="Small uppercase kicker line">
              <FormInput
                id="cat-kicker"
                value={kicker}
                maxLength={40}
                placeholder="e.g. SLOW-DRIPPED · PHIN"
                onChange={(e) => setKicker(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Description" htmlFor="cat-desc" hint="Subtitle shown under category title">
            <FormTextarea
              id="cat-desc"
              rows={2}
              maxLength={255}
              value={description}
              placeholder="e.g. Traditional slow-dripped robusta coffee with sweet condensed milk."
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormField>

          <FormField
            label="Filter Chips"
            htmlFor="cat-chips"
            hint="Chips displayed above the product grid (e.g. Iced, Hot)"
          >
            <TagInput
              id="cat-chips"
              value={filterChips}
              onChange={setFilterChips}
              maxTags={8}
              maxLength={20}
              placeholder="Iced, Hot, Sweet…"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Accent / Dot Color" htmlFor="cat-color" hint="Header badge and dot">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="cat-color"
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded border border-border p-1"
                />
                <FormInput
                  value={colorTheme}
                  maxLength={10}
                  onChange={(e) => setColorTheme(e.target.value)}
                />
              </div>
            </FormField>

            <FormField label="Surface Color" htmlFor="cat-bg-color" hint="Category banner fill">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="cat-bg-color"
                  value={bgColorTheme}
                  onChange={(e) => setBgColorTheme(e.target.value)}
                  className="h-9 w-10 cursor-pointer rounded border border-border p-1"
                />
                <FormInput
                  value={bgColorTheme}
                  maxLength={10}
                  onChange={(e) => setBgColorTheme(e.target.value)}
                />
              </div>
            </FormField>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-[12px] border border-border text-label text-text hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="h-10 px-5 rounded-[12px] bg-primary text-label text-white hover:bg-navy-900 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

