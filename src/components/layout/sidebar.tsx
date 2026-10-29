"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BruviIcon,
  WordmarkIcon,
} from "@/components/icons";
import {
  DASHBOARD_ITEM,
  SIDEBAR_NAV_SECTIONS,
  type SidebarNavItem,
} from "@/config/sidebar-navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useAppStore } from "@/stores/use-app-store";
import { cn } from "@/lib/utils/cn";
import { LogOut, ShieldCheck, ChevronRight, X } from "lucide-react";

/**
 * Helper to compute user initials (e.g. "Kavya R" -> "KR")
 */
function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "HQ";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const isSidebarCollapsed = useAppStore((s) => s.isSidebarCollapsed);
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);

  // Profile popover dropdown state
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click or Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dynamic user data
  const displayName = user?.fullName || "Kavya R.";
  const displayRole = user?.adminProfile?.designation || user?.role || "Ops Director";
  const userInitials = getInitials(displayName);

  // Check active state
  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Nav Item component - unified across all sidebar items
  const renderNavItem = (item: SidebarNavItem) => {
    const active = isItemActive(item.href);

    // Dynamic RBAC gating
    if (item.requiredCapability && !hasPermission(item.requiredCapability)) {
      return null;
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          // Auto close drawer on mobile viewports
          if (window.innerWidth < 1024) {
            setSidebarCollapsed(true);
          }
        }}
        className={cn(
          "w-full h-8 px-3 rounded-[12px] flex items-center gap-3 select-none transition-all duration-150 group",
          active
            ? "bg-white/[0.08] text-white"
            : "text-[#CDE9F9] hover:bg-white/[0.08] hover:text-white"
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center transition-colors shrink-0",
            active ? "text-[#A9D8F3]" : "text-[#9FB6D6] group-hover:text-[#A9D8F3]"
          )}
        >
          <BruviIcon name={item.iconName} size={20} />
        </span>
        <span
          className={cn(
            "text-[14px] leading-5 truncate font-sans",
            active ? "font-bold text-white" : "font-semibold text-[#CDE9F9] group-hover:text-white"
          )}
        >
          {item.title}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isSidebarCollapsed && (
        <div
          onClick={() => setSidebarCollapsed(true)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell (Figma Node 225:193303: 240px width, #1C3A66 background, 20px 12px padding) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-[240px] h-full bg-[#1C3A66] py-5 px-3 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shrink-0 select-none overflow-hidden",
          isSidebarCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Top Brand Lockup (Figma Frame 225:193209) */}
        <div className="flex items-center justify-between px-3 pb-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Bruvi Wordmark Vector (99x24 in Figma) */}
            <div className="text-white flex items-center">
              <WordmarkIcon width={99} height={24} color="#FFFFFF" />
            </div>

            {/* HQ Pill Tag (34x20 rounded-4px, #A9D8F3 fill, #0F2340 text) */}
            <div className="w-[34px] h-[20px] rounded-[4px] bg-[#A9D8F3] flex items-center justify-center shrink-0">
              <span className="font-sans font-extrabold text-[11px] leading-[14px] text-[#0F2340] tracking-wider">
                HQ
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="lg:hidden p-1 text-[#9FB6D6] hover:text-white rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area (gap: 4px between frames) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1 pr-0.5 custom-scrollbar">
          {/* 1. Standalone Dashboard Item with 20% extra vertical breathing space around it */}
          <div className="my-1.5 shrink-0">
            {renderNavItem(DASHBOARD_ITEM)}
          </div>

          {/* 2. Standard 5 Navigation Sections */}
          {SIDEBAR_NAV_SECTIONS.map((section) => {
            // Check if section has at least one visible item based on RBAC permissions
            const hasVisibleItems = section.items.some(
              (item) => !item.requiredCapability || hasPermission(item.requiredCapability)
            );
            if (!hasVisibleItems) return null;

            return (
              <div key={section.title} className="flex flex-col gap-1">
                {/* Section Overline (Figma: Libre Caslon Text Regular 11px, #9FB6D6, uppercase, 1.54px letter spacing) */}
                <div className="h-[26px] px-3 flex items-end pb-1 shrink-0">
                  <span className="font-serif font-normal text-[11px] leading-[14px] text-[#9FB6D6] uppercase tracking-[0.14em]">
                    {section.title}
                  </span>
                </div>

                {/* Section Items */}
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => renderNavItem(item))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spacer before profile card */}
        <div className="h-3 shrink-0" />

        {/* Bottom Profile Info Card (Figma Node 225:193237: 216x60px, rounded-12px, #FFFFFF 8% fill, 12px padding) */}
        <div className="relative shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full h-[60px] rounded-[12px] bg-white/[0.08] p-3 flex items-center gap-3 cursor-pointer hover:bg-white/[0.12] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#A9D8F3]/50"
            aria-expanded={isProfileOpen}
            aria-label="Staff profile menu"
          >
            {/* Avatar Circle (36x36, rounded-18px, #A9D8F3 fill, #0F2340 initials) */}
            <div className="w-9 h-9 min-w-9 min-h-9 rounded-full bg-[#A9D8F3] text-[#0F2340] flex items-center justify-center font-sans font-extrabold text-[14px] leading-5 shrink-0 shadow-xs">
              {userInitials}
            </div>

            {/* Dynamic Staff Information */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-sans font-bold text-[14px] leading-5 text-white truncate">
                {displayName}
              </span>
              <span className="font-sans font-medium text-[12px] leading-4 text-[#9FB6D6] truncate">
                {displayRole}
              </span>
            </div>

            <ChevronRight
              className={cn(
                "w-4 h-4 text-[#9FB6D6] shrink-0 transition-transform duration-200",
                isProfileOpen && "-rotate-90"
              )}
            />
          </button>

          {/* Interactive Profile & Sign Out Popover */}
          {isProfileOpen && (
            <div className="absolute bottom-[68px] left-0 right-0 z-50 rounded-xl bg-white border border-[#DCE2EA] shadow-xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-[#EBEFF4]">
                <div className="w-8 h-8 rounded-full bg-[#1C3A66] text-[#A9D8F3] flex items-center justify-center font-sans font-bold text-xs shrink-0">
                  {userInitials}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#0F2340] truncate">{displayName}</span>
                  <span className="text-[11px] text-[#64738A] truncate">{user?.email || "admin@bruvi.coffee"}</span>
                </div>
              </div>

              <div className="space-y-1 mb-2.5 text-[11px] text-[#55647A]">
                <div className="flex items-center justify-between">
                  <span>Scope:</span>
                  <span className="font-semibold text-[#0F2340]">All 12 Outlets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Role:</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F5FD] text-[#1C3A66]">
                    {user?.role || "SUPER_ADMIN"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Authenticated Session</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setIsProfileOpen(false);
                  await logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out from HQ Admin</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
