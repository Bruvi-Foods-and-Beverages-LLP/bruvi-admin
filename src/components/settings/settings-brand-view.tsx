"use client";

import * as React from "react";
import { SettingsShell } from "@/components/settings/settings-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BruviIcon } from "@/components/icons";

const BRAND_SWATCHES = [
  { name: "Primary Navy", token: "--color-primary", value: "#0F2340", bgClass: "bg-primary", dark: true },
  { name: "Sky Accent", token: "--color-accent-sky", value: "#A8D5EE", bgClass: "bg-surface-brand", dark: false },
  { name: "Ice Surface", token: "--color-bg-subtle", value: "#F5F7FA", bgClass: "bg-bg-subtle", dark: false },
  { name: "Canvas Cream", token: "--color-surface", value: "#FFFFFF", bgClass: "bg-surface", dark: false },
  { name: "Espresso Ink", token: "--color-text", value: "#0F2340", bgClass: "bg-surface-inverse", dark: true },
  { name: "Matcha Success", token: "--color-success", value: "#059669", bgClass: "bg-success", dark: true },
];

export function SettingsBrandView() {
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleUploadNotice = (variant: string) => {
    setNotice(`${variant} mark replacement queued for asset pipeline`);
    window.setTimeout(() => setNotice(null), 2600);
  };

  return (
    <SettingsShell
      active="brand"
      overline="SETTINGS · WORKSPACE"
      title="Brand"
      actions={
        notice ? (
          <Badge variant="brand" className="gap-1.5">
            <BruviIcon name="check" size={14} />
            {notice}
          </Badge>
        ) : undefined
      }
    >
      {/* Logos */}
      <Card className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-h2 text-text">Logo marks</h2>
          <p className="text-body-s text-text-secondary mt-0.5">
            Primary wordmarks used across receipts, customer emails, and kiosk screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-bg-subtle p-5 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="text-label text-text">Navy on light</span>
              <Badge variant="outline">Primary</Badge>
            </div>
            <div className="h-24 rounded-xl bg-surface border border-border flex items-center justify-center">
              <span className="font-display font-black text-2xl tracking-[-0.04em] text-text">
                BRUVI
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption text-text-muted">SVG · 240 × 64 px</span>
              <Button
                variant="outline"
                size="compact"
                onClick={() => handleUploadNotice("Navy logo")}
              >
                Replace
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-inverse p-5 flex flex-col justify-between gap-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-label text-white">White on navy</span>
              <Badge variant="outline" className="border-white/25 text-white">
                Dark surface
              </Badge>
            </div>
            <div className="h-24 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center">
              <span className="font-display font-black text-2xl tracking-[-0.04em] text-white">
                BRUVI
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-caption text-white/70">SVG · 240 × 64 px</span>
              <Button
                variant="outline"
                size="compact"
                className="bg-white/10 border-white/25 text-white hover:bg-white/20"
                onClick={() => handleUploadNotice("White logo")}
              >
                Replace
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Brand Colours */}
      <Card className="p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-h2 text-text">Brand palette</h2>
            <p className="text-body-s text-text-secondary mt-0.5">
              Read-only semantic tokens synced from the BRUVI design system.
            </p>
          </div>
          <Badge variant="outline">Synced · v3</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BRAND_SWATCHES.map((swatch) => (
            <div
              key={swatch.name}
              className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col"
            >
              <div className={`h-16 w-full border-b border-border ${swatch.bgClass}`} />
              <div className="p-3 flex flex-col gap-0.5">
                <span className="text-label text-text truncate">{swatch.name}</span>
                <span className="text-caption text-text-muted tnum">{swatch.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-h2 text-text">Typography</h2>
          <p className="text-body-s text-text-secondary mt-0.5">
            Type scale pairing Archivo Black for headings, Manrope for UI, and Libre Caslon for overlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-bg-subtle p-4 flex flex-col gap-2">
            <span className="text-caption text-text-muted">Display</span>
            <span className="font-display font-black text-2xl text-text tracking-[-0.03em]">
              Archivo Black
            </span>
            <span className="text-caption text-text-secondary">
              Page headers, KPI figures, hero marks
            </span>
          </div>

          <div className="rounded-xl border border-border bg-bg-subtle p-4 flex flex-col gap-2">
            <span className="text-caption text-text-muted">Interface &amp; Body</span>
            <span className="font-sans font-semibold text-2xl text-text">
              Manrope
            </span>
            <span className="text-caption text-text-secondary">
              Tables, forms, controls, tabular numerals
            </span>
          </div>

          <div className="rounded-xl border border-border bg-bg-subtle p-4 flex flex-col gap-2">
            <span className="text-caption text-text-muted">Editorial Overline</span>
            <span className="font-serif uppercase tracking-[1.5px] text-lg text-text">
              Libre Caslon Text
            </span>
            <span className="text-caption text-text-secondary">
              Module eyebrows and editorial metadata
            </span>
          </div>
        </div>
      </Card>
    </SettingsShell>
  );
}
