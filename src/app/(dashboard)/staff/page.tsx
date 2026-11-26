import type { Metadata } from "next";
import { PeopleDirectoryView } from "@/components/staff/people-directory-view";

export const metadata: Metadata = {
  title: "Staff · People · BRUVI HQ",
  description: "Workforce directory across all Bruvi stores, roles, certifications, and shift status.",
};

export default function StaffPage() {
  return <PeopleDirectoryView />;
}
