"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

/**
 * Figma AS03: Load Error & Recovery
 */
export function ErrorFallback({
  error,
  reset,
  title = "Operational Error Occurred",
  description = "An unexpected error occurred while loading this module.",
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="max-w-md text-xs text-gray-600 mb-4">{description}</p>
      {error.digest && (
        <code className="rounded bg-red-100 px-2 py-1 text-[10px] text-red-800 font-mono mb-6">
          Digest: {error.digest}
        </code>
      )}
      <Button variant="default" size="sm" onClick={() => reset()} className="flex items-center space-x-2">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}

