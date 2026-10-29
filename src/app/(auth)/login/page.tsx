import { Suspense } from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to BRUVI HQ",
  description: "Secure corporate authentication portal for Bruvi Coffee Enterprise HQ",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#F5F7FA] text-[#0F2340] font-sans antialiased">
      <Suspense fallback={<div className="text-xs text-[#7F8CA0]">Loading corporate authentication...</div>}>
        <SignInCard />
      </Suspense>
    </main>
  );
}
