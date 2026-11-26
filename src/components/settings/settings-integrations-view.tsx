"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { BruviIcon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

type IntegrationStatus = "connected" | "attention";

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  lastSync: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "swiggy",
    name: "Swiggy",
    category: "Aggregators",
    description: "Menu sync, live item availability, and order injection to POS.",
    status: "connected",
    lastSync: "2 min ago",
  },
  {
    id: "zomato",
    name: "Zomato",
    category: "Aggregators",
    description: "Two-way menu catalog sync and rider arrival webhooks.",
    status: "connected",
    lastSync: "4 min ago",
  },
  {
    id: "tally",
    name: "Tally Prime",
    category: "Accounting",
    description: "Nightly GST sales voucher and purchase bill export.",
    status: "attention",
    lastSync: "Token expires in 3 days",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    category: "Payments",
    description: "UPI intent, saved cards, and automated UTR reconciliation.",
    status: "connected",
    lastSync: "Live",
  },
  {
    id: "pinelabs",
    name: "Pine Labs",
    category: "Payments",
    description: "In-store EDC terminal pairing and Tap-to-Pay.",
    status: "connected",
    lastSync: "Live",
  },
  {
    id: "pluxee",
    name: "Pluxee",
    category: "Corporate Meal",
    description: "Meal card acceptance on app and counter checkouts.",
    status: "connected",
    lastSync: "12 min ago",
  },
  {
    id: "google-maps",
    name: "Google Maps",
    category: "Logistics",
    description: "Delivery polygon ETA calculation and address autocomplete.",
    status: "connected",
    lastSync: "Live",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Messaging",
    description: "Order status templates and digital receipt delivery.",
    status: "connected",
    lastSync: "Live",
  },
];

export function SettingsIntegrationsView() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | IntegrationStatus>("all");
  const [reconnectedId, setReconnectedId] = React.useState<string | null>(null);

  const filtered = INTEGRATIONS.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const attentionCount = INTEGRATIONS.filter((i) => i.status === "attention").length;
  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length;

  return (
    <SettingsShell
      active="integrations"
      overline="SETTINGS · WORKSPACE"
      title="Integrations"
      actions={
        <div className="relative w-full sm:w-64">
          <BruviIcon
            name="search"
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrations…"
            className="w-full h-10 rounded-xl border border-border-input bg-surface pl-9 pr-3.5 text-body-s text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus/40"
          />
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "all", label: `All · ${INTEGRATIONS.length}` },
            { id: "connected", label: `Connected · ${connectedCount}` },
            { id: "attention", label: `Needs attention · ${attentionCount}` },
          ] as const
        ).map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={cn(
              "h-8 rounded-full px-3.5 text-caption font-semibold border transition-colors cursor-pointer tnum",
              filter === chip.id
                ? "bg-primary text-white border-primary"
                : "bg-surface text-text-secondary border-border hover:bg-bg-subtle"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            title="No integrations match"
            description="No connected service matches your current search or status filter."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery("");
              setFilter("all");
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isFixed = reconnectedId === item.id;
            const status = isFixed ? "connected" : item.status;
            return (
              <Card key={item.id} className="p-5 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-h3 text-text">{item.name}</h3>
                      <span className="text-caption text-text-muted">
                        · {item.category}
                      </span>
                    </div>
                    <p className="text-body-s text-text-secondary">{item.description}</p>
                  </div>
                  <Badge variant={status === "connected" ? "success" : "warning"}>
                    {status === "connected" ? "Connected" : "Needs attention"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-caption text-text-muted tnum">
                    {isFixed ? "Synced just now" : item.lastSync}
                  </span>
                  <Button
                    variant={status === "attention" ? "workspace" : "outline"}
                    size="compact"
                    onClick={() => setReconnectedId(item.id)}
                  >
                    {status === "attention" ? "Reconnect" : "Configure"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </SettingsShell>
  );
}
