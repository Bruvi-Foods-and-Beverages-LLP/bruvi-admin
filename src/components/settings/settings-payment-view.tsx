"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch, ToggleTile } from "@/components/ui/switch";
import { BruviIcon } from "@/components/icons";

interface ProviderRow {
  id: string;
  name: string;
  channels: string;
  settlement: string;
  mode: "Live" | "Sandbox" | "Disabled";
  enabled: boolean;
}

const INITIAL_PROVIDERS: ProviderRow[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    channels: "UPI · Cards · NetBanking (App & QR)",
    settlement: "T+1",
    mode: "Live",
    enabled: true,
  },
  {
    id: "pinelabs",
    name: "Pine Labs",
    channels: "In-store EDC terminals & Tap-to-Pay",
    settlement: "T+1",
    mode: "Live",
    enabled: true,
  },
  {
    id: "paytm",
    name: "Paytm",
    channels: "Fallback UPI & Wallet",
    settlement: "T+2",
    mode: "Disabled",
    enabled: false,
  },
  {
    id: "wallet",
    name: "BRUVI Wallet",
    channels: "Closed-loop prepaid balance & refunds",
    settlement: "Instant",
    mode: "Live",
    enabled: true,
  },
  {
    id: "cash",
    name: "Cash",
    channels: "Counter & COD drawer reconciliation",
    settlement: "EOD Shift",
    mode: "Live",
    enabled: true,
  },
];

export function SettingsPaymentView() {
  const [providers, setProviders] = React.useState<ProviderRow[]>(INITIAL_PROVIDERS);
  const [autoReconcile, setAutoReconcile] = React.useState(true);
  const [instantWalletRefund, setInstantWalletRefund] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const toggleProvider = (id: string, enabled: boolean) => {
    setProviders((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, enabled, mode: enabled ? "Live" : "Disabled" }
          : row
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <SettingsShell
      active="payment"
      overline="SETTINGS · WORKSPACE"
      title="Payment"
      actions={
        <>
          {saved && (
            <Badge variant="success" className="gap-1.5">
              <BruviIcon name="check" size={14} />
              Saved
            </Badge>
          )}
          <Button variant="workspace" onClick={handleSave}>
            Save changes
          </Button>
        </>
      }
    >
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-h2 text-text">Payment providers</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Active gateways, terminal acquirers, and settlement windows across all 12 stores.
            </p>
          </div>
          <Badge variant="outline" className="tnum">
            {providers.filter((p) => p.enabled).length} of {providers.length} active
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-caption font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-6">Provider</th>
                <th className="py-3 px-4">Channels</th>
                <th className="py-3 px-4">Settlement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-s">
              {providers.map((row) => (
                <tr key={row.id} className="hover:bg-bg-subtle/60 transition-colors">
                  <td className="py-4 px-6 font-semibold text-text whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{row.channels}</td>
                  <td className="py-4 px-4 text-text tnum whitespace-nowrap">
                    {row.settlement}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge
                      variant={
                        row.mode === "Live"
                          ? "success"
                          : row.mode === "Sandbox"
                          ? "warning"
                          : "outline"
                      }
                    >
                      {row.mode}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      <Switch
                        checked={row.enabled}
                        onCheckedChange={(val) => toggleProvider(row.id, val)}
                        aria-label={`Toggle ${row.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-h2 text-text">Settlement &amp; refund rules</h2>
          <p className="text-body-s text-text-secondary mt-0.5">
            Controls automated payout matching and customer refund routing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ToggleTile
            label="Auto-reconcile UTR payouts"
            hint="Match Razorpay & Pine Labs bank settlements automatically at 06:00 IST."
            checked={autoReconcile}
            onCheckedChange={setAutoReconcile}
          />
          <ToggleTile
            label="Prefer instant BRUVI Wallet refunds"
            hint="Offer one-tap wallet credit before 5-day bank reversal."
            checked={instantWalletRefund}
            onCheckedChange={setInstantWalletRefund}
          />
        </div>
      </Card>
    </SettingsShell>
  );
}
