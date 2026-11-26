import type { Metadata } from "next";
import { RolesView } from "@/components/staff/roles-view";

export const metadata: Metadata = {
  title: "Staff · Roles · BRUVI HQ",
  description: "Manage store, warehouse, and HQ roles with default app access and key permissions.",
};

export default function StaffRolesPage() {
  return <RolesView />;
}
