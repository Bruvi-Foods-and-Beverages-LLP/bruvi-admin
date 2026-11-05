/**
 * Enterprise Cloud Storage Client Utility
 * Integrates with Bruvi Cloud Storage Service & Supabase CDN
 */

export interface CloudUploadResult {
  url: string;
  thumbnailUrl: string;
  key: string;
  bucket: string;
  size: number;
  mimetype: string;
}

export interface UploadImageOptions {
  bucket?: "bruvi-products" | "bruvi-stores" | "bruvi-banners" | string;
  folder?: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

export const DEFAULT_MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

/**
 * Upload an image file from the browser to Bruvi Cloud Storage
 * Proxies through /api/proxy/admin/storage/upload to keep service role keys private.
 */
export async function uploadImageToCloud(
  file: File,
  options: UploadImageOptions = {}
): Promise<CloudUploadResult> {
  const {
    bucket = "bruvi-products",
    folder = "items",
    maxSizeBytes = DEFAULT_MAX_IMAGE_BYTES,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
  } = options;

  // 1. Client-side MIME validation
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Unsupported file format (${file.type || "unknown"}). Please upload JPG, PNG, WebP or SVG.`
    );
  }

  // 2. Client-side size check
  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    throw new Error(`File is too large. Maximum size allowed is ${maxMb} MB.`);
  }

  // 3. Assemble multipart payload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("folder", folder);

  // 4. Dispatch through Next.js BFF proxy
  const response = await fetch("/api/proxy/admin/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `Upload failed (${response.status})`;
    try {
      const errJson = await response.json();
      errorMessage = errJson.message || errJson.error || errorMessage;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || "Failed to parse upload response from server");
  }

  return json.data as CloudUploadResult;
}

/**
 * Derives an on-the-fly rendered thumbnail URL from a Supabase Public Object URL
 */
export function getOptimizedThumbnailUrl(
  publicUrl?: string | null,
  width = 200,
  height = 200,
  quality = 80
): string {
  if (!publicUrl) return "";

  // Check if it's a Supabase storage object URL
  const match = publicUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (match) {
    const bucket = match[1];
    const objectPath = match[2];
    const origin = publicUrl.split("/storage/v1/object/public/")[0];
    return `${origin}/storage/v1/render/image/public/${bucket}/${objectPath}?width=${width}&height=${height}&quality=${quality}&resize=contain`;
  }

  return publicUrl;
}

