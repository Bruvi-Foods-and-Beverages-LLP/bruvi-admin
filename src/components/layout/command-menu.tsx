"use client";

import { useAppStore } from "@/stores/use-app-store";
import { SIDEBAR_NAV_SECTIONS, DASHBOARD_ITEM } from "@/config/sidebar-navigation";
import { BruviIcon } from "@/components/icons";
import { Search, X, CornerDownLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const isCommandMenuOpen = useAppStore((s) => s.isCommandMenuOpen);
  const setCommandMenuOpen = useAppStore((s) => s.setCommandMenuOpen);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isCommandMenuOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isCommandMenuOpen]);

  const handleClose = useCallback(() => {
    setCommandMenuOpen(false);
    setQuery("");
  }, [setCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  // Flatten and filter navigation items
  const allItems = [
    { ...DASHBOARD_ITEM, section: "Overview" },
    ...SIDEBAR_NAV_SECTIONS.flatMap((section) =>
      section.items.map((item) => ({ ...item, section: section.title }))
    ),
  ];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.section.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-text-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 16 domains, screens, or actions... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleClose();
              if (e.key === "Enter" && filteredItems.length > 0) {
                handleSelect(filteredItems[0].href);
              }
            }}
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="rounded p-1 text-text-muted hover:bg-bg-subtle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted">
              No matching modules or actions found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => {
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs text-left hover:bg-bg-subtle transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1C3A66]/10 text-[#1C3A66] group-hover:bg-[#1C3A66] group-hover:text-white transition-colors">
                        <BruviIcon name={item.iconName} size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-text">{item.title}</div>
                        <div className="text-[10px] text-text-muted">{item.section} · {item.description}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-bg-subtle px-4 py-2 text-[11px] text-text-muted flex items-center justify-between">
          <span>Navigate with arrows or type to filter</span>
          <kbd className="rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-mono shadow-xs">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
