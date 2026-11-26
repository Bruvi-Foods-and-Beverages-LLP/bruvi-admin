import type { Metadata } from "next";
import { SettingsGeneralView } from "@/components/settings/settings-general-view";

export const metadata: Metadata = {
  title: "General Settings · BRUVI HQ",
  description:
    "Company profile, admin display scaling, order channel prefixes, and default business hours.",
};

export default function SettingsPage() {
  return <SettingsGeneralView />;
}
