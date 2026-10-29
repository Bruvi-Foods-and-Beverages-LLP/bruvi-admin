"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/feedback/error-fallback";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Operational Exception caught by Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[480px] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <ErrorFallback
          error={error}
          reset={reset}
          title="Operational Module Failed to Load"
          description="The requested admin view encountered an unhandled exception. Your changes may be cached in state."
        />
      </div>
    </div>
  );
}

