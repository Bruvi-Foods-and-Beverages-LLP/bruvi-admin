"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Pagination, DEFAULT_PAGE_SIZE } from "@/components/ui/pagination";
import { cn } from "@/lib/utils/cn";
import {
  WalletAdminApi,
  type Paged,
  type WalletAccountRow,
  type WalletSummary,
  type WalletTransactionRow,
  type WalletTxFilter,
} from "@/lib/api/wallet";
import { WalletAdjustModal } from "./wallet-adjust-modal";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const money = "font-display font-extrabold tnum [font-variation-settings:'wdth'_112,'wght'_800]";
const card = "rounded-[16px] border border-[#dce2ea] bg-white shadow-2xs overflow-hidden";
const TYPE_STYLE: Record<string, string> = {
  Spend: "bg-[#f5f7fa] text-[#3f4b5e]",
  "Top-up": "bg-[#e3f4ea] text-[#1f7a4d]",
  Refund: "bg-[#e4f0fa] text-[#22629e]",
  Goodwill: "bg-[#fdf0d8] text-[#9a5b00]",
  Adjustment: "bg-[#f5f7fa] text-[#3f4b5e]",
};
const FILTERS: { id: WalletTxFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "topup", label: "Top-ups" },
  { id: "spend", label: "Spends" },
  { id: "refund", label: "Refunds" },
  { id: "adjustment", label: "Adjustments" },
];

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase()}`;
}

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Global wallet management: network KPIs, recent transactions, and every wallet account. */
export function CustomersWalletView() {
  const [summary, setSummary] = React.useState<WalletSummary | null>(null);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);

  const [txFilter, setTxFilter] = React.useState<WalletTxFilter>("all");
  const [txSearch, setTxSearch] = React.useState("");
  const [txPage, setTxPage] = React.useState(1);
  const [txSize, setTxSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [tx, setTx] = React.useState<Paged<WalletTransactionRow> | null>(null);
  const [txError, setTxError] = React.useState<string | null>(null);

  const [acctSearch, setAcctSearch] = React.useState("");
  const [acctPage, setAcctPage] = React.useState(1);
  const [acctSize, setAcctSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [accts, setAccts] = React.useState<Paged<WalletAccountRow> | null>(null);
  const [acctError, setAcctError] = React.useState<string | null>(null);

  const [adjusting, setAdjusting] = React.useState<WalletAccountRow | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  const dTx = useDebounced(txSearch);
  const dAcct = useDebounced(acctSearch);
  const message = (e: unknown) => (e instanceof Error ? e.message : "Request failed");

  React.useEffect(() => {
    WalletAdminApi.getSummary().then((s) => { setSummary(s); setSummaryError(null); }).catch((e) => setSummaryError(message(e)));
  }, [reloadKey]);

  React.useEffect(() => {
    WalletAdminApi.getTransactions({ q: dTx, type: txFilter, page: txPage, limit: txSize })
      .then((r) => { setTx(r); setTxError(null); })
      .catch((e) => setTxError(message(e)));
  }, [dTx, txFilter, txPage, txSize, reloadKey]);

  React.useEffect(() => {
    WalletAdminApi.getAccounts({ q: dAcct, page: acctPage, limit: acctSize })
      .then((r) => { setAccts(r); setAcctError(null); })
      .catch((e) => setAcctError(message(e)));
  }, [dAcct, acctPage, acctSize, reloadKey]);

  const l = summary?.last30Days;
  const kpis = [
    { label: "Wallet balance held", value: summary ? inr(summary.totalBalance) : "—", sub: summary ? `${summary.accountsCount} wallet${summary.accountsCount === 1 ? "" : "s"}` : "", big: true },
    { label: "Funded wallets", value: summary ? String(summary.fundedAccounts) : "—", sub: summary ? `Avg ${inr(summary.averageBalance)}${summary.nearLimitCount ? ` · ${summary.nearLimitCount} near limit` : ""}` : "" },
    { label: "Loaded · 30 days", value: l ? inr(l.loaded) : "—", sub: l ? `${l.loadedCount} top-up${l.loadedCount === 1 ? "" : "s"}` : "", green: true },
    { label: "Spent · 30 days", value: l ? inr(l.spent) : "—", sub: l ? `${l.spentCount} order${l.spentCount === 1 ? "" : "s"} · ${inr(l.refunded)} refunded` : "" },
  ];

  const searchBox = (value: string, onChange: (v: string) => void, placeholder: string) => (
    <div className="relative w-[280px] max-w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#55647a]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-3 rounded-[12px] bg-[#f5f7fa] font-sans text-[14px] text-[#0f2340] placeholder:text-[#7f8ca0] outline-none focus:ring-2 focus:ring-[#1c3a66]/20"
      />
    </div>
  );

  const errorBox = (msg: string) => (
    <div className="px-5 py-8 text-center font-sans text-[14px] text-[#c0352b]">{msg}</div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {summaryError && <div className={cn(card, "p-4 font-sans text-[14px] text-[#c0352b]")}>{summaryError}</div>}

      <div className={cn(card, "grid grid-cols-2 md:grid-cols-[260px_1fr_1fr_1fr] divide-x divide-[#dce2ea]")}>
        {kpis.map((k) => (
          <div key={k.label} className="p-5 flex flex-col gap-1">
            <span className="font-sans font-bold text-[14px] leading-5 text-[#3f4b5e]">{k.label}</span>
            <span className={cn(money, "text-[#0f2340]", k.big ? "text-[32px] leading-[38px]" : "text-[20px] leading-7")}>{k.value}</span>
            <span className={cn("font-sans text-[12px] leading-4", k.green ? "text-[#1f7a4d]" : "text-[#3f4b5e]")}>{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <div className={card}>
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Recent transactions</h3>
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">Every wallet movement across all customers, newest first</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {searchBox(txSearch, (v) => { setTxSearch(v); setTxPage(1); }, "Customer name, phone or email")}
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => { setTxFilter(f.id); setTxPage(1); }}
                className={cn(
                  "h-9 px-4 rounded-full border-[1.5px] font-sans font-bold text-[14px] cursor-pointer transition-colors",
                  txFilter === f.id ? "bg-[#1c3a66] border-[#1c3a66] text-white" : "bg-white border-[#bcc6d3] text-[#0f2340] hover:border-[#7f8ca0]",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[128px_minmax(0,1.1fr)_104px_minmax(0,1.4fr)_96px_96px] gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]">
          <div>When</div><div>Customer</div><div>Type</div><div>Description</div>
          <div className="text-right">Amount</div><div className="text-right">Balance</div>
        </div>

        {txError ? errorBox(txError) : !tx ? (
          <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">Loading transactions…</div>
        ) : tx.items.length === 0 ? (
          <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">No wallet transactions match.</div>
        ) : (
          <div className="flex flex-col divide-y divide-[#dce2ea]">
            {tx.items.map((r) => (
              <div key={r.id} className="grid grid-cols-[128px_minmax(0,1.1fr)_104px_minmax(0,1.4fr)_96px_96px] gap-3 px-5 py-3 items-center min-h-14">
                <div className="font-sans text-[14px] leading-5 text-[#0f2340]">{formatWhen(r.createdAt)}</div>
                <Link href={`/customers/${r.userId}`} className="flex flex-col min-w-0 hover:underline">
                  <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{r.customerName}</span>
                  <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">{r.customerCode}</span>
                </Link>
                <div>
                  <span className={cn("inline-flex items-center h-6 px-2.5 rounded-full font-sans font-bold text-[12px] leading-4", TYPE_STYLE[r.type])}>{r.type}</span>
                </div>
                <div className="font-sans text-[14px] leading-5 text-[#3f4b5e] truncate">{r.description}</div>
                <div className={cn("text-right text-[14px] leading-5", money, r.isCredit ? "text-[#1f7a4d]" : "text-[#0f2340]")}>
                  {r.isCredit ? "+" : "−"}{inr(r.amount)}
                </div>
                <div className="text-right font-sans text-[14px] leading-5 text-[#0f2340] tnum">{inr(r.balanceAfter)}</div>
              </div>
            ))}
          </div>
        )}
        {tx && tx.total > 0 && (
          <Pagination page={txPage} pageSize={txSize} total={tx.total} label="transactions" onPageChange={setTxPage} onPageSizeChange={(n) => { setTxSize(n); setTxPage(1); }} />
        )}
      </div>

      {/* Wallet accounts */}
      <div className={card}>
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="font-sans font-extrabold text-[18px] leading-[26px] text-[#0f2340]">Wallet accounts</h3>
            <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">
              Highest balance first · capped at {summary ? inr(summary.ppiLimit) : "₹10,000"} per customer (PPI)
            </span>
          </div>
          {searchBox(acctSearch, (v) => { setAcctSearch(v); setAcctPage(1); }, "Name, phone or CUST ID")}
        </div>

        <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_110px_110px_140px_88px] gap-3 h-9 px-5 items-center bg-[#f5f7fa] border-y border-[#dce2ea] font-sans font-bold text-[12px] leading-4 uppercase tracking-[0.48px] text-[#3f4b5e]">
          <div>Customer</div><div>Phone</div><div className="text-right">Balance</div><div className="text-right">Loaded</div><div>Limit used</div><div className="text-right">Action</div>
        </div>

        {acctError ? errorBox(acctError) : !accts ? (
          <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">Loading wallets…</div>
        ) : accts.items.length === 0 ? (
          <div className="px-5 py-10 text-center font-sans text-[14px] text-[#55647a]">No wallet accounts yet.</div>
        ) : (
          <div className="flex flex-col divide-y divide-[#dce2ea]">
            {accts.items.map((a) => (
              <div key={a.userId} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_110px_110px_140px_88px] gap-3 px-5 py-3 items-center min-h-14">
                <Link href={`/customers/${a.userId}`} className="flex flex-col min-w-0 hover:underline">
                  <span className="font-sans font-bold text-[14px] leading-5 text-[#0f2340] truncate">{a.name}</span>
                  <span className="font-sans text-[12px] leading-4 text-[#3f4b5e]">{a.code}</span>
                </Link>
                <div className="font-sans text-[14px] leading-5 text-[#3f4b5e] truncate">{a.phone || "—"}</div>
                <div className={cn("text-right text-[14px] leading-5 text-[#0f2340]", money)}>{inr(a.balance)}</div>
                <div className="text-right font-sans text-[14px] leading-5 text-[#0f2340] tnum">{inr(a.loadedLifetime)}</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#ebeff4] overflow-hidden">
                    <div className={cn("h-full rounded-full", a.limitUsedPercent >= 80 ? "bg-[#c0352b]" : "bg-[#1c3a66]")} style={{ width: `${a.limitUsedPercent}%` }} />
                  </div>
                  <span className="font-sans text-[12px] leading-4 text-[#3f4b5e] tnum w-8 text-right">{a.limitUsedPercent}%</span>
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setAdjusting(a)} className="h-8 px-3 rounded-[8px] border border-[#bcc6d3] font-sans font-bold text-[12px] text-[#0f2340] hover:bg-[#f5f7fa] cursor-pointer">
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {accts && accts.total > 0 && (
          <Pagination page={acctPage} pageSize={acctSize} total={accts.total} label="wallets" onPageChange={setAcctPage} onPageSizeChange={(n) => { setAcctSize(n); setAcctPage(1); }} />
        )}
      </div>

      <WalletAdjustModal
        account={adjusting ? { userId: adjusting.userId, name: adjusting.name, code: adjusting.code, balance: adjusting.balance } : null}
        onClose={() => setAdjusting(null)}
        onDone={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
