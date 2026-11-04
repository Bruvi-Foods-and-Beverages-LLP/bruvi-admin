import { apiClient } from "./client";
import { UploadResult } from "@/types/catalog";

export interface UploadImageOptions {
  bucket?: "bruvi-products" | "bruvi-stores" | "bruvi-banners" | string;
  folder?: string;
  customFilename?: string;
}

export const StorageApi = {
  /**
   * Upload an image file through the authenticated admin proxy to Supabase Cloud Storage
   */
  async uploadImage(
    file: File,
    options: UploadImageOptions = {}
  ): Promise<UploadResult> {
    const { bucket = "bruvi-products", folder = "products", customFilename } = options;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);
    if (customFilename) {
      formData.append("customFilename", customFilename);
    }

    return apiClient.upload<UploadResult>("/admin/storage/upload", formData);
  },

  /**
   * Delete a file from cloud storage
   */
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const res = await apiClient.delete<{ deleted: boolean }>("/admin/storage/file", {
        params: { bucket, path },
      });
      return res.deleted ?? true;
    } catch {
      return false;
    }
  },
};

