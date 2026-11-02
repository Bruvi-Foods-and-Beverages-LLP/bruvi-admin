import { Suspense } from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { WordmarkIcon } from "@/components/icons";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in to BRUVI HQ",
  description: "Secure corporate authentication portal for Bruvi Coffee Enterprise HQ",
};

function LoginLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="text-[#1C3A66]">
            <WordmarkIcon width={132} height={32} />
          </div>
          <div className="bg-[#1C3A66] text-white text-[11px] font-bold font-sans px-2 py-0.5 rounded-[4px] tracking-wider uppercase leading-snug">
            HQ
          </div>
        </div>
        <span className="font-serif text-[11px] tracking-[0.2em] uppercase text-[#7F8CA0] select-none">
          Brew | Vibe | Repeat
        </span>
      </div>

      <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0px_8px_24px_0px_rgba(15,35,64,0.12),0px_24px_64px_0px_rgba(15,35,64,0.16)] p-8 flex flex-col items-center justify-center min-h-[420px] gap-4">
        <Loader2 className="w-8 h-8 text-[#1C3A66] animate-spin" />
        <p className="text-sm font-sans font-semibold text-[#1C3A66]">
          Loading corporate authentication...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#F5F7FA] text-[#0F2340] font-sans antialiased">
      <Suspense fallback={<LoginLoadingSkeleton />}>
        <SignInCard />
      </Suspense>
    </main>
  );
}
