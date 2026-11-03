"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ChannelIconProps {
  active: boolean;
  className?: string;
}

/**
 * Counter POS Channel Icon
 * Pixel-perfect extraction from Figma node 225:90388
 */
export function CounterChannelIcon({ active, className }: ChannelIconProps) {
  return (
    <div
      className={cn(
        "h-6 w-6 rounded-[4px] flex items-center justify-center shrink-0 transition-colors select-none",
        active ? "bg-[#F5F7FA]" : "bg-transparent",
        className
      )}
      title={active ? "Counter POS (Enabled)" : "Counter POS (Disabled)"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.66667 9.9974V17.3307H10M6.66667 9.9974H6L7 6.66406H17L18 9.9974H17.3333M6.66667 9.9974H17.3333M10 17.3307H14M10 17.3307V13.3307H14V17.3307M14 17.3307H17.3333V9.9974"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={active ? "#0F2340" : "#BCC6D3"}
        />
      </svg>
    </div>
  );
}

/**
 * Self-Kiosk Channel Icon
 * Pixel-perfect extraction from Figma node 225:90393
 */
export function KioskChannelIcon({ active, className }: ChannelIconProps) {
  return (
    <div
      className={cn(
        "h-6 w-6 rounded-[4px] flex items-center justify-center shrink-0 transition-colors select-none",
        active ? "bg-[#F5F7FA]" : "bg-transparent",
        className
      )}
      title={active ? "Self-Kiosk (Enabled)" : "Self-Kiosk (Disabled)"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 15.3333H16V6H8V15.3333H12ZM12 15.3333V18M12 18H10M12 18H14"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={active ? "#0F2340" : "#BCC6D3"}
        />
      </svg>
    </div>
  );
}

/**
 * Mobile App Channel Icon
 * Pixel-perfect extraction from Figma node 225:90398
 */
export function AppChannelIcon({ active, className }: ChannelIconProps) {
  return (
    <div
      className={cn(
        "h-6 w-6 rounded-[4px] flex items-center justify-center shrink-0 transition-colors select-none",
        active ? "bg-[#F5F7FA]" : "bg-transparent",
        className
      )}
      title={active ? "Mobile App (Enabled)" : "Mobile App (Disabled)"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.3333 16.0026H12.6666M8.66663 5.33594H15.3333V18.6693H8.66663V5.33594Z"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={active ? "#0F2340" : "#BCC6D3"}
        />
      </svg>
    </div>
  );
}

/**
 * Table QR Dine-in Channel Icon
 * Pixel-perfect extraction from Figma node 225:90403
 */
export function QrChannelIcon({ active, className }: ChannelIconProps) {
  return (
    <div
      className={cn(
        "h-6 w-6 rounded-[4px] flex items-center justify-center shrink-0 transition-colors select-none",
        active ? "bg-[#F5F7FA]" : "bg-transparent",
        className
      )}
      title={active ? "Table QR Dine-in (Enabled)" : "Table QR Dine-in (Disabled)"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.66663 6.66406H10.6666V10.6641H6.66663V6.66406ZM13.3333 6.66406H17.3333V10.6641H13.3333V6.66406ZM6.66663 13.3307H10.6666V17.3307H6.66663V13.3307ZM13.3333 13.3307H14.6666V14.6641H13.3333V13.3307ZM16 15.9974H17.3333V17.3307H16V15.9974Z"
          strokeWidth="1.16667"
          strokeLinejoin="round"
          stroke={active ? "#0F2340" : "#BCC6D3"}
        />
      </svg>
    </div>
  );
}

/**
 * Full 4-Channel Matrix Row
 * Width 120px, Gap 4px (Figma 225:90387)
 */
export function ProductChannelsMatrix({
  counter,
  kiosk,
  app,
  qr,
  className,
}: {
  counter: boolean;
  kiosk: boolean;
  app: boolean;
  qr: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-[120px] flex items-center gap-1 shrink-0", className)}>
      <CounterChannelIcon active={counter} />
      <KioskChannelIcon active={kiosk} />
      <AppChannelIcon active={app} />
      <QrChannelIcon active={qr} />
    </div>
  );
}

