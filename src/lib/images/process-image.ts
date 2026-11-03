/**
 * Client-side image pipeline for uploads: crop → (only if over budget) compress.
 *
 * The cropped image is encoded at full resolution in its source format. Compression runs
 * only when that result exceeds the preset's byte budget: JPEG quality is stepped down first,
 * then the image is scaled down until it fits. PNGs with transparency stay PNG (only scaled);
 * opaque PNGs over budget are re-encoded as JPEG.
 */

export interface ImageUploadPreset {
  /** Width / height of the crop frame. */
  aspect: number;
  /** Human label for the frame, shown in the crop modal. */
  aspectLabel: string;
  /** Upload byte budget. Compression only kicks in above this. */
  maxBytes: number;
  /** Below this output width the modal warns that the photo may look soft. */
  recommendedMinWidth: number;
  /** Input formats the picker accepts (all are decodable by browsers). */
  acceptTypes: string[];
}

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB, matches backend product image limit

/** Upload presets per image surface. Add one here for each new upload point. */
export const IMAGE_UPLOAD_PRESETS = {
  product: {
    aspect: 1,
    aspectLabel: "1:1 square",
    maxBytes: MAX_UPLOAD_BYTES,
    recommendedMinWidth: 600,
    acceptTypes: ["image/jpeg", "image/png", "image/webp"],
  },
} satisfies Record<string, ImageUploadPreset>;

/** Raw files larger than this are rejected before decoding, to keep the tab responsive. */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessedImage {
  file: File;
  width: number;
  height: number;
  /** True when quality or dimensions were reduced to fit the byte budget. */
  compressed: boolean;
}

const JPEG_QUALITY_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5];
const SCALE_STEP = 0.85;
const MIN_SCALED_WIDTH = 320;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Decodes a file with EXIF orientation applied, so the crop matches what the user sees. */
export async function decodeImage(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This file couldn't be read as an image. Try a JPG or PNG.");
  }
}

/** Snaps the cropper's area to whole pixels inside the image, keeping the exact aspect. */
export function normalizeCrop(area: PixelArea, aspect: number, imageWidth: number, imageHeight: number): PixelArea {
  let width = Math.min(Math.round(area.width), imageWidth);
  let height = Math.round(width / aspect);
  if (height > imageHeight) {
    height = imageHeight;
    width = Math.round(height * aspect);
  }
  const x = Math.min(Math.max(0, Math.round(area.x)), imageWidth - width);
  const y = Math.min(Math.max(0, Math.round(area.y)), imageHeight - height);
  return { x, y, width, height };
}

function drawToCanvas(source: CanvasImageSource, area: PixelArea, width: number, height: number, opaque: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing isn't supported in this browser.");
  if (opaque) {
    // JPEG has no alpha: flatten transparent pixels onto white instead of black.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, area.x, area.y, area.width, area.height, 0, 0, width, height);
  return canvas;
}

function encode(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't encode the image."))), type, quality);
  });
}

function hasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

function toFile(blob: Blob, sourceName: string, type: string): File {
  const ext = type === "image/png" ? "png" : "jpg";
  const base = sourceName.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.${ext}`, { type, lastModified: Date.now() });
}

/**
 * Crops `source` to `area` and returns a file within `maxBytes`.
 * Compression is applied only if the full-quality crop is over budget.
 */
export async function cropAndCompress(
  sourceFile: File,
  image: ImageBitmap,
  area: PixelArea,
  maxBytes: number
): Promise<ProcessedImage> {
  const isPng = sourceFile.type === "image/png";
  const coversWholeImage =
    area.x === 0 && area.y === 0 && area.width === image.width && area.height === image.height;

  // Untouched frame on an already-compliant file: upload the original bytes, no re-encode.
  if (coversWholeImage && sourceFile.size <= maxBytes && (isPng || sourceFile.type === "image/jpeg")) {
    return { file: sourceFile, width: image.width, height: image.height, compressed: false };
  }

  // 1. Full-resolution crop in the source format (WebP sources become JPEG).
  const fullCanvas = drawToCanvas(image, area, area.width, area.height, !isPng);
  const fullType = isPng ? "image/png" : "image/jpeg";
  const full = await encode(fullCanvas, fullType, isPng ? undefined : 0.95);
  if (full.size <= maxBytes) {
    return { file: toFile(full, sourceFile.name, fullType), width: area.width, height: area.height, compressed: false };
  }

  // 2. Over budget → compress. Transparent PNGs must stay PNG, so they can only shrink in size.
  const keepPng = isPng && hasTransparency(fullCanvas);
  const type = keepPng ? "image/png" : "image/jpeg";

  let width = area.width;
  let height = area.height;
  let canvas = keepPng ? fullCanvas : drawToCanvas(image, area, width, height, true);

  // Quality steps run only at full size; once scaling is needed, encode at the lowest quality
  // and jump straight to the estimated fitting size (bytes scale ~ with pixel area).
  let qualities = keepPng ? [undefined] : JPEG_QUALITY_STEPS;
  while (true) {
    let lastSize = 0;
    for (const quality of qualities) {
      const blob = await encode(canvas, type, quality);
      if (blob.size <= maxBytes) return { file: toFile(blob, sourceFile.name, type), width, height, compressed: true };
      lastSize = blob.size;
    }
    qualities = keepPng ? [undefined] : [JPEG_QUALITY_STEPS[JPEG_QUALITY_STEPS.length - 1]];

    const estimatedScale = Math.sqrt(maxBytes / lastSize) * 0.95;
    const nextWidth = Math.round(width * Math.min(SCALE_STEP, estimatedScale));
    if (nextWidth < MIN_SCALED_WIDTH) {
      throw new Error(`Couldn't get this image under ${formatBytes(maxBytes)}. Try a smaller crop or a different photo.`);
    }
    width = nextWidth;
    height = Math.round(width * (area.height / area.width));
    canvas = drawToCanvas(image, area, width, height, !keepPng);
  }
}
