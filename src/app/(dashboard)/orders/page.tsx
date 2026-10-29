import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnichannel Orders · BRUVI HQ",
  description: "Real-time multi-channel feed: POS, Kiosk, App, and QR Dine-In.",
};

export default function OrdersPage() {
  return (
    <ComingSoonModule
      title="Orders"
      category="Operations"
      iconName="receipt"
      description="Live omnichannel order stream across Counter POS, Self-Service Kiosks, Mobile App, and Dine-In QR with sub-50ms WebSocket telemetry."
      features={[
        "Real-time WebSocket event bus with sub-50ms latency",
        "Make-timer SLA tracking with bar station bottle-neck alerts",
        "Multi-tender payment breakdown & refund management",
        "Kitchen Display System (KDS) prep sync and rider dispatch",
      ]}
    />
  );
}
