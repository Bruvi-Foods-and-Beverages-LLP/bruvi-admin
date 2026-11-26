import type { Metadata } from "next";
import { SettingsAuditLogsView } from "@/components/settings/settings-audit-logs-view";

export const metadata: Metadata = {
  title: "Audit Logs · BRUVI HQ",
  description: "Chronological record of price, role, setting, and API key mutations.",
};

export default function SettingsAuditLogsPage() {
  return <SettingsAuditLogsView />;
}
