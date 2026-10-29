"use client";

import { useAppStore } from "@/stores/use-app-store";
import { useStoresStore } from "@/stores/use-stores-store";
import { StoreIcon } from "@/components/icons";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export function StoreSwitcher() {
  const activeStoreId = useAppStore((s) => s.activeStoreId);
  const setActiveStoreId = useAppStore((s) => s.setActiveStoreId);
  const stores = useStoresStore((s) => s.stores);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStore = stores.find((s) => s.id === activeStoreId);
  const displayText =
    activeStoreId === "all" || !selectedStore
      ? `All stores · ${stores.length}`
      : selectedStore.name;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-2 rounded-[12px] border border-[#dce2ea] bg-white px-3 text-[13px] font-bold text-[#0F2340] shadow-2xs hover:bg-[#f5f7fa] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <StoreIcon className="h-4 w-4 text-[#0F2340] shrink-0" />
        <span className="truncate max-w-[130px]">{displayText}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#7F8CA0] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-1.5 w-64 rounded-xl border border-[#dce2ea] bg-white p-2 shadow-floating z-50 animate-in fade-in zoom-in-95">
          <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-[#7F8CA0] uppercase">
            Store Network Scope
          </div>
          <div className="space-y-0.5 mt-1 max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setActiveStoreId("all");
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition-colors cursor-pointer",
                activeStoreId === "all"
                  ? "bg-[#1C3A66] text-white font-bold"
                  : "text-[#0F2340] hover:bg-[#f5f7fa]"
              )}
            >
              <div>
                <div className="font-bold">All Stores · {stores.length}</div>
                <div
                  className={cn(
                    "text-[10px]",
                    activeStoreId === "all" ? "text-[#A9D8F3]" : "text-[#55647A]"
                  )}
                >
                  Global Consolidated Telemetry
                </div>
              </div>
              {activeStoreId === "all" && <Check className="h-3.5 w-3.5 text-white" />}
            </button>

            {stores.length === 0 ? (
              <div className="px-2.5 py-3 text-center text-xs text-[#55647A]">
                No stores configured yet
              </div>
            ) : (
              stores.map((store) => {
                const isSelected = store.id === activeStoreId;
                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => {
                      setActiveStoreId(store.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#1C3A66] text-white font-bold"
                        : "text-[#0F2340] hover:bg-[#f5f7fa]"
                    )}
                  >
                    <div>
                      <div className="font-bold">{store.name}</div>
                      <div
                        className={cn(
                          "text-[10px]",
                          isSelected ? "text-[#A9D8F3]" : "text-[#55647A]"
                        )}
                      >
                        {store.city} · {store.code}
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
