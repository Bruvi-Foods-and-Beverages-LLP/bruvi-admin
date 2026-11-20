"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CampaignDetailHeader } from "@/components/marketing/detail/campaign-detail-header";
import {
  CampaignProgressStepper,
  CampaignStep,
} from "@/components/marketing/detail/campaign-progress-stepper";
import {
  CampaignMessageEditor,
  CampaignChannelTab,
} from "@/components/marketing/detail/campaign-message-editor";
import { CampaignLivePreview } from "@/components/marketing/detail/campaign-live-preview";
import { FALLBACK_CAMPAIGN_TABLE_ITEMS } from "@/lib/api/marketing";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Campaign Detail Page (Figma Node 474:242117 - A082 Campaign Authoring & Detail)
 * - Conforms strictly to 1136px grid, 4px spacing units, Archivo & Manrope tokens.
 * - Header with overline breadcrumb, title, "Save draft", "Continue to Offer", and 5 tabs.
 * - 6-step visual progress tracking bar: Goal, Audience, Message, Offer, Schedule, Review.
 * - 2-column main area (1136px total width):
 *   - Left: Form editor (712px) with channels, title/body char counters, token insertion, deep link, rich image.
 *   - Right: Live preview mock (400px) with lockscreen clock face (9:41), notification card, and iOS/Android switch.
 */
export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const unwrappedParams = React.use(params);
  const campaignId = unwrappedParams.id;
  const router = useRouter();

  // Find existing campaign or default to Diwali Gift Cards (Figma 474:242117)
  const existingCampaign = FALLBACK_CAMPAIGN_TABLE_ITEMS.find(
    (c) => c.id === campaignId || c.code.toLowerCase() === campaignId?.toLowerCase()
  );

  const campaignName = existingCampaign?.name || "Diwali Gift Cards";
  const campaignCode = existingCampaign?.code || "CMP-0294";

  // Form State
  const [currentStep, setCurrentStep] = React.useState<CampaignStep>("message");
  const [channel, setChannel] = React.useState<CampaignChannelTab>("push");
  const [title, setTitle] = React.useState("{first_name}, gift a BRUVI this Diwali");
  const [body, setBody] = React.useState(
    "Send a BRUVI gift card from ₹500 and let them pick the brew. Bonus ₹100 on cards of ₹1,000+."
  );
  const [deepLink, setDeepLink] = React.useState("bruvi://giftcards/diwali");
  const [imageFileName, setImageFileName] = React.useState("diwali-giftcard-1x1.png");

  // Feedback notifications
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleSaveDraft = () => {
    setFeedback("Draft saved successfully.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleContinue = () => {
    if (currentStep === "message") setCurrentStep("offer");
    else if (currentStep === "offer") setCurrentStep("schedule");
    else if (currentStep === "schedule") setCurrentStep("review");
    else {
      setFeedback("Campaign submitted successfully!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleInsertToken = (token: string) => {
    setBody((prev) => `${prev} ${token}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto pb-12 font-manrope">
      {/* Feedback Banner */}
      {feedback && (
        <div className="w-full bg-[#dcfce7] border border-[#15803d]/20 text-[#15803d] px-4 py-2.5 rounded-[12px] text-[14px] font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Page Header (Figma 474:242157, 1136x115px) */}
      <CampaignDetailHeader
        campaignName={campaignName}
        campaignCode={campaignCode}
        onSaveDraft={handleSaveDraft}
        onContinue={handleContinue}
      />

      {/* 2. Visual 6-Step Progress Tracker (Figma 474:242178, 1136x50px) */}
      <CampaignProgressStepper
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* 3. Main 2-Column Authoring Layout (Figma 474:242212, 1136x575px, gap: 24px) */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-6">
        {/* Left Column: Form & Details Entering (Figma 474:242213, 712px width) */}
        <CampaignMessageEditor
          channel={channel}
          onChannelChange={setChannel}
          title={title}
          onTitleChange={setTitle}
          body={body}
          onBodyChange={setBody}
          deepLink={deepLink}
          onDeepLinkChange={setDeepLink}
          imageFileName={imageFileName}
          onReplaceImage={() => {
            const newName = prompt("Enter replacement image filename:", imageFileName);
            if (newName) setImageFileName(newName);
          }}
          onInsertToken={handleInsertToken}
        />

        {/* Right Column: Live Phone Preview Mock (Figma 474:242277, 400px width) */}
        <CampaignLivePreview
          title={title}
          body={body}
          imageFileName={imageFileName}
          sampleCustomerName="Saisubbireddy"
        />
      </div>
    </div>
  );
}

