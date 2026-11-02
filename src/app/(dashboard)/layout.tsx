import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandMenu } from "@/components/layout/command-menu";
import { OfflineBanner } from "@/components/feedback/offline-banner";
import { SessionTimeoutModal } from "@/components/feedback/session-timeout-modal";
import { AuthGuard } from "@/components/auth/auth-guard";
import { RouteRbacGuard } from "@/components/auth/route-rbac-guard";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden bg-bg-subtle text-text">
        {/* Collapsible Enterprise Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Sticky Offline Banner (AS06) */}
          <OfflineBanner />

          {/* Persistent Enterprise Topbar */}
          <Topbar />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <RouteRbacGuard>{children}</RouteRbacGuard>
          </main>
        </div>

        {/* Global Command Menu (⌘K) */}
        <CommandMenu />

        {/* Session Re-auth Modal with Form Preservation (AS05) */}
        <SessionTimeoutModal />
      </div>
    </AuthGuard>
  );
}

