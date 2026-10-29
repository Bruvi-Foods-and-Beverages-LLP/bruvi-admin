import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation, Bike } from "lucide-react";
import { LocationPinIcon } from "@/components/icons";

export default function DispatchPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-brand-navy">
              Live Fleet Dispatch GIS
            </h1>
            <Badge variant="brand" className="text-[10px]">34 Riders Online</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time GPS command center, PostGIS polygon boundary editor, and SLA dispatch intelligence (A160 – A172)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <LocationPinIcon className="mr-1.5 h-3.5 w-3.5 text-brand-navy" />
            <span>Edit Delivery Polygons</span>
          </Button>
          <Button size="sm">
            <Bike className="mr-1.5 h-3.5 w-3.5" />
            <span>Onboard Rider</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Order Dispatch Queue */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center justify-between">
              <span>Awaiting Dispatch</span>
              <Badge variant="destructive" className="text-[10px]">2 Bottlenecks</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Orders brewing or packed waiting for rider pairing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                <span>Order #B-8831</span>
                <span>Prep: 6m 12s</span>
              </div>
              <p className="text-amber-800 text-[11px]">
                At risk · Remade after counter spill · Hunting for rider (3 min)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Geospatial Map Canvas Container */}
        <Card className="lg:col-span-2 min-h-[420px] flex flex-col justify-between overflow-hidden">
          <CardHeader className="border-b border-border bg-white">
            <CardTitle className="text-sm font-bold flex items-center">
              <Navigation className="h-4 w-4 mr-2 text-brand-navy" />
              <span>Hyper-Local Geospatial Map (Bengaluru Cluster)</span>
            </CardTitle>
          </CardHeader>
          <div className="flex-1 flex flex-col items-center justify-center bg-bg-subtle p-8 text-center">
            <div className="h-14 w-14 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy mb-3">
              <LocationPinIcon className="h-7 w-7 text-brand-navy" />
            </div>
            <h4 className="font-bold text-sm text-text">MapLibre GL Geospatial Engine</h4>
            <p className="text-xs text-text-muted max-w-sm mt-1">
              Live PostGIS vector tile layer tracking 34 riders, geofenced outlet radii, and active delivery breadcrumbs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

