import type { Metadata } from "next";
import { ShiftsManagementView } from "@/components/staff/shifts-management-view";

export const metadata: Metadata = {
  title: "Staff · Shift Management · BRUVI HQ",
  description: "Weekly store rota, coverage vs forecast, open shifts, and swap request approvals.",
};

export default function StaffShiftsPage() {
  return <ShiftsManagementView />;
}
