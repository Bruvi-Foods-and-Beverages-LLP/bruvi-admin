"use client";

import * as React from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { AlertTriangle, Crop, Loader2, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cropAndCompress,
  decodeImage,
  formatBytes,
  normalizeCrop,
  type ImageUploadPreset,
  type ProcessedImage,
} from "@/lib/images/process-image";

interface ImageCropModalProps {
  /** The picked file; the modal is open while this is set. */
  file: File | null;
  preset: ImageUploadPreset;
  title?: string;
  onCancel: () => void;
  /**
   * Receives the final cropped (and, only if needed, compressed) file and uploads it.
   * Throw to keep the modal open and show the error; the parent closes it on success.
   */
  onConfirm: (image: ProcessedImage) => Promise<void>;
}

type Phase = "loading" | "ready" | "processing" | "uploading";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

/**
 * Crop & upload dialog shared by every image upload point.
 * Nothing is uploaded until the user confirms the crop.
 */
export function ImageCropModal({ file, ...props }: ImageCropModalProps) {
  if (!file) return null;
  // Fresh dialog state for every picked file.
  return <CropDialog key={`${file.name}:${file.size}:${file.lastModified}`} file={file} {...props} />;
}

function CropDialog({
  file,
  preset,
  title = "Crop photo",
  onCancel,
  onConfirm,
}: Omit<ImageCropModalProps, "file"> & { file: File }) {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [error, setError] = React.useState<string | null>(null);
  const [bitmap, setBitmap] = React.useState<ImageBitmap | null>(null);
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [areaPixels, setAreaPixels] = React.useState<Area | null>(null);
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  const titleId = React.useId();

  // Decode once (EXIF-oriented) so the crop is cut from exactly what the user sees.
  // The preview URL is created and revoked by the same effect run: a Strict Mode
  // remount must never be left holding a URL its earlier cleanup already revoked.
  React.useEffect(() => {
    let cancelled = false;
    let decoded: ImageBitmap | null = null;
    let url: string | null = null;
    decodeImage(file)
      .then((bmp) => {
        decoded = bmp;
        if (cancelled) return bmp.close();
        url = URL.createObjectURL(file);
        setObjectUrl(url);
        setBitmap(bmp);
        setPhase("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't open this image.");
        setPhase("ready");
      });
    return () => {
      cancelled = true;
      decoded?.close();
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  const busy = phase === "processing" || phase === "uploading";

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  const onCropComplete = React.useCallback((_: Area, pixels: Area) => setAreaPixels(pixels), []);

  const output =
    bitmap && areaPixels ? normalizeCrop(areaPixels, preset.aspect, bitmap.width, bitmap.height) : null;
  const lowResolution = output !== null && output.width < preset.recommendedMinWidth;

  const handleConfirm = async () => {
    if (!bitmap || !output) return;
    setError(null);
    try {
      setPhase("processing");
      const processed = await cropAndCompress(file, bitmap, output, preset.maxBytes);
      setPhase("uploading");
      await onConfirm(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setPhase("ready");
    }
  };

  const setZoomClamped = (value: number) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-[16px] border border-border bg-white shadow-floating"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-brand text-text-brand">
            <Crop className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 id={titleId} className="text-title text-text">
              {title}
            </h3>
            <p className="text-caption text-text-muted">
              Drag to position, zoom to frame · {preset.aspectLabel} · max {formatBytes(preset.maxBytes)}
            </p>
          </div>
        </div>

        {/* Crop canvas */}
        <div className="relative h-[340px] w-full bg-[#0F2340]">
          {bitmap && objectUrl ? (
            <Cropper
              image={objectUrl}
              crop={crop}
              zoom={zoom}
              aspect={preset.aspect}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              showGrid
              objectFit="contain"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ cropAreaStyle: { border: "2px solid rgba(255,255,255,0.9)", borderRadius: 12 } }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {phase === "loading" && <Loader2 className="h-6 w-6 animate-spin text-white/70" />}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 px-6 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoomClamped(zoom - ZOOM_STEP * 2)}
              disabled={busy || !bitmap}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-text hover:bg-background-subtle disabled:opacity-40 cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="range"
              aria-label="Zoom"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP / 10}
              value={zoom}
              disabled={busy || !bitmap}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer accent-[#1C3A66] disabled:opacity-40"
            />
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoomClamped(zoom + ZOOM_STEP * 2)}
              disabled={busy || !bitmap}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-text hover:bg-background-subtle disabled:opacity-40 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Reset crop"
              onClick={() => {
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              disabled={busy || !bitmap}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-text-muted hover:bg-background-subtle disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="flex min-h-5 items-center justify-between gap-3 text-caption">
            <span className="text-text-muted">
              {output ? `${output.width} × ${output.height} px` : "—"} · original {formatBytes(file.size)}
            </span>
            {lowResolution && (
              <span className="flex items-center gap-1 text-[#9A5B00]">
                <AlertTriangle className="h-3.5 w-3.5" />
                Low resolution
              </span>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-[8px] bg-[#FCE8E6] px-3 py-2 text-caption text-[#C0352B]">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <span className="text-caption text-text-muted">
            {phase === "processing" ? "Preparing image…" : phase === "uploading" ? "Uploading…" : "Compressed only if over the size limit"}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="compact" onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" size="compact" onClick={handleConfirm} disabled={busy || !output}>
              {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              {busy ? "Saving…" : "Crop & upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
