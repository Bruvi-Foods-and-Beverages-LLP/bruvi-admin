"use client";

import * as React from "react";
import {
  X,
  Crosshair,
  Layers,
  Check,
  Loader2,
  Navigation,
  Search,
} from "lucide-react";
import { LocationPinIcon } from "@/components/icons";
import { loadGoogleMapsScript } from "@/lib/maps/google-maps-loader";
import { reverseGeocode, searchPlaces, getPlaceDetails } from "@/lib/maps/google-maps-client";
import { AutocompletePrediction, ParsedAddress } from "@/types/maps";
import { cn } from "@/lib/utils/cn";

export interface LocationPickerResult {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface InteractiveLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: LocationPickerResult) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialAddress?: string;
  initialRadius?: number;
  cityName?: string;
}

export function InteractiveLocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLatitude = 18.5481,
  initialLongitude = 73.9030,
  initialAddress = "",
  initialRadius = 50,
  cityName,
}: InteractiveLocationPickerModalProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);
  const circleRef = React.useRef<any>(null);

  const [currentLat, setCurrentLat] = React.useState<number>(initialLatitude);
  const [currentLng, setCurrentLng] = React.useState<number>(initialLongitude);
  const [currentAddress, setCurrentAddress] = React.useState<string>(initialAddress);
  const [resolvedDetails, setResolvedDetails] = React.useState<ParsedAddress | null>(null);

  const [mapType, setMapType] = React.useState<"roadmap" | "hybrid">("roadmap");
  const [isScriptLoading, setIsScriptLoading] = React.useState(true);
  const [isReverseGeocoding, setIsReverseGeocoding] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchPredictions, setSearchPredictions] = React.useState<AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const lastUserTypedSearchRef = React.useRef<string>("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Sync state when modal opens or coordinates change
  React.useEffect(() => {
    if (isOpen) {
      const lat = typeof initialLatitude === "number" && !isNaN(initialLatitude) ? initialLatitude : 18.5481;
      const lng = typeof initialLongitude === "number" && !isNaN(initialLongitude) ? initialLongitude : 73.9030;
      setCurrentLat(lat);
      setCurrentLng(lng);
      setCurrentAddress(initialAddress || "");
      setResolvedDetails(null);
      setSearchQuery("");
      setSearchPredictions([]);
      setIsSearchOpen(false);
      lastUserTypedSearchRef.current = "";

      // Seamless continuity: If map instance is already live, pan immediately to the new coordinates
      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo({ lat, lng });
        mapInstanceRef.current.setZoom(17);
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        }
        if (circleRef.current) {
          circleRef.current.setCenter({ lat, lng });
        }
      }
    }
  }, [isOpen, initialLatitude, initialLongitude, initialAddress]);

  // Handle outside click for search dropdown inside modal
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle reverse geocoding when coordinates change
  const fetchAddressForCoordinates = React.useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const parsed = await reverseGeocode(lat, lng);
      if (parsed) {
        setResolvedDetails(parsed);
        if (parsed.formattedAddress) {
          setCurrentAddress(parsed.formattedAddress);
        }
      }
    } catch (err) {
      console.warn("Reverse geocoding error:", err);
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  // Initialize interactive Google Map
  React.useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isSubscribed = true;

    async function initMap() {
      setIsScriptLoading(true);
      try {
        const google = await loadGoogleMapsScript();
        if (!isSubscribed || !mapContainerRef.current) return;

        const targetLat = typeof initialLatitude === "number" && !isNaN(initialLatitude) ? initialLatitude : currentLat;
        const targetLng = typeof initialLongitude === "number" && !isNaN(initialLongitude) ? initialLongitude : currentLng;
        const centerPos = { lat: targetLat, lng: targetLng };

        // Create Map
        const map = new google.maps.Map(mapContainerRef.current, {
          center: centerPos,
          zoom: 17,
          mapTypeId: mapType === "hybrid" ? google.maps.MapTypeId.HYBRID : google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: true,
          scrollwheel: true,
          gestureHandling: "greedy",
          clickableIcons: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
          ],
        });
        mapInstanceRef.current = map;

        // Exact Bruvi Location Pin from Figma 225:87030
        const pinIcon = {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37258 18.6274 0 12 0ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" fill="#0F2340"/>
              </svg>
            `),
          scaledSize: new google.maps.Size(28, 35),
          anchor: new google.maps.Point(14, 35),
        };

        // Create Draggable Pin Marker
        const marker = new google.maps.Marker({
          position: centerPos,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          icon: pinIcon,
          title: "Drag to pinpoint exact store entrance",
        });
        markerRef.current = marker;

        // Create Geofence Circle Overlay
        const circle = new google.maps.Circle({
          strokeColor: "#1C3A66",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#1C3A66",
          fillOpacity: 0.12,
          map: map,
          center: centerPos,
          radius: initialRadius,
          clickable: false,
        });
        circleRef.current = circle;

        // Event: Click on map to move marker
        map.addListener("click", (e: any) => {
          if (!e.latLng) return;
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();

          marker.setPosition({ lat: newLat, lng: newLng });
          circle.setCenter({ lat: newLat, lng: newLng });
          setCurrentLat(newLat);
          setCurrentLng(newLng);
          fetchAddressForCoordinates(newLat, newLng);
        });

        // Event: Drag marker
        marker.addListener("drag", (e: any) => {
          if (e.latLng) {
            circle.setCenter(e.latLng);
          }
        });

        marker.addListener("dragend", (e: any) => {
          if (!e.latLng) return;
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();

          setCurrentLat(newLat);
          setCurrentLng(newLng);
          circle.setCenter({ lat: newLat, lng: newLng });
          fetchAddressForCoordinates(newLat, newLng);
        });

        // Fetch initial address if not already provided
        if (!initialAddress) {
          fetchAddressForCoordinates(targetLat, targetLng);
        }
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
  }, [isOpen]);

  // Handle map type toggle
  const toggleMapType = () => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const nextType = mapType === "roadmap" ? "hybrid" : "roadmap";
    setMapType(nextType);
    mapInstanceRef.current.setMapTypeId(
      nextType === "hybrid"
        ? window.google.maps.MapTypeId.HYBRID
        : window.google.maps.MapTypeId.ROADMAP
    );
  };

  // Recenter map on marker
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo({ lat: currentLat, lng: currentLng });
    mapInstanceRef.current.setZoom(17);
  };

  // Use Browser GPS Location
  const handleUseCurrentLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setCurrentLat(newLat);
          setCurrentLng(newLng);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo({ lat: newLat, lng: newLng });
            mapInstanceRef.current.setZoom(18);
          }
          if (markerRef.current) {
            markerRef.current.setPosition({ lat: newLat, lng: newLng });
          }
          if (circleRef.current) {
            circleRef.current.setCenter({ lat: newLat, lng: newLng });
          }
          fetchAddressForCoordinates(newLat, newLng);
        },
        (err) => {
          console.warn("Geolocation access denied or timed out:", err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  // Debounced search inside modal - ONLY triggers when actively typed by user
  React.useEffect(() => {
    if (!lastUserTypedSearchRef.current || searchQuery !== lastUserTypedSearchRef.current) {
      setSearchPredictions([]);
      setIsSearchOpen(false);
      return;
    }

    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchPredictions([]);
      setIsSearchOpen(false);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (searchQuery !== lastUserTypedSearchRef.current) {
        return;
      }

      setIsSearching(true);
      try {
        const predictions = await searchPlaces(trimmed, {
          latitude: currentLat,
          longitude: currentLng,
        });

        if (searchQuery === lastUserTypedSearchRef.current) {
          setSearchPredictions(predictions);
          setIsSearchOpen(predictions.length > 0);
        }
      } catch (err) {
        console.warn("Map modal place search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, currentLat, currentLng]);

  // Handle selection from modal search
  const handleSelectPrediction = async (prediction: AutocompletePrediction) => {
    // 1. Immediately dismiss dropdown entirely and prevent reopening
    setIsSearchOpen(false);
    setSearchPredictions([]);
    lastUserTypedSearchRef.current = "";
    searchInputRef.current?.blur();

    setIsSearching(true);
    setSearchQuery(prediction.mainText || prediction.description);

    try {
      const details = await getPlaceDetails(prediction.placeId);
      if (details) {
        const newLat = details.latitude;
        const newLng = details.longitude;
        setCurrentLat(newLat);
        setCurrentLng(newLng);
        setCurrentAddress(details.formattedAddress);
        setResolvedDetails(details);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({ lat: newLat, lng: newLng });
          mapInstanceRef.current.setZoom(18);
        }
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: newLat, lng: newLng });
        }
        if (circleRef.current) {
          circleRef.current.setCenter({ lat: newLat, lng: newLng });
        }
      }
    } catch (err) {
      console.warn("Failed to get prediction details:", err);
    } finally {
      setIsSearching(false);
      setIsSearchOpen(false);
      setSearchPredictions([]);
    }
  };

  const handleConfirm = () => {
    onConfirm({
      address: currentAddress,
      latitude: Number(currentLat.toFixed(6)),
      longitude: Number(currentLng.toFixed(6)),
      city: resolvedDetails?.city || cityName,
      state: resolvedDetails?.state,
      postalCode: resolvedDetails?.pincode,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F2340]/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[880px] bg-white rounded-[24px] border border-[#dce2ea] shadow-floating z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#dce2ea] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-[#e8f5fd] text-[#0F2340] flex items-center justify-center shrink-0 shadow-2xs">
              <LocationPinIcon className="h-5 w-5 text-[#0F2340]" />
            </div>
            <div>
              <h2
                id="location-picker-title"
                className="text-title text-[#0F2340] font-sans font-bold leading-tight"
              >
                Pinpoint exact store location
              </h2>
              <p className="text-body-s text-[#55647A] leading-tight mt-0.5">
                Click anywhere on the map or drag the pin to set the exact pickup and storefront coordinates.
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

        {/* Modal Controls Toolbar */}
        <div className="px-6 py-2.5 bg-[#fcfdfe] border-b border-[#dce2ea] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Autocomplete Search input inside modal */}
          <div ref={searchContainerRef} className="relative flex-1 w-full">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#7F8CA0] absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  lastUserTypedSearchRef.current = e.target.value;
                  setSearchQuery(e.target.value);
                }}
                onFocus={() => {
                  if (searchPredictions.length > 0 && lastUserTypedSearchRef.current) {
                    setIsSearchOpen(true);
                  }
                }}
                placeholder="Search area, landmark or street to fly on map..."
                className="w-full h-9 pl-9 pr-8 text-xs font-medium text-[#0F2340] placeholder:text-[#7F8CA0] bg-white rounded-[10px] border border-[#bcc6d3] focus:border-2 focus:border-[#1C3A66] outline-none transition-all"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 text-[#1C3A66] animate-spin absolute right-2.5" />
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isSearchOpen && searchPredictions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#dce2ea] shadow-floating p-1 z-50 max-h-48 overflow-y-auto custom-scrollbar">
                {searchPredictions.map((pred) => (
                  <button
                    key={pred.placeId}
                    type="button"
                    onClick={() => handleSelectPrediction(pred)}
                    className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-[#f5f7fa] flex items-center gap-2 transition-colors cursor-pointer text-xs"
                  >
                    <LocationPinIcon className="w-3.5 h-3.5 text-[#0F2340] shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="font-bold text-[#0F2340] truncate">
                        {pred.mainText}
                      </span>
                      {pred.secondaryText && (
                        <span className="text-[11px] text-[#55647A] truncate">
                          {pred.secondaryText}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions (Satellite toggle, GPS, Recenter) */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={toggleMapType}
              className={cn(
                "h-8 px-2.5 rounded-[8px] border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                mapType === "hybrid"
                  ? "bg-[#1C3A66] text-white border-[#1C3A66]"
                  : "bg-white text-[#0F2340] border-[#bcc6d3] hover:bg-[#f5f7fa]"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mapType === "hybrid" ? "Satellite" : "Roadmap"}</span>
            </button>

            <button
              type="button"
              onClick={handleRecenter}
              title="Center on pin"
              className="h-8 px-2.5 rounded-[8px] border border-[#bcc6d3] bg-white text-[#0F2340] hover:bg-[#f5f7fa] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#1C3A66]" />
              <span>Recenter</span>
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              title="Use my current GPS position"
              className="h-8 px-2.5 rounded-[8px] border border-[#bcc6d3] bg-white text-[#0F2340] hover:bg-[#f5f7fa] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#1C3A66]" />
              <span className="hidden sm:inline">GPS</span>
            </button>
          </div>
        </div>

        {/* Interactive Map Canvas */}
        <div className="relative w-full h-[380px] sm:h-[420px] bg-[#f7f2e8] overflow-hidden select-none">
          {/* Real Map Container */}
          <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

          {/* Script Loading Overlay */}
          {isScriptLoading && (
            <div className="absolute inset-0 bg-[#f7f2e8]/90 backdrop-blur-2xs flex flex-col items-center justify-center gap-2 z-20">
              <Loader2 className="w-7 h-7 text-[#1C3A66] animate-spin" />
              <span className="text-xs font-bold text-[#0F2340]">
                Loading Interactive Google Maps Canvas...
              </span>
            </div>
          )}

          {/* Floating Coordinate Pill on Map */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-[8px] border border-[#dce2ea] shadow-raised flex items-center gap-2 text-xs font-mono font-bold text-[#0F2340]">
              <span className="h-2 w-2 rounded-full bg-[#1B6D24] animate-pulse" />
              <span>
                {currentLat.toFixed(6)}° N, {currentLng.toFixed(6)}° E
              </span>
              <span className="text-[10px] text-[#55647A] font-sans font-medium border-l border-[#dce2ea] pl-1.5">
                Radius {initialRadius}m
              </span>
            </div>
          </div>

          {/* Click instruction banner at top center */}
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <div className="bg-[#1C3A66]/90 backdrop-blur-xs text-white px-3 py-1 rounded-[6px] text-[11px] font-semibold shadow-2xs flex items-center gap-1.5">
              <span>🎯 Click or drag pin to position</span>
            </div>
          </div>
        </div>

        {/* Reverse Geocoded Address Bar */}
        <div className="px-6 py-3.5 bg-white border-t border-[#dce2ea] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="p-1 rounded-full bg-[#e8f5fd] text-[#1C3A66] mt-0.5 shrink-0">
              {isReverseGeocoding ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1C3A66]" />
              ) : (
                <LocationPinIcon className="w-4 h-4 text-[#0F2340]" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0F2340] truncate leading-tight">
                {currentAddress || "Locating address..."}
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#55647A]">
                <span>
                  {resolvedDetails?.city || cityName || "Selected Location"}
                  {resolvedDetails?.state ? `, ${resolvedDetails.state}` : ""}
                </span>
                {resolvedDetails?.pincode && (
                  <>
                    <span>·</span>
                    <span className="font-mono font-medium">PIN {resolvedDetails.pincode}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-[12px] border border-[#bcc6d3] text-label text-[#0F2340] hover:bg-[#f5f7fa] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="h-9 px-5 rounded-[12px] bg-[#1C3A66] hover:bg-[#0F2340] text-label text-white transition-colors cursor-pointer shadow-2xs font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

