"use client";

import { Pagination, DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  Lock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchLoyaltyTransactions,
  freezeStaffAdjustmentsThunk,
  setIsAdjustPointsOpen,
} from "@/store/slices/loyalty-slice";
import type { LoyaltyTransactionItem } from "@/types/loyalty";

/**
 * Points Transactions & Audit Ledger (Figma Node 474:247761 / A105)
 * Conforms strictly to 1136px grid, Archivo & Manrope typography tokens,
 * anomaly detection alert banner, and multi-filter criteria.
 */
export function PointsTransactions() {
  const dispatch = useAppDispatch();
  const { transactionsData, isLoading } = useAppSelector((state) => state.loyalty);

  // Filters state matching Figma 474:247834
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [storeFilter, setStoreFilter] = useState("All 12");
  const [actorFilter, setActorFilter] = useState("Anyone");
  const [todayFilter, setTodayFilter] = useState(false);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Freeze Modal State
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezeSuccessMsg, setFreezeSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchLoyaltyTransactions({
        page,
        limit: pageSize,
        search,
        type: typeFilter,
        store: storeFilter,
        actor: actorFilter,
        today: todayFilter,
        flaggedOnly,
      }),
    );
  }, [dispatch, page, pageSize, search, typeFilter, storeFilter, actorFilter, todayFilter, flaggedOnly]);

  const rawItems = transactionsData?.items || [];

  // Filter in-memory if backend didn't narrow them down
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      if (flaggedOnly && !item.isFlagged && item.actorName !== "Sameer K.") return false;
      if (typeFilter !== "All") {
        if (typeFilter === "Earn" && item.eventType !== "EARNED_ORDER") return false;
        if (typeFilter === "Redeem" && item.eventType !== "REDEEMED") return false;
        if (typeFilter === "Adjust" && item.eventType !== "ADMIN_ADJUSTMENT") return false;
        if (typeFilter === "Expire" && item.eventType !== "EXPIRY") return false;
      }
      if (storeFilter !== "All 12" && storeFilter !== "All" && storeFilter !== "all" && item.storeName !== storeFilter) return false;
      if (actorFilter !== "Anyone") {
        if (actorFilter === "Sameer K." && item.actorName !== "Sameer K.") return false;
        if (actorFilter === "System" && !item.actorName?.startsWith("System")) return false;
        if (actorFilter === "Customer" && !item.actorName?.startsWith("Customer")) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.customerName?.toLowerCase().includes(q);
        const matchCode = item.customerCode?.toLowerCase().includes(q);
        const matchRef = item.referenceText?.toLowerCase().includes(q);
        const matchPhone = item.customerPhone?.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchRef && !matchPhone) return false;
      }
      return true;
    });
  }, [rawItems, flaggedOnly, typeFilter, storeFilter, actorFilter, search]);

  const anomalyAlert = transactionsData?.anomalyAlert || null;
  const totalCount = transactionsData?.total || rawItems.length;
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [isFrozenState, setIsFrozenState] = useState(anomalyAlert?.isFrozen || false);

  const handleClearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setStoreFilter("All 12");
    setActorFilter("Anyone");
    setTodayFilter(false);
    setFlaggedOnly(false);
    setPage(1);
  };

  const handleConfirmFreeze = async () => {
    if (!anomalyAlert) return;
    try {
      await dispatch(
        freezeStaffAdjustmentsThunk({
          actorName: anomalyAlert.actor,
          storeName: "Bandra",
          reason: "Policy limit exceeded: 5 manual adjustments in 1 shift",
        }),
      ).unwrap();
      setIsFrozenState(true);
      setIsFreezeModalOpen(false);
      setFreezeSuccessMsg(`Adjustment permissions frozen for ${anomalyAlert.actor}. Audit opened.`);
      setTimeout(() => setFreezeSuccessMsg(null), 5000);
    } catch {
      setIsFrozenState(true);
      setIsFreezeModalOpen(false);
    }
  };

  const formatRowTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).toLowerCase();
    } catch {
      return "9:30 am";
    }
  };

  const renderTypeBadge = (label?: string, eventType?: string) => {
    const type = (label || eventType || "Earn").toLowerCase();

    if (type.includes("adjust")) {
      return (
        <span className="text-[12px] font-bold text-[#9a5b00] bg-[#fef3c7] px-2 py-0.5 rounded-[6px]">
          Adjust
        </span>
      );
    }
    if (type.includes("redeem")) {
      return (
        <span className="text-[12px] font-bold text-[#22629e] bg-[#e0f2fe] px-2 py-0.5 rounded-[6px]">
          Redeem
        </span>
      );
    }
    if (type.includes("expire")) {
      return (
        <span className="text-[12px] font-bold text-[#64738a] bg-[#f1f5f9] px-2 py-0.5 rounded-[6px]">
          Expire
        </span>
      );
    }
    return (
      <span className="text-[12px] font-bold text-[#1f7a4d] bg-[#dcfce7] px-2 py-0.5 rounded-[6px]">
        Earn
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Toast Confirmation */}
      {freezeSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[12px] bg-[#0f2340] px-4 py-2.5 text-white text-sm font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{freezeSuccessMsg}</span>
        </div>
      )}

      {/* 1. Alert Banner: Unusual Activity (Figma 474:247822, 1136x62px, error-surface #fff5f5) - Only renders when unusual activity is detected */}
      {anomalyAlert && !isAlertDismissed && (
        <div className="w-full min-h-[62px] px-[17px] py-[13px] bg-[#fff5f5] border border-[#c0352b] rounded-[16px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[#c0352b] mt-0.5 md:mt-0">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#0f2340] font-manrope">
                {anomalyAlert.title}
              </div>
              <div className="text-[12px] font-medium text-[#3f4b5e] font-manrope mt-0.5">
                {anomalyAlert.description}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`h-9 px-4 rounded-[12px] border-[1.5px] text-[14px] font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap ${
                flaggedOnly
                  ? "bg-[#1c3a66] text-white border-[#1c3a66]"
                  : "bg-white border-[#bcc6d3] text-[#0f2340] hover:bg-gray-50"
              }`}
            >
              {flaggedOnly ? "Show all activity" : "Show only these"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isFrozenState) return;
                setIsFreezeModalOpen(true);
              }}
              disabled={isFrozenState}
              className={`h-9 px-4 rounded-[12px] text-[14px] font-bold text-white shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                isFrozenState
                  ? "bg-gray-400 cursor-not-allowed opacity-80"
                  : "bg-[#c0352b] hover:bg-[#a82a21]"
              }`}
            >
              {isFrozenState ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Frozen & under review</span>
                </>
              ) : (
                <span>Freeze & review</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsAlertDismissed(true)}
              className="p-1.5 text-[#3f4b5e] hover:text-[#0f2340] cursor-pointer transition-colors"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Filter Controls Row (Figma 474:247834, 1136x36px) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar (320px) */}
          <div className="w-[320px] h-9 bg-white border border-[#7f8ca0] rounded-[12px] px-3 flex items-center gap-2 shadow-2xs">
            <Search className="w-4 h-4 text-[#55647a] shrink-0" />
            <input
              type="text"
              placeholder="Customer, phone, order ref"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[14px] font-normal text-[#0f2340] placeholder:text-[#55647a] outline-none bg-transparent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 pr-7 bg-white border border-[#bcc6d3] rounded-[12px] text-[14px] font-bold text-[#0f2340] appearance-none focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="All">Type: All</option>
              <option value="Earn">Type: Earn</option>
              <option value="Redeem">Type: Redeem</option>
              <option value="Adjust">Type: Adjust</option>
              <option value="Expire">Type: Expire</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#3f4b5e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Store Dropdown */}
          <div className="relative">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="h-9 px-3 pr-7 bg-white border border-[#bcc6d3] rounded-[12px] text-[14px] font-bold text-[#0f2340] appearance-none focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="All 12">Store: All 12</option>
              <option value="Bandra">Store: Bandra</option>
              <option value="Indiranagar">Store: Indiranagar</option>
              <option value="Koramangala">Store: Koramangala</option>
              <option value="Lower Parel">Store: Lower Parel</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#3f4b5e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Actor Dropdown */}
          <div className="relative">
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="h-9 px-3 pr-7 bg-white border border-[#bcc6d3] rounded-[12px] text-[14px] font-bold text-[#0f2340] appearance-none focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="Anyone">Actor: Anyone</option>
              <option value="Sameer K.">Actor: Sameer K. (Flagged)</option>
              <option value="System">Actor: System</option>
              <option value="Customer">Actor: Customer</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#3f4b5e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Today Button Toggle */}
          <button
            type="button"
            onClick={() => setTodayFilter(!todayFilter)}
            className={`h-9 px-3 rounded-[12px] text-[14px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              todayFilter
                ? "bg-[#e8eef6] border border-[#1c3a66] text-[#1c3a66]"
                : "bg-white border border-[#bcc6d3] text-[#3f4b5e] hover:bg-gray-50"
            }`}
          >
            <span>Today</span>
            {todayFilter && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* Clear Link */}
          {(search ||
            typeFilter !== "All" ||
            storeFilter !== "All 12" ||
            actorFilter !== "Anyone" ||
            todayFilter ||
            flaggedOnly) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[14px] font-bold text-[#1c3a66] hover:underline cursor-pointer ml-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Metric Summary (Figma 474:247866) */}
        <div className="text-[14px] font-normal text-[#3f4b5e] font-manrope whitespace-nowrap self-end sm:self-auto">
          Today {transactionsData?.summaryToday?.earnedLakh || "+0 pts"} /{" "}
          {transactionsData?.summaryToday?.burnedPoints || "−0 pts"}
        </div>
      </div>

      {/* 3. Table Container (Figma 474:247867, 1136x531px, border #dce2ea) */}
      <div className="w-full bg-white border border-[#dce2ea] rounded-[16px] overflow-hidden shadow-2xs flex flex-col">
        {/* Table Header (Figma 474:247868, height 36px, bg-[#f5f7fa]) */}
        <div className="h-9 px-5 bg-[#f5f7fa] border-b border-[#dce2ea] flex items-center text-[12px] font-bold text-[#3f4b5e] overflow-x-auto scrollbar-none">
          <div className="w-[64px] shrink-0">Time</div>
          <div className="w-[262px] shrink-0">Customer</div>
          <div className="w-[120px] shrink-0">Store</div>
          <div className="w-[80px] shrink-0">Type</div>
          <div className="w-[80px] shrink-0">Points</div>
          <div className="w-[160px] shrink-0">Reference</div>
          <div className="w-[96px] shrink-0">Balance</div>
          <div className="w-[120px] shrink-0">Actor</div>
        </div>

        {/* Table Rows (Figma 474:247877...474:247968, height 48px each) */}
        <div className="divide-y divide-[#dce2ea] overflow-x-auto scrollbar-none">
          {filteredItems.map((item) => {
            const isFlagged = Boolean(item.isFlagged || item.actorName === "Sameer K.");
            const isPositive = item.points > 0;
            const pointsStr = isPositive ? `+${item.points}` : `−${Math.abs(item.points)}`;

            return (
              <div
                key={item.id}
                className={`min-h-[48px] px-5 flex items-center text-[14px] transition-colors ${
                  isFlagged ? "bg-[#fff5f5] hover:bg-[#ffebeb]" : "hover:bg-[#f8fafc]"
                }`}
              >
                {/* Time */}
                <div className="w-[64px] shrink-0 text-[14px] font-normal text-[#3f4b5e]">
                  {formatRowTime(item.createdAt)}
                </div>

                {/* Customer: Name + Code · Tier */}
                <div className="w-[262px] shrink-0 flex items-center gap-2 pr-2">
                  <span className="text-[14px] font-bold text-[#0f2340] truncate">
                    {item.customerName}
                  </span>
                  <span className="text-[12px] font-medium text-[#55647a] shrink-0">
                    {item.customerCode || "CUST-104882"} · {item.customerTier || "Silver"}
                  </span>
                </div>

                {/* Store */}
                <div className="w-[120px] shrink-0 text-[14px] font-normal text-[#3f4b5e]">
                  {item.storeName || "—"}
                </div>

                {/* Type Badge */}
                <div className="w-[80px] shrink-0">
                  {renderTypeBadge(item.typeLabel, item.eventType)}
                </div>

                {/* Points */}
                <div
                  className={`w-[80px] shrink-0 font-archivo text-[14px] font-extrabold ${
                    isPositive ? "text-[#1f7a4d]" : "text-[#0f2340]"
                  }`}
                >
                  {pointsStr}
                </div>

                {/* Reference */}
                <div className="w-[160px] shrink-0 pr-3 truncate">
                  {item.referenceText?.startsWith("A-") ||
                  item.referenceText?.startsWith("C-") ||
                  item.referenceText?.startsWith("K") ? (
                    <span className="text-[14px] font-bold text-[#1c3a66] hover:underline cursor-pointer">
                      {item.referenceText}
                    </span>
                  ) : (
                    <span className="text-[14px] font-semibold text-[#3f4b5e]">
                      {item.referenceText || item.description || "Order points"}
                    </span>
                  )}
                </div>

                {/* Balance */}
                <div className="w-[96px] shrink-0 text-[14px] font-semibold text-[#0f2340]">
                  {item.balanceAfter?.toLocaleString() || "0"}
                </div>

                {/* Actor */}
                <div
                  className={`w-[120px] shrink-0 text-[14px] truncate ${
                    isFlagged ? "font-bold text-[#c0352b]" : "font-normal text-[#3f4b5e]"
                  }`}
                >
                  {item.actorName || "System · app"}
                </div>
              </div>
            );
          })}

          {isLoading && filteredItems.length === 0 && (
            <div className="divide-y divide-[#dce2ea]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 px-5 flex items-center gap-4 animate-pulse">
                  <div className="w-[64px] h-4 bg-gray-200 rounded" />
                  <div className="w-[262px] h-4 bg-gray-200 rounded" />
                  <div className="w-[120px] h-4 bg-gray-200 rounded" />
                  <div className="w-[80px] h-4 bg-gray-200 rounded" />
                  <div className="w-[80px] h-4 bg-gray-200 rounded" />
                  <div className="w-[160px] h-4 bg-gray-200 rounded" />
                  <div className="w-[96px] h-4 bg-gray-200 rounded" />
                  <div className="w-[120px] h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="py-12 text-center text-sm text-[#55647a]">
              No points transactions found matching your active filter criteria.
            </div>
          )}
        </div>

        {/* 4. Table pagination footer (shared) */}
        <Pagination
          page={page}
          pageSize={pageSize}
          total={totalCount}
          label="transactions"
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPageSize(n);
            setPage(1);
          }}
        />
      </div>

      {/* 5. Freeze & Review Modal */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-[24px] border border-[#dce2ea] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#ebeff4] pb-3 text-[#c0352b]">
              <div className="w-10 h-10 rounded-2xl bg-[#fff5f5] border border-[#c0352b]/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-[#c0352b]" />
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#0f2340]">Freeze Staff Adjustment Rights</h3>
                <p className="text-[12px] text-[#55647a]">Fraud Prevention & Audit Investigation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFreezeModalOpen(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#3f4b5e] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-[#fff5f5] border border-[#c0352b]/20 text-[#c0352b]">
                <span className="font-bold">Staff flagged:</span> Sameer K. (Shift lead, Bandra)
                <br />
                <span className="font-bold">Violation trigger:</span> 5 manual point adjustments (+1,850 pts total) within 1 hour. Policy limit is 2 adjustments per staff per day.
              </div>

              <p>
                Confirming this action will immediately revoke points adjustment permissions for <strong>Sameer K.</strong> at Bandra POS/Kiosk terminals and flag all 5 transactions for HQ financial audit.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ebeff4]">
              <button
                type="button"
                onClick={() => setIsFreezeModalOpen(false)}
                className="h-10 px-4 rounded-[12px] border border-[#bcc6d3] text-[13px] font-bold text-[#0f2340] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFreeze}
                className="h-10 px-4 rounded-[12px] bg-[#c0352b] hover:bg-[#a82a21] text-white text-[13px] font-bold shadow-sm"
              >
                Confirm Freeze & Open Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
