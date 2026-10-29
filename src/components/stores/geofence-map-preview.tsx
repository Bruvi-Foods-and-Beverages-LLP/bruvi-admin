"use client";

import * as React from "react";
import { LocationPinIcon } from "@/components/icons";
import { getStaticMapUrl } from "@/lib/maps/google-maps-client";

interface GeofenceMapPreviewProps {
  radius: number;
  onRadiusChange: (newRadius: number) => void;
  coordinates?: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
  onOpenInteractivePicker?: () => void;
}

export function GeofenceMapPreview({
  radius,
  onRadiusChange,
  coordinates,
  latitude,
  longitude,
  cityName,
  onOpenInteractivePicker,
}: GeofenceMapPreviewProps) {
  const [mapImageError, setMapImageError] = React.useState(false);
  const [mapImageLoaded, setMapImageLoaded] = React.useState(false);

  // Scale visual ring based on radius (25m = 64px, 150m = 130px)
  const ringSize = Math.round(64 + ((radius - 25) / 125) * 66);

  const hasValidCoords =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const staticMapUrl = React.useMemo(() => {
    if (!hasValidCoords) return null;
    return getStaticMapUrl({
      latitude: latitude!,
      longitude: longitude!,
      zoom: 16,
      width: 500,
      height: 220,
      scale: 2,
      includeMarker: false,
    });
  }, [hasValidCoords, latitude, longitude]);

  // Reset image load state on coordinate change
  React.useEffect(() => {
    setMapImageLoaded(false);
    setMapImageError(false);
  }, [staticMapUrl]);

  const displayCoordinates = React.useMemo(() => {
    if (coordinates) return coordinates;
    if (hasValidCoords) {
      const latStr = `${Math.abs(latitude!).toFixed(4)}° ${latitude! >= 0 ? "N" : "S"}`;
      const lngStr = `${Math.abs(longitude!).toFixed(4)}° ${longitude! >= 0 ? "E" : "W"}`;
      return `${latStr}, ${lngStr} · drag to adjust`;
    }
    return cityName
      ? `${cityName} Central Coordinates · drag to adjust`
      : "18.5481° N, 73.9030° E · drag to adjust";
  }, [coordinates, hasValidCoords, latitude, longitude, cityName]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full">
      {/* 1. Map Canvas Box (Figma: 388x160 rounded-12px bg-cream-100) */}
      <div
        onClick={onOpenInteractivePicker}
        role={onOpenInteractivePicker ? "button" : undefined}
        tabIndex={onOpenInteractivePicker ? 0 : undefined}
        onKeyDown={(e) => {
          if (onOpenInteractivePicker && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onOpenInteractivePicker();
          }
        }}
        className={`w-full sm:w-[388px] h-[160px] rounded-[12px] bg-[#f7f2e8] border border-[#dce2ea] relative overflow-hidden flex flex-col justify-between p-3 select-none shrink-0 shadow-2xs group ${
          onOpenInteractivePicker ? "cursor-pointer hover:border-[#1C3A66] transition-colors" : ""
        }`}
      >
        {/* Real Google Maps Satellite/Roadmap Background Tile (if coordinates available) */}
        {staticMapUrl && !mapImageError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staticMapUrl}
              alt="Store location map"
              onLoad={() => setMapImageLoaded(true)}
              onError={() => setMapImageError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                mapImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* Soft overlay to preserve contrast */}
            <div className="absolute inset-0 bg-[#0F2340]/10 pointer-events-none" />
          </>
        ) : null}

        {/* Fallback Vector Roads (visible when image loading or no coords) */}
        {(!staticMapUrl || !mapImageLoaded || mapImageError) && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main avenue */}
            <path
              d="M -20 50 Q 150 70 420 40"
              stroke="#dce2ea"
              strokeWidth="16"
              fill="none"
            />
            <path
              d="M -20 50 Q 150 70 420 40"
              stroke="#ffffff"
              strokeWidth="10"
              fill="none"
            />
            {/* North Main Rd */}
            <path
              d="M 120 -10 Q 140 90 260 180"
              stroke="#dce2ea"
              strokeWidth="14"
              fill="none"
            />
            <path
              d="M 120 -10 Q 140 90 260 180"
              stroke="#ffffff"
              strokeWidth="8"
              fill="none"
            />
            {/* Secondary cross lane */}
            <path
              d="M 280 -10 L 340 180"
              stroke="#dce2ea"
              strokeWidth="10"
              fill="none"
            />
            <path
              d="M 280 -10 L 340 180"
              stroke="#ffffff"
              strokeWidth="6"
              fill="none"
            />
          </svg>
        )}

        {/* Geofence Ring and Exact Figma 225:87030 Location Pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Geofence boundary circle */}
          <div
            style={{ width: `${ringSize}px`, height: `${ringSize}px` }}
            className="rounded-full border-2 border-dashed border-[#1C3A66] bg-[#1C3A66]/10 flex items-center justify-center transition-all duration-150 ease-out"
          >
            {/* Exact Figma 225:87030 Solid Location Pin */}
            <div className="flex items-center justify-center -translate-y-[13px] pointer-events-none drop-shadow-sm">
              <LocationPinIcon className="w-5 h-[26px] text-[#0F2340]" />
            </div>
          </div>
        </div>

        {/* Spacer to push coordinates badge to bottom */}
        <div className="flex-1" />

        {/* Bottom Coordinates Badge (Figma: 233x24) */}
        <div className="relative z-10 self-start">
          <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-[6px] border border-[#dce2ea] text-[11px] font-semibold text-[#0F2340] shadow-2xs max-w-[360px] truncate">
            {displayCoordinates}
          </div>
        </div>
      </div>

      {/* 2. Geofence Slider Controls (Figma: 258x160) */}
      <div className="flex-1 flex flex-col justify-between py-1 h-[160px]">
        {/* Top Metric Header */}
        <div className="flex items-center justify-between">
          <span className="text-body-s font-bold text-[#0F2340]">Geofence radius</span>
          <span className="text-price-s text-[#0F2340] font-extrabold">{radius} m</span>
        </div>

        {/* Interactive Slider */}
        <div className="flex flex-col gap-1.5 my-auto">
          <input
            type="range"
            min={25}
            max={150}
            step={5}
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full h-2 bg-[#dce2ea] rounded-lg appearance-none cursor-pointer accent-[#1C3A66]"
          />
          <div className="flex items-center justify-between text-[11px] text-[#7F8CA0] font-medium">
            <span>25 m</span>
            <span>150 m</span>
          </div>
        </div>

        {/* Bottom Explanatory Caption */}
        <p className="text-caption text-[#55647A] leading-relaxed">
          App orders start brewing when a customer enters this radius.
        </p>
      </div>
    </div>
  );
}
