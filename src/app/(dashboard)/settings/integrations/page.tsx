import type { Metadata } from "next";
import { SettingsIntegrationsView } from "@/components/settings/settings-integrations-view";

export const metadata: Metadata = {
  title: "Integrations · BRUVI HQ",
  description: "Connected delivery aggregators, accounting, payment, and messaging apps.",
};

export default function SettingsIntegrationsPage() {
  return <SettingsIntegrationsView />;
}
