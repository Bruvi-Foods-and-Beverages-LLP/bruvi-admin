"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BruviIcon } from "@/components/icons";

type ChannelKey = "push" | "sms" | "whatsapp" | "email";

interface NotificationEventRow {
  id: string;
  label: string;
  description: string;
  channels: Record<ChannelKey, boolean>;
}

const INITIAL_EVENTS: NotificationEventRow[] = [
  {
    id: "order-accepted",
    label: "Order accepted",
    description: "Customer confirmation when kitchen accepts mobile or QR order",
    channels: { push: true, sms: false, whatsapp: true, email: false },
  },
  {
    id: "order-ready",
    label: "Order ready",
    description: "Pickup alert triggered when barista bumps ticket on KDS",
    channels: { push: true, sms: true, whatsapp: true, email: false },
  },
  {
    id: "order-delayed",
    label: "Order delayed",
    description: "Escalation when prep time exceeds store SLA threshold",
    channels: { push: true, sms: true, whatsapp: false, email: true },
  },
  {
    id: "refund-issued",
    label: "Refund issued",
    description: "Receipt and UTR reference sent to customer and finance",
    channels: { push: true, sms: true, whatsapp: true, email: true },
  },
  {
    id: "kds-offline",
    label: "KDS offline",
    description: "Store manager & ops alert if kitchen screen disconnects > 90s",
    channels: { push: true, sms: true, whatsapp: false, email: true },
  },
  {
    id: "stock-out",
    label: "Stock out",
    description: "Real-time 86 notification when ingredient hits zero",
    channels: { push: true, sms: false, whatsapp: true, email: true },
  },
  {
    id: "cash-variance",
    label: "Cash variance",
    description: "Shift-close drawer discrepancy over ₹200",
    channels: { push: false, sms: false, whatsapp: false, email: true },
  },
];

export function SettingsNotificationsView() {
  const [rows, setRows] = React.useState<NotificationEventRow[]>(INITIAL_EVENTS);
  const [testSent, setTestSent] = React.useState(false);

  const toggleCell = (id: string, channel: ChannelKey, val: boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, channels: { ...row.channels, [channel]: val } }
          : row
      )
    );
  };

  const handleSendTest = () => {
    setTestSent(true);
    window.setTimeout(() => setTestSent(false), 2600);
  };

  return (
    <SettingsShell
      active="notifications"
      overline="SETTINGS · WORKSPACE"
      title="Notifications"
      actions={
        <>
          {testSent && (
            <Badge variant="success" className="gap-1.5">
              <BruviIcon name="check" size={14} />
              Test alert dispatched
            </Badge>
          )}
          <Button variant="outline" onClick={handleSendTest}>
            Send test
          </Button>
        </>
      }
    >
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-h2 text-text">Events × Channels</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Choose which operational and customer events trigger Push, SMS, WhatsApp, or Email.
            </p>
          </div>
          <Badge variant="outline">SMS 60s fallback active</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-caption font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-6">Event</th>
                <th className="py-3 px-4 text-center">Push</th>
                <th className="py-3 px-4 text-center">SMS</th>
                <th className="py-3 px-4 text-center">WhatsApp</th>
                <th className="py-3 px-6 text-center">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-s">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-bg-subtle/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-text">{row.label}</div>
                    <div className="text-caption text-text-muted">{row.description}</div>
                  </td>
                  {(["push", "sms", "whatsapp", "email"] as ChannelKey[]).map(
                    (channel) => (
                      <td key={channel} className="py-4 px-4">
                        <div className="flex justify-center">
                          <Switch
                            checked={row.channels[channel]}
                            onCheckedChange={(val) => toggleCell(row.id, channel, val)}
                            aria-label={`${row.label} ${channel}`}
                          />
                        </div>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5 bg-bg-subtle border-border flex items-start gap-3">
        <BruviIcon name="notification" size={18} className="text-text-secondary mt-0.5 shrink-0" />
        <p className="text-body-s text-text-secondary">
          <span className="font-semibold text-text">SMS fallback policy:</span> If an{" "}
          <span className="font-semibold text-text">Order ready</span> push notification is not
          acknowledged within 60 seconds, an automated SMS is sent via DLT-approved template.
        </p>
      </Card>
    </SettingsShell>
  );
}
