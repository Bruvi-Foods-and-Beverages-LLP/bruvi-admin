"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  WordmarkIcon,
  GoogleWorkspaceIcon,
  ShieldCheckIcon,
} from "@/components/icons";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextFormField } from "@/components/ui/text-form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { AdminAuthClient } from "../api/auth-client";
import { useAuthStore } from "@/stores/use-auth-store";

export function SignInCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";

  // Form State
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberDevice, setRememberDevice] = React.useState(true);

  // Field validation and feedback states
  const [emailError, setEmailError] = React.useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = React.useState<string | undefined>(undefined);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Loading States
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingChannel, setLoadingChannel] = React.useState<"google" | "email" | null>(null);

  // Google Workspace SSO Authentication Handler
  const handleGoogleSSO = () => {
    setFormError(
      "Google Workspace SSO is reserved for Enterprise SAML IdP. Please authenticate using your corporate credentials below."
    );
  };

  // Corporate Email & Password Authentication Handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setEmailError(undefined);
    setPasswordError(undefined);

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Please enter your work email.");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid corporate email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    setLoadingChannel("email");

    try {
      const auth = await AdminAuthClient.login(email, password, rememberDevice);
      useAuthStore.getState().setAuth(auth);
      router.push(redirectTarget);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setFormError(message);
      setIsLoading(false);
      setLoadingChannel(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4">
      {/* 1. Top Brand Lockup (Figma Frame 225:165558) */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          {/* Official BRUVI Wordmark Vector (132x32) */}
          <div className="text-[#1C3A66]">
            <WordmarkIcon width={132} height={32} />
          </div>
          {/* HQ Badge: 4px radius, primary fill, 11px Manrope Bold Caps */}
          <div className="bg-[#1C3A66] text-white text-[11px] font-bold font-sans px-2 py-0.5 rounded-[4px] tracking-wider uppercase leading-snug">
            HQ
          </div>
        </div>
        {/* Editorial Overline Tagline: Libre Caslon Text Regular Caps */}
        <span className="font-serif text-[11px] tracking-[0.2em] uppercase text-[#7F8CA0] select-none">
          Brew | Vibe | Repeat
        </span>
      </div>

      {/* 2. Main Authentication Card (Figma Frame 225:85481, 480x633) */}
      <Card
        variant="modal"
        className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0px_8px_24px_0px_rgba(15,35,64,0.12),0px_24px_64px_0px_rgba(15,35,64,0.16)] border-none overflow-hidden flex flex-col"
      >
        {/* Card Header (Figma Frame 225:85482) */}
        <div className="pt-8 px-6 pb-0 flex flex-col gap-2">
          <h1 className="font-sans font-extrabold text-[24px] leading-8 text-[#0F2340] tracking-tight">
            Sign in to BRUVI HQ
          </h1>
          <p className="font-sans font-normal text-[14px] leading-5 text-[#55647A]">
            Use your @bruvi.coffee Google Workspace account, or your work email and HQ password.
          </p>
        </div>

        {/* Card Body & Form (Figma Frame 225:85485) */}
        <div className="p-6 flex flex-col gap-5">
          {/* Global Form Error Banner */}
          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-[#FCE8E6] border border-[#F5C2BE] rounded-xl text-[#C0352B] text-[13px] font-sans font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-[#C0352B] shrink-0 mt-0.5" />
              <div className="flex-1">{formError}</div>
            </div>
          )}

          {/* Google Workspace SSO Button (Figma Frame 225:85486) */}
          <Button
            type="button"
            variant="workspace"
            onClick={handleGoogleSSO}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 px-5 rounded-[12px] border-[1.5px] border-[#BCC6D3] text-[#0F2340] font-sans font-bold text-[16px] leading-5"
          >
            {loadingChannel === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#1C3A66]" />
            ) : (
              <GoogleWorkspaceIcon size={20} className="shrink-0 text-[#0F2340]" />
            )}
            <span>
              {loadingChannel === "google"
                ? "Connecting to Google..."
                : "Continue with Google Workspace"}
            </span>
          </Button>

          {/* Divider: "or sign in with your work email" (Figma Frame 225:85494) */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#DCE2EA]" />
            <span className="font-sans font-medium text-[12px] leading-4 text-[#7F8CA0] shrink-0">
              or sign in with your work email
            </span>
            <div className="flex-1 h-[1px] bg-[#DCE2EA]" />
          </div>

          {/* Core Form Fields */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
            {/* Work email Field (Figma Frame 225:85498) */}
            <TextFormField
              id="work-email"
              label="Work email"
              type="email"
              placeholder="kavya.r@bruvi.coffee"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(undefined);
              }}
              error={emailError}
              disabled={isLoading}
              autoComplete="email"
            />

            {/* Password Field (Figma Frame 225:85503) */}
            <TextFormField
              id="password"
              label="Password"
              labelRight={
                <a
                  href="/forgot-password"
                  className="font-sans font-bold text-[14px] leading-5 text-[#1C3A66] underline underline-offset-2 hover:text-[#2F5690] transition-colors"
                >
                  Forgot password?
                </a>
              }
              isPassword
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
              disabled={isLoading}
              autoComplete="current-password"
            />

            {/* Remember Device Checkbox (Figma Frame 225:85515) */}
            <Checkbox
              id="remember-device"
              checked={rememberDevice}
              onCheckedChange={setRememberDevice}
              title="Remember this device"
              description="Keeps your email filled in. Don’t tick on shared store PCs."
              disabled={isLoading}
              className="pt-1"
            />

            {/* Sign in Button (Figma Frame 225:85524) */}
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full h-12 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] active:bg-[#0A172A] text-white font-sans font-bold text-[16px] leading-5 shadow-sm"
            >
              {loadingChannel === "email" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </span>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>
        </div>

        {/* Card Footer Security Banner (Figma Frame 225:154624) */}
        <div className="bg-[#F5F7FA] border-t border-[#DCE2EA] px-6 py-4 flex items-center gap-3">
          <ShieldCheckIcon size={20} className="text-[#3F4B5E] shrink-0" />
          <p className="font-sans font-medium text-[12px] leading-4 text-[#55647A]">
            2-step verification is required for every HQ account. Trouble signing in? Ask an HQ Admin.
          </p>
        </div>
      </Card>

      {/* 3. Bottom Legal & Compliance Footer (Figma Frame 225:168130) */}
      <footer className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[12px] font-sans font-medium text-[#7F8CA0]">
        <span>© 2026 BRUVI Coffee · HQ Admin v1.0</span>
        <span className="text-[#DCE2EA]">·</span>
        <a
          href="#privacy"
          className="font-semibold text-[#55647A] hover:text-[#0F2340] transition-colors"
        >
          Privacy
        </a>
        <a
          href="#help"
          className="font-semibold text-[#55647A] hover:text-[#0F2340] transition-colors"
        >
          Help centre
        </a>
        <span className="text-[#DCE2EA]">·</span>
        <span>Authorised BRUVI staff only · sign-ins are logged</span>
      </footer>
    </div>
  );
}
