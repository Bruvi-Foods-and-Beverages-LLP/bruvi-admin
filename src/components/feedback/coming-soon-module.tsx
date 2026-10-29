"use client";

import Link from "next/link";
import { BruviIcon, type BruviIconName } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Sparkles, ShieldCheck } from "lucide-react";

export interface ComingSoonModuleProps {
  title: string;
  category: string;
  description: string;
  iconName: BruviIconName;
  features?: string[];
  plannedRelease?: string;
}

export function ComingSoonModule({
  title,
  category,
  description,
  iconName,
  features = [
    "Enterprise Role-Based Access Control (RBAC)",
    "Sub-second real-time WebSocket synchronization",
    "Multi-outlet offline state resilience",
    "Audit-logged data mutations & telemetry",
  ],
  plannedRelease = "Q4 2026 Enterprise Release",
}: ComingSoonModuleProps) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#7F8CA0] uppercase tracking-wider mb-6">
        <Link href="/" className="hover:text-[#1C3A66] transition-colors">
          BRUVI HQ
        </Link>
        <span>/</span>
        <span>{category}</span>
        <span>/</span>
        <span className="text-[#1C3A66]">{title}</span>
      </div>

      {/* Main Module Card */}
      <div className="rounded-2xl border border-[#DCE2EA] bg-white p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Brand Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E8F5FD] to-transparent rounded-bl-full pointer-events-none opacity-60" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
          {/* Module Icon Badge */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#1C3A66] text-[#A9D8F3] shadow-md">
            <BruviIcon name={iconName} size={36} color="#A9D8F3" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-[#0F2340]">
                {title}
              </h1>
              <Badge variant="outline" className="bg-[#E8F5FD] text-[#1C3A66] border-[#A9D8F3] font-sans text-xs">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#1C3A66]" />
                Coming Soon
              </Badge>
              <Badge variant="outline" className="bg-[#F5F7FA] text-[#55647A] border-[#DCE2EA] font-sans text-xs">
                <Clock className="mr-1.5 h-3.5 w-3.5 text-[#7F8CA0]" />
                {plannedRelease}
              </Badge>
            </div>

            <p className="text-sm text-[#3F4B5E] leading-relaxed max-w-2xl">
              {description}
            </p>

            {/* Architecture Capability Highlights */}
            <div className="pt-4 border-t border-[#EBEFF4]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7F8CA0] mb-3">
                Included Core Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 rounded-lg bg-[#F5F7FA] px-3.5 py-2 text-xs font-medium text-[#0F2340]"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#1C3A66] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Return to Executive Cockpit</span>
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => alert(`Subscribed to ${title} updates.`)}
              >
                Notify Upon Deployment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

