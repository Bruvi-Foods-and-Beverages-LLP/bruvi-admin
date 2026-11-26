"use client";

import * as React from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/store";
import { fetchRecipes } from "@/store/slices/recipes-slice";
import { RecipesApi } from "@/lib/api/recipes";

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CatalogProductOption {
  id: string;
  name: string;
  sku: string;
  category_id?: string;
  base_price_paise?: number;
  image_url?: string;
}

/**
 * Create Recipe Master Modal
 * Strictly adheres to GEMINI.md design tokens and typography:
 * .text-heading-s, .text-body-s, .text-label, .text-caption, .text-overline
 * Semantic tokens: bg-surface, bg-background-subtle, text-text, text-text-secondary, border-border, bg-primary
 * Zero arbitrary hex codes.
 */
export function CreateRecipeModal({ isOpen, onClose }: CreateRecipeModalProps) {
  const dispatch = useAppDispatch();
  const [catalogProducts, setCatalogProducts] = React.useState<CatalogProductOption[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [name, setName] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [category, setCategory] = React.useState("Vietnamese");
  const [station, setStation] = React.useState<"Bar" | "Kitchen">("Bar");
  const [stationDetail, setStationDetail] = React.useState("Bar · KDS Bar 1");
  const [ownerName, setOwnerName] = React.useState("Tran L.");
  const [ownerRole, setOwnerRole] = React.useState("Bev R&D");
  const [targetMargin, setTargetMargin] = React.useState("75.0");
  const [isVegetarian, setIsVegetarian] = React.useState(true);
  const [containsDairy, setContainsDairy] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch unlinked catalog products on open
  React.useEffect(() => {
    if (!isOpen) return;

    async function loadCatalog() {
      try {
        const res = await fetch("/api/admin/products?limit=50");
        if (res.ok) {
          const data = await res.json();
          const items = data.data || data.products || [];
          setCatalogProducts(items);
        }
      } catch {
        // Optional fallback: manual input allowed
      }
    }
    loadCatalog();
  }, [isOpen]);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = catalogProducts.find((p) => p.id === prodId);
    if (prod) {
      setName(prod.name);
      setSku(prod.sku);
      if (prod.image_url) setImageUrl(prod.image_url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      setErrorMsg("Recipe name and SKU are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      await RecipesApi.createRecipe({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        productId: selectedProductId || undefined,
        category,
        station,
        stationDetail,
        ownerName,
        ownerRole,
        targetMarginPercent: parseFloat(targetMargin) || 75.0,
        isVegetarian,
        containsDairy,
        imageUrl: imageUrl.trim() || undefined,
      });

      // Refresh global store
      await dispatch(fetchRecipes()).unwrap();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create recipe master");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-[20px] bg-surface p-6 shadow-2xl flex flex-col gap-5 border border-border">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex flex-col">
            <span className="text-overline text-text-secondary">RECIPES · BOM MASTER</span>
            <h3 className="text-heading-s text-text mt-0.5">Create New Recipe Master</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:bg-background-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-[12px] bg-error-surface border border-error/20 flex items-center gap-2 text-error text-body-s">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Catalog Product Picker */}
          {catalogProducts.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Link from Catalog Product (Optional)</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">— Create custom recipe (or select from catalog) —</option>
                {catalogProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name & SKU row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Recipe Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Salted Cream Cold Brew"
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text placeholder:text-text-muted focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Master SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. VN-SCCB"
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text placeholder:text-text-muted uppercase focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Category & Station row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Vietnamese">Vietnamese</option>
                <option value="Specialty">Specialty</option>
                <option value="Matcha">Matcha</option>
                <option value="LAB">LAB</option>
                <option value="Bites">Bites</option>
                <option value="Pastry">Pastry</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Preparation Station</label>
              <select
                value={station}
                onChange={(e) => {
                  const s = e.target.value as "Bar" | "Kitchen";
                  setStation(s);
                  setStationDetail(s === "Bar" ? "Bar · KDS Bar 1" : "Kitchen · KDS Kitchen 1");
                }}
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Bar">Bar (Espresso / Phin)</option>
                <option value="Kitchen">Kitchen (Food Prep)</option>
              </select>
            </div>
          </div>

          {/* Target Margin & Owner row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Target Gross Margin %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-label text-text">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="h-9 px-3 rounded-[12px] border border-border-input bg-surface text-body-s text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Allergen Checkboxes */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="w-4 h-4 rounded border-border-input text-primary focus:ring-primary/20"
              />
              <span className="text-body-s text-text">Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={containsDairy}
                onChange={(e) => setContainsDairy(e.target.checked)}
                className="w-4 h-4 rounded border-border-input text-primary focus:ring-primary/20"
              />
              <span className="text-body-s text-text">Contains Dairy</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 rounded-[12px] border border-border-input bg-surface text-label text-text hover:bg-background-subtle transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[12px] bg-primary hover:bg-primary-pressed text-label text-text-inverse transition-colors flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating..." : "Create Recipe"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
