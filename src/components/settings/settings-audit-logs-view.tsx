"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableEmptyRow } from "@/components/feedback/empty-state";
import { BruviIcon } from "@/components/icons";

interface AuditLogRow {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  store: string;
  action: "Price update" | "Role change" | "Setting change" | "API key";
  target: string;
}

const AUDIT_LOGS: AuditLogRow[] = [
  {
    id: "aud-1",
    timestamp: "02 Oct · 14:42",
    actor: "Aarav Mehta",
    role: "HQ Admin",
    store: "All 12 stores",
    action: "Price update",
    target: "Iced Matcha Latte ₹240 → ₹260",
  },
  {
    id: "aud-2",
    timestamp: "02 Oct · 13:18",
    actor: "Neha Kulkarni",
    role: "Finance Lead",
    store: "Indiranagar",
    action: "Setting change",
    target: "Enabled instant Wallet refunds",
  },
  {
    id: "aud-3",
    timestamp: "02 Oct · 11:05",
    actor: "Rohan Verma",
    role: "Ops Manager",
    store: "Koramangala",
    action: "Role change",
    target: "Granted Shift Lead to Vikram S.",
  },
  {
    id: "aud-4",
    timestamp: "02 Oct · 09:30",
    actor: "Aarav Mehta",
    role: "HQ Admin",
    store: "HQ",
    action: "API key",
    target: "Rotated Tally export token (••Lm09)",
  },
];

export function SettingsAuditLogsView() {
  const [query, setQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [exported, setExported] = React.useState(false);

  const filtered = AUDIT_LOGS.filter((row) => {
    const matchesAction = actionFilter === "all" || row.action === actionFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      row.actor.toLowerCase().includes(q) ||
      row.store.toLowerCase().includes(q) ||
      row.target.toLowerCase().includes(q);
    return matchesAction && matchesQuery;
  });

  const handleExport = () => {
    setExported(true);
    window.setTimeout(() => setExported(false), 2200);
  };

  return (
    <SettingsShell
      active="audit-logs"
      overline="SETTINGS · SECURITY & ACCESS"
      title="Audit logs"
      actions={
        <>
          {exported && (
            <Badge variant="success" className="gap-1.5">
              <BruviIcon name="check" size={14} />
              CSV exported
            </Badge>
          )}
          <Button variant="outline" onClick={handleExport}>
            <BruviIcon name="download" size={16} />
            Export CSV
          </Button>
        </>
      }
    >
      {/* Filters */}
      <Card className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <BruviIcon
            name="search"
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, store, or change…"
            className="w-full h-10 rounded-xl border border-border-input bg-surface pl-9 pr-3.5 text-body-s text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus/40"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
        >
          <option value="all">All action types</option>
          <option value="Price update">Price update</option>
          <option value="Role change">Role change</option>
          <option value="Setting change">Setting change</option>
          <option value="API key">API key</option>
        </select>
      </Card>

      {/* Audit Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-subtle text-caption font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-6">Time</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Store</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-6">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-body-s">
              {filtered.length === 0 ? (
                <TableEmptyRow
                  colSpan={5}
                  title="No matching audit events"
                  description="Try clearing your search query or switching action type filters."
                  actionLabel="Reset filters"
                  onAction={() => {
                    setQuery("");
                    setActionFilter("all");
                  }}
                />
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-bg-subtle/60 transition-colors">
                    <td className="py-3.5 px-6 text-text-muted tnum whitespace-nowrap">
                      {row.timestamp}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-text">{row.actor}</span>
                      <span className="text-caption text-text-muted ml-1.5">
                        · {row.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary whitespace-nowrap">
                      {row.store}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="outline">{row.action}</Badge>
                    </td>
                    <td className="py-3.5 px-6 text-text">{row.target}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </SettingsShell>
  );
}
