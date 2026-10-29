import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Navigation,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PhinIcon, BeanIcon, LeafIcon } from "@/components/icons";
import Link from "next/link";
import { formatINR } from "@/lib/utils/formatters";

export default function ExecutiveCockpitPage() {
  const stats = [
    {
      title: "Today's Gross Revenue",
      value: formatINR(482590, { hideDecimals: true }),
      change: "+14.8% vs last Wednesday",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      badge: "Nationwide",
    },
    {
      title: "Live Active Orders",
      value: "148",
      change: "Counter: 52 · App: 74 · Kiosk: 22",
      trend: "neutral",
      icon: ShoppingBag,
      color: "text-brand-navy",
      badge: "Realtime",
    },
    {
      title: "Active Outlets",
      value: "12 / 12",
      change: "100% operational uptime",
      trend: "up",
      icon: Store,
      color: "text-emerald-600",
      badge: "Healthy",
    },
    {
      title: "Fleet SLA Compliance",
      value: "96.4%",
      change: "34 riders on duty · Avg dispatch 8.2m",
      trend: "up",
      icon: Navigation,
      color: "text-brand-navy",
      badge: "Target: 95%",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Operational Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-brand-navy">
              Executive Command Center
            </h1>
            <Badge variant="success" className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Live Operations</span>
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time telemetry across 12 outlets, central roasteries, and delivery fleet · Synchronized with NestJS v12
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Orders Queue</span>
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dispatch">
              <Navigation className="mr-2 h-4 w-4" />
              <span>Live Fleet GIS</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:border-brand-navy/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-text-muted">
                  {stat.title}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {stat.badge}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text tracking-tight flex items-center justify-between">
                  <span>{stat.value}</span>
                  <div className="p-2 rounded-lg bg-bg-subtle text-brand-navy">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Core Domain Operations Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Operations & Menu */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-navy font-serif tracking-wider uppercase">
                Pillar 1
              </span>
              <Badge variant="default" className="text-[10px]">4 Domains</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2 flex items-center space-x-2">
              <PhinIcon size={18} />
              <span>Operations & Menu</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Omnichannel order routing, KDS make-timers, menu availability, and sub-gram BOM recipe formulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <Link
              href="/orders"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Omnichannel Orders Stream</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/catalog"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Product Catalog & Modifiers</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/recipes"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>BOM Recipe Yields & COGS</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
          </CardContent>
        </Card>

        {/* Supply & Logistics */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-navy font-serif tracking-wider uppercase">
                Pillar 2
              </span>
              <Badge variant="brand" className="text-[10px]">3 Domains</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2 flex items-center space-x-2">
              <BeanIcon size={18} />
              <span>Supply & Logistics</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Live milligram store inventory balances, warehouse GRN receiving, and PostGIS live rider dispatch GIS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <Link
              href="/dispatch"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Live Dispatch Command (34 Riders)</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/inventory"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Store Inventory & Wastage Logs</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/warehouse"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Central Warehouse POs & GRN</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
          </CardContent>
        </Card>

        {/* Growth, BI & Governance */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-navy font-serif tracking-wider uppercase">
                Pillar 3
              </span>
              <Badge variant="warning" className="text-[10px]">11 Domains</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-2 flex items-center space-x-2">
              <LeafIcon size={18} />
              <span>Growth & Governance</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Customer 360 wallet ledger, GSTR-1/3B tax compliance, Bruvi Lab drops, and granular RBAC matrix.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <Link
              href="/finance"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Finance & GST Tax Filing</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/lab"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Bruvi Lab Innovation (Batch 08)</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <Link
              href="/settings"
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-subtle hover:bg-white transition-colors text-xs font-semibold"
            >
              <span>Audit Logs & RBAC Matrix</span>
              <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Security & Resilience Verification Card */}
      <Card className="bg-brand-navy text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-brand-sky" />
                <h3 className="font-bold text-base">Enterprise System Hardened</h3>
              </div>
              <p className="text-xs text-text-inverse-muted max-w-xl">
                Next.js 16 App Router · Tailwind CSS v4 CSS-First Architecture · Strict CSP Nonces · Zero Client Token Leakage · AS05 Form Preservation Active
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>BFF Gateway Online</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-brand-sky" />
                <span>IST (Asia/Kolkata)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

