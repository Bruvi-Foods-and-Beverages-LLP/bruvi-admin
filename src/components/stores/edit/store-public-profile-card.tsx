"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon, Upload, X } from "lucide-react";
import { FormCard } from "@/components/ui/form-card";
import { FormField, FormInput } from "@/components/ui/form-field";
import { TagInput } from "@/components/ui/tag-input";
import { ImageCropModal } from "@/components/media/image-crop-modal";
import { StorageApi } from "@/lib/api/storage";
import {
  IMAGE_UPLOAD_PRESETS,
  MAX_SOURCE_BYTES,
  formatBytes,
  type ProcessedImage,
} from "@/lib/images/process-image";

/** Customer-facing store fields, saved in outlets.metadata and read by the public store API. */
export interface StorePublicProfile {
  prepMinutes: string;
  publicPhone: string;
  heroImageUrl: string | null;
  amenities: string[];
}

export function storePublicProfileFromMetadata(metadata: Record<string, unknown> | undefined): StorePublicProfile {
  const meta = metadata ?? {};
  const prep = Number(meta.prepMinutes ?? meta.prepTimeMinutes);
  return {
    prepMinutes: Number.isFinite(prep) && prep > 0 ? String(prep) : "",
    publicPhone: typeof meta.publicPhone === "string" ? meta.publicPhone : "",
    heroImageUrl: typeof meta.heroImageUrl === "string" ? meta.heroImageUrl : null,
    amenities: Array.isArray(meta.amenities) ? meta.amenities.filter((a): a is string => typeof a === "string") : [],
  };
}

/** Partial metadata for PATCH /stores/:id (the backend merges it into the existing object). */
export function storePublicProfileToMetadata(profile: StorePublicProfile): Record<string, unknown> {
  const prep = Number(profile.prepMinutes);
  return {
    prepMinutes: Number.isFinite(prep) && prep > 0 ? Math.round(prep) : null,
    publicPhone: profile.publicPhone.trim() || null,
    heroImageUrl: profile.heroImageUrl,
    amenities: profile.amenities,
  };
}

interface StorePublicProfileCardProps {
  value: StorePublicProfile;
  onChange: (next: StorePublicProfile) => void;
}

export function StorePublicProfileCard({ value, onChange }: StorePublicProfileCardProps) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const uploadedPathRef = React.useRef<string | null>(null);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [uploadError, setUploadError] = React.useState<string | undefined>();
  const preset = IMAGE_UPLOAD_PRESETS.store;
  const set = <K extends keyof StorePublicProfile>(key: K, v: StorePublicProfile[K]) => onChange({ ...value, [key]: v });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(undefined);
    if (!preset.acceptTypes.includes(file.type)) {
      setUploadError("Use a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setUploadError(`Image must be ${formatBytes(MAX_SOURCE_BYTES)} or smaller.`);
      return;
    }
    setPendingFile(file);
  };

  const handleCroppedUpload = async (image: ProcessedImage) => {
    const result = await StorageApi.uploadImage(image.file, { bucket: "bruvi-stores", folder: "stores" });
    // Only an unsaved upload from this session is ours to delete
    if (uploadedPathRef.current) {
      StorageApi.deleteFile("bruvi-stores", uploadedPathRef.current).catch(() => {});
    }
    uploadedPathRef.current = result.path;
    set("heroImageUrl", result.url);
    setPendingFile(null);
  };

  const removeHero = () => {
    if (uploadedPathRef.current) {
      StorageApi.deleteFile("bruvi-stores", uploadedPathRef.current).catch(() => {});
      uploadedPathRef.current = null;
    }
    set("heroImageUrl", null);
  };

  return (
    <FormCard
      title="Customer app"
      description="Optional. Shown to customers on the store list and store page in the Bruvi app."
    >
      <div className="flex flex-col gap-4">
        <FormField label="Store photo" error={uploadError} hint="16:9 · JPG/PNG/WebP · 2 MB max">
          <div className="relative aspect-video w-full max-w-[420px] overflow-hidden rounded-[12px] border border-dashed border-border-input bg-background-subtle">
            {value.heroImageUrl ? (
              <>
                <Image src={value.heroImageUrl} alt="Store photo" fill sizes="420px" className="object-cover" />
                <div className="absolute inset-x-2 bottom-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-7 items-center gap-1.5 rounded-full bg-white/90 px-3 text-caption-bold text-text shadow-raised hover:bg-white cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Replace
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove store photo"
                  onClick={removeHero}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-text shadow-raised cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center gap-2 hover:bg-border/30 cursor-pointer"
              >
                <ImageIcon className="h-6 w-6 text-text" />
                <span className="text-label text-text">Upload store photo</span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={preset.acceptTypes.join(",")}
            className="hidden"
            onChange={handleFile}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Typical prep time"
            htmlFor="store-prep-minutes"
            hint={'Shown as "Ready in about N min".'}
          >
            <FormInput
              id="store-prep-minutes"
              inputMode="numeric"
              value={value.prepMinutes}
              placeholder="e.g. 8"
              onChange={(e) => set("prepMinutes", e.target.value.replace(/\D/g, "").slice(0, 3))}
            />
          </FormField>
          <FormField label="Customer phone" htmlFor="store-public-phone" hint="The number customers see. Leave empty to use the store phone.">
            <FormInput
              id="store-public-phone"
              type="tel"
              value={value.publicPhone}
              placeholder="+91 80 0000 0000"
              onChange={(e) => set("publicPhone", e.target.value.slice(0, 20))}
            />
          </FormField>
        </div>

        <FormField label="Amenities" htmlFor="store-amenities" hint="e.g. Wi-Fi, Outdoor seating, Parking.">
          <TagInput
            id="store-amenities"
            value={value.amenities}
            onChange={(next) => set("amenities", next)}
            placeholder="Wi-Fi, Outdoor seating…"
          />
        </FormField>
      </div>

      <ImageCropModal
        file={pendingFile}
        preset={preset}
        title="Crop store photo"
        onCancel={() => setPendingFile(null)}
        onConfirm={handleCroppedUpload}
      />
    </FormCard>
  );
}
