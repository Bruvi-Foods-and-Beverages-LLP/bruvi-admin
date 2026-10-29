import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff & Roster · BRUVI HQ",
  description: "Multi-store barista roster, shift logs, station assignments, and certs.",
};

export default function StaffPage() {
  return (
    <ComingSoonModule
      title="Staff & Roster"
      category="Business"
      iconName="profile"
      description="Workforce management across all 12 Bruvi stores: shift scheduling, biometric clock-in verification, barista latte art certifications, and tip pool allocations."
      features={[
        "Multi-store shift roster with swap request approvals",
        "Biometric geofenced clock-in & break duration compliance",
        "Barista skill matrix & recipe certification tracking",
        "Transparent daily digital tip distribution calculations",
      ]}
    />
  );
}

