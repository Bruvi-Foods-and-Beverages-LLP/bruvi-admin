import { StorageApi } from "@/lib/api/storage";

export const PRODUCT_IMAGE_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };
    img.src = url;
  });
}

export interface UploadProductImageResult {
  url: string;
  path: string;
}

/**
 * Validates (JPG/PNG, ≤2 MB, 1:1) and uploads to Cloud Storage via backend StorageModule.
 * Returns the public URL and storage path for lifecycle management.
 */
export async function uploadProductImage(file: File): Promise<UploadProductImageResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Use a JPG or PNG image.");
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const { width, height } = await readDimensions(file);
  if (Math.abs(width - height) > 2) {
    throw new Error("Image must be square (1:1).");
  }

  const uploadResult = await StorageApi.uploadImage(file, {
    bucket: "bruvi-products",
    folder: "products",
  });

  return {
    url: uploadResult.url,
    path: uploadResult.path,
  };
}
