"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { FormCard } from "@/components/ui/form-card";
import { FormField, FormInput, FormTextarea } from "@/components/ui/form-field";
import { SHORT_DESCRIPTION_MAX, type ProductFormState } from "@/lib/catalog/product-form";
import { uploadProductImage } from "@/lib/catalog/upload-product-image";
import { StorageApi } from "@/lib/api/storage";
import { cn } from "@/lib/utils/cn";
import type { SetField } from "./types";

interface BasicsSectionProps {
  form: ProductFormState;
  setField: SetField;
  nameError?: string;
}

export function BasicsSection({ form, setField, nameError }: BasicsSectionProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const uploadedPathRef = React.useRef<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | undefined>();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(undefined);
    setIsUploading(true);
    try {
      if (uploadedPathRef.current) {
        StorageApi.deleteFile("bruvi-products", uploadedPathRef.current).catch(() => {});
      }
      const result = await uploadProductImage(file);
      uploadedPathRef.current = result.path;
      setField("imageUrl", result.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (uploadedPathRef.current) {
      StorageApi.deleteFile("bruvi-products", uploadedPathRef.current).catch(() => {});
      uploadedPathRef.current = null;
    }
    setField("imageUrl", null);
  };

  return (
    <FormCard title="Basics" description="What customers see on the menu, kiosk and app.">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Photo */}
          <FormField
            label="Photo"
            error={uploadError}
            hint="Square image shown on menu cards."
            className="sm:w-40 sm:shrink-0"
          >
            <div
              className={cn(
                "relative h-40 w-40 overflow-hidden rounded-[12px] bg-background-subtle",
                form.imageUrl ? "border border-border-input" : "border border-dashed border-border-input"
              )}
            >
              {form.imageUrl ? (
                <>
                  <Image src={form.imageUrl} alt="Product photo" fill sizes="160px" className="object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={handleRemovePhoto}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-text shadow-raised cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 cursor-pointer hover:bg-border/30 disabled:cursor-wait"
                >
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-text-muted" /> : <Upload className="h-6 w-6 text-text" />}
                  <span className="text-label text-text">{isUploading ? "Uploading…" : "Upload photo"}</span>
                  <span className="text-center text-caption text-text-muted">1:1 · JPG/PNG · 2 MB max</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleFile} />
          </FormField>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <FormField
              label="Product name"
              htmlFor="product-name"
              required
              error={nameError}
              hint="Shown on menu cards, receipts and kitchen tickets."
            >
              <FormInput
                id="product-name"
                value={form.name}
                maxLength={128}
                invalid={!!nameError}
                placeholder="e.g. Yuzu Cold Brew Tonic"
                onChange={(e) => setField("name", e.target.value)}
              />
            </FormField>
            <FormField
              label="Short description"
              htmlFor="product-short"
              counter={`${form.shortDescription.length} / ${SHORT_DESCRIPTION_MAX}`}
              hint="One line under the name on menu cards."
            >
              <FormInput
                id="product-short"
                value={form.shortDescription}
                maxLength={SHORT_DESCRIPTION_MAX}
                placeholder="e.g. Cold brew, yuzu, tonic. Bright & fizzy."
                onChange={(e) => setField("shortDescription", e.target.value)}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Long description" htmlFor="product-long" hint="Shown on the product page in app and kiosk.">
          <FormTextarea
            id="product-long"
            rows={3}
            value={form.longDescription}
            placeholder="Tell customers what makes this item special."
            onChange={(e) => setField("longDescription", e.target.value)}
          />
        </FormField>
      </div>
    </FormCard>
  );
}
