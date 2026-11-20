"use client";

import React from "react";
import { Check } from "lucide-react";

export type CampaignStep = "goal" | "audience" | "message" | "offer" | "schedule" | "review";

interface CampaignProgressStepperProps {
  currentStep?: CampaignStep;
  onStepClick?: (step: CampaignStep) => void;
}

/**
 * Campaign Progress Stepper (Figma 474:242178, 1136x50px)
 * Visual 6-step progress tracker with completed checkmarks, active step indicator, and connector lines.
 */
export function CampaignProgressStepper({
  currentStep = "message",
  onStepClick,
}: CampaignProgressStepperProps) {
  const steps: { key: CampaignStep; label: string; number: number }[] = [
    { key: "goal", label: "Goal", number: 1 },
    { key: "audience", label: "Audience", number: 2 },
    { key: "message", label: "Message", number: 3 },
    { key: "offer", label: "Offer", number: 4 },
    { key: "schedule", label: "Schedule", number: 5 },
    { key: "review", label: "Review", number: 6 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full h-[50px] bg-white border border-[#dce2ea] rounded-[16px] px-6 flex items-center justify-between shadow-2xs select-none">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isActive = idx === currentStepIndex;
        const isPending = idx > currentStepIndex;

        return (
          <React.Fragment key={step.key}>
            {/* Step Item */}
            <div
              onClick={() => onStepClick?.(step.key)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              {/* Circle Indicator (24x24px) */}
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-[#15803d] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : isActive ? (
                <div className="w-6 h-6 rounded-full bg-[#1c3a66] flex items-center justify-center text-white text-[12px] font-bold font-manrope shrink-0 shadow-2xs">
                  {step.number}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-[#bcc6d3] bg-white flex items-center justify-center text-[#55647a] text-[12px] font-bold font-manrope shrink-0">
                  {step.number}
                </div>
              )}

              {/* Step Label */}
              <span
                className={`text-[14px] leading-[20px] font-manrope ${
                  isActive
                    ? "font-bold text-[#0f2340]"
                    : isCompleted
                    ? "font-bold text-[#3f4b5e]"
                    : "font-semibold text-[#55647a] group-hover:text-[#0f2340]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line between steps */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 mx-3 h-0.5 rounded-full transition-colors ${
                  idx < currentStepIndex ? "bg-[#15803d]" : "bg-[#dce2ea]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

