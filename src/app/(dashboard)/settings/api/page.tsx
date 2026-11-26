import type { Metadata } from "next";
import { SettingsApiView } from "@/components/settings/settings-api-view";

export const metadata: Metadata = {
  title: "API & Developers · BRUVI HQ",
  description: "Server-to-server API keys and signed webhook endpoints.",
};

export default function SettingsApiPage() {
  return <SettingsApiView />;
}
