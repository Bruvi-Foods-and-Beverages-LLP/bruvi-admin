import { ComingSoonModule } from "@/components/feedback/coming-soon-module";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BRUVI LAB · Experimental R&D",
  description: "Experimental coffee roasting logs, brew ratio R&D, and sensory evaluations.",
};

export default function LabPage() {
  return (
    <ComingSoonModule
      title="BRUVI LAB"
      category="Growth"
      iconName="flask"
      description="The sensory and culinary sandbox of Bruvi Coffee. Log roast curves, TDS extraction measurements, Phin drip grind calibrations, and blind cupping scores."
      features={[
        "Roast profile temperature curve logging & Agtron color tracking",
        "Refractometer Total Dissolved Solids (TDS) & extraction percentage logging",
        "Digital SCA cupping scorecards for seasonal single-origin estates",
        "Experimental cold foam flavor development & shelf-life testing",
      ]}
    />
  );
}

