import type { Metadata } from "next";
import { SettingsNotificationsView } from "@/components/settings/settings-notifications-view";

export const metadata: Metadata = {
  title: "Notification Settings · BRUVI HQ",
  description: "Events by channel notification matrix and SMS fallback policy.",
};

export default function SettingsNotificationsPage() {
  return <SettingsNotificationsView />;
}
