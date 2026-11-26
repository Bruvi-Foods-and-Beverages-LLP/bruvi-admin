import * as React from "react";
import type { Metadata } from "next";
import { StaffDetailView } from "@/components/staff/staff-detail-view";

export const metadata: Metadata = {
  title: "Staff Detail · BRUVI HQ",
  description: "Staff member shift progress, 2-week schedule, app & device access, and certifications.",
};

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StaffDetailView staffId={id} />;
}
