"use client";

import * as React from "react";
import { Check, Info } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionText?: string;
  onAction?: () => void;
}

interface StoreSetupChecklistProps {
  city?: string;
}

export function StoreSetupChecklist({ city }: StoreSetupChecklistProps) {
  const [menuReady, setMenuReady] = React.useState(false);
  const [hoursSet, setHoursSet] = React.useState(false);
  const [devicesPaired, setDevicesPaired] = React.useState(false);
  const [staffInvited, setStaffInvited] = React.useState(false);
  const [paymentsConnected, setPaymentsConnected] = React.useState(false);

  const items: ChecklistItem[] = [
    {
      id: "menu",
      title: "Menu",
      description: menuReady
        ? "Standard catalog template configured"
        : "Initial menu template · Ready to customize",
      completed: menuReady,
      actionText: menuReady ? "Edit" : "Setup",
      onAction: () => setMenuReady(!menuReady),
    },
    {
      id: "hours",
      title: "Hours",
      description: hoursSet
        ? "Operating hours: 7:00 am – 11:00 pm"
        : "Not set · suggest 7:00 am – 11:00 pm",
      completed: hoursSet,
      actionText: hoursSet ? "Edit" : "Set",
      onAction: () => setHoursSet(!hoursSet),
    },
    {
      id: "devices",
      title: "Devices",
      description: devicesPaired
        ? "4 paired · POS, KDS, kiosk, printers"
        : "0 paired · POS, KDS, kiosk, printers",
      completed: devicesPaired,
      actionText: devicesPaired ? "Manage" : "Pair",
      onAction: () => setDevicesPaired(!devicesPaired),
    },
    {
      id: "staff",
      title: "Staff",
      description: staffInvited
        ? "Manager & barista roster configured"
        : "No manager assigned",
      completed: staffInvited,
      actionText: staffInvited ? "View" : "Invite",
      onAction: () => setStaffInvited(!staffInvited),
    },
    {
      id: "payments",
      title: "Payments",
      description: paymentsConnected
        ? "Razorpay sub-account · UPI terminal active"
        : "Razorpay sub-account · UPI terminal",
      completed: paymentsConnected,
      actionText: paymentsConnected ? "Config" : "Connect",
      onAction: () => setPaymentsConnected(!paymentsConnected),
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const progressPct = Math.round((completedCount / items.length) * 100);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Main Checklist Card (Figma: 400x421 rounded-16px) */}
      <div className="w-full rounded-[16px] border border-[#dce2ea] bg-white p-6 shadow-2xs flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-title text-[#0F2340]">Setup checklist</h2>
          <span className="text-caption text-[#55647A] font-semibold">
            {completedCount} of {items.length} ready
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#ebeff4] rounded-full overflow-hidden my-2">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-[#1C3A66] rounded-full transition-all duration-300"
          />
        </div>

        {/* Subtitle */}
        <p className="text-caption text-[#55647A] mb-4">
          You can create the store now and finish these before launch.
        </p>

        {/* List of items */}
        <div className="divide-y divide-[#dce2ea]">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-3">
                {/* Completed circle vs Unchecked ring */}
                {item.completed ? (
                  <div className="h-5 w-5 rounded-full bg-[#1F7A4D] text-white flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-[#bcc6d3] shrink-0" />
                )}

                <div className="flex flex-col">
                  <span className="text-label text-[#0F2340] leading-tight font-medium">
                    {item.title}
                  </span>
                  <span className="text-caption text-[#55647A] leading-tight">
                    {item.description}
                  </span>
                </div>
              </div>

              {item.actionText && (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="text-label text-[#1C3A66] hover:underline font-bold shrink-0 cursor-pointer text-xs"
                >
                  {item.actionText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. City Logistics Callout (Figma: 400x92 rounded-16px bg-[#e8f5fd]) */}
      <div className="w-full rounded-[16px] bg-[#e8f5fd] border border-[#cde9f9] p-4 flex items-start gap-3 shadow-2xs">
        <Info className="h-5 w-5 text-[#2F5690] shrink-0 mt-0.5" />
        <p className="text-body-s text-[#1C3A66] leading-relaxed">
          {city
            ? `${city} is a designated regional zone. Stock will ship from the nearest fulfillment hub until a local distribution route is established.`
            : "Select or add a city to automatically assign the supply route and replenishment fulfillment hub."}
        </p>
      </div>
    </div>
  );
}
