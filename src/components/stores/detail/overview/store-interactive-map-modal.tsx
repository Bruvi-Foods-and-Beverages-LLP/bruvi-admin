"use client";

import * as React from "react";
import {
  X,
  Crosshair,
  Layers,
  MapPin,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { loadGoogleMapsScript } from "@/lib/maps/google-maps-loader";

export interface StoreInteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  latitude: number;
  longitude: number;
  address: string;
  geofenceRadiusMeters?: number;
  phone?: string;
  city?: string;
}

export function StoreInteractiveMapModal({
  isOpen,
  onClose,
  storeName,
  latitude,
  longitude,
  address,
  geofenceRadiusMeters = 50,
  city,
}: StoreInteractiveMapModalProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
  const markerRef = React.useRef<google.maps.Marker | null>(null);
  const circleRef = React.useRef<google.maps.Circle | null>(null);

  const [mapType, setMapType] = React.useState<"roadmap" | "hybrid">("roadmap");
  const [isScriptLoading, setIsScriptLoading] = React.useState(true);

  const lat = typeof latitude === "number" && !isNaN(latitude) ? latitude : 12.9784;
  const lng = typeof longitude === "number" && !isNaN(longitude) ? longitude : 77.6408;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // Handle ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize or update interactive Google Map
  React.useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isSubscribed = true;

    async function initMap() {
      setIsScriptLoading(true);
      try {
        const google = await loadGoogleMapsScript();
        if (!isSubscribed || !mapContainerRef.current) return;

        const centerPos = { lat, lng };

        // Create Map Instance (Interactive, but strictly read-only / uneditable)
        const map = new google.maps.Map(mapContainerRef.current, {
          center: centerPos,
          zoom: 18,
          mapTypeId: mapType === "hybrid" ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: false,
          zoomControl: true,
          scrollwheel: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
          ],
        });
        mapInstanceRef.current = map;

        // Custom Bruvi Navy Pin Marker (Uneditable / non-draggable)
        const pinIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.26801 21.732 0 14 0ZM14 19.25C16.8995 19.25 19.25 16.8995 19.25 14C19.25 11.1005 16.8995 8.75 14 8.75C11.1005 8.75 8.75 11.1005 8.75 14C8.75 16.8995 11.1005 19.25 14 19.25Z" fill="#0F2340"/>
                <circle cx="14" cy="14" r="5" fill="#FFFFFF"/>
              </svg>
            `),
          scaledSize: new google.maps.Size(28, 36),
          anchor: new google.maps.Point(14, 36),
        };

        const marker = new google.maps.Marker({
          position: centerPos,
          map: map,
          draggable: false, // Uneditable
          animation: google.maps.Animation.DROP,
          icon: pinIcon,
          title: storeName,
        });
        markerRef.current = marker;

        // Geofence Circle Overlay
        const circle = new google.maps.Circle({
          strokeColor: "#1C3A66",
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: "#1C3A66",
          fillOpacity: 0.12,
          map: map,
          center: centerPos,
          radius: geofenceRadiusMeters,
          clickable: false,
        });
        circleRef.current = circle;
      } catch (err) {
        console.error("Interactive Google Map initialization error:", err);
      } finally {
        if (isSubscribed) {
          setIsScriptLoading(false);
        }
      }
    }

    initMap();

    return () => {
      isSubscribed = false;
      if (markerRef.current) markerRef.current.setMap(null);
      if (circleRef.current) circleRef.current.setMap(null);
      mapInstanceRef.current = null;
    };
  }, [isOpen, lat, lng, storeName, geofenceRadiusMeters, mapType]);

  // Recenter map handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng });
      mapInstanceRef.current.setZoom(18);
    }
  };

  // Switch map type handler
  const toggleMapType = () => {
    const nextType = mapType === "roadmap" ? "hybrid" : "roadmap";
    setMapType(nextType);
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setMapTypeId(
        nextType === "hybrid"
          ? window.google.maps.MapTypeId.HYBRID
          : window.google.maps.MapTypeId.ROADMAP
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-map-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-surface rounded-[24px] shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2
                id="store-map-modal-title"
                className="text-title text-text font-bold tracking-tight"
              >
                {storeName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-brand text-primary text-[11px] font-bold">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Geofence</span>
              </span>
            </div>
            <p className="text-caption text-text-muted">
              {lat.toFixed(5)}° N, {lng.toFixed(5)}° E · {geofenceRadiusMeters} m order dispatch perimeter
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close interactive map"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Interactive Map Area */}
        <div className="relative h-[480px] w-full bg-[#f4f2ec] overflow-hidden">
          {/* Map DOM Element */}
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Loading Indicator */}
          {isScriptLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs z-20">
              <Loader2 className="h-7 w-7 text-primary animate-spin mb-2" />
              <span className="text-body-s font-medium text-text">
                Initializing satellite & street telemetry...
              </span>
            </div>
          )}

          {/* Interactive Floating Control Bar (Top Right) */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Layer Toggle (Roadmap vs Satellite) */}
            <button
              type="button"
              onClick={toggleMapType}
              title={`Switch to ${mapType === "roadmap" ? "Satellite" : "Roadmap"} view`}
              className="flex items-center gap-1.5 h-9 px-3 rounded-[12px] bg-white/95 backdrop-blur-xs text-body-s font-semibold text-text border border-border shadow-md hover:bg-white transition-all cursor-pointer"
            >
              <Layers className="h-4 w-4 text-primary" />
              <span>{mapType === "roadmap" ? "Satellite" : "Roadmap"}</span>
            </button>

            {/* Recenter Button */}
            <button
              type="button"
              onClick={handleRecenter}
              title="Recenter on store pinpoint"
              className="flex items-center justify-center h-9 w-9 rounded-[12px] bg-white/95 backdrop-blur-xs text-text border border-border shadow-md hover:bg-white hover:text-primary transition-all cursor-pointer"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          </div>

          {/* Geofence Info Legend (Bottom Left) */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-white/95 backdrop-blur-xs text-[11px] font-medium text-text border border-border shadow-md z-10 pointer-events-none">
            <span className="h-2.5 w-2.5 rounded-full bg-primary/40 border border-primary shrink-0" />
            <span>{geofenceRadiusMeters} m Geofence Perimeter</span>
          </div>
        </div>

        {/* Footer Details & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-border bg-surface">
          <div className="flex items-start gap-2.5 max-w-[560px]">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-caption text-text-muted">Confirmed Store Address</span>
              <p className="text-body-s text-text font-normal leading-snug">
                {address || `${city || "Bengaluru"}, Karnataka, India`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-10 px-4 rounded-[12px] border border-border bg-surface text-label text-text hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-[12px] bg-primary hover:bg-navy-900 text-label text-white transition-all cursor-pointer shadow-2xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

