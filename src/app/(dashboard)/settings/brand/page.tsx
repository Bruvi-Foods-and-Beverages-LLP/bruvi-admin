import type { Metadata } from "next";
import { SettingsBrandView } from "@/components/settings/settings-brand-view";

export const metadata: Metadata = {
  title: "Brand Settings · BRUVI HQ",
  description: "Logo marks, brand palette tokens, and typography system.",
};

export default function SettingsBrandPage() {
  return <SettingsBrandView />;
}
