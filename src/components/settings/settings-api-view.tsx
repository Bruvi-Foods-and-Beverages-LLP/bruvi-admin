"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { BruviIcon } from "@/components/icons";

interface ApiKeyRow {
  id: string;
  name: string;
  maskedKey: string;
  scope: string;
  lastUsed: string;
}

const INITIAL_KEYS: ApiKeyRow[] = [
  {
    id: "key-1",
    name: "POS & KDS sync",
    maskedKey: "bk_live_••••7Hq2",
    scope: "orders:write, kds:read",
    lastUsed: "2 min ago",
  },
  {
    id: "key-2",
    name: "Tally export",
    maskedKey: "bk_live_••••Lm09",
    scope: "finance:read, gst:read",
    lastUsed: "Today, 06:00",
  },
];

const WEBHOOKS = [
  {
    id: "wh-1",
    url: "https://erp.bruvi.coffee/webhooks/orders",
    events: "order.paid, order.refunded",
    status: "Healthy · 99.9%",
  },
  {
    id: "wh-2",
    url: "https://bi.bruvi.coffee/ingest/kds-sla",
    events: "kds.ticket_bumped, kds.delayed",
    status: "Healthy · 100%",
  },
];

export function SettingsApiView() {
  const [keys, setKeys] = React.useState<ApiKeyRow[]>(INITIAL_KEYS);
  const [creating, setCreating] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyScope, setNewKeyScope] = React.useState("orders:read");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    setKeys((prev) => [
      {
        id: `key-${Date.now()}`,
        name: newKeyName.trim(),
        maskedKey: `bk_live_••••${suffix}`,
        scope: newKeyScope,
        lastUsed: "Never used",
      },
      ...prev,
    ]);
    setNewKeyName("");
    setCreating(false);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCopy = (id: string, masked: string) => {
    navigator.clipboard?.writeText(masked).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <SettingsShell
      active="api"
      overline="SETTINGS · SECURITY & ACCESS"
      title="API & developers"
      actions={
        <Button variant="workspace" onClick={() => setCreating((v) => !v)}>
          <BruviIcon name="add" size={16} />
          Create API key
        </Button>
      }
    >
      {creating && (
        <Card className="p-5 border-primary/40 bg-surface-brand/25">
          <form
            onSubmit={handleCreate}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
          >
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="api-key-name" className="text-label text-text">
                Key label
              </label>
              <input
                id="api-key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Warehouse inventory worker"
                className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
              />
            </div>
            <div className="flex flex-col gap-1 sm:w-56">
              <label htmlFor="api-key-scope" className="text-label text-text">
                Scope
              </label>
              <select
                id="api-key-scope"
                value={newKeyScope}
                onChange={(e) => setNewKeyScope(e.target.value)}
                className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
              >
                <option value="orders:read">orders:read</option>
                <option value="orders:write, kds:read">orders:write, kds:read</option>
                <option value="finance:read, gst:read">finance:read, gst:read</option>
                <option value="inventory:write">inventory:write</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" variant="workspace">
                Generate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* API Keys Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between gap-2">
          <div>
            <h2 className="text-h2 text-text">API keys</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Server-to-server tokens for POS terminals, ERP exports, and warehouse sync.
            </p>
          </div>
          <Badge variant="outline" className="tnum">
            {keys.length} active
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-caption font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Scopes</th>
                <th className="py-3 px-4">Last used</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-s">
              {keys.length === 0 ? (
                <TableEmptyRow
                  colSpan={5}
                  title="No active API keys"
                  description="Create an API key to authenticate POS sync or accounting exports."
                  actionLabel="Create API key"
                  onAction={() => setCreating(true)}
                />
              ) : (
                keys.map((row) => (
                  <tr key={row.id} className="hover:bg-bg-subtle/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-text whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-caption text-text-secondary whitespace-nowrap">
                      {row.maskedKey}
                    </td>
                    <td className="py-4 px-4 text-text-secondary">{row.scope}</td>
                    <td className="py-4 px-4 text-text-muted tnum whitespace-nowrap">
                      {row.lastUsed}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="compact"
                          onClick={() => handleCopy(row.id, row.maskedKey)}
                        >
                          {copiedId === row.id ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="compact"
                          className="text-danger hover:text-danger"
                          onClick={() => handleRevoke(row.id)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Webhooks */}
      <Card className="p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-h2 text-text">Webhook endpoints</h2>
          <p className="text-body-s text-text-secondary mt-0.5">
            Signed HMAC-SHA256 event deliveries with automatic exponential retry.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {WEBHOOKS.map((wh) => (
            <div
              key={wh.id}
              className="rounded-xl border border-border bg-bg-subtle px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-mono text-caption font-semibold text-text truncate">
                  {wh.url}
                </span>
                <span className="text-caption text-text-muted">{wh.events}</span>
              </div>
              <Badge variant="success" className="self-start sm:self-center shrink-0 tnum">
                {wh.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </SettingsShell>
  );
}
