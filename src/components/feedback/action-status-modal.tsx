"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ActionStatusType = "idle" | "loading" | "success" | "error";

export interface ActionStatusModalProps {
  isOpen: boolean;
  status: ActionStatusType;
  title?: string;
  description?: string;
  loadingMessage?: string;
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onClose?: () => void;
  /** Auto-invoke primary action on success after delay (ms). Default: disabled */
  autoDismissMs?: number;
}

/**
 * Humanizes technical error responses, stack traces, and database exceptions
 * into clean, respectful, user-friendly language.
 */
export function toFriendlyErrorMessage(
  err: unknown,
  fallback = "We could not complete your request. Please try again."
): string {
  if (!err) return fallback;

  let rawMessage = "";

  if (typeof err === "string") {
    rawMessage = err;
  } else if (err instanceof Error) {
    rawMessage = err.message;
  } else if (typeof err === "object" && err !== null) {
    const obj = err as Record<string, unknown>;
    const dataObj = typeof obj.data === "object" && obj.data !== null ? (obj.data as Record<string, unknown>) : null;
    rawMessage =
      String(obj.message || obj.error || obj.details || dataObj?.message || "");
  }

  // Validation lists ("a.b: msg, c: msg, …") collapse to the first issue so they stay readable
  // instead of tripping the length check below and falling back to a generic message.
  const issues = rawMessage.split(/,\s(?=[\w.]+:\s)/);
  if (issues.length > 1 && /^[\w.]+:\s/.test(issues[0])) {
    rawMessage = `${issues[0]} (+${issues.length - 1} more)`;
  }

  const lower = rawMessage.toLowerCase();

  // Network / Connection drop
  if (
    lower.includes("fetch failed") ||
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("enotfound") ||
    lower.includes("econnrefused") ||
    lower.includes("offline")
  ) {
    return "Unable to connect to Bruvi servers. Please check your internet connection and try again.";
  }

  // 409 Conflict / Unique constraint
  if (
    lower.includes("already exists") ||
    lower.includes("conflict") ||
    lower.includes("duplicate") ||
    lower.includes("unique constraint")
  ) {
    if (lower.includes("city")) {
      return "This city is already registered in your network. You can select it directly from the city list.";
    }
    if (lower.includes("store") || lower.includes("code")) {
      return "A store with this name or store code is already registered. Please choose a different code.";
    }
    return "A matching record already exists in your network. Please use a unique name or code.";
  }

  // Relational Integrity Foreign Key constraint
  if (lower.includes("does not exist in the cities table") || lower.includes("foreign key")) {
    return "The selected city was not found in the cities database. Please select an active city from the list or add a new one.";
  }

  // 400 Bad Request
  if (lower.includes("bad request") || lower.includes("invalid input") || lower.includes("validation")) {
    return "Some required information was missing or formatted incorrectly. Please review the form and try again.";
  }

  // 401 / 403 Authentication & Permissions
  if (lower.includes("unauthorized") || lower.includes("forbidden") || lower.includes("session")) {
    return "Your session has expired or you do not have permission to perform this update. Please log in again.";
  }

  // 500 / 502 / 503 Internal Server Error
  if (
    lower.includes("internal server") ||
    lower.includes("bad gateway") ||
    lower.includes("service unavailable") ||
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503")
  ) {
    return "Our systems experienced a brief issue while processing your update. No changes were lost. Please try again in a few moments.";
  }

  // If the raw message is reasonably short and doesn't contain technical jargon, use it
  if (
    rawMessage &&
    rawMessage.length < 120 &&
    !lower.includes("prisma") &&
    !lower.includes("sql") &&
    !lower.includes("stack") &&
    !lower.includes("exception") &&
    !lower.includes("object object")
  ) {
    return rawMessage;
  }

  return fallback;
}

/**
 * Reusable Enterprise Action Status Modal
 * Provides standardized Bruvi aesthetic feedback for asynchronous operations:
 * - Loading: High-craft pulsing brand loader with informative status
 * - Success: Celebratory animated checkmark with affirmative closure
 * - Error: Friendly, non-technical guidance with retry and recovery actions
 */
