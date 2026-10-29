"use client";

import { PhinIcon } from "@/components/icons";
import { ShieldCheck, Store, Navigation, Scale } from "lucide-react";

export function AuthHeroBanner() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 xl:p-16 bg-navy-900 text-white overflow-hidden select-none">
      {/* Ambient Radial Highlights */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-navy-800/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-navy-600/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header: Brand Wordmark */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10 shadow-md">
            <PhinIcon size={24} color="#FFFFFF" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-white">
              BRUVI COFFEE
            </span>
            <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-widest font-mono">
              HQ Operations & ERP
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sky-100 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">System Status: Operational</span>
        </div>
      </div>

      {/* Center Body: Editorial Manifesto & Live Telemetry Tickers */}
      <div className="relative z-10 my-auto py-12 space-y-8 max-w-xl">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-sky-500/10 border border-sky-400/20 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <span>High-Altitude Da Lat Beans · Hyper-Local Fleet</span>
          </div>

          <h2 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-white leading-tight">
            Coffee Craft Engineered with Precision.
          </h2>

          <p className="text-sm xl:text-base text-gray-300 leading-relaxed font-sans">
            Centralized operations engine coordinating 12 physical roastery outlets, real-time barista kitchen queues, sub-gram recipe formulations, and our dedicated 34-rider delivery fleet.
          </p>
        </div>

        {/* Live Operational Metrics Showcase */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sky-300 text-xs mb-1">
              <Store className="h-3.5 w-3.5" />
              <span className="font-semibold">Outlets</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tracking-tight">
              12 / 12
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">100% Active Uptime</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sky-300 text-xs mb-1">
              <Navigation className="h-3.5 w-3.5" />
              <span className="font-semibold">Fleet GIS</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tracking-tight">
              34
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Riders On Duty</div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sky-300 text-xs mb-1">
              <Scale className="h-3.5 w-3.5" />
              <span className="font-semibold">BOM Ledger</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tracking-tight">
              0.01g
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Milligram Precision</div>
          </div>
        </div>

        {/* Craft Philosophy Quote */}
        <div className="border-l-2 border-sky-400/50 pl-4 py-1 italic text-xs text-sky-200/80 font-serif">
          &ldquo;Every harvest sourced directly from farmers, roasted to peak profile, and dispatched across Bengaluru & Mumbai with zero compromise.&rdquo;
        </div>
      </div>

      {/* Bottom Footer: Governance & Compliance */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-[11px] text-gray-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Google Workspace SSO · TOTP 2FA Protected</span>
        </div>
        <span className="font-mono text-[10px] text-gray-500">
          Bruvi HQ Platform v1.0.0
        </span>
      </div>
    </div>
  );
}
