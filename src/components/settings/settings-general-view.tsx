"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleTile } from "@/components/ui/switch";
import { BruviIcon } from "@/components/icons";
import {
  UI_SCALE_PX,
  useAdminPreferencesStore,
  type TableDensity,
  type UiScalePreset,
} from "@/stores/use-admin-preferences-store";
import { cn } from "@/lib/utils/cn";

const SCALE_OPTIONS: Array<{ value: UiScalePreset; label: string; hint: string }> = [
  { value: "90", label: "90%", hint: "14px" },
  { value: "95", label: "95%", hint: "14.75px" },
  { value: "100", label: "100%", hint: "15.5px · Default" },
  { value: "105", label: "105%", hint: "16.25px" },
  { value: "110", label: "110%", hint: "17px" },
];

export function SettingsGeneralView() {
  const {
    uiScale,
    tableDensity,
    sidebarCollapsedByDefault,
    showCommandHints,
    dateFormat,
    numberFormat,
    setUiScale,
    setTableDensity,
    setSidebarCollapsedByDefault,
    setShowCommandHints,
    setDateFormat,
    setNumberFormat,
    resetPreferences,
  } = useAdminPreferencesStore();

  const [companyName, setCompanyName] = React.useState("BRUVI Coffee Pvt Ltd");
  const [address, setAddress] = React.useState(
    "42, 3rd Floor, Residency Rd, Bengaluru 560025"
  );
  const [gstin, setGstin] = React.useState("29ABCDE1234F1Z5 · Karnataka");
  const [supportEmail, setSupportEmail] = React.useState("hello@bruvi.coffee");
  const [supportPhone, setSupportPhone] = React.useState("+91 80 4718 2200");
  const [currency, setCurrency] = React.useState("INR (₹)");
  const [timezone, setTimezone] = React.useState("IST (UTC+5:30)");

  const [autoAcceptOrders, setAutoAcceptOrders] = React.useState(true);
  const [maxPrepAlertMin, setMaxPrepAlertMin] = React.useState("10");
  const [prefixes, setPrefixes] = React.useState({
    app: "A-",
    counter: "C-",
    kiosk: "K-",
    qr: "Q-",
  });

  const [monSatHours, setMonSatHours] = React.useState("6:30 am – 11:00 pm");
  const [sundayHours, setSundayHours] = React.useState("7:00 am – 11:00 pm");
  const [savedNotice, setSavedNotice] = React.useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2600);
  };

  return (
    <SettingsShell
      active="general"
      overline="SETTINGS · WORKSPACE"
      title="General"
      actions={
        <>
          {savedNotice && (
            <Badge variant="success" className="gap-1.5">
              <BruviIcon name="check" size={14} />
              Changes saved
            </Badge>
          )}
          <Button variant="workspace" onClick={handleSave}>
            Save changes
          </Button>
        </>
      }
    >
      {/* Admin Portal Display & Customization (Live Root Scaling) */}
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-h2 text-text">Admin display &amp; scaling</h2>
              <Badge variant="brand">Live preview</Badge>
            </div>
            <p className="text-body-s text-text-secondary mt-0.5">
              Adjust root UI scale ({UI_SCALE_PX[uiScale]}px base), table row density, and workspace defaults for this browser.
            </p>
          </div>
          <Button variant="outline" size="compact" onClick={resetPreferences}>
            Reset defaults
          </Button>
        </div>

        {/* UI Root Scale */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-label text-text">Interface scaling</span>
            <span className="text-caption text-text-muted tnum">
              Root font-size: {UI_SCALE_PX[uiScale]}px
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SCALE_OPTIONS.map((opt) => {
              const selected = uiScale === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUiScale(opt.value)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer",
                    selected
                      ? "border-primary bg-surface-brand text-text"
                      : "border-border bg-surface hover:bg-bg-subtle text-text-secondary"
                  )}
                >
                  <span className="text-label font-semibold tnum">{opt.label}</span>
                  <span className="text-caption text-text-muted tnum">{opt.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Density & Formatting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label text-text">Table density</label>
            <div className="grid grid-cols-2 gap-2">
              {(["comfortable", "compact"] as TableDensity[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTableDensity(mode)}
                  className={cn(
                    "h-10 rounded-xl border text-body-s font-medium capitalize transition-colors cursor-pointer",
                    tableDensity === mode
                      ? "border-primary bg-surface-brand text-text"
                      : "border-border-input bg-surface text-text-secondary hover:bg-bg-subtle"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pref-date-format" className="text-label text-text">
              Date format
            </label>
            <select
              id="pref-date-format"
              value={dateFormat}
              onChange={(e) =>
                setDateFormat(
                  e.target.value as "DD MMM YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY"
                )
              }
              className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            >
              <option value="DD MMM YYYY">DD MMM YYYY (02 Oct 2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-02)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/02/2026)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pref-number-format" className="text-label text-text">
              Number format
            </label>
            <select
              id="pref-number-format"
              value={numberFormat}
              onChange={(e) =>
                setNumberFormat(e.target.value as "en-IN" | "en-US")
              }
              className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            >
              <option value="en-IN">Indian · Lakh (4,18,600)</option>
              <option value="en-US">International · Million (418,600)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ToggleTile
            label="Collapse sidebar by default"
            hint="Start new sessions with the compact icon-only navigation rail."
            checked={sidebarCollapsedByDefault}
            onCheckedChange={setSidebarCollapsedByDefault}
          />
          <ToggleTile
            label="Show keyboard shortcut hints"
            hint="Display ⌘K and quick-action badges in topbar and menus."
            checked={showCommandHints}
            onCheckedChange={setShowCommandHints}
          />
        </div>
      </Card>

      {/* Company Profile */}
      <Card className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-h2 text-text">Company profile</h2>
          <p className="text-body-s text-text-secondary mt-0.5">
            Legal entity, registered office, and regional defaults printed on tax invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-name" className="text-label text-text">
              Legal entity name
            </label>
            <input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-gstin" className="text-label text-text">
              GSTIN &amp; registration state
            </label>
            <input
              id="company-gstin"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="company-address" className="text-label text-text">
              Registered office address
            </label>
            <input
              id="company-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="support-email" className="text-label text-text">
              Support email
            </label>
            <input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="support-phone" className="text-label text-text">
              Support phone
            </label>
            <input
              id="support-phone"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="currency" className="text-label text-text">
              Base currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            >
              <option value="INR (₹)">INR (₹) · Indian Rupee</option>
              <option value="USD ($)">USD ($) · US Dollar</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="timezone" className="text-label text-text">
              Primary timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="h-10 rounded-xl border border-border-input bg-surface px-3 text-body-s text-text focus:outline-none focus:ring-2 focus:ring-focus/40"
            >
              <option value="IST (UTC+5:30)">IST (UTC+5:30) · Asia/Kolkata</option>
              <option value="UTC (UTC+0:00)">UTC (UTC+0:00)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Order Settings & Business Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-h2 text-text">Order settings</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Channel ticket prefixes and Kitchen Display SLA thresholds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                { key: "app", label: "App" },
                { key: "counter", label: "Counter" },
                { key: "kiosk", label: "Kiosk" },
                { key: "qr", label: "QR" },
              ] as const
            ).map((ch) => (
              <div key={ch.key} className="flex flex-col gap-1">
                <label className="text-caption text-text-muted">{ch.label}</label>
                <input
                  value={prefixes[ch.key]}
                  onChange={(e) =>
                    setPrefixes((prev) => ({ ...prev, [ch.key]: e.target.value }))
                  }
                  className="h-9 rounded-xl border border-border-input bg-surface px-3 text-body-s font-semibold text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
                />
              </div>
            ))}
          </div>

          <ToggleTile
            label="Auto-accept app orders"
            hint="Send paid mobile orders directly to KDS without manual cashier tap."
            checked={autoAcceptOrders}
            onCheckedChange={setAutoAcceptOrders}
          />

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-subtle px-4 py-3">
            <div className="flex flex-col">
              <span className="text-label text-text">Max prep time alert</span>
              <span className="text-caption text-text-muted">
                Highlight ticket in amber on KDS after threshold
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={2}
                max={45}
                value={maxPrepAlertMin}
                onChange={(e) => setMaxPrepAlertMin(e.target.value)}
                className="w-16 h-9 rounded-xl border border-border-input bg-surface px-2.5 text-right text-body-s font-semibold text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
              />
              <span className="text-body-s text-text-secondary">min</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-h2 text-text">Default business hours</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Applied to newly onboarded outlets unless overridden per store.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hours-monsat" className="text-label text-text">
                Monday – Saturday
              </label>
              <input
                id="hours-monsat"
                value={monSatHours}
                onChange={(e) => setMonSatHours(e.target.value)}
                className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="hours-sun" className="text-label text-text">
                Sunday
              </label>
              <input
                id="hours-sun"
                value={sundayHours}
                onChange={(e) => setSundayHours(e.target.value)}
                className="h-10 rounded-xl border border-border-input bg-surface px-3.5 text-body-s text-text tnum focus:outline-none focus:ring-2 focus:ring-focus/40"
              />
            </div>
          </div>

          <div className="mt-auto rounded-xl border border-border bg-bg-subtle px-4 py-3 text-caption text-text-secondary">
            Per-store holiday overrides and late-night delivery cutoffs can be configured inside{" "}
            <span className="font-semibold text-text">Stores › Hours</span>.
          </div>
        </Card>
      </div>
    </SettingsShell>
  );
}
