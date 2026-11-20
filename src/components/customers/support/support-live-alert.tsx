"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { selectAlerts, useSupportLiveStore } from "@/stores/use-support-live-store";
import { useShallow } from "zustand/react/shallow";

/** Cards drawn behind the top one. */
const STACK_DEPTH = 2;

function waitingFor(iso: string, now: number): string {
  const mins = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  return hours < 24 ? `${hours} h ${mins % 60} min` : `${Math.floor(hours / 24)} d`;
}

/**
 * Full-screen alert for live chats waiting on staff. The viewport edge glows,
 * and several chats stack with the oldest wait on top. "Open chat" jumps to
 * the conversation in Customers › Support; "Later" moves to the next chat.
 */
export function SupportLiveAlert() {
  const router = useRouter();
  const alerts = useSupportLiveStore(useShallow(selectAlerts));
  const dismiss = useSupportLiveStore((s) => s.dismiss);
  const openRef = React.useRef<HTMLButtonElement>(null);
  const [now, setNow] = React.useState(() => Date.now());
  const top = alerts[0];

  React.useEffect(() => {
    if (!top) return;
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [top]);

  React.useEffect(() => {
    if (!top) return;
    const previous = document.activeElement as HTMLElement | null;
    openRef.current?.focus();
    return () => previous?.focus?.();
  }, [top?.alertKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const later = React.useCallback(() => {
    if (top) dismiss([top.alertKey]);
  }, [dismiss, top]);

  React.useEffect(() => {
    if (!top) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") later();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [top, later]);

  if (!top) return null;

  const open = () => {
    dismiss([top.alertKey]);
    router.push(`/customers?tab=support&ticket=${encodeURIComponent(top.id)}`);
  };
  const behind = alerts.slice(1, 1 + STACK_DEPTH);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="support-live-alert-title"
      aria-describedby="support-live-alert-body"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      {/* Dimmed backdrop: the alert needs an answer, so a click outside does nothing. */}
      <div className="absolute inset-0 bg-[#0f2340]/45 backdrop-blur-[2px]" aria-hidden="true" />

      {/* Glow around the whole viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_3px_#5AB8F5,inset_0_0_96px_rgba(90,184,245,0.55)] motion-safe:animate-pulse"
      />

      <div className="relative w-full max-w-[440px]">
        {/* Stacked cards for the other waiting chats */}
        {behind.map((chat, i) => (
          <div
            key={chat.alertKey}
            aria-hidden="true"
            className="absolute inset-0 rounded-[20px] border border-[#dce2ea] bg-white shadow-[0_12px_32px_rgba(15,35,64,0.18)] transition-transform duration-300"
            style={{
              transform: `translateY(${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.05})`,
              opacity: 1 - (i + 1) * 0.25,
              zIndex: STACK_DEPTH - i,
            }}
          />
        ))}

        <div
          key={top.alertKey}
          className="relative z-10 overflow-hidden rounded-[20px] border border-[#dce2ea] bg-white shadow-[0_24px_64px_rgba(15,35,64,0.32)] motion-safe:animate-alert-in"
        >
          <div className="flex items-center justify-between gap-3 bg-[#1c3a66] px-5 py-3">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#5AB8F5] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5AB8F5]" />
              </span>
              <span className="font-serif text-[12px] leading-4 uppercase tracking-[1.68px] text-white">
                Live chat
              </span>
            </span>
            <span className="font-sans text-[12px] leading-4 font-bold text-[#A9D8F3] [font-variation-settings:'wght'_700]">
              {alerts.length === 1 ? "1 customer waiting" : `1 of ${alerts.length} waiting`}
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#e4f0fa] text-[#1c3a66]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <h2
                  id="support-live-alert-title"
                  className="truncate font-display text-[24px] leading-8 font-black tracking-[-0.48px] text-[#0f2340]"
                >
                  {top.customerName}
                </h2>
                <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
                  {top.ticketNumber} · waiting {waitingFor(top.waitingSince, now)}
                  {top.assigneeName ? ` · ${top.assigneeName}` : " · unassigned"}
                </span>
              </div>
            </div>

            <p
              id="support-live-alert-body"
              className={cn(
                "rounded-[12px] bg-[#f5f7fa] px-4 py-3 font-sans text-[14px] leading-5 text-[#0f2340] line-clamp-4 break-words",
                !top.preview && "text-[#55647a]",
              )}
            >
              {top.preview ? `“${top.preview}”` : "Opened a live chat. No message yet."}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={later}
                className="h-9 px-[17.5px] rounded-[12px] bg-white border-[1.5px] border-[#bcc6d3] text-label text-[#0f2340] hover:bg-[#f5f7fa] active:bg-[#ebeff4] transition-colors cursor-pointer font-sans [font-variation-settings:'wght'_700] shadow-2xs"
              >
                Later
              </button>
              <button
                ref={openRef}
                type="button"
                onClick={open}
                className="h-9 px-4 rounded-[12px] bg-[#1c3a66] text-label text-white hover:bg-[#152c4f] active:bg-[#0f2340] transition-colors cursor-pointer font-sans [font-variation-settings:'wght'_700] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5AB8F5] focus-visible:ring-offset-2"
              >
                Open chat
              </button>
            </div>

            {alerts.length > 1 && (
              <button
                type="button"
                onClick={() => dismiss(alerts.map((a) => a.alertKey))}
                className="self-center font-sans text-[13px] font-bold text-[#1c3a66] hover:underline cursor-pointer [font-variation-settings:'wght'_700]"
              >
                Dismiss all {alerts.length}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
