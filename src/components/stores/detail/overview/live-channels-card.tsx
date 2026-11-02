"use client";

import * as React from "react";
import { StoreOverviewMetrics } from "@/store/slices/stores-slice";
import { cn } from "@/lib/utils/cn";

interface LiveChannelsCardProps {
  channels?: StoreOverviewMetrics["liveChannels"];
}

interface ChannelItem {
  id: string;
  name: string;
  status: "ONLINE" | "BUSY" | "PAUSED" | "OFFLINE" | string;
  detail: string;
}

export function LiveChannelsCard({ channels }: LiveChannelsCardProps) {
  const channelList = React.useMemo<ChannelItem[]>(() => {
    if (!channels) {
      return [
        { id: "counter", name: "Counter", status: "OFFLINE", detail: "0 of 0 POS online" },
        { id: "appPickup", name: "App pickup", status: "OFFLINE", detail: "Closed" },
        { id: "kiosk", name: "Kiosk", status: "OFFLINE", detail: "0 kiosks online" },
        { id: "dineInQr", name: "Dine-in QR", status: "OFFLINE", detail: "0 tables" },
        { id: "bruviDelivery", name: "BRUVI delivery", status: "OFFLINE", detail: "Off · 0 riders" },
        { id: "partnerDelivery", name: "Partner delivery", status: "OFFLINE", detail: "Off" },
      ];
    }

    return [
      {
        id: "counter",
        name: "Counter",
        status: channels.counter?.status || "OFFLINE",
        detail: channels.counter?.detail || "0 of 0 POS online",
      },
      {
        id: "appPickup",
        name: "App pickup",
        status: channels.appPickup?.status || "OFFLINE",
        detail: channels.appPickup?.detail || (channels.appPickup?.status === "ONLINE" ? "Active" : "Closed"),
      },
      {
        id: "kiosk",
        name: "Kiosk",
        status: channels.kiosk?.status || "OFFLINE",
        detail: channels.kiosk?.detail || "0 kiosks online",
      },
      {
        id: "dineInQr",
        name: "Dine-in QR",
        status: channels.dineInQr?.status || "OFFLINE",
        detail: channels.dineInQr?.detail || "0 tables",
      },
      {
        id: "bruviDelivery",
        name: "BRUVI delivery",
        status: channels.bruviDelivery?.status || "OFFLINE",
        detail: channels.bruviDelivery?.detail || "Off · 0 riders",
      },
      {
        id: "partnerDelivery",
        name: "Partner delivery",
        status: channels.partnerDelivery?.status || "OFFLINE",
        detail: channels.partnerDelivery?.detail || "Off",
      },
    ];
  }, [channels]);

  const updatedAtText = channels?.updatedAt || "Just now";

  const getStatusDotClass = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "ONLINE" || s === "ACTIVE" || s === "ON") return "bg-success";
    if (s === "PAUSED" || s === "BUSY" || s === "WARNING") return "bg-warning";
    return "bg-gray-400";
  };

  return (
    <div className="flex flex-col rounded-[16px] bg-surface border border-border shadow-sm overflow-hidden">
      {/* Header (Figma Node 225:86721) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-title text-text">
          Live channels
        </h3>
        <span className="text-caption text-text-muted">
          Updated {updatedAtText}
        </span>
      </div>

      {/* Channels List (Figma Nodes 225:86724 - 225:86745) */}
      <div className="divide-y divide-border">
        {channelList.map((ch) => {
          const isPaused = ch.status === "PAUSED";
          const isOffline = ch.status === "OFFLINE";
          const dotColor = getStatusDotClass(ch.status);

          return (
            <div
              key={ch.id}
              className="flex items-center justify-between px-5 py-3 h-12"
            >
              <div className="flex items-center gap-3">
                <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                <span
                  className={cn(
                    "text-label",
                    isOffline ? "text-text-muted" : "text-text"
                  )}
                >
                  {ch.name}
                </span>
              </div>

              {isPaused ? (
                <span className="px-2 py-0.5 rounded-full bg-warning-surface text-warning text-caption-bold">
                  Paused
                </span>
              ) : (
                <span
                  className={cn(
                    "text-caption truncate max-w-[200px]",
                    isOffline ? "text-text-muted" : "text-text-muted"
                  )}
                >
                  {ch.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