export function ActionStatusModal({
  isOpen,
  status,
  title,
  description,
  loadingMessage = "Connecting to Bruvi network...",
  successTitle = "Changes Saved Successfully",
  successDescription = "Your update has been processed and is now live across your network.",
  errorTitle = "Unable to Complete Action",
  errorDescription,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  onClose,
  autoDismissMs,
}: ActionStatusModalProps) {
  // Prevent body scroll when modal is active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && status !== "loading" && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, onClose]);

  // Optional auto-dismiss on success
  React.useEffect(() => {
    if (isOpen && status === "success" && autoDismissMs && autoDismissMs > 0) {
      const timer = setTimeout(() => {
        if (onPrimaryAction) {
          onPrimaryAction();
        } else if (onClose) {
          onClose();
        }
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, status, autoDismissMs, onPrimaryAction, onClose]);

  if (!isOpen || status === "idle") return null;

  const displayTitle =
    status === "loading"
      ? title || "Processing Request..."
      : status === "success"
      ? title || successTitle
      : title || errorTitle;

  const displayDesc =
    status === "loading"
      ? description || loadingMessage
      : status === "success"
      ? description || successDescription
      : description || errorDescription || "An unexpected issue occurred. Please try again.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-status-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-[#0F2340]/65 backdrop-blur-xs transition-opacity duration-200",
          status === "loading" ? "pointer-events-none" : "cursor-pointer"
        )}
        onClick={() => {
          if (status !== "loading" && onClose) onClose();
        }}
      />

      {/* Card Container */}
      <div
        className={cn(
          "relative w-full max-w-[420px] bg-white rounded-[24px] border border-[#dce2ea] shadow-floating z-10 overflow-hidden flex flex-col p-6 sm:p-7 text-center items-center transition-all duration-300 animate-in zoom-in-95"
        )}
      >
        {/* Close Button (only accessible when not loading) */}
        {status !== "loading" && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-[10px] text-[#7F8CA0] hover:text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* 1. STATE GRAPHICS */}
        <div className="my-3 flex items-center justify-center">
          {/* LOADING STATE GRAPHIC */}
          {status === "loading" && (
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 rounded-full bg-[#e8f5fd] animate-ping opacity-60" />

              {/* Concentric Spinning Rings */}
              <div className="relative w-18 h-18 rounded-full border-[3px] border-[#dce2ea] border-t-[#1C3A66] animate-spin" />
              <div className="absolute w-12 h-12 rounded-full border-[2.5px] border-[#e8f5fd] border-b-[#A9D8F3] animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />

              {/* Brand Center Pip */}
              <div className="absolute w-4 h-4 rounded-full bg-[#1C3A66] shadow-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          )}

          {/* SUCCESS STATE GRAPHIC (Custom Animated Checkmark) */}
          {status === "success" && (
            <div className="relative flex items-center justify-center w-20 h-20 animate-in zoom-in-75 duration-300">
              {/* Emerald Halo Pulse */}
              <div className="absolute inset-0 rounded-full bg-[#E3F4EA] animate-ping opacity-40 [animation-duration:1.8s]" />

              {/* Soft Surface Circle */}
              <div className="w-18 h-18 rounded-full bg-[#E3F4EA] border border-[#A6E4C4] flex items-center justify-center shadow-xs">
                {/* Animated SVG Tick */}
                <svg
                  className="w-10 h-10 text-[#107E3E]"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="stroke-[#107E3E]/20"
                    strokeWidth="3"
                  />
                  <path
                    d="M14 24.5L21 31.5L34 17.5"
                    className="stroke-[#107E3E]"
                    style={{
                      strokeDasharray: 40,
                      strokeDashoffset: 0,
                      animation: "bruviCheckmark 0.4s ease-out forwards",
                    }}
                  />
                </svg>
              </div>
            </div>
          )}

          {/* ERROR STATE GRAPHIC */}
          {status === "error" && (
            <div className="relative flex items-center justify-center w-20 h-20 animate-in zoom-in-75 duration-300">
              {/* Coral Warning Halo */}
              <div className="absolute inset-0 rounded-full bg-[#fce8e6] animate-ping opacity-40 [animation-duration:2s]" />

              {/* Surface Container */}
              <div className="w-18 h-18 rounded-full bg-[#fce8e6] border border-[#f9beb8] flex items-center justify-center shadow-xs text-[#c0352b]">
                <AlertCircle className="w-9 h-9 stroke-[2.2]" />
              </div>
            </div>
          )}
        </div>

        {/* 2. TITLE & DESCRIPTION */}
        <div className="flex flex-col gap-1.5 mt-2 max-w-[340px]">
          <h3
            id="action-status-modal-title"
            className="text-title text-[#0F2340] font-bold leading-tight"
          >
            {displayTitle}
          </h3>
          <p className="text-body-s text-[#55647A] leading-relaxed">
            {displayDesc}
          </p>
        </div>

        {/* 3. ACTION CONTROLS */}
        <div className="w-full mt-6 pt-2 flex flex-col gap-2">
          {status === "loading" && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#7F8CA0] py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1C3A66] animate-pulse" />
              <span>Please keep this window open</span>
            </div>
          )}

          {status === "success" && (
            <button
              type="button"
              onClick={onPrimaryAction || onClose}
              autoFocus
              className="w-full h-11 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors cursor-pointer shadow-2xs font-bold flex items-center justify-center gap-2"
            >
              <span>{primaryActionLabel || "Continue"}</span>
            </button>
          )}

          {status === "error" && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              {onPrimaryAction && (
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  autoFocus
                  className="w-full sm:flex-1 h-11 px-4 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors cursor-pointer shadow-2xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{primaryActionLabel || "Try again"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onSecondaryAction || onClose}
                className={cn(
                  "h-11 px-4 rounded-[12px] border border-[#bcc6d3] text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer font-semibold",
                  onPrimaryAction ? "w-full sm:w-auto" : "w-full"
                )}
              >
                <span>{secondaryActionLabel || "Close"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bruviCheckmark {
          0% {
            stroke-dashoffset: 40;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

export interface ActionStatusOptions {
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  autoDismissMs?: number;
}

/**
 * React hook to effortlessly orchestrate loading -> success / error flows
 */
export function useActionStatusModal() {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    status: ActionStatusType;
    title?: string;
    description?: string;
    primaryActionLabel?: string;
    onPrimaryAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    autoDismissMs?: number;
  }>({
    isOpen: false,
    status: "idle",
  });

  const showLoading = React.useCallback(
    (title = "Processing...", description = "Connecting to Bruvi network...") => {
      setState({
        isOpen: true,
        status: "loading",
        title,
        description,
      });
    },
    []
  );

  const showSuccess = React.useCallback(
    (opts: ActionStatusOptions) => {
      setState((prev) => ({
        ...prev,
        isOpen: true,
        status: "success",
        title: opts.title || "Action Completed",
        description: opts.description || "Your update is now live.",
        primaryActionLabel: opts.primaryActionLabel,
        onPrimaryAction: opts.onPrimaryAction,
        secondaryActionLabel: opts.secondaryActionLabel,
        onSecondaryAction: opts.onSecondaryAction,
        autoDismissMs: opts.autoDismissMs,
      }));
    },
    []
  );

  const showError = React.useCallback(
    (err: unknown, opts?: ActionStatusOptions) => {
      const friendlyMessage = toFriendlyErrorMessage(err);
      setState((prev) => ({
        ...prev,
        isOpen: true,
        status: "error",
        title: opts?.title || "Unable to Complete Action",
        description: opts?.description || friendlyMessage,
        primaryActionLabel: opts?.primaryActionLabel || "Try again",
        onPrimaryAction: opts?.onPrimaryAction,
        secondaryActionLabel: opts?.secondaryActionLabel || "Close",
        onSecondaryAction: opts?.onSecondaryAction,
      }));
    },
    []
  );

  const closeModal = React.useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, status: "idle" }));
  }, []);

  return {
    state,
    showLoading,
    showSuccess,
    showError,
    closeModal,
  };
}

