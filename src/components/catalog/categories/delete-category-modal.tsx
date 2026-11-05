"use client";

import * as React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { CatalogApi } from "@/lib/api/catalog";
import { toFriendlyErrorMessage } from "@/components/feedback/action-status-modal";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: { id: string; name: string } | null;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteCategoryModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await CatalogApi.deleteCategory(category.id);
      onSuccess(category.id);
      onClose();
    } catch (err) {
      setError(toFriendlyErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[460px] rounded-[20px] bg-white p-6 shadow-xl border border-border flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-surface text-error">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-heading-s text-text font-semibold">Delete Category</h3>
              <p className="text-body-s text-text-muted">This action cannot be undone.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full p-1 text-text-muted hover:bg-gray-100 hover:text-text transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description & Warnings */}
        <div className="flex flex-col gap-3 text-body-s text-text">
          <p>
            Are you sure you want to delete the category{" "}
            <span className="font-semibold text-text">&ldquo;{category.name}&rdquo;</span>?
          </p>
          <p className="text-caption text-text-muted bg-bg-subtle p-3 rounded-[12px] border border-border">
            Note: Categories with active or archived products assigned cannot be deleted. If products belong to this category, please reassign them first.
          </p>
          {error && (
            <div className="rounded-[12px] bg-error-surface border border-error/20 p-3 text-caption text-error font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 px-4 rounded-[12px] border border-border text-label text-text hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 rounded-[12px] bg-error text-label text-white hover:bg-red-700 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
}

