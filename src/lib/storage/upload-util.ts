import { StorageApi } from "@/lib/api/storage";
import { UploadResult } from "@/types/catalog";

/**
 * Enterprise Cloud Storage Client Utility
 * Integrates with Bruvi AWS S3 Cloud Storage via backend StorageModule
 */

export type CloudUploadResult = UploadResult;

export interface UploadImageOptions {
  bucket?: "bruvi-products" | "bruvi-stores" | "bruvi-banners" | "bruvi-support" | string;
  folder?: string;
  customFilename?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export const DEFAULT_MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

/**
 * Upload an image file from the browser to AWS S3 via BFF proxy (/api/proxy/admin/storage/upload)
 */
export async function uploadImageToCloud(
  file: File,
  options: UploadImageOptions = {}
): Promise<CloudUploadResult> {
  const {
    bucket = "bruvi-products",
    folder = "items",
    customFilename,
    maxSizeBytes = DEFAULT_MAX_IMAGE_BYTES,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
  } = options;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Unsupported file format (${file.type || "unknown"}). Please upload JPG, PNG, WebP, SVG, or AVIF.`
    );
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    throw new Error(`File is too large. Maximum size allowed is ${maxMb} MB.`);
  }

  return StorageApi.uploadImage(file, {
    bucket,
    folder,
    customFilename,
  });
}

/**
 * Delete an image from AWS S3 via BFF proxy
 */
export async function deleteImageFromCloud(
  bucket: string,
  path: string
): Promise<boolean> {
  return StorageApi.deleteFile(bucket, path);
}

/**
 * Returns the canonical public S3/CDN image URL
 */
export function getOptimizedThumbnailUrl(
  publicUrl?: string | null,
  _width = 200,
  _height = 200,
  _quality = 80
): string {
  return publicUrl || "";
}
