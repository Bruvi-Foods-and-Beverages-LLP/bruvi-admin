"use client";

import * as React from "react";
import { X, Building2, CheckCircle2 } from "lucide-react";
import { LocationPinIcon } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { ParsedAddress } from "@/types/maps";
import { PlaceAutocompleteInput } from "@/components/maps/place-autocomplete-input";
import { getStaticMapUrl } from "@/lib/maps/google-maps-client";

/**
 * Standardized City Data Contract matching backend entity schema
 */
export interface CityModel {
  name: string;
  code?: string;
  state: string;
  country?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  defaultGeofenceRadiusMeters?: number;
  // Backwards compatibility alias
  cityName?: string;
}

// Deprecated alias for backwards compatibility
export type CityMetadata = CityModel;

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: CityModel) => void;
  initialCity?: string;
}

// Default center coordinate for initial static map view
const DEFAULT_MAP_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

export function AddCityModal({
  isOpen,
  onClose,
  onAddCity,
  initialCity = "",
}: AddCityModalProps) {
  const [cityName, setCityName] = React.useState(initialCity);
  const [stateName, setStateName] = React.useState("");
  const [cityCode, setCityCode] = React.useState("");
  const [coordinates, setCoordinates] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = React.useState("");
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [mapError, setMapError] = React.useState(false);
  const [pinAnimationKey, setPinAnimationKey] = React.useState(0);

  // Initialize or preset when opening modal
  React.useEffect(() => {
    if (isOpen) {
      setError("");
      setMapLoaded(false);
      setMapError(false);

      if (initialCity) {
        setCityName(initialCity);
        setCityCode(initialCity.substring(0, 3).toUpperCase());
      } else {
        setCityName("");
        setStateName("");
        setCityCode("");
        setCoordinates(null);
      }
    }
  }, [isOpen, initialCity]);

  if (!isOpen) return null;

  const handlePlaceSelect = (place: ParsedAddress) => {
    const rawCity = place.city || place.areaStreet || place.formattedAddress.split(",")[0] || "";
    const cleanCity = rawCity.replace(/District|Corporation|City/gi, "").trim();
    const finalCity = cleanCity || rawCity;

    setCityName(finalCity);
    setCityCode(finalCity.substring(0, 3).toUpperCase());

    if (place.state) {
      setStateName(place.state);
    }
    if (typeof place.latitude === "number" && typeof place.longitude === "number") {
      setCoordinates({ latitude: place.latitude, longitude: place.longitude });
      setPinAnimationKey((prev) => prev + 1);
    }
    setError("");
    setMapLoaded(false);
    setMapError(false);
  };

  const selectPresetCity = (preset: CityModel) => {
    setCityName(preset.name);
    setStateName(preset.state);
    setCityCode(preset.code || preset.name.substring(0, 3).toUpperCase());
    if (preset.latitude && preset.longitude) {
      setCoordinates({ latitude: preset.latitude, longitude: preset.longitude });
      setPinAnimationKey((prev) => prev + 1);
    }
    setError("");
    setMapLoaded(false);
    setMapError(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = cityName.trim();
    if (!trimmed) {
      setError("City name is required");
      return;
    }

    const payload: CityModel = {
      name: trimmed,
      code: cityCode || trimmed.substring(0, 3).toUpperCase(),
      state: stateName,
      country: "IN",
      timezone: "Asia/Kolkata",
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude,
      defaultGeofenceRadiusMeters: 5000,
      cityName: trimmed, // for compatibility
    };

    onAddCity(payload);
    onClose();
  };

  // Coordinates to render on the live map (selected city or default fallback)
  const mapCenterLat = coordinates?.latitude ?? DEFAULT_MAP_CENTER.lat;
  const mapCenterLng = coordinates?.longitude ?? DEFAULT_MAP_CENTER.lng;

  // Real Google Maps satellite & roadmap view URL
  const staticMapUrl = getStaticMapUrl({
    latitude: mapCenterLat,
    longitude: mapCenterLng,
    zoom: coordinates ? 12 : 11,
    width: 600,
    height: 240,
    scale: 2,
    includeMarker: false, // Custom animated pin rendered on top
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-city-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F2340]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[540px] bg-white rounded-[24px] border border-[#dce2ea] shadow-floating z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#dce2ea] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-[#e8f5fd] text-[#1C3A66] flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="add-city-title"
                className="text-title text-[#0F2340] font-sans font-bold leading-tight"
              >
                Add a city
              </h2>
              <p className="text-body-s text-[#55647A] leading-tight mt-0.5">
                Expand the Bruvi network with a new city location
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[10px] text-[#7F8CA0] hover:text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* City Autocomplete Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-label text-[#0F2340] font-bold">
                City name <span className="text-[#C0352B]">*</span>
              </label>
              {coordinates && (
                <span className="text-[11px] font-semibold text-[#1B6D24] flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Location selected</span>
                </span>
              )}
            </div>

            <PlaceAutocompleteInput
              value={cityName}
              onChange={(val) => {
                setCityName(val);
                setCityCode(val.trim().substring(0, 3).toUpperCase());
                if (error) setError("");
              }}
              onPlaceSelect={handlePlaceSelect}
              placeholder="Search or enter city name (e.g. Pune, Mumbai, Hyderabad)..."
              error={error}
              autoFocus
            />
          </div>

          {/* Original Map View with Animated Pin */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-caption font-bold text-[#55647A] uppercase tracking-wider">
                City location
              </span>
              <span className="text-[11px] text-[#55647A] font-medium">
                {cityName.trim()
                  ? `${cityName.trim()}, ${stateName}`
                  : "Search a city above"}
              </span>
            </div>

            {/* Original Map Container */}
            <div className="w-full h-[185px] rounded-[16px] bg-[#f7f2e8] border border-[#dce2ea] relative overflow-hidden flex flex-col justify-between p-3 select-none shadow-2xs group">
              {/* Genuine Google Map View */}
              {!mapError && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={`${mapCenterLat}-${mapCenterLng}`}
                    src={staticMapUrl}
                    alt={`${cityName || "City"} map`}
                    onLoad={() => setMapLoaded(true)}
                    onError={() => setMapError(true)}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out",
                      mapLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                  />
                  {/* Subtle contrast scrim */}
                  <div className="absolute inset-0 bg-[#0F2340]/10 pointer-events-none" />
                </>
              )}

              {/* Animated Location Pin in the Center of Map */}
              <div
                key={pinAnimationKey}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              >
                <div className="relative flex flex-col items-center animate-in zoom-in-75 duration-300 ease-out">
                  {/* Pulsing Ripple Effect */}
                  <div className="absolute -inset-4 rounded-full bg-[#1C3A66]/20 animate-ping opacity-75 pointer-events-none" />

                  {/* Concentric Soft Ring */}
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1C3A66] bg-[#1C3A66]/15 flex items-center justify-center shadow-xs">
                    {/* Center Figma 225:87030 Location Pin */}
                    <div className="flex items-center justify-center -translate-y-1 transform transition-transform group-hover:scale-110">
                      <LocationPinIcon className="w-6 h-[30px] text-[#0F2340] drop-shadow-sm" />
                    </div>
                  </div>

                  {/* Smooth Floating Pill with City Name */}
                  <div className="mt-1.5 bg-[#1C3A66]/95 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-0.5 rounded-[6px] shadow-raised flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="w-3 h-3 text-[#A9D8F3]" />
                    <span>{cityName.trim() || "Select a city"}</span>
                  </div>
                </div>
              </div>

              {/* Top Left Status Badge */}
              <div className="relative z-20 self-start">
                <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-[8px] border border-[#dce2ea] text-[11px] font-semibold text-[#0F2340] shadow-2xs flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", coordinates ? "bg-[#1B6D24]" : "bg-[#7F8CA0]")} />
                  <span>
                    {cityName.trim() ? `${cityName.trim()} · Ready` : "Waiting for city"}
                  </span>
                </div>
              </div>

              {/* Bottom Right Network Badge */}
              <div className="relative z-20 self-end">
                <span className="bg-[#e8f5fd] text-[#1C3A66] text-[10px] font-bold px-2.5 py-1 rounded-[6px] border border-[#dce2ea] shadow-2xs flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>Bruvi Network</span>
                </span>
              </div>
            </div>

            <p className="text-[12px] text-[#55647A] leading-relaxed">
              New stores added in this city will automatically connect to local supply and delivery routes.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dce2ea]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors cursor-pointer shadow-2xs font-bold"
            >
              Add city
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
