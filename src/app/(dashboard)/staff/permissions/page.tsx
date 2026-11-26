import type { Metadata } from "next";
import { PermissionsMatrixView } from "@/components/staff/permissions-matrix-view";

export const metadata: Metadata = {
  title: "Staff · Permissions · BRUVI HQ",
  description: "Capability-by-role permissions matrix with sensitive PIN flags and audit change log.",
};

export default function StaffPermissionsPage() {
  return <PermissionsMatrixView />;
}
